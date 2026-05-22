"use client";

import { useState } from "react";
import { Metadata } from "next";

// Define the Node Type
type TreeNode = {
  name: string;
  title?: string;
  desc?: string;
  children?: TreeNode[];
  isSpouse?: boolean;
  isNote?: boolean;
};

const babadTree: TreeNode[] = [
  {
    name: "Brawijaya",
    title: "Raja Majapahit Terakhir",
    children: [
      {
        name: "Raden Patah",
        title: "Sultan Demak I",
        desc: "Diyakini sebagai putra Brawijaya dari seorang Putri Cina.",
        children: [
          {
            name: "Pangeran Sabrang-Lor",
            title: "Sultan Demak II",
          },
          {
            name: "Sultan Tranggana",
            title: "Sultan Demak III",
            children: [
              {
                name: "Susuhunan Prawata",
                title: "Sultan Demak IV",
                desc: "Tewas dibunuh Aria Panangsang.",
              },
              {
                name: "Ratu Pajang",
                title: "Putri Sultan Tranggana",
                children: [
                  {
                    name: "Jaka Tingkir / Sultan Adiwijaya",
                    title: "Sultan Pajang I",
                    desc: "Menikah dengan Ratu Pajang (Putri Demak). Putra dari Kebo Kenanga.",
                    isSpouse: true,
                    children: [
                      {
                        name: "Ki Gede Pamanahan",
                        desc: "Mendapat tanah Mataram dari Jaka Tingkir atas jasanya, diklaim sebagai keturunan tokoh legendaris Ki Gede Sesela dan Ki Gede Ngenis. Garis kekuasaan beralih kepadanya.",
                        isNote: true,
                        children: [
                          {
                            name: "Panembahan Senapati / Sutawijaya",
                            desc: "Anak Ki Pamanahan yang kemudian melepaskan diri dari Pajang dan menjadi raja merdeka pertama Mataram.",
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Putri Majapahit",
        desc: "Dihadiahkan oleh raja kepada Andayaningrat dari Pengging.",
        children: [
          {
            name: "Kebo Kenanga / Ki Gede Pengging",
            title: "Putra Andayaningrat",
            children: [
              {
                name: "Jaka Tingkir / Sultan Adiwijaya",
                title: "Sultan Pajang I",
                desc: "Putra Kebo Kenanga (Garis keturunannya bertemu dengan keturunan Raden Patah melalui pernikahannya dengan Ratu Pajang).",
              }
            ]
          }
        ]
      }
    ]
  }
];

const historisTree: TreeNode[] = [
  {
    name: "Cek Ko-Po",
    desc: "Pedagang asing/Cina Islam pendiri dinasti Demak.",
    children: [
      {
        name: "Cu-Cu / Aria Sumangsang / Pate Rodin Sr.",
        title: "Penguasa Demak II",
        desc: "Putra Cek Ko-Po yang pada mulanya masih tunduk pada wakil Majapahit.",
        children: [
          {
            name: "Sultan Tranggana / Ki Mas Palembang / Pate Rodin Jr.",
            title: "Sultan Demak III",
            desc: "Kemudian menyatakan dirinya sebagai Sultan berdaulat.",
            children: [
              {
                name: "Susuhunan Prawata / Pangeran Ratu",
                title: "Sultan Demak IV",
                desc: "Dibunuh oleh Aria Panangsang.",
              },
              {
                name: "Putri Tranggana",
                children: [
                  {
                    name: "Jaka Tingkir / Sultan Adiwijaya",
                    title: "Penguasa Pajang",
                    desc: "Menantu Sultan Tranggana yang mengambil alih kekuasaan Jawa Tengah setelah jatuhnya dinasti Demak.",
                    isSpouse: true,
                    children: [
                      {
                        name: "Ki Gede Pamanahan",
                        desc: "Panglima Jaka Tingkir yang diutus untuk membuka wilayah Mataram yang masih berupa hutan. Garis kekuasaan beralih ke Mataram.",
                        isNote: true,
                        children: [
                          {
                            name: "Panembahan Senapati",
                            desc: "Anak Ki Pamanahan yang melepaskan kewajibannya dari keraton Pajang dan mengambil alih hegemoni kekuasaan di pedalaman Jawa Tengah.",
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];


const TreeRenderer = ({ data, level = 0 }: { data: TreeNode[], level?: number }) => {
  return (
    <div className="relative">
      {data.map((node, i) => (
        <div key={i} className={`relative ${level > 0 ? 'ml-6 md:ml-12 border-l-2 border-yellow-700/50 pl-6 md:pl-10 pb-6' : 'pb-8'}`}>
          
          {/* Connector horizontal line */}
          {level > 0 && (
            <div className="absolute w-6 md:w-10 h-2 border-b-2 border-yellow-700/50 left-0 top-6"></div>
          )}

          {/* Node Card */}
          <div className={`
            relative z-10 p-5 rounded-lg border-2 shadow-lg transition-transform hover:-translate-y-1
            ${node.isSpouse 
              ? 'bg-rose-950/40 border-rose-800' 
              : node.isNote 
                ? 'bg-indigo-950/40 border-indigo-800' 
                : 'bg-neutral-900 border-yellow-600'
            }
          `}>
            {/* Tag/Badge for Context */}
            {node.isSpouse && <span className="absolute -top-3 right-4 bg-rose-800 text-white text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">Perkawinan / Relasi</span>}
            {node.isNote && <span className="absolute -top-3 right-4 bg-indigo-800 text-white text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">Transisi Kekuasaan</span>}

            <h3 className={`font-serif font-bold text-lg md:text-xl ${node.isSpouse ? 'text-rose-400' : node.isNote ? 'text-indigo-400' : 'text-yellow-400'}`}>
              {node.name}
            </h3>
            
            {node.title && (
              <div className="inline-block mt-1 mb-2 bg-yellow-900/50 text-yellow-200 text-xs px-2 py-0.5 rounded font-bold tracking-wider">
                {node.title}
              </div>
            )}
            
            {node.desc && (
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                {node.desc}
              </p>
            )}
          </div>

          {/* Children */}
          {node.children && node.children.length > 0 && (
            <div className="mt-6">
              <TreeRenderer data={node.children} level={level + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


export default function SilsilahPage() {
  const [activeTab, setActiveTab] = useState<"babad" | "historis">("babad");

  return (
    <div className="min-h-screen bg-black text-gray-200 pb-20">
      
      {/* Header */}
      <div className="bg-neutral-900 border-b-2 border-yellow-500 py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white font-serif mb-4 uppercase tracking-wider">
            Silsilah <span className="text-yellow-500">Keraton Jawa</span>
          </h1>
          <p className="text-lg text-gray-400 font-sans max-w-2xl mx-auto">
            Menelusuri garis keturunan para penguasa Demak, Pajang, dan Mataram. Temukan perbedaan antara versi Legenda (Babad) peninggalan keraton dan versi Historis (Catatan Asing).
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-neutral-900 p-1 rounded-lg inline-flex border border-gray-800">
            <button 
              onClick={() => setActiveTab("babad")}
              className={`px-6 py-3 rounded-md font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'babad' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Versi Babad (Legenda)
            </button>
            <button 
              onClick={() => setActiveTab("historis")}
              className={`px-6 py-3 rounded-md font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'historis' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Versi Historis
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-black/50 border border-gray-800 p-4 md:p-8 rounded-xl">
          
          {/* Explanation Header */}
          <div className="mb-8 border-l-4 border-yellow-500 pl-4 bg-yellow-900/10 p-4 rounded-r-lg">
            {activeTab === "babad" ? (
              <p className="text-gray-300">
                <strong className="text-yellow-400 block mb-1">Tradisi Keraton Jawa</strong>
                Dalam versi ini, silsilah sengaja ditarik langsung dari garis keturunan penguasa Majapahit (Brawijaya) untuk melegitimasi kekuasaan kerajaan-kerajaan Islam berikutnya di mata masyarakat Jawa.
              </p>
            ) : (
              <p className="text-gray-300">
                <strong className="text-yellow-400 block mb-1">Catatan Asing (Tome Pires & Banten)</strong>
                Dalam versi historis, dinasti Demak didirikan oleh keluarga pedagang Muslim keturunan asing/Cina yang menapaki jenjang kekuasaan secara bertahap, bukan keturunan langsung penguasa Majapahit.
              </p>
            )}
          </div>

          {/* Render the selected tree */}
          <div className="overflow-x-auto pb-8">
            <div className="min-w-[700px] lg:min-w-full">
              <TreeRenderer data={activeTab === "babad" ? babadTree : historisTree} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
