/**
 * GRAFEMA DESKTOP APP - MAIN CONTROLLER
 * 
 * Clean state management, cached DOM selectors, integrated background reference image,
 * and unified Figma aesthetics with dark/light themes.
 */

// Global variables (shared with Glyph.js)
let glyphs = [];
let activeGlyph = null;
let glyphWeight = 7;
let bgColor;
let textColor;
let textColorMute;
let textColorFocus;

// Reference Background Image State
let bgImage = null;
let bgImageOpacity = 50;
let bgImageScale = 100;
let bgImageRotation = 0;
let bgImageX = 0;
let bgImageY = 0;

// Configuration Constants
const GLYPH_WEIGHT_DEFAULT = 7;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.";

// Application state
const state = {
  showGrid: true,
  isDragging: false,
  isRotating: false,
  isScaling: false,
  dragOffsetX: 0,
  dragOffsetY: 0,
  startScaleDist: 0,
  startGlyphSize: 200
};

// Preset Themes (Aligned with Vertice)
const THEMES = {
  light: { bg: '#ffffff', text: '#1e293b', mute: '#64748b', focus: '#0c8ce9' },
  dark: { bg: '#1e1e1e', text: '#ffffff', mute: '#b3b3b3', focus: '#0c8ce9' }
};

// Cached DOM elements
let DOM = {};

// --- INITIALIZATION & SETUP ---

function setup() {
  const container = document.getElementById('canvas-container');
  const canvas = createCanvas(container.clientWidth, container.clientHeight);
  canvas.parent('canvas-container');
  
  angleMode(DEGREES);
  
  // Cache DOM elements
  cacheDomElements();
  
  // Initialize default light theme
  applyTheme('light');
  
  // Build A-Z letter selector grid
  buildLetterGrid();
  
  // Setup event listeners
  setupEventListeners();
  
  // Reset composition and add initial glyph
  resetCanvas();
}

function cacheDomElements() {
  DOM = {
    // Glyph settings inputs
    size: document.getElementById('input-size'),
    sizeNum: document.getElementById('input-size-num'),
    rotation: document.getElementById('input-rotation'),
    rotationNum: document.getElementById('input-rotation-num'),
    posX: document.getElementById('input-pos-x'),
    posXNum: document.getElementById('input-pos-x-num'),
    posY: document.getElementById('input-pos-y'),
    posYNum: document.getElementById('input-pos-y-num'),
    par1: document.getElementById('input-par1'),
    par1Num: document.getElementById('input-par1-num'),
    par2: document.getElementById('input-par2'),
    par2Num: document.getElementById('input-par2-num'),
    par3: document.getElementById('input-par3'),
    par3Num: document.getElementById('input-par3-num'),
    par4: document.getElementById('input-par4'),
    par4Num: document.getElementById('input-par4-num'),
    
    // Background Image inputs
    inputBgImage: document.getElementById('input-bg-image'),
    slideBgOpacity: document.getElementById('slide-bg-opacity'),
    slideBgScale: document.getElementById('slide-bg-scale'),
    slideBgRotation: document.getElementById('slide-bg-rotation'),
    inputBgX: document.getElementById('input-bg-x'),
    inputBgY: document.getElementById('input-bg-y'),
    btnRemoveBgImage: document.getElementById('btn-remove-bg-image'),
    
    // Canvas & Style inputs
    glyphWeight: document.getElementById('input-glyph-weight'),
    glyphWeightNum: document.getElementById('input-glyph-weight-num'),
    toggleGrid: document.getElementById('toggle-grid'),
    colorBg: document.getElementById('color-bg'),
    labelBg: document.getElementById('label-bg'),
    colorText: document.getElementById('color-text'),
    labelText: document.getElementById('label-text'),
    
    // Layout lists and elements
    layersList: document.getElementById('layers-list'),
    letterSelectorGrid: document.getElementById('letter-selector-grid'),
    activeGlyphLabel: document.getElementById('active-glyph-label'),
    activeGlyphControls: document.getElementById('active-glyph-controls'),
    noActiveGlyphMessage: document.getElementById('no-active-glyph-message'),
    helpModal: document.getElementById('helpModal'),
    snackbar: document.getElementById('snackbar'),
    
    // Buttons
    btnAddGlyph: document.getElementById('btn-add-glyph'),
    btnDuplicateGlyph: document.getElementById('btn-duplicate-glyph'),
    btnDeleteGlyph: document.getElementById('btn-delete-glyph'),
    btnSave: document.getElementById('btn-save'),
    btnReset: document.getElementById('btn-reset'),
    btnHelp: document.getElementById('btn-help'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnThemeDark: document.getElementById('btn-theme-dark'),
    btnThemeLight: document.getElementById('btn-theme-light'),
    
    // Canvas Stats
    statsGlyphCount: document.getElementById('stats-glyph-count'),
    statsActiveLetter: document.getElementById('stats-active-letter')
  };
}

// --- DRAWING LOOP ---

function draw() {
  background(bgColor);
  
  // Render background reference image (if loaded)
  if (bgImage) {
    push();
    translate(width / 2 + bgImageX, height / 2 + bgImageY);
    rotate(bgImageRotation);
    scale(bgImageScale / 100);
    tint(255, bgImageOpacity * 2.55);
    imageMode(CENTER);
    image(bgImage, 0, 0);
    pop();
  }
  
  if (state.showGrid) {
    drawGrid();
  }
  
  // Draw inactive glyphs
  for (let i = 0; i < glyphs.length; i++) {
    if (glyphs[i] !== activeGlyph) {
      glyphs[i].display();
    }
  }
  
  // Draw active glyph with outline controls on top
  if (activeGlyph !== null) {
    activeGlyph.display();
    drawSelectionOverlay();
  }
}

function windowResized() {
  const container = document.getElementById('canvas-container');
  resizeCanvas(container.clientWidth, container.clientHeight);
}

// --- VISUAL GUIDES & GRID ---

function drawGrid() {
  const isDarkBg = brightness(bgColor) < 50;
  stroke(isDarkBg ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)');
  strokeWeight(1);
  
  const step = 60;
  for (let x = 0; x < width; x += step) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += step) {
    line(0, y, width, y);
  }
}

