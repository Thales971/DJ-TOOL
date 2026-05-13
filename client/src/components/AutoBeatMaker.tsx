import { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { Play, Square, Shuffle } from 'lucide-react';

interface Sound {
  name: string;
  url: string;
  color: string;
}

interface AutoBeatMakerProps {
  sounds: Sound[];
}

export default function AutoBeatMaker({ sounds }: AutoBeatMakerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(128);
  const [steps, setSteps] = useState(8);
  const [pattern, setPattern] = useState<(string | null)[]>(Array(8).fill(null));
  
  const sequenceRef = useRef<Tone.Sequence | null>(null);
  const samplersRef = useRef<Record<string, Tone.Sampler>>({});

  useEffect(() => {
    sounds.forEach(sound => {
      if (!samplersRef.current[sound.name]) {
        samplersRef.current[sound.name] = new Tone.Sampler({
          urls: { C4: sound.url },
        }).toDestination();
      }
    });
  }, [sounds]);

  const generateRandomPattern = () => {
    const newPattern = Array.from({ length: steps }, () => {
      return Math.random() > 0.5 ? sounds[Math.floor(Math.random() * sounds.length)].name : null;
    });
    setPattern(newPattern);
  };

  const startBeat = async () => {
    await Tone.start();
    if (sequenceRef.current) sequenceRef.current.dispose();

    sequenceRef.current = new Tone.Sequence((time, note) => {
      if (!note) return;
      const sampler = samplersRef.current[note];
      if (sampler) sampler.triggerAttackRelease('C4', '16n', time);
    }, pattern, '16n');

    Tone.Transport.bpm.value = bpm;
    sequenceRef.current.start(0);
    Tone.Transport.start();
    setIsPlaying(true);
  };

  const stopBeat = () => {
    if (sequenceRef.current) {
      sequenceRef.current.stop();
      sequenceRef.current.dispose();
      sequenceRef.current = null;
    }
    Tone.Transport.stop();
    setIsPlaying(false);
  };

  const updateStep = (index: number, soundName: string) => {
    const newPattern = [...pattern];
    newPattern[index] = soundName === 'empty' ? null : soundName;
    setPattern(newPattern);
  };

  return (
    <div className="bg-black/90 border-2 border-cyan-400 rounded-3xl p-6 shadow-[0_0_50px_-10px] shadow-cyan-400 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 tracking-wider">
            AUTO BEAT MAKER
          </h3>
          <p className="text-cyan-400/70 text-sm mt-1">Minecraft Edition • 16 passos</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateRandomPattern}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95"
          >
            <Shuffle className="w-4 h-4" /> RANDOM
          </button>
          <button
            onClick={isPlaying ? stopBeat : startBeat}
            className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-xl transition-all active:scale-95 ${isPlaying 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gradient-to-r from-pink-500 to-yellow-400 text-black hover:shadow-[0_0_30px_#ff00ff]'}`}
          >
            {isPlaying ? <Square className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            {isPlaying ? 'STOP BEAT' : 'PLAY BEAT'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-3 mb-8">
        {pattern.map((step, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="text-[10px] text-center text-white/50 font-mono">STEP {index + 1}</div>
            <select
              value={step || 'empty'}
              onChange={(e) => updateStep(index, e.target.value)}
              className="bg-zinc-950 border border-white/30 text-white text-xs p-3 rounded-2xl focus:border-pink-500 transition-all"
            >
              <option value="empty">— EMPTY —</option>
              {sounds.map(s => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-white/60 mb-2 px-1">
            <span>BPM</span>
            <span className="font-mono text-pink-400">{bpm}</span>
          </div>
          <input
            type="range"
            min="60"
            max="200"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-pink-500"
          />
        </div>
        <div className="flex-1">
          <div className="text-xs text-white/60 mb-2 px-1">STEPS</div>
          <div className="flex gap-2">
            {[8, 12, 16].map(s => (
              <button
                key={s}
                onClick={() => setSteps(s)}
                className={`flex-1 py-3 rounded-2xl text-sm font-black transition-all ${steps === s 
                  ? 'bg-white text-black shadow-[0_0_20px_#fff]' 
                  : 'bg-white/10 hover:bg-white/20'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
