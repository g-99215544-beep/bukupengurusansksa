import React, { useState, useRef, useEffect } from 'react';

// =====================================================
// DATA JSON - INDEKS TAJUK UTAMA (TABLE OF CONTENTS)
// =====================================================
const tableOfContents = {
  sekolah: "SK Sultan Abu Bakar (1)",
  tahun: 2021,
  tajuk_utama: [
    { id: "prakata", label: "Prakata & Pengenalan", page_start: 1, page_end: 16, icon: "📖", color: "#6366f1" },
    { id: "senarai_guru", label: "Senarai Nama Guru & Staf", page_start: 17, page_end: 18, icon: "👥", color: "#8b5cf6" },
    { id: "pentadbiran", label: "Pengurusan Sekolah", page_start: 19, page_end: 66, icon: "🏛️", color: "#0ea5e9" },
    { id: "kurikulum", label: "Pengurusan Kurikulum", page_start: 67, page_end: 79, icon: "📚", color: "#10b981" },
    { id: "hem", label: "Hal Ehwal Murid", page_start: 80, page_end: 87, icon: "🎓", color: "#f59e0b" },
    { id: "kokurikulum", label: "Pengurusan Kokurikulum", page_start: 88, page_end: 98, icon: "⚽", color: "#ef4444" },
    { id: "ppkip", label: "Pengurusan PPKIP", page_start: 99, page_end: 106, icon: "💙", color: "#ec4899" }
  ]
};

