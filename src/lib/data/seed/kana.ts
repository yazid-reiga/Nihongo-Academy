import type { KanaCategory, KanaChar, Script } from "@/lib/types";

type Row = [character: string, romaji: string, example: string, meaning: string];

function build(script: Script, category: KanaCategory, rows: Row[]): KanaChar[] {
  return rows.map(([character, romaji, exampleWord, exampleMeaning], index) => ({
    id: `${script}-${category.toLowerCase()}-${index + 1}`,
    script,
    character,
    romaji,
    pronunciation: romaji,
    category,
    exampleWord,
    exampleMeaning,
    strokeCount: 0,
  }));
}

const hiraSeion: Row[] = [
  ["あ", "a", "あい", "cinta"], ["い", "i", "いえ", "rumah"], ["う", "u", "うみ", "laut"],
  ["え", "e", "え", "gambar"], ["お", "o", "お茶（おちゃ）", "teh"],
  ["か", "ka", "かき", "kaki"], ["き", "ki", "きって", "perangko"], ["く", "ku", "くつ", "sepatu"],
  ["け", "ke", "けさ", "pagi ini"], ["こ", "ko", "こども", "anak"],
  ["さ", "sa", "さけ", "sake/ikan"], ["し", "shi", "しお", "garam"], ["す", "su", "すし", "sushi"],
  ["せ", "se", "せかい", "dunia"], ["そ", "so", "そこ", "di sana"],
  ["た", "ta", "たべもの", "makanan"], ["ち", "chi", "ちかてつ", "kereta bawah tanah"],
  ["つ", "tsu", "つき", "bulan"], ["て", "te", "て", "tangan"], ["と", "to", "とけい", "jam"],
  ["な", "na", "なつ", "musim panas"], ["に", "ni", "にほん", "Jepang"], ["ぬ", "nu", "ぬの", "kain"],
  ["ね", "ne", "ねこ", "kucing"], ["の", "no", "のり", "rumput laut"],
  ["は", "ha", "はな", "bunga/hidung"], ["ひ", "hi", "ひ", "api"], ["ふ", "fu", "ふじさん", "Gunung Fuji"],
  ["へ", "he", "へや", "kamar"], ["ほ", "ho", "ほん", "buku"],
  ["ま", "ma", "まど", "jendela"], ["み", "mi", "みず", "air"], ["む", "mu", "むし", "serangga"],
  ["め", "me", "め", "mata"], ["も", "mo", "もの", "benda"],
  ["や", "ya", "やま", "gunung"], ["ゆ", "yu", "ゆき", "salju"], ["よ", "yo", "よる", "malam"],
  ["ら", "ra", "らいねん", "tahun depan"], ["り", "ri", "りんご", "apel"], ["る", "ru", "るす", "tidak ada"],
  ["れ", "re", "れいぞうこ", "kulkas"], ["ろ", "ro", "ろく", "enam"],
  ["わ", "wa", "わたし", "saya"], ["を", "wo", "本を読みます", "partikel objek"], ["ん", "n", "にほん", "Jepang"],
];

const kataSeion: Row[] = [
  ["ア", "a", "アパート", "apartemen"], ["イ", "i", "イメージ", "gambar/imaj"], ["ウ", "u", "ウイスキー", "wiski"],
  ["エ", "e", "エアコン", "AC"], ["オ", "o", "オレンジ", "jeruk"],
  ["カ", "ka", "カメラ", "kamera"], ["キ", "ki", "キッチン", "dapur"], ["ク", "ku", "クリーム", "krim"],
  ["ケ", "ke", "ケーキ", "kue"], ["コ", "ko", "コーヒー", "kopi"],
  ["サ", "sa", "サッカー", "sepak bola"], ["シ", "shi", "シャツ", "kaos"], ["ス", "su", "スポーツ", "olahraga"],
  ["セ", "se", "セーター", "sweater"], ["ソ", "so", "ソファ", "sofa"],
  ["タ", "ta", "タクシー", "taksi"], ["チ", "chi", "チケット", "tiket"], ["ツ", "tsu", "ツアー", "tur"],
  ["テ", "te", "テレビ", "televisi"], ["ト", "to", "トイレ", "toilet"],
  ["ナ", "na", "ナイフ", "pisau"], ["ニ", "ni", "ニュース", "berita"], ["ヌ", "nu", "ヌードル", "mi"],
  ["ネ", "ne", "ネクタイ", "dasi"], ["ノ", "no", "ノート", "catatan"],
  ["ハ", "ha", "ハンバーガー", "hamburger"], ["ヒ", "hi", "ヒーター", "pemanas"], ["フ", "fu", "フルーツ", "buah"],
  ["ヘ", "he", "ヘリコプター", "helikopter"], ["ホ", "ho", "ホテル", "hotel"],
  ["マ", "ma", "マグカップ", "mug"], ["ミ", "mi", "ミルク", "susu"], ["ム", "mu", "ムシカ", "musik"],
  ["メ", "me", "メール", "email"], ["モ", "mo", "モニター", "monitor"],
  ["ヤ", "ya", "ヤード", "yard"], ["ユ", "yu", "ユニフォーム", "seragam"], ["ヨ", "yo", "ヨーグルト", "yogurt"],
  ["ラ", "ra", "ラジオ", "radio"], ["リ", "ri", "リモコン", "remote"], ["ル", "ru", "ルール", "aturan"],
  ["レ", "re", "レストラン", "restoran"], ["ロ", "ro", "ロボット", "robot"],
  ["ワ", "wa", "ワイン", "anggur"], ["ヲ", "wo", "ヲ", "partikel (jarang)"], ["ン", "n", "コンビニ", "minimarket"],
];

