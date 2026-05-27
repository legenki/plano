/**
 * GRAFEMA — Main Controller (p5 Instance Mode + ES6 Modules)
 *
 * Exports a sketch function to be used with: new p5(grafemaSketch, container)
 */

import { createLetterClasses } from './Letter.js';
import { createGlyphClass } from './Glyph.js';
import { HistoryManager } from '../../js/HistoryManager.js';
import { diffAndUpdateDOM } from '../../js/ui-utils.js';

export function grafemaSketch(p) {
  // --- MODULE SETUP ---
  const LetterClasses = createLetterClasses(p);
  const Glyph = createGlyphClass(p, LetterClasses);
  const history = new HistoryManager(30);

  // --- STATE ---
  let glyphs = [];
  let activeGlyph = null;
  let glyphWeight = 7;
  let bgColor, textColor, textColorMute, textColorFocus;

  // Background Reference Image
  let bgImage = null;
  let bgImageOpacity = 50;
  let bgImageScale = 100;
  let bgImageRotation = 0;
  let bgImageX = 0;
  let bgImageY = 0;

  const GLYPH_WEIGHT_DEFAULT = 7;
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.";

  const interactionState = {
    showGrid: true,
    isDragging: false,
    isRotating: false,
    isScaling: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
    startScaleDist: 0,
    startGlyphSize: 200
  };

  const THEMES = {
    light: { bg: '#ffffff', text: '#1e293b', mute: '#64748b', focus: '#0c8ce9' },
    dark:  { bg: '#1e1e1e', text: '#ffffff', mute: '#b3b3b3', focus: '#0c8ce9' }
  };

  let DOM = {};
  let snackbarTimeout = null;

  // --- P5 LIFECYCLE ---

  p.setup = function() {
    const container = document.getElementById('grafema-canvas');
    p.createCanvas(container.clientWidth, container.clientHeight);
    p.angleMode(p.DEGREES);

    cacheDomElements();
    applyTheme('light');
    buildLetterGrid();
    setupEventListeners();
    
    p.noLoop();
    let redrawPending = false;
    const triggerRedraw = () => {
      if (!redrawPending) {
        redrawPending = true;
        requestAnimationFrame(() => {
          p.redraw();
          redrawPending = false;
        });
      }
    };
    window.addEventListener('pointermove', triggerRedraw);
    window.addEventListener('pointerdown', triggerRedraw);
    window.addEventListener('pointerup', triggerRedraw);
    window.addEventListener('keydown', triggerRedraw);
    window.addEventListener('keyup', triggerRedraw);
    window.addEventListener('input', triggerRedraw);
    p.canvas.addEventListener('wheel', triggerRedraw);
    const saved = localStorage.getItem('grafema_autosave');
    if (saved) {
      try {
        const snapshot = JSON.parse(saved);
        if (snapshot && snapshot.length > 0) {
          glyphs = snapshot.map(data => Glyph.deserialize(data));
          setActiveGlyph(glyphs[glyphs.length - 1]);
          updateLayersList();
          history.clear();
          history.save(snapshot);
        } else {
          resetCanvas();
        }
      } catch (e) {
        console.error("Auto-save load failed:", e);
        resetCanvas();
      }
    } else {
      resetCanvas();
    }
  };

  p.draw = function() {
    p.background(bgColor);

    // Background reference image
    if (bgImage) {
      p.push();
      p.translate(p.width / 2 + bgImageX, p.height / 2 + bgImageY);
      p.rotate(bgImageRotation);
      p.scale(bgImageScale / 100);
      p.tint(255, bgImageOpacity * 2.55);
      p.imageMode(p.CENTER);
      p.image(bgImage, 0, 0);
      p.pop();
    }

    if (interactionState.showGrid) {
      drawGrid();
    }

    // Draw inactive glyphs
    for (let i = 0; i < glyphs.length; i++) {
      if (glyphs[i] !== activeGlyph) {
        glyphs[i].display(textColor, textColorMute, textColorFocus, glyphWeight);
      }
    }

    // Draw active glyph with overlay on top
    if (activeGlyph !== null) {
      activeGlyph.display(textColor, textColorMute, textColorFocus, glyphWeight);
      drawSelectionOverlay();
    }
  };

  p.windowResized = function() {
    const container = document.getElementById('grafema-canvas');
    if (container) {
      p.resizeCanvas(container.clientWidth, container.clientHeight);
    }
  };

  // --- VISUAL GUIDES ---

  function drawGrid() {
    const isDarkBg = p.brightness(bgColor) < 50;
    p.stroke(isDarkBg ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)');
    p.strokeWeight(1);
    const step = 60;
    for (let x = 0; x < p.width; x += step) p.line(x, 0, x, p.height);
    for (let y = 0; y < p.height; y += step) p.line(0, y, p.width, y);
  }

  function drawSelectionOverlay() {
    activeGlyph.updateDimensions();
    p.push();
    p.stroke(textColorFocus);
    p.strokeWeight(1.2);
    p.noFill();

    // Dashed outline
    p.drawingContext.setLineDash([6, 6]);
    p.beginShape();
    p.vertex(activeGlyph.topLeft.x, activeGlyph.topLeft.y);
    p.vertex(activeGlyph.topRight.x, activeGlyph.topRight.y);
    p.vertex(activeGlyph.bottomRight.x, activeGlyph.bottomRight.y);
    p.vertex(activeGlyph.bottomLeft.x, activeGlyph.bottomLeft.y);
    p.endShape(p.CLOSE);
    p.drawingContext.setLineDash([]);

    // Crosshair in center
    const crossSize = 6;
    p.line(activeGlyph.position.x - crossSize, activeGlyph.position.y, activeGlyph.position.x + crossSize, activeGlyph.position.y);
    p.line(activeGlyph.position.x, activeGlyph.position.y - crossSize, activeGlyph.position.x, activeGlyph.position.y + crossSize);

    // Rotation handle
    const upVec = p.createVector(0, -1).rotate(activeGlyph.rotation);
    const rotHandlePos = p5.Vector.add(activeGlyph.position, p5.Vector.mult(upVec, activeGlyph.size / 2 + 30));
    const topCenter = p5.Vector.add(activeGlyph.position, p5.Vector.mult(upVec, activeGlyph.size / 2));
    p.line(topCenter.x, topCenter.y, rotHandlePos.x, rotHandlePos.y);
    const pulseSize = 10 + p.sin(p.frameCount * 6) * 1.5;
    p.fill(bgColor);
    p.strokeWeight(2);
    p.ellipse(rotHandlePos.x, rotHandlePos.y, pulseSize, pulseSize);

    // Scale thumb
    p.rectMode(p.CENTER);
    p.fill(bgColor);
    p.rect(activeGlyph.bottomRight.x, activeGlyph.bottomRight.y, 10, 10);
    p.pop();
  }

  // --- MOUSE HANDLERS ---

  p.mousePressed = function() {
    // Ignore clicks on sidebar area
    const sidebar = document.querySelector('#app-grafema .sidebar');
    if (sidebar && p.mouseX > p.width - sidebar.clientWidth - 20) return;
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;

    if (activeGlyph !== null) {
      // 1. Rotation handle hit test
      const upVec = p.createVector(0, -1).rotate(activeGlyph.rotation);
      const rotHandlePos = p5.Vector.add(activeGlyph.position, p5.Vector.mult(upVec, activeGlyph.size / 2 + 30));
      if (p.dist(p.mouseX, p.mouseY, rotHandlePos.x, rotHandlePos.y) < 15) {
        interactionState.isRotating = true;
        return;
      }
      // 2. Scale handle hit test
      if (p.dist(p.mouseX, p.mouseY, activeGlyph.bottomRight.x, activeGlyph.bottomRight.y) < 15) {
        interactionState.isScaling = true;
        interactionState.startScaleDist = p.dist(p.mouseX, p.mouseY, activeGlyph.position.x, activeGlyph.position.y);
        interactionState.startGlyphSize = activeGlyph.size;
        return;
      }
    }

    // 3. Select glyph under cursor
    for (let i = glyphs.length - 1; i >= 0; i--) {
      if (glyphs[i].isHovered(p.mouseX, p.mouseY)) {
        setActiveGlyph(glyphs[i]);
        interactionState.isDragging = true;
        interactionState.dragOffsetX = p.mouseX - glyphs[i].position.x;
        interactionState.dragOffsetY = p.mouseY - glyphs[i].position.y;
        return;
      }
    }

    // 4. Click outside to deselect
    setActiveGlyph(null);
  };

  p.mouseDragged = function() {
    if (activeGlyph === null) return;
    if (interactionState.isDragging) {
      activeGlyph.position.x = p.mouseX - interactionState.dragOffsetX;
      activeGlyph.position.y = p.mouseY - interactionState.dragOffsetY;
      syncSidebarInputs();
    } else if (interactionState.isRotating) {
      const mouseVec = p.createVector(p.mouseX - activeGlyph.position.x, p.mouseY - activeGlyph.position.y);
      let angle = mouseVec.heading() + 90;
      activeGlyph.rotation = (angle + 360) % 360;
      syncSidebarInputs();
    } else if (interactionState.isScaling) {
      const currentDist = p.dist(p.mouseX, p.mouseY, activeGlyph.position.x, activeGlyph.position.y);
      let scaleRatio = currentDist / interactionState.startScaleDist;
      activeGlyph.size = p.constrain(interactionState.startGlyphSize * scaleRatio, 100, 500);
      syncSidebarInputs();
    }
  };

  p.mouseReleased = function() {
    if (interactionState.isDragging || interactionState.isRotating || interactionState.isScaling) {
      saveHistoryState();
    }
    interactionState.isDragging = false;
    interactionState.isRotating = false;
    interactionState.isScaling = false;
  };

  // --- TOUCH HANDLERS ---
  p.touchStarted = function() {
    p.mousePressed();
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) return false;
  };

  p.touchMoved = function() {
    p.mouseDragged();
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) return false;
  };

  p.touchEnded = function() {
    p.mouseReleased();
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) return false;
  };

  p.doubleClicked = function() {
    const sidebar = document.querySelector('#app-grafema .sidebar');
    if (sidebar && p.mouseX > p.width - sidebar.clientWidth - 20) return;
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;
    for (let i = 0; i < glyphs.length; i++) {
      if (glyphs[i].isHovered(p.mouseX, p.mouseY)) return;
    }
    addGlyph(p.mouseX, p.mouseY);
  };

  // --- GLYPHS & LAYERS MANAGEMENT ---

  function addGlyph(x, y) {
    const g = new Glyph(x, y);
    glyphs.push(g);
    setActiveGlyph(g);
    updateLayersList();
    saveHistoryState();
  }

  function deleteGlyph(index) {
    if (glyphs.length === 0) return;
    glyphs.splice(index, 1);
    if (glyphs.length > 0) {
      setActiveGlyph(glyphs[glyphs.length - 1]);
    } else {
      setActiveGlyph(null);
    }
    updateLayersList();
    saveHistoryState();
  }

  function duplicateGlyph() {
    if (activeGlyph === null) return;
    const offset = 40;
    const clone = new Glyph(activeGlyph.position.x + offset, activeGlyph.position.y + offset);
    clone.rotation = activeGlyph.rotation;
    clone.size = activeGlyph.size;
    clone.par1 = activeGlyph.par1;
    clone.par2 = activeGlyph.par2;
    clone.par3 = activeGlyph.par3;
    clone.par4 = activeGlyph.par4;
    const ch = getGlyphChar(activeGlyph);
    clone.setLetter(ch);
    glyphs.push(clone);
    setActiveGlyph(clone);
    updateLayersList();
    saveHistoryState();
  }

  function setActiveGlyph(glyph) {
    if (glyph === null) {
      if (activeGlyph !== null) {
        activeGlyph.active = false;
        activeGlyph.focus = false;
      }
      activeGlyph = null;
      if (DOM.noActiveGlyphMessage) DOM.noActiveGlyphMessage.classList.remove('hidden');
      if (DOM.activeGlyphControls) DOM.activeGlyphControls.classList.add('hidden');
      if (DOM.statsActiveLetter) DOM.statsActiveLetter.innerText = 'Active: None';
    } else {
      glyphs.forEach(g => { g.active = false; g.focus = false; });
      activeGlyph = glyph;
      activeGlyph.active = true;
      if (DOM.noActiveGlyphMessage) DOM.noActiveGlyphMessage.classList.add('hidden');
      if (DOM.activeGlyphControls) DOM.activeGlyphControls.classList.remove('hidden');
      if (DOM.statsActiveLetter) DOM.statsActiveLetter.innerText = `Active: ${getGlyphChar(glyph)}`;
      syncSidebarInputs();
    }
    updateLayersActiveState();
  }

  function resetCanvas() {
    glyphs = [];
    activeGlyph = null;
    glyphWeight = GLYPH_WEIGHT_DEFAULT;
    if (DOM.glyphWeight) DOM.glyphWeight.value = glyphWeight;
    if (DOM.glyphWeightNum) DOM.glyphWeightNum.value = glyphWeight;
    addGlyph(p.width / 2, p.height / 2);
    updateLayersList();
    history.clear();
    saveHistoryState();
  }

  function getGlyphChar(glyph) {
    if (!glyph) return 'A';
    return glyph.myLetterChar || 'A';
  }

  // --- HISTORY (UNDO / REDO) ---

  function saveHistoryState() {
    const snapshot = glyphs.map(g => g.serialize());
    history.save(snapshot);
    localStorage.setItem('grafema_autosave', JSON.stringify(snapshot));
  }

  function appUndo() {
    const snapshot = history.undo();
    if (!snapshot) { showSnackbar("History is empty!"); return; }
    glyphs = snapshot.map(data => Glyph.deserialize(data));
    activeGlyph = null;
    setActiveGlyph(null);
    updateLayersList();
    showSnackbar("Undo");
    p.redraw();
  }

  function appRedo() {
    const snapshot = history.redo();
    if (!snapshot) { showSnackbar("Nothing to redo!"); return; }
    glyphs = snapshot.map(data => Glyph.deserialize(data));
    activeGlyph = null;
    setActiveGlyph(null);
    updateLayersList();
    showSnackbar("Redo");
    p.redraw();
  }

  // --- THEME ---

  function applyTheme(themeKey) {
    const theme = THEMES[themeKey];
    if (!theme) return;
    if (themeKey === 'dark') document.body.classList.add("theme-dark");
    else document.body.classList.remove("theme-dark");
    bgColor = p.color(theme.bg);
    textColor = p.color(theme.text);
    textColorMute = p.color(theme.mute);
    textColorFocus = p.color(theme.focus);
    if (DOM.colorBg) DOM.colorBg.value = theme.bg;
    if (DOM.labelBg) DOM.labelBg.innerText = theme.bg.toUpperCase();
    if (DOM.colorText) DOM.colorText.value = theme.text;
    if (DOM.labelText) DOM.labelText.innerText = theme.text.toUpperCase();
  }

  // Expose for parent controller
  p.applyTheme = applyTheme;

  function showSnackbar(message) {
    const snackbar = DOM.snackbar || document.getElementById('grafema-snackbar');
    if (!snackbar) return;
    snackbar.innerText = message;
    snackbar.className = "show";
    if (snackbarTimeout) clearTimeout(snackbarTimeout);
    snackbarTimeout = setTimeout(() => { snackbar.className = ""; }, 2500);
  }

  // --- BACKGROUND REFERENCE IMAGE ---

  function handleBgImageUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      p.loadImage(e.target.result, img => {
        bgImage = img;
        if (DOM.btnRemoveBgImage) DOM.btnRemoveBgImage.style.display = 'block';
        showSnackbar("Background image loaded successfully");
      }, () => {
        showSnackbar("Failed to load image");
      });
    };
    reader.readAsDataURL(file);
  }

  function removeBgImage() {
    bgImage = null;
    if (DOM.inputBgImage) DOM.inputBgImage.value = '';
    if (DOM.btnRemoveBgImage) DOM.btnRemoveBgImage.style.display = 'none';
    showSnackbar("Background image removed");
  }

  function updateBgImageSettingsFromUI() {
    bgImageOpacity = parseFloat(DOM.slideBgOpacity.value);
    const valOpEl = document.getElementById('g-val-bg-opacity');
    if (valOpEl) valOpEl.innerText = `${bgImageOpacity}%`;
    bgImageScale = parseFloat(DOM.slideBgScale.value);
    const valScEl = document.getElementById('g-val-bg-scale');
    if (valScEl) valScEl.innerText = `${bgImageScale}%`;
    bgImageRotation = parseFloat(DOM.slideBgRotation.value);
    const valRotEl = document.getElementById('g-val-bg-rotation');
    if (valRotEl) valRotEl.innerText = `${bgImageRotation}°`;
    bgImageX = parseFloat(DOM.inputBgX.value) || 0;
    bgImageY = parseFloat(DOM.inputBgY.value) || 0;
  }

  // --- INTERFACE BUILD ---

  function buildLetterGrid() {
    if (!DOM.letterSelectorGrid) return;
    DOM.letterSelectorGrid.innerHTML = '';
    for (let i = 0; i < ALPHABET.length; i++) {
      const char = ALPHABET[i];
      const btn = document.createElement('button');
      btn.className = 'btn-letter';
      btn.innerText = char;
      btn.setAttribute('data-char', char);
      btn.addEventListener('click', () => {
        if (activeGlyph !== null) {
          activeGlyph.setLetter(char);
          if (DOM.statsActiveLetter) DOM.statsActiveLetter.innerText = `Active: ${char}`;
          document.querySelectorAll('#app-grafema .btn-letter').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          updateLayersList();
          saveHistoryState();
        }
      });
      DOM.letterSelectorGrid.appendChild(btn);
    }
  }

  function syncSidebarInputs() {
    if (activeGlyph === null) return;
    if (DOM.activeGlyphLabel) DOM.activeGlyphLabel.innerText = `Glyph: Letter ${getGlyphChar(activeGlyph)}`;
    if (DOM.size) DOM.size.value = activeGlyph.size;
    if (DOM.sizeNum && document.activeElement !== DOM.sizeNum) DOM.sizeNum.value = Math.round(activeGlyph.size);
    if (DOM.rotation) DOM.rotation.value = activeGlyph.rotation;
    if (DOM.rotationNum && document.activeElement !== DOM.rotationNum) DOM.rotationNum.value = Math.round(activeGlyph.rotation);
    if (DOM.posX) { DOM.posX.max = p.width; DOM.posX.value = activeGlyph.position.x; }
    if (DOM.posXNum && document.activeElement !== DOM.posXNum) DOM.posXNum.value = Math.round(activeGlyph.position.x);
    if (DOM.posY) { DOM.posY.max = p.height; DOM.posY.value = activeGlyph.position.y; }
    if (DOM.posYNum && document.activeElement !== DOM.posYNum) DOM.posYNum.value = Math.round(activeGlyph.position.y);
    if (DOM.par1) DOM.par1.value = activeGlyph.par1;
    if (DOM.par1Num && document.activeElement !== DOM.par1Num) DOM.par1Num.value = Math.round(activeGlyph.par1 * 100);
    if (DOM.par2) DOM.par2.value = activeGlyph.par2;
    if (DOM.par2Num && document.activeElement !== DOM.par2Num) DOM.par2Num.value = Math.round(activeGlyph.par2 * 100);
    if (DOM.par3) DOM.par3.value = activeGlyph.par3;
    if (DOM.par3Num && document.activeElement !== DOM.par3Num) DOM.par3Num.value = Math.round(activeGlyph.par3 * 100);
    if (DOM.par4) DOM.par4.value = activeGlyph.par4;
    if (DOM.par4Num && document.activeElement !== DOM.par4Num) DOM.par4Num.value = Math.round(activeGlyph.par4 * 100);

    const ch = getGlyphChar(activeGlyph);
    document.querySelectorAll('#app-grafema .btn-letter').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-char') === ch);
    });
    if (DOM.statsGlyphCount) DOM.statsGlyphCount.innerText = `Glyphs: ${glyphs.length}`;
  }

  function updateLayersList() {
    if (!DOM.layersList) return;
    
    DOM.layersList.setAttribute("role", "listbox");
    DOM.layersList.setAttribute("aria-live", "polite");

    diffAndUpdateDOM(
      DOM.layersList,
      glyphs,
      (glyph, idx) => {
        const row = document.createElement('div');
        row.setAttribute("role", "option");
        row.tabIndex = 0; // Make focusable
        
        row.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActiveGlyph(glyph);
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
          
        row.addEventListener('click', (e) => {
          if (e.target.closest('.btn-delete-layer')) return;
          setActiveGlyph(glyph);
        });
        
        row.querySelector('.btn-delete-layer').addEventListener('click', (e) => {
          e.stopPropagation();
          deleteGlyph(parseInt(row.getAttribute('data-index'), 10));
        });
        
        return row;
      },
      (row, glyph, idx) => {
        const ch = getGlyphChar(glyph);
        row.className = `layer-item ${glyph === activeGlyph ? 'active' : ''}`;
        row.setAttribute('data-index', idx);
        row.setAttribute('aria-selected', glyph === activeGlyph);
        
        row.querySelector('.layer-badge').innerText = idx + 1;
        row.querySelector('.layer-name').innerText = `Glyph ${idx + 1}: ${ch}`;
      }
    );

    if (DOM.statsGlyphCount) DOM.statsGlyphCount.innerText = `Glyphs: ${glyphs.length}`;
  }

  function updateLayersActiveState() {
    updateLayersList(); // Since we use diffing, updating is cheap, we just call updateLayersList
  }

  // --- DOM CACHE ---

  function cacheDomElements() {
    DOM = {
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

  function setupEventListeners() {
    // Collapsible sections
    document.querySelectorAll('#app-grafema .panel-section h2.section-title').forEach(header => {
      header.addEventListener('click', () => {
        header.closest('.panel-section').classList.toggle('collapsed');
      });
    });

    // Glyph parameter inputs — helper to bind slider + number input pairs
    function bindParamPair(slider, numInput, getter, setter, min, max, scale) {
      if (slider) slider.addEventListener('input', (e) => {
        if (activeGlyph !== null) {
          setter(parseFloat(e.target.value));
          if (numInput) numInput.value = Math.round(getter() * (scale || 1));
        }
      });
      if (numInput) numInput.addEventListener('input', (e) => {
        if (activeGlyph !== null) {
          let val = parseFloat(e.target.value);
          if (!isNaN(val)) {
            val = p.constrain(val, min, max);
            setter(scale ? val / scale : val);
            if (slider) slider.value = scale ? val / scale : val;
          }
        }
      });
    }

    bindParamPair(DOM.size, DOM.sizeNum,
      () => activeGlyph.size, (v) => { activeGlyph.size = v; }, 100, 500, 1);
    bindParamPair(DOM.rotation, DOM.rotationNum,
      () => activeGlyph.rotation, (v) => { activeGlyph.rotation = v; }, 0, 360, 1);
    bindParamPair(DOM.posX, DOM.posXNum,
      () => activeGlyph.position.x, (v) => { activeGlyph.position.x = v; }, 0, 5000, 1);
    bindParamPair(DOM.posY, DOM.posYNum,
      () => activeGlyph.position.y, (v) => { activeGlyph.position.y = v; }, 0, 5000, 1);
    bindParamPair(DOM.par1, DOM.par1Num,
      () => activeGlyph.par1, (v) => { activeGlyph.par1 = v; }, 0, 100, 100);
    bindParamPair(DOM.par2, DOM.par2Num,
      () => activeGlyph.par2, (v) => { activeGlyph.par2 = v; }, 0, 100, 100);
    bindParamPair(DOM.par3, DOM.par3Num,
      () => activeGlyph.par3, (v) => { activeGlyph.par3 = v; }, 0, 100, 100);
    bindParamPair(DOM.par4, DOM.par4Num,
      () => activeGlyph.par4, (v) => { activeGlyph.par4 = v; }, 0, 100, 100);

    // Glyph weight
    bindParamPair(DOM.glyphWeight, DOM.glyphWeightNum,
      () => glyphWeight, (v) => { glyphWeight = v; }, 1, 50, 1);

    // Grid toggle
    if (DOM.toggleGrid) DOM.toggleGrid.addEventListener('change', (e) => {
      interactionState.showGrid = e.target.checked;
    });

    // Color pickers
    if (DOM.colorBg) DOM.colorBg.addEventListener('input', (e) => {
      bgColor = p.color(e.target.value);
      if (DOM.labelBg) DOM.labelBg.innerText = e.target.value.toUpperCase();
    });
    if (DOM.colorText) DOM.colorText.addEventListener('input', (e) => {
      textColor = p.color(e.target.value);
      if (DOM.labelText) DOM.labelText.innerText = e.target.value.toUpperCase();
    });

    // Sidebar action buttons
    if (DOM.btnAddGlyph) DOM.btnAddGlyph.addEventListener('click', () => addGlyph(p.width / 2, p.height / 2));
    if (DOM.btnDuplicateGlyph) DOM.btnDuplicateGlyph.addEventListener('click', duplicateGlyph);
    if (DOM.btnDeleteGlyph) DOM.btnDeleteGlyph.addEventListener('click', () => {
      if (activeGlyph !== null) deleteGlyph(glyphs.indexOf(activeGlyph));
    });
    if (DOM.btnSave) DOM.btnSave.addEventListener('click', () => {
      const tempActive = activeGlyph;
      setActiveGlyph(null);
      p.redraw();
      const filename = `TouchType_${p.year()}-${p.month()}-${p.day()}_${p.hour()}-${p.minute()}-${p.second()}.png`;
      p.saveCanvas(filename, 'png');
      setActiveGlyph(tempActive);
      showSnackbar("Canvas exported as PNG");
    });
    if (DOM.btnReset) DOM.btnReset.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset the entire composition?')) {
        resetCanvas();
        showSnackbar("Composition reset");
      }
    });
    if (DOM.btnHelp) DOM.btnHelp.addEventListener('click', toggleHelpModal);
    if (DOM.btnCloseModal) DOM.btnCloseModal.addEventListener('click', toggleHelpModal);

    // Background image controls
    if (DOM.inputBgImage) DOM.inputBgImage.addEventListener('change', (e) => handleBgImageUpload(e.target));
    if (DOM.btnRemoveBgImage) DOM.btnRemoveBgImage.addEventListener('click', removeBgImage);
    if (DOM.slideBgOpacity) DOM.slideBgOpacity.addEventListener('input', updateBgImageSettingsFromUI);
    if (DOM.slideBgScale) DOM.slideBgScale.addEventListener('input', updateBgImageSettingsFromUI);
    if (DOM.slideBgRotation) DOM.slideBgRotation.addEventListener('input', updateBgImageSettingsFromUI);
    if (DOM.inputBgX) DOM.inputBgX.addEventListener('input', updateBgImageSettingsFromUI);
    if (DOM.inputBgY) DOM.inputBgY.addEventListener('input', updateBgImageSettingsFromUI);

    // Keyboard shortcuts (scoped to window, but check active app)
    window.addEventListener('keydown', handleKeyDown);
  }

  function toggleHelpModal() {
    if (!DOM.helpModal) return;
    DOM.helpModal.style.display = DOM.helpModal.style.display === "flex" ? "none" : "flex";
  }

  function handleKeyDown(e) {
    // Only handle if Grafema app is visible
    const grafemaView = document.getElementById('app-grafema');
    if (!grafemaView || !grafemaView.classList.contains('active')) return;

    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT' || document.activeElement.tagName === 'TEXTAREA') return;

    const key = e.key.toUpperCase();

    // Undo (Ctrl/Cmd+Z)
    if ((e.ctrlKey || e.metaKey) && key === 'Z' && !e.shiftKey) {
      e.preventDefault();
      appUndo();
      return;
    }
    // Redo (Ctrl/Cmd+Shift+Z)
    if ((e.ctrlKey || e.metaKey) && key === 'Z' && e.shiftKey) {
      e.preventDefault();
      appRedo();
      return;
    }

    // Quick character assignment (A-Z / .)
    if (activeGlyph !== null && key.length === 1 && ((key >= 'A' && key <= 'Z') || key === '.')) {
      activeGlyph.setLetter(key);
      syncSidebarInputs();
      updateLayersList();
      saveHistoryState();
      e.preventDefault();
      return;
    }

    // Arrow key nudges
    if (activeGlyph !== null) {
      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowUp') { activeGlyph.position.y -= step; syncSidebarInputs(); e.preventDefault(); }
      else if (e.key === 'ArrowDown') { activeGlyph.position.y += step; syncSidebarInputs(); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { activeGlyph.position.x -= step; syncSidebarInputs(); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { activeGlyph.position.x += step; syncSidebarInputs(); e.preventDefault(); }
    }

    // Delete
    if ((e.key === 'Delete' || e.key === 'Backspace') && activeGlyph !== null) {
      deleteGlyph(glyphs.indexOf(activeGlyph));
      e.preventDefault();
    }

    // Duplicate (Ctrl+D)
    if (key === 'D' && (e.ctrlKey || e.metaKey)) {
      if (activeGlyph !== null) { duplicateGlyph(); e.preventDefault(); }
    }

    // Deselect on Escape
    if (e.key === 'Escape') { setActiveGlyph(null); e.preventDefault(); }

    // Create glyph on Spacebar
    if (e.key === ' ') { addGlyph(p.width / 2, p.height / 2); e.preventDefault(); }

    // Toggle help modal
    if (e.key === '?') { toggleHelpModal(); e.preventDefault(); }
  }
}
