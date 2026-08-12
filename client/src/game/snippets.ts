export type Difficulty = "입문" | "기초" | "도전";

export type Mission = {
  id: string;
  difficulty: Difficulty;
  title: string;
  concept: string;
  focus: string;
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
    focus: "반복 흐름",
    code: "for step in range(5):\n    print(step)",
    timeLimit: 35,
    reward: 120,
  },
  {
    id: "function-flow",
    difficulty: "기초",
    title: "함수 플로우",
    concept: "def · return",
    focus: "함수 설계",
    code: "def square(value):\n    return value * value",
    timeLimit: 45,
    reward: 180,
  },
  {
    id: "list-combo",
    difficulty: "도전",
    title: "컴프리헨션 콤보",
    concept: "list · if",
    focus: "컬렉션 변환",
    code: "even = [n for n in range(12) if n % 2 == 0]",
    timeLimit: 55,
    reward: 240,
  },
  {
    id: "branch-check",
    difficulty: "입문",
    title: "분기 체크",
    concept: "if · else",
    focus: "조건 판단",
    code: "if score >= 80:\n    print(\"pass\")\nelse:\n    print(\"retry\")",
    timeLimit: 50,
    reward: 150,
  },
  {
    id: "dictionary-map",
    difficulty: "기초",
    title: "딕셔너리 맵",
    concept: "dict · get",
    focus: "데이터 조회",
    code: "profile = {\"name\": \"Ada\"}\nprint(profile.get(\"name\"))",
    timeLimit: 55,
    reward: 190,
  },
  {
    id: "string-cleanup",
    difficulty: "기초",
    title: "문자열 클린업",
    concept: "strip · lower",
    focus: "문자열 처리",
    code: "command = raw.strip().lower()\nprint(command)",
    timeLimit: 45,
    reward: 185,
  },
  {
    id: "guard-rail",
    difficulty: "도전",
    title: "예외 가드레일",
    concept: "try · except",
    focus: "예외 처리",
    code: "try:\n    value = int(text)\nexcept ValueError:\n    value = 0",
    timeLimit: 60,
    reward: 250,
  },
  {
    id: "class-seed",
    difficulty: "도전",
    title: "클래스 시드",
    concept: "class · self",
    focus: "객체 구조",
    code: "class Counter:\n    def __init__(self):\n        self.value = 0",
    timeLimit: 65,
    reward: 280,
  },
];
