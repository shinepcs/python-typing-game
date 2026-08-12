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
    expect(arena.target[arena.index]).toBe("p");
    expect(arena.index).toBe("for step in range(2):\n    ".length);
  });

  it("줄 중간의 Tab은 오입력이나 진행으로 처리하지 않는다", () => {
    const arena = new TypingArena(mission);
    expect(arena.handleKey("f")).toBe("correct");
    expect(arena.handleKey("Tab")).toBe("ignored");
    expect(arena.index).toBe(1);
  });

  it("일반 공백 뒤의 다음 문자를 별도 입력으로 정확히 진행한다", () => {
    const commentMission: Mission = { ...mission, code: "# Save completed tasks" };
    const arena = new TypingArena(commentMission);
    for (const character of "# Save ") {
      expect(arena.handleKey(character)).toBe("correct");
    }
    expect(arena.target[arena.index]).toBe("c");
    expect(arena.handleKey("c")).toBe("correct");
    expect(arena.index).toBe("# Save c".length);
  });

  it("블록 시작 줄에서 Enter를 누르면 다음 줄의 들여쓰기를 자동으로 적용한다", () => {
    const nestedMission: Mission = {
      ...mission,
      code: "    for filename in files:\n        extension = filename.rsplit(\".\", 1)[-1]",
    };
    const arena = new TypingArena(nestedMission);

    expect(arena.handleKey("Tab")).toBe("correct");
    for (const character of "for filename in files:") {
      expect(arena.handleKey(character)).toBe("correct");
    }
    expect(arena.handleKey("Enter")).toBe("correct");
    expect(arena.target[arena.index]).toBe("e");
    expect(arena.handleKey("e")).toBe("correct");
  });
});

describe("연속 코드 연습 콘텐츠", () => {
  it("5개·20개 워밍업은 여러 항목을 한 세트로 연속 제공한다", () => {
    const warmupFive = MISSIONS.find((mission) => mission.id === "warmup-05");
    const warmupTwenty = MISSIONS.find((mission) => mission.id === "warmup-20");

    expect(warmupFive?.setItems).toHaveLength(5);
    expect(warmupFive?.setItems?.every((item) => item.length > 0)).toBe(true);
    expect(warmupTwenty?.setItems).toHaveLength(20);
    expect(warmupTwenty?.setItems?.every((item) => item.length > 0)).toBe(true);
  });

  it("함수와 프로그램 연습에는 실행 가능한 구조와 설명 주석이 있다", () => {
    const functionPractice = MISSIONS.find((mission) => mission.kind === "function");
    const programPractice = MISSIONS.find((mission) => mission.kind === "program");

    expect(functionPractice?.code).toContain("# Convert raw scores");
    expect(functionPractice?.code).toContain("def build_score_report");
    expect(functionPractice?.kind).toBe("function");
    expect(programPractice?.code).toContain("# Save completed tasks");
    expect(programPractice?.code).toContain('if __name__ == "__main__":');
    expect(programPractice?.kind).toBe("program");
  });
});
