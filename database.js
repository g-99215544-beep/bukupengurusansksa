const PDF_URL = "./BUKU_PENGURUSAN_2021.pdf";

/**
 * MANUAL OVERRIDE (OPTIONAL)
 * Kalau ada nama/tugas yang tak kena, tambah di sini.
 * Format:
 * { name: "Pn. Nama", roles: [{ label:"Penyelaras HEM", pages:[84] }, ...] }
 */
const TEACHERS_MANUAL = [
  // contoh:
  // { name: "Cikgu Abu", roles: [{ label:"Penyelaras HEM", pages:[84] }, { label:"AJK APDM", pages:[35] }] },
];

/** Kata kunci peranan untuk dikesan dekat nama guru */
const ROLE_KEYWORDS = [
  "Guru Kelas", "Penyelaras", "Setiausaha", "Bendahari", "AJK", "Ahli Jawatankuasa",
  "Pengerusi", "Timbalan", "Naib", "Ketua Panitia", "Panitia", "GPK", "Penolong Kanan",
  "APDM", "SSDM", "HEM", "Kurikulum", "Kokurikulum", "PPKi", "Pendidikan Khas", "Prasekolah",
  "Data", "ICT", "Disiplin", "Kebajikan", "SPBT", "RMT", "PBS", "PBD"
];

// Tab data (TOC) kekal
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

  tabs: Array.from(document.querySelectorAll(".tab")),
  status: document.getElementById("status"),
  tabToc: document.getElementById("tab-toc"),
  quickLinks: document.getElementById("quickLinks"),

  // Guru
  teacherIndexStatus: document.getElementById("teacherIndexStatus"),
  btnReindex: document.getElementById("btnReindex"),
  teacherSearch: document.getElementById("teacherSearch"),
  teacherResults: document.getElementById("teacherResults"),
  teacherName: document.getElementById("teacherName"),
  teacherHint: document.getElementById("teacherHint"),
  teacherChips: document.getElementById("teacherChips"),

  // PDF viewer
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
  toolPanel: document.getElementById("toolPanel"),
  btnTools: document.getElementById("btnTools"),
};

let pdfDoc = null;
let currentPage = 1;
let zoomPct = 110;
let renderTask = null;

// Teacher index runtime
let TEACHER_INDEX = null; // { teachers: [{name, roles:[{label,pages[]}], pages:[...] }], builtAt, from }
let teacherSelected = null;

