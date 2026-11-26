import type { KanjiEntry, CompositionChain } from "@/lib/types";

type Word = [word: string, kana: string, meaning: string];
type Row = [
  char: string, meaning: string, on: string, kun: string, strokes: number,
  jlpt: string, emoji: string, hint: string, w1: Word, w2: Word,
  sentence: [jp: string, romaji: string, meaning: string],
];

const componentMap: Record<string, string[]> = {
  火: [], 水: [], 木: [], 土: [], 人: [], 日: [], 月: [], 山: [], 川: [], 口: [],
  手: [], 心: [], 金: ["人", "王"], 田: [], 雨: [], 風: [], 花: ["艹", "化"],
  犬: [], 猫: ["犭", "苗"], 魚: [], 食: ["人", "良"], 飲: ["食", "欠"],
};

const relatedMap: Record<string, string[]> = {
  火: ["炎", "焼", "灯"], 水: ["海", "川", "雨"], 木: ["林", "森", "花"],
  日: ["月", "明", "時"], 月: ["日", "明", "肌"], 山: ["川", "島", "岩"],
  口: ["手", "心", "呼"], 手: ["口", "心", "打"], 心: ["手", "口", "想"],
};

const rows: Row[] = [
  ["火", "Api", "カ", "ひ・ほ-", 4, "N5", "🔥", "hi", ["火曜日", "かようび", "Selasa"], ["火事", "かじ", "kebakaran"], ["火が燃えています。", "Hi ga moete imasu.", "Api sedang menyala."]],
  ["水", "Air", "スイ", "みず", 4, "N5", "💧", "mizu", ["水曜日", "すいようび", "Rabu"], ["水道", "すいどう", "air ledeng"], ["水を飲みます。", "Mizu o nomimasu.", "Saya minum air."]],
  ["木", "Pohon / kayu", "モク・ボク", "き・こ-", 4, "N5", "🌳", "ki", ["木曜日", "もくようび", "Kamis"], ["木材", "もくざい", "kayu"], ["木が高いです。", "Ki ga takai desu.", "Pohonnya tinggi."]],
  ["土", "Tanah", "ド", "つち", 3, "N5", "🌱", "tsuchi", ["土曜日", "どようび", "Sabtu"], ["土壌", "どじょう", "tanah"], ["土に植えます。", "Tsuchi ni uemasu.", "Saya menanam di tanah."]],
  ["人", "Orang", "ジン・ニン", "ひと", 2, "N5", "🧍", "hito", ["人間", "にんげん", "manusia"], ["人々", "ひとびと", "orang-orang"], ["人がいます。", "Hito ga imasu.", "Ada orang."]],
  ["日", "Matahari / hari", "ニチ・ジツ", "ひ・か", 4, "N5", "☀️", "hi", ["日曜日", "にちようび", "Minggu"], ["日本", "にほん", "Jepang"], ["日が昇ります。", "Hi ga noborimasu.", "Matahari terbit."]],
  ["月", "Bulan", "ゲツ・ガツ", "つき", 4, "N5", "🌙", "tsuki", ["月曜日", "げつようび", "Senin"], ["一月", "いちがつ", "Januari"], ["月がきれいです。", "Tsuki ga kirei desu.", "Bulannya indah."]],
  ["山", "Gunung", "サン", "やま", 3, "N5", "⛰️", "yama", ["登山", "とざん", "mendaki"], ["山道", "やまみち", "jalan gunung"], ["山に登ります。", "Yama ni noborimasu.", "Saya mendaki gunung."]],
  ["川", "Sungai", "セン", "かわ", 3, "N5", "🌊", "kawa", ["川辺", "かわべ", "tepi sungai"], ["河川", "かせん", "sungai"], ["川が流れます。", "Kawa ga nagaremasu.", "Sungai mengalir."]],
  ["口", "Mulut", "コウ", "くち", 3, "N5", "👄", "kuchi", ["人口", "じんこう", "populasi"], ["口紅", "くちべに", "gincu"], ["口を開けます。", "Kuchi o akemasu.", "Saya membuka mulut."]],
  ["手", "Tangan", "シュ", "て", 4, "N5", "✋", "te", ["手紙", "てがみ", "surat"], ["上手", "じょうず", "pandai"], ["手を洗います。", "Te o araimasu.", "Saya mencuci tangan."]],
  ["心", "Hati", "シン", "こころ", 4, "N5", "❤️", "kokoro", ["心配", "しんぱい", "khawatir"], ["関心", "かんしん", "ketertarikan"], ["心が痛みます。", "Kokoro ga itamimasu.", "Hati saya sakit."]],
  ["金", "Emas / uang", "キン・コン", "かね", 8, "N5", "💰", "kane", ["金曜日", "きんようび", "Jumat"], ["お金", "おかね", "uang"], ["お金があります。", "Okane ga arimasu.", "Saya punya uang."]],
  ["田", "Sawah", "デン", "た", 5, "N5", "🌾", "ta", ["田舎", "いなか", "desa"], ["水田", "すいでん", "sawah"], ["田で働きます。", "Ta de hatarakimasu.", "Saya bekerja di sawah."]],
  ["雨", "Hujan", "ウ", "あめ", 8, "N5", "🌧️", "ame", ["雨天", "うてん", "hari hujan"], ["雨傘", "あまがさ", "payung"], ["雨が降ります。", "Ame ga furimasu.", "Hujan turun."]],
  ["風", "Angin", "フウ", "かぜ", 9, "N5", "🍃", "kaze", ["風邪", "かぜ", "pilek"], ["風景", "ふうけい", "pemandangan"], ["風が強いです。", "Kaze ga tsuyoi desu.", "Anginnya kencang."]],
  ["花", "Bunga", "カ", "はな", 7, "N5", "🌸", "hana", ["花屋", "はなや", "toko bunga"], ["花束", "はなたば", "buket"], ["花が咲きます。", "Hana ga sakimasu.", "Bunga mekar."]],
  ["犬", "Anjing", "ケン", "いぬ", 4, "N5", "🐕", "inu", ["柴犬", "しばいぬ", "Shiba Inu"], ["犬小屋", "いぬごや", "kandang anjing"], ["犬が走ります。", "Inu ga hashirimasu.", "Anjing berlari."]],
  ["猫", "Kucing", "ビョウ", "ねこ", 11, "N5", "🐱", "neko", ["子猫", "こねこ", "anak kucing"], ["猫背", "ねこぜ", "bungkuk"], ["猫が寝ています。", "Neko ga nete imasu.", "Kucing sedang tidur."]],
  ["魚", "Ikan", "ギョ", "さかな・うお", 11, "N5", "🐟", "sakana", ["鮮魚", "せんぎょ", "ikan segar"], ["魚屋", "さかなや", "toko ikan"], ["魚を買います。", "Sakana o kaimasu.", "Saya membeli ikan."]],
  ["食", "Makan", "ショク", "た・く", 9, "N5", "🍚", "taberu", ["食べ物", "たべもの", "makanan"], ["食堂", "しょくどう", "kantin"], ["ご飯を食べます。", "Gohan o tabemasu.", "Saya makan nasi."]],
  ["飲", "Minum", "イン", "の", 12, "N5", "🥤", "nomu", ["飲み物", "のみもの", "minuman"], ["飲酒", "いんしゅ", "minum alkohol"], ["お茶を飲みます。", "Ocha o nomimasu.", "Saya minum teh."]],
];

