const PDF_URL = "./BUKU_PENGURUSAN_2021.pdf";

/**
 * MANUAL OVERRIDE (OPTIONAL)
 * Jika ada guru tak detect / typo besar / perlu tambah tugas:
 */
const TEACHERS_MANUAL = [
  // Contoh: { name: "Cikgu Abu Bakar bin Ali", roles: [{ label:"Penyelaras HEM", pages:[84] }] },
];

/** Kata kunci peranan untuk bantu extract dari baris */
const ROLE_KEYWORDS = [
  "Guru Kelas", "Penyelaras", "Setiausaha", "Bendahari", "AJK", "Ahli Jawatankuasa",
  "Pengerusi", "Timbalan", "Naib", "Ketua Panitia", "Panitia", "GPK", "Penolong Kanan",
  "APDM", "SSDM", "HEM", "Kurikulum", "Kokurikulum", "PPKi", "Pendidikan Khas", "Prasekolah",
  "Data", "ICT", "Disiplin", "Kebajikan", "SPBT", "RMT", "PBS", "PBD"
];

const COMMON_NAME_TOKENS = new Set([
  "mohd","mohamad","muhammad","abdul","bin","binti","bt","b","bte",
  "nur","siti","nor","noor","muhd","ahmad"
]);

const TRAILING_NON_NAME_TOKENS = new Set([
  "kp","k.p","gpk","ppp","dg","dga","dgb",
  "hem","kurikulum","kokurikulum","ppki","ppkip","prasekolah",
  "apdm","ssdm","spbt","ict","bestari","makmal","data","keselamatan",
  "bahasa","arab","inggeris","english","melayu","bm","bi","sains","math","matematik",
  "guru","penolong","penyelaras","setiausaha","bendahari","ajk","ketua","panitia",
  "pengawas","disiplin","kebajikan","rmt","emk","pemulihan","pbd","paks","peperiksaan"
]);

function isProbablyNonNameToken(tok){
  if (!tok) return false;
  const t = tok.toLowerCase();
  if (TRAILING_NON_NAME_TOKENS.has(t)) return true;
  if (/^[A-Z]{2,6}$/.test(tok)) return true;
  if (tok.includes("/")) return true;
  if (/^\d+$/.test(tok)) return true;
  return false;
}

function trimTrailingNonNameWords(name){
  const parts = String(name||"").trim().split(/\s+/);
  while (parts.length){
    let last = parts[parts.length-1];
    last = last.replace(/[.,;:()]+$/g,"");
    if (!last){ parts.pop(); continue; }
    if (isProbablyNonNameToken(last)) parts.pop();
    else break;
  }
  return parts.join(" ").trim();
}

/** Isi kandungan statik */
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
    { title: "Jadual Penyeliaan PdPc", start: 75, end: 75 },
    { title: "Jadual Penyeliaan HKM", start: 76, end: 76 },
    { title: "Takwim PBS & Modul UPSR", start: 77, end: 77 },
    { title: "Pencapaian UPSR", start: 78, end: 78 },
    { title: "Giliran Bertugas GPK", start: 79, end: 79 },
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

  // Guru - MODIFIED ELEMENTS
  teacherIndexStatus: document.getElementById("teacherIndexStatus"),
  btnReindex: document.getElementById("btnReindex"),
  teacherSelect: document.getElementById("teacherSelect"),
  teacherName: document.getElementById("teacherName"),
  teacherHint: document.getElementById("teacherHint"),
  teacherChips: document.getElementById("teacherChips"),

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

let pageState = new Map();
let currentVisiblePage = 1;
let intersectionObserver = null;
let visibleObserver = null;

let TEACHER_INDEX = null;
let teacherSelected = null;
let ACTIVE_HIGHLIGHT = null;

/* ====== Helpers ====== */
function setStatus(txt){ if (els.status) els.status.textContent = txt; }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function norm(s){ return (s||"").toLowerCase().replace(/\s+/g," ").trim(); }
function toggleDrawer(){ document.body.classList.toggle("drawer-open"); }
function closeDrawer(){ document.body.classList.remove("drawer-open"); }
function setDrawerTop(){
  const header = document.querySelector("header");
  if (!header || !els.drawer) return;
  const h = Math.ceil(header.getBoundingClientRect().height);
  els.drawer.style.top = `${h}px`;
}

