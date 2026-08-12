export type Difficulty = "워밍업" | "기초" | "실전";
export type PracticeKind = "warmup" | "function" | "program";

export type Mission = {
  id: string;
  difficulty: Difficulty;
  kind: PracticeKind;
  title: string;
  concept: string;
  focus: string;
  code: string;
  timeLimit: number;
  reward: number;
  continuous?: boolean;
};

export const MISSIONS: Mission[] = [
  {
    id: "warmup-05",
    difficulty: "워밍업",
    kind: "warmup",
    title: "05자 워밍업",
    concept: "키 리듬 · 5 chars",
    focus: "정확한 시작",
    code: "async",
    timeLimit: 20,
    reward: 15,
    continuous: true,
  },
  {
    id: "warmup-20",
    difficulty: "워밍업",
    kind: "warmup",
    title: "20자 워밍업",
    concept: "키 리듬 · 20 chars",
    focus: "연속 입력",
    code: "python_code_training",
    timeLimit: 35,
    reward: 30,
    continuous: true,
  },
  {
    id: "score-report-function",
    difficulty: "기초",
    kind: "function",
    title: "점수 리포트 함수",
    concept: "function · list · dict",
    focus: "함수 단위 완주",
    code: "# Convert raw scores into an average report.\ndef build_score_report(raw_scores: list[str]) -> dict[str, float]:\n    scores = [int(value) for value in raw_scores if value.isdigit()]\n    if not scores:\n        return {\"count\": 0, \"average\": 0.0}\n\n    average = sum(scores) / len(scores)\n    return {\"count\": len(scores), \"average\": round(average, 1)}\n\nprint(build_score_report([\"88\", \"91\", \"skip\", \"76\"]))",
    timeLimit: 190,
    reward: 420,
  },
  {
    id: "task-summary-program",
    difficulty: "실전",
    kind: "program",
    title: "작업 요약 프로그램",
    concept: "dataclass · main · f-string",
    focus: "프로그램 단위 완주",
    code: "# Save completed tasks and show a concise terminal summary.\nfrom dataclasses import dataclass\n\n@dataclass\nclass Task:\n    title: str\n    done: bool = False\n\ndef summarize(tasks: list[Task]) -> str:\n    completed = sum(task.done for task in tasks)\n    return f\"{completed}/{len(tasks)} tasks complete\"\n\ndef main() -> None:\n    tasks = [Task(\"read docs\", True), Task(\"write tests\")]\n    print(summarize(tasks))\n\nif __name__ == \"__main__\":\n    main()",
    timeLimit: 300,
    reward: 700,
  },
];
