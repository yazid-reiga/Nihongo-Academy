import {
  ACHIEVEMENTS, DEFAULT_SETTINGS, achievementContext,
  type AppState, type DataAdapter, type RegisterInput, type Result,
} from "./adapter";
import { QUIZ_QUESTIONS } from "./seed/content";
import { awardOnce, computeStreak, hashPassword, localDateKey, nextReviewDate, scoreAttempt } from "@/lib/logic";
import type {
  Activity, ContentItem, LearningStatus, ProgressRecord, QuizAttempt,
  QuizCategory, QuizQuestion, ReviewRecord, Settings, User,
} from "@/lib/types";

const STORAGE_KEY = "nihongo-academy-state-v1";

function seedState(): AppState {
  const now = new Date().toISOString();
  const demo: User = {
    id: "user-demo", fullName: "Siswa Demo", username: "siswa", email: "demo@nihongo.ac.id",
    passwordHash: hashPassword("demo1234"), role: "student", createdAt: now,
    learningLevel: "N5", learningGoal: "Learn Japanese from Zero", dailyGoalMinutes: 15,
    timezone: "Asia/Jakarta", onboardingComplete: false,
  };
  const admin: User = {
    id: "user-admin", fullName: "Admin Nihongo", username: "admin", email: "admin@nihongo.ac.id",
    passwordHash: hashPassword("admin1234"), role: "admin", createdAt: now,
    learningLevel: "N5", learningGoal: "Manage content", dailyGoalMinutes: 15,
    timezone: "Asia/Jakarta", onboardingComplete: true,
  };
  return {
    users: [demo, admin],
    session: null,
    progress: [], reviews: [], activities: [], quizAttempts: [], favorites: [],
    settings: { [demo.id]: { ...DEFAULT_SETTINGS }, [admin.id]: { ...DEFAULT_SETTINGS } },
    unlocked: [],
    content: [],
    questions: QUIZ_QUESTIONS.map((q) => ({ ...q })),
  };
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

class LocalAdapter implements DataAdapter {
  private state: AppState = this.load();
  private listeners = new Set<() => void>();

  private load(): AppState {
    if (typeof window === "undefined") return seedState();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return seedState();
      const parsed = JSON.parse(raw) as AppState;
      if (!Array.isArray(parsed.users) || !Array.isArray(parsed.questions)) return seedState();
      return parsed;
    } catch {
      return seedState();
    }
  }

  private persist(): void {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch {
        // Storage full or blocked — the in-memory state still works for this session.
      }
    }
  }

  private emit(): void {
    this.persist();
    this.listeners.forEach((listener) => listener());
  }

  getState(): AppState {
    return this.state;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  register(input: RegisterInput): Result<User> {
    const fullName = input.fullName.trim();
    const username = input.username.trim().toLowerCase();
    const email = input.email.trim().toLowerCase();
    if (!fullName || !username || !email || !input.password) {
      return { ok: false, error: "Lengkapi semua kolom yang wajib diisi." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: "Format email tidak valid." };
    }
    if (input.password.length < 8) {
      return { ok: false, error: "Kata sandi minimal 8 karakter." };
    }
    if (this.state.users.some((u) => u.username.toLowerCase() === username)) {
      return { ok: false, error: "Username sudah digunakan." };
    }
    if (this.state.users.some((u) => u.email.toLowerCase() === email)) {
      return { ok: false, error: "Email sudah terdaftar." };
    }
    const user: User = {
      id: newId("user"), fullName, username, email,
      passwordHash: hashPassword(input.password), role: "student",
      createdAt: new Date().toISOString(), learningLevel: "N5", learningGoal: "",
      dailyGoalMinutes: 15, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta",
      onboardingComplete: false,
    };
    this.state.users.push(user);
    this.state.settings[user.id] = { ...DEFAULT_SETTINGS };
    this.state.session = { userId: user.id, remember: false, startedAt: new Date().toISOString() };
    this.addActivity(user.id, "user_registered", "Akun dibuat", 0);
    this.emit();
    return { ok: true, data: user };
  }

  login(email: string, password: string, remember: boolean): Result<User> {
    const normalized = email.trim().toLowerCase();
    const user = this.state.users.find((u) => u.email.toLowerCase() === normalized);
    if (!user || user.passwordHash !== hashPassword(password)) {
      return { ok: false, error: "Email atau kata sandi salah." };
    }
    this.state.session = { userId: user.id, remember, startedAt: new Date().toISOString() };
    this.addActivity(user.id, "user_logged_in", "Login", 0);
    this.emit();
    return { ok: true, data: user };
  }

  logout(): void {
    this.state.session = null;
    this.emit();
  }

  deleteAccount(userId: string): void {
    if (!this.canActAs(userId)) return;
    this.state.users = this.state.users.filter((u) => u.id !== userId);
    this.state.progress = this.state.progress.filter((p) => p.userId !== userId);
    this.state.reviews = this.state.reviews.filter((r) => r.userId !== userId);
    this.state.activities = this.state.activities.filter((a) => a.userId !== userId);
    this.state.quizAttempts = this.state.quizAttempts.filter((a) => a.userId !== userId);
    this.state.favorites = this.state.favorites.filter((f) => f.userId !== userId);
    this.state.unlocked = this.state.unlocked.filter((u) => !u.startsWith(`${userId}:`));
    delete this.state.settings[userId];
    if (this.state.session?.userId === userId) this.state.session = null;
    this.emit();
  }

  currentUser(): User | undefined {
    return this.state.users.find((u) => u.id === this.state.session?.userId);
  }

  private isAdmin(): boolean {
    return this.currentUser()?.role === "admin";
  }

  private canActAs(userId: string): boolean {
    return this.state.session?.userId === userId || this.isAdmin();
  }

  updateUser(userId: string, patch: Partial<User>): void {
    if (!this.canActAs(userId)) return;
    const user = this.state.users.find((u) => u.id === userId);
    if (!user) return;
    Object.assign(user, patch);
    this.emit();
  }

  getUsers(): User[] {
    return [...this.state.users];
  }

  getProgress(userId: string, contentType: string, contentId: string): ProgressRecord | undefined {
    return this.state.progress.find((p) => p.userId === userId && p.contentType === contentType && p.contentId === contentId);
  }

  getAllProgress(userId: string): ProgressRecord[] {
    return this.state.progress.filter((p) => p.userId === userId);
  }

  setProgress(userId: string, contentType: string, contentId: string, status: LearningStatus): void {
    if (!this.canActAs(userId)) return;
    const existing = this.getProgress(userId, contentType, contentId);
    if (existing) {
      existing.status = status;
      existing.lastAccessedAt = new Date().toISOString();
      existing.progressPercentage = status === "mastered" ? 100 : status === "reviewing" ? 75 : status === "learning" ? 40 : 0;
      if (status === "mastered") existing.completedAt = existing.completedAt ?? new Date().toISOString();
    } else {
      this.state.progress.push({
        userId, contentType, contentId, status,
        progressPercentage: status === "mastered" ? 100 : 40,
        lastAccessedAt: new Date().toISOString(),
        completedAt: status === "mastered" ? new Date().toISOString() : undefined,
      });
    }
    this.emit();
  }

  markLearned(userId: string, contentType: string, contentId: string, label: string): void {
    if (!this.canActAs(userId)) return;
    const existing = this.getProgress(userId, contentType, contentId);
    if (existing?.status === "mastered") return;
    const key = `mastery:${contentType}:${contentId}`;
    const xp = awardOnce(this.getActivities(userId).map((a) => a.label), key, 10);
    this.setProgress(userId, contentType, contentId, "mastered");
    if (xp > 0) {
      this.addActivity(userId, "mastery", key, xp);
      this.checkAchievements(userId);
      this.emit();
    }
  }

  isFavorite(userId: string, contentType: string, contentId: string): boolean {
    return this.state.favorites.some((f) => f.userId === userId && f.contentType === contentType && f.contentId === contentId);
  }

  toggleFavorite(userId: string, contentType: string, contentId: string): void {
    if (!this.canActAs(userId)) return;
    const index = this.state.favorites.findIndex((f) => f.userId === userId && f.contentType === contentType && f.contentId === contentId);
    if (index >= 0) this.state.favorites.splice(index, 1);
    else this.state.favorites.push({ userId, contentType, contentId });
    this.emit();
  }

  recordReview(userId: string, contentType: string, contentId: string, quality: number, label: string): void {
    if (!this.canActAs(userId)) return;
    const now = new Date();
    const existing = this.state.reviews.find((r) => r.userId === userId && r.contentType === contentType && r.contentId === contentId);
    if (existing) {
      existing.lastReviewedAt = now.toISOString();
      existing.nextReviewAt = nextReviewDate(quality, now).toISOString();
      existing.difficultyRating = quality;
      if (quality >= 3) existing.correctCount += 1;
      else existing.incorrectCount += 1;
      existing.reviewState = quality >= 4 ? "mastered" : quality >= 2 ? "learning" : "due";
    } else {
      const record: ReviewRecord = {
        userId, contentType, contentId, lastReviewedAt: now.toISOString(),
        nextReviewAt: nextReviewDate(quality, now).toISOString(),
        correctCount: quality >= 3 ? 1 : 0, incorrectCount: quality < 3 ? 1 : 0,
        difficultyRating: quality, reviewState: quality >= 4 ? "mastered" : "new",
      };
      this.state.reviews.push(record);
    }
    this.addActivity(userId, "review", label, 2);
    this.emit();
  }

  getReviews(userId: string): ReviewRecord[] {
    return this.state.reviews.filter((r) => r.userId === userId);
  }

  submitQuiz(
    userId: string, category: QuizCategory, questions: QuizQuestion[],
    choices: number[], durationSeconds: number,
  ): QuizAttempt {
    if (!this.canActAs(userId)) throw new Error("Akses ditolak");
    // The browser never supplies the answer key: resolve every question from the
    // authoritative store before scoring.
    const authoritative = questions.map((question) =>
      this.state.questions.find((stored) => stored.id === question.id) ?? { ...question, answerIndex: -1 },
    );
    const result = scoreAttempt(authoritative, choices);
    const now = new Date().toISOString();
    const attempt: QuizAttempt = {
      id: newId("quiz"), userId, category, score: result.score,
      totalQuestions: result.totalQuestions, correctCount: result.correctCount,
      durationSeconds, completedAt: now,
      answers: authoritative.map((question, i) => ({
        questionId: question.id, choice: choices[i] ?? -1,
        correct: choices[i] === question.answerIndex,
      })),
    };
    this.state.quizAttempts.push(attempt);
    const xp = awardOnce(this.getActivities(userId).map((a) => a.label), `quiz:${attempt.id}`, 5 + Math.floor(result.score / 10));
    this.addActivity(userId, "quiz", `quiz:${attempt.id}`, xp);
    authoritative.forEach((question, i) => {
      if (choices[i] !== question.answerIndex) {
        this.recordReview(userId, "quiz_question", question.id, 1, question.prompt);
      }
    });
    this.checkAchievements(userId);
    this.emit();
    return attempt;
  }

  getQuizAttempts(userId: string): QuizAttempt[] {
    return this.state.quizAttempts.filter((a) => a.userId === userId);
  }

  getActivities(userId: string): Activity[] {
    return this.state.activities.filter((a) => a.userId === userId);
  }

  getXp(userId: string): number {
    return this.getActivities(userId).reduce((sum, a) => sum + a.xp, 0);
  }

  getStreak(userId: string): { current: number; longest: number } {
    const dates = [...new Set(this.getActivities(userId).map((a) => localDateKey(new Date(a.at))))];
    return computeStreak(dates, localDateKey());
  }

  getAchievements(userId: string): { achievement: (typeof ACHIEVEMENTS)[number]; unlockedAt?: string }[] {
    return ACHIEVEMENTS.map((achievement) => ({
      achievement,
      unlockedAt: (() => {
        const entry = this.state.unlocked.find((u) => u.startsWith(`${userId}:${achievement.code}:`));
        const raw = entry?.split(":")[2];
        const epoch = Number(raw);
        return Number.isFinite(epoch) && raw ? new Date(epoch).toISOString() : undefined;
      })(),
    }));
  }

  getSettings(userId: string): Settings {
    return { ...DEFAULT_SETTINGS, ...(this.state.settings[userId] ?? {}) };
  }

  setSettings(userId: string, patch: Partial<Settings>): void {
    if (!this.canActAs(userId)) return;
    this.state.settings[userId] = { ...this.getSettings(userId), ...patch };
    this.emit();
  }

  getQuestions(): QuizQuestion[] {
    return [...this.state.questions];
  }

  saveQuestion(question: QuizQuestion): void {
    if (!this.isAdmin()) return;
    const index = this.state.questions.findIndex((q) => q.id === question.id);
    if (index >= 0) this.state.questions[index] = question;
    else this.state.questions.push(question);
    this.emit();
  }

  deleteQuestion(id: string): void {
    if (!this.isAdmin()) return;
    this.state.questions = this.state.questions.filter((q) => q.id !== id);
    this.emit();
  }

  getContent(): ContentItem[] {
    return [...this.state.content];
  }

  saveContent(item: ContentItem): void {
    if (!this.isAdmin()) return;
    const index = this.state.content.findIndex((c) => c.id === item.id);
    if (index >= 0) this.state.content[index] = item;
    else this.state.content.push(item);
    this.emit();
  }

  deleteContent(id: string): void {
    if (!this.isAdmin()) return;
    this.state.content = this.state.content.filter((c) => c.id !== id);
    this.emit();
  }

  private addActivity(userId: string, type: string, label: string, xp: number): void {
    this.state.activities.push({ id: newId("act"), userId, type, label, at: new Date().toISOString(), xp });
  }

  private checkAchievements(userId: string): void {
    const context = achievementContext(this.state, userId);
    for (const achievement of ACHIEVEMENTS) {
      const key = `${userId}:${achievement.code}:`;
      if (!this.state.unlocked.some((u) => u.startsWith(key)) && achievement.condition(context)) {
        this.state.unlocked.push(`${key}${Date.now()}`);
        this.addActivity(userId, "achievement", achievement.code, 0);
      }
    }
  }
}

export const adapter: DataAdapter = new LocalAdapter();