function isMobile(){ return window.matchMedia && window.matchMedia("(max-width: 1100px)").matches; }
function toggleDrawer(){ document.body.classList.toggle("drawer-open"); }
function closeDrawer(){ document.body.classList.remove("drawer-open"); }
function setStatus(txt){ if (els.status) els.status.textContent = txt; }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function norm(s){ return (s||"").toLowerCase().replace(/\s+/g," ").trim(); }

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function setTab(name){
  els.tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  document.getElementById("tab-toc").classList.toggle("hidden", name !== "toc");
  document.getElementById("tab-pantas").classList.toggle("hidden", name !== "pantas");
  document.getElementById("tab-guru").classList.toggle("hidden", name !== "guru");
}
els.tabs.forEach(t => t.addEventListener("click", () => setTab(t.dataset.tab)));

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
    const wrapW = els.canvasWrap.clientWidth - 24;
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
    btn.innerHTML = `<span>${escapeHtml(g.group)}</span><span class="muted">${g.items.length} item</span>`;

    const body = document.createElement("div");
    body.className = "sectionBody";

    g.items.forEach(it => {
      const row = document.createElement("div");
      row.className = "tocItem";
      row.innerHTML = `
        <div>
          <div class="name">${escapeHtml(it.title)}</div>
          <div class="meta">m/s ${it.start}${it.start===it.end ? "" : ("–"+it.end)}</div>
        </div>
        <div class="badge">${it.start===it.end ? it.start : (it.start+"–"+it.end)}</div>
      `;
      row.addEventListener("click", () => {
        document.querySelectorAll(".tocItem").forEach(x => x.classList.remove("active"));
        row.classList.add("active");
        gotoPage(it.start);
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
        <div class="name">${escapeHtml(q.label)}</div>
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

/* ============================
   Teacher index from PDF text
   ============================ */

const NAME_REGEX = new RegExp(
  "\\b(?:(?:Pn\\.|Puan|En\\.|Encik|Cikgu|Cg\\.|Ckg\\.|Ustazah|Ustaz|Tn\\.?\\s*Hj\\.?|Tn\\.?\\s*Hjh\\.?|Hj\\.|Hjh\\.)\\s+)" +
  "(?:[A-Za-zÀ-ÿ'’\\-\\.]+\\s+){0,10}[A-Za-zÀ-ÿ'’\\-\\.]+",
  "gi"
);

function extractLinesFromTextContent(textContent){
  // group items into lines by y coordinate
  const items = (textContent && textContent.items) ? textContent.items : [];
  const groups = new Map(); // yKey -> [{x,str}]
  for (const it of items){
    const str = (it.str || "").trim();
    if (!str) continue;
    const tr = it.transform || [];
    const x = tr[4] ?? 0;
    const y = tr[5] ?? 0;
    const yKey = Math.round(y / 3) * 3; // bucket
    if (!groups.has(yKey)) groups.set(yKey, []);
    groups.get(yKey).push({ x, str });
  }
  const ys = Array.from(groups.keys()).sort((a,b)=> b-a);
  const lines = [];
  for (const y of ys){
    const row = groups.get(y).sort((a,b)=> a.x - b.x);
    // remove duplicates/overlaps minimally:
    const parts = [];
    for (const r of row){
      if (!parts.length) { parts.push(r.str); continue; }
      const last = parts[parts.length-1];
      // Avoid accidental duplicate tokens
      if (last === r.str) continue;
      parts.push(r.str);
    }
    const line = parts.join(" ").replace(/\s+/g," ").trim();
    if (line) lines.push(line);
  }
  return lines;
}

function cleanName(s){
  return s
    .replace(/\s+/g," ")
    .replace(/[,:;)\]]+$/,"")
    .trim();
}

function roleFromLine(line, name){
  const L = line;
  const idx = L.toLowerCase().indexOf(name.toLowerCase());
  const before = idx >= 0 ? L.slice(0, idx) : L;
  const after = idx >= 0 ? L.slice(idx + name.length) : "";

  // If there is ":" before name, take left side as role
  const colonIdx = before.lastIndexOf(":");
  if (colonIdx >= 0){
    const left = before.slice(0, colonIdx).trim();
    const candidate = left.replace(/\s+/g," ").trim();
    if (candidate && candidate.length <= 55) return candidate;
  }

  // Else try capture around role keywords in same line
  const keys = ROLE_KEYWORDS;
  for (const k of keys){
    const re = new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"), "i");
    if (re.test(L)){
      // Try to extract a short phrase around the keyword
      const m = L.match(new RegExp(`(${k.replace(/[.*+?^${}()|[\]\\]/g,"\\\\$&")}(?:\\s+[A-Za-z0-9/()&\\-\\.]+){0,5})`, "i"));
      if (m && m[1]){
        const phrase = m[1].replace(/\s+/g," ").trim();
        if (phrase.length <= 60) return phrase;
      }
      return k; // fallback to keyword itself
    }
  }

  return null;
}

function looksLikeRoleHeader(line){
  // A header line that likely introduces a role, without a name
  const L = line.trim();
  const headerKeys = ["Pengerusi", "Timbalan", "Naib", "Setiausaha", "Bendahari", "Penyelaras", "Ketua", "Guru Kelas", "AJK", "Ahli Jawatankuasa"];
  for (const hk of headerKeys){
    const re = new RegExp(`^\\s*${hk}\\b`, "i");
    if (re.test(L)){
      // often ends with ":" or "-" or just the label
      const out = L.replace(/\s+/g," ").replace(/[–-]\s*$/,"").trim();
      if (out.length <= 60) return out;
    }
  }
  return null;
}

function addRole(mapRoles, label, page){
  if (!label) return;
  const key = label.replace(/\s+/g," ").trim();
  if (!key) return;
  if (!mapRoles.has(key)) mapRoles.set(key, new Set());
  mapRoles.get(key).add(page);
}

function addTeacher(map, name, page){
  const key = cleanName(name);
  if (!key) return null;
  if (!map.has(key)){
    map.set(key, { pages: new Set(), roles: new Map() });
  }
  const obj = map.get(key);
  obj.pages.add(page);
  return obj;
}

async function buildTeacherIndexFromPdf(){
  if (!pdfDoc) return;

  const teacherMap = new Map();
  let totalNamesFound = 0;
  let anyText = false;

  const n = pdfDoc.numPages;
  for (let p=1; p<=n; p++){
    els.teacherIndexStatus.textContent = `Index: ${p}/${n}`;
    try{
      const page = await pdfDoc.getPage(p);
      const textContent = await page.getTextContent({ disableCombineTextItems: false });
      const lines = extractLinesFromTextContent(textContent);
      const pageText = lines.join("\n");
      if (pageText.trim().length > 30) anyText = true;

      let currentRoleContext = null;

      for (const line of lines){
        // update role context if header-like
        const header = looksLikeRoleHeader(line);
        if (header && !NAME_REGEX.test(line)){ // avoid if it includes name, but regex has state
          currentRoleContext = header.replace(/[:\s]+$/,"").trim();
        }
        NAME_REGEX.lastIndex = 0; // reset regex state

        const matches = line.match(NAME_REGEX) || [];
        if (!matches.length) continue;

        for (const raw of matches){
          const name = cleanName(raw);
          const t = addTeacher(teacherMap, name, p);
          if (!t) continue;

          totalNamesFound++;

          // role from same line
          const rl = roleFromLine(line, name);
          if (rl) addRole(t.roles, rl, p);

          // role context from previous header line
          if (currentRoleContext) addRole(t.roles, currentRoleContext, p);
        }
      }
    }catch(e){
      console.warn("Index page fail", p, e);
    }

    // yield to keep UI responsive
    await new Promise(r => setTimeout(r, 0));
  }

  // If PDF scanned (no text), fallback to manual
  if (!anyText){
    TEACHER_INDEX = { teachers: [], builtAt: Date.now(), from: "no_text" };
    els.teacherIndexStatus.textContent = "Index: gagal (PDF tiada teks)";
    renderTeacherResults([]);
    renderTeacherDetail(null);
    return;
  }

  // Merge manual overrides (manual wins)
  const merged = mergeManualOverrides(teacherMap, TEACHERS_MANUAL);

  // Finalize list
  const teachers = Array.from(merged.entries()).map(([name, obj]) => {
    const pages = Array.from(obj.pages).sort((a,b)=>a-b);
    const roles = Array.from(obj.roles.entries()).map(([label, set]) => ({
      label,
      pages: Array.from(set).sort((a,b)=>a-b)
    })).sort((a,b)=> a.label.localeCompare(b.label, "ms"));
    return { name, pages, roles };
  }).sort((a,b)=> a.name.localeCompare(b.name, "ms"));

  TEACHER_INDEX = { teachers, builtAt: Date.now(), from: "pdf_text" };
  els.teacherIndexStatus.textContent = `Index: siap (${teachers.length} nama)`;
  renderTeacherResults(teachers);

  // Keep selection if exists
  if (teacherSelected){
    const still = teachers.find(t => norm(t.name) === norm(teacherSelected.name));
    if (still) renderTeacherDetail(still);
  }
}

function mergeManualOverrides(autoMap, manual){
  const m = new Map(autoMap);

  // build manual map by normalized name
  const manualByNorm = new Map();
  for (const t of (manual || [])){
    if (!t || !t.name) continue;
    manualByNorm.set(norm(t.name), t);
  }

  // apply manual: overwrite roles/pages for matched name, or add new
  for (const [nkey, t] of manualByNorm.entries()){
    // find existing key (case-insensitive) in m
    let existingKey = null;
    for (const k of m.keys()){
      if (norm(k) === nkey){ existingKey = k; break; }
    }
    const targetKey = existingKey || cleanName(t.name);

    const pagesSet = new Set();
    const rolesMap = new Map();

    // start with auto if exists
    if (existingKey){
      const obj = m.get(existingKey);
      for (const p of obj.pages) pagesSet.add(p);
      for (const [label, set] of obj.roles.entries()){
        rolesMap.set(label, new Set(set));
      }
    }

    // apply manual roles/pages
    if (Array.isArray(t.roles)){
      for (const r of t.roles){
        if (!r || !r.label) continue;
        const ps = Array.isArray(r.pages) ? r.pages : [];
        for (const p of ps){
          if (Number.isFinite(Number(p))) pagesSet.add(Number(p));
        }
        if (!rolesMap.has(r.label)) rolesMap.set(r.label, new Set());
        for (const p of ps){
          if (Number.isFinite(Number(p))) rolesMap.get(r.label).add(Number(p));
        }
      }
    }

    m.set(targetKey, { pages: pagesSet, roles: rolesMap });

    if (existingKey && existingKey !== targetKey){
      m.delete(existingKey);
    }
  }

  return m;
}

/* ============= UI for Guru tab ============= */

function renderTeacherResults(list){
  els.teacherResults.innerHTML = "";
  const items = Array.isArray(list) ? list : [];
  if (!items.length){
    const empty = document.createElement("div");
    empty.className = "teacherHint";
    empty.textContent = "Tiada data guru lagi. Tekan Imbas.";
    els.teacherResults.appendChild(empty);
    return;
  }
  items.slice(0, 80).forEach(t => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "teacherBtn";
    const rolePreview = (t.roles || []).slice(0, 3).map(r => r.label).join(", ");
    btn.innerHTML = `${escapeHtml(t.name)}<small>${escapeHtml(rolePreview)}${(t.roles||[]).length>3 ? "…" : ""}</small>`;
    btn.addEventListener("click", () => {
      renderTeacherDetail(t);
      if (isMobile()) closeDrawer();
    });
    els.teacherResults.appendChild(btn);
  });
}

function renderTeacherDetail(t){
  teacherSelected = t || null;
  els.teacherName.textContent = t ? t.name : "Pilih nama guru";
  if (!t){
    els.teacherHint.textContent = "Klik tugas untuk lompat ke muka surat berkaitan.";
    els.teacherChips.innerHTML = "";
    return;
  }

  const roles = (t.roles || []);
  els.teacherHint.textContent = roles.length ? `Jumlah tugas: ${roles.length}` : "Tiada tugas dikesan (boleh tambah manual override).";

  els.teacherChips.innerHTML = roles.map(r => {
    const pages = (r.pages || []);
    const pagesLabel = pages.length ? `m/s ${pages.slice(0,6).join(", ")}${pages.length>6 ? "…" : ""}` : "";
    const title = pages.length ? `Muka surat: ${pages.join(", ")}` : "Tiada muka surat";
    return `<span class="chip" data-role="${escapeHtml(r.label)}" data-pages="${pages.join(",")}" title="${escapeHtml(title)}">${escapeHtml(r.label)}${pagesLabel ? " · "+escapeHtml(pagesLabel) : ""}</span>`;
  }).join("");

  // click handlers: jump to first page for that role
  els.teacherChips.querySelectorAll(".chip").forEach(ch => {
    ch.addEventListener("click", () => {
      const pages = (ch.getAttribute("data-pages") || "").split(",").map(x=>Number(x)).filter(Boolean);
      if (!pages.length) return;
      const page = Math.min(...pages);
      gotoPage(page);
      if (isMobile()) closeDrawer();
    });
  });
}

function initTeacherUI(){
  els.teacherSearch.addEventListener("input", () => {
    const q = norm(els.teacherSearch.value);
    const list = (TEACHER_INDEX && TEACHER_INDEX.teachers) ? TEACHER_INDEX.teachers : [];
    if (!q){
      renderTeacherResults(list);
      return;
    }
    const filtered = list.filter(t => norm(t.name).includes(q));
    renderTeacherResults(filtered);
  });

  els.btnReindex.addEventListener("click", () => {
    if (!pdfDoc) return;
    els.teacherIndexStatus.textContent = "Index: mula…";
    buildTeacherIndexFromPdf();
  });

  // initial
  renderTeacherResults([]);
  renderTeacherDetail(null);
  els.teacherIndexStatus.textContent = "Index: menunggu PDF…";
}

/* =========================================== */

async function loadPdf(){
  setStatus("Loading…");
  buildTocUI();
  buildQuickLinks();
  initTeacherUI();
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

  if (isMobile()) setTimeout(() => fitToWidth(), 200);

  // Auto-index in background (doesn't disturb PDF)
  els.teacherIndexStatus.textContent = "Index: mula…";
  setTimeout(() => buildTeacherIndexFromPdf(), 250);
}

function wireUI(){
  const setDrawerTop = () => {
    const header = document.querySelector("header");
    if (!header || !els.drawer) return;
    const h = Math.ceil(header.getBoundingClientRect().height);
    els.drawer.style.top = `${h}px`;
  };

  setDrawerTop();
  window.addEventListener("resize", () => {
    setDrawerTop();
    renderPage(currentPage);
    if (isMobile()) setTimeout(() => fitToWidth(), 180);
  });

  els.btnToc.addEventListener("click", toggleDrawer);
  els.backdrop.addEventListener("click", closeDrawer);

  if (els.btnTools){
    els.btnTools.addEventListener("click", () => {
      els.toolPanel.classList.toggle("open");
    });
  }

  els.prev.addEventListener("click", () => gotoPage(currentPage - 1));
  els.next.addEventListener("click", () => gotoPage(currentPage + 1));
  els.pageNum.addEventListener("change", () => gotoPage(els.pageNum.value));

  els.zoom.addEventListener("input", () => updateZoom(els.zoom.value));
  els.zoomIn.addEventListener("click", () => updateZoom(zoomPct + 10));
  els.zoomOut.addEventListener("click", () => updateZoom(zoomPct - 10));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
    if (e.key === "ArrowLeft") gotoPage(currentPage - 1);
    if (e.key === "ArrowRight") gotoPage(currentPage + 1);
  });
}

wireUI();

window.initPdfApp = function initPdfApp(){
  loadPdf().catch(err => {
    console.error(err);
    setStatus("Gagal");
    alert("Gagal load PDF. Semak nama fail PDF & pastikan ia ada di root repo.");
  });
};
