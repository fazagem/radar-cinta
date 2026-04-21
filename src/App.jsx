import { useState, useRef, useEffect } from "react";

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

// ─── SYSTEM PROMPTS ───────────────────────────────────────────────────────────
const SYS = {
  m3: (profile) => `Kamu adalah MIRA, Love Personal Assistant dari Radar Cinta. Modul 3: Radar Aktivasi. Kamu sudah tahu profil lengkap user berikut:\n\n${profile}\n\nBerikan rekomendasi SPESIFIK berdasarkan profil ini. Topik yang bisa dibahas: 1) Gaya cari jodoh yang cocok (aktif vs tunggu), 2) Rekomendasi 3 komunitas/tempat + peringatan bahaya red flag di sana, 3) Ide konten sosmed untuk memancarkan pesona, 4) Cara elegan membuka obrolan duluan, 5) Green flag yang harus dicari berdasarkan profil ini. Gunakan bahasa Indonesia sehari-hari. DILARANG istilah Inggris.`,
  m4: (profile) => `Kamu adalah MIRA, Love Personal Assistant dari Radar Cinta. Modul 4: Red Flag Detector. Kamu sudah tahu profil lengkap user:\n\n${profile}\n\nKASTA BAHAYA:\n🔴 HARGA MATI (suruh LARI, tegas keras): KDRT/Kasar Fisik, Selingkuh/Main Belakang, Riwayat Seks Bebas/Jajan, Judi Online, Narkoba/Mabuk, Penyimpangan Seksual, LGBTQ\n🟠 WASPADA TINGGI (pikir ulang 1000x): NPD/Haus Pujian Manipulatif, Mulut Kasar/Toxic, Mental Tidak Stabil, Sok Berkuasa/Patriarki Keras, Pemalas/Playing Victim, Kecanduan Konten Dewasa, Sangat Tertutup/Privasi Berlebih, Terlilit Hutang/Pinjol, Riwayat Penyakit Berat\n🟡 BISA DIBINA (diskusi mendalam dulu): Anak Mama/Tidak Mandiri, Belum Selesai dengan Mantan, Ekonomi Belum Mapan, Pelit & Perhitungan, Beban Keluarga Besar, Ibadah Bolong-bolong, Beda Visi/Latar Belakang, Hubungan Fisik Terlalu Jauh, Gaya Hidup Hedon\n\nCARA KERJA: Gali dengan 3-5 pertanyaan spesifik dulu. Setelah cukup info, beri VONIS tegas sesuai kasta. Selalu kaitkan dengan profil user — jelaskan MENGAPA red flag itu berbahaya SPESIFIK untuk kepribadian user ini. Bahasa Indonesia sehari-hari. DILARANG istilah Inggris.`,
  m5: (profile) => `Kamu adalah MIRA, Love Personal Assistant dari Radar Cinta. Modul 5: Final Audit — gerbang terakhir sebelum komitmen serius. Kamu sudah tahu profil lengkap user:\n\n${profile}\n\nTaktis, protektif, praktis. Bahasa Indonesia sehari-hari. Gunakan istilah lokal (SLIK OJK, GetContact, SIPP Pengadilan Agama, PDDIKTI, Perjanjian Pranikah). Menu yang tersedia: 1) INVESTIGASI MANDIRI: cara cek SLIK OJK, GetContact, Google nama, SIPP Pengadilan, PDDIKTI, mutasi rekening. 2) SOLUSI PENGAMAN: perjanjian pranikah, cek kesehatan H-3 bulan, tunda momongan, konseling pranikah. 3) BEDAH MASALAH KHUSUS: ada temuan spesifik dari calon? Selalu kaitkan saran dengan profil dan nilai user. DILARANG istilah Inggris.`,
};

