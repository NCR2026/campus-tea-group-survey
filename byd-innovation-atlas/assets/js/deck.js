/* deck.js — 汇报站点：翻页 / 导航 / 讲稿 / 三维场景挂载 */
import { AtlasView, SCENES } from './atlas.js';
import { CONTENT } from './content.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');

const slides = $$('.slide');
const total = slides.length;
const params = new URLSearchParams(location.search);
const SHOT = params.get('shot');
if (params.get('still')) document.body.classList.add('is-still');

const state = { index: 0, notes: false, toc: false, expanded: null };
const views = new Map();

const partOf = i => CONTENT.parts.find(p => p.id === slides[i].dataset.part) || CONTENT.parts[0];

/* ================================================================ 场景 UI */
function sceneTemplate(id) {
  const def = SCENES[id];
  const isStruct = id === 'battery' || id === 'hybrid';
  return `
  <div class="atlas" data-scene="${id}" data-mode="${def.modes[0][0]}">
    <div class="atlas-canvas">
      <div class="atlas-labels"></div>
      <div class="atlas-loading"><span></span>正在构建三维示意…</div>
      <div class="atlas-hover" hidden></div>
      <div class="atlas-modes" role="group" aria-label="演示模式">
        ${def.modes.map(([k, n], i) => `<button data-mode="${k}" class="${i ? '' : 'is-on'}" aria-pressed="${i ? 'false' : 'true'}">${n}</button>`).join('')}
      </div>
      <div class="atlas-parts" role="group" aria-label="部件与节点">
        ${def.parts.map((p, i) => `<button data-part="${i}" class="${i ? '' : 'is-on'}" style="--swatch:${p.color}"><i></i>${p.name}</button>`).join('')}
      </div>
      <p class="atlas-tip">拖动旋转 · 滚轮缩放 · 点击部件</p>
    </div>
    <div class="atlas-foot">
      <div class="atlas-slider">
        <label>${def.slider.title}<output>${isStruct ? Math.round((def.explode || 0) * 100) + '%' : '1 / ' + def.parts.length}</output></label>
        <input type="range" min="0" max="100" value="${isStruct ? Math.round((def.explode || 0) * 100) : 0}" aria-label="${def.slider.title}">
        <div class="atlas-ends"><span>${def.slider.min}</span><span>${def.slider.max}</span></div>
      </div>
      <div class="atlas-keys">
        <button data-play aria-pressed="false" title="播放 / 暂停">▶</button>
        <button data-view="iso" title="立体视角">立体</button>
        <button data-view="top" title="俯视">俯视</button>
        <button data-view="front" title="正视">正视</button>
        <button data-rotate aria-pressed="false" title="自动旋转">旋转</button>
        <button data-reset title="重置视图">↺</button>
        <button data-expand title="放大演示">放大</button>
      </div>
    </div>
  </div>`;
}

function exploreInner(id) {
  const def = SCENES[id];
  const p = def.parts[0];
  return `
    <div class="explore-head"><span class="explore-eyebrow">探索笔记</span><span class="explore-count">1 / ${def.parts.length}</span></div>
    <h3 class="explore-title">${p.name}</h3>
    <p class="explore-body">${p.body}</p>
    <p class="explore-insight"><span>管理观察</span>${p.insight}</p>
    <p class="explore-q"><span>讲解时想一想</span>${p.question}</p>`;
}

