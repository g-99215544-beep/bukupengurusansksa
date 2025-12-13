# 📚 BUKU PENGURUSAN DIGITAL
## Sistem Navigasi Pintar dengan Smart Search & Highlight

**SK Sultan Abu Bakar (1) - Tahun 2021**

---

## 📋 KANDUNGAN DOKUMENTASI

1. [Pengenalan](#pengenalan)
2. [Struktur Data JSON](#struktur-data-json)
3. [Cara Penggunaan Aplikasi](#cara-penggunaan-aplikasi)
4. [Penjelasan Kod Sumber](#penjelasan-kod-sumber)
5. [Integrasi PDF Viewer Sebenar](#integrasi-pdf-viewer-sebenar)
6. [Fail-fail yang Disertakan](#fail-fail-yang-disertakan)

---

## 🎯 PENGENALAN

Aplikasi **Buku Pengurusan Digital** adalah sistem navigasi pintar yang menghubungkan data guru secara terus ke dalam paparan PDF. Ciri-ciri utama:

- ✅ **Carian Pantas** - Cari nama guru dengan dropdown interaktif
- ✅ **Deep-Link Navigation** - Klik tugas terus melompat ke muka surat berkaitan
- ✅ **Smart Highlight** - Nama guru di-highlight secara automatik
- ✅ **Table of Contents** - Navigasi ke seksyen utama dengan satu klik
- ✅ **Kategori Tugas** - Filter mengikut Pentadbiran/Kurikulum/HEM/Kokurikulum/PPKIP

---

## 📊 STRUKTUR DATA JSON

### 1. JSON Indeks Tajuk Utama (table_of_contents.json)

```json
{
  "sekolah": "SK Sultan Abu Bakar (1)",
  "tahun": 2021,
  "tajuk_utama": [
    {
      "id": "prakata",
      "label": "Prakata & Pengenalan",
      "page_start": 1,
      "page_end": 16
    },
    {
      "id": "pentadbiran",
      "label": "Pengurusan Sekolah",
      "page_start": 19,
      "page_end": 66
    },
    {
      "id": "kurikulum",
      "label": "Pengurusan Kurikulum",
      "page_start": 67,
      "page_end": 79
    },
    {
      "id": "hem",
      "label": "Hal Ehwal Murid",
      "page_start": 80,
      "page_end": 87
    },
    {
      "id": "kokurikulum",
      "label": "Pengurusan Kokurikulum",
      "page_start": 88,
      "page_end": 98
    },
    {
      "id": "ppkip",
      "label": "Pengurusan PPKIP",
      "page_start": 99,
      "page_end": 106
    }
  ]
}
```

### 2. JSON Pangkalan Data Guru & Tugas (guru_database.json)

```json
{
  "nama": "PN. HJH. AIDAH BINTI SULAIMAN",
  "jawatan": "Guru Besar",
  "tugas": [
    {
      "label": "Pengerusi JK Kewangan Sekolah",
      "page_number": 55,
      "category": "pentadbiran"
    },
    {
      "label": "Pengerusi JK Induk Kurikulum",
      "page_number": 69,
      "category": "kurikulum"
    },
    {
      "label": "Pengerusi JK Induk HEM",
      "page_number": 84,
      "category": "hem"
    }
  ]
}
```

**Kategori yang tersedia:**
- `pentadbiran` - Tugas pengurusan dan pentadbiran
- `kurikulum` - Tugas berkaitan akademik dan kurikulum
- `hem` - Tugas Hal Ehwal Murid
- `kokurikulum` - Tugas aktiviti kokurikulum
- `ppkip` - Tugas Pendidikan Khas

---

## 🖱️ CARA PENGGUNAAN APLIKASI

### Tab A: BUKU DIGITAL (PDF Viewer)

1. **Navigasi Panel Tepi** - Klik pada seksyen untuk melompat ke muka surat berkaitan
2. **Kawalan Muka Surat** - Guna butang ← → atau masukkan nombor muka surat
3. **Zoom In/Out** - Guna butang + / - untuk zum
4. **Highlight Indicator** - Paparan nama guru yang sedang dicari

### Tab B: CARIAN GURU (Smart Search)

1. **Kotak Carian** - Taip nama atau jawatan guru
2. **Filter Kategori** - Klik butang kategori untuk tapis tugas
3. **Kad Guru** - Klik untuk lihat senarai tugas
4. **Klik Tugas** - Terus melompat ke PDF dengan highlight

---

## 💻 PENJELASAN KOD SUMBER

### Fungsi Utama: navigateToTask()

```javascript
/**
 * FUNGSI NAVIGASI & HIGHLIGHT (CIRI UTAMA)
 * 
 * Apabila tugas diklik:
 * 1. Set highlightText kepada nama guru untuk carian PDF
 * 2. Melompat ke page_number yang berkaitan
 * 3. Beralih ke Tab PDF (Buku Digital)
 * 4. Paparkan toast notification
 * 5. Scroll PDF container ke atas
 */
const navigateToTask = (guru, task) => {
  // 1. Set highlight text - akan digunakan oleh PDF viewer untuk searchText()
  setHighlightText(guru.nama);
  
  // 2. Jump to specific page number dari JSON
  setCurrentPage(task.page_number);
  
  // 3. Switch to PDF tab
  setActiveTab('buku');
  
  // 4. Show notification
  setToastMessage(`Melompat ke muka surat ${task.page_number} - ${task.label}`);
  setShowToast(true);
  
  // 5. Scroll to top
  if (pdfContainerRef.current) {
    pdfContainerRef.current.scrollTop = 0;
  }
};
```

### Struktur Komponen React

```
BukuPengurusanDigital (Main Component)
├── Header - Logo dan tajuk sekolah
├── TabNavigation - Butang Tab A & Tab B
├── PDFViewerTab
│   ├── Sidebar (Table of Contents)
│   ├── PDF Controls (navigation, zoom)
│   └── PDF Content Area (dengan highlight indicator)
└── GuruSearchTab
    ├── Search & Filter Bar
    └── Guru Cards Grid
        └── Task List (clickable → navigateToTask)
```

---

## 🔧 INTEGRASI PDF VIEWER SEBENAR

Untuk mengintegrasikan dengan PDF viewer sebenar seperti `react-pdf` atau `pdf.js`, ikuti langkah berikut:

### Menggunakan react-pdf

```javascript
import { Document, Page, pdfjs } from 'react-pdf';

// Dalam component
const [searchResults, setSearchResults] = useState([]);

// Fungsi untuk highlight text dalam PDF
const highlightTextInPDF = async (searchText) => {
  const pdf = await pdfjs.getDocument(pdfUrl).promise;
  const page = await pdf.getPage(currentPage);
  const textContent = await page.getTextContent();
  
  // Cari text dan highlight
  const matches = textContent.items.filter(item => 
    item.str.toLowerCase().includes(searchText.toLowerCase())
  );
  
  setSearchResults(matches);
};

// Update navigateToTask
const navigateToTask = (guru, task) => {
  setCurrentPage(task.page_number);
  highlightTextInPDF(guru.nama); // Trigger highlight
  setActiveTab('buku');
};
```

### Menggunakan PDF.js dengan Custom Highlight

```javascript
// Fungsi searchText untuk PDF.js
const searchAndHighlight = (text, pageNumber) => {
  const pdfViewer = document.querySelector('.pdf-viewer');
  
  // Guna PDF.js findController
  pdfViewer.findController.executeCommand('find', {
    query: text,
    phraseSearch: true,
    caseSensitive: false,
    highlightAll: true,
    findPrevious: false
  });
  
  // Jump to page
  pdfViewer.currentPageNumber = pageNumber;
};
```

### Menggunakan @react-pdf-viewer/core

```javascript
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { searchPlugin } from '@react-pdf-viewer/search';

const searchPluginInstance = searchPlugin();
const { highlight, jumpToMatch } = searchPluginInstance;

// Dalam navigateToTask
const navigateToTask = (guru, task) => {
  // Jump to page
  jumpToPage(task.page_number - 1); // 0-indexed
  
  // Highlight nama guru
  highlight(guru.nama);
  
  setActiveTab('buku');
};
```

---

## 📁 FAIL-FAIL YANG DISERTAKAN

| Fail | Penerangan |
|------|------------|
| `buku-pengurusan-digital.jsx` | Kod sumber React lengkap |
| `table_of_contents.json` | JSON indeks tajuk utama |
| `guru_database.json` | JSON pangkalan data guru & tugas |
| `BUKU_PENGURUSAN_2021.pdf` | Fail PDF asal |
| `DOKUMENTASI.md` | Dokumentasi ini |

---

## 🎨 TEKNOLOGI YANG DIGUNAKAN

- **React** - Framework UI
- **Tailwind CSS** - Styling (via className utilities)
- **PDF.js / react-pdf** - PDF rendering (untuk integrasi sebenar)

---

## 📈 KELEBIHAN SISTEM INI

1. **Menjimatkan Masa** - Guru tidak perlu scroll manual, klik sahaja tugas dan terus ke halaman berkaitan

2. **Ketepatan Tinggi** - Dengan `page_number` dalam JSON, aplikasi sangat pantas kerana tidak perlu scan seluruh dokumen

3. **User Experience (UX)** - Ciri highlight memberikan kesan profesional dan memudahkan pengguna mencari nama dalam senarai panjang

4. **Scalable** - Mudah dikembangkan untuk tahun-tahun seterusnya dengan hanya mengemas kini data JSON

---

## 📞 SOKONGAN

Untuk sebarang pertanyaan atau penambahbaikan, sila hubungi pentadbir sistem.

---

*Dokumentasi ini disediakan untuk Aplikasi Buku Pengurusan Digital SK Sultan Abu Bakar (1) 2021*