function drawSelectionOverlay() {
  activeGlyph.updateDimensions();
  
  push();
  stroke(textColorFocus);
  strokeWeight(1.2);
  noFill();
  
  // Dashed outline
  drawingContext.setLineDash([6, 6]);
  beginShape();
  vertex(activeGlyph.topLeft.x, activeGlyph.topLeft.y);
  vertex(activeGlyph.topRight.x, activeGlyph.topRight.y);
  vertex(activeGlyph.bottomRight.x, activeGlyph.bottomRight.y);
  vertex(activeGlyph.bottomLeft.x, activeGlyph.bottomLeft.y);
  endShape(CLOSE);
  drawingContext.setLineDash([]);
  
  // Crosshair in center
  const crossSize = 6;
  line(activeGlyph.position.x - crossSize, activeGlyph.position.y, activeGlyph.position.x + crossSize, activeGlyph.position.y);
  line(activeGlyph.position.x, activeGlyph.position.y - crossSize, activeGlyph.position.x, activeGlyph.position.y + crossSize);
  
  // Rotation handle (30px above top bound)
  const upVec = createVector(0, -1).rotate(activeGlyph.rotation);
  const rotHandlePos = p5.Vector.add(activeGlyph.position, p5.Vector.mult(upVec, activeGlyph.size / 2 + 30));
  const topCenter = p5.Vector.add(activeGlyph.position, p5.Vector.mult(upVec, activeGlyph.size / 2));
  
  // Connection line
  line(topCenter.x, topCenter.y, rotHandlePos.x, rotHandlePos.y);
  
  // Pulsing rotation thumb
  const pulseSize = 10 + sin(frameCount * 6) * 1.5;
  fill(bgColor);
  strokeWeight(2);
  ellipse(rotHandlePos.x, rotHandlePos.y, pulseSize, pulseSize);
  
  // Square scale thumb at bottom-right corner
  rectMode(CENTER);
  fill(bgColor);
  rect(activeGlyph.bottomRight.x, activeGlyph.bottomRight.y, 10, 10);
  
  pop();
}

// --- MOUSE GESTURE HANDLERS ---

