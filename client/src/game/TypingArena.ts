import type { Mission } from "./snippets";

export type ArenaMode = "idle" | "playing" | "paused" | "complete";
export type InputOutcome = "correct" | "mistake" | "rewind" | "complete" | "ignored";

export class TypingArena {
  private mission: Mission;
  private mode: ArenaMode = "idle";
  private typedIndex = 0;
  private correctKeys = 0;
  private mistakes = 0;
  private startedAt = 0;
  private pausedAt = 0;
  private pausedDuration = 0;
  private lastErrorAt = 0;
  private mistakeMap: Record<string, number> = {};

  constructor(mission: Mission) {
    this.mission = mission;
  }

  public setMission(mission: Mission) {
    this.mission = mission;
    this.reset();
  }

  public reset() {
    this.mode = "idle";
    this.typedIndex = 0;
    this.correctKeys = 0;
    this.mistakes = 0;
    this.startedAt = 0;
    this.pausedAt = 0;
    this.pausedDuration = 0;
    this.lastErrorAt = 0;
    this.mistakeMap = {};
  }

  public start() {
    if (this.mode === "complete") this.reset();
    if (this.mode === "paused") return this.resume();
    if (this.mode === "idle") {
      this.mode = "playing";
      this.startedAt = performance.now();
    }
  }

  public pause() {
    if (this.mode !== "playing") return;
    this.mode = "paused";
    this.pausedAt = performance.now();
  }

  public resume() {
    if (this.mode !== "paused") return;
    this.pausedDuration += performance.now() - this.pausedAt;
    this.pausedAt = 0;
    this.mode = "playing";
  }

  public togglePause() {
    if (this.mode === "playing") this.pause();
    else if (this.mode === "paused") this.resume();
  }

  public handleKey(key: string): InputOutcome {
    if (this.mode === "idle") this.start();
    if (this.mode !== "playing") return "ignored";

    if (key === "Backspace") {
      if (this.typedIndex > 0) this.typedIndex -= 1;
      return "rewind";
    }

    if (key === "Tab") {
      const isLineStart = this.typedIndex === 0 || this.mission.code[this.typedIndex - 1] === "\n";
      const indentation = this.mission.code.slice(this.typedIndex).match(/^ +/)?.[0] ?? "";
      if (!isLineStart || indentation.length === 0) return "ignored";

      this.typedIndex += indentation.length;
      this.correctKeys += indentation.length;
      if (this.typedIndex >= this.mission.code.length) {
        this.mode = "complete";
        return "complete";
      }
      return "correct";
    }

    const normalizedKey = key === "Enter" ? "\n" : key;
    if (normalizedKey.length !== 1) return "ignored";

    const expected = this.mission.code[this.typedIndex];
    if (normalizedKey === expected) {
      this.typedIndex += 1;
      this.correctKeys += 1;
      if (this.typedIndex >= this.mission.code.length) {
        this.mode = "complete";
        return "complete";
      }
      return "correct";
    }

    this.mistakes += 1;
    this.lastErrorAt = performance.now();
    if (expected) this.mistakeMap[expected] = (this.mistakeMap[expected] ?? 0) + 1;
    return "mistake";
  }

  public tick() {
    if (this.mode === "playing" && this.timeRemaining <= 0) this.mode = "complete";
  }

  public get activeMission() {
    return this.mission;
  }

  public get status() {
    return this.mode;
  }

  public get index() {
    return this.typedIndex;
  }

  public get target() {
    return this.mission.code;
  }

  public get timeRemaining() {
    if (!this.startedAt) return this.mission.timeLimit;
    const base = this.mode === "paused" ? this.pausedAt : performance.now();
    const elapsed = Math.max(0, (base - this.startedAt - this.pausedDuration) / 1000);
    return Math.max(0, this.mission.timeLimit - elapsed);
  }

  public get elapsedSeconds() {
    if (!this.startedAt) return 0;
    const base = this.mode === "paused" ? this.pausedAt : performance.now();
    return Math.max(0, (base - this.startedAt - this.pausedDuration) / 1000);
  }

  public get accuracy() {
    const attempted = this.correctKeys + this.mistakes;
    return attempted ? Math.round((this.correctKeys / attempted) * 100) : 100;
  }

  public get wpm() {
    const minutes = this.elapsedSeconds / 60;
    return minutes > 0 ? Math.round(this.typedIndex / 5 / minutes) : 0;
  }

  public get combo() {
    return Math.max(0, this.typedIndex - this.mistakes * 2);
  }

  public get progress() {
    return Math.min(1, this.typedIndex / this.mission.code.length);
  }

  public get errorActive() {
    return performance.now() - this.lastErrorAt < 360;
  }

  public get errorsByCharacter() {
    return { ...this.mistakeMap };
  }

  public get completed() {
    return this.typedIndex >= this.mission.code.length;
  }

  public get resultXp() {
    return Math.round(this.mission.reward * (0.6 + this.accuracy / 250));
  }
}
