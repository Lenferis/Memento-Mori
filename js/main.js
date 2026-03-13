// Default settings
const DEFAULT_BIRTHDAY = '2007-12-31';
const DEFAULT_LIFESPAN = 72;
const DEFAULT_LANG     = 'en';


// LocalStorage
let birthday = localStorage.getItem('mm_birthday') || DEFAULT_BIRTHDAY;
let lifespan = parseInt(localStorage.getItem('mm_lifespan')) || DEFAULT_LIFESPAN;
let lang     = localStorage.getItem('mm_lang')     || DEFAULT_LANG;

// Get ElementById
function get(id) {
    return document.getElementById(id);
}

// Calculate
function calculate() {
    const now   = new Date();
    const birth = parseDate(birthday);
    const death = new Date(birth.getFullYear() + lifespan, birth.getMonth(), birth.getDate());

    const livedDays     = daysBetween(birth, now);
    const totalDays     = daysBetween(birth, death);
    const remainingDays = totalDays - livedDays;
    const percent       = livedDays / totalDays * 100;

    // Number of years lived and remaining (with one decimal place)
    const livedYears     = (livedDays / 365).toFixed(1);
    const remainingYears = (remainingDays / 365).toFixed(1);

    // Weeks
    const livedWeeks = Math.floor(livedDays / 7);
    const totalWeeks = lifespan * 52;

    // Exact age (years + months)
    let ageYears  = now.getFullYear() - birth.getFullYear();
    let ageMonths = now.getMonth() - birth.getMonth();
    if (ageMonths < 0 || (ageMonths === 0 && now.getDate() < birth.getDate())) {
        ageYears--;
        ageMonths += 12;
    }
    if (now.getDate() < birth.getDate()) ageMonths--;
    if (ageMonths < 0) ageMonths += 12;

    // Nest HB
    const nextBD = new Date(birth.getFullYear(), birth.getMonth(), birth.getDate());
    nextBD.setFullYear(now.getFullYear());
    if (nextBD <= now) nextBD.setFullYear(now.getFullYear() + 1);
    const daysUntilBirthday = daysBetween(now, nextBD);

    // Progress of the year
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear   = daysBetween(startOfYear, now) + 1;
    const yr          = now.getFullYear();
    const daysInYear  = (yr % 4 === 0 && (yr % 100 !== 0 || yr % 400 === 0)) ? 366 : 365;
    const yearPercent = dayOfYear / daysInYear * 100;

    // Weekly Progress (Mon=1, Sun=7)
    const dow        = now.getDay();
    const weekDay    = dow === 0 ? 7 : dow;
    const weekPercent = weekDay / 7 * 100;

    return {
        now, birth, death,
        livedDays, remainingDays, percent,
        livedYears, remainingYears,
        livedWeeks, totalWeeks,
        ageYears, ageMonths,
        daysUntilBirthday,
        dayOfYear, daysInYear, yearPercent,
        weekDay, weekPercent,
    };
}

// Render
function render() {
    const t = TRANSLATIONS[lang]; // texts for the current language
    const c = calculate();

    // --- Header ---
    get('eyebrow').textContent  = t.eyebrow;
    get('heading').innerHTML    = t.heading(c.livedYears);
    get('subhead').textContent  = t.subhead(formatNumber(c.livedDays), c.percent.toFixed(3));
    get('ageNum').textContent   = c.ageYears;
    get('ageLbl').textContent   = t.ageLbl(c.ageMonths);

    // --- Progress bar ---
    get('barFill').style.width  = Math.min(100, c.percent) + '%';
    get('barStart').textContent = c.birth.getFullYear();
    get('barPct').textContent   = c.percent.toFixed(2) + '%';
    get('barEnd').textContent   = c.death.getFullYear();

    // --- Stats grid ---
    const statsGrid = get('statsGrid');
    statsGrid.innerHTML = '';
    const mainStats = [
        { val: formatNumber(c.livedDays),                        lbl: t.statLabels[0] },
        { val: formatNumber(c.remainingDays),                    lbl: t.statLabels[1] },
        { val: formatNumber(c.livedWeeks),                       lbl: t.statLabels[2] },
        { val: formatNumber(Math.floor(c.remainingDays / 7)),    lbl: t.statLabels[3] },
    ];
    mainStats.forEach(s => {
        statsGrid.innerHTML += `
            <div class="stat-cell">
                <div class="stat-val">${s.val}</div>
                <div class="stat-lbl">${s.lbl}</div>
            </div>`;
    });

    // --- Secondary grid ---
    const secGrid = get('secondaryGrid');
    secGrid.innerHTML = '';
    const secStats = [
        { val: c.livedYears,           lbl: t.secLabels[0] },
        { val: c.remainingYears,       lbl: t.secLabels[1] },
        { val: c.daysUntilBirthday,    lbl: t.secLabels[2] },
    ];
    secStats.forEach(s => {
        secGrid.innerHTML += `
            <div class="sec-cell">
                <div class="sec-val">${s.val}</div>
                <div class="sec-lbl">${s.lbl}</div>
            </div>`;
    });

    // --- Progress year / weeks ---
    get('ctxYearLabel').textContent = t.ctxYearLabel;
    get('ctxWeekLabel').textContent = t.ctxWeekLabel;
    get('yearFill').style.width     = Math.min(100, c.yearPercent) + '%';
    get('weekFill').style.width     = Math.min(100, c.weekPercent) + '%';
    get('yearVal').textContent      = t.yearVal(c.dayOfYear, c.daysInYear, c.yearPercent.toFixed(1));
    get('weekVal').textContent      = t.weekVal(c.weekDay, c.weekPercent.toFixed(1));

    // --- Grid dot ---
    renderDots(c.livedWeeks, c.totalWeeks);
    get('weeksLabel').textContent = t.weeksLabel;
    get('weeksCount').textContent = `${formatNumber(c.livedWeeks)} / ${formatNumber(c.totalWeeks)}`;

    // --- Legend ---
    get('legendLived').textContent   = t.legendLived;
    get('legendCurrent').textContent = t.legendCurrent;
    get('legendFuture').textContent  = t.legendFuture;

    // ---Footer ---
    get('footerDates').textContent   = `${formatDate(c.birth)} → +${lifespan} ${t.years} → ${formatDate(c.death)}`;
    get('footerUpdated').textContent = t.updated(`${formatTime(c.now)} · ${formatDate(c.now)}`);

    // --- Button lang ---
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // --- Text modal ---
    get('modalTitle').textContent    = t.modalTitle;
    get('labelBirthday').textContent = t.labelBirthday;
    get('labelLifespan').textContent = t.labelLifespan;
    get('lifespanUnit').textContent  = t.years;
    get('btnCancel').textContent     = t.cancel;
    get('btnSave').textContent       = t.save;
}