function mousePressed() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar && mouseX > width - sidebar.clientWidth - 20) return;
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  
  if (activeGlyph !== null) {
    // 1. Rotation handle hit test
    const upVec = createVector(0, -1).rotate(activeGlyph.rotation);
    const rotHandlePos = p5.Vector.add(activeGlyph.position, p5.Vector.mult(upVec, activeGlyph.size / 2 + 30));
    
    if (dist(mouseX, mouseY, rotHandlePos.x, rotHandlePos.y) < 15) {
      state.isRotating = true;
      return;
    }
    
    // 2. Scaling handle hit test
    if (dist(mouseX, mouseY, activeGlyph.bottomRight.x, activeGlyph.bottomRight.y) < 15) {
      state.isScaling = true;
      state.startScaleDist = dist(mouseX, mouseY, activeGlyph.position.x, activeGlyph.position.y);
      state.startGlyphSize = activeGlyph.size;
      return;
    }
  }
  
  // 3. Select glyph under cursor
  for (let i = glyphs.length - 1; i >= 0; i--) {
    const glyph = glyphs[i];
    if (glyph.isHovered(mouseX, mouseY)) {
      setActiveGlyph(glyph);
      state.isDragging = true;
      state.dragOffsetX = mouseX - glyph.position.x;
      state.dragOffsetY = mouseY - glyph.position.y;
      return;
    }
  }
  
  // 4. Click outside to deselect
  setActiveGlyph(null);
}

function mouseDragged() {
  if (activeGlyph === null) return;
  
  if (state.isDragging) {
    activeGlyph.position.x = mouseX - state.dragOffsetX;
    activeGlyph.position.y = mouseY - state.dragOffsetY;
    syncSidebarInputs();
  } else if (state.isRotating) {
    const mouseVec = createVector(mouseX - activeGlyph.position.x, mouseY - activeGlyph.position.y);
    let angle = mouseVec.heading() + 90;
    activeGlyph.rotation = (angle + 360) % 360;
    syncSidebarInputs();
  } else if (state.isScaling) {
    const currentDist = dist(mouseX, mouseY, activeGlyph.position.x, activeGlyph.position.y);
    let scaleRatio = currentDist / state.startScaleDist;
    activeGlyph.size = constrain(state.startGlyphSize * scaleRatio, 100, 500);
    syncSidebarInputs();
  }
}

function mouseReleased() {
  state.isDragging = false;
  state.isRotating = false;
  state.isScaling = false;
}

function doubleClicked() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar && mouseX > width - sidebar.clientWidth - 20) return;
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  
  // Check if double clicked empty area to create glyph
  for (let i = 0; i < glyphs.length; i++) {
    if (glyphs[i].isHovered(mouseX, mouseY)) {
      return;
    }
  }
  addGlyph(mouseX, mouseY);
}

// --- GLYPHS & LAYERS MANAGEMENT ---

function addGlyph(x, y) {
  const g = new Glyph(x, y);
  glyphs.push(g);
  setActiveGlyph(g);
  updateLayersList();
}

function deleteGlyph(index) {
  if (glyphs.length === 0) return;
  
  glyphs.splice(index, 1);
  
  // Update layer index references
  for (let j = index; j < glyphs.length; j++) {
    glyphs[j].index = j;
  }
  
  if (glyphs.length > 0) {
    setActiveGlyph(glyphs[glyphs.length - 1]);
  } else {
    setActiveGlyph(null);
  }
  updateLayersList();
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
  
  const char = getGlyphChar(activeGlyph);
  clone.myLetter = char;
  clone.setLetter(char);
  
  glyphs.push(clone);
  setActiveGlyph(clone);
  updateLayersList();
}

function setActiveGlyph(glyph) {
  if (glyph === null) {
    if (activeGlyph !== null) {
      activeGlyph.active = false;
      activeGlyph.focus = false;
    }
    activeGlyph = null;
    
    DOM.noActiveGlyphMessage.classList.remove('hidden');
    DOM.activeGlyphControls.classList.add('hidden');
    DOM.statsActiveLetter.innerText = 'Active: None';
  } else {
    glyphs.forEach(g => {
      g.active = false;
      g.focus = false;
    });
    
    activeGlyph = glyph;
    activeGlyph.active = true;
    
    DOM.noActiveGlyphMessage.classList.add('hidden');
    DOM.activeGlyphControls.classList.remove('hidden');
    DOM.statsActiveLetter.innerText = `Active: ${getGlyphChar(glyph)}`;
    
    syncSidebarInputs();
  }
  
  updateLayersActiveState();
}

function resetCanvas() {
  glyphs = [];
  activeGlyph = null;
  glyphWeight = GLYPH_WEIGHT_DEFAULT;
  
  DOM.glyphWeight.value = glyphWeight;
  DOM.glyphWeightNum.value = glyphWeight;
  
  addGlyph(width / 2, height / 2);
  updateLayersList();
}

