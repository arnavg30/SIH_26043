import { useEffect, useRef, useState } from "react";
import { encodeRecordedAudio } from "../utils/recordedAudio";

type Status = "idle" | "requesting" | "recording" | "processing";
type Session = {
  context: AudioContext;
  stream?: MediaStream;
  source?: MediaStreamAudioSourceNode;
  processor?: AudioWorkletNode;
  timer?: ReturnType<typeof setInterval>;
  stopTimeout?: ReturnType<typeof setTimeout>;
  stopping: boolean;
};

function release(session: Session) {
  clearInterval(session.timer);
  clearTimeout(session.stopTimeout);
  session.stream?.getTracks().forEach(track => track.stop());
  session.source?.disconnect();
  if (session.processor) {
    session.processor.port.onmessage = null;
    session.processor.onprocessorerror = null;
    session.processor.disconnect();
    session.processor.port.close();
  }
  if (session.context.state !== "closed") void session.context.close().catch(() => {});
}

export default function useVoiceRecording(onRecorded: (file: File, duration: number) => void) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);
  const sessionRef = useRef<Session | null>(null);
  const busyRef = useRef(false);
  const generationRef = useRef(0);
  const onRecordedRef = useRef(onRecorded);
  useEffect(() => { onRecordedRef.current = onRecorded; }, [onRecorded]);

  const stop = () => {
    const session = sessionRef.current;
    if (!session?.processor || session.stopping) return;
    session.stopping = true;
    clearInterval(session.timer);
    setStatus("processing");
    // The acknowledgement follows all sample messages, including the last partial block.
    session.processor.port.postMessage("stop");
    session.stream?.getTracks().forEach(track => track.stop());
    session.stopTimeout = setTimeout(() => {
      release(session);
      if (sessionRef.current !== session) return;
      sessionRef.current = null;
      busyRef.current = false;
      setStatus("idle");
      setError("Recording was interrupted. Please record again.");
    }, 5000);
  };

  const start = async () => {
    if (busyRef.current) return;
    setError("");
    if (!window.isSecureContext) {
      setError("Open this page on HTTPS or localhost to enable microphone access.");
      return;
    }
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!navigator.mediaDevices?.getUserMedia || !AudioContextClass || typeof AudioWorkletNode === "undefined") {
      setError("This browser cannot record audio. Please use a current browser with microphone support.");
      return;
    }
    busyRef.current = true;
    const generation = ++generationRef.current;
    setStatus("requesting");
    let session: Session | undefined;
    try {
      // Resume during the click gesture, before waiting for microphone permission.
      const context = new AudioContextClass({ sampleRate: 48000 });
      session = { context, stopping: false };
      sessionRef.current = session;
      void context.resume().catch(() => {});
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false });
      session.stream = stream;
      if (generation !== generationRef.current) { release(session); return; }
      await context.audioWorklet.addModule(new URL("../audio/voice-recorder-worklet.js", import.meta.url).href);
      if (generation !== generationRef.current) { release(session); return; }
      if (context.state !== "running") throw new Error("Audio input is suspended");
      const activeSession = session;
      const chunks: Float32Array[] = [];
      const processor = new AudioWorkletNode(context, "voice-recorder");
      session.processor = processor;
      processor.onprocessorerror = () => {
        release(activeSession);
        if (generation !== generationRef.current) return;
        sessionRef.current = null;
        busyRef.current = false;
        setStatus("idle");
        setError("The microphone recording was interrupted. Please try again.");
      };
      processor.port.onmessage = ({ data }) => {
        if (generation !== generationRef.current) return;
        if (data.type === "samples") { chunks.push(data.samples); return; }
        if (data.type !== "stopped") return;
        release(activeSession);
        try {
          const { blob, duration } = encodeRecordedAudio(chunks, context.sampleRate);
          onRecordedRef.current(new File([blob], `voice-problem-${Date.now()}.wav`, { type: "audio/wav" }), Math.max(1, Math.round(duration)));
          setSeconds(Math.round(duration));
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Could not prepare the recording. Please try again.");
        } finally {
          sessionRef.current = null;
          busyRef.current = false;
          setStatus("idle");
        }
      };
      session.source = context.createMediaStreamSource(stream);
      session.source.connect(processor);
      processor.connect(context.destination);
      const startedAt = performance.now();
      setSeconds(0);
      setStatus("recording");
      session.timer = setInterval(() => {
        setSeconds(Math.floor((performance.now() - startedAt) / 1000));
        if (performance.now() - startedAt >= 300000) stop();
      }, 250);
    } catch (caught) {
      if (session) release(session);
      if (generation !== generationRef.current) return;
      setError(caught instanceof DOMException && caught.name === "NotAllowedError"
        ? "Microphone access was denied. Allow the microphone for this site, then try again."
        : "Could not start audio recording. Check your microphone and try again.");
      sessionRef.current = null;
      busyRef.current = false;
      setStatus("idle");
    }
  };

  useEffect(() => () => {
    generationRef.current += 1;
    if (sessionRef.current) release(sessionRef.current);
    sessionRef.current = null;
    busyRef.current = false;
  }, []);

  return { status, error, seconds, start, stop, busy: status !== "idle" };
}
