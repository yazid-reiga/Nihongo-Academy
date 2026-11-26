export interface ExamCategoryInfo {
  code: string;
  name: string;
  fullName: string;
  description: string;
  objective: string;
  levels: string[];
  sections: string[];
  focus: string;
  reference: string;
}

export const EXAM_CATEGORIES: ExamCategoryInfo[] = [
  {
    code: "jlpt", name: "JLPT", fullName: "Japanese Language Proficiency Test",
    description: "Ujian kemahiran bahasa Jepang yang paling dikenal luas, dengan level N5 hingga N1.",
    objective: "Mengukur pengetahuan kosakata, grammar, dan kemampuan membaca serta mendengarkan.",
    levels: ["N5", "N4", "N3", "N2", "N1"],
    sections: ["Vocabulary", "Grammar", "Reading", "Listening", "Language Knowledge"],
    focus: "Pembelajaran umum bahasa Jepang terstruktur per level.",
    reference: "https://www.jlpt.jp/",
  },
  {
    code: "jtest", name: "J.TEST", fullName: "Practical Japanese Test",
    description: "Ujian yang menekankan pemahaman bahasa Jepang praktis dan penggunaan sehari-hari.",
    objective: "Mengukur kemampuan praktis melalui kosakata, grammar, reading, dan listening.",
    levels: ["Berbasis skor — konfigurasi level mengikuti informasi resmi terverifikasi"],
    sections: ["Vocabulary", "Grammar", "Reading", "Listening"],
    focus: "Bahasa Jepang praktis untuk komunikasi.",
    reference: "https://www.j-test.com/",
  },
  {
    code: "nat-test", name: "NAT-TEST", fullName: "Japanese Language NAT-TEST",
    description: "Ujian alternatif dengan sistem level 5Q hingga 1Q.",
    objective: "Menyediakan penilaian kemahiran bahasa Jepang dengan struktur bertingkat.",
    levels: ["5Q", "4Q", "3Q", "2Q", "1Q"],
    sections: ["Language Knowledge", "Reading", "Listening"],
    focus: "Persiapan bertingkat menyerupai struktur ujian kemahiran umum.",
    reference: "https://www.nat-test.com/",
  },
  {
    code: "jft-basic", name: "JFT-Basic", fullName: "Japan Foundation Test for Basic Japanese",
    description: "Ujian dasar dari Japan Foundation yang fokus pada situasi kehidupan sehari-hari.",
    objective: "Mengukur kemampuan bahasa Jepang dasar untuk kebutuhan praktis.",
    levels: ["Dasar"],
    sections: ["Script and Vocabulary", "Conversation and Expression", "Listening Comprehension", "Reading Comprehension"],
    focus: "Bahasa Jepang untuk kehidupan sehari-hari dan situasi praktis.",
    reference: "https://www.jpf.go.jp/",
  },
  {
    code: "bjt", name: "BJT", fullName: "Business Japanese Proficiency Test",
    description: "Ujian bahasa Jepang untuk konteks bisnis dan tempat kerja.",
    objective: "Mengukur kemampuan komunikasi Jepang dalam skenario profesional.",
    levels: ["Berbasis skor — konfigurasi mengikuti informasi resmi terverifikasi"],
    sections: ["Business Vocabulary", "Workplace Communication", "Business Conversation", "Email", "Meetings", "Workplace Situations", "Professional Japanese"],
    focus: "Skenario bisnis, email, rapat, dan komunikasi kerja.",
    reference: "https://www.kai-ip.jp/",
  },
  {
    code: "jlct", name: "JLCT", fullName: "Japanese Language Capability Test",
    description: "Ujian kemampuan bahasa Jepang bertingkat dengan pilihan level.",
    objective: "Menilai kemampuan bahasa Jepang sesuai level yang dipilih.",
    levels: ["Pilihan level mengikuti informasi resmi terverifikasi"],
    sections: ["Level selection", "Learning Materials", "Practice Questions", "Exam Simulation", "Results"],
    focus: "Struktur soal dan penilaian mengikuti referensi resmi yang diverifikasi.",
    reference: "https://www.jlct.jp/",
  },
  {
    code: "eju", name: "EJU", fullName: "Examination for Japanese University Admission",
    description: "Ujian bahasa Jepang akademik untuk masuk perguruan tinggi di Jepang.",
    objective: "Mengukur kemampuan bahasa Jepang akademik yang dibutuhkan di lingkungan universitas.",
    levels: ["Akademik"],
    sections: ["Academic Reading", "Listening", "Listening and Reading", "Academic Japanese"],
    focus: "Bahasa Jepang akademik — dipisahkan dari komunikasi sehari-hari.",
    reference: "https://www.jasso.go.jp/",
  },
];
