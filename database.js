/* Reader Buku Pengurusan (Client-side)
   - PDF.js viewer
   - TOC (Isi Kandungan) + Quick Links
   - Text indexing & search (cached in localStorage)
*/

const DEFAULT_PDF_URL = "./BUKU_PENGURUSAN_2021.pdf";

// TOC dibina berdasarkan isi kandungan pada muka surat 1 (boleh edit ikut buku anda)
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
  tabHasil: document.getElementById("tab-hasil"),
  tabPantas: document.getElementById("tab-pantas"),
  results: document.getElementById("results"),
  quickLinks: document.getElementById("quickLinks"),
  idxStatus: document.getElementById("idxStatus"),
  pbar: document.getElementById("pbar"),
  pmsg: document.getElementById("pmsg"),
  btnBuildIndex: document.getElementById("btnBuildIndex"),
  btnClearIndex: document.getElementById("btnClearIndex"),
  q: document.getElementById("q"),
  btnSearch: document.getElementById("btnSearch"),
  btnOpen: document.getElementById("btnOpen"),
  filePicker: document.getElementById("filePicker"),
  btnHelp: document.getElementById("btnHelp"),
  helpBox: document.getElementById("helpBox"),

  canvas: document.getElementById("pdfCanvas"),
  pageNum: document.getElementById("pageNum"),
  pageCount: document.getElementById("pageCount"),
  prev: document.getElementById("prev"),
  next: document.getElementById("next"),
  zoom: document.getElementById("zoom"),
  zoomLabel: document.getElementById("zoomLabel"),
  zoomIn: document.getElementById("zoomIn"),
  zoomOut: document.getElementById("zoomOut"),
  fitWidth: document.getElementById("fitWidth"),
  openNative: document.getElementById("openNative"),

  pageTextBox: document.getElementById("pageText"),
  textPageNo: document.getElementById("textPageNo"),
  textContent: document.getElementById("textContent"),

  pdfName: document.getElementById("pdfName"),
  pdfInfo: document.getElementById("pdfInfo"),
};

const ctx = els.canvas.getContext("2d");

let pdfDoc = null;
let currentPage = 1;
let scale = 1.1;
let currentTocFilter = null; // {start,end,title}
let currentPdfUrl = DEFAULT_PDF_URL;
let currentPdfBytes = null; // Uint8Array, if opened via file
let currentFingerprint = null;

const IDX_PREFIX = "buku_pengurusan_index_v1:";

function setTab(name){
  els.tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  document.getElementById("tab-toc").classList.toggle("hidden", name !== "toc");
  document.getElementById("tab-hasil").classList.toggle("hidden", name !== "hasil");
  document.getElementById("tab-pantas").classList.toggle("hidden", name !== "pantas");
}

els.tabs.forEach(t => t.addEventListener("click", () => setTab(t.dataset.tab)));

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function formatRange(item){
  return item.start === item.end ? `m/s ${item.start}` : `m/s ${item.start}–${item.end}`;
}

