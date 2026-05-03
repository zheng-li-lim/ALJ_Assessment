// app.js — Main application: state, rendering, filtering, quality checks

import {
  SEED_EDITION, EDITION_PREV, SEED_VERSION,
  AREA_COLORS, ACTION_COLORS, ACTION_DEFINITIONS, ACTION_TYPES,
  GEOGRAPHIES, AREAS_OF_INTEREST,
} from './data.js';
import { factCheckItem } from './agent-factcheck.js';
import { csoReviewItem }  from './agent-cso.js';
import {
  SALES_YEARS, BRANDS, NAMED_BRANDS, BRAND_COLORS, BRAND_SALES,
  MARKET_TOTAL, COUNTRY_SALES, BEV_2025, COUNTRY_COLORS, COUNTRIES,
} from './sales-data.js';

// ─── State ────────────────────────────────────────────────────────────────────

const state = {
  currentTab:      'intelligence',
  currentEdition:  null,
  pastEditions:    [],
  filters:         { geographies: [], areas: [], actions: [] },
  geoDropdownOpen: false,
};

function normaliseItem(item) {
  return {
    ...item,
    areasOfInterest: Array.isArray(item.areasOfInterest) ? item.areasOfInterest
      : item.areaOfInterest ? [item.areaOfInterest] : ['Other Interesting News'],
    geographies: Array.isArray(item.geographies) ? item.geographies
      : item.geography ? [item.geography] : ['Global'],
  };
}

function normaliseEdition(edition) {
  return edition ? { ...edition, items: (edition.items || []).map(normaliseItem) } : edition;
}

// ─── Storage ──────────────────────────────────────────────────────────────────

function loadFromStorage() {
  try {
    // Version check: if seed data has changed, replace stored seed editions
    const storedVersion = parseInt(localStorage.getItem('abc_seed_v') || '0', 10);
    if (storedVersion !== SEED_VERSION) {
      localStorage.removeItem('abc_editions');
      localStorage.setItem('abc_seed_v', String(SEED_VERSION));
    }

    const editions = JSON.parse(localStorage.getItem('abc_editions') || '[]');
    state.pastEditions = editions.map(normaliseEdition);

    if (state.pastEditions.length > 0) {
      state.currentEdition = state.pastEditions[0];
    } else {
      state.pastEditions  = [normaliseEdition(SEED_EDITION), normaliseEdition(EDITION_PREV)];
      state.currentEdition = state.pastEditions[0];
      localStorage.setItem('abc_editions', JSON.stringify(state.pastEditions));
    }
  } catch {
    state.currentEdition = normaliseEdition(SEED_EDITION);
  }
}

function saveEdition(edition) {
  const existing = state.pastEditions.filter(e => e.id !== edition.id);
  state.pastEditions = [edition, ...existing].slice(0, 7);
  localStorage.setItem('abc_editions', JSON.stringify(state.pastEditions));
}

// ─── Filtering ────────────────────────────────────────────────────────────────

function getFilteredItems() {
  if (!state.currentEdition) return [];
  const { geographies, areas, actions } = state.filters;
  return state.currentEdition.items.filter(item => {
    const geoMatch    = geographies.length === 0 || item.geographies.some(g => geographies.includes(g));
    const areaMatch   = areas.length === 0       || item.areasOfInterest.some(a => areas.includes(a));
    const actionMatch = actions.length === 0     || actions.includes(item.actionType);
    return geoMatch && areaMatch && actionMatch;
  });
}

