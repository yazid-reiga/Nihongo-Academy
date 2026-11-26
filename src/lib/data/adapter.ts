import type {
  Achievement, AchievementContext, Activity, ContentItem, LearningStatus,
  ProgressRecord, QuizAttempt, QuizCategory, QuizQuestion, ReviewRecord,
  Session, Settings, User,
} from "@/lib/types";
import { computeStreak, localDateKey } from "@/lib/logic";

export const DEFAULT_SETTINGS: Settings = {
  romajiMode: "always",
  furiganaMode: "always",
  reducedMotion: false,
  theme: "light",
  dailyGoalMinutes: 15,
  audioEnabled: true,
};

export const ACHIEVEMENTS: Achievement[] = [
  { code: "first-lesson", title: "Pelajaran Pertama", description: "Selesaikan satu pelajaran pertama", icon: "🌱", condition: (c) => c.lessonCount >= 1 },
  { code: "hira-beginner", title: "Pemula Hiragana", description: "Kuasai 10 karakter Hiragana", icon: "あ", condition: (c) => c.masteredKana >= 10 },
  { code: "kata-beginner", title: "Pemula Katakana", description: "Kuasai 10 karakter Katakana", icon: "ア", condition: (c) => c.masteredKana >= 10 },
  { code: "kanji-50", title: "50 Kanji Pertama", description: "Kuasai 50 kanji", icon: "漢", condition: (c) => c.masteredKanji >= 50 },
  { code: "quiz-first", title: "First Quiz", description: "Selesaikan satu kuis", icon: "✏️", condition: (c) => c.quizCount >= 1 },
  { code: "streak-7", title: "7 Hari Berturut", description: "Belajar 7 hari berturut-turut", icon: "🔥", condition: (c) => c.streak >= 7 },
  { code: "exam-first", title: "Simulasi Pertama", description: "Selesaikan satu simulasi ujian", icon: "📝", condition: (c) => c.examCount >= 1 },
];

export interface AppState {
  users: User[];
  session: Session | null;
  progress: ProgressRecord[];
  reviews: ReviewRecord[];
  activities: Activity[];
  quizAttempts: QuizAttempt[];
  favorites: { userId: string; contentType: string; contentId: string }[];
  settings: Record<string, Settings>;
  unlocked: string[];
  content: ContentItem[];
  questions: QuizQuestion[];
}

export interface RegisterInput {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface Result<T = undefined> {
  ok: boolean;
  error?: string;
  data?: T;
}

export interface DataAdapter {
  getState(): AppState;
  subscribe(listener: () => void): () => void;

  register(input: RegisterInput): Result<User>;
  login(email: string, password: string, remember: boolean): Result<User>;
  logout(): void;
  deleteAccount(userId: string): void;
  updateUser(userId: string, patch: Partial<User>): void;
  getUsers(): User[];

  getProgress(userId: string, contentType: string, contentId: string): ProgressRecord | undefined;
  getAllProgress(userId: string): ProgressRecord[];
  setProgress(userId: string, contentType: string, contentId: string, status: LearningStatus): void;
  markLearned(userId: string, contentType: string, contentId: string, label: string): void;
  isFavorite(userId: string, contentType: string, contentId: string): boolean;
  toggleFavorite(userId: string, contentType: string, contentId: string): void;

  recordReview(userId: string, contentType: string, contentId: string, quality: number, label: string): void;
  getReviews(userId: string): ReviewRecord[];

  submitQuiz(userId: string, category: QuizCategory, questions: QuizQuestion[], choices: number[], durationSeconds: number): QuizAttempt;
  getQuizAttempts(userId: string): QuizAttempt[];

  getActivities(userId: string): Activity[];
  getXp(userId: string): number;
  getStreak(userId: string): { current: number; longest: number };
  getAchievements(userId: string): { achievement: Achievement; unlockedAt?: string }[];

  getSettings(userId: string): Settings;
  setSettings(userId: string, patch: Partial<Settings>): void;

  getQuestions(): QuizQuestion[];
  saveQuestion(question: QuizQuestion): void;
  deleteQuestion(id: string): void;
  getContent(): ContentItem[];
  saveContent(item: ContentItem): void;
  deleteContent(id: string): void;
}

export function achievementContext(
  state: AppState,
  userId: string,
): AchievementContext {
  const userProgress = state.progress.filter((p) => p.userId === userId);
  const dayKeys = [...new Set(state.activities.filter((a) => a.userId === userId).map((a) => a.at.slice(0, 10)))];
  return {
    streak: computeStreak(dayKeys, localDateKey()).current,
    masteredKana: userProgress.filter((p) => p.contentType.startsWith("kana") && p.status === "mastered").length,
    masteredKanji: userProgress.filter((p) => p.contentType === "kanji" && p.status === "mastered").length,
    quizCount: state.quizAttempts.filter((q) => q.userId === userId).length,
    lessonCount: userProgress.filter((p) => p.status === "mastered").length,
    examCount: 0,
  };
}