function buildTocUI(){
  els.tabToc.innerHTML = "";
  TOC.forEach((g, gi) => {
    const wrap = document.createElement("div");
    wrap.className = "section";
    const btn = document.createElement("button");
    btn.innerHTML = `<span>${g.group}</span><span class="muted">${g.items.length} item</span>`;
    const body = document.createElement("div");
    body.className = "sectionBody";

    g.items.forEach((it, ii) => {
      const row = document.createElement("div");
      row.className = "tocItem";
      row.dataset.start = it.start;
      row.dataset.end = it.end;
      row.innerHTML = `
        <div>
          <div class="name">${it.title}</div>
          <div class="meta">${formatRange(it)}</div>
        </div>
        <div class="badge">${it.start === it.end ? it.start : (it.start+"–"+it.end)}</div>
      `;
      row.addEventListener("click", () => {
        // set filter for search + jump to page
        currentTocFilter = { start: it.start, end: it.end, title: it.title };
        highlightActiveToc(row);
        gotoPage(it.start, { showText: true });
      });
      body.appendChild(row);
    });

    let open = (gi === 1); // default: open Pengurusan Sekolah
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

function highlightActiveToc(selectedEl){
  document.querySelectorAll(".tocItem").forEach(x => x.classList.remove("active"));
  selectedEl.classList.add("active");
}

function buildQuickLinks(){
  els.quickLinks.innerHTML = "";
  QUICK.forEach(q => {
    const b = document.createElement("button");
    b.className = "btn small";
    b.textContent = q.label;
    b.addEventListener("click", () => {
      currentTocFilter = null;
      document.querySelectorAll(".tocItem").forEach(x => x.classList.remove("active"));
      gotoPage(q.page, { showText: true });
      setTab("toc");
    });
    els.quickLinks.appendChild(b);
  });
}

function setIndexStatus(text, kind="neutral"){
  els.idxStatus.textContent = text;
  els.idxStatus.style.borderColor = kind === "ok" ? "rgba(67,209,158,.35)" :
                                   kind === "warn" ? "rgba(255,198,78,.35)" :
                                   kind === "bad" ? "rgba(255,90,106,.35)" :
                                   "rgba(255,255,255,.12)";
  els.idxStatus.style.background = kind === "ok" ? "rgba(67,209,158,.12)" :
                                kind === "warn" ? "rgba(255,198,78,.12)" :
                                kind === "bad" ? "rgba(255,90,106,.12)" :
                                "rgba(15,26,51,.55)";
  els.idxStatus.style.color = kind === "neutral" ? "var(--muted)" : "var(--text)";
}

async function loadPdf({url, bytes}){
  setIndexStatus("Memuat PDF…", "warn");

  const loadingTask = bytes ? pdfjsLib.getDocument({data: bytes}) : pdfjsLib.getDocument(url);
  pdfDoc = await loadingTask.promise;
  currentFingerprint = pdfDoc.fingerprints?.[0] || ("pages_" + pdfDoc.numPages);
  els.pageCount.textContent = String(pdfDoc.numPages);
  els.pageNum.value = String(currentPage);
  els.pdfName.textContent = bytes ? "Fail dipilih" : url.replace("./", "");
  els.pdfInfo.textContent = `Jumlah muka surat: ${pdfDoc.numPages}. Fingerprint: ${currentFingerprint}`;

  setIndexStatus("PDF siap", "ok");
  await renderPage(currentPage, {showText: true});
  await refreshIndexStatus();
}

async function renderPage(num, {showText=false} = {}){
  if(!pdfDoc) return;
  currentPage = clamp(num, 1, pdfDoc.numPages);
  els.pageNum.value = String(currentPage);

  const page = await pdfDoc.getPage(currentPage);

  // Fit to container width
  const container = els.canvas.parentElement;
  const viewportAtScale1 = page.getViewport({scale: 1});
  const targetWidth = Math.min(container.clientWidth - 20, 1100); // padding
  const fitScale = (targetWidth / viewportAtScale1.width) * scale;
  const viewport = page.getViewport({scale: fitScale});

  els.canvas.width = Math.floor(viewport.width);
  els.canvas.height = Math.floor(viewport.height);

  const renderContext = { canvasContext: ctx, viewport };
  await page.render(renderContext).promise;

  if(showText){
    await showPageText(currentPage);
  } else {
    els.pageTextBox.classList.add("hidden");
  }
}

async function gotoPage(num, {showText=false} = {}){
  await renderPage(num, {showText});
  // scroll viewer body to top
  document.querySelector(".viewerBody").scrollTop = 0;
}

function updateZoomUI(){
  const z = Number(els.zoom.value);
  els.zoomLabel.textContent = `${z}%`;
  scale = z / 100;
  if(pdfDoc) renderPage(currentPage, {showText: !els.pageTextBox.classList.contains("hidden")});
}

function setProgress(pct, msg){
  els.pbar.style.width = `${pct}%`;
  els.pmsg.textContent = msg;
}

function idxKey(){
  return IDX_PREFIX + currentFingerprint;
}

function getCachedIndex(){
  try{
    const raw = localStorage.getItem(idxKey());
    if(!raw) return null;
    const data = JSON.parse(raw);
    if(!data || !Array.isArray(data.pages)) return null;
    return data;
  }catch(_){
    return null;
  }
}

function setCachedIndex(pages){
  const payload = {
    v: 1,
    pages,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(idxKey(), JSON.stringify(payload));
}

async function buildTextIndex(){
  if(!pdfDoc) return;
  setTab("pantas");
  setIndexStatus("Bina indeks…", "warn");
  setProgress(0, "Mula bina indeks teks…");

  const pages = new Array(pdfDoc.numPages + 1); // 1-based
  for(let i=1;i<=pdfDoc.numPages;i++){
    const page = await pdfDoc.getPage(i);
    const tc = await page.getTextContent();
    const text = tc.items.map(it => it.str).join(" ");
    pages[i] = text.replace(/\s+/g, " ").trim();
    const pct = Math.round((i / pdfDoc.numPages) * 100);
    if(i % 2 === 0 || i === pdfDoc.numPages){
      setProgress(pct, `Bina indeks: muka ${i}/${pdfDoc.numPages}`);
      await new Promise(r => setTimeout(r, 0));
    }
  }

  setCachedIndex(pages);
  setProgress(100, "Siap. Indeks disimpan dalam browser (localStorage).");
  setIndexStatus("Indeks siap", "ok");
  await refreshIndexStatus();
}

async function refreshIndexStatus(){
  if(!pdfDoc) return;
  const idx = getCachedIndex();
  if(idx){
    setIndexStatus("Indeks ada", "ok");
    els.btnBuildIndex.textContent = "Bina Semula";
    els.pmsg.textContent = `Indeks ada (disimpan: ${new Date(idx.savedAt).toLocaleString()}).`;
    els.pbar.style.width = "100%";
  } else {
    setIndexStatus("Tiada indeks", "neutral");
    els.btnBuildIndex.textContent = "Bina Indeks Teks";
    els.pmsg.textContent = "Belum bina indeks (carian masih boleh, tetapi lebih perlahan).";
    els.pbar.style.width = "0%";
  }
}

function clearIndex(){
  if(!currentFingerprint) return;
  localStorage.removeItem(idxKey());
  setProgress(0, "Indeks direset.");
  refreshIndexStatus();
}

function escapeHtml(s){
  return (s || "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function makeSnippet(text, q, maxLen=160){
  const t = text || "";
  const i = t.toLowerCase().indexOf(q.toLowerCase());
  if(i === -1) return t.slice(0, maxLen) + (t.length>maxLen ? "…" : "");
  const start = Math.max(0, i - Math.floor(maxLen/3));
  const end = Math.min(t.length, i + maxLen);
  let snip = t.slice(start, end);
  if(start>0) snip = "…" + snip;
  if(end<t.length) snip = snip + "…";
  return snip;
}

async function slowSearch(q, range){
  // no cached index: search by extracting text per page on demand
  const start = range?.start || 1;
  const end = range?.end || pdfDoc.numPages;
  const hits = [];
  for(let i=start;i<=end;i++){
    const page = await pdfDoc.getPage(i);
    const tc = await page.getTextContent();
    const text = tc.items.map(it => it.str).join(" ").replace(/\s+/g," ").trim();
    if(text.toLowerCase().includes(q.toLowerCase())){
      hits.push({page: i, text});
    }
    if(i % 3 === 0){
      setProgress(Math.round(((i-start+1)/(end-start+1))*100), `Cari: muka ${i}/${end}`);
      await new Promise(r => setTimeout(r, 0));
    }
  }
  return hits;
}

function fastSearch(q, range, idx){
  const start = range?.start || 1;
  const end = range?.end || (idx.pages.length - 1);
  const hits = [];
  for(let i=start;i<=end;i++){
    const t = idx.pages[i] || "";
    if(t.toLowerCase().includes(q.toLowerCase())){
      hits.push({page: i, text: t});
    }
  }
  return hits;
}

async function runSearch(){
  if(!pdfDoc) return;
  const q = (els.q.value || "").trim();
  if(!q) return;

  setTab("hasil");
  els.results.innerHTML = "";
  setProgress(0, "Mula carian…");

  const range = currentTocFilter;
  const rangeLabel = range ? `${range.title} (${range.start}–${range.end})` : "Seluruh buku";
  const idx = getCachedIndex();
  let hits = [];

  if(idx){
    hits = fastSearch(q, range, idx);
    setProgress(100, `Siap. ${hits.length} hasil dalam ${rangeLabel}.`);
  } else {
    hits = await slowSearch(q, range);
    setProgress(100, `Siap. ${hits.length} hasil dalam ${rangeLabel}.`);
  }

  if(hits.length === 0){
    els.results.innerHTML = `
      <div class="card">
        <div class="h"><div class="t">Tiada hasil</div><span class="badge">${escapeHtml(rangeLabel)}</span></div>
        <div class="s">Cuba kata kunci lain. Tip: bina Indeks Teks untuk carian lebih laju.</div>
      </div>`;
    return;
  }

  hits.slice(0, 120).forEach(h => {
    const card = document.createElement("div");
    card.className = "card";
    const snippet = escapeHtml(makeSnippet(h.text, q));
    card.innerHTML = `
      <div class="h">
        <div class="t">Muka ${h.page}</div>
        <span class="badge">${escapeHtml(rangeLabel)}</span>
      </div>
      <div class="s">${snippet}</div>
      <div class="miniRow">
        <button class="btn small primary" data-open="${h.page}">Buka muka surat</button>
        <button class="btn small" data-text="${h.page}">Lihat teks</button>
      </div>
    `;
    card.querySelector('[data-open]').addEventListener("click", async () => {
      await gotoPage(h.page, {showText:false});
    });
    card.querySelector('[data-text]').addEventListener("click", async () => {
      await gotoPage(h.page, {showText:true});
    });
    els.results.appendChild(card);
  });

  // auto jump to first result
  await gotoPage(hits[0].page, {showText:true});
}

async function showPageText(pageNo){
  const idx = getCachedIndex();
  let text = "";
  if(idx && idx.pages[pageNo]) {
    text = idx.pages[pageNo];
  } else {
    // extract on demand
    const page = await pdfDoc.getPage(pageNo);
    const tc = await page.getTextContent();
    text = tc.items.map(it => it.str).join(" ").replace(/\s+/g," ").trim();
  }
  els.textPageNo.textContent = `Muka ${pageNo}`;
  els.textContent.textContent = text;
  els.pageTextBox.classList.remove("hidden");
}

function toggleHelp(){
  els.helpBox.classList.toggle("hidden");
}

function openPdfNative(){
  // Works only if file served by URL
  if(currentPdfBytes){
    const blob = new Blob([currentPdfBytes], {type:"application/pdf"});
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    window.open(currentPdfUrl, "_blank", "noopener,noreferrer");
  }
}

function handleKeys(e){
  const k = e.key.toLowerCase();
  if(k === "escape"){
    els.helpBox.classList.add("hidden");
    return;
  }
  if(document.activeElement === els.q || document.activeElement === els.pageNum) return;

  if(k === "arrowleft") gotoPage(currentPage - 1, {showText:false});
  if(k === "arrowright") gotoPage(currentPage + 1, {showText:false});
  if(k === "+"){ els.zoom.value = String(clamp(Number(els.zoom.value)+5, 60, 180)); updateZoomUI(); }
  if(k === "-"){ els.zoom.value = String(clamp(Number(els.zoom.value)-5, 60, 180)); updateZoomUI(); }
  if(k === "f"){ // fit width preset
    els.zoom.value = "110";
    updateZoomUI();
  }
}

function wireUI(){
  els.prev.addEventListener("click", () => gotoPage(currentPage - 1, {showText:false}));
  els.next.addEventListener("click", () => gotoPage(currentPage + 1, {showText:false}));

  els.pageNum.addEventListener("change", () => {
    const v = Number(els.pageNum.value);
    if(Number.isFinite(v)) gotoPage(v, {showText:false});
  });

  els.zoom.addEventListener("input", updateZoomUI);
  els.zoomIn.addEventListener("click", () => {
    els.zoom.value = String(clamp(Number(els.zoom.value)+10, 60, 180));
    updateZoomUI();
  });
  els.zoomOut.addEventListener("click", () => {
    els.zoom.value = String(clamp(Number(els.zoom.value)-10, 60, 180));
    updateZoomUI();
  });
  els.fitWidth.addEventListener("click", () => {
    els.zoom.value = "110";
    updateZoomUI();
  });

  els.btnSearch.addEventListener("click", runSearch);
  els.q.addEventListener("keydown", (e) => {
    if(e.key === "Enter") runSearch();
  });

  els.btnBuildIndex.addEventListener("click", buildTextIndex);
  els.btnClearIndex.addEventListener("click", clearIndex);

  els.btnOpen.addEventListener("click", () => els.filePicker.click());
  els.filePicker.addEventListener("change", async () => {
    const f = els.filePicker.files?.[0];
    if(!f) return;
    currentPdfBytes = new Uint8Array(await f.arrayBuffer());
    currentPdfUrl = "(file)";
    currentPage = 1;
    await loadPdf({bytes: currentPdfBytes});
  });

  els.btnHelp.addEventListener("click", toggleHelp);
  els.openNative.addEventListener("click", openPdfNative);

  window.addEventListener("keydown", handleKeys);
}

async function init(){
  buildTocUI();
  buildQuickLinks();
  wireUI();
  setTab("toc");

  // Try load default PDF. If missing, still allow open.
  try{
    currentPdfUrl = DEFAULT_PDF_URL;
    await loadPdf({url: DEFAULT_PDF_URL});
  }catch(err){
    console.error(err);
    setIndexStatus("PDF tak jumpa", "bad");
    els.pdfName.textContent = "Tidak ditemui";
    els.pdfInfo.textContent = "Pastikan fail PDF ada di folder sama dengan index.html (nama: BUKU_PENGURUSAN_2021.pdf), atau klik 'Buka PDF'.";
  }
}

init();