const hiraDakuon: Row[] = [
  ["が", "ga", "がっこう", "sekolah"], ["ぎ", "gi", "ぎんこう", "bank"], ["ぐ", "gu", "ぐあい", "kondisi"],
  ["げ", "ge", "げんき", "sehat"], ["ご", "go", "ごはん", "nasi"],
  ["ざ", "za", "ざっし", "majalah"], ["じ", "ji", "じかん", "waktu"], ["ず", "zu", "ずっと", "selalu"],
  ["ぜ", "ze", "ぜんぶ", "semua"], ["ぞ", "zo", "ぞく", "suku/kaum"],
  ["だ", "da", "だいがく", "universitas"], ["ぢ", "ji", "ぢ", "variasi ji"], ["づ", "zu", "づ", "variasi zu"],
  ["で", "de", "でんしゃ", "kereta listrik"], ["ど", "do", "どこ", "di mana"],
  ["ば", "ba", "ばなな", "pisang"], ["び", "bi", "びょういん", "rumah sakit"], ["ぶ", "bu", "ぶた", "babi"],
  ["べ", "be", "べんとう", "bento"], ["ぼ", "bo", "ぼうし", "topi"],
];

const kataDakuon: Row[] = [
  ["ガ", "ga", "ガラス", "kaca"], ["ギ", "gi", "ギター", "gitar"], ["グ", "gu", "グループ", "grup"],
  ["ゲ", "ge", "ゲーム", "permainan"], ["ゴ", "go", "ゴルフ", "golf"],
  ["ザ", "za", "ザ・シティ", "kota"], ["ジ", "ji", "ジム", "gym"], ["ズ", "zu", "ズボン", "celana"],
  ["ゼ", "ze", "ゼミ", "seminar"], ["ゾ", "zo", "ゾーン", "zona"],
  ["ダ", "da", "ダンス", "tari"], ["ヂ", "ji", "ヂ", "variasi ji"], ["ヅ", "zu", "ヅ", "variasi zu"],
  ["デ", "de", "デパート", "toko serba ada"], ["ド", "do", "ドア", "pintu"],
  ["バ", "ba", "バス", "bus"], ["ビ", "bi", "ビデオ", "video"], ["ブ", "bu", "ブック", "buku"],
  ["ベ", "be", "ベル", "bel"], ["ボ", "bo", "ボール", "bola"],
];

const hiraHandakuon: Row[] = [
  ["ぱ", "pa", "パン", "roti"], ["ぴ", "pi", "ピアノ", "piano"], ["ぷ", "pu", "ぷりん", "puding"],
  ["ぺ", "pe", "ペン", "pena"], ["ぽ", "po", "ポスト", "kotak pos"],
];
const kataHandakuon: Row[] = [
  ["パ", "pa", "パソコン", "komputer"], ["ピ", "pi", "ピザ", "pizza"], ["プ", "pu", "プール", "kolam renang"],
  ["ペ", "pe", "ペット", "hewan peliharaan"], ["ポ", "po", "ポテト", "kentang"],
];

