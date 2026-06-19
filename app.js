/**
 * Askar Family Prayer Tracker - Core Application Logic
 * Version: 3.0 (Shared Google Sheets Backend - Final)
 *
 * Data flow:
 *  1. On load: read API URL/token from localStorage settings.
 *  2. Run healthCheck (GET to Apps Script).
 *  3. If connected: fetch all records from Google Sheets → appState.records.
 *  4. All pages (Dashboard, Family, History, Statistics) read from appState.records.
 *  5. On prayer mark/undo: POST to Apps Script → refetch → re-render.
 *  6. localStorage is ONLY used for: language, theme, API URL/token, UI prefs.
 *     localStorage is NEVER the source of truth for prayer records.
 */

const CONFIG = {
    members: ['Abdulla', 'Dana', 'Mohammed', 'Iman', 'Rahma', 'Ghofra'],
    prayers: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'],
    storageKey: 'askar_v2_prayer_data',
    settingsKey: 'askar_v2_settings_data',
    quranSlides: [
        { text: "مَا سَلَكَكُمْ فِي سَقَرَ ۝ قَالُوا لَمْ نَكُ مِنَ الْمُصَلِّينَ", source: "سورة المدثر 42–43" },
        { text: "وَالَّذِينَ هُمْ عَلَى صَلَواتِهِمْ يُحَافِظُونَ ۝ أُولَئِكَ هُمُ الْوَارِثُونَ ۝ الَّذِينَ يَرِثُونَ الْفِرْدَوْسَ هُمْ فِيهَا خَالِدُونَ", source: "سورة المؤمنون 9–11" },
        { text: "وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَ الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ", source: "سورة النور 31" }
    ]
};

const appState = {
    language: "en",
    settings: {
        darkMode: false,
        sheetUrl: "",
        sheetPasscode: ""
    },
    prayerTimes: null,
    prayerTimeSource: "default",
    nextPrayer: null,
    records: {},
    currentPage: 'dashboard',
    currentDate: '',
    countdownInterval: null,
    quranInterval: null,
    clockInterval: null,
    quranIndex: 0,
    charts: { overall: null, comparison: null, prayerPerformance: null, overallH: null, barH: null },
    historyFilters: { start: '', end: '', member: 'all', prayer: 'all', status: 'all', search: '', view: 'timeline' }
};

// --- App Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    initApp().catch(error => {
        console.error("App initialization failed:", error);
        forceRenderFallbackDashboard();
    });
});

async function initApp() {
    console.log("[INIT] App starting...");

    // Clean old password keys from localStorage
    localStorage.removeItem('askar_passwords');
    localStorage.removeItem('askar_password');
    localStorage.removeItem('askarFamilyPasswords');

    loadSettings();
    console.log("[INIT] Settings loaded. API URL:", appState.settings.sheetUrl ? appState.settings.sheetUrl.substring(0, 60) + '...' : '(not set)');

    applyDirection();
    applyTranslations();

    appState.currentDate = getFormattedDate(new Date());
    initHistoryFilters();
    setupTheme();

    // UI independent of API
    renderQuranBanner();
    startQuranCarousel();
    startSidebarClock();
    renderDashboardLoadingState();

    // Data Load from shared backend (no localStorage prayer data)
    await fetchSharedRecords(true); // true = initial load, renders after

    // Prayer times (local calculation)
    await loadPrayerTimesSafe();

    // Initial State Calculation
    calculateNextPrayer();

    // Routing Setup
    setupNavigation();

    const savedPage = window.location.hash.replace("#", "") || localStorage.getItem("askarFamilyCurrentPage") || "dashboard";
    navigateTo(savedPage);

    // Initialize Floating Dock Navigation
    initializeDock();

    // Intervals
    startNextPrayerCountdown();
    setInterval(checkDayReset, 60000);

    // Auto-sync every 30 seconds if backend is connected
    setInterval(async () => {
        if (appState.settings.sheetUrl) {
            console.log("[AUTO-SYNC] Running background sync...");
            await fetchSharedRecords(false); // false = background refresh, renders silently
        }
    }, 30000);

    attachEventListeners();

    console.log("[INIT] App ready.");
}

function setupNavigation() {
    const navItems = document.querySelectorAll("[data-page]");
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateTo(page);
        });
    });

    window.addEventListener("hashchange", () => {
        const page = window.location.hash.replace("#", "") || "dashboard";
        if (appState.currentPage !== page) navigateTo(page);
    });
}

function navigateTo(page) {
    console.log("Navigating to:", page);
    appState.currentPage = page;
    localStorage.setItem("askarFamilyCurrentPage", page);
    
    // Update body class for page-specific CSS overrides
    document.body.className = document.body.className.replace(/\bpage-\S+/g, '');
    document.body.classList.add(`page-${page}`);

    // Update URL Hash
    if (window.location.hash !== "#" + page) {
        window.location.hash = page;
    }

    updateActiveNav(page);
    renderPage(page);
}

function updateActiveNav(page) {
    document.querySelectorAll("[data-page]").forEach(item => {
        item.classList.toggle("active", item.dataset.page === page);
    });
}

function renderPage(page) {
    // Hide all pages
    document.querySelectorAll(".view-container").forEach(view => {
        view.classList.remove("active");
        view.style.display = "none";
    });

    // Show target page
    const target = document.getElementById(`view-${page}`);
    if (target) {
        target.classList.add("active");
        target.style.display = "block";
        console.log("Rendering page:", page);
    } else {
        console.error("Missing view container for page:", page);
        if (page !== 'dashboard') navigateTo('dashboard');
        return;
    }

    // Page-specific triggers
    switch (page) {
        case "dashboard": renderDashboard(); break;
        case "family": renderFamily(); break;
        case "history": renderHistory(); break;
        case "statistics": renderStats(); break;
        case "settings": renderSettings(); break;
    }
}

function applyDirection() {
    document.documentElement.lang = appState.language;
    document.documentElement.dir = appState.language === "ar" ? "rtl" : "ltr";
}

function forceRenderFallbackDashboard() {
    appState.prayerTimes = getFallbackPrayerTimes();
    appState.prayerTimeSource = "fallback";
    renderPage("dashboard");
}

// --- Persistence ---
function loadSettings() {
    try {
        const saved = localStorage.getItem(CONFIG.settingsKey);
        if (saved) appState.settings = { ...appState.settings, ...JSON.parse(saved) };
        appState.language = localStorage.getItem('askarFamilyLanguage') || 'en';
    } catch (e) { console.error("[SETTINGS] Parse error:", e); }
}

// NOTE: loadRecords() is intentionally NOT called during app init.
// fetchSharedRecords() is always used instead as the authoritative source.
// localStorage prayer data (CONFIG.storageKey) is only an offline cache.
function loadRecords() {
    // DEPRECATED: Use fetchSharedRecords() instead.
    // This function is kept only for backward compatibility with importJSON.
    // It does NOT call syncCloudDatabase (which no longer exists).
    try {
        const saved = localStorage.getItem(CONFIG.storageKey);
        if (saved) appState.records = JSON.parse(saved);
        else appState.records = {};
    } catch (e) { appState.records = {}; }
}

function saveToStorage() {
    localStorage.setItem(CONFIG.settingsKey, JSON.stringify(appState.settings));
}

function setupTheme() {
    document.body.classList.toggle('dark-mode', appState.settings.darkMode);
    document.body.classList.toggle('light-mode', !appState.settings.darkMode);
}

// --- Utilities ---
function getFormattedDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function cleanTime(value) {
    if (!value || typeof value !== "string") return null;
    const match = value.match(/\b\d{1,2}:\d{2}\b/);
    if (!match) return null;
    const [h, m] = match[0].split(":");
    return String(h).padStart(2, "0") + ":" + m;
}

function normalizePrayerTimes(timings) {
    if (!timings) return null;
    const res = { Fajr: cleanTime(timings.Fajr), Sunrise: cleanTime(timings.Sunrise), Dhuhr: cleanTime(timings.Dhuhr), Asr: cleanTime(timings.Asr), Maghrib: cleanTime(timings.Maghrib), Isha: cleanTime(timings.Isha) };
    if (Object.values(res).some(v => !v)) return null;
    return res;
}

