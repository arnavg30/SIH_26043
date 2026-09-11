// Capture raw microphone samples; outputs stay silent to prevent feedback.
class VoiceRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(4096);
    this.offset = 0;
    this.stopped = false;
    this.port.onmessage = ({ data }) => {
      if (data === "stop" && !this.stopped) {
        this.stopped = true;
        this.flush();
        this.port.postMessage({ type: "stopped" });
      }
    };
  }
  flush() {
    if (!this.offset) return;
    const samples = this.buffer.slice(0, this.offset);
    this.port.postMessage({ type: "samples", samples }, [samples.buffer]);
    this.offset = 0;
  }
  process(inputs) {
    const channels = inputs[0];
    if (!this.stopped && channels?.length) {
      for (let frame = 0; frame < channels[0].length; frame++) {
        let sample = 0;
        for (const channel of channels) sample += channel[frame] / channels.length;
        this.buffer[this.offset++] = sample;
        if (this.offset === this.buffer.length) this.flush();
      }
    }
    return true;
  }
}
registerProcessor("voice-recorder", VoiceRecorderProcessor);
