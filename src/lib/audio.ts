"use client";

/**
 * Browser SpeechSynthesis fallback. No fake audio files are shipped: when the
 * browser has no Japanese voice, the caller shows the kana/romaji text instead.
 */
export function speakJapanese(text: string, enabled = true): boolean {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.85;
    const voices = window.speechSynthesis.getVoices();
    const japaneseVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("ja"));
    if (japaneseVoice) utterance.voice = japaneseVoice;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}
