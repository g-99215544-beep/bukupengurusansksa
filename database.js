const PDF_URL = "./BUKU_PENGURUSAN_2021.pdf";

/**
 * MANUAL OVERRIDE (OPTIONAL)
 * Format:
 * { name: "Pn. Nama", roles: [{ label:"Penyelaras HEM", pages:[84,85] }, ...] }
 */
const TEACHERS_MANUAL = [
  // { name: "Cikgu Abu", roles: [{ label:"Penyelaras HEM", pages:[84] }, { label:"AJK APDM", pages:[35] }] },
];

/** Kata kunci peranan untuk bantu extract dari baris */
const ROLE_KEYWORDS = [
  "Guru Kelas", "Penyelaras", "Setiausaha", "Bendahari", "AJK", "Ahli Jawatankuasa",
  "Pengerusi", "Timbalan", "Naib", "Ketua Panitia", "Panitia", "GPK", "Penolong Kanan",
  "APDM", "SSDM", "HEM", "Kurikulum", "Kokurikulum", "PPKi", "Pendidikan Khas", "Prasekolah",
  "Data", "ICT", "Disiplin", "Kebajikan", "SPBT", "RMT", "PBS", "PBD"
];

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
  teacherSelect: document.getElementById("teacherSelect"),
  teacherName: document.getElementById("teacherName"),
  teacherHint: document.getElementById("teacherHint"),
  teacherChips: document.getElementById("teacherChips"),

  // Viewer
  pagesWrap: document.getElementById("pagesWrap"),
  pages: document.getElementById("pages"),
  pageNow: document.getElementById("pageNow"),
  pageTotal: document.getElementById("pageTotal"),
  zoom: document.getElementById("zoom"),
  zoomLabel: document.getElementById("zoomLabel"),
  btnTools: document.getElementById("btnTools"),
  tools: document.getElementById("tools"),
  btnFit: document.getElementById("btnFit"),
};

let pdfDoc = null;
let fitMode = true;
let zoomPct = 110;

let pageState = new Map(); // pageNum -> { renderedScaleKey, canvas, rendering }
let currentVisiblePage = 1;
let intersectionObserver = null;
let visibleObserver = null;

let TEACHER_INDEX = null;
let teacherSelected = null;

function isMobile(){ return window.matchMedia && window.matchMedia("(max-width: 900px)").matches; }
function toggleDrawer(){ document.body.classList.toggle("drawer-open"); }
function closeDrawer(){ document.body.classList.remove("drawer-open"); }
function setStatus(txt){ if (els.status) els.status.textContent = txt; }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function norm(s){ return (s||"").toLowerCase().replace(/\s+/g," ").trim(); }
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function setDrawerTop(){
  const header = document.querySelector("header");
  if (!header || !els.drawer) return;
  const h = Math.ceil(header.getBoundingClientRect().height);
  els.drawer.style.top = `${h}px`;
}

function setTab(name){
  els.tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  document.getElementById("tab-toc").classList.toggle("hidden", name !== "toc");
  document.getElementById("tab-pantas").classList.toggle("hidden", name !== "pantas");
  document.getElementById("tab-guru").classList.toggle("hidden", name !== "guru");
}
els.tabs.forEach(t => t.addEventListener("click", () => setTab(t.dataset.tab)));

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
        closeDrawer();
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
      closeDrawer();
    });
    els.quickLinks.appendChild(row);
  });
}

/* ====== Scroll pages viewer ====== */
function createPagePlaceholders(numPages){
  els.pages.innerHTML = "";
  pageState.clear();

  for (let p=1; p<=numPages; p++){
    const box = document.createElement("div");
    box.className = "pageBox";
    box.id = `p${p}`;

    const inner = document.createElement("div");
    inner.className = "pageInner";
    inner.dataset.page = String(p);

    const ph = document.createElement("div");
    ph.className = "pagePlaceholder";
    ph.setAttribute("aria-label", `Muka ${p} (loading)`);

    inner.appendChild(ph);
    box.appendChild(inner);
    els.pages.appendChild(box);

    pageState.set(p, { renderedScaleKey: null, canvas: null, rendering: false });
  }
}

function updatePageBadge(){
  els.pageNow.textContent = `Muka ${currentVisiblePage}`;
  if (pdfDoc) els.pageTotal.textContent = `/ ${pdfDoc.numPages}`;
}

function getFitZoomPctForPage(page, containerWidth){
  const viewport1 = page.getViewport({ scale: 1 });
  const wrapW = Math.max(320, containerWidth - 28); // padding inside
  const scale = wrapW / viewport1.width;
  return clamp(Math.floor(scale * 100), 60, 200);
}