// Grid dot
// Dot are created once, then only classes and tooltips are changed
let builtForLifespan = 0;

function renderDots(livedWeeks, totalWeeks) {
    const grid = get('weeksGrid');
    const t    = TRANSLATIONS[lang];

    // We only recreate points if the lifespan changes.
    if (builtForLifespan !== totalWeeks) {
        grid.innerHTML = '';
        for (let i = 0; i < totalWeeks; i++) {
            const dot = document.createElement('div');
            dot.className = 'life-dot';
            grid.appendChild(dot);
        }
        builtForLifespan = totalWeeks;
    }

    // Updating each point: class + tooltip
    const dots = grid.children;
    for (let i = 0; i < dots.length; i++) {
        const isCurrent = i === livedWeeks - 1;

        if (i < livedWeeks - 1)  dots[i].className = 'life-dot lived';
        else if (isCurrent)       dots[i].className = 'life-dot current';
        else                      dots[i].className = 'life-dot future';

        dots[i].dataset.tip = isCurrent ? t.dotTipCurrent : t.dotTipWeek(i + 1);
    }
}

// Modal
function openModal() {
    get('inputBirthday').value = birthday;
    get('inputLifespan').value = lifespan;
    get('lifespanRange').value = lifespan;
    get('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    get('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

function saveSettings() {
    const newBirthday = get('inputBirthday').value;
    const newLifespan = parseInt(get('inputLifespan').value);

    if (!newBirthday || isNaN(newLifespan) || newLifespan < 1 || newLifespan > 150) return;

    // If the duration has changed, the points need to be recreated.
    if (newLifespan !== lifespan) builtForLifespan = 0;

    birthday = newBirthday;
    lifespan = newLifespan;

    localStorage.setItem('mm_birthday', birthday);
    localStorage.setItem('mm_lifespan', String(lifespan));

    closeModal();
    render();
}

// Start
document.addEventListener('DOMContentLoaded', function () {

    render();

    // Button settings
    get('settingsBtn').addEventListener('click', openModal);
    get('modalClose').addEventListener('click', closeModal);
    get('btnCancel').addEventListener('click', closeModal);
    get('btnSave').addEventListener('click', saveSettings);

    // Close modal
    get('modalOverlay').addEventListener('click', function (e) {
        if (e.target === get('modalOverlay')) closeModal();
    });

    // Close modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });

    // Sync
    get('lifespanRange').addEventListener('input', function (e) {
        get('inputLifespan').value = e.target.value;
    });
    get('inputLifespan').addEventListener('input', function (e) {
        const val = Math.min(120, Math.max(40, parseInt(e.target.value) || 72));
        get('lifespanRange').value = val;
    });

    // Lang Switxher
    get('langSwitcher').addEventListener('click', function (e) {
        const btn = e.target.closest('.lang-btn');
        if (!btn) return;
        if (btn.dataset.lang === lang) return;
        lang = btn.dataset.lang;
        localStorage.setItem('mm_lang', lang);
        render();
    });

    // Update 
    setInterval(function () {
        const t = TRANSLATIONS[lang];
        const now = new Date();
        get('footerUpdated').textContent = t.updated(`${formatTime(now)} · ${formatDate(now)}`);
    }, 60000);
});

// func

function daysBetween(a, b) {
    return Math.floor((b - a) / 86400000);
}

function parseDate(str) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function formatNumber(n) {
    return n.toLocaleString(lang === 'ru' ? 'ru-RU' : lang === 'ua' ? 'uk-UA' : 'en-US');
}

function formatDate(date) {
    const locale = lang === 'ru' ? 'ru-RU' : lang === 'ua' ? 'uk-UA' : 'en-GB';
    return date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTime(date) {
    const locale = lang === 'ru' ? 'ru-RU' : lang === 'ua' ? 'uk-UA' : 'en-US';
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}