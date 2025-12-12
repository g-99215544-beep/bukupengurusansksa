// PDF.js Reader (GitHub Pages) - Lompat page confirm
// Fail PDF mesti di root repo: BUKU_PENGURUSAN_2021.pdf

const PDF_URL = "./BUKU_PENGURUSAN_2021.pdf";

// Pastikan worker versi sama dengan pdf.min.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@2.0.489/build/pdf.worker.min.js";

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
  ]},
];

const QUICK = [
  { label: "Garis Panduan", page: 28 },
  { label: "Takwim", page: 37 },
  { label: "Jadual Bertugas", page: 49 },
  { label: "Organisasi Sekolah", page: 54 },
];

const els = {
  tabs: Array.from(document.querySelectorAll(".tab")),
  tabToc: document.getElementById("tab-toc"),
  tabPantas: document.getElementById("tab-pantas"),
  status: document.getElementById("status"),
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

function setTab(name){
  els.tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  document.getElementById("tab-toc").classList.toggle("hidden", name !== "toc");
  document.getElementById("tab-pantas").classList.toggle("hidden", name !== "pantas");
}
els.tabs.forEach(t => t.addEventListener("click", () => setTab(t.dataset.tab)));

function setStatus(txt){ els.status.textContent = txt; }

function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

async function renderPage(pageNum){
  if (!pdfDoc) return;

  currentPage = clamp(pageNum, 1, pdfDoc.numPages);
  els.pageNum.value = String(currentPage);
  els.pageNote.textContent = `/ ${pdfDoc.numPages}`;

  // cancel render lama jika ada
  if (renderTask && renderTask.cancel) {
    try { renderTask.cancel(); } catch(e) {}
  }

  const page = await pdfDoc.getPage(currentPage);

  // scale ikut zoom
  const scale = (zoomPct / 100);
  const viewport = page.getViewport({ scale });

  // HiDPI
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
  // anggar fit lebar: guna page semasa
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
    });
    els.quickLinks.appendChild(row);
  });
}

async function loadPdf(){
  setStatus("Loading PDF…");
  buildTocUI();
  buildQuickLinks();
  setTab("toc");

  const loadingTask = pdfjsLib.getDocument({
    url: PDF_URL,
    // GitHub Pages ok
    withCredentials: false,
  });

  pdfDoc = await loadingTask.promise;
  els.pageNote.textContent = `/ ${pdfDoc.numPages}`;
  setStatus("Sedia");

  gotoPage(1);
}

function wireUI(){
  els.prev.addEventListener("click", () => gotoPage(currentPage - 1));
  els.next.addEventListener("click", () => gotoPage(currentPage + 1));
  els.pageNum.addEventListener("change", () => gotoPage(els.pageNum.value));

  els.zoom.addEventListener("input", () => updateZoom(els.zoom.value));
  els.zoomIn.addEventListener("click", () => updateZoom(zoomPct + 10));
  els.zoomOut.addEventListener("click", () => updateZoom(zoomPct - 10));

  els.btnOpenPdf.addEventListener("click", () => {
    window.open(`${PDF_URL}#page=${currentPage}`, "_blank", "noopener,noreferrer");
  });

  els.btnFit.addEventListener("click", fitToWidth);

  window.addEventListener("resize", () => {
    // jangan auto fit setiap resize, tapi refresh render supaya tak blur
    renderPage(currentPage);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") gotoPage(currentPage - 1);
    if (e.key === "ArrowRight") gotoPage(currentPage + 1);
  });
}

wireUI();
loadPdf().catch(err => {
  console.error(err);
  setStatus("Gagal load PDF");
  alert("Gagal load PDF. Semak nama fail PDF & pastikan ia ada di root repo.");
});