function hasActiveFilters() {
  return state.filters.geographies.length > 0 || state.filters.areas.length > 0 || state.filters.actions.length > 0;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function relevanceDots(score) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="relevance-dot ${i < score ? 'filled' : ''}"></span>`
  ).join('');
}

// ─── Card Renderer ────────────────────────────────────────────────────────────

function renderCard(item) {
  const actionColor   = ACTION_COLORS[item.actionType] || '#5b6770';
  const actionDef     = ACTION_DEFINITIONS[item.actionType] || '';
  const isCsoRemoved  = item.csoReview?.verdict === 'Remove';
  const isCsoRevise   = item.csoReview?.verdict === 'Revise';
  const isFactFlagged = item.factCheck?.flag === true;

  let extraClass = '';
  if (isCsoRemoved)  extraClass += ' card-cso-remove';
  if (isCsoRevise)   extraClass += ' card-cso-revise';
  if (isFactFlagged) extraClass += ' card-fact-flagged';

  const areaTags = item.areasOfInterest.map(area => {
    const c = AREA_COLORS[area] || '#5b6770';
    return `<span class="tag tag-area" style="background:${c}">${escHtml(area)}</span>`;
  }).join('');

  const geoTags = item.geographies.map(geo =>
    `<span class="tag tag-geo">${escHtml(geo)}</span>`
  ).join('');

  return `
<article class="news-card${extraClass}" id="${escHtml(item.id)}">
  ${isFactFlagged ? `<div class="card-flag fact-flag"><span>⚠</span> ${escHtml(item.factCheck.note)}</div>` : ''}
  ${isCsoRevise   ? `<div class="card-flag cso-flag"><span>★</span> CSO review: ${escHtml(item.csoReview.reason)}</div>` : ''}
  ${isCsoRemoved  ? `<div class="card-flag cso-remove-flag"><span>✕</span> CSO review: ${escHtml(item.csoReview.reason)} <button class="btn-restore" data-id="${escHtml(item.id)}">Restore</button></div>` : ''}

  <div class="card-tags">${areaTags}${geoTags}</div>

  <h2 class="card-headline">${escHtml(item.headline)}</h2>

  <div class="card-meta">
    <a href="${escHtml(item.sourceUrl)}" target="_blank" rel="noopener" class="card-source">${escHtml(item.source)}</a>
    <span class="card-date">${escHtml(item.publishedAt)}</span>
  </div>

  <p class="card-summary">${escHtml(item.summary)}</p>

  <div class="card-footer">
    <div class="card-relevance" title="Relevance ${item.relevance}/5">${relevanceDots(item.relevance)}</div>
    <span class="badge-action has-tooltip" style="background:${actionColor}" data-tooltip="${escHtml(actionDef)}">${escHtml(item.actionType)}</span>
  </div>

  <div class="card-so-what">
    <p class="so-what-label">So What for ABC</p>
    <p class="so-what-text">${escHtml(item.soWhat)}</p>
  </div>
</article>`;
}

// ─── Highlights ───────────────────────────────────────────────────────────────

const MIDDLE_EAST_GEOS = new Set(['Saudi Arabia','UAE','GCC','Turkey','Egypt']);
const EUROPE_GEOS      = new Set(['United Kingdom','Germany','France','Italy','Spain','Poland','Pan-Europe']);

function itemRegion(item) {
  if (item.geographies.some(g => MIDDLE_EAST_GEOS.has(g))) return 'Middle East';
  if (item.geographies.some(g => EUROPE_GEOS.has(g)))      return 'Europe';
  return 'Global';
}

function renderHighlights(items) {
  const sections = { 'Middle East': [], Europe: [], Global: [] };
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    sections[itemRegion(item)].push(item);
  }
  return ['Middle East', 'Europe', 'Global']
    .filter(r => sections[r].length > 0)
    .map(region => {
      const rows = sections[region].map(item => {
        const tags = item.areasOfInterest.map(a =>
          `<span class="hl-tag" style="background:${AREA_COLORS[a] || '#5b6770'}">${escHtml(a)}</span>`
        ).join('');
        return `<li class="hl-row">
          <a href="#${escHtml(item.id)}" class="highlight-link">${escHtml(item.headline)}</a>
          <div class="hl-tags">${tags}</div>
        </li>`;
      }).join('');
      return `<div class="highlight-group">
  <h3 class="highlight-region">${escHtml(region)}</h3>
  <ul class="highlight-links">${rows}</ul>
</div>`;
    }).join('');
}

function renderKeyActions(items) {
  const escalate = items.filter(i => i.actionType === 'Act & Escalate');
  if (escalate.length === 0) return '';
  const bullets = escalate
    .map(i => `<li class="ka-escalate">${escHtml(i.actionText)}</li>`)
    .join('');
  return `<p class="ka-label">Key actions</p><ul class="ka-list">${bullets}</ul>`;
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

function renderFilters() {
  const geoDropdown = document.getElementById('geo-dropdown');
  const geoLabel    = document.getElementById('geo-select-label');
  const clearBtn    = document.getElementById('btn-clear-filters');

  if (geoDropdown) {
    const GEO_GROUPS = [
      { label: 'Middle East', markets: ['Saudi Arabia','UAE','GCC','Turkey','Egypt'] },
      { label: 'Europe',      markets: ['United Kingdom','Germany','France','Italy','Spain','Poland','Pan-Europe'] },
    ];

    const groupsHtml = GEO_GROUPS.map(group => {
      const checked     = group.markets.filter(m => state.filters.geographies.includes(m));
      const allChecked  = checked.length === group.markets.length;
      const someChecked = checked.length > 0 && !allChecked;
      const marketsHtml = group.markets.map(market => `
        <label class="geo-option geo-market">
          <input type="checkbox" class="geo-checkbox geo-market-cb" value="${escHtml(market)}" ${state.filters.geographies.includes(market) ? 'checked' : ''}>
          <span>${escHtml(market)}</span>
        </label>`).join('');
      return `<div class="geo-group">
        <label class="geo-option geo-region-header">
          <input type="checkbox" class="geo-checkbox geo-region-cb" data-region="${escHtml(group.label)}" ${allChecked ? 'checked' : ''} ${someChecked ? 'data-indet="1"' : ''}>
          <span>${escHtml(group.label)}</span>
        </label>
        <div class="geo-markets">${marketsHtml}</div>
      </div>`;
    }).join('');

    geoDropdown.innerHTML = groupsHtml;
    geoDropdown.querySelectorAll('.geo-region-cb[data-indet="1"]').forEach(cb => { cb.indeterminate = true; });

    geoDropdown.querySelectorAll('.geo-region-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const group = GEO_GROUPS.find(g => g.label === cb.dataset.region);
        if (!group) return;
        const geoSet = new Set(state.filters.geographies);
        group.markets.forEach(m => cb.checked ? geoSet.add(m) : geoSet.delete(m));
        state.filters.geographies = [...geoSet];
        renderFilters();
        renderIntelligence();
      });
    });

    geoDropdown.querySelectorAll('.geo-market-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const geoSet = new Set(state.filters.geographies);
        cb.checked ? geoSet.add(cb.value) : geoSet.delete(cb.value);
        state.filters.geographies = [...geoSet];
        renderFilters();
        renderIntelligence();
      });
    });
  }

  if (geoLabel) {
    const count = state.filters.geographies.length;
    geoLabel.textContent = count === 0 ? 'All markets' : `${count} market${count !== 1 ? 's' : ''}`;
  }

  const pillsContainer = document.getElementById('area-pills');
  if (pillsContainer) {
    pillsContainer.innerHTML = AREAS_OF_INTEREST.map(area => {
      const color  = AREA_COLORS[area];
      const active = state.filters.areas.includes(area);
      return `<button class="area-pill ${active ? 'active' : ''}" data-area="${escHtml(area)}"
        style="${active ? `background:${color};border-color:${color};color:#fff` : `border-color:${color};color:${color}`}"
      >${escHtml(area)}</button>`;
    }).join('');
    pillsContainer.querySelectorAll('.area-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const area = btn.dataset.area;
        state.filters.areas = state.filters.areas.includes(area)
          ? state.filters.areas.filter(a => a !== area)
          : [...state.filters.areas, area];
        renderFilters();
        renderIntelligence();
      });
    });
  }

  const actionPills = document.getElementById('action-pills');
  if (actionPills) {
    actionPills.innerHTML = ACTION_TYPES.map(action => {
      const color  = ACTION_COLORS[action];
      const active = state.filters.actions.includes(action);
      return `<button class="area-pill action-pill ${active ? 'active' : ''}" data-action="${escHtml(action)}"
        title="${escHtml(ACTION_DEFINITIONS[action] || '')}"
        style="${active ? `background:${color};border-color:${color};color:#fff` : `border-color:${color};color:${color}`}"
      >${escHtml(action)}</button>`;
    }).join('');
    actionPills.querySelectorAll('.action-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        state.filters.actions = state.filters.actions.includes(action)
          ? state.filters.actions.filter(a => a !== action)
          : [...state.filters.actions, action];
        renderFilters();
        renderIntelligence();
      });
    });
  }

  if (clearBtn) clearBtn.classList.toggle('hidden', !hasActiveFilters());
}

// ─── Intelligence Tab ─────────────────────────────────────────────────────────

function renderIntelligence() {
  if (!state.currentEdition) return;
  const edition  = state.currentEdition;
  const filtered = getFilteredItems();

  const titleEl = document.getElementById('edition-title');
  if (titleEl) titleEl.textContent = `ABC Mobility Intelligence — ${edition.dateRange}`;

  const dateEl = document.getElementById('edition-date');
  if (dateEl) dateEl.textContent = new Date(edition.publishedAt).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const summaryEl = document.getElementById('executive-summary');
  if (summaryEl) {
    const parts = edition.executiveSummary.split('. ').filter(s => s.trim().length > 0);
    const bulletHtml = parts.length > 1
      ? `<ul class="exec-summary-list">${parts.map(s => `<li>${escHtml(s.endsWith('.') ? s : s + '.')}</li>`).join('')}</ul>`
      : `<p>${escHtml(edition.executiveSummary)}</p>`;
    summaryEl.innerHTML = `${bulletHtml}${renderKeyActions(filtered)}
     <p class="ai-disclaimer">AI-generated briefing for strategic orientation only. All recommendations are indicative and require detailed fact-checking and analysis before any action is taken.</p>`;
  }

  const filterStatus = document.getElementById('filter-status');
  if (filterStatus) {
    if (hasActiveFilters()) {
      const labels = [...state.filters.geographies, ...state.filters.areas, ...state.filters.actions].join(' · ');
      filterStatus.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${edition.items.length}</strong> items &middot; ${escHtml(labels)}`;
      filterStatus.classList.remove('hidden');
    } else {
      filterStatus.classList.add('hidden');
    }
  }

  const sourceStatus = document.getElementById('source-status');
  if (sourceStatus) sourceStatus.textContent = `${edition.sourcesFetched} of ${edition.sourcesTotal} sources fetched`;

  const highlightsEl = document.getElementById('highlights-list');
  if (highlightsEl) highlightsEl.innerHTML = renderHighlights(filtered);

  const cardsEl = document.getElementById('cards-container');
  if (cardsEl) {
    if (filtered.length === 0) {
      cardsEl.innerHTML = `<div class="empty-state"><p>No items match the active filters.</p><button onclick="clearFilters()">Clear filters</button></div>`;
    } else {
      cardsEl.innerHTML = filtered.map(renderCard).join('');
      attachCardHandlers();
    }
  }

  renderSidebar();
}

