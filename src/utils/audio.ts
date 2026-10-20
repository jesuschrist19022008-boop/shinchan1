class CalmAudioManager {
  private ctx: AudioContext | null = null;
  private oscNodes: OscillatorNode[] = [];
  public isPlaying = false;

  public toggle(onStateChange?: (playing: boolean) => void): boolean {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }

    if (this.isPlaying) {
      this.stop();
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      this.start();
      if (onStateChange) onStateChange(true);
      return true;
    }
  }

  public start(): void {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Play gentle dreamy Kasukabe chords (F major 7th lo-fi pad: F3, A3, C4, E4)
    const freqs = [174.61, 220.00, 261.63, 329.63];
    this.oscNodes = [];

    freqs.forEach(f => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      this.oscNodes.push(osc);
    });

    this.isPlaying = true;
  }

  public stop(): void {
    this.oscNodes.forEach(node => {
      try {
        node.stop();
      } catch {
        // Ignored
      }
    });
    this.oscNodes = [];
    this.isPlaying = false;
  }
}

export const calmAudio = new CalmAudioManager();