// =====================================================
// DATA JSON - PANGKALAN DATA GURU & TUGAS (DEEP-LINK)
// =====================================================
const guruDatabase = [
  {
    nama: "PN. HJH. AIDAH BINTI SULAIMAN",
    jawatan: "Guru Besar",
    avatar: "👩‍💼",
    tugas: [
      { label: "Guru Besar", page_number: 17, category: "pentadbiran" },
      { label: "Pengerusi JK Kewangan Sekolah", page_number: 55, category: "pentadbiran" },
      { label: "Pengerusi JK Induk Kurikulum", page_number: 69, category: "kurikulum" },
      { label: "Pengerusi JK Induk HEM", page_number: 84, category: "hem" },
      { label: "Pengerusi JK Induk Kokurikulum", page_number: 94, category: "kokurikulum" },
      { label: "Pengerusi JK PPKIP", page_number: 100, category: "ppkip" }
    ]
  },
  {
    nama: "EN. AZMAN BIN ALI @ RAMIN",
    jawatan: "Penolong Kanan Pentadbiran",
    avatar: "👨‍💼",
    tugas: [
      { label: "Penolong Kanan Pentadbiran", page_number: 17, category: "pentadbiran" },
      { label: "Timbalan Pengerusi JK Kewangan", page_number: 55, category: "pentadbiran" },
      { label: "Pegawai Aset", page_number: 57, category: "pentadbiran" },
      { label: "Timbalan Pengerusi JK Induk Kurikulum", page_number: 69, category: "kurikulum" },
      { label: "Naib Pengerusi I JK Induk HEM", page_number: 84, category: "hem" }
    ]
  },
  {
    nama: "PN. NORMASATI BINTI MOHD RABU",
    jawatan: "Penolong Kanan HEM",
    avatar: "👩‍💼",
    tugas: [
      { label: "Penolong Kanan HEM", page_number: 17, category: "pentadbiran" },
      { label: "Setiausaha JK Perancangan Strategik", page_number: 58, category: "pentadbiran" },
      { label: "Timbalan Pengerusi JK Induk HEM", page_number: 84, category: "hem" },
      { label: "Naib Pengerusi II JK Induk Kokurikulum", page_number: 94, category: "kokurikulum" }
    ]
  },
  {
    nama: "PN. ZARINAH BINTI MAT YASIN",
    jawatan: "Penolong Kanan Kokurikulum",
    avatar: "👩‍💼",
    tugas: [
      { label: "Penolong Kanan Kokurikulum", page_number: 17, category: "pentadbiran" },
      { label: "Timbalan Pengerusi JK Induk Kokurikulum", page_number: 94, category: "kokurikulum" },
      { label: "Penyelaras JK RIMUP", page_number: 97, category: "kokurikulum" },
      { label: "Timbalan Pengerusi JK MAKDIS", page_number: 97, category: "kokurikulum" }
    ]
  },
  {
    nama: "CIK FARRAH 'AIN BINTI RUSLI",
    jawatan: "Penyelaras SKK / KP Bahasa Inggeris",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Penyelaras SKK", page_number: 17, category: "pentadbiran" },
      { label: "Ketua Panitia Bahasa Inggeris", page_number: 72, category: "kurikulum" },
      { label: "Setiausaha JK Kantin", page_number: 85, category: "hem" },
      { label: "Ketua Penasihat Persatuan Bahasa Inggeris", page_number: 95, category: "kokurikulum" },
      { label: "Setiausaha Rumah Melati", page_number: 97, category: "kokurikulum" }
    ]
  },
  {
    nama: "PN. HALINA BINTI ALWEE",
    jawatan: "Penyelaras PPKIP",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Penyelaras PPKIP", page_number: 17, category: "pentadbiran" },
      { label: "Setiausaha RMT", page_number: 85, category: "hem" },
      { label: "Pengurus Sukan Pendidikan Khas", page_number: 96, category: "kokurikulum" },
      { label: "Pengerusi Rumah Cempaka (Hijau)", page_number: 97, category: "kokurikulum" },
      { label: "Penyelaras/Setiausaha JK PPKIP", page_number: 100, category: "ppkip" }
    ]
  },
  {
    nama: "PN. HASLINDA BINTI SHUKOR",
    jawatan: "Guru Data/SPBT",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Guru Data/SPBT", page_number: 17, category: "pentadbiran" },
      { label: "Ketua Panitia PJK", page_number: 73, category: "kurikulum" },
      { label: "Setiausaha JK SPBT", page_number: 85, category: "hem" },
      { label: "Setiausaha Kokurikulum", page_number: 94, category: "kokurikulum" },
      { label: "Pengurus Olahraga", page_number: 96, category: "kokurikulum" }
    ]
  },
  {
    nama: "PN. MEHRUNIZA BINTI AYOB",
    jawatan: "Guru PSS/Media",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Guru PSS/Media", page_number: 17, category: "pentadbiran" },
      { label: "Ketua Panitia Pendidikan Moral", page_number: 73, category: "kurikulum" },
      { label: "Setiausaha JK PSS", page_number: 73, category: "kurikulum" },
      { label: "Pengerusi Rumah Teratai (Biru)", page_number: 97, category: "kokurikulum" },
      { label: "Setiausaha Kempen Bulan Membaca", page_number: 98, category: "kokurikulum" }
    ]
  },
  {
    nama: "EN. MOHD AZHAR BIN SAMION",
    jawatan: "Guru Penolong / KP Sains",
    avatar: "👨‍🏫",
    tugas: [
      { label: "Ketua Panitia Sains", page_number: 72, category: "kurikulum" },
      { label: "Setiausaha JK STEM", page_number: 74, category: "kurikulum" },
      { label: "Setiausaha Kebersihan & Keceriaan", page_number: 86, category: "hem" },
      { label: "Ketua Pemimpin Pengakap", page_number: 94, category: "kokurikulum" },
      { label: "Setiausaha Hari Kanak-kanak", page_number: 98, category: "kokurikulum" }
    ]
  },
  {
    nama: "EN. MOHD KHOLIB BIN DAUD",
    jawatan: "Guru Penolong / KP RBT",
    avatar: "👨‍🏫",
    tugas: [
      { label: "Ketua Panitia RBT", page_number: 72, category: "kurikulum" },
      { label: "Penyelaras Sukan & Permainan", page_number: 94, category: "kokurikulum" },
      { label: "Setiausaha Sukan", page_number: 94, category: "kokurikulum" },
      { label: "Jurulatih Olahraga", page_number: 96, category: "kokurikulum" },
      { label: "Setiausaha Hari Keusahawanan", page_number: 98, category: "kokurikulum" }
    ]
  },
  {
    nama: "EN. MOHD SHIHAN SHAH BIN ABD RAUF",
    jawatan: "Guru Penolong / KP Bahasa Arab",
    avatar: "👨‍🏫",
    tugas: [
      { label: "Ketua Panitia Bahasa Arab", page_number: 72, category: "kurikulum" },
      { label: "Setiausaha Keselamatan", page_number: 86, category: "hem" },
      { label: "Ketua Penasihat Persatuan Agama Islam", page_number: 95, category: "kokurikulum" },
      { label: "Setiausaha Ihya Ramadhan", page_number: 98, category: "kokurikulum" },
      { label: "Setiausaha Maal Hijrah", page_number: 98, category: "kokurikulum" }
    ]
  },
  {
    nama: "EN. TAN KIONG BENG",
    jawatan: "Penyelaras Bestari / KP TMK",
    avatar: "👨‍🏫",
    tugas: [
      { label: "Penyelaras Bestari", page_number: 17, category: "pentadbiran" },
      { label: "Ketua Panitia TMK", page_number: 73, category: "kurikulum" },
      { label: "Setiausaha JK Jadual Waktu", page_number: 61, category: "pentadbiran" },
      { label: "Setiausaha JK APDM", page_number: 84, category: "hem" },
      { label: "Ketua Penasihat Kelab Komputer", page_number: 95, category: "kokurikulum" },
      { label: "Pengerusi Rumah Kenanga (Kuning)", page_number: 97, category: "kokurikulum" }
    ]
  },
  {
    nama: "CIK NOOR AZUREEN BINTI TALIP",
    jawatan: "Guru Pemulihan/Bimbingan",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Guru Pemulihan/Bimbingan", page_number: 17, category: "kurikulum" },
      { label: "Setiausaha JK Pemulihan", page_number: 71, category: "kurikulum" },
      { label: "Setiausaha Bimbingan & Kaunseling", page_number: 87, category: "hem" },
      { label: "Ketua Penasihat Kelab Doktor Muda", page_number: 95, category: "kokurikulum" },
      { label: "Setiausaha Majlis Apresiasi", page_number: 98, category: "kokurikulum" }
    ]
  },
  {
    nama: "CIK NUR ALYANI BINTI MOHAMAD HAMIM",
    jawatan: "Guru Pendidikan Khas",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Guru Pendidikan Khas", page_number: 17, category: "ppkip" },
      { label: "Setiausaha Program Susu Sekolah (PSS)", page_number: 85, category: "hem" },
      { label: "Setiausaha Unit Beruniform", page_number: 94, category: "kokurikulum" },
      { label: "Jurulatih Bola Baling", page_number: 96, category: "kokurikulum" },
      { label: "Setiausaha Kokurikulum PPKIP", page_number: 106, category: "ppkip" }
    ]
  },
  {
    nama: "PN. ZAINAB BINTI MOHAMED SALLEH",
    jawatan: "Guru Pendidikan Khas",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Guru Pendidikan Khas", page_number: 17, category: "ppkip" },
      { label: "Setiausaha JK Induk HEM", page_number: 84, category: "hem" },
      { label: "Pengurus Jualan Kedai Buku", page_number: 61, category: "pentadbiran" },
      { label: "Setiausaha Rumah Kenanga", page_number: 97, category: "kokurikulum" },
      { label: "Setiausaha Kurikulum PPKIP", page_number: 102, category: "ppkip" }
    ]
  },
  {
    nama: "PN. UMI KALTHOM BINTI MOHD KAHAR",
    jawatan: "KP Matematik / Penyelaras PBD",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Ketua Panitia Matematik", page_number: 72, category: "kurikulum" },
      { label: "Penyelaras PBD dan PLaN", page_number: 70, category: "kurikulum" },
      { label: "Setiausaha JK PBD", page_number: 70, category: "kurikulum" },
      { label: "AJK Lembaga Disiplin", page_number: 86, category: "hem" },
      { label: "AJK Rumah Teratai", page_number: 97, category: "kokurikulum" }
    ]
  },
  {
    nama: "CIK NIMA BINTI HASSAN",
    jawatan: "KP Bahasa Melayu",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Ketua Panitia Bahasa Melayu", page_number: 72, category: "kurikulum" },
      { label: "Setiausaha Lembaga Pengawas", page_number: 86, category: "hem" },
      { label: "Penyelaras Unit Beruniform", page_number: 94, category: "kokurikulum" },
      { label: "Ketua Penasihat Persatuan Bahasa Melayu", page_number: 95, category: "kokurikulum" },
      { label: "Setiausaha Bulan Kemerdekaan", page_number: 98, category: "kokurikulum" }
    ]
  },
  {
    nama: "PN. SAMZUNORZETA BINTI SHAMSUDDIN",
    jawatan: "Guru Prasekolah",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Guru Prasekolah", page_number: 17, category: "kurikulum" },
      { label: "Setiausaha Skim Bantuan & Kebajikan", page_number: 85, category: "hem" },
      { label: "Ketua Penasihat Kelab Bola Baling", page_number: 95, category: "kokurikulum" },
      { label: "Pengurus Bola Baling", page_number: 96, category: "kokurikulum" },
      { label: "Setiausaha Maulidur Rasul", page_number: 98, category: "kokurikulum" }
    ]
  },
  {
    nama: "PN. SITI MARYAM BINTI MUSA",
    jawatan: "KP Pendidikan Islam",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Ketua Panitia Pendidikan Islam", page_number: 73, category: "kurikulum" },
      { label: "Ketua Penasihat Kelab Rukun Negara", page_number: 95, category: "kokurikulum" },
      { label: "Setiausaha Rumah Teratai", page_number: 97, category: "kokurikulum" },
      { label: "Penyelaras/Setiausaha MAKDIS", page_number: 97, category: "kokurikulum" },
      { label: "Setiausaha Kem Bestari Solat", page_number: 98, category: "kokurikulum" }
    ]
  },
  {
    nama: "PN. NADIAH BINTI ALI",
    jawatan: "Penyelaras Tahun 6 / KP Kesenian",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Penyelaras Tahun 6", page_number: 17, category: "pentadbiran" },
      { label: "Ketua Panitia Kesenian", page_number: 73, category: "kurikulum" },
      { label: "Setiausaha Kurikulum", page_number: 67, category: "kurikulum" },
      { label: "Setiausaha Rumah Cempaka", page_number: 97, category: "kokurikulum" },
      { label: "Setiausaha JK RIMUP", page_number: 97, category: "kokurikulum" }
    ]
  },
  {
    nama: "PN. NAJIHA BINTI ABD KADIR",
    jawatan: "SUP Awam",
    avatar: "👩‍🏫",
    tugas: [
      { label: "SUP Awam", page_number: 55, category: "pentadbiran" },
      { label: "Setiausaha JK PBS", page_number: 69, category: "kurikulum" },
      { label: "Penyelaras Kelab & Persatuan", page_number: 94, category: "kokurikulum" },
      { label: "Pengurus Catur", page_number: 96, category: "kokurikulum" },
      { label: "Pengerusi Rumah Melati", page_number: 97, category: "kokurikulum" }
    ]
  },
  {
    nama: "EN. MOHD ARBAQ FARIQ BIN MAHAT",
    jawatan: "KP Sejarah",
    avatar: "👨‍🏫",
    tugas: [
      { label: "Ketua Panitia Sejarah", page_number: 73, category: "kurikulum" },
      { label: "Penyelaras TS25", page_number: 59, category: "pentadbiran" },
      { label: "Setiausaha Lembaga Disiplin", page_number: 86, category: "hem" },
      { label: "Setiausaha Program Transisi", page_number: 87, category: "hem" },
      { label: "Pengurus Rugbi Sentuh", page_number: 96, category: "kokurikulum" }
    ]
  },
  {
    nama: "PN. RUZILA BINTI JAMIRAN",
    jawatan: "Guru Pendidikan Khas",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Guru Pendidikan Khas", page_number: 17, category: "ppkip" },
      { label: "Setiausaha Pengurusan Am Sekolah", page_number: 55, category: "pentadbiran" },
      { label: "Setiausaha PPDa", page_number: 87, category: "hem" },
      { label: "Setiausaha JK Sarana Sekolah", page_number: 66, category: "pentadbiran" },
      { label: "Bendahari JK PPKIP", page_number: 100, category: "ppkip" }
    ]
  },
  {
    nama: "PN. SITI ROHANI BINTI SHIKH IBRAHIM",
    jawatan: "Guru Prasekolah",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Guru Prasekolah", page_number: 17, category: "kurikulum" },
      { label: "Setiausaha JK Prasekolah", page_number: 74, category: "kurikulum" },
      { label: "Pengurus Kebudayaan", page_number: 96, category: "kokurikulum" },
      { label: "Bendahari Rumah Cempaka", page_number: 97, category: "kokurikulum" },
      { label: "AJK JK RIMUP", page_number: 97, category: "kokurikulum" }
    ]
  },
  {
    nama: "PN. SITI NUR FARAH BINTI ZAINUDIN",
    jawatan: "Guru Pendidikan Khas",
    avatar: "👩‍🏫",
    tugas: [
      { label: "Guru Pendidikan Khas", page_number: 17, category: "ppkip" },
      { label: "Setiausaha Kesihatan", page_number: 86, category: "hem" },
      { label: "Setiausaha Pengakap PPKIP", page_number: 106, category: "ppkip" },
      { label: "Bendahari Rumah Melati", page_number: 97, category: "kokurikulum" },
      { label: "Kejohanan Balapan Daerah PPKIP", page_number: 106, category: "ppkip" }
    ]
  }
];

