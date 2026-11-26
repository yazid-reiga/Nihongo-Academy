import { describe, expect, it } from "vitest";
import {
  scoreAttempt,
  awardOnce,
  computeStreak,
  nextReviewDate,
  progressPercent,
} from "./logic";
import type { QuizQuestion } from "./types";

const questions: QuizQuestion[] = [
  { id: "1", category: "hiragana", difficulty: "easy", prompt: "a?", options: ["a", "i"], answerIndex: 0, explanation: "", status: "published" },
  { id: "2", category: "hiragana", difficulty: "easy", prompt: "i?", options: ["a", "i"], answerIndex: 1, explanation: "", status: "published" },
  { id: "3", category: "hiragana", difficulty: "easy", prompt: "u?", options: ["u", "e"], answerIndex: 0, explanation: "", status: "published" },
  { id: "4", category: "hiragana", difficulty: "easy", prompt: "e?", options: ["u", "e"], answerIndex: 1, explanation: "", status: "published" },
];

describe("scoreAttempt", () => {
  it("recomputes correctness from the authoritative answer key", () => {
    const result = scoreAttempt(questions, [0, 0, 0, 1]);
    expect(result.correctCount).toBe(3);
    expect(result.totalQuestions).toBe(4);
    expect(result.score).toBe(75);
  });

  it("returns zero score for no answers", () => {
    expect(scoreAttempt(questions, []).score).toBe(0);
  });
});

describe("awardOnce", () => {
  it("awards XP the first time an activity key appears", () => {
    expect(awardOnce([], "lesson:hiragana-1", 10)).toBe(10);
  });

  it("does not award XP for a duplicate activity key", () => {
    expect(awardOnce(["lesson:hiragana-1"], "lesson:hiragana-1", 10)).toBe(0);
  });
});

describe("computeStreak", () => {
  it("counts consecutive local days ending today", () => {
    const dates = ["2026-11-18", "2026-11-19", "2026-11-20"];
    expect(computeStreak(dates, "2026-11-20")).toEqual({ current: 3, longest: 3 });
  });

  it("resets the current streak when yesterday is missing", () => {
    const dates = ["2026-11-17", "2026-11-20"];
    expect(computeStreak(dates, "2026-11-20")).toEqual({ current: 1, longest: 1 });
  });
});

describe("nextReviewDate", () => {
  it("uses a one-day interval for a correct easy review", () => {
    const now = new Date("2026-11-20T10:00:00Z");
    expect(nextReviewDate(5, now).toISOString()).toBe("2026-11-21T10:00:00.000Z");
  });

  it("reschedules a failed review sooner", () => {
    const now = new Date("2026-11-20T10:00:00Z");
    expect(nextReviewDate(1, now).toISOString()).toBe("2026-11-20T11:00:00.000Z");
  });
});

describe("progressPercent", () => {
  it("returns whole percentages", () => {
    expect(progressPercent(3, 4)).toBe(75);
    expect(progressPercent(0, 0)).toBe(0);
  });
});