function attachCardHandlers() {
  document.querySelectorAll('.btn-restore').forEach(btn => {
    btn.addEventListener('click', () => {
      const id   = btn.dataset.id;
      const item = state.currentEdition?.items.find(i => i.id === id);
      if (item) { item.csoReview = { verdict: 'Keep', reason: 'Restored by editor' }; renderIntelligence(); }
    });
  });
}

function editionQualityStatus(edition) {
  const items  = edition.items || [];
  const hasFC  = items.every(i => i.factCheck  != null);
  const hasCSO = items.every(i => i.csoReview  != null);
  if (hasFC && hasCSO) return 'checked';
  if (hasFC || hasCSO) return 'partial';
  return 'none';
}

function renderEditionEntry(edition, currentId, container) {
  const isActive = edition.id === currentId;
  const qDot = {
    checked: `<span class="eq-dot eq-done"    title="Fact check + CSO review complete">✓</span>`,
    partial: `<span class="eq-dot eq-partial" title="Quality checks partially run">◑</span>`,
    none:    `<span class="eq-dot eq-none"    title="Quality checks not yet run">○</span>`,
  }[editionQualityStatus(edition)];

  const wrap = document.createElement('div');
  wrap.className = 'edition-entry-wrap';
  wrap.innerHTML = `
<button class="edition-entry ${isActive ? 'active' : ''}" data-id="${escHtml(edition.id)}">
  <span class="edition-entry-left">
    ${qDot}
    <span class="edition-entry-date">${escHtml(edition.dateRange)}</span>
  </span>
  <span class="edition-entry-count">${edition.items.length} items</span>
</button>`;
  container.appendChild(wrap);

  wrap.querySelector('.edition-entry').addEventListener('click', () => {
    state.currentEdition = edition;
    state.filters = { geographies: [], areas: [], actions: [] };
    renderFilters();
    renderIntelligence();
    renderSidebar();
  });
}

