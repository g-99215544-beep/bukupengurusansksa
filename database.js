// Reader Buku Pengurusan (Tanpa PDF.js)
// Versi ini guna PDF viewer native browser (paling stabil untuk GitHub Pages)
// Lompat page/zoom guna URL fragment: #page= &zoom=
//
// Nota: Carian teks penuh dalam PDF guna Ctrl+F dalam viewer PDF.

const PDF_URL = "./BUKU_PENGURUSAN_2021.pdf";

const TOC = [
  { group: "Maklumat Umum", items: [
    { title: "Isi Kandungan", start: 1, end: 1 },
    { title: "Prakata", start: 2, end: 3 },
    { title: "Surat Aku Janji", start: 4, end: 4 },
    { title: "Warga Pendidik & Staf Sokongan", start: 5, end: 6 },
    { title: "Falsafah Pendidikan Kebangsaan & Misi KPM", start: 7, end: 7 },
    { title: "Sejarah Sekolah & Senarai Guru Besar", start: 8, end: 9 },
    { title: "Profil Sekolah", start: 10, end: 10 },
    { title: "Cogan Kata, Guru Kelas & Enrolmen", start: 11, end: 11 },
    { title: "Lencana & Bendera Sekolah", start: 12, end: 12 },
    { title: "Matlamat, Objektif & Piagam", start: 13, end: 15 },
    { title: "Lagu Sekolah", start: 16, end: 16 },
    { title: "Senarai Nama Guru & Staf", start: 17, end: 18 },
    { title: "Carta Organisasi Induk", start: 19, end: 19 },
    { title: "Pelan Sekolah", start: 20, end: 20 },
    { title: "Aspirasi & Anjakan PPPM", start: 21, end: 22 },
    { title: "Prinsip Kerja JPNJ & PPD Muar", start: 23, end: 24 },
    { title: "Kalender Persekolahan", start: 25, end: 25 },
    { title: "MMI, MBMMBI & Sarana Sekolah", start: 26, end: 27 },
  ]},
  { group: "Pengurusan Sekolah", items: [
    { title: "Garis Panduan Utama Sekolah", start: 28, end: 35 },
    { title: "Takwim", start: 37, end: 46 },
    { title: "Jadual Guru Bertugas Mingguan", start: 49, end: 53 },
    { title: "Carta Organisasi Sekolah", start: 54, end: 54 },
    { title: "Majlis Pengurusan Am & Tugas-Tugas Khas", start: 55, end: 66 },
  ]},
  { group: "Pengurusan Kurikulum", items: [
    { title: "Carta Organisasi Kurikulum", start: 67, end: 67 },
    { title: "Majlis Pengurusan Kurikulum", start: 68, end: 74 },
    { title: "Jadual Penyeliaan PdPc (Pencerapan Guru)", start: 75, end: 75 },
    { title: "Jadual Penyeliaan HKM", start: 76, end: 76 },
    { title: "Takwim PBS & Modul UPSR", start: 77, end: 77 },
    { title: "Pencapaian UPSR", start: 78, end: 78 },
    { title: "Giliran Bertugas GPK Semasa Cuti", start: 79, end: 79 },
  ]},
  { group: "Pengurusan Hal Ehwal Murid", items: [
    { title: "Carta Organisasi HEM", start: 80, end: 80 },
    { title: "Dasar HEM", start: 81, end: 83 },
    { title: "Majlis Pengurusan HEM", start: 84, end: 87 },
  ]},
  { group: "Pengurusan Kokurikulum", items: [
    { title: "Carta Organisasi Kokurikulum", start: 88, end: 88 },
    { title: "Pengenalan & Panduan Kokurikulum", start: 89, end: 93 },
    { title: "Majlis Pengurusan Kokurikulum", start: 94, end: 97 },
    { title: "Program & Aktiviti Sekolah", start: 98, end: 98 },
  ]},
  { group: "Pengurusan PPKIP", items: [
    { title: "Carta Organisasi PPKIP", start: 99, end: 99 },
    { title: "Majlis Pengurusan PPKIP", start: 100, end: 106 },
  ]},
];

const QUICK = [
  { label: "Garis Panduan", page: 28 },
  { label: "Takwim", page: 37 },
  { label: "Jadual Bertugas", page: 49 },
  { label: "Organisasi Sekolah", page: 54 },
  { label: "Senarai Guru", page: 17 },
  { label: "Pelan Sekolah", page: 20 },
];

const els = {
  tabs: Array.from(document.querySelectorAll(".tab")),
  tabToc: document.getElementById("tab-toc"),
  tabPantas: document.getElementById("tab-pantas"),
  status: document.getElementById("status"),
  quickLinks: document.getElementById("quickLinks"),
  pdfFrame: document.getElementById("pdfFrame"),

  pageNum: document.getElementById("pageNum"),
  pageNote: document.getElementById("pageNote"),
  prev: document.getElementById("prev"),
  next: document.getElementById("next"),

  zoom: document.getElementById("zoom"),
  zoomLabel: document.getElementById("zoomLabel"),
  zoomIn: document.getElementById("zoomIn"),
  zoomOut: document.getElementById("zoomOut"),

  btnOpenNative: document.getElementById("btnOpenNative"),
  btnHelp: document.getElementById("btnHelp"),
  helpBox: document.getElementById("helpBox"),
  btnFindTip: document.getElementById("btnFindTip"),
};