/* ===== Tabs ===== */
function setTab(name){
  els.tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  document.getElementById("tab-toc").classList.toggle("hidden", name !== "toc");
  document.getElementById("tab-pantas").classList.toggle("hidden", name !== "pantas");
  document.getElementById("tab-guru").classList.toggle("hidden", name !== "guru");
}
els.tabs.forEach(t => t.addEventListener("click", () => setTab(t.dataset.tab)));

/* ===== TOC UI ===== */
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
          <div class="meta">m/s ${it.start}${it.start===it.end ? "" : ("—"+it.end)}</div>
        </div>
        <div class="badge">${it.start===it.end ? it.start : (it.start+"—"+it.end)}</div>
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
      gotoPage(q.page);
      closeDrawer();
    });
    els.quickLinks.appendChild(row);
  });
}

/* ===== Scroll pages viewer ===== */
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
  const wrapW = Math.max(320, containerWidth - 28);
  const scale = wrapW / viewport1.width;
  return clamp(Math.floor(scale * 100), 60, 200);
}

/* ===== Highlight ===== */
function clearHighlightsEverywhere(){
  document.querySelectorAll(".hlLayer").forEach(x => x.remove());
}
function setActiveHighlight(aliases, page){
  clearHighlightsEverywhere();
  if (!aliases || !aliases.length) { ACTIVE_HIGHLIGHT = null; return; }
  ACTIVE_HIGHLIGHT = { page: Number(page), aliases };
}

function normalizeForMatch(s){
  let x = String(s||"").toLowerCase().trim();
  try { x = x.normalize("NFKD").replace(/[\u0300-\u036f]/g, ""); } catch(e){}
  x = x.replace(/\b(mohamad|mohammad|muhamad|muhammad|mohd\.|muhd\.)\b/g, "mohd");
  x = x.replace(/\b(abd)\b/g, "abdul");
  x = x.replace(/\b(bin|binti|bt|bte|b\.)\b/gi, " ");
  x = x.replace(/[^a-z0-9\s]/g, " ");
  x = x.replace(/\s+/g, " ").trim();
  return x;
}

const LONG_MATCH_EXCLUDE = new Set(["guru","kelas","panitia"]);

async function applyHighlightOnRenderedPage(pageNum, page, viewport, holder){
  if (!ACTIVE_HIGHLIGHT || ACTIVE_HIGHLIGHT.page !== pageNum) return;

  holder.querySelectorAll(".hlLayer").forEach(x => x.remove());

  const hlLayer = document.createElement("div");
  hlLayer.className = "hlLayer";
  holder.appendChild(hlLayer);

  const textContent = await page.getTextContent({ disableCombineTextItems: false });
  const items = textContent.items || [];

  const lines = new Map();
  for (const it of items){
    const str = (it.str || "").trim();
    if (!str) continue;
    const tr = it.transform || [];
    const x = tr[4] ?? 0;
    const y = tr[5] ?? 0;
    const yKey = Math.round(y / 3) * 3;
    if (!lines.has(yKey)) lines.set(yKey, []);
    lines.get(yKey).push({ x, it });
  }
  const ys = Array.from(lines.keys()).sort((a,b)=> b-a);

  function highlightItem(it, str){
    const tx = pdfjsLib.Util.transform(viewport.transform, it.transform);
    const fontH = Math.max(8, Math.hypot(tx[2], tx[3]));
    const left = tx[4];
    const top = tx[5] - fontH;

    const w = Math.max(12, (it.width ? (it.width * viewport.scale) : (str.length * fontH * 0.58)));
    const h = fontH * 1.20;

    const div = document.createElement("div");
    div.className = "hl";
    div.style.left = `${left}px`;
    div.style.top = `${top}px`;
    div.style.width = `${w}px`;
    div.style.height = `${h}px`;
    hlLayer.appendChild(div);
    return true;
  }

  let any = false;

  for (const y of ys){
    const row = lines.get(y).sort((a,b)=> a.x - b.x);
    const lineText = row.map(r => (r.it.str||"").trim()).join(" ").replace(/\s+/g," ").trim();
    if (!lineText) continue;

    const lineKey = normalizeForMatch(lineText);

    let matchedAlias = null;
    for (const alias of ACTIVE_HIGHLIGHT.aliases){
      if (alias.key && lineKey.includes(alias.key)){
        matchedAlias = alias;
        break;
      }
    }
    if (!matchedAlias) continue;

    const tokensSet = new Set(matchedAlias.tokens);

    for (const r of row){
      const str = (r.it.str || "").trim();
      if (!str) continue;
      const partKey = normalizeForMatch(str);

      let match = false;
      if (tokensSet.has(partKey)) match = true;
      else{
        for (const t of (matchedAlias.tokens || [])){
          if (!t) continue;
          if (t.length >= 3 && (partKey === t || partKey.includes(t) || t.includes(partKey))) { match = true; break; }
          if (t.length >= 5 && !LONG_MATCH_EXCLUDE.has(t) && partKey.includes(t)) { match = true; break; }
        }
      }
      if (!match) continue;

      any = highlightItem(r.it, str) || any;
    }
  }

  if (any){
    hlLayer.classList.add("hlPulse");
    setTimeout(() => hlLayer.classList.remove("hlPulse"), 1200);
  }else{
    hlLayer.remove();
  }
}