function renderSidebar() {
  const listEl    = document.getElementById('editions-list');
  if (!listEl) return;
  const currentId = state.currentEdition?.id;
  if (state.pastEditions.length === 0) {
    listEl.innerHTML = `<p class="sidebar-empty">No editions loaded.</p>`;
    return;
  }
  listEl.innerHTML = '';
  state.pastEditions.forEach(e => renderEditionEntry(e, currentId, listEl));
}

// ─── Quality Checks (rule-based, instant, no API) ────────────────────────────

function autoQualityChecks() {
  let changed = false;
  for (const edition of state.pastEditions) {
    for (const item of edition.items) {
      if (item.factCheck == null)  { item.factCheck  = factCheckItem(item);  changed = true; }
      if (item.csoReview == null)  { item.csoReview  = csoReviewItem(item);  changed = true; }
    }
    if (changed) saveEdition(edition);
  }
  if (changed) { renderIntelligence(); renderSidebar(); }
}

// ─── Sales Tab ────────────────────────────────────────────────────────────────

let salesChartInstance = null;
const salesState = {
  view:      'brand',
  metric:    'units',
  years:     [...SALES_YEARS],
  countries: ['All Europe'],
  brands:    [...BRANDS],
};

function renderSalesData() {
  const el = document.getElementById('sales-content');
  if (!el) return;
  const isBrand   = salesState.view === 'brand';
  const isCountry = salesState.view === 'country';
  const isBev     = salesState.view === 'bev';

  el.innerHTML = `
<div class="sales-layout">
  <aside class="sales-sidebar">
    <div class="sales-filter-group">
      <span class="sales-filter-label">View</span>
      <div class="sales-toggle-group">
        <button class="sales-toggle-btn ${isBrand   ? 'active' : ''}" data-view="brand">By Brand</button>
        <button class="sales-toggle-btn ${isCountry ? 'active' : ''}" data-view="country">By Country</button>
        <button class="sales-toggle-btn ${isBev     ? 'active' : ''}" data-view="bev">EV Penetration</button>
      </div>
    </div>
    <div class="sales-filter-group" ${isBev ? 'style="opacity:.4;pointer-events:none"' : ''}>
      <span class="sales-filter-label">Metric ${isBev ? '(n/a for EV view)' : ''}</span>
      <div class="sales-toggle-group">
        <button class="sales-metric-btn ${salesState.metric === 'units' ? 'active' : ''}" data-metric="units">Units</button>
        <button class="sales-metric-btn ${salesState.metric === 'share' ? 'active' : ''}" data-metric="share">% Share</button>
      </div>
    </div>
    <div class="sales-filter-group" ${isBev ? 'style="opacity:.4;pointer-events:none"' : ''}>
      <span class="sales-filter-label">Year ${isBev ? '(2025 only)' : ''}</span>
      <div class="sales-checklist">
        ${SALES_YEARS.map(y => `
        <label class="sales-check-item">
          <input type="checkbox" class="sales-cb year-cb" value="${y}" ${salesState.years.includes(y) ? 'checked' : ''}>
          <span>${y}</span>
        </label>`).join('')}
      </div>
    </div>
    <div class="sales-filter-group" ${isBrand ? 'style="opacity:.4;pointer-events:none"' : ''}>
      <span class="sales-filter-label">Country ${isBrand ? '(n/a — brand data is Europe-wide)' : ''}</span>
      <div class="sales-checklist">
        <label class="sales-check-item sales-check-alleu">
          <input type="checkbox" class="sales-cb country-cb" value="All Europe" ${salesState.countries.includes('All Europe') ? 'checked' : ''}>
          <span>All Europe</span>
        </label>
        <div class="sales-check-divider"></div>
        ${COUNTRIES.map(c => `
        <label class="sales-check-item">
          <input type="checkbox" class="sales-cb country-cb" value="${escHtml(c)}" ${salesState.countries.includes(c) ? 'checked' : ''}>
          <span>${escHtml(c)}</span>
        </label>`).join('')}
      </div>
    </div>
    <div class="sales-filter-group" style="${!isBrand ? 'opacity:.4;pointer-events:none' : ''}">
      <span class="sales-filter-label">Brand</span>
      <div class="sales-checklist">
        ${BRANDS.map(b => `
        <label class="sales-check-item">
          <input type="checkbox" class="sales-cb brand-cb" value="${escHtml(b)}" ${salesState.brands.includes(b) ? 'checked' : ''}>
          <span class="brand-swatch" style="border-left:3px solid ${BRAND_COLORS[b] || '#ccc'};padding-left:6px;">${escHtml(b)}</span>
        </label>`).join('')}
      </div>
    </div>
  </aside>
  <main class="sales-main">
    <div class="sales-europe-banner">
      <span>🌍</span>
      <strong>Europe only</strong> — EU + EFTA + UK passenger vehicle registrations. Middle East markets not included.
    </div>
    <div class="sales-chart-header">
      <h1 class="sales-chart-title" id="sales-chart-title">European Car Sales</h1>
      <p class="sales-chart-sub">Passenger vehicles only · <a href="https://www.best-selling-cars.com/european-new-car-sales-statistics-links/" target="_blank" rel="noopener">best-selling-cars.com</a> · EU + EFTA + UK · <span id="sales-coverage-note" class="sales-coverage-note"></span></p>
    </div>
    <div class="sales-chart-wrap">
      <canvas id="sales-chart"></canvas>
    </div>
    <div id="sales-data-table" class="sales-data-table"></div>
    <p class="ai-disclaimer" style="margin-top:20px;">Passenger vehicles only · EU + EFTA + UK · Source: best-selling-cars.com (ACEA-based) · 2023–2025 confirmed · Figures rounded to nearest 100,000 · Values below threshold shown as n/a · BEV data 2025 only</p>
  </main>
</div>`;

  attachSalesHandlers();
  buildSalesChart();
}