// ─── MODUL 1 STATIC CONTENT ───────────────────────────────────────────────────
const M1_CONTENT = {
  "Ceritakan 10 penyesalan terbesar wanita setelah menikah": `**10 Penyesalan Terbesar Wanita Setelah Menikah**

Adik, ini bukan untuk menakut-nakutimu. Ini supaya kamu tidak menjadi salah satu dari mereka yang menyesal.

**1. Menikah karena tekanan, bukan kesiapan**
Dikejar usia, desakan orang tua, atau takut "keburu tua" — lalu memilih siapa saja yang ada. Hasilnya? Menikah dengan orang yang sebenarnya tidak benar-benar kamu inginkan.

**2. Mengabaikan red flag karena terlanjur cinta**
Waktu pacaran sudah kelihatan tanda-tandanya — kasar, tidak jujur, pemalas. Tapi dianggap "bisa berubah setelah nikah." Nyatanya, pernikahan tidak mengubah karakter. Justru memperburuknya.

**3. Tidak mengenal diri sendiri sebelum menikah**
Tidak tahu apa yang dibutuhkan, apa yang tidak bisa ditoleransi, dan seperti apa dirinya sendiri dalam hubungan. Akibatnya, baru sadar ketidakcocokan setelah sudah terlanjur.

**4. Menikah dengan orang yang beda visi soal anak**
Satu ingin banyak anak, satu tidak mau punya. Satu ingin anak disekolahkan di pesantren, satu tidak. Konflik ini bisa berlangsung seumur hidup.

**5. Mengabaikan kecocokan keluarga besar**
Menikah bukan cuma dengan orangnya — tapi dengan seluruh keluarganya. Mertua yang toxic, ipar yang mengusik, bisa menghancurkan rumah tangga paling harmonis sekalipun.

**6. Tidak membahas keuangan sebelum menikah**
Siapa yang pegang kendali? Bagaimana kalau ada utang? Apakah penghasilan digabung? Pertanyaan-pertanyaan ini dihindari karena terasa "tidak romantis" — padahal ini salah satu penyebab cerai terbesar.

**7. Berhenti berkembang setelah menikah**
Merasa sudah "sampai tujuan" lalu berhenti belajar, berhenti punya mimpi sendiri. Akhirnya kehilangan identitas dan merasa hampa di dalam rumah tangga yang tampak baik-baik saja dari luar.

**8. Tidak memiliki ruang untuk diri sendiri**
Terlalu lebur dengan peran sebagai istri dan ibu sampai lupa bahwa dia juga manusia yang butuh ruang, waktu, dan suara sendiri.

**9. Menikah dengan orang yang tidak menghargainya**
Bukan KDRT fisik — tapi diremehkan, tidak pernah diapresiasi, pendapatnya tidak dianggap. Luka ini tidak terlihat, tapi paling menggerogoti.

**10. Tidak meminta restu dengan sungguh-sungguh**
Menikah sembunyi-sembunyi, atau memaksakan pilihan yang tidak direstui orang tua. Bukan soal takhayul — tapi keberkahan itu nyata, dan memulai rumah tangga di atas konflik keluarga itu berat sekali.

---
Adik, dari 10 penyesalan ini — mana yang paling kamu rasa perlu diperhatikan dalam perjalananmu saat ini?`,

  "Apa saja kesalahan umum saat memilih pasangan hidup?": `**Kesalahan Umum Saat Memilih Pasangan Hidup**

Adik, banyak yang gagal bukan karena tidak cukup cinta — tapi karena salah dalam memilih. Ini kesalahan-kesalahan yang paling sering terjadi:

**❌ Silau pada satu kelebihan, buta pada kekurangan fatal**
Dia tinggi, tampan, mapan. Lalu semua kekurangan dianggap tidak ada. Padahal satu kelebihan tidak bisa menutupi satu kekurangan yang sifatnya fatal — seperti tempramental, tidak jujur, atau tidak punya tanggung jawab.

**❌ Memilih berdasarkan potensi, bukan kenyataan**
"Dia sekarang memang belum stabil, tapi aku yakin dia bisa berubah." Ini jebakan paling berbahaya. Kamu menikahi siapa dia SEKARANG — bukan siapa yang kamu harap dia jadi suatu hari nanti.

**❌ Terlalu fokus pada kriteria fisik dan materi**
Tinggi, ganteng, kaya — itu semua bisa berubah atau hilang. Yang bertahan adalah karakter, nilai hidup, dan cara dia memperlakukanmu di hari-hari biasa yang tidak ada siapa pun melihatnya.

**❌ Tidak mengamati cara dia mengelola emosi**
Bagaimana dia saat marah? Bagaimana dia saat kalah atau kecewa? Saat stres? Ini versi aslinya — dan versi ini yang akan kamu hadapi setiap hari dalam pernikahan.

**❌ Tidak mempertimbangkan kecocokan nilai dan prinsip**
Beda pandangan soal agama, pengasuhan anak, peran suami istri — ini bukan perbedaan kecil. Ini akan jadi gesekan yang terjadi berulang-ulang sepanjang pernikahan.

**❌ Terburu-buru karena takut sendirian**
Rasa takut ini membuat standar turun drastis. Yang penting "ada orangnya" — padahal pasangan yang salah jauh lebih menyakitkan daripada sendirian.

**❌ Tidak melibatkan orang-orang yang menyayangimu**
Orang tua, sahabat dekat, atau mentor sering kali melihat apa yang tidak kamu lihat. Pendapat mereka bukan penghalang — itu perlindungan.

---
Dari kesalahan-kesalahan ini, adakah yang sedang kamu rasakan dalam situasimu saat ini?`,

  "Mindset keliru apa yang sering dibawa ke dalam pernikahan?": `**Mindset Keliru yang Sering Dibawa ke Pernikahan**

Adik, banyak yang masuk ke pernikahan dengan kepala penuh harapan indah — tapi juga penuh keyakinan keliru yang diam-diam merusak.

**🚫 "Cinta sudah cukup untuk mempertahankan pernikahan"**
Cinta itu bahan bakar — tapi pernikahan butuh lebih dari itu. Butuh komunikasi, komitmen, kesabaran, dan keputusan aktif untuk terus memilih satu sama lain meski cinta sedang surut.

**🚫 "Dia pasti berubah setelah menikah"**
Pernikahan tidak mengubah orang. Justru tekanan hidup berumah tangga akan memperbesar siapa dia sebenarnya. Yang sabar jadi lebih sabar, yang tempramental jadi lebih meledak-ledak.

**🚫 "Kalau ada masalah, kami pasti bisa selesaikan berdua"**
Tanpa skill komunikasi yang nyata, masalah tidak selesai — hanya menumpuk. Banyak pasangan yang merasa baik-baik saja karena menghindari konflik, bukan karena benar-benar menyelesaikannya.

**🚫 "Pernikahan akan membuatku lebih bahagia"**
Pernikahan bukan solusi untuk kesepian atau tidak bahagia. Kalau kamu tidak bahagia sebelum menikah, pernikahan hanya akan memperbesar masalah yang sudah ada.

**🚫 "Kalau dia mencintaiku, dia harus tahu apa yang aku butuhkan tanpa aku bilang"**
Ini harapan yang tidak adil. Pasangan bukan pembaca pikiran. Komunikasi yang jelas dan jujur adalah kunci.

**🚫 "Konflik berarti hubungan ini bermasalah"**
Konflik itu normal dan sehat — kalau dikelola dengan benar. Yang berbahaya bukan konfliknya, tapi cara menghadapinya.

---
Mindset mana yang paling terasa dekat dengan apa yang kamu percayai selama ini?`,

  "Bagaimana cara meluruskan mindset yang keliru tentang pernikahan?": `**Cara Meluruskan Mindset yang Keliru tentang Pernikahan**

Adik, menyadari mindset yang keliru itu langkah pertama — dan itu sudah berani. Sekarang kita bahas cara meluruskannya secara nyata.

**✅ Ganti "cinta cukup" dengan "cinta + usaha aktif"**
Mulai latih diri untuk melihat hubungan bukan sebagai sesuatu yang "terjadi sendiri" tapi sesuatu yang dibangun setiap hari. Baca buku tentang pernikahan sehat, ikut seminar pranikah, diskusi terbuka soal ekspektasi masing-masing.

**✅ Belajar melihat seseorang apa adanya, bukan apa yang kamu harap**
Amati dia di situasi sulit. Bagaimana dia bicara dengan orang tua? Bagaimana dia saat lapar, capek, atau kalah? Itu dia yang asli.

**✅ Bangun kebahagiaan sebelum menikah**
Kalau ada hal yang belum selesai dalam dirimu — luka masa lalu, insecure, ketergantungan emosi — selesaikan sekarang. Ikut konseling, journaling, atau komunitas yang mendukung pertumbuhanmu.

**✅ Latih komunikasi sebagai kebiasaan, bukan hanya saat darurat**
Mulai dari sekarang, biasakan bicara jujur tentang perasaan dan kebutuhan — bahkan di hal-hal kecil. Ini fondasi yang akan kamu bawa ke dalam pernikahan.

**✅ Turunkan ekspektasi tentang "pasangan sempurna", naikkan standar tentang karakter**
Geser fokus dari "harus ganteng dan kaya" ke "harus jujur, bertanggung jawab, dan bisa diajak tumbuh bersama."

**✅ Bangun support system yang kuat di luar pernikahan**
Persahabatan yang sehat, hubungan baik dengan keluarga, dan komunitas yang positif — ini semua penyangga pernikahan yang sering diabaikan.

---
Mau mulai dari mana, Adik?`,

  "Ujian apa saja yang paling sering hadir dalam pernikahan?": `**Ujian yang Paling Sering Hadir dalam Pernikahan**

Adik, setiap pernikahan punya ujiannya sendiri. Tapi ada beberapa yang hampir semua pasangan pasti akan hadapi.

**💸 Ujian Finansial**
Ini salah satu penyebab konflik terbesar. Penghasilan yang tidak cukup, gaya hidup yang tidak seimbang, utang yang disembunyikan, atau perbedaan cara mengelola uang.

**👶 Ujian Hadirnya Anak**
Kehadiran anak mengubah segalanya — dinamika hubungan, waktu bersama, prioritas, bahkan identitas diri. Banyak pasangan yang hubungannya menjauh setelah punya anak karena tidak siap dengan perubahan ini.

**👨‍👩‍👧 Ujian Keluarga Besar**
Mertua yang terlalu ikut campur, saudara ipar yang bermasalah, atau ekspektasi keluarga yang berbeda — ini bisa menggerogoti rumah tangga pelan-pelan.

**😔 Ujian Kebosanan dan Rutinitas**
Cinta yang terasa "dingin" bukan selalu berarti tidak cinta lagi — tapi bisa karena rutinitas yang mematikan spontanitas.

**🏥 Ujian Kesehatan**
Sakit yang datang tiba-tiba — baik fisik maupun mental — menguji ketangguhan dan kesetiaan yang sesungguhnya. Ini momen di mana "dalam suka dan duka" benar-benar diuji.

**🎯 Ujian Perbedaan Visi**
Satu ingin pindah kota, satu tidak mau jauh dari orang tua. Kalau visi tidak diselaraskan sejak awal, ini akan jadi gesekan yang terus berulang.

**💔 Ujian Kepercayaan**
Bisa berupa perselingkuhan, kebohongan kecil yang menumpuk, atau rasa curiga yang tidak pernah diselesaikan.

---
Dari ujian-ujian ini, mana yang paling kamu khawatirkan?`,

  "Bagaimana cara menentukan visi misi pernikahan yang kuat?": `**Cara Menentukan Visi Misi Pernikahan yang Kuat**

Adik, rumah tangga tanpa visi seperti kapal tanpa nahkoda — bergerak, tapi tidak tahu ke mana.

**🧭 Mulai dari pertanyaan besar**
Jawab dulu untuk dirimu sendiri:
- Pernikahan seperti apa yang kamu impikan?
- Keluarga seperti apa yang ingin kamu bangun?
- Nilai apa yang harus selalu ada di rumah tanggamu?
- Warisan apa yang ingin kamu tinggalkan untuk anak-anakmu?

**💬 Visi harus dibicarakan, bukan diasumsikan**
Jangan anggap pasangan punya visi yang sama hanya karena sama-sama "ingin menikah." Diskusikan secara konkret: ingin punya berapa anak? Tinggal di mana? Peran masing-masing seperti apa?

**📌 Bedakan visi dan misi**
- **Visi** = gambaran besar ("Membangun keluarga sakinah yang bermanfaat bagi sekitar")
- **Misi** = langkah nyata ("Menjaga shalat berjamaah, mendiskusikan keuangan setiap bulan, quality time tanpa gadget setiap minggu")

**🤝 Visi harus disepakati, bukan dipaksakan**
Pasangan yang baik adalah yang bisa duduk bersama dan membangun visi yang sama-sama dimiliki dan diperjuangkan.

**📝 Tuliskan dan tempel**
Tulis visi pernikahanmu, tempel di tempat yang sering kamu lihat. Jadi pengingat di hari-hari ketika lelah dan tergoda untuk menyerah.

---
Sudahkah kamu punya gambaran visi pernikahan yang kamu inginkan?`,

  "Bagaimana menentukan kriteria pasangan yang realistis?": `**Cara Menentukan Kriteria Pasangan yang Realistis**

Adik, punya kriteria itu bagus — tanda kamu menghargai dirimu sendiri. Tapi kriteria yang tidak realistis justru bisa jadi penjara.

**📋 Pisahkan kriteria menjadi 3 lapisan:**

**Lapisan 1: Harga Mati (non-negotiable)**
Ini yang benar-benar tidak bisa dikompromikan. Bukan soal fisik — tapi soal nilai dan karakter fundamental.
Contoh: harus seiman, tidak pernah melakukan kekerasan, jujur, mau bertanggung jawab.
*Batasi maksimal 5 hal saja.*

**Lapisan 2: Sangat Diinginkan (important but flexible)**
Hal-hal yang kamu harapkan ada, tapi masih bisa difleksibelkan.
Contoh: punya penghasilan stabil, keluarga yang harmonis, gaya hidup yang serupa.

**Lapisan 3: Bonus (nice to have)**
Preferensi yang menyenangkan tapi bukan penentu.
Contoh: tinggi ideal, hobi yang sama, selera humor yang cocok.

**🔍 Periksa motivasi di balik kriteriamu**
Tanya: "Ini kriteria karena aku benar-benar butuh, atau karena pengaruh ekspektasi orang lain / trauma masa lalu?"

**⚖️ Seimbangkan antara standar diri dan standar pasangan**
Kriteria setinggi apa pun harus sebanding dengan apa yang bisa kamu tawarkan.

**🚫 Hindari kriteria yang mendeskripsikan "sempurna"**
Tidak ada manusia sempurna. Yang ada adalah manusia yang tepat — yang cocok dengan nilai-nilaimu dan membuatmu menjadi versi terbaik dirimu.

---
Mau coba tulis 3 lapisan kriteriamu? MIRA bisa bantu evaluasi.`,

  "Apa saja sinyal yang menunjukkan kamu harus mundur dari hubungan?": `**Sinyal Kamu Harus Mundur dari Hubungan**

Adik, mundur bukan kalah. Mundur adalah keputusan paling berani demi melindungi dirimu dan masa depanmu.

**🔴 Sinyal Harga Mati — Langsung Mundur:**

- Pernah melakukan kekerasan fisik, sekali pun
- Ketahuan selingkuh atau berbohong soal hal fundamental
- Kecanduan judi, narkoba, atau minuman keras
- Ada riwayat pelecehan seksual atau perilaku menyimpang

**🟠 Sinyal Waspada Tinggi — Pikir Ulang 1000x:**

- Kamu selalu merasa berjalan di atas kulit telur — takut membuatnya marah
- Kata-katanya sering meremehkan atau mempermalukanmu (bahkan "bercanda")
- Dia mengisolasimu dari teman dan keluarga
- Kamu lebih bahagia saat dia tidak ada daripada saat dia ada
- Dia tidak pernah minta maaf dengan tulus — selalu ada pembenaran

**🟡 Sinyal Perlu Evaluasi Mendalam:**

- Sudah berkali-kali membahas masalah yang sama tapi tidak ada perubahan nyata
- Keluarganya tidak merestui dengan alasan yang masuk akal
- Kamu merasa harus menjadi orang yang berbeda agar bisa diterima olehnya
- Lebih sering khawatir tentang hubungan ini daripada merasa tenang dan aman

**💡 Yang perlu kamu ingat:**
Kamu tidak harus menunggu sampai situasi memburuk untuk memutuskan mundur. Memilih dirimu sendiri bukan egois — itu bijak.

---
Apakah ada dari sinyal-sinyal ini yang sedang kamu rasakan sekarang?`,

  "Bagaimana tahu kapan waktu yang tepat untuk menikah?": `**Kapan Waktu yang Tepat untuk Menikah?**

Adik, ini lebih dalam dari sekadar soal usia atau "sudah ketemu orangnya." Ini soal kesiapan yang nyata.

**✅ Kamu siap menikah ketika:**

**Kamu sudah kenal dirimu sendiri**
Kamu tahu apa yang kamu butuhkan, apa yang tidak bisa kamu toleransi, dan bagaimana kamu bereaksi saat konflik.

**Kamu menikah karena pilihan, bukan pelarian**
Bukan karena takut sendirian, bukan karena tekanan keluarga, bukan karena ingin kabur dari situasi hidup yang tidak menyenangkan.

**Kamu sudah bisa mengelola dirimu sendiri**
Finansial, emosi, dan rutinitas harian. Kalau kamu belum bisa mengurus dirimu sendiri, sangat berat untuk mengurus kehidupan bersama orang lain.

**Kamu bisa mencintai tanpa kehilangan dirimu**
Kamu tidak kehilangan identitas, teman, atau nilai-nilaimu hanya karena ada orang yang kamu suka.

**Kamu sudah selesai dengan luka masa lalu**
Bukan harus sempurna — tapi setidaknya kamu sudah memproses dan tidak membawa luka lama sebagai beban.

**Kamu dan dia sudah membicarakan hal-hal besar**
Soal anak, finansial, tempat tinggal, peran masing-masing, nilai hidup. Bukan hanya berasa cocok.

**⏰ Soal usia:**
Usia bukan penentu utama. Yang menentukan bukan angkanya — tapi kualitas kesiapanmu.

**🚫 Jangan menikah hanya karena:**
Usia sudah "kepala tiga", teman-teman sudah menikah semua, atau takut tidak ada yang mau lagi.

---
Dari semua poin ini — di mana kamu merasa sudah siap, dan di mana kamu masih perlu tumbuh?`,
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const MOD_INFO = [
  { icon: "📖", name: "Modul 1", desc: "Marriage Mindset", badge: "Materi", badgeColor: "blue" },
  { icon: "🪞", name: "Modul 2", desc: "Self Profiling", badge: "Form + CV", badgeColor: "purple" },
  { icon: "📡", name: "Modul 3", desc: "Radar Aktivasi", badge: "Strategi", badgeColor: "green" },
  { icon: "🚩", name: "Modul 4", desc: "Red Flag Detector", badge: "24 Topik", badgeColor: "red" },
  { icon: "🔒", name: "Modul 5", desc: "Final Audit", badge: "Investigasi", badgeColor: "amber" },
];

const BADGE_COLORS = {
  red: "bg-rose-50 text-rose-700",
  amber: "bg-amber-50 text-amber-700",
  green: "bg-emerald-50 text-emerald-700",
  blue: "bg-blue-50 text-blue-700",
  purple: "bg-purple-50 text-purple-700",
};

const RED_FLAGS = [
  { id:1, label:"Haus Pujian / Manipulatif", sub:"Suka memutarbalikkan fakta", cat:"Karakter & Mental", kasta:"orange" },
  { id:2, label:"Kasar Fisik / KDRT", sub:"Pernah main tangan atau merusak barang", cat:"Karakter & Mental", kasta:"red" },
  { id:3, label:"Mulut Kasar / Toxic", sub:"Suka merendahkan atau menghina", cat:"Karakter & Mental", kasta:"orange" },
  { id:4, label:"Anak Mama", sub:"Apa-apa harus tanya ibu, tidak mandiri", cat:"Karakter & Mental", kasta:"yellow" },
  { id:5, label:"Mental Tidak Stabil", sub:"Suka tantrum atau ancam menyakiti diri", cat:"Karakter & Mental", kasta:"orange" },
  { id:6, label:"Sok Berkuasa", sub:"Meremehkan perempuan, patriarki keras", cat:"Karakter & Mental", kasta:"orange" },
  { id:7, label:"Pemalas", sub:"Suka menyalahkan keadaan, tidak ada usaha", cat:"Karakter & Mental", kasta:"orange" },
  { id:8, label:"Main Belakang", sub:"Masih cari-cari lain, pakai aplikasi kencan", cat:"Kesetiaan & Integritas", kasta:"red" },
  { id:9, label:"Belum Selesai dengan Mantan", sub:"Suka bahas masa lalu terus", cat:"Kesetiaan & Integritas", kasta:"yellow" },
  { id:10, label:"Riwayat Seks Bebas", sub:"Riwayat jajan atau seks bebas", cat:"Kesetiaan & Integritas", kasta:"red" },
  { id:11, label:"Kecanduan Konten Dewasa", sub:"PMO atau kecanduan pornografi", cat:"Kesetiaan & Integritas", kasta:"orange" },
  { id:12, label:"Penyimpangan Seksual", sub:"Orientasi atau perilaku menyimpang", cat:"Kesetiaan & Integritas", kasta:"red" },
  { id:13, label:"Sangat Tertutup", sub:"HP dipasangi sandi berlapis, rahasia banget", cat:"Kesetiaan & Integritas", kasta:"orange" },
  { id:14, label:"Judi Online", sub:"Main judol, bahkan sembunyi-sembunyi", cat:"Keuangan & Masa Depan", kasta:"red" },
  { id:15, label:"Terlilit Hutang / Pinjol", sub:"Banyak cicilan atau hutang konsumtif", cat:"Keuangan & Masa Depan", kasta:"orange" },
  { id:16, label:"Ekonomi Belum Mapan", sub:"Finansial belum stabil, tanpa usaha perbaikan", cat:"Keuangan & Masa Depan", kasta:"yellow" },
  { id:17, label:"Pelit & Perhitungan", sub:"Bagi dua sampai recehan", cat:"Keuangan & Masa Depan", kasta:"yellow" },
  { id:18, label:"Beban Keluarga Besar", sub:"Menanggung hidup banyak orang", cat:"Keuangan & Masa Depan", kasta:"yellow" },
  { id:19, label:"Narkoba / Mabuk", sub:"Konsumsi zat terlarang atau alkohol", cat:"Lain-lain", kasta:"red" },
  { id:20, label:"Beda Visi / Latar Belakang", sub:"Keluarga tidak restu, nilai sangat berbeda", cat:"Lain-lain", kasta:"yellow" },
  { id:21, label:"Ibadah Bolong-bolong", sub:"Tidak konsisten dalam ibadah wajib", cat:"Lain-lain", kasta:"yellow" },
  { id:22, label:"Hubungan Fisik Terlalu Jauh", sub:"Sering minta aneh-aneh sebelum nikah", cat:"Lain-lain", kasta:"yellow" },
  { id:23, label:"Gaya Hidup Hedon", sub:"Boros, flexing, biar dibilang keren", cat:"Lain-lain", kasta:"yellow" },
  { id:24, label:"Riwayat Penyakit Berat", sub:"Ada kondisi medis genetik atau kronis", cat:"Lain-lain", kasta:"orange" },
];

const KASTA_STYLE = {
  red: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", badge: "bg-rose-100 text-rose-700", label: "🔴 Harga Mati" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", badge: "bg-orange-100 text-orange-700", label: "🟠 Waspada Tinggi" },
  yellow: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700", label: "🟡 Bisa Dibina" },
};

