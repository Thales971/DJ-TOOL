import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface DeckProps {
  label: string;
  sound?: { name: string; url: string } | null;
  isPlaying: boolean;
  onPlay: () => void;
  accentColor: string;
}

/**
 * Y2K Vinyl Deck Component
 * 
 * Design Philosophy:
 * - Rotating vinyl disc animation
 * - Waveform visualization
 * - Glossy retro DJ deck aesthetic
 */
export default function Deck({
  label,
  sound,
  isPlaying,
  onPlay,
  accentColor,
}: DeckProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);

  // Animate vinyl rotation
  useEffect(() => {
    let animationId: number;
    let currentRotation = 0;

    const animate = (): void => {
      if (isPlaying) {
        currentRotation += 2;
        setRotation(currentRotation % 360);
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = 'rgba(10, 10, 26, 0.5)';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Draw waveform
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const centerY = height / 2;

    ctx.beginPath();
    ctx.moveTo(0, centerY);

    for (let i = 0; i < width; i++) {
      const frequency = Math.sin((i + rotation) * 0.05) * 0.5 + 0.5;
      const amplitude = Math.sin((i + rotation) * 0.02) * (height * 0.3);
      const y = centerY + amplitude * frequency;

      ctx.lineTo(i, y);
    }

    ctx.stroke();

    // Draw center line
    ctx.strokeStyle = `${accentColor}40`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
  }, [rotation, accentColor]);

  return (
    <div className="neon-container">
      <div className="flex flex-col gap-4">
        {/* Label */}
        <div className="text-center">
          <h3
            className="text-xl sm:text-2xl font-black uppercase tracking-widest"
            style={{
              color: accentColor,
              textShadow: `0 0 10px ${accentColor}`,
            }}
          >
            {label}
          </h3>
          <p className="text-xs mt-1 opacity-60">
            {sound ? sound.name : 'No sound loaded'}
          </p>
        </div>

        {/* Vinyl Disc */}
        <div className="flex justify-center">
          <div
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full relative"
            style={{
              background: `radial-gradient(circle, ${accentColor}20 0%, ${accentColor}05 70%, transparent 100%)`,
              border: `3px solid ${accentColor}`,
              boxShadow: `
                0 0 30px ${accentColor}80,
                inset 0 0 20px ${accentColor}20,
                inset 0 2px 10px rgba(255, 255, 255, 0.2)
              `,
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.05s linear',
            }}
          >
            {/* Vinyl grooves */}
            <div
              className="absolute inset-4 rounded-full"
              style={{
                border: `1px solid ${accentColor}40`,
              }}
            />
            <div
              className="absolute inset-8 rounded-full"
              style={{
                border: `1px solid ${accentColor}30`,
              }}
            />

            {/* Center label */}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full"
              style={{
                background: `radial-gradient(circle, ${accentColor}40, ${accentColor}20)`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${accentColor}, ${accentColor}80)`,
                  boxShadow: `0 0 15px ${accentColor}`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Waveform */}
        <div className="waveform-container h-16 sm:h-20">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: 'block' }}
          />
        </div>

        {/* Play Button */}
        <button
          onClick={onPlay}
          disabled={!sound}
          className="btn-neon w-full flex items-center justify-center gap-2 disabled:opacity-50"
          style={{
            color: accentColor,
            borderColor: `${accentColor}80`,
            boxShadow: `
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              0 0 20px ${accentColor}80
            `,
          }}
        >
          {isPlaying ? (
            <>
              <Pause size={20} />
              PAUSE
            </>
          ) : (
            <>
              <Play size={20} />
              PLAY
            </>
          )}
        </button>
      </div>
    </div>
  );
}
