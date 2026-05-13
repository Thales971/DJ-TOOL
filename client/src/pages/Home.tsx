import AutoBeatMaker from "@/components/AutoBeatMaker";
import Deck from "@/components/Deck";
import Mixer from "@/components/Mixer";
import Pad from "@/components/Pad";
import RemixPanel from "@/components/RemixPanel";
import { minecraftSounds } from "@/const";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";

interface Sound {
  id: string | number;
  name: string;
  url: string;
  color: string;
  glow: string;
}

interface SoundSettings {
  pitch: number;
  speed: number;
  reverb: number;
  delay: number;
  loop: boolean;
  volume: number;
}

const INITIAL_SOUNDS: Sound[] = minecraftSounds.map((sound, index) => ({
  id: index + 1,
  ...sound,
  glow: sound.color,
}));

/**
 * ONOMATOPEIA DJ 2000 - Main App
 *
 * Design Philosophy: Y2K Cyberpunk Maximalist
 * - Neon saturation with intense glows
 * - Digital maximalism with multiple effect layers
 * - Retro-futurism combining 2000s elements with modern tech
 * - Dynamic interactivity with immediate visual feedback
 */
export default function Home() {
  const [sounds, setSounds] = useState<Sound[]>(INITIAL_SOUNDS);
  const [activePad, setActivePad] = useState<string | number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(80);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [deckA, setDeckA] = useState<Sound | null>(null);
  const [deckB, setDeckB] = useState<Sound | null>(null);
  const [isAudioStarted, setIsAudioStarted] = useState(false);

  /* Per-sound FX settings */
  const [soundSettings, setSoundSettings] = useState<
    Record<string | number, SoundSettings>
  >(() => {
    const settings: Record<string | number, SoundSettings> = {};
    INITIAL_SOUNDS.forEach(s => {
      settings[s.id] = {
        pitch: 0,
        speed: 1,
        reverb: 0,
        delay: 0,
        loop: false,
        volume: 100,
      };
    });
    return settings;
  });

  /* Tone.js nodes */
  const playersRef = useRef<Record<string | number, Tone.Player>>({});
  const fxChainsRef = useRef<Record<string | number, any>>({});
  const recorderRef = useRef<Tone.Recorder | null>(null);
  const masterGainRef = useRef<Tone.Gain | null>(null);

  /* Initialize master gain */
  useEffect(() => {
    masterGainRef.current = new Tone.Gain(masterVolume / 100).toDestination();
    return () => {
      masterGainRef.current?.dispose();
    };
  }, []);

  /* Update master volume */
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.rampTo(masterVolume / 100, 0.1);
    }
  }, [masterVolume]);

  /* Create or get player + fx chain for a sound */
  const getPlayerChain = useCallback(
    (sound: Sound): { player: Tone.Player; fx: any } => {
      const settings = soundSettings[sound.id] || {
        pitch: 0,
        speed: 1,
        reverb: 0,
        delay: 0,
        loop: false,
        volume: 100,
      };

      if (!fxChainsRef.current[sound.id]) {
        const reverb = new Tone.Reverb({ decay: 2, wet: settings.reverb });
        const delay = new Tone.FeedbackDelay({
          delayTime: "8n",
          feedback: 0.3,
          wet: settings.delay,
        });
        const pitchShift = new Tone.PitchShift({ pitch: settings.pitch });
        const gain = new Tone.Gain(settings.volume / 100);

        gain.connect(pitchShift);
        pitchShift.connect(delay);
        delay.connect(reverb);
        reverb.connect(masterGainRef.current!);

        fxChainsRef.current[sound.id] = { reverb, delay, pitchShift, gain };
      }

      if (!playersRef.current[sound.id]) {
        const player = new Tone.Player({
          url: sound.url,
          loop: settings.loop,
          playbackRate: settings.speed,
          onload: () => console.log(`Loaded: ${sound.name}`),
        });
        player.connect(fxChainsRef.current[sound.id].gain);
        playersRef.current[sound.id] = player;
      }

      return {
        player: playersRef.current[sound.id],
        fx: fxChainsRef.current[sound.id],
      };
    },
    [soundSettings]
  );

  /* Play a sound */
  const playSound = useCallback(
    async (sound: Sound): Promise<void> => {
      if (!isAudioStarted) {
        await Tone.start();
        setIsAudioStarted(true);
      }

      const { player, fx } = getPlayerChain(sound);
      const settings = soundSettings[sound.id] || {
        pitch: 0,
        speed: 1,
        reverb: 0,
        delay: 0,
        loop: false,
        volume: 100,
      };

      /* Apply current settings */
      fx.pitchShift.pitch = settings.pitch;
      fx.reverb.wet.value = settings.reverb;
      fx.delay.wet.value = settings.delay;
      fx.gain.gain.value = settings.volume / 100;
      player.playbackRate = settings.speed;
      player.loop = settings.loop;

      if (player.loaded) {
        player.stop();
        player.start();
      }

      setActivePad(sound.id);
      setTimeout(() => setActivePad(null), 300);
    },
    [getPlayerChain, soundSettings, isAudioStarted]
  );

  /* Handle file upload */
  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const neonColors = [
        "#ff00ff",
        "#00ffff",
        "#ffff00",
        "#39ff14",
        "#ff6600",
        "#0088ff",
        "#bf00ff",
        "#ff1493",
      ];
      const color = neonColors[Math.floor(Math.random() * neonColors.length)];
      const newSound: Sound = {
        id: Date.now(),
        name:
          file.name
            .replace(/\.[^/.]+$/, "")
            .slice(0, 12)
            .toUpperCase() + "!",
        url,
        color,
        glow: color,
      };
      setSounds(prev => [...prev, newSound]);
      setSoundSettings(prev => ({
        ...prev,
        [newSound.id]: {
          pitch: 0,
          speed: 1,
          reverb: 0,
          delay: 0,
          loop: false,
          volume: 100,
        },
      }));
    },
    []
  );

  /* Update sound setting */
  const updateSoundSetting = useCallback(
    (soundId: string | number, key: string, value: number | boolean): void => {
      setSoundSettings(prev => ({
        ...prev,
        [soundId]: { ...prev[soundId], [key]: value },
      }));

      /* Live-update FX if chain exists */
      const fx = fxChainsRef.current[soundId];
      const player = playersRef.current[soundId];
      if (fx) {
        if (key === "pitch") fx.pitchShift.pitch = value;
        if (key === "reverb") fx.reverb.wet.value = value;
        if (key === "delay") fx.delay.wet.value = value;
        if (key === "volume") fx.gain.gain.value = (value as number) / 100;
      }
      if (player) {
        if (key === "speed") player.playbackRate = value as number;
        if (key === "loop") player.loop = value as boolean;
      }
    },
    []
  );

  /* Start Mix */
  const toggleMix = useCallback(async (): Promise<void> => {
    if (!isAudioStarted) {
      await Tone.start();
      setIsAudioStarted(true);
    }
    if (isPlaying) {
      Tone.Transport.stop();
      setIsPlaying(false);
    } else {
      Tone.Transport.start();
      setIsPlaying(true);
    }
  }, [isPlaying, isAudioStarted]);

  /* Record mix */
  const toggleRecording = useCallback(async (): Promise<void> => {
    if (!isAudioStarted) {
      await Tone.start();
      setIsAudioStarted(true);
    }
    if (isRecording) {
      if (recorderRef.current) {
        const recording = await recorderRef.current.stop();
        const url = URL.createObjectURL(recording);
        const a = document.createElement("a");
        a.href = url;
        a.download = "onomatopeia-mix.webm";
        a.click();
        recorderRef.current.dispose();
        recorderRef.current = null;
      }
      setIsRecording(false);
    } else {
      recorderRef.current = new Tone.Recorder();
      Tone.getDestination().connect(recorderRef.current);
      recorderRef.current.start();
      setIsRecording(true);
    }
  }, [isRecording, isAudioStarted]);

  /* Load sound into deck */
  const loadToDeck = useCallback((sound: Sound, deck: "A" | "B"): void => {
    if (deck === "A") setDeckA(sound);
    else setDeckB(sound);
  }, []);

  /* Keyboard support */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      const keyMap: Record<string, number> = {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 3,
        "5": 4,
        "6": 5,
        "7": 6,
        "8": 7,
        "9": 8,
        q: 0,
        w: 1,
        e: 2,
        r: 3,
        t: 4,
        y: 5,
        u: 6,
        i: 7,
        o: 8,
        p: 9,
        a: 10,
        s: 11,
        d: 12,
        f: 13,
        g: 14,
        h: 15,
      };

      const key = e.key.toLowerCase();
      const index = keyMap[key];

      if (index !== undefined && index < sounds.length) {
        e.preventDefault();
        playSound(sounds[index]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [sounds, playSound]);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 overflow-x-hidden">
      {/* ===== HEADER / TITLE ===== */}
      <header className="w-full max-w-7xl text-center mb-8">
        <h1 className="neon-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-wider leading-tight">
          ONOMATOPEIA DJ 2000
        </h1>
        <p className="mt-3 text-sm sm:text-base text-fuchsia-300/70 font-mono tracking-widest">
          ★ Y2K LAUNCHPAD ★ REMIX ★ SCRATCH ★
        </p>
      </header>

      {/* ===== DECKS SECTION ===== */}
      <section className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Deck
          label="DECK A"
          sound={deckA}
          isPlaying={isPlaying}
          onPlay={() => deckA && playSound(deckA)}
          accentColor="#00ffff"
        />
        <Deck
          label="DECK B"
          sound={deckB}
          isPlaying={isPlaying}
          onPlay={() => deckB && playSound(deckB)}
          accentColor="#ff00ff"
        />
      </section>

      <AutoBeatMaker sounds={minecraftSounds} />

      {/* ===== PAD GRID ===== */}
      <section className="w-full max-w-5xl mb-8">
        <h2
          className="text-xl sm:text-2xl font-bold text-center mb-4"
          style={{
            fontFamily: "'Bungee', Impact, sans-serif",
            color: "#ff00ff",
            textShadow: "0 0 12px #ff00ff",
          }}
        >
          ★ LAUNCHPAD ★
        </h2>
        <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {sounds.map(sound => (
            <Pad
              key={sound.id}
              id={sound.id}
              name={sound.name}
              color={sound.color}
              glowColor={sound.glow}
              isActive={activePad === sound.id}
              onPlay={() => playSound(sound)}
              onSelect={() =>
                setSelectedSound(selectedSound?.id === sound.id ? null : sound)
              }
              isSelected={selectedSound?.id === sound.id}
              volume={soundSettings[sound.id]?.volume || 100}
              onLoadDeckA={() => loadToDeck(sound, "A")}
              onLoadDeckB={() => loadToDeck(sound, "B")}
            />
          ))}
        </div>
      </section>

      {/* ===== SOUND CONTROLS (when a pad is selected) ===== */}
      {selectedSound && (
        <section className="w-full max-w-3xl mb-8">
          <RemixPanel
            soundName={selectedSound.name}
            soundColor={selectedSound.color}
            settings={soundSettings[selectedSound.id]}
            onUpdate={(key, value) =>
              updateSoundSetting(selectedSound.id, key, value)
            }
            onClose={() => setSelectedSound(null)}
          />
        </section>
      )}

      {/* ===== MIXER & CONTROLS ===== */}
      <section className="w-full max-w-5xl mb-8">
        <Mixer
          masterVolume={masterVolume}
          onVolumeChange={setMasterVolume}
          isPlaying={isPlaying}
          isRecording={isRecording}
          onToggleMix={toggleMix}
          onToggleRecording={toggleRecording}
          onUpload={handleUpload}
        />
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="w-full max-w-5xl text-center mt-auto pt-8 pb-6 border-t border-fuchsia-900/40">
        <p className="text-xs sm:text-sm text-fuchsia-300/50 leading-relaxed font-mono">
          Feito pra apresentação de onomatopeia –{" "}
          <span className="text-cyan-400/70">The dog barked loudly.</span>{" "}
          <span className="text-red-400/70">Crash!</span>{" "}
          <span className="text-cyan-300/70">Splash!</span>{" "}
          <span className="text-yellow-400/70">Boom!</span>{" "}
          <span className="text-green-400/70">Crunch, crunch, crunch...</span>
        </p>
        <p className="mt-2 text-xs text-fuchsia-400/30 tracking-widest">
          ONOMATOPEIA DJ 2000 © Y2K VIBES
        </p>
      </footer>
    </div>
  );
}