const QUESTIONS = [
  { id:1, batch:1, cat:"Identitas", q:"Nama lengkap, usia, domisili, dan anak ke-berapa dari berapa bersaudara?" },
  { id:2, batch:1, cat:"Fisik", q:"Tinggi, berat badan, dan bagaimana standar kebersihan dirimu?" },
  { id:3, batch:1, cat:"Latar Belakang", q:"Suku, pekerjaan saat ini, dan latar belakang orang tua?" },
  { id:4, batch:1, cat:"Pola Asuh", q:"Bagaimana gaya komunikasi dan pola asuh di rumahmu waktu kecil?" },
  { id:5, batch:1, cat:"Nilai Keluarga", q:"Nilai keluarga apa yang paling membentuk karaktermu saat ini?" },
  { id:6, batch:1, cat:"Pendidikan", q:"Pendidikan terakhir dan bagaimana pengaruhnya pada cara berpikirmu?" },
  { id:7, batch:1, cat:"Prestasi", q:"Sebutkan 2–3 pencapaian hidup yang paling membanggakanmu." },
  { id:8, batch:1, cat:"Hobi", q:"Aktivitas apa yang paling sering dilakukan saat waktu luang?" },
  { id:9, batch:1, cat:"Passion", q:"Apa satu hal yang selalu membuatmu bersemangat saat dibahas?" },
  { id:10, batch:1, cat:"Keahlian", q:"Skill apa yang paling sering mendapat apresiasi dari orang lain?" },
  { id:11, batch:1, cat:"Komunitas", q:"Organisasi atau komunitas yang paling mengubah hidupmu?" },
  { id:12, batch:1, cat:"Role Model", q:"Siapa sosok yang paling menginspirasimu dan kenapa?" },
  { id:13, batch:1, cat:"Spiritual", q:"Tokoh atau guru agama yang sering kamu ikuti pemikirannya?" },
  { id:14, batch:1, cat:"Pengaruh Agama", q:"Seberapa besar agama memengaruhi keputusan-keputusan pentingmu?" },
  { id:15, batch:1, cat:"Prinsip Moral", q:"Prinsip apa yang tidak akan kamu langgar dalam kondisi sesulit apapun?" },
  { id:16, batch:1, cat:"Ibadah Rutin", q:"Satu praktik ibadah yang paling konsisten kamu jaga?" },
  { id:17, batch:1, cat:"Tantangan Ibadah", q:"Praktik ibadah yang masih sulit kamu konsistensikan saat ini?" },
  { id:18, batch:1, cat:"Toleransi", q:"Pandanganmu jika lingkungan pasangan berbeda prinsip agama denganmu?" },
  { id:19, batch:1, cat:"Karakter Positif", q:"Apa 3 kelebihan terbaikmu yang disyukuri orang lain?" },
  { id:20, batch:1, cat:"Kelemahan", q:"Satu kebiasaan buruk yang paling ingin kamu ubah?" },
  { id:21, batch:2, cat:"Karier", q:"Pekerjaan saat ini dan ambisi karier 5 tahun ke depan?" },
  { id:22, batch:2, cat:"Wanita Bekerja", q:"Pandanganmu tentang wanita yang tetap bekerja setelah menikah?" },
  { id:23, batch:2, cat:"Stabilitas", q:"Definisi 'mapan' secara ekonomi menurut standarmu?" },
  { id:24, batch:2, cat:"Gaya Finansial", q:"Kamu tipe penabung atau penikmat hidup? Jelaskan." },
  { id:25, batch:2, cat:"Transparansi", q:"Apakah keuangan rumah tangga harus terbuka total antara pasangan?" },
  { id:26, batch:2, cat:"Utang", q:"Pandanganmu tentang Paylater atau kartu kredit untuk gaya hidup?" },
  { id:27, batch:2, cat:"Investasi", q:"Bagaimana pandanganmu soal investasi (emas, saham, properti)?" },
  { id:28, batch:2, cat:"Sandwich Gen", q:"Apakah kamu punya tanggungan finansial ke keluarga besar saat ini?" },
  { id:29, batch:2, cat:"Pinjaman", q:"Responmu jika teman atau saudara ingin meminjam uang?" },
  { id:30, batch:2, cat:"Tempat Tinggal", q:"Ingin tinggal mandiri atau bersedia tinggal bersama mertua?" },
  { id:31, batch:2, cat:"Tugas Domestik", q:"Bagaimana idealnya pembagian tugas rumah tangga?" },
  { id:32, batch:2, cat:"Gaya Liburan", q:"Preferensi liburan: alam bebas, staycation mewah, atau wisata religi?" },
  { id:33, batch:2, cat:"Privasi Digital", q:"Haruskah pasangan saling tahu kata sandi HP dan sosmed?" },
  { id:34, batch:2, cat:"Social Media", q:"Batasanmu dalam memposting kemesraan di media sosial?" },
  { id:35, batch:2, cat:"Lawan Jenis", q:"Batasanmu berteman dengan lawan jenis setelah menikah?" },
  { id:36, batch:2, cat:"Standar Rumah", q:"Seberapa penting kerapihan dan kebersihan rumah bagimu (1–10)?" },
  { id:37, batch:2, cat:"Konsumerisme", q:"Barang termahal yang pernah dibeli — apakah itu perlu?" },
  { id:38, batch:2, cat:"Time Management", q:"Bagaimana kamu mengatur waktu antara pekerjaan dan keluarga?" },
  { id:39, batch:2, cat:"Kesehatan", q:"Pola makan dan olahraga harianmu saat ini?" },
  { id:40, batch:2, cat:"Lingkungan", q:"Tipe lingkungan tetangga seperti apa yang kamu inginkan?" },
  { id:41, batch:3, cat:"Trauma", q:"Kejadian sulit yang paling mengubah cara pandangmu terhadap hidup?" },
  { id:42, batch:3, cat:"Trigger", q:"Apa yang paling cepat membuatmu merasa insecure?" },
  { id:43, batch:3, cat:"Gaya Marah", q:"Responmu saat kecewa: diam, bicara logis, atau meledak?" },
  { id:44, batch:3, cat:"Kritik", q:"Bagaimana kamu merespons kritik keras dari pasangan?" },
  { id:45, batch:3, cat:"Logika vs Emosi", q:"Mana yang lebih sering menang dalam dirimu: logika atau perasaan?" },
  { id:46, batch:3, cat:"Otoritas", q:"Siapa idealnya pemegang keputusan akhir dalam rumah tangga?" },
  { id:47, batch:3, cat:"Komunikasi", q:"Hal apa yang paling sulit kamu bicarakan secara jujur?" },
  { id:48, batch:3, cat:"Love Language", q:"Apa bahasa cintamu dan bagaimana ingin diperlakukan saat sedih?" },
  { id:49, batch:3, cat:"Afeksi", q:"Seberapa penting kedekatan fisik dibanding kedalaman obrolan?" },
  { id:50, batch:3, cat:"People Pleasing", q:"Apakah kamu sering sulit berkata 'tidak' pada orang lain?" },
  { id:51, batch:3, cat:"Must-Have", q:"Sifat apa yang wajib ada agar kamu merasa aman dalam hubungan?" },
  { id:52, batch:3, cat:"Red Flag T1", q:"3 hal yang langsung membuatmu pergi — deal breaker mutlak?" },
  { id:53, batch:3, cat:"Red Flag T2", q:"Hal yang membuatmu berpikir 1000x sebelum melanjutkan hubungan?" },
  { id:54, batch:3, cat:"Masa Lalu", q:"Bisakah menerima pasangan yang punya masa lalu kelam?" },
  { id:55, batch:3, cat:"Parenting", q:"Gaya pengasuhan seperti apa yang ingin kamu terapkan pada anak?" },
  { id:56, batch:3, cat:"Pendidikan Anak", q:"Prioritas pendidikan anak: agama, akademik, atau soft skill?" },
  { id:57, batch:3, cat:"Loyalitas", q:"Definisi 'setia' yang paling konkret bagimu?" },
  { id:58, batch:3, cat:"Kesulitan Hidup", q:"Apa yang kamu lakukan jika pasangan tiba-tiba bangkrut?" },
  { id:59, batch:3, cat:"Harapan", q:"Satu doa yang paling sering kamu panjatkan tentang jodoh?" },
  { id:60, batch:3, cat:"Visi Pernikahan", q:"Apa arti 'Rumah' bagimu dalam sebuah pernikahan?" },
];