function attachSalesHandlers() {
  document.querySelectorAll('.sales-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => { salesState.view = btn.dataset.view; renderSalesData(); });
  });
  document.querySelectorAll('.sales-metric-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      salesState.metric = btn.dataset.metric;
      document.querySelectorAll('.sales-metric-btn').forEach(b => b.classList.toggle('active', b.dataset.metric === salesState.metric));
      buildSalesChart();
    });
  });
  document.querySelectorAll('.year-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      const y = parseInt(cb.value);
      salesState.years = cb.checked ? [...salesState.years, y].sort() : salesState.years.filter(v => v !== y);
      buildSalesChart();
    });
  });
  document.querySelectorAll('.country-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.value === 'All Europe') {
        salesState.countries = cb.checked ? ['All Europe'] : [];
        document.querySelectorAll('.country-cb:not([value="All Europe"])').forEach(c => { c.checked = false; });
      } else {
        if (cb.checked) {
          salesState.countries = salesState.countries.filter(c => c !== 'All Europe').concat(cb.value);
          const allEU = document.querySelector('.country-cb[value="All Europe"]');
          if (allEU) allEU.checked = false;
        } else {
          salesState.countries = salesState.countries.filter(c => c !== cb.value);
        }
      }
      buildSalesChart();
    });
  });
  document.querySelectorAll('.brand-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      salesState.brands = cb.checked
        ? [...salesState.brands, cb.value]
        : salesState.brands.filter(b => b !== cb.value);
      buildSalesChart();
    });
  });
}

function fmtUnits(v) {
  if (v == null) return 'n/a';
  const rounded = Math.round(v / 100000) * 100000;
  if (rounded === 0) return 'n/a';
  return `${(rounded / 1000000).toFixed(1)}M`;
}