async function renderOnePage(pageNum){
  if (!pdfDoc) return;
  const st = pageState.get(pageNum);
  if (!st || st.rendering) return;

  const holder = document.querySelector(`.pageInner[data-page="${pageNum}"]`);
  if (!holder) return;

  st.rendering = true;

  try{
    const page = await pdfDoc.getPage(pageNum);

    let useZoom = zoomPct;
    if (fitMode){
      const contW = els.pagesWrap.clientWidth;
      useZoom = getFitZoomPctForPage(page, contW);
    }
    const scaleKey = `${useZoom}`;

    if (st.renderedScaleKey === scaleKey && st.canvas){
      st.rendering = false;
      return;
    }

    // Prepare canvas
    const viewport = page.getViewport({ scale: useZoom / 100 });
    const dpr = window.devicePixelRatio || 1;

    const canvas = st.canvas || document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    canvas.width = Math.floor(viewport.width * dpr);
    canvas.height = Math.floor(viewport.height * dpr);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // swap placeholder with canvas
    holder.innerHTML = "";
    holder.appendChild(canvas);

    const task = page.render({ canvasContext: ctx, viewport });
    await task.promise;

    st.canvas = canvas;
    st.renderedScaleKey = scaleKey;

  }catch(e){
    console.warn("render fail p", pageNum, e);
  }finally{
    st.rendering = false;
  }
}

function setupLazyRender(){
  if (intersectionObserver) intersectionObserver.disconnect();
  intersectionObserver = new IntersectionObserver((entries) => {
    for (const en of entries){
      if (en.isIntersecting){
        const pageNum = Number(en.target.dataset.page);
        renderOnePage(pageNum);
      }
    }
  }, { root: els.pagesWrap, rootMargin: "900px 0px", threshold: 0.01 });

  document.querySelectorAll(".pageInner").forEach(el => intersectionObserver.observe(el));
}

function setupVisiblePageTracker(){
  if (visibleObserver) visibleObserver.disconnect();
  visibleObserver = new IntersectionObserver((entries) => {
    // pick most visible page in viewport
    let best = null;
    for (const en of entries){
      if (!en.isIntersecting) continue;
      const ratio = en.intersectionRatio;
      if (!best || ratio > best.ratio){
        best = { ratio, page: Number(en.target.dataset.page) };
      }
    }
    if (best && best.page && best.page !== currentVisiblePage){
      currentVisiblePage = best.page;
      updatePageBadge();
    }
  }, { root: els.pagesWrap, threshold: [0.15, 0.35, 0.55, 0.75] });

  document.querySelectorAll(".pageInner").forEach(el => visibleObserver.observe(el));
}

function gotoPage(pageNum){
  const p = clamp(Number(pageNum) || 1, 1, pdfDoc ? pdfDoc.numPages : 9999);
  const node = document.getElementById(`p${p}`);
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "start" });
  // ensure render soon
  setTimeout(() => renderOnePage(p), 80);
}

function applyZoom(newZoom){
  fitMode = false;
  zoomPct = clamp(Number(newZoom) || 110, 60, 200);
  els.zoom.value = String(zoomPct);
  els.zoomLabel.textContent = `${zoomPct}%`;

  // re-render visible pages + nearby by clearing scale keys; keep canvases
  for (const [p, st] of pageState.entries()){
    st.renderedScaleKey = null;
  }
  // trigger render around current position
  setTimeout(() => {
    const around = [currentVisiblePage-1, currentVisiblePage, currentVisiblePage+1, currentVisiblePage+2];
    around.forEach(p => { if (p>=1 && pdfDoc && p<=pdfDoc.numPages) renderOnePage(p); });
  }, 50);
}

function setFitMode(){
  fitMode = true;
  els.zoomLabel.textContent = "Fit";
  for (const [p, st] of pageState.entries()){
    st.renderedScaleKey = null;
  }
  // rerender around visible pages
  setTimeout(() => {
    const around = [currentVisiblePage-1, currentVisiblePage, currentVisiblePage+1, currentVisiblePage+2];
    around.forEach(p => { if (p>=1 && pdfDoc && p<=pdfDoc.numPages) renderOnePage(p); });
  }, 50);
}

