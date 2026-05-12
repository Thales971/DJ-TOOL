import { useState, useRef } from 'react';
import { Volume2, Upload, Mic, MicOff, Music } from 'lucide-react';

interface MixerProps {
  masterVolume: number;
  onVolumeChange: (volume: number) => void;
  isPlaying: boolean;
  isRecording: boolean;
  onToggleMix: () => void;
  onToggleRecording: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Y2K Mixer Component
 * 
 * Design Philosophy:
 * - Master volume control with neon slider
 * - Mix transport controls (Start/Stop)
 * - Recording functionality
 * - Sound upload button
 */
export default function Mixer({
  masterVolume,
  onVolumeChange,
  isPlaying,
  isRecording,
  onToggleMix,
  onToggleRecording,
  onUpload,
}: MixerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  // Track recording time
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleRecordingToggle = (): void => {
    onToggleRecording();

    if (!isRecording) {
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="neon-container">
      <div className="space-y-6">
        {/* Title */}
        <h2
          className="text-2xl font-black uppercase text-center tracking-widest"
          style={{
            color: '#00ffff',
            textShadow: '0 0 10px #00ffff',
          }}
        >
          ★ MIXER ★
        </h2>

        {/* Master Volume */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-cyan-300">
              <Volume2 size={18} />
              Master Volume
            </label>
            <span className="text-lg font-black text-cyan-300">{masterVolume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Transport Controls */}
        <div className="grid grid-cols-2 gap-3">
          {/* Start Mix Button */}
          <button
            onClick={onToggleMix}
            className="btn-neon"
            style={{
              color: isPlaying ? '#ff00ff' : '#00ffff',
              borderColor: isPlaying ? '#ff00ff80' : '#00ffff80',
              boxShadow: `
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                0 0 20px ${isPlaying ? '#ff00ff80' : '#00ffff80'}
              `,
            }}
          >
            <Music size={18} className="mx-auto" />
            <div className="text-xs font-bold uppercase">
              {isPlaying ? 'Stop Mix' : 'Start Mix'}
            </div>
          </button>

          {/* Recording Button */}
          <button
            onClick={handleRecordingToggle}
            className="btn-neon relative"
            style={{
              color: isRecording ? '#ff0033' : '#ffff00',
              borderColor: isRecording ? '#ff003380' : '#ffff0080',
              boxShadow: `
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                0 0 20px ${isRecording ? '#ff003380' : '#ffff0080'}
              `,
            }}
          >
            {isRecording ? (
              <Mic size={18} className="mx-auto animate-pulse" />
            ) : (
              <MicOff size={18} className="mx-auto" />
            )}
            <div className="text-xs font-bold uppercase">
              {isRecording ? 'Recording' : 'Record'}
            </div>
            {isRecording && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {formatTime(recordingTime)}
              </div>
            )}
          </button>
        </div>

        {/* Upload Sound Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/mp3,audio/wav,audio/mpeg"
            onChange={onUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-neon w-full"
            style={{
              color: '#39ff14',
              borderColor: '#39ff1480',
              boxShadow: `
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                0 0 20px #39ff1480
              `,
            }}
          >
            <Upload size={20} className="mx-auto" />
            <div className="text-sm font-bold uppercase">Upload Sound</div>
          </button>
        </div>

        {/* Info Footer */}
        <div className="text-center text-xs opacity-60 pt-4 border-t border-cyan-500/20">
          <p>💾 Click pads to play • 🎙️ Right-click to load decks</p>
          <p className="mt-1">⌨️ Press 1-9 or QWERTY to trigger pads</p>
        </div>
      </div>
    </div>
  );
}
