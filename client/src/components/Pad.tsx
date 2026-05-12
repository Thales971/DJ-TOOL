import { useState } from 'react';
import { Volume2 } from 'lucide-react';

interface PadProps {
  id: string | number;
  name: string;
  color: string;
  glowColor: string;
  isActive: boolean;
  onPlay: () => void;
  onSelect: () => void;
  isSelected: boolean;
  volume?: number;
  onLoadDeckA?: () => void;
  onLoadDeckB?: () => void;
}

/**
 * Y2K Neon Pad Component
 * 
 * Design Philosophy:
 * - Glossy button with inner shine and neon glow
 * - Scale animation on activation
 * - Color-coded with unique neon colors
 * - Touch and keyboard friendly
 */
export default function Pad({
  id,
  name,
  color,
  glowColor,
  isActive,
  onPlay,
  onSelect,
  isSelected,
  volume = 100,
  onLoadDeckA,
  onLoadDeckB,
}: PadProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (): void => {
    onPlay();
    onSelect();
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    // Right-click menu for deck loading
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = `${e.clientY}px`;
    menu.style.left = `${e.clientX}px`;
    menu.style.backgroundColor = 'rgba(10, 10, 26, 0.95)';
    menu.style.border = `2px solid ${glowColor}`;
    menu.style.borderRadius = '8px';
    menu.style.zIndex = '10000';
    menu.style.boxShadow = `0 0 20px ${glowColor}`;
    menu.style.minWidth = '150px';

    const deckABtn = document.createElement('button');
    deckABtn.textContent = 'Load Deck A';
    deckABtn.style.display = 'block';
    deckABtn.style.width = '100%';
    deckABtn.style.padding = '10px 15px';
    deckABtn.style.textAlign = 'left';
    deckABtn.style.color = '#00ffff';
    deckABtn.style.backgroundColor = 'transparent';
    deckABtn.style.border = 'none';
    deckABtn.style.cursor = 'pointer';
    deckABtn.style.fontSize = '12px';
    deckABtn.style.fontWeight = 'bold';
    deckABtn.onclick = () => {
      onLoadDeckA?.();
      document.body.removeChild(menu);
    };

    const deckBBtn = document.createElement('button');
    deckBBtn.textContent = 'Load Deck B';
    deckBBtn.style.display = 'block';
    deckBBtn.style.width = '100%';
    deckBBtn.style.padding = '10px 15px';
    deckBBtn.style.textAlign = 'left';
    deckBBtn.style.color = '#ff00ff';
    deckBBtn.style.backgroundColor = 'transparent';
    deckBBtn.style.border = 'none';
    deckBBtn.style.cursor = 'pointer';
    deckBBtn.style.fontSize = '12px';
    deckBBtn.style.fontWeight = 'bold';
    deckBBtn.style.borderTop = `1px solid ${glowColor}`;
    deckBBtn.onclick = () => {
      onLoadDeckB?.();
      document.body.removeChild(menu);
    };

    menu.appendChild(deckABtn);
    menu.appendChild(deckBBtn);
    document.body.appendChild(menu);

    setTimeout(() => {
      if (document.body.contains(menu)) {
        document.body.removeChild(menu);
      }
    }, 3000);
  };

  return (
    <button
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        pad-neon relative w-full aspect-square rounded-xl
        flex flex-col items-center justify-center
        font-bold text-xs sm:text-sm md:text-base
        transition-all duration-200 ease-out
        ${isActive ? 'pad-active scale-110' : ''}
        ${isSelected ? 'ring-2 ring-offset-2' : ''}
      `}
      style={{
        color: color,
        backgroundColor: `${color}15`,
        borderColor: `${color}80`,
        boxShadow: `
          inset 0 2px 0 rgba(255, 255, 255, 0.4),
          0 0 20px ${glowColor}80,
          0 0 40px ${glowColor}40
          ${isHovered ? `, 0 0 60px ${glowColor}` : ''}
          ${isActive ? `, 0 0 80px ${glowColor}` : ''}
        `,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <div className="text-center leading-tight">
        <div className="font-black text-lg sm:text-xl md:text-2xl uppercase tracking-wider">
          {name}
        </div>
        <div className="text-xs mt-1 opacity-70 flex items-center justify-center gap-1">
          <Volume2 size={12} />
          {volume}%
        </div>
      </div>

      {/* Shine effect */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
        }}
      />
    </button>
  );
}
