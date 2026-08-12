export type FeedbackTone = "correct" | "mistake" | "complete" | "toggle";

export class SoundEngine {
  private context: AudioContext | null = null;
  private enabled = true;

  public get isEnabled() {
    return this.enabled;
  }

  public toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) this.play("toggle");
    return this.enabled;
  }

  public play(tone: FeedbackTone) {
    if (!this.enabled) return;
    try {
      this.context ??= new AudioContext();
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      const config = {
        correct: { frequency: 620, duration: 0.045, volume: 0.028, wave: "sine" as OscillatorType },
        mistake: { frequency: 165, duration: 0.075, volume: 0.035, wave: "square" as OscillatorType },
        complete: { frequency: 880, duration: 0.14, volume: 0.04, wave: "triangle" as OscillatorType },
        toggle: { frequency: 520, duration: 0.06, volume: 0.03, wave: "sine" as OscillatorType },
      }[tone];
      const now = this.context.currentTime;
      oscillator.type = config.wave;
      oscillator.frequency.setValueAtTime(config.frequency, now);
      gain.gain.setValueAtTime(config.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + config.duration);
      oscillator.connect(gain);
      gain.connect(this.context.destination);
      oscillator.start(now);
      oscillator.stop(now + config.duration);
    } catch {
      // 사운드 권한이 없는 환경에서도 타이핑 판정은 계속된다.
    }
  }
}
