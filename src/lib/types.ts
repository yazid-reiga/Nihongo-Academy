export type Script = "hiragana" | "katakana";
export type KanaCategory = "Seion" | "Dakuon" | "Handakuon" | "Youon" | "Sokuon" | "Chouon";
export type LearningStatus = "not_started" | "learning" | "reviewing" | "mastered";
export type ReviewState = "new" | "learning" | "due" | "mastered";
export type Difficulty = "easy" | "normal" | "hard";
export type Role = "student" | "admin";

export interface KanaChar {
  id: string;
  script: Script;
  character: string;
  romaji: string;
  pronunciation: string;
  category: KanaCategory;
  exampleWord: string;
  exampleMeaning: string;
  strokeCount: number;
}

export interface KanjiReading {
  type: "onyomi" | "kunyomi";
  kana: string;
  romaji: string;
  context?: string;
}

export interface KanjiExampleWord {
  word: string;
  kana: string;
  romaji: string;
  meaning: string;
}

export interface KanjiEntry {
  id: string;
  character: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  readings: KanjiReading[];
  strokeCount: number;
  jlpt: string;
  category: string;
  illustration: string;
  romajiHint: string;
  exampleWords: KanjiExampleWord[];
  exampleSentence: { jp: string; romaji: string; meaning: string };
  components: string[];
  related: string[];
}

export interface Radical {
  id: string;
  symbol: string;
  name: string;
  meaning: string;
  variants: string[];
  position: string;
  isOfficialRadical: boolean;
  examples: string[];
}

export interface CompositionChain {
  id: string;
  chars: string[];
  explanation: string;
}

export interface VocabEntry {
  id: string;
  kanjiForm: string;
  kanaForm: string;
  romaji: string;
  meaning: string;
  category: string;
  jlpt: string;
  exampleSentence?: string;
}

export interface GrammarEntry {
  id: string;
  title: string;
  pattern: string;
  meaning: string;
  explanation: string;
  jlpt: string;
  example: { jp: string; furigana: string; romaji: string; meaning: string };
}

export type QuizCategory =
  | "hiragana"
  | "katakana"
  | "kana-reading"
  | "kanji-meaning"
  | "kanji-reading"
  | "bushu"
  | "vocabulary"
  | "grammar"
  | "mixed";

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  difficulty: Difficulty;
  prompt: string;
  context?: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  status: "draft" | "review" | "approved" | "published";
}

export interface QuizAnswerRecord {
  questionId: string;
  choice: number;
  correct: boolean;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  category: QuizCategory;
  score: number;
  totalQuestions: number;
  correctCount: number;
  durationSeconds: number;
  completedAt: string;
  answers: QuizAnswerRecord[];
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
  learningLevel: string;
  learningGoal: string;
  dailyGoalMinutes: number;
  timezone: string;
  onboardingComplete: boolean;
  avatarUrl?: string;
}

export interface Session {
  userId: string;
  remember: boolean;
  startedAt: string;
}

export interface ProgressRecord {
  userId: string;
  contentType: string;
  contentId: string;
  status: LearningStatus;
  progressPercentage: number;
  lastAccessedAt: string;
  completedAt?: string;
}

export interface ReviewRecord {
  userId: string;
  contentType: string;
  contentId: string;
  lastReviewedAt: string;
  nextReviewAt: string;
  correctCount: number;
  incorrectCount: number;
  difficultyRating: number;
  reviewState: ReviewState;
}

export interface Activity {
  id: string;
  userId: string;
  type: string;
  label: string;
  at: string;
  xp: number;
}

export interface Achievement {
  code: string;
  title: string;
  description: string;
  icon: string;
  condition: (ctx: AchievementContext) => boolean;
}

export interface AchievementContext {
  streak: number;
  masteredKana: number;
  masteredKanji: number;
  quizCount: number;
  lessonCount: number;
  examCount: number;
}

export interface Settings {
  romajiMode: "always" | "after-answer" | "hidden";
  furiganaMode: "always" | "hover" | "hidden";
  reducedMotion: boolean;
  theme: "light" | "dark";
  dailyGoalMinutes: number;
  audioEnabled: boolean;
}

export interface ContentItem {
  id: string;
  contentType: string;
  title: string;
  status: "draft" | "review" | "approved" | "published";
  updatedAt: string;
}
