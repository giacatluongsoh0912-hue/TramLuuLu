// Gentle Web Audio API synthesizer for nostalgic school melodies

class NostalgicSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrackIndex = 0;
  private sequenceTimeout: number | null = null;
  private masterGain: GainNode | null = null;
  private volume = 0.5;

  private tracks = [
    {
      title: 'Bụi Phấn (Thanh Âm Bục Giảng)',
      notes: [
        { freq: 261.63, dur: 0.8 }, // C4 Khi thầy viết bảng
        { freq: 329.63, dur: 0.8 }, // E4
        { freq: 392.00, dur: 0.8 }, // G4
        { freq: 440.00, dur: 1.2 }, // A4
        { freq: 392.00, dur: 0.8 }, // G4 bụi phấn rơi rơi
        { freq: 329.63, dur: 0.8 }, // E4
        { freq: 293.66, dur: 1.4 }, // D4
        { freq: 261.63, dur: 0.8 }, // C4 Có hạt bụi nào
        { freq: 329.63, dur: 0.8 }, // E4
        { freq: 392.00, dur: 0.8 }, // G4 rơi trên bục giảng
        { freq: 349.23, dur: 0.8 }, // F4 Có hạt bụi nào
        { freq: 329.63, dur: 0.8 }, // E4 vương trên tóc thầy
        { freq: 293.66, dur: 1.6 }, // D4
        { freq: 261.63, dur: 2.0 }, // C4
      ],
      tempo: 900,
    },
    {
      title: 'Người Thầy (Dòng Sông Năm Tháng)',
      notes: [
        { freq: 329.63, dur: 0.7 }, // E4
        { freq: 392.00, dur: 0.7 }, // G4
        { freq: 440.00, dur: 0.7 }, // A4 Người thầy vẫn lặng lẽ đi về sớm trưa
        { freq: 523.25, dur: 1.0 }, // C5
        { freq: 440.00, dur: 0.8 }, // A4
        { freq: 392.00, dur: 0.8 }, // G4
        { freq: 329.63, dur: 1.2 }, // E4
        { freq: 293.66, dur: 0.7 }, // D4 Từng ngày giọt mồ hôi rơi nhẹ trang giấy
        { freq: 329.63, dur: 0.7 }, // E4
        { freq: 392.00, dur: 0.7 }, // G4
        { freq: 440.00, dur: 1.4 }, // A4
        { freq: 392.00, dur: 0.8 }, // G4 Để em đến bến bờ tương lai
        { freq: 329.63, dur: 1.6 }, // E4
      ],
      tempo: 850,
    },
    {
      title: 'Mong Ước Kỷ Niệm Xưa',
      notes: [
        { freq: 392.00, dur: 0.8 }, // G4 Thời gian trôi qua mau
        { freq: 440.00, dur: 0.8 }, // A4
        { freq: 493.88, dur: 0.8 }, // B4
        { freq: 523.25, dur: 1.4 }, // C5 chỉ còn lại những kỷ niệm
        { freq: 493.88, dur: 0.8 }, // B4 Kỷ niệm thân yêu ơi
        { freq: 440.00, dur: 0.8 }, // A4
        { freq: 392.00, dur: 1.2 }, // G4
        { freq: 329.63, dur: 0.8 }, // E4 sẽ còn nhớ mãi tiếng thầy cô
        { freq: 349.23, dur: 0.8 }, // F4
        { freq: 392.00, dur: 0.8 }, // G4
        { freq: 440.00, dur: 1.6 }, // A4
        { freq: 392.00, dur: 2.0 }, // G4
      ],
      tempo: 950,
    },
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft piano acoustic chord/note with warm harmonics
  private playPianoNote(freq: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();

    // Fundamental + warm harmonic
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, t);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, t);

    // Warm envelope
    gain1.gain.setValueAtTime(0.001, t);
    gain1.gain.linearRampToValueAtTime(0.35, t + 0.05); // attack
    gain1.gain.exponentialRampToValueAtTime(0.12, t + 0.3); // decay
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + duration); // release

    osc1.connect(gain1);
    osc2.connect(gain1);
    gain1.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration);
    osc2.stop(t + duration);
  }

  public playSchoolBell() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // School chime bell sound: 3 resonant tones
    const bellNotes = [523.25, 659.25, 783.99, 1046.5];
    bellNotes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || !this.masterGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 1.8);
      }, idx * 350);
    });
  }

  public togglePlay(onStateChange?: (playing: boolean, trackName: string) => void) {
    if (this.isPlaying) {
      this.pause();
      if (onStateChange) onStateChange(false, this.tracks[this.currentTrackIndex].title);
    } else {
      this.play(onStateChange);
    }
  }

  public play(onStateChange?: (playing: boolean, trackName: string) => void) {
    this.initContext();
    this.isPlaying = true;
    const track = this.tracks[this.currentTrackIndex];
    if (onStateChange) onStateChange(true, track.title);

    let noteIndex = 0;
    const playNext = () => {
      if (!this.isPlaying) return;
      const currentNote = track.notes[noteIndex];
      this.playPianoNote(currentNote.freq, currentNote.dur);

      noteIndex = (noteIndex + 1) % track.notes.length;
      this.sequenceTimeout = window.setTimeout(playNext, track.tempo);
    };

    playNext();
  }

  public nextTrack(onStateChange?: (playing: boolean, trackName: string) => void) {
    this.pause();
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.play(onStateChange);
  }

  public pause() {
    this.isPlaying = false;
    if (this.sequenceTimeout !== null) {
      clearTimeout(this.sequenceTimeout);
      this.sequenceTimeout = null;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getPlaying() {
    return this.isPlaying;
  }

  public getCurrentTrackTitle() {
    return this.tracks[this.currentTrackIndex].title;
  }
}

export const audioPlayer = new NostalgicSynthesizer();