const M1_TOPICS = [
  { icon:"😔", title:"10 Penyesalan Terbesar", desc:"Alasan paling umum wanita menyesal setelah menikah", msg:"Ceritakan 10 penyesalan terbesar wanita setelah menikah" },
  { icon:"⚠️", title:"Kesalahan Memilih Pasangan", desc:"Jangan silau satu kelebihan sampai lupa kekurangan fatal", msg:"Apa saja kesalahan umum saat memilih pasangan hidup?" },
  { icon:"🧠", title:"Mindset Keliru", desc:"Meluruskan ekspektasi vs realita kehidupan rumah tangga", msg:"Mindset keliru apa yang sering dibawa ke dalam pernikahan?" },
  { icon:"🔧", title:"Meluruskan Mindset", desc:"Cara pandang sehat soal kelebihan dan kekurangan pasangan", msg:"Bagaimana cara meluruskan mindset yang keliru tentang pernikahan?" },
  { icon:"🌊", title:"Ujian Dalam Pernikahan", desc:"Setiap pernikahan punya ujian — begini cara menghadapinya", msg:"Ujian apa saja yang paling sering hadir dalam pernikahan?" },
  { icon:"🧭", title:"Visi Misi Pernikahan", desc:"Rumah tangga tanpa arah seperti kapal tanpa nahkoda", msg:"Bagaimana cara menentukan visi misi pernikahan yang kuat?" },
  { icon:"✅", title:"Kriteria Pasangan Realistis", desc:"Cara menentukan kriteria yang tidak membutakan", msg:"Bagaimana menentukan kriteria pasangan yang realistis?" },
  { icon:"🚪", title:"Sinyal Harus Mundur", desc:"Tanda-tanda kamu harus mundur sebelum terlambat", msg:"Apa saja sinyal yang menunjukkan kamu harus mundur dari hubungan?" },
  { icon:"⏰", title:"Waktu yang Tepat Menikah", desc:"Kapan sesungguhnya kamu benar-benar siap?", msg:"Bagaimana tahu kapan waktu yang tepat untuk menikah?" },
];