function buildSalesChart() {
  const canvas = document.getElementById('sales-chart');
  if (!canvas || typeof Chart === 'undefined') return;
  if (salesChartInstance) { salesChartInstance.destroy(); salesChartInstance = null; }

  const { view, metric, years, countries, brands } = salesState;
  let datasets = [], labels = [], titleText = '', coverageNote = '';
  const isShare = metric === 'share';

  if (view === 'brand') {
    if (years.length === 0) return;
    labels = years.map(String);
    const activeBrands = BRANDS.filter(b => brands.includes(b));
    datasets = activeBrands.map(brand => {
      const data = brand === 'Others'
        ? years.map(y => {
            const namedSum = NAMED_BRANDS.reduce((s, b) => s + (BRAND_SALES[b]?.[y] || 0), 0);
            const rest = Math.max(0, MARKET_TOTAL[y] - namedSum);
            return isShare ? Math.round((rest / MARKET_TOTAL[y]) * 1000) / 10 : rest;
          })
        : years.map(y => {
            const raw = BRAND_SALES[brand]?.[y] || 0;
            return isShare ? Math.round((raw / MARKET_TOTAL[y]) * 1000) / 10 : raw;
          });
      return { label: brand, data, backgroundColor: BRAND_COLORS[brand] || '#ccc', borderWidth: 0 };
    });
    titleText    = 'European New Car Registrations by Manufacturer Group';
    coverageNote = 'EU + EFTA + UK · confirmed 2023–2025';

  } else if (view === 'country') {
    if (years.length === 0) return;
    const activeCountries = countries.includes('All Europe')
      ? COUNTRIES : COUNTRIES.filter(c => countries.includes(c));
    if (activeCountries.length === 0) return;
    labels = years.map(String);
    datasets = activeCountries.map(c => ({
      label: c,
      data: years.map(y => {
        const raw = COUNTRY_SALES[c]?.[y] || 0;
        return isShare ? Math.round((raw / MARKET_TOTAL[y]) * 1000) / 10 : raw;
      }),
      backgroundColor: COUNTRY_COLORS[c] || '#ccc',
      borderWidth: 0,
    }));
    titleText    = 'New Car Registrations by Country';
    coverageNote = countries.includes('All Europe')
      ? 'All 31 markets · EU + EFTA + UK'
      : `${activeCountries.length} market${activeCountries.length !== 1 ? 's' : ''} selected`;

  } else if (view === 'bev') {
    const activeCountries = countries.includes('All Europe')
      ? COUNTRIES.filter(c => BEV_2025[c])
      : COUNTRIES.filter(c => countries.includes(c) && BEV_2025[c]);
    if (activeCountries.length === 0) return;
    const sorted = [...activeCountries].sort((a, b) => (BEV_2025[b]?.sharePct || 0) - (BEV_2025[a]?.sharePct || 0));
    labels = sorted;
    datasets = [
      { label: 'BEV',     data: sorted.map(c => BEV_2025[c]?.units || 0),                                               backgroundColor: '#2dccd3', borderWidth: 0 },
      { label: 'Non-BEV', data: sorted.map(c => Math.max(0, (COUNTRY_SALES[c]?.[2025] || 0) - (BEV_2025[c]?.units || 0))), backgroundColor: '#d0cfc9', borderWidth: 0 },
    ];
    titleText    = 'BEV Penetration by Country — 2025';
    coverageNote = '2025 only · 2024 source page unavailable';
  }

  const titleEl = document.getElementById('sales-chart-title');
  if (titleEl) titleEl.textContent = titleText;
  const coverageEl = document.getElementById('sales-coverage-note');
  if (coverageEl) coverageEl.textContent = coverageNote;

  const yTickFmt = v => (view === 'bev' || !isShare) ? fmtUnits(v) : `${v}%`;

  salesChartInstance = new Chart(canvas, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 14, boxWidth: 13, boxHeight: 13 } },
        tooltip: {
          callbacks: {
            label: ctx => {
              const v = ctx.parsed.y;
              if (view === 'bev') return ` ${ctx.dataset.label}: ${fmtUnits(v)}`;
              return isShare ? ` ${ctx.dataset.label}: ${v}%` : ` ${ctx.dataset.label}: ${fmtUnits(v)}`;
            },
            footer: items => {
              const total   = items.reduce((s, i) => s + i.parsed.y, 0);
              if (view === 'bev') {
                const pct = BEV_2025[items[0]?.label]?.sharePct;
                return pct != null ? `BEV share: ${pct}%` : `Total: ${fmtUnits(total)}`;
              }
              return isShare ? `Total: ${Math.round(total * 10) / 10}%` : `Total: ${fmtUnits(total)}`;
            },
          },
          footerFont: { weight: 'bold' },
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 }, maxRotation: view === 'bev' ? 45 : 0 } },
        y: { stacked: true, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { font: { size: 12 }, callback: yTickFmt } },
      },
    },
  });

  buildSalesTable(datasets, labels, view === 'bev' ? false : isShare, view);
}