function getGlyphChar(glyph) {
  if (!glyph || !glyph.myLetter) return 'A';
  const className = glyph.myLetter.constructor.name;
  return className === 'Period' ? '.' : className.replace('Letter', '');
}

// --- THEME & SNACKBAR CONTROLLERS ---

function applyTheme(themeKey) {
  const theme = THEMES[themeKey];
  if (!theme) return;
  
  if (themeKey === 'dark') {
    document.body.classList.add("theme-dark");
  } else {
    document.body.classList.remove("theme-dark");
  }
  
  bgColor = color(theme.bg);
  textColor = color(theme.text);
  textColorMute = color(theme.mute);
  textColorFocus = color(theme.focus);
  
  if (DOM.colorBg) DOM.colorBg.value = theme.bg;
  if (DOM.labelBg) DOM.labelBg.innerText = theme.bg.toUpperCase();
  if (DOM.colorText) DOM.colorText.value = theme.text;
  if (DOM.labelText) DOM.labelText.innerText = theme.text.toUpperCase();
}

function setAppTheme(themeKey) {
  applyTheme(themeKey);
  showSnackbar(`Theme: ${themeKey === 'dark' ? "Dark" : "Light"}`);
  
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'THEME_CHANGED', theme: themeKey }, '*');
  }
}

function showSnackbar(message) {
  const snackbar = DOM.snackbar || document.getElementById('snackbar');
  if (!snackbar) return;
  snackbar.innerText = message;
  snackbar.className = "show";
  
  if (window.snackbarTimeout) clearTimeout(window.snackbarTimeout);
  window.snackbarTimeout = setTimeout(() => {
    snackbar.className = "";
  }, 2500);
}

// --- BACKGROUND REFERENCE IMAGE CONTROLLERS ---

function handleBgImageUpload(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      loadImage(e.target.result, img => {
        bgImage = img;
        DOM.btnRemoveBgImage.style.display = 'block';
        showSnackbar("Background image loaded successfully");
      }, err => {
        showSnackbar("Failed to load image");
      });
    };
    reader.readAsDataURL(file);
  }
}

function removeBgImage() {
  bgImage = null;
  DOM.inputBgImage.value = '';
  DOM.btnRemoveBgImage.style.display = 'none';
  showSnackbar("Background image removed");
}

function updateBgImageSettingsFromUI() {
  bgImageOpacity = parseFloat(DOM.slideBgOpacity.value);
  document.getElementById('val-bg-opacity').innerText = `${bgImageOpacity}%`;
  
  bgImageScale = parseFloat(DOM.slideBgScale.value);
  document.getElementById('val-bg-scale').innerText = `${bgImageScale}%`;
  
  bgImageRotation = parseFloat(DOM.slideBgRotation.value);
  document.getElementById('val-bg-rotation').innerText = `${bgImageRotation}°`;
  
  bgImageX = parseFloat(DOM.inputBgX.value) || 0;
  bgImageY = parseFloat(DOM.inputBgY.value) || 0;
}

// --- INTERFACE BUILD & EVENTS ---