const M3_TOPICS = [
  { icon:"🎯", title:"Gaya Cari Jodoh", desc:"Aktif mencari atau menunggu — mana yang cocok untukmu?", msg:"Berdasarkan profilku, gaya cari jodoh mana yang paling cocok untukku?" },
  { icon:"🏘️", title:"Komunitas & Tempat", desc:"3 rekomendasi tempat terbaik + peringatan bahaya di sana", msg:"Di komunitas atau tempat mana aku paling bisa menemukan jodoh yang sesuai profilku? Berikan juga peringatan bahaya red flag di masing-masing tempat." },
  { icon:"📱", title:"Pesona di Sosial Media", desc:"Ide konten yang memancarkan daya tarikmu", msg:"Berikan 2-3 ide konten sosial media yang bisa memancarkan pesona berdasarkan kepribadianku." },
  { icon:"💬", title:"Cara Buka Obrolan", desc:"Cara elegan memulai percakapan duluan", msg:"Bagaimana cara elegan dan sesuai kepribadianku untuk membuka obrolan duluan dengan seseorang yang aku suka?" },
  { icon:"💚", title:"Green Flag yang Dicari", desc:"Tanda-tanda konkret dia orang yang tepat untukmu", msg:"Berdasarkan profilku, apa saja green flag konkret yang harus aku cari dari calon pasangan?" },
  { icon:"🔍", title:"Profil Pasangan Ideal", desc:"Gambaran lengkap pasangan yang paling kompatibel", msg:"Berdasarkan profilku secara menyeluruh, seperti apa gambaran pasangan yang paling kompatibel denganku?" },
];