const romajiHint: Record<string, string> = {
  火: "hi / ka", 水: "mizu / sui", 木: "ki / moku", 土: "tsuchi / do", 人: "hito / jin",
  日: "hi / nichi", 月: "tsuki / getsu", 山: "yama / san", 川: "kawa / sen", 口: "kuchi / kou",
  手: "te / shu", 心: "kokoro / shin", 金: "kane / kin", 田: "ta / den", 雨: "ame / u",
  風: "kaze / fuu", 花: "hana / ka", 犬: "inu / ken", 猫: "neko / byou", 魚: "sakana / gyo",
  食: "taberu / shoku", 飲: "nomu / in",
};

export const KANJI: KanjiEntry[] = rows.map(([character, meaning, on, kun, strokeCount, jlpt, illustration, , w1, w2, sentence]) => ({
  id: `kanji-${character}`,
  character,
  meaning,
  onyomi: on.split("・"),
  kunyomi: kun.split("・"),
  readings: [
    ...on.split("・").map((kana) => ({ type: "onyomi" as const, kana, romaji: romajiHint[character] ?? "", context: "Pembacaan on'yomi (asal Tiongkok), biasanya pada kata majemuk." })),
    ...kun.split("・").map((kana) => ({ type: "kunyomi" as const, kana, romaji: romajiHint[character] ?? "", context: "Pembacaan kun'yomi (asal Jepang), biasanya untuk kata tunggal." })),
  ],
  strokeCount,
  jlpt,
  category: "Dasar",
  illustration,
  romajiHint: romajiHint[character] ?? "",
  exampleWords: [
    { word: w1[0], kana: w1[1], romaji: "", meaning: w1[2] },
    { word: w2[0], kana: w2[1], romaji: "", meaning: w2[2] },
  ],
  exampleSentence: { jp: sentence[0], romaji: sentence[1], meaning: sentence[2] },
  components: componentMap[character] ?? [],
  related: relatedMap[character] ?? [],
}));

export const COMPOSITIONS: CompositionChain[] = [
  { id: "comp-fire", chars: ["火", "炎", "焼"], explanation: "火 (api) muncul sebagai komponen pada 炎 (nyala api) dan 焼 (membakar). Ini bantuan mengingat bentuk, bukan aturan makna yang mutlak." },
  { id: "comp-water", chars: ["水", "氵", "海"], explanation: "Bentuk radikal 氵 (san sui) berasal dari 水 dan sering tampil pada kanji bertema air seperti 海 (laut). Tidak semua kanji dengan 氵 mengandung arti air secara harfiah." },
  { id: "comp-tree", chars: ["木", "林", "森"], explanation: "木 (pohon) berulang menjadi 林 (hutan kecil) dan 森 (hutan). Gunakan sebagai bantuan visual untuk mengingat bentuk." },
  { id: "comp-sun", chars: ["日", "明", "時"], explanation: "日 (matahari/hari) menjadi bagian dari 明 (terang) dan 時 (waktu). Hubungan ini membantu pengenalan bentuk, bukan jaminan makna." },
];
