import type { QuizQuestion } from "./types";

export function scoreAttempt(
  questions: QuizQuestion[],
  choices: number[],
): { correctCount: number; totalQuestions: number; score: number } {
  const totalQuestions = questions.length;
  if (totalQuestions === 0) return { correctCount: 0, totalQuestions: 0, score: 0 };
  const correctCount = questions.reduce(
    (count, question, index) => count + (choices[index] === question.answerIndex ? 1 : 0),
    0,
  );
  return {
    correctCount,
    totalQuestions,
    score: Math.round((correctCount / totalQuestions) * 100),
  };
}

export function awardOnce(keys: string[], key: string, xp: number): number {
  return keys.includes(key) ? 0 : xp;
}

function shiftDate(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function computeStreak(
  dates: string[],
  today: string,
): { current: number; longest: number } {
  const unique = [...new Set(dates)].sort();
  if (unique.length === 0) return { current: 0, longest: 0 };

  let longest = 0;
  let run = 0;
  let previous: string | null = null;
  for (const date of unique) {
    run = previous !== null && date === shiftDate(previous, 1) ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }

  let current = 0;
  let cursor = today;
  while (unique.includes(cursor)) {
    current += 1;
    cursor = shiftDate(cursor, -1);
  }
  return { current, longest };
}

export function nextReviewDate(quality: number, now: Date): Date {
  const hours = quality <= 2 ? 1 : quality === 3 ? 12 : 24;
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

export function progressPercent(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}

export function localDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function hashPassword(password: string): string {
  // Demo-only, non-cryptographic hash. Local mode is explicitly NOT a real auth system.
  let hash = 5381;
  for (let i = 0; i < password.length; i += 1) {
    hash = ((hash << 5) + hash + password.charCodeAt(i)) | 0;
  }
  return `demo-${(hash >>> 0).toString(16)}`;
}