/* ===== Render ===== */
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
      const viewport = page.getViewport({ scale: useZoom / 100 });
      await applyHighlightOnRenderedPage(pageNum, page, viewport, holder);
      st.rendering = false;
      return;
    }

    const viewport = page.getViewport({ scale: useZoom / 100 });
    const dpr = window.devicePixelRatio || 1;

    const canvas = st.canvas || document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    canvas.width = Math.floor(viewport.width * dpr);
    canvas.height = Math.floor(viewport.height * dpr);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    holder.innerHTML = "";
    holder.appendChild(canvas);

    const task = page.render({ canvasContext: ctx, viewport });
    await task.promise;

    st.canvas = canvas;
    st.renderedScaleKey = scaleKey;

    await applyHighlightOnRenderedPage(pageNum, page, viewport, holder);

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
  setTimeout(() => renderOnePage(p), 120);
}

function applyZoom(newZoom){
  fitMode = false;
  zoomPct = clamp(Number(newZoom) || 110, 60, 200);
  els.zoom.value = String(zoomPct);
  els.zoomLabel.textContent = `${zoomPct}%`;

  for (const [, st] of pageState.entries()) st.renderedScaleKey = null;

  setTimeout(() => {
    const around = [currentVisiblePage-1, currentVisiblePage, currentVisiblePage+1, currentVisiblePage+2];
    around.forEach(p => { if (p>=1 && pdfDoc && p<=pdfDoc.numPages) renderOnePage(p); });
  }, 50);
}

function setFitMode(){
  fitMode = true;
  els.zoomLabel.textContent = "Fit";
  for (const [, st] of pageState.entries()) st.renderedScaleKey = null;

  setTimeout(() => {
    const around = [currentVisiblePage-1, currentVisiblePage, currentVisiblePage+1, currentVisiblePage+2];
    around.forEach(p => { if (p>=1 && pdfDoc && p<=pdfDoc.numPages) renderOnePage(p); });
  }, 50);
}