function buildLetterGrid() {
  DOM.letterSelectorGrid.innerHTML = '';
  
  for (let i = 0; i < ALPHABET.length; i++) {
    const char = ALPHABET[i];
    const btn = document.createElement('button');
    btn.className = 'btn-letter';
    btn.innerText = char;
    btn.setAttribute('data-char', char);
    
    btn.addEventListener('click', () => {
      if (activeGlyph !== null) {
        activeGlyph.myLetter = char;
        activeGlyph.setLetter(char);
        
        DOM.statsActiveLetter.innerText = `Active: ${char}`;
        
        document.querySelectorAll('.btn-letter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        updateLayersList();
      }
    });
    DOM.letterSelectorGrid.appendChild(btn);
  }
}

function syncSidebarInputs() {
  if (activeGlyph === null) return;
  
  // Set active glyph panel title
  DOM.activeGlyphLabel.innerText = `Glyph #${activeGlyph.index + 1}: Letter ${getGlyphChar(activeGlyph)}`;
  
  // Size & Rotation
  DOM.size.value = activeGlyph.size;
  if (document.activeElement !== DOM.sizeNum) {
    DOM.sizeNum.value = Math.round(activeGlyph.size);
  }
  
  DOM.rotation.value = activeGlyph.rotation;
  if (document.activeElement !== DOM.rotationNum) {
    DOM.rotationNum.value = Math.round(activeGlyph.rotation);
  }
  
  // Coordinates X & Y
  DOM.posX.max = width;
  DOM.posX.value = activeGlyph.position.x;
  if (document.activeElement !== DOM.posXNum) {
    DOM.posXNum.value = Math.round(activeGlyph.position.x);
  }
  
  DOM.posY.max = height;
  DOM.posY.value = activeGlyph.position.y;
  if (document.activeElement !== DOM.posYNum) {
    DOM.posYNum.value = Math.round(activeGlyph.position.y);
  }
  
  // Parameter sliders (0 - 100%)
  DOM.par1.value = activeGlyph.par1;
  if (document.activeElement !== DOM.par1Num) {
    DOM.par1Num.value = Math.round(activeGlyph.par1 * 100);
  }
  
  DOM.par2.value = activeGlyph.par2;
  if (document.activeElement !== DOM.par2Num) {
    DOM.par2Num.value = Math.round(activeGlyph.par2 * 100);
  }
  
  DOM.par3.value = activeGlyph.par3;
  if (document.activeElement !== DOM.par3Num) {
    DOM.par3Num.value = Math.round(activeGlyph.par3 * 100);
  }
  
  DOM.par4.value = activeGlyph.par4;
  if (document.activeElement !== DOM.par4Num) {
    DOM.par4Num.value = Math.round(activeGlyph.par4 * 100);
  }
  
  // Highlight active letter selector button
  const char = getGlyphChar(activeGlyph);
  document.querySelectorAll('.btn-letter').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-char') === char);
  });
  
  DOM.statsGlyphCount.innerText = `Glyphs: ${glyphs.length}`;
}

function updateLayersList() {
  DOM.layersList.innerHTML = '';
  
  glyphs.forEach((glyph, idx) => {
    const char = getGlyphChar(glyph);
    const row = document.createElement('div');
    row.className = `layer-item ${glyph === activeGlyph ? 'active' : ''}`;
    row.setAttribute('data-index', idx);
    row.innerHTML = `
      <span class="layer-badge">${idx + 1}</span>
      <span class="layer-name">Glyph ${idx + 1}: ${char}</span>
      <button class="btn-icon btn-danger btn-delete-layer" title="Delete layer">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>
    `;
    
    // Select layer row
    row.addEventListener('click', (e) => {
      if (e.target.closest('.btn-delete-layer')) return;
      setActiveGlyph(glyph);
    });
    
    // Delete layer row
    row.querySelector('.btn-delete-layer').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteGlyph(idx);
    });
    
    DOM.layersList.appendChild(row);
  });
  
  DOM.statsGlyphCount.innerText = `Glyphs: ${glyphs.length}`;
}

function updateLayersActiveState() {
  document.querySelectorAll('.layer-item').forEach(item => {
    const idx = parseInt(item.getAttribute('data-index'), 10);
    item.classList.toggle('active', activeGlyph !== null && activeGlyph.index === idx);
  });
}

