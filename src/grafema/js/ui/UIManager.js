import { diffAndUpdateDOM } from '../../../js/ui-utils.js';
export function createUIManager(_p5, {
  env,
  Glyph
}) {
  const document = window.document;

  // --- THEME ---

  function applyTheme(themeKey) {
    const theme = env.THEMES[themeKey];
    if (!theme) return;
    if (themeKey === 'dark') document.body.classList.add("theme-dark");else document.body.classList.remove("theme-dark");
    env.bgColor = _p5.color(theme.bg);
    env.textColor = _p5.color(theme.text);
    env.textColorMute = _p5.color(theme.mute);
    env.textColorFocus = _p5.color(theme.focus);
    if (env.DOM.colorBg) env.DOM.colorBg.value = theme.bg;
    if (env.DOM.labelBg) env.DOM.labelBg.innerText = theme.bg.toUpperCase();
    if (env.DOM.colorText) env.DOM.colorText.value = theme.text;
    if (env.DOM.labelText) env.DOM.labelText.innerText = theme.text.toUpperCase();
  }

  // Expose for parent controller

  function showSnackbar(message) {
    const snackbar = env.DOM.snackbar || document.getElementById('grafema-snackbar');
    if (!snackbar) return;
    snackbar.innerText = message;
    snackbar.className = "show";
    if (env.snackbarTimeout) clearTimeout(env.snackbarTimeout);
    env.snackbarTimeout = setTimeout(() => {
      snackbar.className = "";
    }, 2500);
  }

  // --- BACKGROUND REFERENCE IMAGE ---

  // --- INTERFACE BUILD ---

  function buildLetterGrid() {
    if (!env.DOM.letterSelectorGrid) return;
    env.DOM.letterSelectorGrid.innerHTML = '';
    for (let i = 0; i < env.ALPHABET.length; i++) {
      const char = env.ALPHABET[i];
      const btn = document.createElement('button');
      btn.className = 'btn-letter';
      btn.innerText = char;
      btn.setAttribute('data-char', char);
      btn.addEventListener('click', () => {
        if (env.activeGlyph !== null) {
          env.activeGlyph.setLetter(char);
          if (env.DOM.statsActiveLetter) env.DOM.statsActiveLetter.innerText = `Active: ${char}`;
          document.querySelectorAll('#app-grafema .btn-letter').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          updateLayersList();
          env.AppController.saveHistoryState();
        }
      });
      env.DOM.letterSelectorGrid.appendChild(btn);
    }
  }
  function syncSidebarInputs() {
    if (env.activeGlyph === null) return;
    if (env.DOM.activeGlyphLabel) env.DOM.activeGlyphLabel.innerText = `Glyph: Letter ${env.AppController.getGlyphChar(env.activeGlyph)}`;
    if (env.DOM.size) env.DOM.size.value = env.activeGlyph.size;
    if (env.DOM.sizeNum && document.activeElement !== env.DOM.sizeNum) env.DOM.sizeNum.value = Math.round(env.activeGlyph.size);
    if (env.DOM.rotation) env.DOM.rotation.value = env.activeGlyph.rotation;
    if (env.DOM.rotationNum && document.activeElement !== env.DOM.rotationNum) env.DOM.rotationNum.value = Math.round(env.activeGlyph.rotation);
    if (env.DOM.posX) {
      env.DOM.posX.max = _p5.width;
      env.DOM.posX.value = env.activeGlyph.position.x;
    }
    if (env.DOM.posXNum && document.activeElement !== env.DOM.posXNum) env.DOM.posXNum.value = Math.round(env.activeGlyph.position.x);
    if (env.DOM.posY) {
      env.DOM.posY.max = _p5.height;
      env.DOM.posY.value = env.activeGlyph.position.y;
    }
    if (env.DOM.posYNum && document.activeElement !== env.DOM.posYNum) env.DOM.posYNum.value = Math.round(env.activeGlyph.position.y);
    if (env.DOM.par1) env.DOM.par1.value = env.activeGlyph.par1;
    if (env.DOM.par1Num && document.activeElement !== env.DOM.par1Num) env.DOM.par1Num.value = Math.round(env.activeGlyph.par1 * 100);
    if (env.DOM.par2) env.DOM.par2.value = env.activeGlyph.par2;
    if (env.DOM.par2Num && document.activeElement !== env.DOM.par2Num) env.DOM.par2Num.value = Math.round(env.activeGlyph.par2 * 100);
    if (env.DOM.par3) env.DOM.par3.value = env.activeGlyph.par3;
    if (env.DOM.par3Num && document.activeElement !== env.DOM.par3Num) env.DOM.par3Num.value = Math.round(env.activeGlyph.par3 * 100);
    if (env.DOM.par4) env.DOM.par4.value = env.activeGlyph.par4;
    if (env.DOM.par4Num && document.activeElement !== env.DOM.par4Num) env.DOM.par4Num.value = Math.round(env.activeGlyph.par4 * 100);
    const ch = env.AppController.getGlyphChar(env.activeGlyph);
    document.querySelectorAll('#app-grafema .btn-letter').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-char') === ch);
    });
    if (env.DOM.statsGlyphCount) env.DOM.statsGlyphCount.innerText = `Glyphs: ${env.glyphs.length}`;
  }
  function updateLayersList() {
    if (!env.DOM.layersList) return;
    env.DOM.layersList.setAttribute("role", "listbox");
    env.DOM.layersList.setAttribute("aria-live", "polite");
    diffAndUpdateDOM(env.DOM.layersList, env.glyphs, (glyph, idx) => {
      const row = document.createElement('div');
      row.setAttribute("role", "option");
      row.tabIndex = 0; // Make focusable

      row.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          env.AppController.setActiveGlyph(glyph);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (row.nextElementSibling) row.nextElementSibling.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (row.previousElementSibling) row.previousElementSibling.focus();
        }
      });
      row.innerHTML = `
          <span class="layer-badge"></span>
          <span class="layer-name"></span>
          <button class="btn-icon btn-danger btn-delete-layer" title="Delete layer" tabindex="-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>`;
      row.addEventListener('click', e => {
        if (e.target.closest('.btn-delete-layer')) return;
        env.AppController.setActiveGlyph(glyph);
      });
      row.querySelector('.btn-delete-layer').addEventListener('click', e => {
        e.stopPropagation();
        env.AppController.deleteGlyph(parseInt(row.getAttribute('data-index'), 10));
      });
      return row;
    }, (row, glyph, idx) => {
      const ch = env.AppController.getGlyphChar(glyph);
      row.className = `layer-item ${glyph === env.activeGlyph ? 'active' : ''}`;
      row.setAttribute('data-index', idx);
      row.setAttribute('aria-selected', glyph === env.activeGlyph);
      row.querySelector('.layer-badge').innerText = idx + 1;
      row.querySelector('.layer-name').innerText = `Glyph ${idx + 1}: ${ch}`;
    });
    if (env.DOM.statsGlyphCount) env.DOM.statsGlyphCount.innerText = `Glyphs: ${env.glyphs.length}`;
  }
  function updateLayersActiveState() {
    updateLayersList(); // Since we use diffing, updating is cheap, we just call updateLayersList
  }

  // --- DOM CACHE ---

  // --- DOM CACHE ---

  function cacheDomElements() {
    env.DOM = {
      size: document.getElementById('g-input-size'),
      sizeNum: document.getElementById('g-input-size-num'),
      rotation: document.getElementById('g-input-rotation'),
      rotationNum: document.getElementById('g-input-rotation-num'),
      posX: document.getElementById('g-input-pos-x'),
      posXNum: document.getElementById('g-input-pos-x-num'),
      posY: document.getElementById('g-input-pos-y'),
      posYNum: document.getElementById('g-input-pos-y-num'),
      par1: document.getElementById('g-input-par1'),
      par1Num: document.getElementById('g-input-par1-num'),
      par2: document.getElementById('g-input-par2'),
      par2Num: document.getElementById('g-input-par2-num'),
      par3: document.getElementById('g-input-par3'),
      par3Num: document.getElementById('g-input-par3-num'),
      par4: document.getElementById('g-input-par4'),
      par4Num: document.getElementById('g-input-par4-num'),
      inputBgImage: document.getElementById('g-input-bg-image'),
      slideBgOpacity: document.getElementById('g-slide-bg-opacity'),
      slideBgScale: document.getElementById('g-slide-bg-scale'),
      slideBgRotation: document.getElementById('g-slide-bg-rotation'),
      inputBgX: document.getElementById('g-input-bg-x'),
      inputBgY: document.getElementById('g-input-bg-y'),
      btnRemoveBgImage: document.getElementById('g-btn-remove-bg-image'),
      glyphWeight: document.getElementById('g-input-glyph-weight'),
      glyphWeightNum: document.getElementById('g-input-glyph-weight-num'),
      toggleGrid: document.getElementById('g-toggle-grid'),
      colorBg: document.getElementById('g-color-bg'),
      labelBg: document.getElementById('g-label-bg'),
      colorText: document.getElementById('g-color-text'),
      labelText: document.getElementById('g-label-text'),
      layersList: document.getElementById('g-layers-list'),
      letterSelectorGrid: document.getElementById('g-letter-selector-grid'),
      activeGlyphLabel: document.getElementById('g-active-glyph-label'),
      activeGlyphControls: document.getElementById('g-active-glyph-controls'),
      noActiveGlyphMessage: document.getElementById('g-no-active-glyph-message'),
      helpModal: document.getElementById('g-helpModal'),
      snackbar: document.getElementById('grafema-snackbar'),
      btnAddGlyph: document.getElementById('g-btn-add-glyph'),
      btnDuplicateGlyph: document.getElementById('g-btn-duplicate-glyph'),
      btnDeleteGlyph: document.getElementById('g-btn-delete-glyph'),
      btnSave: document.getElementById('g-btn-save'),
      btnReset: document.getElementById('g-btn-reset'),
      btnHelp: document.getElementById('g-btn-help'),
      btnCloseModal: document.getElementById('g-btn-close-modal'),
      statsGlyphCount: document.getElementById('g-stats-glyph-count'),
      statsActiveLetter: document.getElementById('g-stats-active-letter')
    };
  }

  // --- EVENT LISTENERS ---

  function toggleHelpModal() {
    if (!env.DOM.helpModal) return;
    env.DOM.helpModal.style.display = env.DOM.helpModal.style.display === "flex" ? "none" : "flex";
  }
  return {
    applyTheme,
    showSnackbar,
    buildLetterGrid,
    syncSidebarInputs,
    updateLayersList,
    updateLayersActiveState,
    cacheDomElements,
    toggleHelpModal
  };
}