/* ====== Name matching helpers (simplified) ====== */
function shouldMergeName(a,b){
  const na = normalizeForMatch(a);
  const nb = normalizeForMatch(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  
  const ta = na.split(" ").filter(Boolean);
  const tb = nb.split(" ").filter(Boolean);
  
  const commonTokens = ta.filter(t => tb.includes(t) && !COMMON_NAME_TOKENS.has(t));
  return commonTokens.length >= 2;
}

function dedupTeachers(raw){
  const clusters = [];
  for (const t of raw){
    let mergedInto = null;
    for (const c of clusters){
      if (shouldMergeName(t.name, c.name)){
        mergedInto = c; break;
      }
    }
    if (mergedInto){
      mergedInto.variants.push(t);
      mergedInto.totalCount += (t.count || 0);
    }else{
      clusters.push({ name: t.name, variants:[t], totalCount:(t.count || 0) });
    }
  }

  const merged = clusters.map(c => {
    let canon = c.variants[0];
    for (const v of c.variants){
      if ((v.count || 0) > (canon.count || 0)) canon = v;
    }

    const pages = new Set();
    const roles = new Map();

    for (const v of c.variants){
      (v.pages || []).forEach(p => pages.add(p));
      for (const r of (v.roles || [])){
        if (!roles.has(r.label)) roles.set(r.label, new Set());
        (r.pages || []).forEach(p => roles.get(r.label).add(p));
      }
    }

    const roleArr = Array.from(roles.entries()).map(([label, set]) => ({
      label,
      pages: Array.from(set).sort((a,b)=>a-b)
    })).sort((a,b)=> a.label.localeCompare(b.label, "ms"));

    const aliases = new Set();
    for (const v of c.variants) aliases.add(normalizeForMatch(v.name));
    const aliasList = Array.from(aliases).filter(Boolean).sort((a,b)=> b.length - a.length);
    const aliasObjs = aliasList.map(key => ({ key, tokens: key.split(" ").filter(x=>x.length>=2) }));

    return {
      name: canon.name,
      count: c.totalCount,
      pages: Array.from(pages).sort((a,b)=>a-b),
      roles: roleArr,
      aliases: aliasObjs
    };
  });

  return merged.sort((a,b)=> a.name.localeCompare(b.name, "ms"));
}

/* ====== Extract teacher names from PDF ====== */
const NAME_REGEX = /\b(?:(?:Pn\.|Puan|En\.|Encik|Cikgu|Cg\.|Ckg\.|Ustazah|Ustaz|Tn\.?\s*Hj\.?|Tn\.?\s*Hjh\.?|Hj\.|Hjh\.)\s+)(?:[A-Za-zÀ-ÿ''\-\.]+\s+){0,10}[A-Za-zÀ-ÿ''\-\.]+/gi;

function cleanName(s){
  let x = String(s||"").replace(/\s+/g," ").trim();
  x = x.replace(/\bb\.\b/gi, "bin").replace(/\bbt\.\b/gi, "binti").replace(/\bbte\.\b/gi, "binti");
  x = x.replace(/[,:;)\]]+$/g, "").trim();
  x = trimTrailingNonNameWords(x);
  return x;
}

