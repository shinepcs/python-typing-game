export type SessionRecord = {
  missionId: string;
  completed: boolean;
  accuracy: number;
  cpm: number;
  combo: number;
  earnedXp: number;
  timestamp: string;
};

export type PlayerProgress = {
  totalXp: number;
  bestCpm: number;
  bestAccuracy: number;
  longestCombo: number;
  dailyStreak: number;
  lastActiveDate: string | null;
  completedMissionIds: string[];
  mistakeMap: Record<string, number>;
  sessions: SessionRecord[];
};

const STORAGE_KEY = "pytype-arena-progress-v1";

const initialProgress = (): PlayerProgress => ({
  totalXp: 0,
  bestCpm: 0,
  bestAccuracy: 0,
  longestCombo: 0,
  dailyStreak: 0,
  lastActiveDate: null,
  completedMissionIds: [],
  mistakeMap: {},
  sessions: [],
});

const dayKey = (date: Date) => date.toISOString().slice(0, 10);

export class ProgressStore {
  private progress: PlayerProgress;

  constructor() {
    this.progress = this.load();
  }

  public get snapshot() {
    return this.progress;
  }

  public get level() {
    return Math.floor(this.progress.totalXp / 500) + 1;
  }

  public get levelProgress() {
    return this.progress.totalXp % 500;
  }

  public recordSession(input: Omit<SessionRecord, "earnedXp" | "timestamp"> & { baseXp: number; mistakeMap: Record<string, number> }) {
    const now = new Date();
    const completedBonus = input.completed ? 1 : 0.35;
    const accuracyMultiplier = Math.max(0.7, input.accuracy / 100);
    const earnedXp = Math.max(10, Math.round(input.baseXp * completedBonus * accuracyMultiplier));
    const today = dayKey(now);

    if (this.progress.lastActiveDate !== today) {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      this.progress.dailyStreak = this.progress.lastActiveDate === dayKey(yesterday) ? this.progress.dailyStreak + 1 : 1;
      this.progress.lastActiveDate = today;
    }

    this.progress.totalXp += earnedXp;
    this.progress.bestCpm = Math.max(this.progress.bestCpm, input.cpm);
    this.progress.bestAccuracy = Math.max(this.progress.bestAccuracy, input.accuracy);
    this.progress.longestCombo = Math.max(this.progress.longestCombo, input.combo);
    if (input.completed && !this.progress.completedMissionIds.includes(input.missionId)) {
      this.progress.completedMissionIds.push(input.missionId);
    }

    Object.entries(input.mistakeMap).forEach(([character, count]) => {
      this.progress.mistakeMap[character] = (this.progress.mistakeMap[character] ?? 0) + count;
    });

    this.progress.sessions = [
      {
        missionId: input.missionId,
        completed: input.completed,
        accuracy: input.accuracy,
        cpm: input.cpm,
        combo: input.combo,
        earnedXp,
        timestamp: now.toISOString(),
      },
      ...this.progress.sessions,
    ].slice(0, 20);

    this.save();
    return earnedXp;
  }

  public weakCharacters(limit = 3) {
    return Object.entries(this.progress.mistakeMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([character]) => (character === " " ? "space" : character));
  }

  private load() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return initialProgress();
      const parsed = JSON.parse(raw) as Partial<PlayerProgress> & { bestWpm?: number; sessions?: Array<SessionRecord & { wpm?: number }> };
      const legacySessions = (parsed.sessions ?? []) as Array<SessionRecord & { wpm?: number }>;
      return {
        ...initialProgress(),
        ...parsed,
        bestCpm: parsed.bestCpm ?? parsed.bestWpm ?? 0,
        sessions: legacySessions.map((session) => ({ ...session, cpm: session.cpm ?? session.wpm ?? 0 })),
      };
    } catch {
      return initialProgress();
    }
  }

  private save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch {
      // 플레이 흐름은 로컬 저장소를 사용할 수 없는 환경에서도 중단되지 않는다.
    }
  }
}
