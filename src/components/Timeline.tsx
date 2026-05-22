'use client';
import { useState } from 'react';

export default function Timeline() {
  const [showAll, setShowAll] = useState(false);
  const events = [
    { year: "1474-1478", title: "Era Bhre Kertabumi", desc: "Masa pemerintahan Raja Majapahit terakhir. Dari keturunannya kelak lahir pendiri Demak, Pajang, dan Mataram." },
    { year: "1481-1482", title: "Berdirinya Kesultanan Demak", desc: "Majapahit ditundukkan (1481). Raden Fatah diangkat menjadi sultan pertama Demak (1482), sementara Pengging bertahan sebagai daerah otonom." },
    { year: "1521", title: "Kedaulatan Demak", desc: "Sultan Trenggana berdaulat penuh sebagai raja Kesultanan Demak." },
    { year: "1527", title: "Penaklukan Pengging", desc: "Demak terus menaklukkan sisa kekuatan Majapahit yang paling akhir, salah satunya adalah Pengging." },
    { year: "1530-an", title: "Eksekusi Kebo Kenanga", desc: "Kebo Kenanga dibunuh oleh Sunan Kudus. Kerajaan Pengging praktis runtuh karena Jaka Tingkir masih terlalu muda." },
    { year: "1546", title: "Sultan Trenggono Wafat", desc: "Sultan Trenggono wafat di Panarukan. Memantik perebutan takhta berdarah antara Sunan Prawoto, Pangeran Sekar, & Arya Penangsang." },
    { year: "1549-1554", title: "Masa Transisi ke Pajang", desc: "Jaka Tingkir mengonsolidasikan pemerintahan, menyingkirkan Arya Penangsang (1554), dan memindah pusat kerajaan ke Pajang." },
    { year: "1554/1558", title: "Hadiah Alas Mentaok", desc: "Atas jasanya dalam konflik Demak, Ki Ageng Pamanahan diberi tanah Mentaok (cikal bakal Mataram) oleh Sultan Hadiwijaya." },
    { year: "1568/1581", title: "Ramalan Sunan Giri", desc: "Sunan Giri meramalkan bahwa kelak Mataram akan menaklukkan Kesultanan Pajang." },
    { year: "1573", title: "Kadipaten Mataram", desc: "Alas Mentaok berkembang pesat menjadi Kadipaten Mataram di bawah kekuasaan Pajang." },
    { year: "1575", title: "Pamanahan Wafat", desc: "Ki Ageng Pamanahan wafat. Kepemimpinan Mataram dilanjutkan oleh putranya, Sutawijaya (Senopati Ing Alaga)." },
    { year: "1578", title: "Awal Pembangkangan", desc: "Senopati Ing Alaga mulai menolak menghadap dan menyetorkan upeti ke keraton Pajang." },
    { year: "1582", title: "Sultan Hadiwijaya Wafat", desc: "Memicu persaingan keluarga kerajaan dan menandai awal keruntuhan Kesultanan Pajang yang digantikan Mataram." },
    { year: "1586", title: "Kedaulatan Mataram", desc: "Panembahan Senopati mendeklarasikan Mataram sebagai kerajaan berdaulat, lepas dari Pajang yang krisis suksesi." },
    { year: "1586-1601", title: "Ekspansi Senopati", desc: "Periode ekspansi awal. Senopati menaklukkan wilayah vital (Prambanan, Demak, Pajang, Madiun, Pasuruan) di Jawa bagian tengah-timur." },
    { year: "1601-1613", title: "Era Hanyakrawati", desc: "Pemerintahan Panembahan Hanyakrawati (Sedan Krapyak) fokus pada konsolidasi internal dan menghadapi perlawanan daerah pelabuhan." },
    { year: "1613", title: "Sultan Agung Bertahta", desc: "Naik takhtanya Mas Rangsang. Strategi militer diubah dari defensif menjadi ofensif-imperialistik." },
    { year: "1614-1625", title: "Penaklukan Brang Wetan", desc: "Jawa Timur dan Madura ditaklukkan. Jatuhnya Surabaya (1625) menjadikan Mataram penguasa tunggal Jawa (kecuali Banten & Batavia)." },
    { year: "1628-1629", title: "Serbuan ke Batavia", desc: "Serangan militer besar-besaran ke Batavia. Meski gagal secara taktis, Mataram menegaskan diri sebagai kekuatan anti-kolonial terbesar." },
    { year: "1641", title: "Gelar Sultan", desc: "Sultan Agung memperoleh gelar dari Syarif Makkah, mengintegrasikan hukum Islam dengan adat Jawa, dan menciptakan Kalender Jawa." },
    { year: "1645-1677", title: "Amangkurat I", desc: "Orientasi politik berubah jadi kooperatif dengan VOC demi takhta. Memicu Pemberontakan Trunajaya yang menduduki ibu kota Plered." },
    { year: "1677-1703", title: "Amangkurat II & VOC", desc: "Amangkurat II naik takhta dibantu VOC. Ibu kota pindah ke Kartasura. Mataram terpaksa menyerahkan ekonomi pesisir utara pada kompeni." },
    { year: "1703-1749", title: "Perang Suksesi Jawa", desc: "Campur tangan VOC dalam menentukan takhta di Kartasura merusak tatanan politik dan memicu frustrasi pangeran sentana." },
    { year: "1740-1743", title: "Geger Pacinan", desc: "Pemberontakan Tionghoa meluas. Ibu kota Kartasura hancur, pusat pemerintahan pindah ke Surakarta (1745)." },
    { year: "1755", title: "Perjanjian Giyanti", desc: "Puncak perpecahan (Perang Suksesi Jawa III). VOC memfasilitasi Palihan Nagari: Mataram dibelah menjadi Surakarta dan Yogyakarta." }
  ];

  return (
    <div className="w-full bg-neutral-950 border-y border-gray-800 py-16 px-4 mb-16 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-3xl font-black text-yellow-500 font-serif mb-16 text-center uppercase tracking-widest drop-shadow-md">
          Garis Waktu Sejarah
        </h3>
        
        {/* Vertical Timeline Container */}
        <div className="relative">
          
          {/* Main Vertical Line (Center on Desktop, Left on Mobile) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-yellow-900/30 md:-translate-x-1/2 z-0"></div>

          <div className="space-y-12">
            {(showAll ? events : events.slice(0, 5)).map((event, index) => (
              <div key={index} className="relative flex flex-col md:flex-row items-start md:items-center group">
                
                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-black border-2 border-yellow-500 md:-translate-x-1/2 mt-1.5 md:mt-0 z-10 group-hover:scale-150 group-hover:bg-yellow-500 transition-all duration-300 shadow-[0_0_10px_rgba(234,179,8,0)] group-hover:shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>

                {/* Content Box */}
                <div className={`w-full pl-14 md:pl-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto md:text-left'}`}>
                  <div className="bg-neutral-900 border border-gray-800 p-6 rounded-xl shadow-lg group-hover:border-yellow-600 transition-colors duration-300">
                    <div className="text-3xl font-black text-white font-serif mb-1 group-hover:text-yellow-400 transition-colors drop-shadow-md">
                      {event.year}
                    </div>
                    <div className="text-sm font-bold text-yellow-600 uppercase tracking-widest mb-3">
                      {event.title}
                    </div>
                    <div className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {event.desc}
                    </div>
                  </div>
                </div>
                
              </div>
            ))}
          </div>

          {/* Toggle Button */}
          {events.length > 5 && (
            <div className="mt-16 flex justify-center">
              <button 
                onClick={() => setShowAll(!showAll)}
                className="px-8 py-3 bg-neutral-900 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold text-sm uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_20px_rgba(234,179,8,0.6)]"
              >
                {showAll ? 'Tampilkan Lebih Sedikit' : 'Baca Selengkapnya'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