const M5_TOPICS = [
  { icon:"🔎", title:"Investigasi Mandiri", desc:"SLIK OJK, GetContact, jejak digital, riwayat hukum, validasi ijazah", msg:"Ajarkan aku cara melakukan investigasi mandiri sebelum menikah — mulai dari SLIK OJK, GetContact, sampai SIPP Pengadilan." },
  { icon:"🛡️", title:"Solusi Pengaman", desc:"Perjanjian pranikah, cek kesehatan, konseling pranikah", msg:"Apa saja solusi pengaman yang perlu aku siapkan sebelum menikah?" },
  { icon:"⚠️", title:"Bedah Masalah Khusus", desc:"Ada temuan spesifik dari calonmu? Ceritakan di sini", msg:"Aku ingin menceritakan temuan spesifik dari calonku untuk mendapat saran yang tepat." },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function formatProfile(answers) {
  return QUESTIONS.map(q => `${q.cat}: ${answers[q.id] || "(tidak diisi)"}`).join("\n");
}

function formatCV(answers) {
  const a = (id) => answers[id] || "-";
  return {
    profilDasar: { nama: a(1), fisik: a(2), latar: a(3), pendidikan: a(6), karier: a(21) },
    karakterKepribadian: { kelebihan: a(19), kelemahan: a(20), loveLang: a(48), gayaMarah: a(43) },
    nilaiPrinsip: { agama: a(14), prinsip: a(15), ibadah: a(16), toleransi: a(18) },
    gayaHidup: { kesehatan: a(39), hobi: a(8), lingkungan: a(40), finansial: a(24) },
    harapanPernikahan: { mustHave: a(51), parenting: a(55), harapan: a(59), visi: a(60) },
    perluDiketahui: { tanggungan: a(28), dealBreaker: a(52), batasan: a(35), masaLalu: a(54) },
  };
}

// ─── STREAMING AI CALL ────────────────────────────────────────────────────────
async function callAIStream(system, messages, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      stream: true,
      system,
      messages: messages.slice(-14),
    }),
  });
  if (!res.ok) throw new Error("API error");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
            onChunk(parsed.delta.text);
          }
        } catch {}
      }
    }
  }
}

