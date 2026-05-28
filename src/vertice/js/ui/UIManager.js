import { diffAndUpdateDOM } from '../../../js/ui-utils.js';
export function createUIManager(_p5, {
  env,
  Glyph
}) {
  const document = window.document;
  let snackbarTimeout = null;
  function syncVertexToUI() {
    if (!env.selected_corner) return;
    if (env.DOM.inputVertexX) env.DOM.inputVertexX.value = Math.round(env.selected_corner.center.x);
    if (env.DOM.inputVertexY) env.DOM.inputVertexY.value = Math.round(env.selected_corner.center.y);
    if (env.DOM.slideVertexRadius) env.DOM.slideVertexRadius.value = env.selected_corner.radians;
    if (env.DOM.valVertexRadius) env.DOM.valVertexRadius.innerText = Math.round(env.selected_corner.radians);
  }
  function syncGlyphToUI() {
    if (!env.selected_glyph) return;
    if (env.DOM.slideGlyphRotation) env.DOM.slideGlyphRotation.value = 0;
    if (env.DOM.valGlyphRotation) env.DOM.valGlyphRotation.innerText = "0°";
  }
  function syncPatternToUI() {
    if (env.DOM.slidePatternXOffset) env.DOM.slidePatternXOffset.value = Math.round(env.pattern_xOffset);
    if (env.DOM.valPatternXOffset) env.DOM.valPatternXOffset.innerText = Math.round(env.pattern_xOffset);
    if (env.DOM.slidePatternYOffset) env.DOM.slidePatternYOffset.value = Math.round(env.pattern_yOffset);
    if (env.DOM.valPatternYOffset) env.DOM.valPatternYOffset.innerText = Math.round(env.pattern_yOffset);
    if (env.DOM.slidePatternRotation) env.DOM.slidePatternRotation.value = Math.round(_p5.degrees(env.pattern_rotation));
    if (env.DOM.valPatternRotation) env.DOM.valPatternRotation.innerText = `${Math.round(_p5.degrees(env.pattern_rotation))}°`;
  }

  // --- THEME & UTILS ---

  function applyTheme(themeKey) {
    if (themeKey === 'dark') {
      document.body.classList.add("theme-dark");
      env.backgroundColor = "#1e1e1e";
      env.shapeColor = "#ffffff";
    } else {
      document.body.classList.remove("theme-dark");
      env.backgroundColor = "#ffffff";
      env.shapeColor = "#000000";
    }
    updateUIColors();
  }
  function updateUIColors() {
    if (env.DOM.pickerBgColor) {
      env.DOM.pickerBgColor.value = env.backgroundColor;
      if (env.DOM.labelBg) env.DOM.labelBg.innerText = env.backgroundColor.toUpperCase();
    }
    if (env.DOM.pickerStrokeColor) {
      env.DOM.pickerStrokeColor.value = env.shapeColor;
      if (env.DOM.labelStroke) env.DOM.labelStroke.innerText = env.shapeColor.toUpperCase();
    }
  }
  function updateUISidebarVisibility() {
    if (!env.DOM.cardCorner || !env.DOM.cardGlyph) return;
    env.DOM.cardCorner.style.display = env.activeMode === "corner" && env.selected_corner ? "flex" : "none";
    env.DOM.cardGlyph.style.display = env.activeMode === "glyph" && env.selected_glyph ? "flex" : "none";
  }
  function showSnackbar(msg) {
    const sb = env.DOM.snackbar || document.getElementById("vertice-snackbar");
    if (!sb) return;
    sb.innerText = msg;
    sb.className = "show";
    if (snackbarTimeout) clearTimeout(snackbarTimeout);
    snackbarTimeout = setTimeout(() => {
      sb.className = "";
    }, 2500);
  }
  function updateLayersUI() {
    if (!env.DOM.domLayersList) return;
    if (env.DOM.valLayersCount) env.DOM.valLayersCount.innerText = `Glyphs: ${env.scene_glyphs.length}`;
    if (env.scene_glyphs.length === 0) {
      env.DOM.domLayersList.innerHTML = `<div class="layer-item">Scene is empty</div>`;
      return;
    }

    // Clear the "Scene is empty" message if present
    if (env.DOM.domLayersList.innerHTML.includes("Scene is empty")) {
      env.DOM.domLayersList.innerHTML = "";
    }
    env.DOM.domLayersList.setAttribute("role", "listbox");
    env.DOM.domLayersList.setAttribute("aria-live", "polite");
    const flatData = [];
    env.scene_glyphs.forEach((glyph, gIndex) => {
      flatData.push({
        type: 'glyph',
        glyph,
        index: gIndex
      });
      glyph.corners.forEach((corner, cIndex) => {
        flatData.push({
          type: 'corner',
          glyph,
          corner,
          index: cIndex
        });
      });
    });
    diffAndUpdateDOM(env.DOM.domLayersList, flatData, (data, idx) => {
      const el = document.createElement("div");
      el.setAttribute("role", "option");
      el.tabIndex = 0; // Make focusable

      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (el.nextElementSibling) el.nextElementSibling.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (el.previousElementSibling) el.previousElementSibling.focus();
        }
      });
      return el;
    }, (el, data, idx) => {
      if (data.type === 'glyph') {
        el.className = `layer-item ${env.selected_glyph === data.glyph ? 'active' : ''}`;
        el.style.paddingLeft = "8px";
        el.style.borderLeft = "none";
        el.innerHTML = `<span>Glyph #${data.index + 1}</span><span class="vertex-count">Vertices: ${data.glyph.corners.length}</span>`;
        el.onclick = e => {
          e.stopPropagation();
          env.AppController.clearSelection();
          env.selected_glyph = data.glyph;
          env.selected_glyph.setActive(true);
          env.AppController.setAppMode("glyph");
          syncGlyphToUI();
          _p5.redraw();
        };
      } else {
        el.className = `layer-item ${env.selected_corner === data.corner ? 'active' : ''}`;
        el.style.paddingLeft = "24px";
        el.style.borderLeft = "1px dashed var(--border-color)";
        const isConn = data.glyph.connections.get(data.corner).length > 0;
        el.innerHTML = `<span>• Point #${data.index + 1} (R: ${Math.round(data.corner.radians)})</span><span class="vertex-count">${isConn ? 'Linked' : 'Single'}</span>`;
        el.onclick = e => {
          e.stopPropagation();
          env.AppController.clearSelection();
          env.selected_corner = data.corner;
          env.selected_corner.setActive(true);
          env.selected_glyph = data.glyph;
          env.AppController.setAppMode("corner");
          syncVertexToUI();
          _p5.redraw();
        };
      }
    });
  }

  // --- INITIALIZATION ---

  function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
  }
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
  }
  function cacheDomElements() {
    env.DOM = {
      cardCorner: document.getElementById("v-card-corner"),
      cardGlyph: document.getElementById("v-card-glyph"),
      inputVertexX: document.getElementById("v-input-vertex-x"),
      inputVertexY: document.getElementById("v-input-vertex-y"),
      slideVertexRadius: document.getElementById("v-slide-vertex-radius"),
      valVertexRadius: document.getElementById("v-val-vertex-radius"),
      inputGlyphDx: document.getElementById("v-input-glyph-dx"),
      inputGlyphDy: document.getElementById("v-input-glyph-dy"),
      slideGlyphRotation: document.getElementById("v-slide-glyph-rotation"),
      valGlyphRotation: document.getElementById("v-val-glyph-rotation"),
      slideGlobalRotation: document.getElementById("v-slide-global-rotation"),
      valGlobalRotation: document.getElementById("v-val-global-rotation"),
      checkPatternVisible: document.getElementById("v-check-pattern-visible"),
      slidePatternXOffset: document.getElementById("v-slide-pattern-x-offset"),
      valPatternXOffset: document.getElementById("v-val-pattern-x-offset"),
      slidePatternYOffset: document.getElementById("v-slide-pattern-y-offset"),
      valPatternYOffset: document.getElementById("v-val-pattern-y-offset"),
      slidePatternRotation: document.getElementById("v-slide-pattern-rotation"),
      valPatternRotation: document.getElementById("v-val-pattern-rotation"),
      slidePatternAlpha: document.getElementById("v-slide-pattern-alpha"),
      valPatternAlpha: document.getElementById("v-val-pattern-alpha"),
      checkStrokeRounded: document.getElementById("v-check-stroke-rounded"),
      pickerBgColor: document.getElementById("v-picker-bg-color"),
      labelBg: document.getElementById("v-label-bg"),
      pickerStrokeColor: document.getElementById("v-picker-stroke-color"),
      labelStroke: document.getElementById("v-label-stroke"),
      domLayersList: document.getElementById("v-dom-layers-list"),
      valLayersCount: document.getElementById("v-val-layers-count"),
      exportFilename: document.getElementById("v-export-filename"),
      btnModeCorner: document.getElementById("v-btn-mode-corner"),
      btnModeGlyph: document.getElementById("v-btn-mode-glyph"),
      btnModeScene: document.getElementById("v-btn-mode-scene"),
      snackbar: document.getElementById("vertice-snackbar")
    };
  }
  return {
    syncVertexToUI,
    syncGlyphToUI,
    syncPatternToUI,
    applyTheme,
    updateUIColors,
    updateUISidebarVisibility,
    showSnackbar,
    updateLayersUI,
    showModal,
    closeModal,
    cacheDomElements
  };
}