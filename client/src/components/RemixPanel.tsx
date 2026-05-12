import { X } from 'lucide-react';

interface RemixPanelProps {
  soundName: string;
  soundColor: string;
  settings: {
    pitch: number;
    speed: number;
    reverb: number;
    delay: number;
    loop: boolean;
    volume: number;
  };
  onUpdate: (key: string, value: number | boolean) => void;
  onClose: () => void;
}

/**
 * Y2K Remix Panel Component
 * 
 * Design Philosophy:
 * - Slide-up animation from bottom
 * - Per-sound effect controls
 * - Pitch shift, speed, reverb, delay, loop toggle
 * - Clean, organized layout
 */
export default function RemixPanel({
  soundName,
  soundColor,
  settings,
  onUpdate,
  onClose,
}: RemixPanelProps) {
  return (
    <div className="slide-up neon-container">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3
            className="text-xl font-black uppercase tracking-widest"
            style={{
              color: soundColor,
              textShadow: `0 0 10px ${soundColor}`,
            }}
          >
            {soundName}
          </h3>
          <button
            onClick={(): void => onClose()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            style={{
              color: soundColor,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pitch Control */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Pitch Shift: {settings.pitch > 0 ? '+' : ''}{settings.pitch} semitones
            </label>
            <input
              type="range"
              min="-12"
              max="12"
              value={settings.pitch}
              onChange={(e) => onUpdate('pitch', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-magenta-300">
              Speed: {settings.speed.toFixed(2)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.speed}
              onChange={(e) => onUpdate('speed', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Reverb Control */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-yellow-300">
              Reverb: {Math.round(settings.reverb * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.reverb}
              onChange={(e) => onUpdate('reverb', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Delay Control */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-lime-300">
              Delay: {Math.round(settings.delay * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.delay}
              onChange={(e) => onUpdate('delay', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-pink-300">
              Volume: {Math.round(settings.volume)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={settings.volume}
              onChange={(e) => onUpdate('volume', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Loop Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-orange-300">
              Loop Mode
            </label>
            <button
              onClick={(): void => onUpdate('loop', !settings.loop)}
              className={`
                px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider
                transition-all duration-200
                ${
                  settings.loop
                    ? 'bg-orange-500/30 border-orange-500'
                    : 'bg-transparent border-orange-500/50'
                }
              `}
              style={{
                color: '#ff6600',
                borderWidth: '2px',
                boxShadow: settings.loop
                  ? '0 0 20px #ff6600'
                  : '0 0 10px #ff660080',
              }}
            >
              {settings.loop ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-center opacity-60 pt-2 border-t border-cyan-500/20">
          <p>Adjust effects in real-time while sound is playing</p>
        </div>
      </div>
    </div>
  );
}