function buildSalesTable(datasets, labels, isShare, view) {
  const wrap = document.getElementById('sales-data-table');
  if (!wrap || datasets.length === 0) return;
  const fmtV  = v => isShare ? `${v}%` : fmtUnits(v);
  const totals = labels.map((_, ci) => datasets.reduce((s, ds) => s + (ds.data[ci] || 0), 0));
  const dataRows = datasets.map(ds => {
    const cells  = ds.data.map(v => `<td>${fmtV(v)}</td>`).join('');
    const swatch = `<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${ds.backgroundColor};margin-right:6px;flex-shrink:0"></span>`;
    return `<tr><td class="st-label"><span style="display:flex;align-items:center;">${swatch}${escHtml(ds.label)}</span></td>${cells}</tr>`;
  }).join('');
  let totalRow = '';
  if (view === 'bev') {
    const pctCells = labels.map(c => `<td><strong>${BEV_2025[c]?.sharePct ?? '—'}%</strong></td>`).join('');
    totalRow = `<tr class="st-total-row"><td class="st-label"><strong>BEV %</strong></td>${pctCells}</tr>`;
  } else {
    const totalCells = totals.map(v => `<td><strong>${fmtV(Math.round(v))}</strong></td>`).join('');
    totalRow = `<tr class="st-total-row"><td class="st-label"><strong>Total</strong></td>${totalCells}</tr>`;
  }
  wrap.innerHTML = `
<table class="sales-table">
  <thead><tr><th></th>${labels.map(l => `<th>${escHtml(String(l))}</th>`).join('')}</tr></thead>
  <tbody>${dataRows}${totalRow}</tbody>
</table>`;
}

// ─── Email Export ─────────────────────────────────────────────────────────────

function shareAsEmail() {
  const edition = state.currentEdition;
  if (!edition) { alert('No edition loaded.'); return; }
  const items    = (edition.items || []).map(normaliseItem);
  const escalate = items.filter(i => i.actionType === 'Act & Escalate');

  const sections = { 'Middle East': [], Europe: [], Global: [] };
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    sections[itemRegion(item)].push(item);
  }

  function emailTag(label, bg) {
    return `<span style="display:inline-block;padding:3px 10px;border-radius:3px;font-size:12px;font-weight:700;color:#fff;background:${bg};margin:2px 3px;">${escHtml(label)}</span>`;
  }

  const highlightsHtml = ['Middle East', 'Europe', 'Global']
    .filter(r => sections[r].length > 0)
    .map(region => {
      const rows = sections[region].map(item => {
        const tags = item.areasOfInterest.map(a => emailTag(a, AREA_COLORS[a] || '#5b6770')).join('');
        return `<tr>
          <td style="padding:11px 0;border-bottom:1px solid #e0e0e0;font-size:15px;line-height:1.45;color:#111;font-weight:500;">${escHtml(item.headline)}</td>
          <td style="padding:11px 0 11px 16px;border-bottom:1px solid #e0e0e0;white-space:nowrap;vertical-align:middle;">${tags}</td>
        </tr>`;
      }).join('');
      return `<tr><td colspan="2" style="padding:20px 0 6px;">
        <span style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#002B5C;font-family:Arial,sans-serif;">${escHtml(region)}</span>
      </td></tr>${rows}`;
    }).join('');

  const keyActionsHtml = escalate.length > 0
    ? `<div style="margin-top:20px;padding:16px 20px;background:#fff5f5;border-left:4px solid #C8102E;border-radius:0 4px 4px 0;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#C8102E;font-family:Arial,sans-serif;">Act &amp; Escalate</p>
        ${escalate.map(i => `<p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#111;line-height:1.5;">${escHtml(i.actionText)}</p>`).join('')}
      </div>`
    : '';

  const cardsHtml = items.map(item => {
    const actionColor = ACTION_COLORS[item.actionType] || '#5b6770';
    const areaTags    = item.areasOfInterest.map(a => emailTag(a, AREA_COLORS[a] || '#5b6770')).join('');
    const geoTags     = item.geographies.map(g =>
      `<span style="display:inline-block;padding:3px 10px;border-radius:3px;font-size:12px;font-weight:600;border:1.5px solid #999;color:#333;margin:2px 3px;">${escHtml(g)}</span>`
    ).join('');
    return `<div style="background:#fff;border:2px solid #e0e0e0;border-radius:6px;padding:24px 28px;margin-bottom:20px;">
      <div style="margin-bottom:12px;">${areaTags}${geoTags}</div>
      <h2 style="margin:0 0 8px;font-size:19px;font-weight:700;color:#002B5C;line-height:1.3;font-family:Georgia,serif;">${escHtml(item.headline)}</h2>
      <p style="margin:0 0 14px;font-size:13px;color:#555;font-family:Arial,sans-serif;">${escHtml(item.source)} · ${escHtml(item.publishedAt)}</p>
      <p style="margin:0 0 16px;font-size:15px;color:#111;line-height:1.7;font-family:Georgia,serif;">${escHtml(item.summary)}</p>
      <p style="margin:0 0 0;font-size:14px;color:#111;line-height:1.5;font-family:Arial,sans-serif;">
        <strong>Action:</strong> ${escHtml(item.actionText)}
        &nbsp;<span style="display:inline-block;padding:3px 10px;border-radius:3px;font-size:12px;font-weight:700;color:#fff;background:${actionColor};">${escHtml(item.actionType)}</span>
      </p>
      <div style="background:#faf6ee;border-left:4px solid #c9a84c;padding:14px 18px;border-radius:0 4px 4px 0;margin-top:16px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#8a6f32;font-family:Arial,sans-serif;">So What for ABC</p>
        <p style="margin:0;font-size:14px;color:#111;line-height:1.6;font-family:Georgia,serif;">${escHtml(item.soWhat)}</p>
      </div>
    </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<title>ABC Mobility Intelligence — ${escHtml(edition.dateRange)}</title>