function extractLinesFromTextContent(textContent){
  const items = (textContent && textContent.items) ? textContent.items : [];
  const groups = new Map();
  for (const it of items){
    const str = (it.str || "").trim();
    if (!str) continue;
    const tr = it.transform || [];
    const y = tr[5] ?? 0;
    const x = tr[4] ?? 0;
    const yKey = Math.round(y / 3) * 3;
    if (!groups.has(yKey)) groups.set(yKey, []);
    groups.get(yKey).push({ x, str });
  }
  const ys = Array.from(groups.keys()).sort((a,b)=> b-a);
  const lines = [];
  for (const y of ys){
    const row = groups.get(y).sort((a,b)=> a.x - b.x);
    const line = row.map(r => r.str).join(" ").replace(/\s+/g,"
                                                       " ").trim();
    if (line) lines.push(line);
  }
  return lines;
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
    map.set(key, { pages: new Set(), roles: new Map(), count: 0 });
  }
  const obj = map.get(key);
  obj.pages.add(page);
  obj.count += 1;
  return obj;
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
    const safe = k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    const re = new RegExp(safe, "i");
    if (re.test(L)){
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

async function buildTeacherIndexFromPdf(){
  if (!pdfDoc) return;

  const teacherMap = new Map();
  let anyText = false;

  const groupRanges = (TOC || []).map(g => {
    const items = g.items || [];
    const minS = Math.min(...items.map(x => x.start));
    const maxE = Math.max(...items.map(x => x.end));
    return { group: g.group, start: minS, end: maxE };
  }).filter(x => Number.isFinite(x.start) && Number.isFinite(x.end));

  function majorFromPage(p){
    let gname = null;
    for (const g of groupRanges){
      if (p >= g.start && p <= g.end) { gname = g.group; break; }
    }
    const s = String(gname || "").toLowerCase();
    if (s.includes("hal ehwal murid")) return "HEM";
    if (s.includes("kokurikulum")) return "KOKURIKULUM";
    if (s.includes("kurikulum")) return "KURIKULUM";
    if (s.includes("ppkip")) return "PPKIP";
    if (s.includes("pengurusan sekolah")) return "SEKOLAH";
    return "UMUM";
  }

  const n = pdfDoc.numPages;

  for (let p=1; p<=n; p++){
    els.teacherIndexStatus.textContent = `Index: ${p}/${n}`;

    const major = majorFromPage(p);

    try{
      const page = await pdfDoc.getPage(p);
      const textContent = await page.getTextContent({ disableCombineTextItems: false });
      const lines = extractLinesFromTextContent(textContent);
      const pageText = lines.join("\n");
      if (pageText.trim().length > 30) anyText = true;

      for (const line of lines){
        const l = String(line||"").replace(/\s+/g," ").trim();
        if (!l) continue;

        NAME_REGEX.lastIndex = 0;
        const matches = l.match(NAME_REGEX) || [];
        if (!matches.length) continue;

        for (const raw of matches){
          const name = cleanName(raw);
          const t = addTeacher(teacherMap, name, p);
          if (!t) continue;

          const inlineRole = roleFromLine(l, name);
          const label = major + (inlineRole ? ` - ${inlineRole}` : "");
          addRole(t.roles, label, p);
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

  const rawTeachers = Array.from(teacherMap.entries()).map(([name, obj]) => {
    const pages = Array.from(obj.pages).sort((a,b)=>a-b);
    const roles = Array.from(obj.roles.entries()).map(([label, set]) => ({
      label,
      pages: Array.from(set).sort((a,b)=>a-b)
    }));
    return { name, pages, roles, count: obj.count || 0 };
  });

  const teachers = dedupTeachers(rawTeachers);

  TEACHER_INDEX = { teachers, builtAt: Date.now(), from: "pdf_text" };

  els.teacherIndexStatus.textContent = `Index: siap (${teachers.length} nama)`;
  populateTeacherDropdown(teachers);

  if (teacherSelected){
    const still = teachers.find(t => normalizeForMatch(t.name) === normalizeForMatch(teacherSelected.name));
    if (still) {
      els.teacherSelect.value = still.name;
      renderTeacherDetail(still);
    }
  }
}

function populateTeacherDropdown(teachers){
  const list = Array.isArray(teachers) ? teachers : [];
  const sel = els.teacherSelect;

  sel.innerHTML = `<option value="">-- Pilih nama guru --</option>`;
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
    els.teacherHint.textContent = "Pilih tugas untuk auto lompat. Nama guru akan di-highlight pada page itu.";
    els.teacherChips.innerHTML = "";
    return;
  }

  const roles = (t.roles || []);
  els.teacherHint.textContent = roles.length ? `Jumlah tugas: ${roles.length}` : "Tiada tugas dikesan.";

  els.teacherChips.innerHTML = roles.map(r => {
    const pages = (r.pages || []);
    const title = pages.length ? `Muka surat: ${pages.join(", ")}` : "Tiada muka surat";
    return `<span class="chip" data-pages="${pages.join(",")}" title="${escapeHtml(title)}">${escapeHtml(r.label)}</span>`;
  }).join("");

  els.teacherChips.querySelectorAll(".chip").forEach(ch => {
    ch.addEventListener("click", () => {
      const pages = (ch.getAttribute("data-pages") || "").split(",").map(x=>Number(x)).filter(Boolean);
      if (!pages.length) return;
      const target = Math.min(...pages);

      const aliases = (t.aliases && t.aliases.length) ? t.aliases : [{ key: normalizeForMatch(t.name), tokens: normalizeForMatch(t.name).split(" ").filter(x=>x.length>=2) }];
      setActiveHighlight(aliases, target);

      gotoPage(target);
      closeDrawer();

      setTimeout(() => renderOnePage(target), 320);
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

/* ===== Init ===== */
function wireUI(){
  setDrawerTop();
  window.addEventListener("resize", () => {
    setDrawerTop();
    if (fitMode){
      for (const [, st] of pageState.entries()) st.renderedScaleKey = null;
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

  els.pageTotal.textContent = `/ ${pdfDoc.numPages}`;
  createPagePlaceholders(pdfDoc.numPages);
  setupLazyRender();
  setupVisiblePageTracker();
  updatePageBadge();

  renderOnePage(1);
  renderOnePage(2);

  setTimeout(() => setFitMode(), 150);

  els.teacherIndexStatus.textContent = "Index: mula…";
  setTimeout(() => buildTeacherIndexFromPdf(), 260);

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
