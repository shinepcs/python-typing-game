export type Difficulty = "워밍업" | "기초" | "실전";
export type PracticeKind = "word" | "function" | "program";

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
  setItems?: string[];
};

export const MISSIONS: Mission[] = [
  {
    id: "word-practice",
    difficulty: "워밍업",
    kind: "word",
    title: "단어 연습",
    concept: "파이썬 키워드 · 단어 20개",
    focus: "단어 리듬",
    code: "async",
    timeLimit: 90,
    reward: 30,
    setItems: [
      "async", "await", "yield", "match", "print",
      "input", "range", "split", "strip", "lower",
      "upper", "items", "keys()", "sum()", "len()",
      "list()", "dict()", "True", "None", "pass",
    ],
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