/* ====== Guru: dropdown name + clickable roles ====== */
const NAME_REGEX = new RegExp(
  "\\b(?:(?:Pn\\.|Puan|En\\.|Encik|Cikgu|Cg\\.|Ckg\\.|Ustazah|Ustaz|Tn\\.?\\s*Hj\\.?|Tn\\.?\\s*Hjh\\.?|Hj\\.|Hjh\\.)\\s+)" +
  "(?:[A-Za-zÀ-ÿ'’\\-\\.]+\\s+){0,10}[A-Za-zÀ-ÿ'’\\-\\.]+",
  "gi"
);

function extractLinesFromTextContent(textContent){
  const items = (textContent && textContent.items) ? textContent.items : [];
  const groups = new Map(); // yKey -> [{x,str}]
  for (const it of items){
    const str = (it.str || "").trim();
    if (!str) continue;
    const tr = it.transform || [];
    const x = tr[4] ?? 0;
    const y = tr[5] ?? 0;
    const yKey = Math.round(y / 3) * 3;
    if (!groups.has(yKey)) groups.set(yKey, []);
    groups.get(yKey).push({ x, str });
  }
  const ys = Array.from(groups.keys()).sort((a,b)=> b-a);
  const lines = [];
  for (const y of ys){
    const row = groups.get(y).sort((a,b)=> a.x - b.x);
    const parts = [];
    for (const r of row){
      if (!parts.length) { parts.push(r.str); continue; }
      if (parts[parts.length-1] === r.str) continue;
      parts.push(r.str);
    }
    const line = parts.join(" ").replace(/\s+/g," ").trim();
    if (line) lines.push(line);
  }
  return lines;
}

function cleanName(s){
  return s.replace(/\s+/g," ").replace(/[,:;)\]]+$/,"").trim();
}

function looksLikeRoleHeader(line){
  const L = line.trim();
  const headerKeys = ["Pengerusi", "Timbalan", "Naib", "Setiausaha", "Bendahari", "Penyelaras", "Ketua Panitia", "Ketua", "Guru Kelas", "AJK", "Ahli Jawatankuasa"];
  for (const hk of headerKeys){
    const re = new RegExp(`^\\s*${hk}\\b`, "i");
    if (re.test(L)){
      const out = L.replace(/\s+/g," ").replace(/[–-]\s*$/,"").trim();
      if (out.length <= 70) return out;
    }
  }
  return null;
}

function roleFromLine(line, name){
  const L = line;
  const idx = L.toLowerCase().indexOf(name.toLowerCase());
  const before = idx >= 0 ? L.slice(0, idx) : L;

  const colonIdx = before.lastIndexOf(":");
  if (colonIdx >= 0){
    const left = before.slice(0, colonIdx).trim();
    const candidate = left.replace(/\s+/g," ").trim();
    if (candidate && candidate.length <= 70) return candidate;
  }

  for (const k of ROLE_KEYWORDS){
    const re = new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"), "i");
    if (re.test(L)){
      const safe = k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
      const m = L.match(new RegExp(`(${safe}(?:\\s+[A-Za-z0-9/()&\\-\\.]+){0,5})`, "i"));
      if (m && m[1]){
        const phrase = m[1].replace(/\s+/g," ").trim();
        if (phrase.length <= 80) return phrase;
      }
      return k;
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

function mergeManualOverrides(autoMap, manual){
  const m = new Map(autoMap);
  const manualByNorm = new Map();
  for (const t of (manual || [])){
    if (!t || !t.name) continue;
    manualByNorm.set(norm(t.name), t);
  }

  for (const [nkey, t] of manualByNorm.entries()){
    let existingKey = null;
    for (const k of m.keys()){
      if (norm(k) === nkey){ existingKey = k; break; }
    }
    const targetKey = existingKey || cleanName(t.name);

    const pagesSet = new Set();
    const rolesMap = new Map();

    if (existingKey){
      const obj = m.get(existingKey);
      for (const p of obj.pages) pagesSet.add(p);
      for (const [label, set] of obj.roles.entries()){
        rolesMap.set(label, new Set(set));
      }
    }

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
    if (existingKey && existingKey !== targetKey) m.delete(existingKey);
  }
  return m;
}

async function buildTeacherIndexFromPdf(){
  if (!pdfDoc) return;

  const teacherMap = new Map();
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

      let roleContext = null;

      for (const line of lines){
        const header = looksLikeRoleHeader(line);
        if (header){
          // keep simple context
          roleContext = header.replace(/[:\s]+$/,"").trim();
        }

        NAME_REGEX.lastIndex = 0;
        const matches = line.match(NAME_REGEX) || [];
        if (!matches.length) continue;

        for (const raw of matches){
          const name = cleanName(raw);
          const t = addTeacher(teacherMap, name, p);
          if (!t) continue;

          const rl = roleFromLine(line, name);
          if (rl) addRole(t.roles, rl, p);
          if (roleContext) addRole(t.roles, roleContext, p);
        }
      }
    }catch(e){
      console.warn("Index page fail", p, e);
    }
    await new Promise(r => setTimeout(r, 0));
  }

  if (!anyText){
    TEACHER_INDEX = { teachers: [], builtAt: Date.now(), from: "no_text" };
    els.teacherIndexStatus.textContent = "Index: gagal (PDF tiada teks)";
    populateTeacherDropdown([]);
    renderTeacherDetail(null);
    return;
  }

  const merged = mergeManualOverrides(teacherMap, TEACHERS_MANUAL);

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

  populateTeacherDropdown(teachers);

  if (teacherSelected){
    const still = teachers.find(t => norm(t.name) === norm(teacherSelected.name));
    if (still) renderTeacherDetail(still);
  }
}

function populateTeacherDropdown(teachers){
  const list = Array.isArray(teachers) ? teachers : [];
  const sel = els.teacherSelect;

  sel.innerHTML = `<option value="">Pilih nama guru…</option>`;
  for (const t of list){
    const opt = document.createElement("option");
    opt.value = t.name;
    opt.textContent = t.name;
    sel.appendChild(opt);
  }
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
    const title = pages.length ? `Muka surat: ${pages.join(", ")}` : "Tiada muka surat";
    return `<span class="chip" data-pages="${pages.join(",")}" title="${escapeHtml(title)}">${escapeHtml(r.label)}</span>`;
  }).join("");

  els.teacherChips.querySelectorAll(".chip").forEach(ch => {
    ch.addEventListener("click", () => {
      const pages = (ch.getAttribute("data-pages") || "").split(",").map(x=>Number(x)).filter(Boolean);
      if (!pages.length) return;
      gotoPage(Math.min(...pages));
      closeDrawer();
    });
  });
}

