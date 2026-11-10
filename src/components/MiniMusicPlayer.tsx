import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, Music, Upload, Disc, ChevronUp, ChevronDown } from 'lucide-react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  isCustom?: boolean;
  src?: string; // object URL or audio data
  synthesizedNotes?: number[]; // for built-in soothing ambient chords if no mp3 uploaded
}

const DEFAULT_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Người Gieo Mầm Xanh',
    artist: 'Hòa tấu Tri ân Chuyên Sơn La',
    synthesizedNotes: [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 392.00, 329.63], // C E G C A F G E
  },
  {
    id: 'track-2',
    title: 'Bụi Phấn Trong Mắt Em',
    artist: 'Giai điệu Kỷ niệm 20/11',
    synthesizedNotes: [329.63, 392.00, 440.00, 493.88, 440.00, 392.00, 329.63, 293.66], // E G A B A G E D
  },
  {
    id: 'track-3',
    title: 'Bài Học Đầu Tiên & Mái Trường Xưa',
    artist: 'Acoustic Thầy Trò Chuyên Sơn La',
    synthesizedNotes: [392.00, 440.00, 523.25, 587.33, 523.25, 440.00, 392.00, 329.63],
  },
];

export const MiniMusicPlayer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('csl_custom_tracks');
      if (saved) {
        return [...DEFAULT_TRACKS, ...JSON.parse(saved)];
      }
    } catch {
      // fallback
    }
    return DEFAULT_TRACKS;
  });
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [customFileNote, setCustomFileNote] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Synthesizer for rich, peaceful ambient music when no external audio file is provided
  const playSynthesizedMelody = () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }

      const notes = currentTrack.synthesizedNotes || [261.63, 329.63, 392.00, 523.25];
      let step = 0;

      const playTone = () => {
        if (!isPlaying || isMuted || volume === 0) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm sine + soft triangle warmth
        osc.type = 'sine';
        const freq = notes[step % notes.length];
        osc.frequency.setValueAtTime(freq, now);

        const currentVol = isMuted ? 0 : volume * 0.12;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(currentVol, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.0);

        step++;
      };

      playTone();
      synthIntervalRef.current = setInterval(playTone, 2200);
    } catch {
      // AudioContext not allowed before gesture
    }
  };

  const stopSynthesizer = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  // Handle Play / Pause
  useEffect(() => {
    if (isPlaying) {
      if (currentTrack.src && audioRef.current) {
        stopSynthesizer();
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.play().catch(() => {});
      } else {
        if (audioRef.current) audioRef.current.pause();
        playSynthesizedMelody();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSynthesizer();
    }

    return () => {
      stopSynthesizer();
    };
  }, [isPlaying, currentTrackIndex, isMuted, volume]);

  // Handle Volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    const next = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(next);
    setIsPlaying(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Vui lòng chọn file âm thanh (định dạng MP3, WAV, M4A, OGG).');
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    const newTrack: Track = {
      id: `custom-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'File người dùng tải lên',
      isCustom: true,
      src: fileUrl,
    };

    const updated = [newTrack, ...tracks];
    setTracks(updated);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    setCustomFileNote(`Đang phát: ${newTrack.title}`);

    setTimeout(() => {
      setCustomFileNote(null);
    }, 4500);
  };

  return (
    <>
      {/* Hidden native audio element for MP3 playback */}
      {currentTrack.src && (
        <audio
          ref={audioRef}
          src={currentTrack.src}
          loop
          onEnded={handleNextTrack}
        />
      )}

      {/* Floating subtle corner widget */}
      <div className="fixed bottom-5 right-5 z-40 select-none">
        {/* Expanded Player Box */}
        {isOpen && (
          <div className="mb-3 w-80 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-amber-500/30 p-4 shadow-2xl shadow-black/60 text-amber-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Giai Điệu Tri Ân 20/11
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="Thu gọn"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Current Track Info & Spinning Vinyl */}
            <div className="flex items-center gap-3 py-3">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-tr from-stone-950 via-stone-800 to-amber-950 border-2 border-amber-500/40 flex items-center justify-center shadow-lg transition-transform ${
                    isPlaying ? 'animate-spin [animation-duration:6s]' : ''
                  }`}
                >
                  <Disc className="w-6 h-6 text-amber-400" />
                </div>
                {isPlaying && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-stone-900 animate-ping" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate" title={currentTrack.title}>
                  {currentTrack.title}
                </p>
                <p className="text-xs text-amber-200/70 truncate">{currentTrack.artist}</p>
                {/* Visualizer bars */}
                <div className="flex items-center gap-0.5 mt-1.5 h-2">
                  {[...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      className={`w-1 bg-amber-400/80 rounded-full transition-all duration-300 ${
                        isPlaying
                          ? 'animate-pulse'
                          : 'h-1 opacity-30'
                      }`}
                      style={{
                        height: isPlaying ? `${Math.max(3, (i * 3 + 2) % 8 + 3)}px` : '3px',
                        animationDelay: `${i * 120}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                  title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
                  title="Bài tiếp theo"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 text-stone-400 hover:text-amber-300 transition-colors"
                  title={isMuted ? 'Bật âm' : 'Tắt tiếng'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-16 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            {/* Track Selector & MP3 Upload */}
            <div className="mt-3 pt-3 border-t border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Danh sách phát:</span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-medium hover:underline transition-all"
                >
                  <Upload className="w-3 h-3" />
                  <span>Tải lên MP3</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="max-h-28 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {tracks.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentTrackIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      idx === currentTrackIndex
                        ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{t.title}</span>
                    {t.isCustom && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40">
                        MP3
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {customFileNote && (
              <p className="mt-2 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-1 rounded text-center animate-fade-in">
                {customFileNote}
              </p>
            )}
          </div>
        )}

        {/* Minimal Pill / Compact Toggle (Unobtrusive) */}
        {!isOpen && (
          <div className="flex items-center gap-2 bg-stone-900/85 backdrop-blur-md border border-amber-500/30 shadow-xl shadow-black/50 rounded-full pl-2 pr-3 py-1.5 text-stone-200 hover:border-amber-400/60 transition-all duration-300 group">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isPlaying
                  ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-500/30'
                  : 'bg-stone-800 text-amber-300 hover:bg-amber-500 hover:text-stone-950'
              }`}
              title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc tri ân'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
            </button>

            {/* Track Info Click to Expand */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 text-left"
              title="Mở trình phát nhạc"
            >
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-amber-200 max-w-[130px] truncate leading-tight">
                  {currentTrack.title}
                </span>
                <span className="text-[9px] text-stone-400 leading-tight">
                  {isPlaying ? 'Đang phát...' : 'Nhạc nền 20/11'}
                </span>
              </div>
              <ChevronUp className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-400 transition-colors" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