// ─── RENDER HELPERS ───────────────────────────────────────────────────────────
function renderHtml(text) {
  return text
    .replace(/\n/g, "<br/>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function TypingBubble() {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold flex-shrink-0">M</div>
      <div className="px-3 py-2.5 rounded-2xl rounded-tl-sm bg-white border border-gray-100 shadow-sm flex gap-1 items-center">
        {[0,1,2].map(i => (
          <span key={i} style={{animationDelay:`${i*0.18}s`}}
            className="w-1.5 h-1.5 rounded-full bg-rose-300 inline-block animate-bounce" />
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ msg }) {
  const isUser = msg.role === "user";
  const isDanger = !isUser && ["harga mati","segera mundur","langsung pergi","tinggalkan dia","harus lari","LARI"].some(w => msg.content.includes(w));
  if (isDanger) return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-rose-700 text-sm leading-relaxed">
      🚨 <span dangerouslySetInnerHTML={{__html: renderHtml(msg.content)}} />
    </div>
  );
  return (
    <div className={`flex gap-2 items-end ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mb-0.5">M</div>}
      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-xs sm:max-w-sm ${
        isUser ? "bg-rose-500 text-white rounded-br-sm" : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm"
      }`} dangerouslySetInnerHTML={{__html: renderHtml(msg.content)}} />
    </div>
  );
}

function StreamingBubble({ text }) {
  return (
    <div className="flex gap-2 items-end">
      <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mb-0.5">M</div>
      <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-xs sm:max-w-sm bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm"
        dangerouslySetInnerHTML={{__html: renderHtml(text)}} />
    </div>
  );
}

function ChatArea({ history, loading, onSend, showTopics, topics, onTopicSelect, onBack, streamingText }) {
  const ref = useRef(null);
  const [input, setInput] = useState("");
  useEffect(() => { if(ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [history, loading, streamingText]);

  const send = () => { if(!input.trim() || loading) return; onSend(input.trim()); setInput(""); };

  if (showTopics) return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs text-gray-500 mb-3 font-medium">Pilih topik yang ingin kamu bahas:</p>
        <div className="flex flex-col gap-2">
          {topics.map((t, i) => (
            <button key={i} onClick={() => onTopicSelect(t.msg)}
              className="text-left p-3.5 rounded-xl border border-gray-100 bg-white hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm">
              <div className="text-sm font-semibold text-gray-800">{t.icon} {t.title}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {history.length > 0 && (
        <div className="px-3 pt-2 pb-1 border-b border-gray-50">
          <button onClick={onBack} className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium">
            ← Kembali ke pilihan topik
          </button>
        </div>
      )}
      <div ref={ref} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {history.map((m, i) => <ChatBubble key={i} msg={m} />)}
        {loading && streamingText === "" && <TypingBubble />}
        {streamingText !== "" && <StreamingBubble text={streamingText} />}
      </div>
      <div className="p-3 border-t border-gray-100 bg-white flex gap-2 items-end">
        <textarea
          className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-gray-50 outline-none focus:border-rose-300 focus:bg-white min-h-10 max-h-28 leading-relaxed"
          placeholder="Ketik pesanmu ke MIRA..."
          rows={1} value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send(); }}}
        />
        <button onClick={send} disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-rose-600 active:scale-95 transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

// ─── MODULE 1 — STATIC PRELOADED ─────────────────────────────────────────────
function Mod1({ history, loading, onSend, onReset, streamingText }) {
  const [selected, setSelected] = useState(null);
  const handleSelect = (msg) => {
    setSelected(msg);
    const staticContent = M1_CONTENT[msg];
    onSend(msg, null, staticContent || null);
  };
  const handleBack = () => { setSelected(null); onReset(); };
  return (
    <ChatArea showTopics={!selected || history.length === 0} topics={M1_TOPICS}
      history={history} loading={loading} streamingText={streamingText}
      onSend={(t) => onSend(t, t, null)} onTopicSelect={handleSelect} onBack={handleBack} />
  );
}

// ─── MODULE 2 ─────────────────────────────────────────────────────────────────
function Mod2({ answers, setAnswers, profileDone, setProfileDone }) {
  const [batch, setBatch] = useState(1);
  const [view, setView] = useState("form");
  const [localAnswers, setLocalAnswers] = useState(answers);
  const batchQs = QUESTIONS.filter(q => q.batch === batch);
  const totalFilled = QUESTIONS.filter(q => localAnswers[q.id]?.trim()).length;
  const pct = Math.round((totalFilled / 60) * 100);
  const handleChange = (id, val) => setLocalAnswers(a => ({...a, [id]: val}));
  const handleNext = () => {
    if (batch < 3) setBatch(b => b + 1);
    else { setAnswers(localAnswers); setProfileDone(true); setView("cv"); }
  };
  const cv = formatCV(localAnswers);

  if (view === "cv" && profileDone) return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="text-sm font-bold text-gray-800">📄 CV Nikah</h3><p className="text-xs text-gray-500">Profil untuk calon suami</p></div>
          <div className="flex gap-2">
            <button onClick={() => { setView("form"); setBatch(1); }} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">✏️ Edit</button>
            <button onClick={() => window.print()} className="text-xs px-3 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600">🖨️ Print</button>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { title:"👤 Profil Dasar", items:[["Nama & Identitas",cv.profilDasar.nama],["Fisik & Kebersihan",cv.profilDasar.fisik],["Latar Belakang",cv.profilDasar.latar],["Pendidikan",cv.profilDasar.pendidikan],["Karier & Ambisi",cv.profilDasar.karier]] },
            { title:"✨ Karakter & Kepribadian", items:[["3 Kelebihan Utama",cv.karakterKepribadian.kelebihan],["Kelemahan yang Diperbaiki",cv.karakterKepribadian.kelemahan],["Bahasa Cinta",cv.karakterKepribadian.loveLang],["Cara Menghadapi Konflik",cv.karakterKepribadian.gayaMarah]] },
            { title:"🕌 Nilai & Prinsip Hidup", items:[["Peran Agama",cv.nilaiPrinsip.agama],["Prinsip Moral",cv.nilaiPrinsip.prinsip],["Ibadah Rutin",cv.nilaiPrinsip.ibadah],["Toleransi Perbedaan",cv.nilaiPrinsip.toleransi]] },
            { title:"🌿 Gaya Hidup", items:[["Kesehatan & Olahraga",cv.gayaHidup.kesehatan],["Hobi & Minat",cv.gayaHidup.hobi],["Lingkungan Ideal",cv.gayaHidup.lingkungan],["Gaya Finansial",cv.gayaHidup.finansial]] },
            { title:"💍 Harapan Pernikahan", items:[["Must-Have dari Pasangan",cv.harapanPernikahan.mustHave],["Gaya Parenting",cv.harapanPernikahan.parenting],["Doa & Harapan",cv.harapanPernikahan.harapan],["Visi Pernikahan",cv.harapanPernikahan.visi]] },
            { title:"📌 Hal Penting Lainnya", items:[["Tanggungan Keluarga",cv.perluDiketahui.tanggungan],["Deal Breaker Mutlak",cv.perluDiketahui.dealBreaker],["Batasan Pertemanan",cv.perluDiketahui.batasan],["Sikap soal Masa Lalu",cv.perluDiketahui.masaLalu]] },
          ].map((section, si) => (
            <div key={si} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 bg-rose-50 border-b border-rose-100"><h4 className="text-xs font-bold text-rose-700">{section.title}</h4></div>
              <div className="p-3 space-y-2.5">
                {section.items.map(([label, val], ii) => (
                  <div key={ii}><div className="text-xs font-semibold text-gray-500 mb-0.5">{label}</div><div className="text-xs text-gray-800 leading-relaxed">{val}</div></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4 pb-4">Dibuat dengan Radar Cinta — Love Personal Assistant</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-3 pb-2 border-b border-gray-100">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Batch {batch} dari 3 — {["Identity & Values","Logistics & Style","Deep Reality"][batch-1]}</span>
          <span>{totalFilled}/60</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-rose-400 rounded-full transition-all" style={{width:`${pct}%`}} /></div>
        <div className="flex gap-1 mt-2">{[1,2,3].map(b => <div key={b} className={`h-1 flex-1 rounded-full ${b < batch ? "bg-rose-400" : b === batch ? "bg-rose-300" : "bg-gray-100"}`} />)}</div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-2">
        <div className="space-y-3">
          {batchQs.map(q => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5">
              <div className="flex gap-2 mb-2"><span className="text-xs font-bold text-rose-400 flex-shrink-0">{String(q.id).padStart(2,"0")}</span><span className="text-xs text-gray-400">{q.cat}</span></div>
              <p className="text-sm text-gray-800 font-medium mb-2.5 leading-snug">{q.q}</p>
              <textarea className="w-full resize-none border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 outline-none focus:border-rose-300 focus:bg-white leading-relaxed"
                rows={2} placeholder="Jawaban kamu..." value={localAnswers[q.id] || ""} onChange={e => handleChange(q.id, e.target.value)} />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex gap-2">
          {batch > 1 && <button onClick={() => setBatch(b => b-1)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-all">← Kembali</button>}
          <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-all shadow-sm">
            {batch < 3 ? `Lanjut Batch ${batch+1} →` : "✨ Selesai & Lihat CV Nikah"}
          </button>
        </div>
      </div>
    </div>
  );
}

function NeedProfile({ onGo }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-4xl mb-3">🪞</div>
      <h3 className="text-sm font-bold text-gray-800 mb-1">Lengkapi Profil Dulu</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">MIRA butuh mengenalmu lebih dalam dulu sebelum bisa memberikan analisa personal di modul ini.</p>
      <button onClick={onGo} className="px-5 py-2.5 bg-rose-500 text-white text-sm font-semibold rounded-xl hover:bg-rose-600 transition-all">Isi Profil di Modul 2 →</button>
    </div>
  );
}

function Mod3({ profileDone, onGoProfile, history, loading, onSend, onReset, streamingText }) {
  const [selected, setSelected] = useState(null);
  if (!profileDone) return <NeedProfile onGo={onGoProfile} />;
  const handleSelect = (msg) => { setSelected(msg); onSend(msg, msg, null); };
  const handleBack = () => { setSelected(null); onReset(); };
  return <ChatArea showTopics={!selected || history.length === 0} topics={M3_TOPICS} history={history} loading={loading} streamingText={streamingText} onSend={(t) => onSend(t, t, null)} onTopicSelect={handleSelect} onBack={handleBack} />;
}

function Mod4({ profileDone, onGoProfile, history, loading, onSend, onReset, streamingText }) {
  const [selected, setSelected] = useState(null);
  const cats = [...new Set(RED_FLAGS.map(f => f.cat))];
  if (!profileDone) return <NeedProfile onGo={onGoProfile} />;
  if (selected) return <ChatArea showTopics={false} topics={[]} history={history} loading={loading} streamingText={streamingText} onSend={(t) => onSend(t, t, null)} onTopicSelect={() => {}} onBack={() => { setSelected(null); onReset(); }} />;
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <p className="text-xs text-gray-500 mb-3 font-medium">Pilih topik red flag yang ingin kamu bahas dengan MIRA:</p>
      {cats.map(cat => (
        <div key={cat} className="mb-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 px-1">🚩 {cat}</div>
          <div className="space-y-2">
            {RED_FLAGS.filter(f => f.cat === cat).map(flag => {
              const k = KASTA_STYLE[flag.kasta];
              return (
                <button key={flag.id} onClick={() => { setSelected(flag.id); onSend(`Aku mau bahas red flag: ${flag.label} — ${flag.sub}`, `Aku mau bahas red flag: ${flag.label} — ${flag.sub}. Berdasarkan profilku, seberapa berbahaya ini? Gali dulu dengan pertanyaan yang tepat.`, null); }}
                  className={`w-full text-left p-3 rounded-xl border ${k.border} ${k.bg} hover:shadow-sm transition-all`}>
                  <div className="flex items-start justify-between gap-2">
                    <div><div className={`text-sm font-semibold ${k.text}`}>{flag.label}</div><div className="text-xs text-gray-500 mt-0.5">{flag.sub}</div></div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${k.badge}`}>{k.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Mod5({ profileDone, onGoProfile, history, loading, onSend, onReset, streamingText }) {
  const [selected, setSelected] = useState(null);
  if (!profileDone) return <NeedProfile onGo={onGoProfile} />;
  const handleSelect = (msg) => { setSelected(msg); onSend(msg, msg, null); };
  const handleBack = () => { setSelected(null); onReset(); };
  return <ChatArea showTopics={!selected || history.length === 0} topics={M5_TOPICS} history={history} loading={loading} streamingText={streamingText} onSend={(t) => onSend(t, t, null)} onTopicSelect={handleSelect} onBack={handleBack} />;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function RadarCinta() {
  const [curMod, setCurMod] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [histories, setHistories] = useState([[],[],[],[],[]]);
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [answers, setAnswers] = useState({});
  const [profileDone, setProfileDone] = useState(false);

  const profile = profileDone ? formatProfile(answers) : "";

  const getSys = (mod) => {
    if (mod === 2) return SYS.m3(profile);
    if (mod === 3) return SYS.m4(profile);
    if (mod === 4) return SYS.m5(profile);
    return "";
  };

  const addMsg = (mod, role, content) => {
    setHistories(h => { const n = h.map(a => [...a]); n[mod] = [...n[mod], {role, content}]; return n; });
  };

  // staticReply: used by Mod1 to skip API call
  const callAIHandler = async (mod, userText, aiPrompt, staticReply) => {
    setLoading(true);
    setStreamingText("");
    const newUserMsg = {role:"user", content: userText};
    setHistories(h => { const n = h.map(a => [...a]); n[mod] = [...n[mod], newUserMsg]; return n; });

    if (staticReply) {
      addMsg(mod, "assistant", staticReply);
      setLoading(false);
      return;
    }

    try {
      const messagesForAI = aiPrompt
        ? [...histories[mod], {role:"user", content: aiPrompt}]
        : [...histories[mod], newUserMsg];

      let accumulated = "";
      await callAIStream(getSys(mod), messagesForAI, (chunk) => {
        accumulated += chunk;
        setStreamingText(accumulated);
      });
      addMsg(mod, "assistant", accumulated);
    } catch {
      addMsg(mod, "assistant", "Maaf, koneksi bermasalah. Coba lagi ya.");
    }
    setStreamingText("");
    setLoading(false);
  };

  const handleSend = (mod) => (userText, aiPrompt, staticReply) =>
    callAIHandler(mod, userText, aiPrompt, staticReply);
  const handleReset = (mod) => () =>
    setHistories(h => { const n = h.map(a => [...a]); n[mod] = []; return n; });

  const m = MOD_INFO[curMod];
  const switchMod = (i) => { setCurMod(i); setSidebarOpen(false); };

  const modProps = (mod) => ({
    history: histories[mod],
    loading: loading && curMod === mod,
    streamingText: curMod === mod ? streamingText : "",
    onSend: handleSend(mod),
    onReset: handleReset(mod),
  });

  return (
    <div className="flex h-screen bg-rose-50 items-center justify-center">
      <div className="flex w-full h-full sm:max-w-2xl sm:h-auto sm:max-h-screen bg-white sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-lg overflow-hidden" style={{height:"100svh",maxHeight:"100svh"}}>
        {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 sm:hidden" onClick={() => setSidebarOpen(false)} />}

        <div className={`fixed sm:relative inset-y-0 left-0 z-30 sm:z-auto w-64 sm:w-52 bg-white sm:bg-gray-50 border-r border-gray-100 flex flex-col shadow-xl sm:shadow-none transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}>
          <div className="px-4 pt-5 pb-3 border-b border-gray-100">
            <div className="text-base font-bold text-gray-900">💞 Radar Cinta</div>
            <div className="text-xs text-rose-400 font-medium mt-0.5">Love Personal Assistant</div>
            <div className="text-xs text-gray-400 mt-1">by MIRA AI</div>
          </div>
          <div className="flex-1 p-2.5 overflow-y-auto">
            {MOD_INFO.map((mod, i) => (
              <button key={i} onClick={() => switchMod(i)}
                className={`w-full text-left p-3 rounded-xl mb-1.5 flex items-start gap-2.5 transition-all ${curMod === i ? "bg-rose-50 border border-rose-200" : "hover:bg-gray-100"}`}>
                <span className="text-lg leading-none flex-shrink-0 mt-0.5">{mod.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-gray-800">{mod.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-snug">{mod.desc}</div>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1.5 font-medium ${BADGE_COLORS[mod.badgeColor]}`}>{mod.badge}</span>
                </div>
              </button>
            ))}
          </div>
          {profileDone && (
            <div className="p-3 border-t border-gray-100">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-emerald-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-xs text-emerald-700 font-medium">Profil tersimpan</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 flex-shrink-0 bg-white">
            <button onClick={() => setSidebarOpen(s => !s)} className="sm:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold flex-shrink-0">{m.icon}</div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-gray-800 truncate">{m.name}: {m.desc}</div>
              <div className="text-xs text-gray-400">MIRA siap membantumu 💞</div>
            </div>
          </div>

          {curMod === 0 && <Mod1 {...modProps(0)} />}
          {curMod === 1 && <Mod2 answers={answers} setAnswers={setAnswers} profileDone={profileDone} setProfileDone={setProfileDone} />}
          {curMod === 2 && <Mod3 profile={profile} profileDone={profileDone} onGoProfile={() => switchMod(1)} {...modProps(2)} />}
          {curMod === 3 && <Mod4 profile={profile} profileDone={profileDone} onGoProfile={() => switchMod(1)} {...modProps(3)} />}
          {curMod === 4 && <Mod5 profile={profile} profileDone={profileDone} onGoProfile={() => switchMod(1)} {...modProps(4)} />}
        </div>
      </div>
    </div>
  );
}