let currentPage = 1;
let zoomPct = 110;

function setTab(name){
  els.tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  document.getElementById("tab-toc").classList.toggle("hidden", name !== "toc");
  document.getElementById("tab-pantas").classList.toggle("hidden", name !== "pantas");
}
els.tabs.forEach(t => t.addEventListener("click", () => setTab(t.dataset.tab)));

function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

function setStatus(text){ els.status.textContent = text; }

function pdfSrc(page, zoom){
  return `${PDF_URL}#page=${page}&zoom=${zoom}`;
}

function gotoPage(p){
  currentPage = Math.max(1, Number(p) || 1);
  els.pageNum.value = String(currentPage);
  els.pageNote.textContent = "/ (guna viewer PDF untuk total page)";
  els.pdfFrame.src = pdfSrc(currentPage, zoomPct);
  setStatus(`Muka ${currentPage}`);
}

function updateZoom(){
  zoomPct = clamp(Number(els.zoom.value) || 110, 70, 180);
  els.zoomLabel.textContent = `${zoomPct}%`;
  els.pdfFrame.src = pdfSrc(currentPage, zoomPct);
}

function buildTocUI(){
  els.tabToc.innerHTML = "";
  TOC.forEach((g, gi) => {
    const wrap = document.createElement("div");
    wrap.className = "section";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = `<span>${g.group}</span><span class="muted">${g.items.length} item</span>`;

    const body = document.createElement("div");
    body.className = "sectionBody";

    g.items.forEach(it => {
      const row = document.createElement("div");
      row.className = "tocItem";
      row.innerHTML = `
        <div>
          <div class="name">${it.title}</div>
          <div class="meta">m/s ${it.start}${it.start===it.end ? "" : ("–"+it.end)}</div>
        </div>
        <div class="badge">${it.start===it.end ? it.start : (it.start+"–"+it.end)}</div>
      `;
      row.addEventListener("click", () => {
        document.querySelectorAll(".tocItem").forEach(x => x.classList.remove("active"));
        row.classList.add("active");
        gotoPage(it.start);
      });
      body.appendChild(row);
    });

    let open = (gi === 1);
    body.style.display = open ? "block" : "none";
    btn.addEventListener("click", () => {
      open = !open;
      body.style.display = open ? "block" : "none";
    });

    wrap.appendChild(btn);
    wrap.appendChild(body);
    els.tabToc.appendChild(wrap);
  });
}

function buildQuickLinks(){
  els.quickLinks.innerHTML = "";
  QUICK.forEach(q => {
    const row = document.createElement("div");
    row.className = "tocItem";
    row.innerHTML = `
      <div>
        <div class="name">${q.label}</div>
        <div class="meta">m/s ${q.page}</div>
      </div>
      <div class="badge">${q.page}</div>
    `;
    row.addEventListener("click", () => {
      setTab("toc");
      gotoPage(q.page);
    });
    els.quickLinks.appendChild(row);
  });
}

function toggleHelp(){ els.helpBox.classList.toggle("hidden"); }

function openNative(){ window.open(PDF_URL, "_blank", "noopener,noreferrer"); }

function handleKeys(e){
  const k = e.key.toLowerCase();
  if(k === "escape"){ els.helpBox.classList.add("hidden"); return; }
  if(k === "arrowleft") gotoPage(currentPage - 1);
  if(k === "arrowright") gotoPage(currentPage + 1);
  if(k === "+"){ els.zoom.value = String(clamp(Number(els.zoom.value)+5, 70, 180)); updateZoom(); }
  if(k === "-"){ els.zoom.value = String(clamp(Number(els.zoom.value)-5, 70, 180)); updateZoom(); }
}

function init(){
  buildTocUI();
  buildQuickLinks();
  setTab("toc");

  els.prev.addEventListener("click", () => gotoPage(currentPage - 1));
  els.next.addEventListener("click", () => gotoPage(currentPage + 1));
  els.pageNum.addEventListener("change", () => gotoPage(els.pageNum.value));

  els.zoom.addEventListener("input", updateZoom);
  els.zoomIn.addEventListener("click", () => { els.zoom.value = String(clamp(Number(els.zoom.value)+10, 70, 180)); updateZoom(); });
  els.zoomOut.addEventListener("click", () => { els.zoom.value = String(clamp(Number(els.zoom.value)-10, 70, 180)); updateZoom(); });

  els.btnOpenNative.addEventListener("click", openNative);
  els.btnHelp.addEventListener("click", toggleHelp);

  els.btnFindTip.addEventListener("click", () => {
    alert("Untuk cari perkataan dalam PDF: klik pada area PDF, tekan Ctrl+F (Windows) / ⌘+F (Mac).");
  });

  window.addEventListener("keydown", handleKeys);

  els.zoom.value = String(zoomPct);
  updateZoom();
  gotoPage(1);
}

init();