function setupEventListeners() {
  // Initialize collapsible sections
  document.querySelectorAll('.panel-section h2.section-title').forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.closest('.panel-section');
      parent.classList.toggle('collapsed');
    });
  });

  // Bind glyph parameter inputs
  
  // Size
  DOM.size.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      activeGlyph.size = parseFloat(e.target.value);
      DOM.sizeNum.value = Math.round(activeGlyph.size);
    }
  });
  DOM.sizeNum.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      let val = parseFloat(e.target.value);
      if (!isNaN(val)) {
        val = constrain(val, 100, 500);
        activeGlyph.size = val;
        DOM.size.value = val;
      }
    }
  });
  
  // Rotation
  DOM.rotation.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      activeGlyph.rotation = parseFloat(e.target.value);
      DOM.rotationNum.value = Math.round(activeGlyph.rotation);
    }
  });
  DOM.rotationNum.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      let val = parseFloat(e.target.value);
      if (!isNaN(val)) {
        val = constrain(val, 0, 360);
        activeGlyph.rotation = val;
        DOM.rotation.value = val;
      }
    }
  });
  
  // Position X
  DOM.posX.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      activeGlyph.position.x = parseFloat(e.target.value);
      DOM.posXNum.value = Math.round(activeGlyph.position.x);
    }
  });
  DOM.posXNum.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      let val = parseFloat(e.target.value);
      if (!isNaN(val)) {
        val = constrain(val, 0, width);
        activeGlyph.position.x = val;
        DOM.posX.value = val;
      }
    }
  });
  
  // Position Y
  DOM.posY.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      activeGlyph.position.y = parseFloat(e.target.value);
      DOM.posYNum.value = Math.round(activeGlyph.position.y);
    }
  });
  DOM.posYNum.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      let val = parseFloat(e.target.value);
      if (!isNaN(val)) {
        val = constrain(val, 0, height);
        activeGlyph.position.y = val;
        DOM.posY.value = val;
      }
    }
  });
  
  // Parameter 1
  DOM.par1.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      activeGlyph.par1 = parseFloat(e.target.value);
      DOM.par1Num.value = Math.round(activeGlyph.par1 * 100);
    }
  });
  DOM.par1Num.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      let val = parseFloat(e.target.value);
      if (!isNaN(val)) {
        val = constrain(val, 0, 100);
        activeGlyph.par1 = val / 100;
        DOM.par1.value = val / 100;
      }
    }
  });
  
  // Parameter 2
  DOM.par2.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      activeGlyph.par2 = parseFloat(e.target.value);
      DOM.par2Num.value = Math.round(activeGlyph.par2 * 100);
    }
  });
  DOM.par2Num.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      let val = parseFloat(e.target.value);
      if (!isNaN(val)) {
        val = constrain(val, 0, 100);
        activeGlyph.par2 = val / 100;
        DOM.par2.value = val / 100;
      }
    }
  });
  
  // Parameter 3
  DOM.par3.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      activeGlyph.par3 = parseFloat(e.target.value);
      DOM.par3Num.value = Math.round(activeGlyph.par3 * 100);
    }
  });
  DOM.par3Num.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      let val = parseFloat(e.target.value);
      if (!isNaN(val)) {
        val = constrain(val, 0, 100);
        activeGlyph.par3 = val / 100;
        DOM.par3.value = val / 100;
      }
    }
  });
  
  // Parameter 4
  DOM.par4.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      activeGlyph.par4 = parseFloat(e.target.value);
      DOM.par4Num.value = Math.round(activeGlyph.par4 * 100);
    }
  });
  DOM.par4Num.addEventListener('input', (e) => {
    if (activeGlyph !== null) {
      let val = parseFloat(e.target.value);
      if (!isNaN(val)) {
        val = constrain(val, 0, 100);
        activeGlyph.par4 = val / 100;
        DOM.par4.value = val / 100;
      }
    }
  });

  // Global Canvas and style controls
  DOM.glyphWeight.addEventListener('input', (e) => {
    glyphWeight = parseFloat(e.target.value);
    DOM.glyphWeightNum.value = Math.round(glyphWeight);
  });
  DOM.glyphWeightNum.addEventListener('input', (e) => {
    let val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      val = constrain(val, 1, 50);
      glyphWeight = val;
      DOM.glyphWeight.value = val;
    }
  });
  
  DOM.toggleGrid.addEventListener('change', (e) => {
    state.showGrid = e.target.checked;
  });
  
  // Custom Color pickers
  DOM.colorBg.addEventListener('input', (e) => {
    bgColor = color(e.target.value);
    DOM.labelBg.innerText = e.target.value.toUpperCase();
  });
  
  DOM.colorText.addEventListener('input', (e) => {
    textColor = color(e.target.value);
    DOM.labelText.innerText = e.target.value.toUpperCase();
  });

  // Sidebar Actions
  DOM.btnAddGlyph.addEventListener('click', () => {
    addGlyph(width / 2, height / 2);
  });
  
  DOM.btnDuplicateGlyph.addEventListener('click', () => {
    duplicateGlyph();
  });
  
  DOM.btnDeleteGlyph.addEventListener('click', () => {
    if (activeGlyph !== null) {
      deleteGlyph(activeGlyph.index);
    }
  });
  
  DOM.btnSave.addEventListener('click', () => {
    const tempActive = activeGlyph;
    setActiveGlyph(null); // Hide outline during export
    
    redraw();
    const filename = `TouchType_${year()}-${month()}-${day()}_${hour()}-${minute()}-${second()}.png`;
    saveCanvas(filename, 'png');
    
    setActiveGlyph(tempActive); // Restore outline
    showSnackbar("Canvas exported as PNG");
  });
  
  DOM.btnReset.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the entire composition?')) {
      resetCanvas();
      showSnackbar("Composition reset");
    }
  });
  
  DOM.btnHelp.addEventListener('click', toggleHelpModal);
  DOM.btnCloseModal.addEventListener('click', toggleHelpModal);

  // Background Reference Image Controls
  if (DOM.inputBgImage) {
    DOM.inputBgImage.addEventListener('change', (e) => {
      handleBgImageUpload(e.target);
    });
  }
  if (DOM.btnRemoveBgImage) {
    DOM.btnRemoveBgImage.addEventListener('click', () => {
      removeBgImage();
    });
  }
  if (DOM.slideBgOpacity) {
    DOM.slideBgOpacity.addEventListener('input', updateBgImageSettingsFromUI);
  }
  if (DOM.slideBgScale) {
    DOM.slideBgScale.addEventListener('input', updateBgImageSettingsFromUI);
  }
  if (DOM.slideBgRotation) {
    DOM.slideBgRotation.addEventListener('input', updateBgImageSettingsFromUI);
  }
  if (DOM.inputBgX) {
    DOM.inputBgX.addEventListener('input', updateBgImageSettingsFromUI);
  }
  if (DOM.inputBgY) {
    DOM.inputBgY.addEventListener('input', updateBgImageSettingsFromUI);
  }

  // Theme Toggles
  if (DOM.btnThemeDark) {
    DOM.btnThemeDark.addEventListener('click', () => setAppTheme('dark'));
  }
  if (DOM.btnThemeLight) {
    DOM.btnThemeLight.addEventListener('click', () => setAppTheme('light'));
  }
}

