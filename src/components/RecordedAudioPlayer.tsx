import { useEffect, useRef, useState } from "react";

export default function RecordedAudioPlayer({
  file,
  compact = false,
}: {
  file: File;
  compact?: boolean;
}) {
  const playerRef = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const url = URL.createObjectURL(file);
    setError("");
    setReady(false);
    player.src = url;
    player.load();
    return () => {
      player.pause();
      player.removeAttribute("src");
      player.load();
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (compact) {
    return (
      <div className="w-full">
        <audio
          ref={playerRef}
          controls
          preload="auto"
          aria-label="Recorded audio"
          className="w-full h-8"
          style={{ maxHeight: "32px" }}
          onCanPlay={() => setReady(true)}
          onError={() => {
            setReady(false);
            setError("Could not play audio.");
          }}
        />
        {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <audio
        ref={playerRef}
        controls
        preload="auto"
        aria-label="Recorded problem audio"
        className="w-full max-w-md mx-auto"
        onCanPlay={() => setReady(true)}
        onError={() => {
          setReady(false);
          setError("This recording could not be played. Please record again.");
        }}
      />
      <p role="status" className="text-xs mt-2" style={{ color: error ? "var(--error)" : "var(--text-muted)" }}>
        {error || (ready
          ? "Recording ready. Press Play to listen. It will upload when you submit the report."
          : "Loading recording for playback…")}
      </p>
    </div>
  );
}