function mountScene(slot) {
  const id = slot.dataset.scene;
  const def = SCENES[id];
  slot.innerHTML = sceneTemplate(id);
  const host = $('.atlas', slot);
  const card = document.querySelector(`.explore[data-scene="${id}"]`);
  if (card) card.innerHTML = exploreInner(id);

  const updateCard = (p, i) => {
    if (!card) return;
    $('.explore-title', card).textContent = p.name;
    $('.explore-body', card).textContent = p.body;
    $('.explore-insight', card).innerHTML = `<span>管理观察</span>${p.insight}`;
    $('.explore-q', card).innerHTML = `<span>讲解时想一想</span>${p.question}`;
    $('.explore-count', card).textContent = `${i + 1} / ${def.parts.length}`;
  };

  const ensure = () => {
    if (views.has(id)) return views.get(id);
    const view = new AtlasView(host, id, { onSelect: (p, i) => updateCard(p, i) });
    views.set(id, view);
    $('.atlas-loading', host)?.remove();
    host._view = view;

    host.addEventListener('atlas-amount', e => {
      const out = $('.atlas-slider output', host);
      const input = $('.atlas-slider input', host);
      if (out) out.textContent = e.detail.text;
      if (input) input.value = Math.round(e.detail.value * 100);
    });
    host.addEventListener('atlas-play', e => {
      const b = $('[data-play]', host);
      if (!b) return;
      b.textContent = e.detail ? '❙❙' : '▶';
      b.setAttribute('aria-pressed', String(e.detail));
    });
    host.addEventListener('atlas-rotate', e => {
      $('[data-rotate]', host)?.setAttribute('aria-pressed', String(e.detail));
    });
    host.addEventListener('atlas-parts', e => {
      const on = new Set(e.detail);
      $$('[data-part]', host).forEach(b => {
        const key = def.parts[+b.dataset.part].key;
        b.classList.toggle('is-off', !on.has(key));
      });
    });
    host.addEventListener('atlas-hover', e => {
      const tip = $('.atlas-hover', host);
      if (!tip) return;
      if (!e.detail) { tip.hidden = true; return; }
      tip.textContent = e.detail.name + ' · 点击查看';
      const r = host.getBoundingClientRect();
      tip.style.left = Math.min(r.width - 150, e.detail.x - r.left + 14) + 'px';
      tip.style.top = Math.min(r.height - 40, e.detail.y - r.top + 14) + 'px';
      tip.hidden = false;
    });
    host.addEventListener('atlas-focus', () => {
      const tip = $('.atlas-tip', host);
      if (tip) tip.textContent = '模型操作中 · 方向键逐步查看 · Esc 返回翻页';
    });
    return view;
  };

  host.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    const view = ensure();
    if (b.dataset.part) view.selectPart(+b.dataset.part);
    else if (b.dataset.mode) {
      $$('[data-mode]', host).forEach(x => {
        const on = x === b;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-pressed', String(on));
      });
      view.setMode(b.dataset.mode);
    }
    else if (b.dataset.view) view.setView(b.dataset.view);
    else if (b.hasAttribute('data-play')) view.togglePlay();
    else if (b.hasAttribute('data-rotate')) view.toggleRotate();
    else if (b.hasAttribute('data-reset')) view.resetView();
    else if (b.hasAttribute('data-expand')) expandScene(host);
  });

  $('.atlas-slider input', host).addEventListener('input', e => {
    ensure().setAmount(+e.target.value / 100);
  });

  slot._ensure = ensure;
  slot._view = () => views.get(id);
}

/* ============================================================= 放大场景 */
function expandScene(host) {
  const id = host.dataset.scene;
  const view = views.get(id);
  if (!view) return;
  state.expanded = { host, parent: host.parentElement };
  $('#scene-stage').append(host);
  host.classList.add('is-expanded');
  $('#scene-modal').hidden = false;
  document.body.classList.add('panel-open');
  $('#scene-modal-title').textContent = SCENES[id].title;
  $('#scene-modal-note').textContent = SCENES[id].subtitle;
  requestAnimationFrame(() => view.resize());
  $('#scene-close').focus();
}

function closeModal() {
  const modal = $('#scene-modal');
  if (modal.hidden) return;
  const { host, parent } = state.expanded || {};
  modal.hidden = true;
  document.body.classList.remove('panel-open');
  if (host && parent) {
    host.classList.remove('is-expanded');
    parent.append(host);
    const v = views.get(host.dataset.scene);
    requestAnimationFrame(() => v?.resize());
  }
  state.expanded = null;
}

