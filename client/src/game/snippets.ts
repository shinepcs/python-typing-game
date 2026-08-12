export type Difficulty = "입문" | "기초" | "도전";

export type Mission = {
  id: string;
  difficulty: Difficulty;
  title: string;
  concept: string;
  code: string;
  timeLimit: number;
  reward: number;
};

export const MISSIONS: Mission[] = [
  {
    id: "loop-sprint",
    difficulty: "입문",
    title: "루프 스프린트",
    concept: "for · range",
    code: "for step in range(5):\n    print(step)",
    timeLimit: 35,
    reward: 120,
  },
  {
    id: "function-flow",
    difficulty: "기초",
    title: "함수 플로우",
    concept: "def · return",
    code: "def square(value):\n    return value * value",
    timeLimit: 45,
    reward: 180,
  },
  {
    id: "list-combo",
    difficulty: "도전",
    title: "컴프리헨션 콤보",
    concept: "list · if",
    code: "even = [n for n in range(12) if n % 2 == 0]",
    timeLimit: 55,
    reward: 240,
  },
];