function getFallbackPrayerTimes() {
    return { Fajr: "03:24", Sunrise: "05:24", Dhuhr: "13:10", Asr: "17:10", Maghrib: "20:45", Isha: "22:36" };
}

async function loadPrayerTimesSafe() {
    appState.prayerTimes = getFallbackPrayerTimes();
    appState.prayerTimeSource = "default";
}

// --- Clock ---
function startSidebarClock() {
    if (appState.clockInterval) clearInterval(appState.clockInterval);
    const update = () => {
        const now = new Date();
        const tEl = document.getElementById('desktop-time'), dEl = document.getElementById('desktop-date'), mEl = document.getElementById('mobile-time'), hEl = document.getElementById('mobile-hijri'), mdEl = document.getElementById('mobile-date');
        if (tEl) tEl.textContent = now.toLocaleTimeString([], { hour12: false });
        if (dEl) dEl.textContent = now.toLocaleDateString(appState.language, { weekday: 'long', day: 'numeric', month: 'long' });
        if (mEl) mEl.textContent = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        if (mdEl) mdEl.textContent = now.toLocaleDateString(appState.language, { day: 'numeric', month: 'short' });
        if (hEl) {
            try { hEl.textContent = new Intl.DateTimeFormat(appState.language + '-u-ca-islamic-uma-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(now); } catch (e) { hEl.textContent = ""; }
        }
    };
    update(); appState.clockInterval = setInterval(update, 1000);
}

// --- Quran ---
function renderQuranBanner() {
    const tEl = document.getElementById('quran-text'), sEl = document.getElementById('quran-source'), dots = document.getElementById('carousel-dots');
    if (!tEl || !sEl) return;
    const slide = CONFIG.quranSlides[appState.quranIndex];
    tEl.textContent = slide.text; sEl.textContent = slide.source; tEl.style.direction = "rtl";
    if (dots) {
        dots.innerHTML = ''; CONFIG.quranSlides.forEach((_, i) => {
            const dot = document.createElement('div'); dot.className = `dot ${i === appState.quranIndex ? 'active' : ''}`;
            dot.onclick = () => { appState.quranIndex = i; renderQuranBanner(); }; dots.appendChild(dot);
        });
    }
}

function startQuranCarousel() {
    if (appState.quranInterval) clearInterval(appState.quranInterval);
    appState.quranInterval = setInterval(() => {
        appState.quranIndex = (appState.quranIndex + 1) % CONFIG.quranSlides.length;
        const cont = document.querySelector('.quran-banner-content');
        if (cont) { cont.style.opacity = 0; setTimeout(() => { renderQuranBanner(); cont.style.opacity = 1; }, 500); }
    }, 9000);
}

// --- Dashboard ---
function renderDashboardLoadingState() {
    const n = document.getElementById('next-prayer-name'); if (n) n.textContent = t('dashboard.loadingPrayerTimes');
}

function timeToDate(time, addDays = 0) {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(); d.setDate(d.getDate() + addDays); d.setHours(h, m, 0, 0); return d;
}

function calculateNextPrayer() {
    const times = appState.prayerTimes; const now = new Date();
    const list = [{ key: "fajr", time: times.Fajr }, { key: "dhuhr", time: times.Dhuhr }, { key: "asr", time: times.Asr }, { key: "maghrib", time: times.Maghrib }, { key: "isha", time: times.Isha }];
    for (const p of list) { const dt = timeToDate(p.time); if (dt > now) { appState.nextPrayer = { ...p, dateTime: dt }; return; } }
    appState.nextPrayer = { key: "fajr", time: times.Fajr, dateTime: timeToDate(times.Fajr, 1) };
}

function startNextPrayerCountdown() {
    if (appState.countdownInterval) clearInterval(appState.countdownInterval);
    const upd = () => {
        if (!appState.nextPrayer) calculateNextPrayer();
        const ms = appState.nextPrayer.dateTime - new Date();
        if (ms <= 0) { calculateNextPrayer(); renderDashboard(); return; }
        const c = document.getElementById('next-prayer-countdown');
        if (c) {
            const sec = Math.floor(ms / 1000), hh = String(Math.floor(sec / 3600)).padStart(2, "0"), mm = String(Math.floor((sec % 3600) / 60)).padStart(2, "0"), ss = String(sec % 60).padStart(2, "0");
            c.textContent = `${hh}:${mm}:${ss}`;
        }
    };
    upd(); appState.countdownInterval = setInterval(upd, 1000);
}

function renderDashboard() {
    if (!appState.prayerTimes) return;
    const n = document.getElementById('next-prayer-name'), r = document.getElementById('next-prayer-range');
    if (n) n.textContent = t(`prayer.${appState.nextPrayer.key}`);
    if (r) r.innerHTML = `<span>${t('dashboard.startsAt')} ${appState.nextPrayer.time}</span>`;
    
    renderPrayerWindows();
    renderFamilyProgress();
}

function renderPrayerWindows() {
    const c = document.getElementById('daily-timeline'); if (!c || !appState.prayerTimes) return; c.innerHTML = '';
    const tms = appState.prayerTimes, now = new Date(), nm = now.getHours() * 60 + now.getMinutes();
    const wins = [{ key: "fajr", start: tms.Fajr, end: tms.Sunrise }, { key: "dhuhr", start: tms.Dhuhr, end: tms.Asr }, { key: "asr", start: tms.Asr, end: tms.Maghrib }, { key: "maghrib", start: tms.Maghrib, end: tms.Isha }, { key: "isha", start: tms.Isha, end: tms.Fajr }];
    wins.forEach(w => {
        const [sh, sm] = w.start.split(':').map(Number), [eh, em] = w.end.split(':').map(Number);
        let sMin = sh * 60 + sm, eMin = eh * 60 + em; if (w.key === 'isha' && eMin < sMin) eMin += 1440;
        let cMin = nm + ((w.key === 'isha' && nm < sMin) ? 1440 : 0);
        let sk = 'upcoming', bc = 'badge-info';
        if (cMin >= sMin && cMin < eMin) { sk = 'active'; bc = 'badge-success'; }
        else if (cMin >= eMin) {
            sk = 'missed', bc = 'badge-danger';
            let d = 0; CONFIG.members.forEach(m => { if (getTodayRecordsFromSharedState(m)[w.key.charAt(0).toUpperCase() + w.key.slice(1)]) d++; });
            if (d === CONFIG.members.length) { sk = 'completed'; bc = 'badge-gold'; }
        }
        const i = document.createElement('div'); i.className = `timeline-item ${sk === 'active' ? 'active' : ''} graphical-timeline-card`;
        i.innerHTML = `<div class="tl-header"><span class="t-name">${t('prayer.' + w.key)}</span><span class="badge ${bc} tl-badge">${t('status.' + sk)}</span></div><div class="tl-times"><div class="tl-time-box"><span class="tl-time-label">${t('dashboard.start')}</span><span class="t-time">${w.start}</span></div><div class="tl-time-box"><span class="tl-time-label">${t('dashboard.end')}</span><span class="t-time">${w.end}</span></div></div>`;
        c.appendChild(i);
    });
}

function renderFamilyProgress() {
    let done = 0, onTime = 0, late = 0, total = CONFIG.members.length * 5;
    CONFIG.members.forEach(m => { 
        const mr = getTodayRecordsFromSharedState(m); 
        Object.values(mr).forEach(r => { done++; if (r.status === 'On time') onTime++; else if (r.status === 'Late') late++; }); 
    });
    const pct = Math.round((done / total) * 100) || 0;
    const pctEl = document.getElementById('family-percentage'); if (pctEl) pctEl.textContent = `${pct}%`;
    const doneEl = document.getElementById('family-done-count'); if (doneEl) doneEl.textContent = done;
    const stats = document.querySelector('.summary-stats');
    if (done === 0) stats.innerHTML = `<div style="padding: 1rem; color: var(--text-muted); width: 100%; text-align: center;">${t('dashboard.noPrayersMarked')}</div>`;
    else stats.innerHTML = `<div class="stat-item"><span class="stat-val text-success">${onTime}</span><span class="stat-label">${t('dashboard.onTime')}</span></div><div class="stat-item"><span class="stat-val text-danger">${late}</span><span class="stat-label">${t('dashboard.late')}</span></div><div class="stat-item"><span class="stat-val text-warning">${total - done}</span><span class="stat-label">${t('dashboard.pending')}</span></div>`;
    const circ = document.getElementById('family-progress-circle'); if (circ) { const len = 2 * Math.PI * 52; circ.style.strokeDashoffset = len - (pct / 100) * len; }
}

// --- Page Rendering ---
function getLastActivity(m) {
    const r = getTodayRecordsFromSharedState(m);
    const keys = Object.keys(r);
    if (keys.length === 0) return null;
    let lastKey = null;
    let maxTime = 0;
    keys.forEach(p => {
        if (r[p].timestamp > maxTime) {
            maxTime = r[p].timestamp;
            lastKey = p;
        }
    });
    if (!lastKey) return null;
    return {
        prayer: lastKey,
        time: r[lastKey].time.substring(0, 5)
    };
}

function getMemberMissedCount(m, d) {
    const today = getFormattedDate(new Date());
    const r = (appState.records[d] || {})[m] || {};
    if (d !== today) {
        return 5 - Object.keys(r).length;
    }
    const tms = appState.prayerTimes;
    if (!tms) return 0;
    const now = new Date();
    const nm = now.getHours() * 60 + now.getMinutes();
    const wins = [
        { key: "Fajr", end: tms.Sunrise },
        { key: "Dhuhr", end: tms.Asr },
        { key: "Asr", end: tms.Maghrib },
        { key: "Maghrib", end: tms.Isha },
        { key: "Isha", end: tms.Fajr }
    ];
    let missed = 0;
    wins.forEach(w => {
        if (!r[w.key]) {
            const [eh, em] = w.end.split(':').map(Number);
            let eMin = eh * 60 + em;
            if (w.key === 'Isha' && eMin < (Number(tms.Isha.split(':')[0]) * 60)) eMin += 1440;
            let cMin = nm + ((w.key === 'Isha' && nm < (Number(tms.Isha.split(':')[0]) * 60)) ? 1440 : 0);
            if (cMin >= eMin) missed++;
        }
    });
    return missed;
}

function isLateInDay(d) {
    const today = getFormattedDate(new Date());
    if (d !== today) return true;
    const now = new Date();
    return now.getHours() >= 15;
}

function renderFamily() {
    const c = document.getElementById('family-members-grid'); if (!c) return; c.innerHTML = '';
    CONFIG.members.forEach((m, idx) => {
        const s = getMemberStats(m, appState.currentDate);
        
        let activityStr = '';
        const act = getLastActivity(m);
        if (act) {
            const prName = t('prayer.' + act.prayer.toLowerCase());
            activityStr = t('family.lastMarked').replace('{prayer}', prName).replace('{time}', act.time);
        } else {
            activityStr = t('family.noActivity');
        }
        
        const card = document.createElement('div');
        card.className = 'card member-card';
        card.style.animationDelay = `${idx * 0.05}s`;
        card.onclick = () => openMemberModal(m);
        
        card.innerHTML = `
            <div class="member-card-header">
                <div class="member-profile">
                    <div class="member-avatar-wrapper">
                        <span class="member-avatar-initial">${m.charAt(0)}</span>
                    </div>
                    <div>
                        <h3 class="member-name">${m}</h3>
                        <div class="streak-badge"><i class="fas fa-fire"></i> ${getMemberStreak(m)} ${t('family.streak')}</div>
                    </div>
                </div>
                <div class="member-progress-mini">
                    <svg width="65" height="65">
                        <circle stroke="var(--border-color)" stroke-width="4" fill="transparent" r="28" cx="32" cy="32"/>
                        <circle stroke="var(--primary-color)" stroke-width="4" fill="transparent" r="28" cx="32" cy="32" stroke-dasharray="175.9" stroke-dashoffset="${175.9 - (175.9 * s.percentage / 100)}"/>
                    </svg>
                    <span class="progress-text-mini">${s.percentage}%</span>
                </div>
            </div>
            
            <div class="member-stats-container">
                <div class="member-stat-row-new">
                    <div class="stat-item-new">
                        <span class="stat-icon-mini text-success"><i class="fas fa-check-circle"></i></span>
                        <span class="stat-label-new">${t('family.done')}</span>
                        <span class="stat-val-new">${s.done}/5</span>
                    </div>
                    <div class="stat-item-new">
                        <span class="stat-icon-mini text-success"><i class="fas fa-clock"></i></span>
                        <span class="stat-label-new">${t('family.onTime')}</span>
                        <span class="stat-val-new">${s.onTime}</span>
                    </div>
                    <div class="stat-item-new">
                        <span class="stat-icon-mini text-warning"><i class="fas fa-exclamation-circle"></i></span>
                        <span class="stat-label-new">${t('family.late')}</span>
                        <span class="stat-val-new">${s.late}</span>
                    </div>
                    <div class="stat-item-new">
                        <span class="stat-icon-mini text-muted"><i class="fas fa-hourglass-half"></i></span>
                        <span class="stat-label-new">${t('family.pendingOrMissed')}</span>
                        <span class="stat-val-new">${5 - s.done}</span>
                    </div>
                </div>
            </div>
            
            <div class="member-card-activity">
                <span class="activity-label"><i class="far fa-clock"></i> ${activityStr}</span>
            </div>
            
            <div class="member-card-footer">
                <span class="badge ${s.badgeClass}">${t('family.' + s.statusKey)}</span>
                <button class="btn-card-action" onclick="event.stopPropagation(); openMemberModal('${m}')">
                    <span>${t('family.open')}</span> <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
        c.appendChild(card);
    });
}

function getMemberStats(m, d) {
    const r = (appState.records[d] || {})[m] || {};
    const dn = Object.keys(r).length;
    const ot = Object.values(r).filter(x => x.status === 'On time').length;
    const lt = Object.values(r).filter(x => x.status === 'Late').length;
    const pct = Math.round((dn / 5) * 100);
    
    let sk = "notStarted";
    let bc = "badge-danger";
    
    const missed = getMemberMissedCount(m, d);
    
    if (dn === 5) {
        sk = (ot === 5) ? "perfectDay" : "completed";
        bc = (ot === 5) ? "badge-gold" : "badge-success";
    } else if (missed >= 2 || (dn === 0 && isLateInDay(d))) {
        sk = "needsAttention";
        bc = "badge-danger";
    } else if (dn > 0) {
        sk = "inProgress";
        bc = "badge-info";
    }
    return { done: dn, onTime: ot, late: lt, percentage: pct, statusKey: sk, badgeClass: bc };
}

function getMemberStreak(m) {
    let s = 0, cd = new Date(); while (true) { const ds = getFormattedDate(cd), st = getMemberStats(m, ds); if (st.done === 5) s++; else if (ds !== appState.currentDate) break; cd.setDate(cd.getDate() - 1); if (s > 365) break; } return s;
}

function initHistoryFilters() {
    const today = appState.currentDate || getFormattedDate(new Date()); appState.historyFilters.start = today; appState.historyFilters.end = today;
    const s = document.getElementById('history-date-start'), e = document.getElementById('history-date-end'); if (s) s.value = today; if (e) e.value = today;
    const sel = document.getElementById('history-filter-member'); if (sel && sel.options.length <= 1) CONFIG.members.forEach(m => { const o = document.createElement('option'); o.value = m; o.textContent = m; sel.appendChild(o); });
}

function getFilteredHistory() {
    let res = []; const f = appState.historyFilters;
    Object.keys(appState.records).forEach(d => { if (d >= f.start && d <= f.end) Object.keys(appState.records[d]).forEach(m => { if (f.member === 'all' || f.member === m) Object.keys(appState.records[d][m]).forEach(p => { if (f.prayer === 'all' || f.prayer === p) { const r = appState.records[d][m][p]; if (f.status === 'all' || f.status === r.status) if (!f.search || m.toLowerCase().includes(f.search.toLowerCase()) || (r.note && r.note.toLowerCase().includes(f.search.toLowerCase()))) res.push({ date: d, member: m, prayer: p, ...r }); } }); }); });
    return res.sort((a, b) => b.timestamp - a.timestamp);
}

function renderHistory() {
    const f = getFilteredHistory(); const tot = f.length, ot = f.filter(r => r.status === 'On time').length, lt = f.filter(r => r.status === 'Late').length, mi = f.filter(r => r.status === 'Missed').length;
    ['hist-stat-total', 'hist-stat-ontime', 'hist-stat-late', 'hist-stat-missed'].forEach((id, idx) => { const el = document.getElementById(id); if (el) el.textContent = [tot, ot, lt, mi][idx]; });
    const dg = document.querySelector('.history-dashboard-grid'), hm = document.querySelector('.heatmap-card'), rs = document.querySelector('.records-section'), es = document.getElementById('history-empty-state');
    if (f.length === 0) { [dg, hm, rs].forEach(x => x && x.classList.add('hidden')); if (es) es.classList.remove('hidden'); return; }
    if (es) es.classList.add('hidden'); [dg, hm, rs].forEach(x => x && x.classList.remove('hidden'));
    renderHistoryCharts(f); renderHistoryMemberSummary(f); renderHistoryHeatmap(); renderHistoryTable(f);
}

function renderHistoryCharts(recs) {
    const cnts = { 'On time': 0, 'Late': 0, 'Missed': 0 }; recs.forEach(r => { if(cnts[r.status] !== undefined) cnts[r.status]++; });
    const donut = document.getElementById('hist-status-donut');
    if (donut) { if (appState.charts.overallH) appState.charts.overallH.destroy(); appState.charts.overallH = new Chart(donut, { type: 'doughnut', data: { labels: [t('status.onTime'), t('status.late'), t('status.missed')], datasets: [{ data: [cnts['On time'], cnts['Late'], cnts['Missed']], backgroundColor: ['#2e7d32', '#fbc02d', '#d32f2f'], borderWidth: 0 }] }, options: { cutout: '65%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } } }, maintainAspectRatio: false } }); }
    const bar = document.getElementById('hist-prayer-bar');
    if (bar) {
        const perf = {}; CONFIG.prayers.forEach(p => perf[p] = { ot: 0, lm: 0 }); recs.forEach(r => { if(perf[r.prayer]) { if (r.status === 'On time') perf[r.prayer].ot++; else perf[r.prayer].lm++; } });
        if (appState.charts.barH) appState.charts.barH.destroy(); appState.charts.barH = new Chart(bar, { type: 'bar', data: { labels: CONFIG.prayers.map(p => t('prayer.' + p.toLowerCase())), datasets: [{ label: t('status.onTime'), data: CONFIG.prayers.map(p => perf[p].ot), backgroundColor: '#2e7d32', borderRadius: 4 }, { label: t('status.late') + '/' + t('status.missed'), data: CONFIG.prayers.map(p => perf[p].lm), backgroundColor: '#d32f2f', borderRadius: 4 }] }, options: { scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } } }, maintainAspectRatio: false } });
    }
}

function renderHistoryMemberSummary(recs) {
    const c = document.getElementById('hist-member-summary-list'); if (!c) return; c.innerHTML = '';
    (appState.historyFilters.member === 'all' ? CONFIG.members : [appState.historyFilters.member]).forEach(m => {
        const mr = recs.filter(r => r.member === m), tot = mr.length; if (tot === 0) return;
        const ot = mr.filter(r => r.status === 'On time').length, lt = mr.filter(r => r.status === 'Late').length, mi = mr.filter(r => r.status === 'Missed').length;
        const otp = Math.round((ot / tot) * 100), ltp = Math.round((lt / tot) * 100), mip = Math.round((mi / tot) * 100);
        const r = document.createElement('div'); r.className = 'mini-member-row';
        r.innerHTML = `<div class="mini-member-header"><span>${m}</span><span>${otp}% ${t('status.onTime')}</span></div><div class="mini-progress-track"><div class="mini-progress-fill success" style="width: ${otp}%"></div><div class="mini-progress-fill warning" style="width: ${ltp}%"></div><div class="mini-progress-fill danger" style="width: ${mip}%"></div></div>`;
        c.appendChild(r);
    });
}

function renderHistoryHeatmap() {
    const c = document.getElementById('calendar-heatmap'); if (!c) return; c.innerHTML = '';
    const focus = appState.historyFilters.start || appState.currentDate; if (!focus) return;
    const [y, m] = focus.split('-').map(Number), dt = new Date(y, m - 1, 1), lbl = document.getElementById('heatmap-month-label');
    if (lbl) lbl.textContent = dt.toLocaleDateString(appState.language, { month: 'long', year: 'numeric' });
    const dim = new Date(y, m, 0).getDate(), fdi = new Date(y, m - 1, 1).getDay();
    for (let i = 0; i < fdi; i++) c.appendChild(document.createElement('div'));
    for (let d = 1; d <= dim; d++) {
        const dk = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, div = document.createElement('div'); div.className = 'cal-day empty'; div.textContent = d;
        const data = appState.records[dk];
        if (data) {
            let dn = 0, ot = 0, exp = 0; CONFIG.members.forEach(mbr => { if (appState.historyFilters.member === 'all' || appState.historyFilters.member === mbr) { if (data[mbr]) { exp += 5; Object.values(data[mbr]).forEach(r => { dn++; if (r.status === 'On time') ot++; }); } } });
            if (exp > 0) { const pct = dn / exp, otp = dn > 0 ? ot / dn : 0; if (pct >= 0.8 && otp >= 0.8) div.className = 'cal-day good'; else if (pct >= 0.5) div.className = 'cal-day partial'; else div.className = 'cal-day weak'; div.innerHTML += `<div class="tooltip">${dn}/${exp} ${t('modals.prayersText')}<br>${ot} ${t('status.onTime')}</div>`; }
            else div.innerHTML += `<div class="tooltip">${t('history.noData')}</div>`;
        } else div.innerHTML += `<div class="tooltip">${t('history.noData')}</div>`;
        div.onclick = () => { appState.historyFilters.start = dk; appState.historyFilters.end = dk; const si = document.getElementById('history-date-start'), ei = document.getElementById('history-date-end'); if (si) si.value = dk; if (ei) ei.value = dk; renderHistory(); };
        c.appendChild(div);
    }
}

function renderHistoryTable(recs) {
    const db = document.getElementById('history-table-body'), mc = document.getElementById('history-mobile-cards'); if (!db || !mc) return; db.innerHTML = ''; mc.innerHTML = '';
    recs.forEach(r => {
        const tr = document.createElement('tr'); tr.innerHTML = `<td>${r.date.split('-').slice(1).reverse().join('/')}</td><td><strong>${r.member}</strong></td><td>${t('prayer.' + r.prayer.toLowerCase())}</td><td>${r.time}</td><td><span class="badge ${getStatusBadgeClass(r.status)}">${t('status.' + (r.status === 'On time' ? 'onTime' : r.status.toLowerCase()))}</span></td>`;
        db.appendChild(tr);
        const cd = document.createElement('div'); cd.className = 'mobile-record-card';
        cd.innerHTML = `<div class="m-rec-info"><span class="m-rec-title">${t('prayer.' + r.prayer.toLowerCase())} &middot; ${r.member}</span><span class="m-rec-meta"><i class="far fa-calendar-alt"></i> ${r.date} &nbsp; <i class="far fa-clock"></i> ${r.time}</span></div><div class="m-rec-status"><span class="badge ${getStatusBadgeClass(r.status)}">${t('status.' + (r.status === 'On time' ? 'onTime' : r.status.toLowerCase()))}</span></div>`;
        mc.appendChild(cd);
    });
}

function getStatusBadgeClass(status) { if (status === 'On time') return 'badge-success'; if (status === 'Late') return 'badge-danger'; if (status === 'Missed') return 'badge-danger'; return 'badge-info'; }

function renderStats() {
    const f = getFilteredHistory();
    const sc = document.getElementById('stats-content'), se = document.getElementById('stats-empty-state');
    
    if (f.length === 0) {
        if (sc) sc.classList.add('hidden');
        if (se) se.classList.remove('hidden');
        return;
    }
    
    if (sc) sc.classList.remove('hidden');
    if (se) se.classList.add('hidden');

    const cnts = { 'On time': 0, 'Late': 0, 'Missed': 0 };
    f.forEach(r => { if (cnts[r.status] !== undefined) cnts[r.status]++; });

    // Update stat card numbers
    const tot = f.length, ot = cnts['On time'], lt = cnts['Late'], mi = cnts['Missed'];
    ['stats-card-total', 'stats-card-ontime', 'stats-card-late', 'stats-card-missed'].forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) el.textContent = [tot, ot, lt, mi][idx];
    });

    // 1. Overall Performance chart (doughnut)
    const ov = document.getElementById('chart-overall-donut');
    if (ov) {
        try {
            if (appState.charts.overall) appState.charts.overall.destroy();
            appState.charts.overall = new Chart(ov, {
                type: 'doughnut',
                data: {
                    labels: [t('status.onTime'), t('status.late'), t('status.missed')],
                    datasets: [{
                        data: [cnts['On time'], cnts['Late'], cnts['Missed']],
                        backgroundColor: ['#2e7d32', '#fbc02d', '#d32f2f'],
                        borderWidth: 0
                    }]
                },
                options: {
                    cutout: '70%',
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } } },
                    maintainAspectRatio: false
                }
            });
        } catch (err) { console.error("Chart overall failed", err); }
    }

    // 2. Member Comparison chart (bar)
    const cmp = document.getElementById('chart-member-comparison');
    if (cmp) {
        try {
            const p = {}; CONFIG.members.forEach(m => p[m] = { d: 0, ot: 0 });
            f.forEach(r => { p[r.member].d++; if (r.status === 'On time') p[r.member].ot++; });
            if (appState.charts.comparison) appState.charts.comparison.destroy();
            appState.charts.comparison = new Chart(cmp, {
                type: 'bar',
                data: {
                    labels: CONFIG.members,
                    datasets: [
                        { label: t('status.onTime'), data: CONFIG.members.map(m => p[m].ot), backgroundColor: '#d4af37' },
                        { label: t('family.completed'), data: CONFIG.members.map(m => p[m].d), backgroundColor: '#1b4332' }
                    ]
                },
                options: {
                    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } } },
                    maintainAspectRatio: false
                }
            });
        } catch (err) { console.error("Chart comparison failed", err); }
    }

    // 3. Prayer Performance chart (bar)
    const prp = document.getElementById('chart-prayer-performance');
    if (prp) {
        try {
            const perf = {}; CONFIG.prayers.forEach(pr => perf[pr] = { ot: 0, lm: 0 });
            f.forEach(r => {
                if (perf[r.prayer]) {
                    if (r.status === 'On time') perf[r.prayer].ot++;
                    else perf[r.prayer].lm++;
                }
            });
            if (appState.charts.prayerPerformance) appState.charts.prayerPerformance.destroy();
            appState.charts.prayerPerformance = new Chart(prp, {
                type: 'bar',
                data: {
                    labels: CONFIG.prayers.map(pr => t('prayer.' + pr.toLowerCase())),
                    datasets: [
                        { label: t('status.onTime'), data: CONFIG.prayers.map(pr => perf[pr].ot), backgroundColor: '#2e7d32', borderRadius: 4 },
                        { label: t('status.late') + '/' + t('status.missed'), data: CONFIG.prayers.map(pr => perf[pr].lm), backgroundColor: '#d32f2f', borderRadius: 4 }
                    ]
                },
                options: {
                    scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } } },
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } } },
                    maintainAspectRatio: false
                }
            });
        } catch (err) { console.error("Chart prayer performance failed", err); }
    }

    // 4. Insights
    const c = document.getElementById('stats-insights');
    if (c) {
        c.innerHTML = '';
        const i = [];
        const pm = {}; f.forEach(r => { if (r.status !== 'On time') pm[r.prayer] = (pm[r.prayer] || 0) + 1; });
        const wp = Object.entries(pm).sort((a, b) => b[1] - a[1])[0];
        if (wp) i.push(`${t('messages.mostMissed')} <strong>${t('prayer.' + wp[0].toLowerCase())}</strong>.`);
        const bm = CONFIG.members.map(m => {
            const mr = f.filter(r => r.member === m), ot = mr.filter(r => r.status === 'On time').length;
            return { name: m, rate: mr.length > 0 ? (ot / mr.length) : 0 };
        }).sort((a, b) => b.rate - a.rate)[0];
        if (bm && bm.rate > 0) i.push(`<strong>${bm.name}</strong> ${t('messages.highestRate')}`);
        
        i.forEach(txt => {
            const d = document.createElement('div');
            d.className = 'card insight-card';
            d.innerHTML = `<p>${txt}</p>`;
            c.appendChild(d);
        });
    }
}

function renderSettings() {
    const s = appState.settings;
    const dmEl = document.getElementById('setting-dark-mode');
    if (dmEl) dmEl.checked = !!s.darkMode;
    
    const sheetUrlEl = document.getElementById('setting-sheet-url');
    const sheetPasscodeEl = document.getElementById('setting-sheet-passcode');
    if (sheetUrlEl) sheetUrlEl.value = s.sheetUrl || '';
    if (sheetPasscodeEl) sheetPasscodeEl.value = s.sheetPasscode || '';
    
    updateSyncStatus(s.sheetUrl ? (appState.lastSync ? 'success' : 'syncing') : 'disconnected');
}

// --- Modals ---
function openMemberModal(m) {
    const n = document.getElementById('modal-member-name'); if (n) n.textContent = m;
    const st = getMemberStats(m, appState.currentDate);
    const b = document.getElementById('modal-progress-bar'), tEl = document.getElementById('modal-progress-text'), sk = document.getElementById('modal-member-streak');
    if (b) b.style.width = `${st.percentage}%`; if (tEl) tEl.textContent = `${st.done}/5 ${t('modals.completedText')}`; if (sk) sk.innerHTML = `<i class="fas fa-fire"></i> ${getMemberStreak(m)} ${t('family.streak')}`;
    renderMemberChecklist(m); document.getElementById('member-modal').classList.add('active');
}

function renderMemberChecklist(m) {
    const c = document.getElementById('member-prayer-list'); if (!c) return; c.innerHTML = '';
    const recs = getTodayRecordsFromSharedState(m), now = new Date(), nm = now.getHours() * 60 + now.getMinutes();
    CONFIG.prayers.forEach(p => {
        const r = recs[p], pt = appState.prayerTimes[p], [ph, pm] = pt.split(':').map(Number), pmIn = ph * 60 + pm;
        let h = ''; 
        if (r) {
            h = `
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
                    <span class="badge ${getStatusBadgeClass(r.status)}">${t('status.marked')} &middot; ${r.time}</span>
                    <button class="btn btn-ghost btn-sm" onclick="undoPrayer('${m}', '${p}')" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;">
                        <i class="fas fa-undo"></i> ${t('family.undo')}
                    </button>
                </div>
            `;
        }
        else if (nm < pmIn) h = `<button class="btn btn-ghost text-muted" disabled>${t('modals.upcoming')}</button>`;
        else h = `
            <div class="prayer-action-container" style="display: flex; align-items: center; gap: 0.75rem;">
                <span class="arabic-pledge-badge">والله صليت</span>
                <button class="btn btn-primary btn-sm" onclick="markPrayer('${m}', '${p}')">${t('family.markAsPrayed')}</button>
            </div>
        `;
        const div = document.createElement('div'); div.className = `prayer-row ${r ? 'completed' : ''}`;
        div.innerHTML = `<div class="prayer-meta"><span class="p-name">${t('prayer.' + p.toLowerCase())}</span><span class="p-window">${t('modals.startsAt')} ${pt}</span></div><div class="prayer-action">${h}</div>`;
        c.appendChild(div);
    });
}

async function markPrayer(m, p) {
    const now = new Date(), nm = now.getHours() * 60 + now.getMinutes();
    let em = 1440;
    const ni = CONFIG.prayers.indexOf(p) + 1;
    if (ni < CONFIG.prayers.length) {
        const [nh, nmm] = appState.prayerTimes[CONFIG.prayers[ni]].split(':').map(Number);
        em = nh * 60 + nmm;
    }
    const s = nm <= em ? 'On time' : 'Late';
    const record = { status: s, time: now.toLocaleTimeString([], { hour12: false }), timestamp: now.getTime() };

    const sheetUrl = appState.settings.sheetUrl;
    if (!sheetUrl) {
        // No backend configured: show clear warning and update locally only
        console.warn("[MARK] No API URL configured. Backend not connected. Saving locally only.");
        if (!appState.records[appState.currentDate]) appState.records[appState.currentDate] = {};
        if (!appState.records[appState.currentDate][m]) appState.records[appState.currentDate][m] = {};
        appState.records[appState.currentDate][m][p] = record;
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(appState.records));
        showToast(`⚠️ ${m} ${t('messages.marked')} ${t('prayer.' + p.toLowerCase())} — ${t('settings.statusDisconnected') || 'Backend not connected. Data is local only.'}`, 'warning');
        refreshUI(m);
        return;
    }

    console.log(`[MARK] Saving prayer: ${m} / ${p} / ${s}`);
    updateSyncStatus('syncing');
    showToast(t('settings.statusSyncing') || 'Saving to Google Sheet...');

    const success = await saveSharedPrayerRecord(appState.currentDate, m, p, record, 'save');
    if (success) {
        showToast(`${m} ${t('messages.marked')} ${t('prayer.' + p.toLowerCase())} ${t('status.' + (s === 'On time' ? 'onTime' : s.toLowerCase()))}!`);
        // Immediately update local state so UI is snappy, then confirm from server
        if (!appState.records[appState.currentDate]) appState.records[appState.currentDate] = {};
        if (!appState.records[appState.currentDate][m]) appState.records[appState.currentDate][m] = {};
        appState.records[appState.currentDate][m][p] = record;
        refreshUI(m);
        // Then re-fetch from server to confirm and pick up any other changes
        await fetchSharedRecords(false);
        refreshUI(m);
    } else {
        // Save failed: do NOT silently save locally. Show clear error.
        console.error("[MARK] Save to Google Sheets FAILED. Not saving locally.");
        showToast('❌ ' + (t('settings.syncError') || 'Failed to save to Google Sheets. Please check your API URL.'), 'danger');
        updateSyncStatus('error');
    }
}

async function undoPrayer(m, p) {
    const sheetUrl = appState.settings.sheetUrl;
    if (!sheetUrl) {
        console.warn("[UNDO] No API URL configured. Backend not connected.");
        if (appState.records[appState.currentDate]?.[m]?.[p]) {
            delete appState.records[appState.currentDate][m][p];
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(appState.records));
            showToast(`⚠️ ${t('family.undo')}: ${t('prayer.' + p.toLowerCase())} — Backend not connected. Local only.`, 'warning');
            refreshUI(m);
        }
        return;
    }

    console.log(`[UNDO] Deleting prayer: ${m} / ${p}`);
    updateSyncStatus('syncing');
    showToast(t('settings.statusSyncing') || 'Removing from Google Sheet...');

    const success = await saveSharedPrayerRecord(appState.currentDate, m, p, null, 'delete');
    if (success) {
        showToast(`${t('family.undo')}: ${t('prayer.' + p.toLowerCase())}`);
        // Immediately update local state
        if (appState.records[appState.currentDate]?.[m]?.[p]) {
            delete appState.records[appState.currentDate][m][p];
        }
        refreshUI(m);
        // Then confirm from server
        await fetchSharedRecords(false);
        refreshUI(m);
    } else {
        console.error("[UNDO] Delete from Google Sheets FAILED.");
        showToast('❌ ' + (t('settings.syncError') || 'Failed to remove from Google Sheets.'), 'danger');
        updateSyncStatus('error');
    }
}

function refreshUI(m) {
    // 1. Update all pages in background
    renderDashboard();
    renderFamily();
    renderHistory();
    renderStats();

    // 2. Update modal if open
    const modal = document.getElementById('member-modal');
    if (modal && modal.classList.contains('active')) {
        const st = getMemberStats(m, appState.currentDate);
        const bar = document.getElementById('modal-progress-bar'), tEl = document.getElementById('modal-progress-text'), sk = document.getElementById('modal-member-streak');
        if (bar) bar.style.width = `${st.percentage}%`;
        if (tEl) tEl.textContent = `${st.done}/5 ${t('modals.completedText')}`;
        if (sk) sk.innerHTML = `<i class="fas fa-fire"></i> ${getMemberStreak(m)} ${t('family.streak')}`;
        renderMemberChecklist(m);
    }
}

function renderAll() {
    renderDashboard(); renderFamily(); renderHistory(); renderStats(); renderSettings();
}

function attachEventListeners() {
    document.querySelectorAll('.close-modal').forEach(b => b.onclick = () => document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')));
    
    // Theme toggle
    const dmEl = document.getElementById('setting-dark-mode');
    if (dmEl) {
        dmEl.onchange = (e) => {
            appState.settings.darkMode = e.target.checked;
            setupTheme();
            saveToStorage();
        };
    }
    
    // History filters
    ['history-date-start', 'history-date-end', 'history-filter-member', 'history-filter-prayer', 'history-filter-status'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.onchange = () => {
            appState.historyFilters[id.split('-').pop()] = el.value;
            renderHistory();
        };
    });
    
    const hs = document.getElementById('history-search');
    if (hs) hs.oninput = (e) => {
        appState.historyFilters.search = e.target.value;
        renderHistory();
    };
    
    const rH = document.getElementById('history-reset-btn'), rE = document.getElementById('history-reset-empty-btn');
    const rf = () => {
        initHistoryFilters();
        appState.historyFilters.member = 'all';
        appState.historyFilters.prayer = 'all';
        appState.historyFilters.status = 'all';
        appState.historyFilters.search = '';
        ['history-filter-member', 'history-filter-prayer', 'history-filter-status', 'history-search'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = (id === 'history-search' ? '' : 'all');
        });
        renderHistory();
    };
    if (rH) rH.onclick = rf;
    if (rE) rE.onclick = rf;
    
    // Switch views
    document.querySelectorAll('.switcher-btn').forEach(b => b.onclick = () => {
        document.querySelectorAll('.switcher-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        appState.historyFilters.view = b.dataset.historyView;
        renderHistory();
    });
    
    // Stats Range Tabs
    document.querySelectorAll('.tab-btn').forEach(b => b.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        const td = new Date();
        let st = new Date();
        switch (b.dataset.range) {
            case 'week': st.setDate(td.getDate() - 7); break;
            case 'month': st.setMonth(td.getMonth() - 1); break;
            case 'all': st = new Date(2000, 0, 1); break;
        }
        appState.historyFilters.start = getFormattedDate(st);
        appState.historyFilters.end = getFormattedDate(td);
        renderStats();
    });
    
    // Data backup
    const expJ = document.getElementById('btn-export-json'), ec = document.getElementById('btn-export-csv'), ij = document.getElementById('import-json'), ra = document.getElementById('btn-reset-all');
    if (expJ) expJ.onclick = exportJSON;
    if (ec) ec.onclick = exportCSV;
    if (ij) ij.onchange = importJSON;
    const clearModal = document.getElementById('clear-data-modal');
    const clearInput = document.getElementById('clear-data-password-input');
    const clearError = document.getElementById('clear-data-error-msg');
    const clearConfirmBtn = document.getElementById('confirm-clear-data-btn');
    
    if (ra && clearModal && clearInput && clearError && clearConfirmBtn) {
        ra.onclick = () => {
            clearInput.value = '';
            clearError.style.display = 'none';
            clearError.textContent = '';
            clearModal.classList.add('active');
            clearInput.focus();
        };
        
        const handleConfirm = async () => {
            if (clearInput.value === 'askar12345') {
                appState.records = {};
                saveToStorage();
                renderAll();
                showToast(t('messages.resetDone'));
                clearModal.classList.remove('active');
                
                // Cloud reset
                if (appState.settings.sheetUrl) {
                    await resetCloudDatabase();
                    await fetchSharedRecords();
                }
            } else {
                clearError.textContent = t('settings.wrongPassword');
                clearError.style.display = 'block';
                clearInput.focus();
            }
        };
        
        clearConfirmBtn.onclick = handleConfirm;
        
        clearInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                handleConfirm();
            }
        };
    }
    
    // Reset Preferences Button
    const rp = document.getElementById('btn-reset-preferences');
    if (rp) {
        rp.onclick = () => {
            if (confirm(t('settings.areYouSure'))) {
                localStorage.removeItem(CONFIG.settingsKey);
                appState.settings = { darkMode: false };
                setLanguage('en');
                setupTheme();
                renderAll();
                showToast(t('messages.settingsSaved'));
            }
        };
    }
    
    // Go to Family empty stats button
    const gtf = document.getElementById('stats-go-to-family-btn');
    if (gtf) {
        gtf.onclick = () => navigateTo('family');
    }
    
    // Google Sheets save settings click handler
    const saveConnectionBtn = document.getElementById('btn-save-sheet-settings');
    if (saveConnectionBtn) {
        saveConnectionBtn.onclick = async () => {
            const urlEl = document.getElementById('setting-sheet-url');
            const passcodeEl = document.getElementById('setting-sheet-passcode');
            if (urlEl && passcodeEl) {
                const newUrl = urlEl.value.trim();
                const newPasscode = passcodeEl.value.trim();

                // Validate URL before saving
                if (newUrl && !newUrl.includes('/exec')) {
                    showToast('❌ URL must end with /exec (copy it exactly from Apps Script deploy)', 'danger');
                    return;
                }

                appState.settings.sheetUrl = newUrl;
                appState.settings.sheetPasscode = newPasscode;
                saveToStorage();
                console.log("[SETTINGS] API URL saved:", newUrl.substring(0, 60) + '...');

                if (appState.settings.sheetUrl) {
                    showToast(t('messages.settingsSaved') || 'Settings saved. Connecting...');
                    // Run health check then fetch records
                    const ok = await runHealthCheck();
                    if (ok) {
                        await fetchSharedRecords(true);
                        showToast('✅ ' + (t('settings.syncSuccess') || 'Connected and records loaded!'));
                    }
                } else {
                    showToast(t('messages.settingsSaved') || 'Settings saved.');
                    updateSyncStatus('disconnected');
                }
            }
        };
    }

    // Manual Refresh handlers
    const desktopRefreshBtn = document.getElementById('desktop-refresh-btn');
    if (desktopRefreshBtn) {
        desktopRefreshBtn.onclick = async () => {
            console.log("[REFRESH] Manual sync triggered (desktop)");
            await fetchSharedRecords(true);
            showToast('✅ ' + (t('settings.syncSuccess') || 'Successfully synchronized with Google Sheet'));
        };
    }
    const mobileRefreshBtn = document.getElementById('mobile-refresh-btn');
    if (mobileRefreshBtn) {
        mobileRefreshBtn.onclick = async () => {
            console.log("[REFRESH] Manual sync triggered (mobile)");
            await fetchSharedRecords(true);
            showToast('✅ ' + (t('settings.syncSuccess') || 'Successfully synchronized with Google Sheet'));
        };
    }
}

function showToast(m, tp = 'info') { const c = document.getElementById('toast-container'); if (!c) return; const t = document.createElement('div'); t.className = `toast ${tp}`; t.textContent = m; c.appendChild(t); setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 500); }, 3000); }
function triggerConfetti() { if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#1b4332', '#d4af37', '#2d6a4f'] }); }

function checkDayReset() {
    const today = getFormattedDate(new Date());
    if (appState.currentDate !== today) { appState.currentDate = today; loadPrayerTimesSafe().then(() => { renderAll(); showToast(t('messages.dayRefreshed')); }); }
}

window.addEventListener('languageChanged', () => {
    applyTranslations();
    startSidebarClock(); // Update date locale
    renderAll();
    if (window.appDock) {
        window.appDock.updateLabels(t);
    }
});

function initializeDock() {
    const items = [
        { icon: '<i class="fas fa-th-large"></i>', label: t('nav.dashboard'), translationKey: 'nav.dashboard', page: 'dashboard', onClick: () => navigateTo('dashboard') },
        { icon: '<i class="fas fa-users"></i>', label: t('nav.family'), translationKey: 'nav.family', page: 'family', onClick: () => navigateTo('family') },
        { icon: '<i class="fas fa-history"></i>', label: t('nav.history'), translationKey: 'nav.history', page: 'history', onClick: () => navigateTo('history') },
        { icon: '<i class="fas fa-chart-line"></i>', label: t('nav.statistics'), translationKey: 'nav.statistics', page: 'statistics', onClick: () => navigateTo('statistics') },
        { icon: '<i class="fas fa-cog"></i>', label: t('nav.settings'), translationKey: 'nav.settings', page: 'settings', onClick: () => navigateTo('settings') }
    ];
    window.appDock = new Dock({
        items: items,
        panelHeight: 62,
        baseItemSize: 45,
        magnification: 62,
        distance: 180
    });
    // Set initial active state
    updateActiveNav(appState.currentPage || 'dashboard');
}

function exportJSON() { const data = JSON.stringify(appState.records, null, 2); const blob = new Blob([data], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `askar_prayer_backup_${appState.currentDate}.json`; a.click(); }
function exportCSV() { const filtered = getFilteredHistory(); let csv = 'Date,Member,Prayer,Status,Time\n'; filtered.forEach(r => { csv += `${r.date},${r.member},${r.prayer},${r.status},${r.time}\n`; }); const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `askar_prayer_history_${appState.currentDate}.csv`; a.click(); }
function importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            appState.records = { ...appState.records, ...imported };
            saveToStorage();
            renderAll();
            showToast(t('messages.restored'));
            
            // Batch import to Google Sheet if configured
            if (appState.settings.sheetUrl) {
                const flatRecords = convertNestedRecordsToFlat(appState.records);
                updateSyncStatus('syncing');
                await importRecordsToCloud(flatRecords);
                updateSyncStatus('success');
            }
        } catch (err) {
            showToast(t('messages.invalidBackup'), "danger");
        }
    };
    reader.readAsText(file);
}

// =============================================================================
// GOOGLE SHEETS SHARED BACKEND
// All prayer data flows through these functions.
// localStorage is only a UI-state cache, never the source of truth for records.
// =============================================================================

/**
 * runHealthCheck() — GETs the Apps Script URL to verify connection.
 * Returns true if connected, false otherwise.
 */
async function runHealthCheck() {
    const sheetUrl = appState.settings.sheetUrl;
    if (!sheetUrl) {
        console.warn("[HEALTH] No API URL configured.");
        updateSyncStatus('disconnected');
        return false;
    }
    console.log("[HEALTH] Running health check...");
    updateSyncStatus('syncing');
    try {
        const response = await fetch(sheetUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        if (result.status === 'success') {
            console.log("[HEALTH] Health check PASSED. Records count:", Array.isArray(result.data) ? result.data.length : 'unknown');
            updateSyncStatus('success');
            return true;
        } else {
            throw new Error(result.message || 'Unknown error from Apps Script');
        }
    } catch (err) {
        console.error("[HEALTH] Health check FAILED:", err.message);
        updateSyncStatus('error');
        showToast('❌ Cannot reach Google Sheets API. Check your URL and deployment settings.', 'danger');
        return false;
    }
}

/**
 * fetchSharedRecords(shouldRender) — The main data loader.
 * Always fetches from Google Sheets (never from localStorage).
 * @param {boolean} shouldRender - If true, calls renderAll() after loading.
 */
async function fetchSharedRecords(shouldRender = false) {
    const sheetUrl = appState.settings.sheetUrl;

    if (!sheetUrl) {
        console.warn("[FETCH] No API URL. Backend not connected. Records will be empty.");
        updateSyncStatus('disconnected');
        appState.records = {}; // Do NOT load from localStorage — make it obvious backend is needed
        if (shouldRender) renderAll();
        return;
    }

    console.log("[FETCH] Fetching shared records from Google Sheets...");
    updateSyncStatus('syncing');

    try {
        const response = await fetch(sheetUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();

        if (result.status === 'success' && Array.isArray(result.data)) {
            appState.records = parseRecordsFromSheet(result.data);
            // Save a cache copy for diagnostic purposes (not used as source of truth)
            try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(appState.records)); } catch(e) {}
            console.log(`[FETCH] Shared records loaded. Total rows: ${result.data.length}, Dates: ${Object.keys(appState.records).length}`);

            appState.lastSync = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            updateSyncStatus('success');
            if (shouldRender) renderAll();
        } else {
            throw new Error(result.message || 'Unexpected response from Apps Script');
        }
    } catch (err) {
        console.error("[FETCH] Failed to load shared records:", err.message);
        updateSyncStatus('error');
        // Do NOT fall back to localStorage — that would give false impression of shared data.
        // Keep appState.records as-is (empty on first load, or last known from previous fetch).
        showToast('⚠️ ' + (t('settings.syncError') || 'Could not load shared records. Check your Google Sheets API URL.'), 'danger');
        if (shouldRender) renderAll();
    }
}

/**
 * saveSharedPrayerRecord() — Saves or deletes a single prayer record in Google Sheets.
 * Uses action: 'save' (upsert by id) or action: 'delete'.
 * Duplicate prevention: Apps Script uses the composite id (date_member_prayer) to update-or-insert.
 */
async function saveSharedPrayerRecord(date, member, prayer, record, action = 'save') {
    const sheetUrl = appState.settings.sheetUrl;
    if (!sheetUrl) {
        console.error("[SAVE] No API URL. Cannot save to Google Sheets.");
        return false;
    }

    const id = `${date}_${member}_${prayer}`;
    console.log(`[SAVE] Action: ${action}, ID: ${id}`);

    const payload = {
        action: action,
        passcode: appState.settings.sheetPasscode,
        id: id
    };

    if (action === 'save') {
        payload.record = {
            id: id,
            date: date,
            member: member,
            prayer: prayer,
            status: record.status,
            markedTime: record.time,
            timestamp: record.timestamp,
            onTime: record.status === 'On time' ? 'Yes' : 'No',
            note: record.note || "",
            updatedAt: new Date().toISOString()
        };
    }

    try {
        const response = await fetch(sheetUrl, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.status === 'success') {
            console.log(`[SAVE] Success. Server message: ${result.message}`);
            return true;
        } else {
            console.error(`[SAVE] Server returned error: ${result.message}`);
            return false;
        }
    } catch (err) {
        console.error("[SAVE] Network or parse error:", err.message);
        return false;
    }
}

async function refreshSharedRecords() {
    await fetchSharedRecords(true); // shouldRender = true
}

function getTodayRecordsFromSharedState(member) {
    return (appState.records[appState.currentDate] || {})[member] || {};
}

function parseRecordsFromSheet(dataArray) {
    const records = {};
    if (!Array.isArray(dataArray)) return records;
    
    dataArray.forEach(row => {
        const d = row.date;
        const m = row.member;
        const p = row.prayer;
        
        if (!d || !m || !p) return;
        
        if (!records[d]) records[d] = {};
        if (!records[d][m]) records[d][m] = {};
        
        records[d][m][p] = {
            status: row.status || 'On time',
            time: row.markedTime || row.time || '',
            timestamp: Number(row.timestamp) || Date.now(),
            note: row.note || ''
        };
    });
    return records;
}

function updateSyncStatus(status) {
    const desktopStatusText = document.getElementById('desktop-sync-text');
    const desktopSyncIcon = document.getElementById('desktop-sync-icon');
    const desktopIndicator = document.getElementById('desktop-sync-indicator');
    
    const mobileSyncIcon = document.getElementById('mobile-sync-icon');
    const mobileIndicator = document.getElementById('mobile-refresh-btn');
    
    const settingsBadge = document.getElementById('sync-status-badge');
    const syncLastRow = document.getElementById('sync-last-time-row');
    const syncLastTime = document.getElementById('sync-last-time');
    
    if (appState.settings.sheetUrl) {
        if (desktopIndicator) desktopIndicator.style.display = 'flex';
        if (mobileIndicator) mobileIndicator.style.display = 'flex';
        if (syncLastRow) syncLastRow.style.display = 'flex';
        if (syncLastTime) syncLastTime.textContent = appState.lastSync || '-';
    } else {
        if (desktopIndicator) desktopIndicator.style.display = 'none';
        if (mobileIndicator) mobileIndicator.style.display = 'none';
        if (syncLastRow) syncLastRow.style.display = 'none';
        if (settingsBadge) {
            settingsBadge.className = 'badge';
            settingsBadge.textContent = t('settings.statusDisconnected') || 'Disconnected';
            settingsBadge.setAttribute('data-i18n', 'settings.statusDisconnected');
        }
        return;
    }
    
    if (status === 'syncing') {
        if (desktopStatusText) {
            desktopStatusText.textContent = t('settings.statusSyncing') || 'Syncing...';
            desktopStatusText.setAttribute('data-i18n', 'settings.statusSyncing');
        }
        if (desktopSyncIcon) {
            desktopSyncIcon.className = 'fas fa-sync-alt fa-spin-custom';
            desktopSyncIcon.style.color = 'var(--text-secondary)';
        }
        if (mobileSyncIcon) {
            mobileSyncIcon.className = 'fas fa-sync-alt fa-spin-custom';
            mobileSyncIcon.style.color = '';
        }
        
        if (settingsBadge) {
            settingsBadge.className = 'badge badge-warning';
            settingsBadge.textContent = t('settings.statusSyncing') || 'Syncing...';
            settingsBadge.setAttribute('data-i18n', 'settings.statusSyncing');
        }
    } else if (status === 'success') {
        if (desktopStatusText) {
            desktopStatusText.textContent = t('settings.statusConnected') || 'Connected';
            desktopStatusText.setAttribute('data-i18n', 'settings.statusConnected');
        }
        if (desktopSyncIcon) {
            desktopSyncIcon.className = 'fas fa-check-circle';
            desktopSyncIcon.style.color = '#2e7d32'; // emerald green
        }
        if (mobileSyncIcon) {
            mobileSyncIcon.className = 'fas fa-check-circle';
            mobileSyncIcon.style.color = '';
        }
        
        if (settingsBadge) {
            settingsBadge.className = 'badge badge-success';
            settingsBadge.textContent = t('settings.statusConnected') || 'Connected';
            settingsBadge.setAttribute('data-i18n', 'settings.statusConnected');
        }
    } else if (status === 'error') {
        if (desktopStatusText) {
            desktopStatusText.textContent = t('settings.statusError') || 'Sync Error';
            desktopStatusText.setAttribute('data-i18n', 'settings.statusError');
        }
        if (desktopSyncIcon) {
            desktopSyncIcon.className = 'fas fa-exclamation-triangle';
            desktopSyncIcon.style.color = '#d32f2f'; // danger/red
        }
        if (mobileSyncIcon) {
            mobileSyncIcon.className = 'fas fa-exclamation-triangle';
            mobileSyncIcon.style.color = '';
        }
        
        if (settingsBadge) {
            settingsBadge.className = 'badge badge-danger';
            settingsBadge.textContent = t('settings.statusError') || 'Sync Error';
            settingsBadge.setAttribute('data-i18n', 'settings.statusError');
        }
    }
}

async function resetCloudDatabase() {
    if (!appState.settings.sheetUrl) return;
    
    const payload = {
        action: "reset",
        passcode: appState.settings.sheetPasscode
    };
    
    try {
        const response = await fetch(appState.settings.sheetUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        if (result.status !== 'success') {
            throw new Error(result.message || 'Reset failed');
        }
        console.log("Cloud database reset successful");
    } catch (err) {
        console.error("Cloud database reset failed:", err);
        showToast(t('settings.syncError') || 'Error syncing with cloud database', 'danger');
    }
}

function convertNestedRecordsToFlat(recordsObj) {
    const flat = [];
    Object.keys(recordsObj).forEach(date => {
        Object.keys(recordsObj[date]).forEach(member => {
            Object.keys(recordsObj[date][member]).forEach(prayer => {
                const record = recordsObj[date][member][prayer];
                const id = `${date}_${member}_${prayer}`;
                flat.push({
                    id: id,
                    date: date,
                    member: member,
                    prayer: prayer,
                    status: record.status || "On time",
                    markedTime: record.time || "",
                    timestamp: record.timestamp || Date.now(),
                    onTime: record.status === 'On time' ? 'Yes' : 'No',
                    note: record.note || "",
                    updatedAt: new Date().toISOString()
                });
            });
        });
    });
    return flat;
}

async function importRecordsToCloud(flatRecords) {
    if (!appState.settings.sheetUrl) return;
    
    const payload = {
        action: "import",
        passcode: appState.settings.sheetPasscode,
        records: flatRecords
    };
    
    try {
        const response = await fetch(appState.settings.sheetUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        if (result.status !== 'success') {
            throw new Error(result.message || 'Import failed');
        }
        console.log("Cloud database import successful, count:", result.count);
    } catch (err) {
        console.error("Cloud database import failed:", err);
        showToast(t('settings.syncError') || 'Error syncing with cloud database', 'danger');
    }
}