/* ================================================================ 翻页 */
function activate(i, opts = {}) {
  i = Math.max(0, Math.min(total - 1, i));
  if (i === state.index && !opts.force) return;
  state.index = i;
  const cur = slides[i];

  slides.forEach(s => s.classList.toggle('is-active', s === cur));

  const items = $$('[data-anim]', cur);
  items.forEach(el => { el.classList.remove('in'); el.style.transitionDelay = '0ms'; });
  requestAnimationFrame(() => {
    items.forEach((el, k) => {
      el.style.transitionDelay = (k * 80 + (Number(el.dataset.delay) || 0)) + 'ms';
      el.classList.add('in');
    });
  });

  $$('.scene-slot[data-scene]').forEach(slot => {
    const v = slot._view?.();
    if (v) v.setActive(slot.closest('.slide') === cur);
  });
  $$('.scene-slot[data-scene]', cur).forEach(slot => {
    // 先让文字入场，再创建三维场景，避免首帧卡顿
    setTimeout(() => {
      if (slot.closest('.slide') !== cur) return;
      slot._ensure?.();
      const v = slot._view?.();
      if (v) { v.setActive(true); v.resize(); }
    }, 240);
  });

  const part = partOf(i);
  $('#hud-part').textContent = part.name;
  $('#hud-part-en').textContent = part.en;
  $('#hud-index').textContent = pad(i + 1);
  $('#hud-total').textContent = pad(total);
  $$('#partnav button').forEach(b => b.classList.toggle('is-on', b.dataset.partNav === part.id));
  $$('#ticks i').forEach((t, k) => {
    t.classList.toggle('is-done', k < i);
    t.classList.toggle('is-on', k === i);
  });
  $('#prev').disabled = i === 0;
  $('#next').disabled = i === total - 1;
  if (state.notes) renderNotes(i);
  if (location.hash !== '#/' + (i + 1)) history.replaceState(null, '', '#/' + (i + 1));
}

const go = d => { if (!state.expanded) activate(state.index + d); };

/* =============================================================== 讲稿 */
function renderNotes(i) {
  const p = CONTENT.pages[i];
  $('#notes-kicker').textContent = p.kicker;
  $('#notes-title').textContent = p.title;
  $('#notes-time').textContent = p.timecode || '';
  $('#notes-body').innerHTML = p.notes.map(n =>
    `<div class="note"><span>${n.label}</span><p>${n.text}</p></div>`).join('');
  $('#notes-n').textContent = pad(i + 1);
}

function toggleNotes(force) {
  state.notes = force ?? !state.notes;
  $('#notes').classList.toggle('is-open', state.notes);
  $('#notes').setAttribute('aria-hidden', String(!state.notes));
  $('#btn-notes').setAttribute('aria-expanded', String(state.notes));
  syncScrim();
  if (state.notes) renderNotes(state.index);
}

/* =============================================================== 目录 */
function buildToc() {
  $('#toc-grid').innerHTML = CONTENT.parts.map(part => {
    const pages = CONTENT.pages.filter(p => p.part === part.id);
    return `<div class="toc-group">
      <p class="toc-part"><b>${part.no}</b>${part.name}<em>${part.en}</em></p>
      ${pages.map(p => `<button class="toc-card" data-go="${p.n - 1}">
        <span class="toc-n">${pad(p.n)}</span>
        <span class="toc-t">${p.title}</span>
        <span class="toc-s">${p.kicker.split('/')[0].trim()}</span>
      </button>`).join('')}
    </div>`;
  }).join('');
}

function toggleToc(force) {
  state.toc = force ?? !state.toc;
  $('#toc').classList.toggle('is-open', state.toc);
  $('#toc').setAttribute('aria-hidden', String(!state.toc));
  $('#btn-toc').setAttribute('aria-expanded', String(state.toc));
  syncScrim();
  if (state.toc) $(`#toc-grid [data-go="${state.index}"]`)?.scrollIntoView({ block: 'center' });
}

function syncScrim() {
  const any = state.notes || state.toc || state.expanded;
  document.body.classList.toggle('panel-open', !!any);
}

/* =============================================================== 全屏 */
function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

let idleTimer = 0;
function wake() {
  document.body.classList.remove('chrome-hidden');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (document.fullscreenElement && !state.notes && !state.toc && !state.expanded) {
      document.body.classList.add('chrome-hidden');
    }
  }, 2800);
}