function toggleHelpModal() {
  if (DOM.helpModal.style.display === "flex") {
    DOM.helpModal.style.display = "none";
  } else {
    DOM.helpModal.style.display = "flex";
  }
}

// --- KEYBOARD SHORTCUT BINDINGS ---

window.addEventListener('keydown', function(e) {
  // Forward tab switching keys to parent window
  if (e.altKey && (e.key === 'g' || e.key === 'v' || e.key === 's' || e.key === 'п' || e.key === 'м' || e.key === 'ы')) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'KEYDOWN_EVENT',
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        key: e.key,
        keyCode: e.keyCode
      }, '*');
    }
  }

  if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') {
    return;
  }
  
  const key = e.key.toUpperCase();
  
  // 1. A-Z / . Quick Character Assignment
  if (activeGlyph !== null) {
    if (key.length === 1 && ((key >= 'A' && key <= 'Z') || key === '.')) {
      activeGlyph.myLetter = key;
      activeGlyph.setLetter(key);
      syncSidebarInputs();
      updateLayersList();
      e.preventDefault();
      return;
    }
  }
  
  // 2. Position nudges with Arrow keys
  if (activeGlyph !== null) {
    const step = e.shiftKey ? 10 : 1;
    if (e.key === 'ArrowUp') {
      activeGlyph.position.y -= step;
      syncSidebarInputs();
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      activeGlyph.position.y += step;
      syncSidebarInputs();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      activeGlyph.position.x -= step;
      syncSidebarInputs();
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      activeGlyph.position.x += step;
      syncSidebarInputs();
      e.preventDefault();
    }
  }
  
  // 3. Delete selected glyph
  if ((e.key === 'Delete' || e.key === 'Backspace') && activeGlyph !== null) {
    deleteGlyph(activeGlyph.index);
    e.preventDefault();
  }
  
  // 4. Duplicate (Ctrl+D / Alt+C)
  if ((key === 'D' && (e.ctrlKey || e.metaKey)) || (key === 'C' && e.altKey)) {
    if (activeGlyph !== null) {
      duplicateGlyph();
      e.preventDefault();
    }
  }
  
  // 5. Deselect on Escape
  if (e.key === 'Escape') {
    setActiveGlyph(null);
    e.preventDefault();
  }
  
  // 6. Create glyph on Spacebar
  if (e.key === ' ') {
    addGlyph(width / 2, height / 2);
    e.preventDefault();
  }
  
  // 7. Toggle Help Modal (?)
  if (e.key === '?') {
    toggleHelpModal();
    e.preventDefault();
  }
});

// Parent theme sync listener
window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data) return;
  if (data.type === 'SYNC_THEME') {
    applyTheme(data.theme);
  }
});
