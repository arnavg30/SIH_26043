import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'vite';

// Isolated headless browser: synthetic microphone only, no account or database writes.
console.log('Starting isolated Vite test server');
const server = await createServer({
  server: { host: '127.0.0.1', port: 0, strictPort: false }, logLevel: 'error',
});
await server.listen();
const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
console.log('Test origin', origin);
const profile = await mkdtemp(join(tmpdir(), 'navjhar-voice-test-'));
const browser = spawn(process.env.VOICE_TEST_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--use-fake-ui-for-media-stream',
  '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required', 'about:blank',
], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Browser startup timed out')), 15000);
    browser.on('error', reject);
    browser.stderr.on('data', data => {
      const match = String(data).match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
  });
  socket = new WebSocket(endpoint);
  console.log('Browser connected');
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const result = JSON.parse(event.data);
    if (result.method === 'Runtime.exceptionThrown') console.log('Browser error', JSON.stringify(result.params.exceptionDetails));
    if (pending.has(result.id)) {
      const { resolve, reject, timer } = pending.get(result.id);
      clearTimeout(timer); pending.delete(result.id);
      result.error ? reject(new Error(JSON.stringify(result.error))) : resolve(result.result);
    }
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const requestId = ++id;
    const timer = setTimeout(() => reject(new Error(`Timed out: ${method}`)), 45000);
    pending.set(requestId, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: requestId, method, params, sessionId }));
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Runtime.enable', {}, sessionId);
  await send('Page.enable', {}, sessionId);
  await send('Page.navigate', { url: origin }, sessionId);
  await new Promise(resolve => setTimeout(resolve, 2500));
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true }, sessionId);
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  assert.equal(await evaluate(`new Promise(resolve => {let attempts=0; const t = setInterval(() => { if(document.getElementById('root')?.children.length || attempts++ > 100) {clearInterval(t);resolve(!!document.getElementById('root')?.children.length)} },100) })`),true,'App loads');
  // Navigate the real app in this isolated test without creating an authenticated account.
  await evaluate(`(() => {
    const root = document.getElementById('root');
    const container = root[Object.keys(root).find(k => k.startsWith('__reactContainer'))];
    function find(node) { if (!node) return null; if(node.type?.name === 'App') return node; return find(node.child) || find(node.sibling); }
    const app = find(container.stateNode.current);
    let hook = app.memoizedState; const hooks=[]; while(hook){hooks.push(hook);hook=hook.next;}
    hooks[2].queue.dispatch('report-step1'); hooks[5].queue.dispatch(false); hooks[6].queue.dispatch(false); hooks[8].queue.dispatch(false);
    window.__voiceTestApp = () => find(container.stateNode.current);
  })()`);
  await new Promise(resolve => setTimeout(resolve, 500));
  const durationMs = Number(process.env.VOICE_TEST_MS || 3000);
  await evaluate(`(() => {
    // Reproduce the user's unavailable decoder. Recording must work without it.
    AudioContext.prototype.decodeAudioData = async () => { throw new DOMException('Unable to decode audio data', 'EncodingError'); };
    window.MediaRecorder = class { constructor(){throw new Error('Compressed recorder must not be used')} };
    window.__testTracks=[]; window.__getUserMediaCalls=0;
    const original=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia=async options=>{
      window.__getUserMediaCalls++;
      const stream=await original(options);
      window.__testTracks.push(...stream.getTracks());return stream;
    };
  })()`);
  for (let take = 1; take <= 2; take++) {
    await evaluate(`(() => {const b=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Speak the Problem'));b.click();${process.env.VOICE_TEST_DOUBLE ? 'b.click();' : ''}})()`);
    await new Promise(resolve => setTimeout(resolve, durationMs));
    await evaluate(`(() => { const b=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Stop & Save'));if(!b)throw new Error('No stop button');b.click();})()`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const result = await evaluate(`(async () => {
      const player=document.querySelector('audio');
      if(!player) return {error:'No audio player', text:document.body.innerText.slice(-1000)};
      let hook=window.__voiceTestApp().memoizedState;for(let i=0;i<4;i++)hook=hook.next;
      const file=hook.memoizedState.files.find(f=>f.type.startsWith('audio/'));
      let fetchError=null;try{await fetch(player.src)}catch(e){fetchError=e.message}
      let playError=null;try{await player.play()}catch(e){playError=e.message}
      await new Promise(r=>setTimeout(r,400));player.pause();
      const pcm = new DataView(await file.arrayBuffer());let peak=0;
      for(let i=44;i<pcm.byteLength-1;i+=2)peak=Math.max(peak,Math.abs(pcm.getInt16(i,true)));
      const form=new FormData();form.append('media',file);form.append('voiceDurationSeconds',String(hook.memoizedState.audioDurationSeconds));
      const roundtrip=await new Response(form).formData();const uploaded=roundtrip.get('media');
      return {duration:player.duration,time:player.currentTime,error:player.error?.message,fetchError,playError,type:file?.type,bytes:file?.size,peak,liveTracks:window.__testTracks.filter(t=>t.readyState==='live').length,calls:window.__getUserMediaCalls,uploadBytes:uploaded.size,uploadDuration:Number(roundtrip.get('voiceDurationSeconds'))};
    })()`);
    console.log('take', take, result);
    {
      assert.ok(result.duration > durationMs / 1000 - 2 && result.duration < durationMs / 1000 + 2, 'Recording has expected duration');
      assert.ok(result.time > 0, 'Playback advances');
      assert.ok(!result.error && !result.playError && !result.fetchError, 'Audio is playable');
      assert.equal(result.liveTracks, 0, 'Microphone is released after stop');
      assert.equal(result.calls, take, 'One microphone request per recording even on double-click');
      assert.ok(result.peak > 0, 'Captured audio contains a signal');
      assert.equal(result.uploadBytes, result.bytes, 'Multipart upload preserves the recording');
      assert.ok(result.uploadDuration > 0, 'Upload contains duration');
    }
  }
  {
    await evaluate(`(() => {let h=window.__voiceTestApp().memoizedState;h=h.next.next;h.queue.dispatch('report-step2')})()`);
    await new Promise(resolve=>setTimeout(resolve,300));
    await evaluate(`(() => {let h=window.__voiceTestApp().memoizedState;h=h.next.next;h.queue.dispatch('report-step1')})()`);
    await new Promise(resolve=>setTimeout(resolve,500));
    const replay=await evaluate(`(async () => {const p=document.querySelector('audio');await p.play();await new Promise(r=>setTimeout(r,300));p.pause();return {duration:p.duration,time:p.currentTime,error:p.error?.message}})()`);
    assert.ok(replay.duration > 0 && replay.time > 0 && !replay.error,'Recording plays after navigating away and back');
    console.log('Return-to-screen playback', replay);
    const badAudio=await evaluate(`(async () => {const {encodeRecordedAudio}=await import('/src/utils/recordedAudio.ts');try{encodeRecordedAudio([],48000);return false}catch{return true}})()`);
    assert.equal(badAudio,true,'Invalid recording is rejected, not marked ready');
    await evaluate(`(() => {window.__originalTestMic=navigator.mediaDevices.getUserMedia;navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Denied','NotAllowedError')};[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Speak the Problem')).click()})()`);
    await new Promise(resolve=>setTimeout(resolve,300));
    assert.equal(await evaluate(`document.body.innerText.includes('Microphone access was denied')`),true,'Permission denial is visible');
    await evaluate(`(() => {navigator.mediaDevices.getUserMedia=async options=>{await new Promise(r=>setTimeout(r,600));return window.__originalTestMic(options)};[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Speak the Problem')).click();let h=window.__voiceTestApp().memoizedState;h=h.next.next;h.queue.dispatch('report-step2')})()`);
    await new Promise(resolve=>setTimeout(resolve,1200));
    assert.equal(await evaluate(`window.__testTracks.filter(t=>t.readyState==='live').length`),0,'Late microphone permission after navigation releases the stream');
    console.log('Invalid audio, denied permission and late-permission cleanup: PASS');
  }
  await send('Browser.close');
} finally {
  socket?.close();
  browser.kill();
  await server.close();
}
