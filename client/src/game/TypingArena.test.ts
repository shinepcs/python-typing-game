import { describe, expect, it } from "vitest";
import { TypingArena } from "./TypingArena";
import { MISSIONS, type Mission } from "./snippets";

const mission: Mission = {
  id: "indent-test",
  difficulty: "워밍업",
  kind: "warmup",
  title: "들여쓰기 테스트",
  concept: "tab",
  focus: "들여쓰기",
  code: "for step in range(2):\n    print(step)",
  timeLimit: 30,
  reward: 100,
};

describe("TypingArena 들여쓰기 입력", () => {
  it("줄 시작의 4칸 공백은 Tab 한 번으로 진행한다", () => {
    const arena = new TypingArena(mission);
    for (const character of "for step in range(2):") {
      expect(arena.handleKey(character)).toBe("correct");
    }
    expect(arena.handleKey("Enter")).toBe("correct");
    expect(arena.target[arena.index]).toBe(" ");

    expect(arena.handleKey("Tab")).toBe("correct");
    expect(arena.target[arena.index]).toBe("p");
    expect(arena.index).toBe("for step in range(2):\n    ".length);
  });

  it("줄 중간의 Tab은 오입력이나 진행으로 처리하지 않는다", () => {
    const arena = new TypingArena(mission);
    expect(arena.handleKey("f")).toBe("correct");
    expect(arena.handleKey("Tab")).toBe("ignored");
    expect(arena.index).toBe(1);
  });
});

describe("연속 코드 연습 콘텐츠", () => {
  it("5자·20자 워밍업은 선택 화면 없이 반복 가능한 길이로 제공한다", () => {
    const warmupFive = MISSIONS.find((mission) => mission.id === "warmup-05");
    const warmupTwenty = MISSIONS.find((mission) => mission.id === "warmup-20");

    expect(warmupFive?.code).toHaveLength(5);
    expect(warmupFive?.continuous).toBe(true);
    expect(warmupTwenty?.code).toHaveLength(20);
    expect(warmupTwenty?.continuous).toBe(true);
  });

  it("함수와 프로그램 연습에는 실행 가능한 구조와 설명 주석이 있다", () => {
    const functionPractice = MISSIONS.find((mission) => mission.kind === "function");
    const programPractice = MISSIONS.find((mission) => mission.kind === "program");

    expect(functionPractice?.code).toContain("# Convert raw scores");
    expect(functionPractice?.code).toContain("def build_score_report");
    expect(programPractice?.code).toContain("# Save completed tasks");
    expect(programPractice?.code).toContain('if __name__ == "__main__":');
  });
});
