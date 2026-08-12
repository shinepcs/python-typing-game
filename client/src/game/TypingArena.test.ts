import { describe, expect, it } from "vitest";
import { TypingArena } from "./TypingArena";
import type { Mission } from "./snippets";

const mission: Mission = {
  id: "indent-test",
  difficulty: "입문",
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