const hiraYouon: Row[] = [
  ["きゃ", "kya", "きゃく", "tamu"], ["きゅ", "kyu", "きゅうり", "mentimun"], ["きょ", "kyo", "きょり", "jarak"],
  ["しゃ", "sha", "しゃしん", "foto"], ["しゅ", "shu", "しゅっぱつ", "berangkat"], ["しょ", "sho", "しょくどう", "kantin"],
  ["ちゃ", "cha", "ちゃわん", "mangkuk"], ["ちゅ", "chu", "ちゅうごく", "Tiongkok"], ["ちょ", "cho", "ちょきん", "menabung"],
  ["にゃ", "nya", "にゃんこ", "kucing"], ["にゅ", "nyu", "にゅう", "masuk"], ["にょ", "nyo", "にょう", "尿"],
  ["ひゃ", "hya", "ひゃく", "seratus"], ["ひゅ", "hyu", "ひゅうどう", "弓道"], ["ひょ", "hyo", "ひょう", "豹"],
  ["みゃ", "mya", "みゃく", "denyut"], ["みゅ", "myu", "みゅう", "謡曲"], ["みょ", "myo", "みょう", "妙"],
  ["りゃ", "rya", "りゃく", "ringkas"], ["りゅ", "ryu", "りゅう", "naga"], ["りょ", "ryo", "りょこう", "perjalanan"],
  ["ぎゃ", "gya", "ぎゃく", "kebalikan"], ["ぎゅ", "gyu", "ぎゅうにく", "daging sapi"], ["ぎょ", "gyo", "ぎょ", "ikan"],
  ["じゃ", "ja", "じゃんけん", "suit"], ["じゅ", "ju", "じゅう", "sepuluh"], ["じょ", "jo", "じょせい", "perempuan"],
  ["びゃ", "bya", "びゃく", "百"], ["びゅ", "byu", "びゅう", "風"], ["びょ", "byo", "びょう", "penyakit"],
  ["ぴゃ", "pya", "ぴゃく", "百（変音）"], ["ぴゅ", "pyu", "ぴゅう", "風（変音）"], ["ぴょ", "pyo", "ぴょん", "melompat"],
];

const kataYouon: Row[] = [
  ["キャ", "kya", "キャンディ", "permen"], ["キュ", "kyu", "キュウリ", "mentimun"], ["キョ", "kyo", "キョロキョロ", "menoleh"],
  ["シャ", "sha", "シャツ", "kaos"], ["シュ", "shu", "シュート", "tendangan"], ["ショ", "sho", "ショップ", "toko"],
  ["チャ", "cha", "チャット", "chat"], ["チュ", "chu", "チューブ", "tabung"], ["チョ", "cho", "チョコ", "coklat"],
  ["ニャ", "nya", "ニャンコ", "kucing"], ["ニュ", "nyu", "ニュース", "berita"], ["ニョ", "nyo", "ニョキニョキ", "tumbuh"],
  ["ヒャ", "hya", "ヒャク", "seratus"], ["ヒュ", "hyu", "ヒューマン", "manusia"], ["ヒョ", "hyo", "ヒョウ", "macan tutul"],
  ["ミャ", "mya", "ミャンマー", "Myanmar"], ["ミュ", "myu", "ミュージック", "musik"], ["ミョ", "myo", "ミョウガ", "jahe"],
  ["リャ", "rya", "リャク", "ringkas"], ["リュ", "ryu", "リュック", "ransel"], ["リョ", "ryo", "リョコ", "perjalanan"],
  ["ギャ", "gya", "ギャング", "geng"], ["ギュ", "gyu", "ギュウ", "sapi"], ["ギョ", "gyo", "ギョーザ", "pangsit"],
  ["ジャ", "ja", "ジャズ", "jazz"], ["ジュ", "ju", "ジュース", "jus"], ["ジョ", "jo", "ジョギング", "lari pagi"],
  ["ビャ", "bya", "ビャク", "百"], ["ビュ", "byu", "ビューティー", "kecantikan"], ["ビョ", "byo", "ビョウ", "penyakit"],
  ["ピャ", "pya", "ピャク", "百"], ["ピュ", "pyu", "ピュア", "murni"], ["ピョ", "pyo", "ピョコ", "melompat"],
];

export const HIRAGANA: KanaChar[] = [
  ...build("hiragana", "Seion", hiraSeion),
  ...build("hiragana", "Dakuon", hiraDakuon),
  ...build("hiragana", "Handakuon", hiraHandakuon),
  ...build("hiragana", "Youon", hiraYouon),
  ...build("hiragana", "Sokuon", [["っ", "tsu (sokuon)", "がっこう", "sekolah — konsonan ganda"], ["、", "komma", "読む、書く", "tanda baca"]]),
  ...build("hiragana", "Chouon", [["ー", "chōon", "コーヒー", "vokal panjang"]]),
];

export const KATAKANA: KanaChar[] = [
  ...build("katakana", "Seion", kataSeion),
  ...build("katakana", "Dakuon", kataDakuon),
  ...build("katakana", "Handakuon", kataHandakuon),
  ...build("katakana", "Youon", kataYouon),
  ...build("katakana", "Sokuon", [["ッ", "tsu (sokuon)", "サッカー", "sepak bola — konsonan ganda"]]),
  ...build("katakana", "Chouon", [["ー", "chōon", "テレビ", "vokal panjang"]]),
];

export const KANA_CATEGORIES: KanaCategory[] = ["Seion", "Dakuon", "Handakuon", "Youon", "Sokuon", "Chouon"];

export function getKana(script: Script): KanaChar[] {
  return script === "hiragana" ? HIRAGANA : KATAKANA;
}
