const fs = require('fs');

const articles = [
  // --- PENGGING ---
  {
    "id": "pengging-1",
    "slug": "jejak-awal-kerajaan-pengging",
    "title": "Jejak Awal Kerajaan Pengging di Pedalaman Jawa",
    "excerpt": "Pengging merupakan wilayah kuno peninggalan Majapahit yang mencoba bertahan dan merintis peradabannya di tengah kebangkitan Demak.",
    "content": "<p><strong>Asal Usul Pengging</strong></p><p>Sebelum kemunculan Kesultanan Pajang dan Mataram Islam, wilayah Pengging memegang peran kunci sebagai salah satu kadipaten penerus trah Majapahit di Jawa Tengah. Terletak di wilayah subur antara Gunung Merapi dan Merbabu (sekarang berada di wilayah Boyolali), Pengging memiliki akar kebudayaan Hindu-Buddha yang sangat kuat dan mistis.</p><p>Penguasa awal Pengging, Handayaningrat, konon masih memiliki pertalian darah langsung dengan raja Majapahit terakhir. Ketika Majapahit runtuh pada akhir abad ke-15 (1478-1481) dan Kesultanan Demak Bintoro mulai menancapkan pengaruh Islam di pesisir utara, Pengging memilih untuk tetap mempertahankan otonominya sebagai entitas pedalaman yang berpegang pada tradisi kuno.</p>",
    "coverImage": "/uploads/pengging_perkembangan.png",
    "category": "Kerajaan Pengging",
    "subcategory": "Perkembangan",
    "author": "NusaHistoria",
    "readTime": "4 min read",
    "date": "21 Mei 2026",
    "isHeadline": false
  },
  {
    "id": "pengging-2",
    "slug": "ketegangan-berdarah-pengging-demak",
    "title": "Ketegangan Berdarah Pengging dan Demak Bintoro",
    "excerpt": "Penolakan Pengging untuk tunduk pada hegemoni Islam-Demak berujung pada konfrontasi politik dan militer yang mematikan.",
    "content": "<p><strong>Pertemuan Dua Kutub Kekuasaan</strong></p><p>Sebagai pewaris sah Majapahit, para pemimpin Pengging merasa tidak memiliki kewajiban untuk tunduk kepada Kesultanan Demak yang dianggap sebagai kekuatan baru dari pesisir utara. Di sisi lain, Kesultanan Demak yang didukung oleh Dewan Wali Songo menganggap Pengging sebagai ancaman laten bagi unifikasi tanah Jawa dan penyebaran syariat Islam.</p><p>Penolakan Ki Ageng Pengging (Kebo Kenanga) untuk hadir menghadap Sultan Demak, Raden Patah, dianggap sebagai bentuk makar. Ketegangan memuncak ketika Wali Songo, melalui Sunan Kudus, memutuskan untuk mengirimkan pasukan guna menundukkan Pengging secara paksa. Eksekusi mati terhadap Ki Ageng Pengging pada akhirnya meruntuhkan kedaulatan Pengging dan memicu kemarahan dendam yang kelak akan melahirkan Kesultanan Pajang.</p>",
    "coverImage": "/uploads/pengging_konflik.png",
    "category": "Kerajaan Pengging",
    "subcategory": "Konflik",
    "author": "NusaHistoria",
    "readTime": "5 min read",
    "date": "21 Mei 2026",
    "isHeadline": false
  },
  {
    "id": "pengging-3",
    "slug": "kebo-kenanga-sang-adipati",
    "title": "Kebo Kenanga: Sang Adipati Pembangkang",
    "excerpt": "Lebih dari sekadar pemberontak politik, Kebo Kenanga adalah tokoh spiritual yang mendalami ajaran kontroversial Manunggaling Kawula Gusti.",
    "content": "<p><strong>Tokoh Spiritual dan Pemimpin Politik</strong></p><p>Ki Ageng Pengging, yang memiliki nama asli Kebo Kenanga, adalah figur sentral yang sangat dihormati di wilayahnya. Ia dikenal bukan saja karena trah darah birunya, melainkan kedalamannya dalam ilmu kebatinan Jawa. Ia merupakan salah satu murid paling cerdas dari Syekh Siti Jenar, sang tokoh sufi kontroversial pengusung ajaran <em>Manunggaling Kawula Gusti</em> (Bersatunya Hamba dengan Tuhan).</p><p>Kebo Kenanga mempraktekkan ajaran spiritualnya dengan cara yang dinilai membahayakan fondasi syariat Islam yang sedang dibangun oleh Wali Songo. Oleh karena itu, hukuman mati yang dijatuhkan kepadanya oleh Sunan Kudus sebenarnya memiliki dua motif utama: menghilangkan ancaman militer dari sisa Majapahit dan memberangus aliran heterodoks yang dapat memecah belah umat. Kepergiannya meninggalkan putra tunggalnya, Mas Karebet (Jaka Tingkir), yang kelak membalaskan rasa sakit hati ayahnya dengan cara yang tak terduga.</p>",
    "coverImage": "/uploads/pengging_tokoh.png",
    "category": "Kerajaan Pengging",
    "subcategory": "Tokoh",
    "author": "NusaHistoria",
    "readTime": "6 min read",
    "date": "21 Mei 2026",
    "isHeadline": true
  },
  {
    "id": "pengging-4",
    "slug": "peninggalan-spiritual-pengging",
    "title": "Peninggalan Spiritual dan Mistisisme Pengging",
    "excerpt": "Meski secara fisik hancur, ajaran spiritual dan aura mistis peninggalan Pengging terus mewarnai kebudayaan keraton Jawa.",
    "content": "<p><strong>Warisan Non-Benda</strong></p><p>Kerajaan Pengging mungkin telah ditundukkan dan diratakan oleh pasukan Demak, namun warisan terbesar mereka justru bersifat non-benda (spiritual). Sampai hari ini, wilayah Pengging (Boyolali) sering diidentikkan dengan petilasan-petilasan kuno dan pemandian suci peninggalan keluarga kerajaan seperti Umbul Pengging.</p><p>Ajaran kebatinan yang diajarkan oleh Syekh Siti Jenar dan Ki Ageng Pengging secara diam-diam terus diwariskan ke dalam serat-serat Jawa kuno. Tradisi sinkretisme yang menggabungkan nilai-nilai tasawuf Islam dengan kebatinan Hindu-Buddha inilah yang kelak diadopsi secara resmi oleh Kerajaan Pajang dan Mataram Islam dalam bentuk ritual-ritual keraton dan sastra suluk.</p>",
    "coverImage": "/uploads/pengging_warisan.png",
    "category": "Kerajaan Pengging",
    "subcategory": "Warisan",
    "author": "NusaHistoria",
    "readTime": "3 min read",
    "date": "21 Mei 2026",
    "isHeadline": false
  },

  // --- PAJANG ---
  {
    "id": "pajang-1",
    "slug": "bangkitnya-kerajaan-pajang",
    "title": "Awal Mula dan Kejayaan Kerajaan Pajang",
    "excerpt": "Memanfaatkan kehancuran perang saudara Demak, Jaka Tingkir berhasil membangun kekuatan baru di pedalaman Jawa.",
    "content": "<p><strong>Pemindahan Pusat Kekuasaan</strong></p><p>Runtuhnya Kesultanan Demak akibat perang saudara berdarah memicu kekosongan kekuasaan yang besar di Jawa Tengah. Sultan Hadiwijaya (Jaka Tingkir) memanfaatkan momentum ini dengan sangat cerdik. Ali-alih memerintah dari pesisir Demak yang telah luluh lantak, ia memindahkan pusaka keraton ke wilayah pedalaman di Pajang (kini masuk area Surakarta-Sukoharjo).</p><p>Pada masa keemasannya, Kesultanan Pajang berhasil mengontrol wilayah yang sangat luas, dari Banyumas di barat hingga Madiun dan Kediri di timur. Keberhasilan Pajang juga disokong oleh kemajuan pesat di sektor agraris berkat lokasinya yang subur, menjadikan Pajang lumbung pangan terbesar yang menopang stabilitas politik mereka. Pajang diakui secara luas oleh penguasa-penguasa Jawa Timur setelah disahkan oleh Sunan Prapen dari Giri Kedaton.</p>",
    "coverImage": "/uploads/1779284398322-507918812-large-masjid-laweyan-8d405e83e32f95577283a4a8eed11bf9.webp",
    "category": "Kerajaan Pajang",
    "subcategory": "Perkembangan",
    "author": "NusaHistoria",
    "readTime": "5 min read",
    "date": "21 Mei 2026",
    "isHeadline": true
  },
  {
    "id": "pajang-2",
    "slug": "transisi-kekuasaan-pengging-ke-pajang",
    "title": "Transisi Berdarah: Pembalasan Jaka Tingkir",
    "excerpt": "Konflik kekuasaan dan pembalasan dendam keluarga mewarnai runtuhnya Demak dan transisi takhta menuju tangan Pajang.",
    "content": "<p><strong>Dendam dan Politik</strong></p><p>Masa transisi dari Kesultanan Demak ke Pajang sangatlah berdarah. Arya Penangsang dari Jipang yang haus kekuasaan membunuh Sunan Prawoto (Raja Demak) dan suami Ratu Kalinyamat. Ketidakpuasan dan dendam Ratu Kalinyamat mempertemukannya dengan Jaka Tingkir, adipati Pajang.</p><p>Melalui sayembara, Jaka Tingkir mengutus prajurit kepercayaannya, Danang Sutawijaya dan Ki Ageng Pamanahan, untuk memenggal kepala Arya Penangsang. Kematian Arya Penangsang pada tahun 1554 tidak hanya mengakhiri perang saudara Demak, tetapi juga memuluskan jalan Jaka Tingkir menuju singgasana. Ironisnya, hadiah yang dijanjikan Jaka Tingkir kepada Sutawijaya (Alas Mentaok) kelak justru menjadi bumerang yang akan menghancurkan kerajaannya sendiri.</p>",
    "coverImage": "https://images.unsplash.com/photo-1582216503943-7f2122bc1356?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "category": "Kerajaan Pajang",
    "subcategory": "Konflik",
    "author": "NusaHistoria",
    "readTime": "4 min read",
    "date": "21 Mei 2026",
    "isHeadline": false
  },
  {
    "id": "pajang-3",
    "slug": "jaka-tingkir-pemuda-sakti",
    "title": "Jaka Tingkir: Pemuda Sakti Pendiri Pajang",
    "excerpt": "Seorang anak yatim dari keturunan pemberontak Pengging yang merangkak naik menjadi penguasa tunggal Pulau Jawa.",
    "content": "<p><strong>Sang Penakluk Buaya</strong></p><p>Jaka Tingkir (Mas Karebet) adalah manifestasi nyata dari dongeng ksatria Jawa. Setelah kehilangan ayahnya (Kebo Kenanga) akibat eksekusi dari Demak, ia berkelana berguru menuntut ilmu kesaktian. Salah satu legenda paling populer menyebutkan bahwa ia mampu menjinakkan puluhan buaya di Sungai Kedung Boto saat perjalanannya menuju keraton Demak.</p><p>Berkat karismanya dan ketangkasannya, Sultan Trenggono mengangkatnya sebagai kepala prajurit dan menjadikannya menantu. Kecerdasannya berpolitik memungkinkannya membalikkan keadaan; dari putra seorang narapidana politik menjadi Raja Pajang yang bergelar Sultan Hadiwijaya, membalaskan dendam historis Pengging dengan menaklukkan sisa-sisa Demak.</p>",
    "coverImage": "/uploads/pajang_tokoh.png",
    "category": "Kerajaan Pajang",
    "subcategory": "Tokoh",
    "author": "NusaHistoria",
    "readTime": "6 min read",
    "date": "21 Mei 2026",
    "isHeadline": false
  },
  {
    "id": "pajang-4",
    "slug": "kampung-batik-laweyan",
    "title": "Kampung Batik Laweyan: Warisan Ekonomi Pajang",
    "excerpt": "Di tanah perdikan hadiah dari Sultan Hadiwijaya ini, industri batik tradisional dan semangat pergerakan nasional lahir.",
    "content": "<p><strong>Tanah Perdikan Ki Ageng Henis</strong></p><p>Asal-usul Kampung Laweyan tidak lepas dari sosok Ki Ageng Henis (juga dikenal sebagai Ki Ageng Laweyan), seorang penasihat spiritual Sultan Hadiwijaya (Jaka Tingkir). Atas jasanya, Sultan menganugerahkan sebuah tanah perdikan (daerah otonom bebas pajak) kepadanya.</p><p>Di Laweyan, Ki Ageng Henis mengajarkan teknik membatik kepada warga sekitar. Berkat jasanya, Laweyan bertransformasi menjadi pusat produksi batik terkemuka di Surakarta. Warisan ini tidak hanya bernilai ekonomi, namun juga memupuk kemandirian pribumi. Berabad-abad kemudian, dari rahim kampung saudagar batik inilah lahir organisasi Sarekat Dagang Islam pimpinan KH Samanhudi (1911) yang menjadi cikal bakal pergerakan kemerdekaan Indonesia.</p>",
    "coverImage": "/uploads/1779326439728-122436176-3b9ccf71-573f-4ff3-81ce-76b9f2ccf26f.webp",
    "category": "Kerajaan Pajang",
    "subcategory": "Warisan",
    "author": "NusaHistoria",
    "readTime": "5 min read",
    "date": "21 Mei 2026",
    "isHeadline": false
  },

  // --- MATARAM ---
  {
    "id": "mataram-1",
    "slug": "dari-hutan-mentaok-ke-imperium",
    "title": "Dari Hutan Mentaok Menjadi Imperium Terbesar Jawa",
    "excerpt": "Hanya dari sebidang hutan lebat, Panembahan Senopati menyulapnya menjadi kerajaan militer terkuat yang akan menaklukkan seluruh Jawa.",
    "content": "<p><strong>Merintis Mataram</strong></p><p>Sejarah Mataram Islam bermula dari sebidang hutan belantara yang dipenuhi binatang buas dan lelembut bernama Alas Mentaok (sekarang kawasan Kotagede, Yogyakarta). Hutan ini diberikan oleh Sultan Pajang kepada Ki Ageng Pamanahan sebagai hadiah atas terbunuhnya Arya Penangsang.</p><p>Putra Pamanahan, Danang Sutawijaya (kelak bergelar Panembahan Senopati), secara perlahan namun pasti membangun hutan ini menjadi kadipaten yang kuat secara ekonomi dan militer. Pada 1586, setelah menumpas pemberontakan di Pajang dan melihat keruntuhan moral keraton tersebut, Senopati secara resmi memerdekakan diri dan mendeklarasikan Kesultanan Mataram. Ia kemudian melakukan ekspedisi berdarah menaklukkan Madiun, Demak, dan Pasuruan, meletakkan dasar bagi sebuah imperium raksasa.</p>",
    "coverImage": "/uploads/mataram_perkembangan.png",
    "category": "Kerajaan Mataram",
    "subcategory": "Perkembangan",
    "author": "NusaHistoria",
    "readTime": "5 min read",
    "date": "21 Mei 2026",
    "isHeadline": true
  },
  {
    "id": "mataram-2",
    "slug": "geger-pacinan-perang-saudara",
    "title": "Geger Pacinan dan Perang Saudara Mataram",
    "excerpt": "Campur tangan VOC, perebutan takhta, dan amarah etnis Tionghoa menghancurkan keraton Mataram di Kartasura.",
    "content": "<p><strong>Kehancuran Kartasura</strong></p><p>Setelah masa kejayaan Sultan Agung berakhir, Mataram mengalami krisis suksesi akut yang dimanfaatkan oleh kompeni Belanda (VOC). Puncak kekacauan terjadi pada pertengahan abad ke-18 dalam peristiwa Geger Pacinan (1740-1743). Pembantaian etnis Tionghoa di Batavia oleh VOC memicu pelarian warga Tionghoa ke Jawa Tengah, yang kemudian bersekutu dengan para pangeran pemberontak Mataram.</p><p>Sunan Pakubuwana II terjebak di tengah kekacauan ini. Keraton Kartasura berhasil dijebol dan dibakar oleh pasukan pemberontak, memaksa sang raja melarikan diri ke Ponorogo. Meski takhta berhasil direbut kembali dengan bantuan pasukan VOC, kehancuran Kartasura tak tertolong. Pusat pemerintahan kemudian terpaksa dipindahkan ke Surakarta, menandai titik terlemah kedaulatan Mataram.</p>",
    "coverImage": "/uploads/mataram_konflik.png",
    "category": "Kerajaan Mataram",
    "subcategory": "Konflik",
    "author": "NusaHistoria",
    "readTime": "6 min read",
    "date": "21 Mei 2026",
    "isHeadline": false
  },
  {
    "id": "mataram-3",
    "slug": "sultan-agung-puncak-kejayaan-mataram",
    "title": "Sultan Agung: Ekspansi Ekspansif dan Puncak Kejayaan",
    "excerpt": "Bagaimana Sultan Agung menyatukan hampir seluruh Pulau Jawa dan perlawanan heroiknya melawan penetrasi VOC di Batavia.",
    "content": "<p><strong>Sang Pemimpin Visioner</strong></p><p>Mas Rangsang, atau Sultan Agung Hanyakrakusuma (1613–1645), adalah raja terbesar dalam sejarah Mataram Islam. Di bawah komandonya, Mataram mengubah strategi dari defensif menjadi sangat ekspansif. Ia menaklukkan wilayah-wilayah kuat di Jawa Timur (Brang Wetan) termasuk Surabaya dan Madura, menjadikan Mataram sebagai penguasa absolut tanah Jawa.</p><p>Sultan Agung sangat sadar bahwa VOC adalah parasit kolonial. Secara gagah berani, ia mengirim dua gelombang serbuan mematikan untuk menggempur Batavia pada tahun 1628 dan 1629. Meski digagalkan oleh penyakit malaria dan wabah kelaparan akibat pembakaran lumbung padinya, keberaniannya mencatatkan namanya dengan tinta emas. Selain militer, ia juga mewariskan Kalender Jawa yang merupakan fusi luar biasa antara sistem Saka (Hindu) dan Hijriah (Islam).</p>",
    "coverImage": "https://images.unsplash.com/photo-1518381255883-9b62a6900f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "category": "Kerajaan Mataram",
    "subcategory": "Tokoh",
    "author": "NusaHistoria",
    "readTime": "5 min read",
    "date": "21 Mei 2026",
    "isHeadline": false
  },
  {
    "id": "mataram-4",
    "slug": "perjanjian-giyanti-palihan-nagari",
    "title": "Perjanjian Giyanti dan Palihan Nagari (Terbelahnya Mataram)",
    "excerpt": "Taktik pecah belah VOC akhirnya berhasil membelah bumi Mataram menjadi Surakarta dan Yogyakarta untuk selamanya.",
    "content": "<p><strong>Palihan Nagari (1755)</strong></p><p>Perang saudara yang berlarut-larut (Perang Suksesi Jawa III) menguras energi, harta, dan darah warga Mataram. Pangeran Mangkubumi dan Raden Mas Said terus menggempur kekuasaan Pakubuwana III yang disokong oleh tentara VOC. VOC yang juga kehabisan dana akibat perang akhirnya menawarkan sebuah solusi politik yang menguntungkan mereka: <em>Divide et Impera</em> (Pecah Belah dan Kuasai).</p><p>Pada tanggal 13 Februari 1755, ditandatanganilah Perjanjian Giyanti di Karanganyar. Perjanjian ini secara resmi membelah bumi Mataram menjadi dua negara yang berdiri sendiri: Kasunanan Surakarta (di bawah Pakubuwana III) dan Kasultanan Yogyakarta (di bawah Pangeran Mangkubumi yang diangkat menjadi Sultan Hamengkubuwana I). Pembelahan ini menandai akhir dari imperium tunggal Mataram Islam dan melahirkan dualisme kebudayaan yang terus bertahan hingga hari ini.</p>",
    "coverImage": "/uploads/mataram_warisan.png",
    "category": "Kerajaan Mataram",
    "subcategory": "Warisan",
    "author": "NusaHistoria",
    "readTime": "5 min read",
    "date": "21 Mei 2026",
    "isHeadline": false
  }
];

fs.writeFileSync('./src/lib/data.json', JSON.stringify(articles, null, 2), 'utf-8');
console.log('Successfully generated 12 articles!');