function initTeacherUI(){
  populateTeacherDropdown([]);
  renderTeacherDetail(null);
  els.teacherIndexStatus.textContent = "Index: menunggu PDF…";

  els.teacherSelect.addEventListener("change", () => {
    const name = els.teacherSelect.value;
    if (!name || !TEACHER_INDEX) { renderTeacherDetail(null); return; }
    const t = TEACHER_INDEX.teachers.find(x => x.name === name);
    renderTeacherDetail(t || null);
  });

  els.btnReindex.addEventListener("click", () => {
    if (!pdfDoc) return;
    els.teacherIndexStatus.textContent = "Index: mula…";
    buildTeacherIndexFromPdf();
  });
}

/* ====== Init / wire ====== */
function wireUI(){
  setDrawerTop();
  window.addEventListener("resize", () => {
    setDrawerTop();
    // re-fit if fit mode
    if (fitMode){
      for (const [p, st] of pageState.entries()) st.renderedScaleKey = null;
      setTimeout(() => {
        const around = [currentVisiblePage-1, currentVisiblePage, currentVisiblePage+1];
        around.forEach(p => { if (p>=1 && pdfDoc && p<=pdfDoc.numPages) renderOnePage(p); });
      }, 80);
    }
  });

  els.btnToc.addEventListener("click", toggleDrawer);
  els.backdrop.addEventListener("click", closeDrawer);

  els.btnTools.addEventListener("click", () => {
    els.tools.classList.toggle("open");
  });

  els.zoom.addEventListener("input", () => applyZoom(els.zoom.value));
  els.btnFit.addEventListener("click", () => setFitMode());

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
}

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

  // Build scroll viewer
  els.pageTotal.textContent = `/ ${pdfDoc.numPages}`;
  createPagePlaceholders(pdfDoc.numPages);
  setupLazyRender();
  setupVisiblePageTracker();
  updatePageBadge();

  // render first pages quickly
  renderOnePage(1);
  renderOnePage(2);

  // Auto fit by default (maximize PDF)
  setTimeout(() => setFitMode(), 150);

  // Start teacher index without disturbing UI
  els.teacherIndexStatus.textContent = "Index: mula…";
  setTimeout(() => buildTeacherIndexFromPdf(), 250);

  setStatus("Sedia");
}

wireUI();

window.initPdfApp = function initPdfApp(){
  loadPdf().catch(err => {
    console.error(err);
    setStatus("Gagal");
    alert("Gagal load PDF. Semak nama fail PDF & pastikan ia ada di root repo.");
  });
};