// =====================================================
// CATEGORY COLORS & LABELS
// =====================================================
const categoryConfig = {
  pentadbiran: { color: "#0ea5e9", label: "Pentadbiran", bg: "bg-sky-500" },
  kurikulum: { color: "#10b981", label: "Kurikulum", bg: "bg-emerald-500" },
  hem: { color: "#f59e0b", label: "HEM", bg: "bg-amber-500" },
  kokurikulum: { color: "#ef4444", label: "Kokurikulum", bg: "bg-red-500" },
  ppkip: { color: "#ec4899", label: "PPKIP", bg: "bg-pink-500" }
};

// =====================================================
// MAIN APPLICATION COMPONENT
// =====================================================
export default function BukuPengurusanDigital() {
  const [activeTab, setActiveTab] = useState('guru');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [highlightText, setHighlightText] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [filterCategory, setFilterCategory] = useState('all');
  const pdfContainerRef = useRef(null);
  const totalPages = 106;

  // Filter guru based on search term
  const filteredGuru = guruDatabase.filter(guru =>
    guru.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guru.jawatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // =====================================================
  // FUNGSI NAVIGASI & HIGHLIGHT (CIRI UTAMA)
  // Apabila tugas diklik:
  // 1. Beralih ke Tab PDF (Buku Digital)
  // 2. Melompat ke page_number yang berkaitan
  // 3. Highlight nama guru pada muka surat tersebut
  // =====================================================
  const navigateToTask = (guru, task) => {
    // 1. Set highlight text to guru's name for PDF search/highlight
    setHighlightText(guru.nama);
    
    // 2. Jump to the specific page number
    setCurrentPage(task.page_number);
    
    // 3. Switch to PDF tab
    setActiveTab('buku');
    
    // 4. Show toast notification
    setToastMessage(`Melompat ke muka surat ${task.page_number} - ${task.label}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    // 5. Scroll PDF container to top
    if (pdfContainerRef.current) {
      pdfContainerRef.current.scrollTop = 0;
    }
  };

  // Navigate to section from TOC
  const navigateToSection = (section) => {
    setCurrentPage(section.page_start);
    setHighlightText('');
    setToastMessage(`Melompat ke ${section.label} - Muka surat ${section.page_start}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Page navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // =====================================================
  // RENDER COMPONENTS
  // =====================================================
  
  // Toast Notification
  const Toast = () => (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-xl">✓</span>
        </div>
        <span className="font-medium">{toastMessage}</span>
      </div>
    </div>
  );

  // Header Component
  const Header = () => (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl">📚</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Buku Pengurusan Digital</h1>
              <p className="text-white/80 text-sm">{tableOfContents.sekolah} • {tableOfContents.tahun}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
            <span className="text-sm text-white/70">Smart Search & Highlight</span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          </div>
        </div>
      </div>
    </div>
  );

  // Tab Navigation
  const TabNavigation = () => (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 py-2">
          {[
            { id: 'buku', label: 'Buku Digital', icon: '📖', desc: 'PDF Viewer' },
            { id: 'guru', label: 'Carian Guru', icon: '👥', desc: 'Smart Search' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <div className="text-left">
                <div className="font-semibold">{tab.label}</div>
                <div className={`text-xs ${activeTab === tab.id ? 'text-white/70' : 'text-gray-400'}`}>{tab.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // PDF Viewer Tab
  const PDFViewerTab = () => (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Sidebar - Table of Contents */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Navigasi Pantas</h3>
          <div className="space-y-2">
            {tableOfContents.tajuk_utama.map((section) => (
              <button
                key={section.id}
                onClick={() => navigateToSection(section)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 group hover:shadow-md ${
                  currentPage >= section.page_start && currentPage <= section.page_end
                    ? 'bg-white shadow-md ring-2 ring-indigo-500'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: section.color }}
                >
                  {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate text-sm">{section.label}</div>
                  <div className="text-xs text-gray-500">m/s {section.page_start} - {section.page_end}</div>
                </div>
                <div className="text-gray-400 group-hover:text-indigo-500 transition-colors">→</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main PDF Viewer */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* PDF Controls */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ←
            </button>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className="w-12 text-center bg-transparent font-medium"
                min={1}
                max={totalPages}
              />
              <span className="text-gray-500">/ {totalPages}</span>
            </div>
            <button 
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              →
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {highlightText && (
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-lg text-sm">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                Highlight: <span className="font-medium">{highlightText}</span>
                <button 
                  onClick={() => setHighlightText('')}
                  className="ml-1 hover:text-yellow-900"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
              <button onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))} className="p-1 hover:bg-gray-200 rounded">−</button>
              <span className="text-sm font-medium w-12 text-center">{zoomLevel}%</span>
              <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="p-1 hover:bg-gray-200 rounded">+</button>
            </div>
          </div>
        </div>

        {/* PDF Content Area */}
        <div ref={pdfContainerRef} className="flex-1 overflow-auto p-8 flex justify-center">
          <div 
            className="bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Simulated PDF Page */}
            <div className="w-[595px] h-[842px] p-8 relative">
              {/* Page Header */}
              <div className="absolute top-4 left-0 right-0 flex justify-between px-8 text-xs text-gray-400">
                <span>MANUAL PENGURUSAN 2021</span>
                <span>SK SULTAN ABU BAKAR (1)</span>
              </div>
              
              {/* Page Content Simulation */}
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-4xl text-white">📄</span>
                </div>
                <div className="text-6xl font-bold text-gray-200 mb-4">{currentPage}</div>
                <div className="text-gray-500 mb-2">Muka Surat {currentPage} daripada {totalPages}</div>
                
                {/* Show current section */}
                {tableOfContents.tajuk_utama.map(section => (
                  currentPage >= section.page_start && currentPage <= section.page_end && (
                    <div 
                      key={section.id}
                      className="mt-4 px-4 py-2 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: section.color }}
                    >
                      {section.icon} {section.label}
                    </div>
                  )
                ))}
                
                {/* Highlight indicator */}
                {highlightText && (
                  <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl max-w-sm">
                    <div className="text-yellow-600 text-sm mb-2">🔍 Carian Aktif:</div>
                    <div className="font-bold text-yellow-800 bg-yellow-200 px-3 py-1 rounded inline-block">
                      {highlightText}
                    </div>
                    <div className="text-xs text-yellow-600 mt-2">
                      Dalam aplikasi sebenar, nama ini akan di-highlight dalam PDF viewer menggunakan fungsi searchText()
                    </div>
                  </div>
                )}
              </div>
              
              {/* Page Footer */}
              <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400">
                MANUAL PENGURUSAN 2021 SK SULTAN ABU BAKAR (1) {currentPage}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Guru Search Tab
  const GuruSearchTab = () => (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</div>
            <input
              type="text"
              placeholder="Cari nama guru atau jawatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white transition-all outline-none text-lg"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterCategory === 'all' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semua
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setFilterCategory(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterCategory === key 
                    ? 'text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={filterCategory === key ? { backgroundColor: config.color } : {}}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Menunjukkan {filteredGuru.length} daripada {guruDatabase.length} guru
        </div>
      </div>

      {/* Guru Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuru.map((guru, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer ${
              selectedGuru?.nama === guru.nama ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setSelectedGuru(selectedGuru?.nama === guru.nama ? null : guru)}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl backdrop-blur-sm">
                  {guru.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{guru.nama}</h3>
                  <p className="text-white/80 text-sm truncate">{guru.jawatan}</p>
                </div>
              </div>
            </div>
            
            {/* Task List */}
            <div className="p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Tugas & Jawatankuasa ({guru.tugas.length})
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {guru.tugas
                  .filter(t => filterCategory === 'all' || t.category === filterCategory)
                  .map((task, taskIndex) => (
                  <button
                    key={taskIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToTask(guru, task);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group flex items-center gap-3"
                  >
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: categoryConfig[task.category]?.color }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-700 truncate group-hover:text-indigo-600 transition-colors">
                        {task.label}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        <span style={{ color: categoryConfig[task.category]?.color }}>
                          {categoryConfig[task.category]?.label}
                        </span>
                        <span>•</span>
                        <span>m/s {task.page_number}</span>
                      </div>
                    </div>
                    <div className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all">
                      →
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredGuru.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Tiada hasil ditemui</h3>
          <p className="text-gray-500">Cuba cari dengan kata kunci lain</p>
        </div>
      )}
    </div>
  );

  // =====================================================
  // MAIN RENDER
  // =====================================================
  return (
    <div className="min-h-screen bg-gray-100">
      <Toast />
      <Header />
      <TabNavigation />
      
      {activeTab === 'buku' && <PDFViewerTab />}
      {activeTab === 'guru' && <GuruSearchTab />}
      
      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Buku Pengurusan Digital © 2021 SK Sultan Abu Bakar (1)</p>
          <p className="text-xs mt-1">Sistem Navigasi Pintar dengan Smart Search & Highlight</p>
        </div>
      </div>
    </div>
  );
}