<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: Georgia, serif; background: #eeeae3; color: #111; }
#toolbar { position: sticky; top: 0; z-index: 100; background: #002B5C; color: #fff; padding: 12px 28px; display: flex; align-items: center; justify-content: space-between; font-family: Arial, sans-serif; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,.3); }
#toolbar button { background: #c9a84c; color: #fff; border: none; padding: 8px 20px; border-radius: 3px; cursor: pointer; font-size: 14px; font-weight: 700; }
#toolbar button:hover { background: #a88a3d; }
#email-body { max-width: 700px; margin: 0 auto; padding: 0 20px 60px; }
</style>
</head><body>
<div id="toolbar">
  <span>Click <strong>Select All</strong>, then <strong>Cmd+C</strong> / <strong>Ctrl+C</strong> to copy into your email.</span>
  <button onclick="selectAll()">Select All</button>
</div>
<div id="email-body">
  <div style="background:#002B5C;padding:40px 48px 36px;">
    <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:.14em;color:#c9a84c;font-family:Arial,sans-serif;font-weight:700;">Fortnightly Briefing</p>
    <h1 style="margin:0 0 10px;font-size:30px;font-weight:700;color:#fff;line-height:1.2;font-family:Georgia,serif;">ABC Mobility Intelligence</h1>
    <p style="margin:0;font-size:16px;color:rgba(255,255,255,.85);font-family:Arial,sans-serif;">${escHtml(edition.dateRange)}</p>
  </div>
  <div style="background:#fff;border-left:4px solid #4A6F8A;padding:28px 48px 32px;">
    <p style="margin:0 0 6px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#4A6F8A;font-family:Arial,sans-serif;">Executive Summary</p>
    <p style="margin:0;font-size:16px;line-height:1.75;color:#111;">${escHtml(edition.executiveSummary || '')}</p>
    ${keyActionsHtml}
  </div>
  <div style="margin-top:32px;">
    <p style="margin:0 0 14px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#002B5C;font-family:Arial,sans-serif;">This Edition</p>
    <div style="background:#fff;border:2px solid #d0d0d0;border-radius:6px;padding:6px 28px 20px;">
      <table style="width:100%;border-collapse:collapse;">${highlightsHtml}</table>
    </div>
  </div>
  <div style="margin-top:36px;">
    <p style="margin:0 0 18px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#002B5C;font-family:Arial,sans-serif;">Intelligence</p>
    ${cardsHtml}
  </div>
  <p style="margin-top:48px;font-size:12px;color:#777;font-family:Arial,sans-serif;text-align:center;padding-bottom:8px;">AI-generated briefing for strategic orientation only. All recommendations are indicative and require detailed fact-checking and analysis before any action is taken. · ABC Mobility Intelligence · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
</div>
<script>
function selectAll() {
  const b = document.getElementById('email-body');
  const r = document.createRange(); r.selectNodeContents(b);
  const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
}
</script>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.target = '_blank'; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 120000);
}

// ─── Tab Switching ────────────────────────────────────────────────────────────

function switchTab(tab) {
  state.currentTab = tab;
  document.querySelectorAll('.nav-tab').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(el =>
    el.classList.toggle('active', el.id === `tab-${tab}`));
  if (tab === 'sales') renderSalesData();
}

window.clearFilters = function () {
  state.filters = { geographies: [], areas: [], actions: [] };
  renderFilters();
  renderIntelligence();
};

// ─── Event Binding ────────────────────────────────────────────────────────────

function bindEvents() {
  document.querySelectorAll('.nav-tab').forEach(btn =>
    btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

  document.getElementById('btn-share-email')?.addEventListener('click', shareAsEmail);

  document.getElementById('geo-select-trigger')?.addEventListener('click', e => {
    e.stopPropagation();
    state.geoDropdownOpen = !state.geoDropdownOpen;
    document.getElementById('geo-dropdown')?.classList.toggle('hidden', !state.geoDropdownOpen);
  });

  document.getElementById('geo-dropdown')?.addEventListener('click', e => e.stopPropagation());

  document.addEventListener('click', () => {
    if (state.geoDropdownOpen) {
      state.geoDropdownOpen = false;
      document.getElementById('geo-dropdown')?.classList.add('hidden');
    }
  });

  document.getElementById('btn-clear-filters')?.addEventListener('click', () => window.clearFilters());
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
  loadFromStorage();
  renderFilters();
  renderIntelligence();
  bindEvents();
  document.body.classList.add('loaded');
  autoQualityChecks();
}

init();