/* ================================================================ 初始化 */
function init() {
  $('#ticks').innerHTML = CONTENT.pages.map((p, i) =>
    `<i data-go="${i}" title="${pad(p.n)} ${p.title}" class="${CONTENT.pages[i].part !== CONTENT.pages[Math.max(0, i - 1)].part ? 'is-part' : ''}"></i>`
  ).join('');
  buildToc();
  $$('.scene-slot[data-scene]').forEach(mountScene);

  $('#prev').onclick = () => go(-1);
  $('#next').onclick = () => go(1);
  $('#btn-notes').onclick = () => toggleNotes();
  $('#btn-toc').onclick = () => toggleToc();
  $('#btn-full').onclick = toggleFullscreen;
  $('#btn-help').onclick = () => $('#help').classList.toggle('is-open');
  $('#help-close').onclick = () => $('#help').classList.remove('is-open');
  $('#notes-close').onclick = () => toggleNotes(false);
  $('#toc-close').onclick = () => toggleToc(false);
  $('#scene-close').onclick = closeModal;
  $('#scrim').onclick = () => { closeModal(); toggleToc(false); toggleNotes(false); $('#help').classList.remove('is-open'); };

  $('#partnav').addEventListener('click', e => {
    const b = e.target.closest('[data-part-nav]');
    if (!b) return;
    const first = CONTENT.pages.find(p => p.part === b.dataset.partNav);
    activate(first.n - 1);
  });
  $('#ticks').addEventListener('click', e => {
    const t = e.target.closest('[data-go]');
    if (t) activate(+t.dataset.go);
  });
  $('#toc-grid').addEventListener('click', e => {
    const b = e.target.closest('[data-go]');
    if (!b) return;
    toggleToc(false);
    activate(+b.dataset.go);
  });

  document.addEventListener('keydown', e => {
    if (e.defaultPrevented) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.key === 'Escape') {
      if (state.expanded) return closeModal();
      if (state.toc) return toggleToc(false);
      if (state.notes) return toggleNotes(false);
      $('#help').classList.remove('is-open');
      if (document.activeElement?.tagName === 'CANVAS') document.activeElement.blur();
      return;
    }
    if (e.target.closest('.atlas-canvas')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1); }
    else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); }
    else if (e.key === 'Home') activate(0);
    else if (e.key === 'End') activate(total - 1);
    else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    else if (e.key === 'n' || e.key === 'N') toggleNotes();
    else if (e.key === 'o' || e.key === 'O') toggleToc();
    else if (e.key === '?') $('#help').classList.toggle('is-open');
  });

  document.addEventListener('pointermove', wake, { passive: true });
  document.addEventListener('fullscreenchange', () => {
    $('#btn-full').setAttribute('aria-pressed', String(!!document.fullscreenElement));
    wake();
  });

  const start = Math.max(0, Math.min(total - 1, (parseInt(location.hash.replace('#/', ''), 10) || 1) - 1));
  activate(start, { force: true });
  if (params.get('notes') === '1') toggleNotes(true);
  if (params.get('toc') === '1') toggleToc(true);
  document.body.classList.add('is-ready');
}

/* =============================================================== 截帧模式 */
async function capture() {
  const id = SHOT;
  if (!SCENES[id]) return;
  const def = SCENES[id];
  const mode = params.get('mode') || def.modes[0][0];
  const part = parseInt(params.get('part') || '0', 10);
  const explode = params.get('explode');
  const view = params.get('view') || 'iso';
  const w = parseInt(params.get('w') || '1600', 10);
  const h = parseInt(params.get('h') || '900', 10);

  document.body.style.setProperty('--shot-w', w + 'px');
  document.body.style.setProperty('--shot-h', h + 'px');
  const host = document.createElement('div');
  host.className = 'shot-host';
  const slot = document.createElement('div');
  slot.className = 'scene-slot';
  slot.dataset.scene = id;
  host.append(slot);
  document.body.append(host);

  slot.innerHTML = sceneTemplate(id);
  const atlas = $('.atlas', slot);
  $$('.atlas-modes,.atlas-parts,.atlas-foot,.atlas-tip', atlas).forEach(el => el.remove());

  const view3d = new AtlasView(atlas, id, {});
  views.set(id, view3d);
  $('.atlas-loading', atlas)?.remove();
  if (mode !== def.modes[0][0]) view3d.setMode(mode);
  if (explode !== null) { view3d.playing = false; view3d.amount = +explode / 100; view3d.shown = view3d.amount; }
  view3d.selectPart(part, true);
  view3d.setView(view);
  view3d.setActive(true);
  view3d.resize();
  await new Promise(r => setTimeout(r, 1800));
  document.body.dataset.shotReady = '1';
}

if (SHOT) capture();
else init();
