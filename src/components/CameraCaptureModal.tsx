import React, { useState, useEffect, useRef } from "react";
import { Camera, X, RefreshCw, Check, AlertCircle, SwitchCamera } from "lucide-react";

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  onFallbackFileInput?: () => void;
}

export default function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
  onFallbackFileInput,
}: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async (mode: "user" | "environment") => {
    stopStream();
    setCameraError(null);
    setIsLoading(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported on this browser or device.");
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn("Camera start initial warning:", err);
      // Try fallback to any available video stream without strict facingMode
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          await videoRef.current.play();
        }
      } catch (fallbackErr: any) {
        const message =
          fallbackErr.name === "NotAllowedError" || fallbackErr.name === "PermissionDeniedError"
            ? "Camera permission was denied. Please allow camera access in browser settings or use device file upload."
            : fallbackErr.name === "NotFoundError" || fallbackErr.name === "DevicesNotFoundError"
            ? "No camera device was detected on this system."
            : "Unable to access the camera. You can capture or upload photos using device files.";
        setCameraError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !capturedPreview) {
      void startCamera(facingMode);
    } else if (!isOpen) {
      stopStream();
      setCapturedPreview(null);
      setCapturedFile(null);
      setCameraError(null);
    }

    return () => {
      stopStream();
    };
  }, [isOpen, facingMode]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const fileName = `camera_photo_${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: "image/jpeg" });
        const previewUrl = URL.createObjectURL(blob);

        setCapturedFile(file);
        setCapturedPreview(previewUrl);
        stopStream();
      },
      "image/jpeg",
      0.92
    );
  };

  const handleConfirm = () => {
    if (capturedFile) {
      onCapture(capturedFile);
      handleClose();
    }
  };

  const handleRetake = () => {
    if (capturedPreview) {
      URL.revokeObjectURL(capturedPreview);
    }
    setCapturedPreview(null);
    setCapturedFile(null);
    void startCamera(facingMode);
  };

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const handleClose = () => {
    stopStream();
    if (capturedPreview) {
      URL.revokeObjectURL(capturedPreview);
    }
    setCapturedPreview(null);
    setCapturedFile(null);
    setCameraError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950/80 border-b border-slate-800 z-10">
          <div className="flex items-center gap-2 text-white">
            <Camera size={18} className="text-amber-400" />
            <h3 className="font-bold text-sm">
              {capturedPreview ? "Photo Preview" : "Take Live Photo"}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewfinder / Preview Container */}
        <div className="relative bg-black flex-1 min-h-[300px] sm:min-h-[380px] flex items-center justify-center overflow-hidden">
          {capturedPreview ? (
            <img
              src={capturedPreview}
              alt="Captured preview"
              className="w-full h-full object-contain max-h-[60vh]"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover max-h-[60vh] ${
                  facingMode === "user" ? "-scale-x-100" : ""
                }`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white gap-2">
                  <RefreshCw size={28} className="animate-spin text-amber-400" />
                  <span className="text-xs font-medium">Starting camera…</span>
                </div>
              )}

              {/* Viewfinder Overlay Guide */}
              {!isLoading && !cameraError && (
                <div className="absolute inset-4 pointer-events-none border border-white/20 rounded-2xl flex flex-col justify-between p-3">
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-t-2 border-l-2 border-amber-400 rounded-tl" />
                    <div className="w-5 h-5 border-t-2 border-r-2 border-amber-400 rounded-tr" />
                  </div>
                  <div className="text-center">
                    <span className="bg-black/50 text-white/80 text-[11px] px-3 py-1 rounded-full backdrop-blur-sm">
                      Align problem area in frame
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-b-2 border-l-2 border-amber-400 rounded-bl" />
                    <div className="w-5 h-5 border-b-2 border-r-2 border-amber-400 rounded-br" />
                  </div>
                </div>
              )}

              {/* Camera Error State */}
              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                    <AlertCircle size={26} />
                  </div>
                  <p className="text-xs max-w-xs text-slate-300">{cameraError}</p>
                  {onFallbackFileInput && (
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        onFallbackFileInput();
                      }}
                      className="mt-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera size={15} />
                      <span>Use Device Camera / Upload</span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Controls */}
        <div className="px-5 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          {capturedPreview ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Retake</span>
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Check size={16} />
                <span>Attach Photo</span>
              </button>
            </>
          ) : (
            <>
              {/* Camera Switch button */}
              <button
                type="button"
                onClick={handleSwitchCamera}
                disabled={isLoading || !!cameraError}
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer active:rotate-180"
                title="Switch Camera (Front/Back)"
              >
                <SwitchCamera size={20} />
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleCapture}
                disabled={isLoading || !!cameraError}
                className="w-16 h-16 rounded-full border-4 border-white bg-amber-500 hover:bg-amber-400 disabled:opacity-40 flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
                title="Capture Photo"
              >
                <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                  <Camera size={24} className="text-slate-950" />
                </div>
              </button>

              {/* Fallback upload button */}
              {onFallbackFileInput ? (
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onFallbackFileInput();
                  }}
                  className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer text-[10px] font-semibold"
                  title="Choose from Gallery / Files"
                >
                  Files
                </button>
              ) : (
                <div className="w-11" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
