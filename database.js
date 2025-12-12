// Reader Buku Pengurusan (PDF.js) - UI Mobile kemas (drawer TOC + tools toggle)
// Fail PDF mesti di root repo: BUKU_PENGURUSAN_2021.pdf

const PDF_URL = "./BUKU_PENGURUSAN_2021.pdf";

// TOC (boleh edit)
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
  btnToc: document.getElementById("btnToc"),
  drawer: document.getElementById("drawer"),
  backdrop: document.getElementById("drawerBackdrop"),
  toolPanel: document.getElementById("toolPanel"),
  btnTools: document.getElementById("btnTools"),

  tabs: Array.from(document.querySelectorAll(".tab")),
  status: document.getElementById("status"),
  tabToc: document.getElementById("tab-toc"),
  tabPantas: document.getElementById("tab-pantas"),
  quickLinks: document.getElementById("quickLinks"),

  canvas: document.getElementById("pdfCanvas"),
  canvasWrap: document.getElementById("canvasWrap"),

  pageNum: document.getElementById("pageNum"),
  pageNote: document.getElementById("pageNote"),
  prev: document.getElementById("prev"),
  next: document.getElementById("next"),

  zoom: document.getElementById("zoom"),
  zoomLabel: document.getElementById("zoomLabel"),
  zoomIn: document.getElementById("zoomIn"),
  zoomOut: document.getElementById("zoomOut"),

  btnOpenPdf: document.getElementById("btnOpenPdf"),
  btnFit: document.getElementById("btnFit"),
};

let pdfDoc = null;
let currentPage = 1;
let zoomPct = 110;
let renderTask = null;

function isMobile(){
  return window.matchMedia && window.matchMedia("(max-width: 1000px)").matches;
}

function setDrawerTop(){
  // Align drawer below the sticky header (dynamic)
  const header = document.querySelector("header");
  if (!header || !els.drawer) return;
  const rect = header.getBoundingClientRect();
  els.drawer.style.top = `${Math.ceil(rect.height)}px`;
}

function openDrawer(){
  document.body.classList.add("drawer-open");
}
function closeDrawer(){
  document.body.classList.remove("drawer-open");
}
function toggleDrawer(){
  document.body.classList.toggle("drawer-open");
}

function setTab(name){
  els.tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  document.getElementById("tab-toc").classList.toggle("hidden", name !== "toc");
  document.getElementById("tab-pantas").classList.toggle("hidden", name !== "pantas");
}
els.tabs.forEach(t => t.addEventListener("click", () => setTab(t.dataset.tab)));

function setStatus(txt){ if (els.status) els.status.textContent = txt; }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

async function renderPage(pageNum){
  if (!pdfDoc) return;

  currentPage = clamp(pageNum, 1, pdfDoc.numPages);
  els.pageNum.value = String(currentPage);
  els.pageNote.textContent = `/ ${pdfDoc.numPages}`;

  if (renderTask && renderTask.cancel) {
    try { renderTask.cancel(); } catch(e) {}
  }

  const page = await pdfDoc.getPage(currentPage);
  const scale = (zoomPct / 100);
  const viewport = page.getViewport({ scale });

  const dpr = window.devicePixelRatio || 1;
  const canvas = els.canvas;
  const ctx = canvas.getContext("2d", { alpha: false });

  canvas.width = Math.floor(viewport.width * dpr);
  canvas.height = Math.floor(viewport.height * dpr);
  canvas.style.width = `${Math.floor(viewport.width)}px`;
  canvas.style.height = `${Math.floor(viewport.height)}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  renderTask = page.render({ canvasContext: ctx, viewport });
  await renderTask.promise;

  setStatus(`Muka ${currentPage}`);
}

function gotoPage(n){
  const p = Number(n) || 1;
  renderPage(p);
}

function updateZoom(newZoom){
  zoomPct = clamp(Number(newZoom) || 110, 60, 200);
  els.zoom.value = String(zoomPct);
  els.zoomLabel.textContent = `${zoomPct}%`;
  renderPage(currentPage);
}

function fitToWidth(){
  if (!pdfDoc) return;
  pdfDoc.getPage(currentPage).then(page => {
    const wrapW = els.canvasWrap.clientWidth - 24; // padding
    const viewport1 = page.getViewport({ scale: 1 });
    const fitScale = wrapW / viewport1.width;
    const fitZoom = clamp(Math.floor(fitScale * 100), 60, 200);
    updateZoom(fitZoom);
  });
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

        // Mobile: close drawer after choose
        if (isMobile()) closeDrawer();
      });
      body.appendChild(row);
    });

    let open = (gi === 0);
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
      if (isMobile()) closeDrawer();
    });
    els.quickLinks.appendChild(row);
  });
}

async function loadPdf(){
  setStatus("Loading PDF…");
  buildTocUI();
  buildQuickLinks();
  setTab("toc");

  const pdfjsLib = window.pdfjsLib;
  if (!pdfjsLib) throw new Error("pdfjsLib not loaded");

  const workerSrc = window.pdfjsWorkerSrc;
  if (workerSrc) pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

  const loadingTask = pdfjsLib.getDocument({ url: PDF_URL, withCredentials: false });
  pdfDoc = await loadingTask.promise;

  els.pageNote.textContent = `/ ${pdfDoc.numPages}`;
  setStatus("Sedia");
  gotoPage(1);

  // Mobile: auto fit width supaya besar
  if (isMobile()) {
    setTimeout(() => fitToWidth(), 200);
  }
}

function wireUI(){
  // Drawer
  setDrawerTop();
  window.addEventListener("resize", () => {
    setDrawerTop();
    // refresh render to reduce blur
    renderPage(currentPage);
    if (isMobile()) {
      // optional: keep fit on rotate
      setTimeout(() => fitToWidth(), 180);
    }
  });

  els.btnToc.addEventListener("click", () => {
    if (isMobile()) toggleDrawer();
    else openDrawer();
  });

  els.backdrop.addEventListener("click", closeDrawer);

  // Close drawer on ESC (desktop)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
    if (e.key === "ArrowLeft") gotoPage(currentPage - 1);
    if (e.key === "ArrowRight") gotoPage(currentPage + 1);
  });

  // Tools toggle (mobile)
  els.btnTools.addEventListener("click", () => {
    els.toolPanel.classList.toggle("open");
  });

  // Page controls
  els.prev.addEventListener("click", () => gotoPage(currentPage - 1));
  els.next.addEventListener("click", () => gotoPage(currentPage + 1));
  els.pageNum.addEventListener("change", () => gotoPage(els.pageNum.value));

  // Zoom
  els.zoom.addEventListener("input", () => updateZoom(els.zoom.value));
  els.zoomIn.addEventListener("click", () => updateZoom(zoomPct + 10));
  els.zoomOut.addEventListener("click", () => updateZoom(zoomPct - 10));

  els.btnOpenPdf.addEventListener("click", () => {
    window.open(`${PDF_URL}#page=${currentPage}`, "_blank", "noopener,noreferrer");
  });

  els.btnFit.addEventListener("click", fitToWidth);
}

wireUI();

// Called by index.html after PDF.js successfully loaded
window.initPdfApp = function initPdfApp(){
  loadPdf().catch(err => {
    console.error(err);
    setStatus("Gagal load PDF");
    alert("Gagal load PDF. Semak nama fail PDF & pastikan ia ada di root repo.");
  });
};
