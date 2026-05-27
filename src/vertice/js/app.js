/**
 * VERTICE - ГЛАВНЫЙ КОНТРОЛЛЕР (p5 Instance Mode + ES6 Modules)
 * 
 * Экспортирует функцию скетча для вызова через `new p5(verticeSketch, container)`
 */

import { createCornerClass } from './corner.js';
import { createGlyphClass } from './glyph.js';
import { HistoryManager } from '../../js/HistoryManager.js';
import { diffAndUpdateDOM } from '../../js/ui-utils.js';

export function verticeSketch(p) {
  // --- НАСТРОЙКА МОДУЛЕЙ ---
  const Corner = createCornerClass(p);
  const Glyph = createGlyphClass(p, Corner);
  const history = new HistoryManager(30);

  // --- СОСТОЯНИЕ ---
  let backgroundColor = "#ffffff";
  let shapeColor = "#000000";
  let strokeCapRounded = true;

  let pattern_visibility = true;
  let pattern_alpha = 100;
  let pattern_xOffset = 400;
  let pattern_yOffset = 400;
  let pattern_rotation = 0;

  let scene_glyphs = [];
  let selected_corner = null;
  let selected_glyph = null;

  let scene_scale = 1;
  let scene_center;
  let scene_rotation = 0;

  let globalRotationValue = 0;

  let bgImage = null;
  let bgImageOpacity = 50;
  let bgImageScale = 100;
  let bgImageRotation = 0;
  let bgImageX = 0;
  let bgImageY = 0;

  let exportActive = false;
  let exportSVGActive = false;
  let svgCanvas = null;

  let activeMode = "corner"; // "corner", "glyph", "scene"
  let mouse;

  let firstCornerToConnect = null;

  let sceneDragging = false;
  let sceneDragStart = null;
  let patternDragStart = null;
  let glyphDragStart = null;

  let DOM = {};
  let snackbarTimeout = null;

  // --- ЖИЗНЕННЫЙ ЦИКЛ p5 ---

  p.setup = function() {
    const container = document.getElementById("vertice-canvas");
    p.createCanvas(container.clientWidth, container.clientHeight);
    
    scene_center = p.createVector(p.width / 2, p.height / 2);
    mouse = p.createVector(0, 0);

    cacheDomElements();
    setupEventListeners();
    updateUIColors();
    
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
    const saved = localStorage.getItem('vertice_autosave');
    if (saved) {
      try {
        const snapshot = JSON.parse(saved);
        if (snapshot && snapshot.length > 0) {
          scene_glyphs = snapshot.map(data => Glyph.deserialize(data));
          clearSelection();
          if (scene_glyphs.length > 0) {
            selected_glyph = scene_glyphs[scene_glyphs.length - 1];
            if (selected_glyph.corners.length > 0) {
              selected_corner = selected_glyph.corners[0];
            }
          }
        } else {
          createInitialDemoScene();
        }
      } catch (e) {
        console.error("Auto-save load failed:", e);
        createInitialDemoScene();
      }
    } else {
      createInitialDemoScene();
    }
    
    saveHistoryState();
    updateUISidebarVisibility();
    updateLayersUI();
  };

  p.draw = function() {
    calculateLocalMouse();
    p.background(backgroundColor);

    if (bgImage) {
      p.push();
      p.translate(scene_center.x, scene_center.y);
      p.scale(scene_scale);
      p.rotate(scene_rotation);
      
      p.translate(bgImageX, bgImageY);
      p.rotate(p.radians(bgImageRotation));
      p.scale(bgImageScale / 100);
      
      p.tint(255, bgImageOpacity * 2.55);
      p.imageMode(p.CENTER);
      p.image(bgImage, 0, 0);
      p.pop();
    }

    if (pattern_visibility) {
      drawPattern();
    }

    p.push();
    p.translate(scene_center.x, scene_center.y);
    p.scale(scene_scale);
    p.rotate(scene_rotation);

    scene_glyphs.forEach(glyph => {
      glyph.drawScene(shapeColor, strokeCapRounded);
    });

    if (!exportActive) {
      scene_glyphs.forEach(glyph => {
        glyph.drawActiveButton(shapeColor, backgroundColor, activeMode, mouse);
      });
    }

    p.pop();
  };

  p.windowResized = function() {
    const container = document.getElementById("vertice-canvas");
    if (container) {
      p.resizeCanvas(container.clientWidth, container.clientHeight);
      scene_center.set(p.width / 2, p.height / 2);
    }
  };

  function createInitialDemoScene() {
    const g = new Glyph();
    const c1 = new Corner({x: -150, y: -50}, 60, g);
    const c2 = new Corner({x: 150, y: 50}, 30, g);
    const c3 = new Corner({x: 0, y: 100}, 45, g);
    g.addCorner(c1);
    g.addCorner(c2);
    g.addCorner(c3);
    g.connectCorners(c1, c2);
    g.connectCorners(c2, c3);
    scene_glyphs.push(g);
    selected_corner = c1;
    c1.setActive(true);
  }

  function calculateLocalMouse() {
    let m = p.createVector(p.mouseX - scene_center.x, p.mouseY - scene_center.y);
    m.div(scene_scale);
    m.rotate(-scene_rotation);
    mouse = m;
  }

  function drawPattern() {
    const copiesX = 3;
    const copiesY = 3;
    const originalAlpha = p.drawingContext.globalAlpha;
    p.drawingContext.globalAlpha = pattern_alpha / 255;

    for (let x = -copiesX; x <= copiesX; x++) {
      for (let y = -copiesY; y <= copiesY; y++) {
        if (x === 0 && y === 0) continue;
        p.push();
        const offset = p.createVector(x * pattern_xOffset, y * pattern_yOffset);
        offset.rotate(pattern_rotation);
        p.translate(scene_center.x + offset.x, scene_center.y + offset.y);
        p.scale(scene_scale);
        p.rotate(scene_rotation);
        
        scene_glyphs.forEach(glyph => {
          glyph.drawSceneMerged(p.drawingContext, shapeColor, strokeCapRounded);
        });
        p.pop();
      }
    }
    p.drawingContext.globalAlpha = originalAlpha;
  }

  // --- МЫШЬ ---

  p.mousePressed = function() {
    const sidebar = document.querySelector('#app-vertice .sidebar');
    if (sidebar && p.mouseX > p.width - sidebar.clientWidth) return;
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;

    calculateLocalMouse();

    if (activeMode === "corner") {
      let hitCorner = null;
      for (const glyph of scene_glyphs) {
        for (const corner of glyph.corners) {
          if (corner.checkHoverButton(mouse) || corner.checkHover(mouse)) {
            hitCorner = corner;
            break;
          }
        }
        if (hitCorner) break;
      }

      if (hitCorner) {
        clearSelection();
        selected_corner = hitCorner;
        selected_corner.setActive(true);
        selected_corner.checkDrag(mouse);
        syncVertexToUI();
        updateUISidebarVisibility();
        updateLayersUI();
      } else {
        const currentGlyph = selected_glyph || (scene_glyphs.length > 0 ? scene_glyphs[scene_glyphs.length - 1] : null);
        if (currentGlyph) {
          const newCorner = new Corner({x: mouse.x, y: mouse.y}, 30, currentGlyph);
          const prevCorner = selected_corner;
          currentGlyph.addCorner(newCorner);
          if (prevCorner && prevCorner.glyph === currentGlyph) {
            currentGlyph.connectCorners(prevCorner, newCorner);
          }
          clearSelection();
          selected_corner = newCorner;
          selected_corner.setActive(true);
          
          saveHistoryState();
          syncVertexToUI();
          updateUISidebarVisibility();
          updateLayersUI();
          showSnackbar("Vertex added");
        } else {
          const newGlyph = new Glyph();
          const newCorner = new Corner({x: mouse.x, y: mouse.y}, 30, newGlyph);
          newGlyph.addCorner(newCorner);
          scene_glyphs.push(newGlyph);
          clearSelection();
          selected_corner = newCorner;
          selected_corner.setActive(true);
          selected_glyph = newGlyph;
          
          saveHistoryState();
          syncVertexToUI();
          updateUISidebarVisibility();
          updateLayersUI();
          showSnackbar("Glyph and vertex created");
        }
      }
    } 
    else if (activeMode === "glyph") {
      let hitGlyph = null;
      for (const glyph of scene_glyphs) {
        for (const corner of glyph.corners) {
          if (corner.checkHover(mouse)) {
            hitGlyph = glyph;
            break;
          }
        }
        if (hitGlyph) break;
      }

      if (hitGlyph) {
        clearSelection();
        selected_glyph = hitGlyph;
        selected_glyph.setActive(true);
        glyphDragStart = p.createVector(mouse.x, mouse.y);
        syncGlyphToUI();
        updateUISidebarVisibility();
        updateLayersUI();
      } else {
        clearSelection();
        updateUISidebarVisibility();
        updateLayersUI();
      }
    } 
    else if (activeMode === "scene") {
      if (p.keyIsDown(p.SHIFT)) {
        patternDragStart = p.createVector(p.mouseX, p.mouseY);
      } else {
        sceneDragging = true;
        sceneDragStart = p.createVector(p.mouseX - scene_center.x, p.mouseY - scene_center.y);
      }
    }
  };

  p.mouseDragged = function() {
    calculateLocalMouse();
    if (activeMode === "corner" && selected_corner && selected_corner.dragging) {
      selected_corner.drag(mouse);
      syncVertexToUI();
    } 
    else if (activeMode === "glyph" && selected_glyph && glyphDragStart) {
      const dx = mouse.x - glyphDragStart.x;
      const dy = mouse.y - glyphDragStart.y;
      selected_glyph.translate(dx, dy);
      glyphDragStart.set(mouse.x, mouse.y);
    } 
    else if (activeMode === "scene") {
      if (p.keyIsDown(p.SHIFT) && patternDragStart) {
        const dx = p.mouseX - patternDragStart.x;
        const dy = p.mouseY - patternDragStart.y;
        pattern_xOffset += dx;
        pattern_yOffset += dy;
        patternDragStart.set(p.mouseX, p.mouseY);
        syncPatternToUI();
      } else if (sceneDragging && sceneDragStart) {
        scene_center.x = p.mouseX - sceneDragStart.x;
        scene_center.y = p.mouseY - sceneDragStart.y;
      }
    }
  };

  p.mouseReleased = function() {
    if (selected_corner && selected_corner.dragging) {
      selected_corner.endDrag();
      saveHistoryState();
    }
    if (glyphDragStart) {
      glyphDragStart = null;
      saveHistoryState();
    }
    sceneDragging = false;
    sceneDragStart = null;
    patternDragStart = null;
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
    const sidebar = document.querySelector('#app-vertice .sidebar');
    if (sidebar && p.mouseX > p.width - sidebar.clientWidth) return;
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;

    calculateLocalMouse();

    if (activeMode === "corner") {
      let hitCorner = null;
      for (const glyph of scene_glyphs) {
        for (const corner of glyph.corners) {
          if (corner.checkHover(mouse)) { hitCorner = corner; break; }
        }
      }
      if (hitCorner) {
        if (!firstCornerToConnect) {
          firstCornerToConnect = hitCorner;
          showSnackbar("Select second vertex to connect");
        } else {
          if (firstCornerToConnect !== hitCorner) {
            const g1 = firstCornerToConnect.glyph;
            const g2 = hitCorner.glyph;
            if (g1 === g2) {
              g1.connectCorners(firstCornerToConnect, hitCorner);
              showSnackbar("Vertices connected");
            } else {
              g1.mergeGlyph(g2);
              g1.connectCorners(firstCornerToConnect, hitCorner);
              scene_glyphs = scene_glyphs.filter(g => g !== g2);
              showSnackbar("Glyphs merged and connected");
            }
            saveHistoryState();
            updateLayersUI();
          }
          firstCornerToConnect = null;
        }
      }
    } 
    else if (activeMode === "glyph") {
      let hitAny = false;
      for (const glyph of scene_glyphs) {
        for (const corner of glyph.corners) {
          if (corner.checkHover(mouse)) { hitAny = true; break; }
        }
      }
      if (!hitAny) {
        const newGlyph = new Glyph();
        const newCorner = new Corner({x: mouse.x, y: mouse.y}, 40, newGlyph);
        newGlyph.addCorner(newCorner);
        scene_glyphs.push(newGlyph);
        clearSelection();
        selected_glyph = newGlyph;
        selected_glyph.setActive(true);
        selected_corner = newCorner;
        selected_corner.setActive(true);
        saveHistoryState();
        updateUISidebarVisibility();
        updateLayersUI();
        showSnackbar("New glyph created");
      }
    }
  };

  p.mouseWheel = function(event) {
    const sidebar = document.querySelector('#app-vertice .sidebar');
    if (sidebar && p.mouseX > p.width - sidebar.clientWidth) return;
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;

    calculateLocalMouse();
    const scaleSpeed = 0.05;

    if (activeMode === "corner") {
      let hitCorner = null;
      for (const glyph of scene_glyphs) {
        for (const corner of glyph.corners) {
          if (corner.checkHover(mouse)) { hitCorner = corner; break; }
        }
      }
      if (hitCorner) {
        hitCorner.setRadians(event.deltaY < 0 ? 5 : -5);
        syncVertexToUI();
        return false;
      }
    } 
    else if (activeMode === "glyph" && selected_glyph) {
      if (p.keyIsDown(p.SHIFT)) {
        selected_glyph.rotate(event.deltaY < 0 ? p.radians(5) : p.radians(-5), mouse);
        syncGlyphToUI();
      } else {
        selected_glyph.scale(event.deltaY < 0 ? 0.05 : -0.05, mouse);
      }
      return false;
    } 
    else if (activeMode === "scene") {
      if (p.keyIsDown(p.SHIFT)) {
        pattern_rotation += event.deltaY < 0 ? p.radians(2) : p.radians(-2);
        syncPatternToUI();
      } else {
        const factor = event.deltaY < 0 ? (1 + scaleSpeed) : (1 - scaleSpeed);
        scene_scale = p.constrain(scene_scale * factor, 0.1, 10);
      }
      return false;
    }
  };

  function handleKeyDown(e) {
    const view = document.getElementById('app-vertice');
    if (!view || !view.classList.contains('active')) return;
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;

    const key = e.key.toLowerCase();
    
    if (key === '1') { setAppMode('corner'); e.preventDefault(); return; }
    if (key === '2') { setAppMode('glyph'); e.preventDefault(); return; }
    if (key === '3') { setAppMode('scene'); e.preventDefault(); return; }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (activeMode === "corner" && selected_corner) deleteSelectedVertex();
      else if (activeMode === "glyph" && selected_glyph) deleteSelectedGlyph();
      else if (activeMode === "scene") appClearScene();
      e.preventDefault();
      return;
    }

    if (key === 'x' || key === 'ч') {
      pattern_visibility = !pattern_visibility;
      if (DOM.checkPatternVisible) DOM.checkPatternVisible.checked = pattern_visibility;
      showSnackbar(`Grid Pattern: ${pattern_visibility ? "ON" : "OFF"}`);
      e.preventDefault();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && (key === 'z' || key === 'я') && !e.shiftKey) {
      e.preventDefault();
      appUndo();
      return;
    }
    
    if ((e.ctrlKey || e.metaKey) && (key === 'z' || key === 'я') && e.shiftKey) {
      e.preventDefault();
      appRedo();
      return;
    }
  }

  // --- UI ACTIONS ---

  function clearSelection() {
    selected_corner = null;
    selected_glyph = null;
    scene_glyphs.forEach(glyph => {
      glyph.setActive(false);
      glyph.corners.forEach(corner => corner.setActive(false));
    });
    firstCornerToConnect = null;
  }

  function setAppMode(mode) {
    activeMode = mode;
    [DOM.btnModeCorner, DOM.btnModeGlyph, DOM.btnModeScene].forEach(btn => { if(btn) btn.classList.remove("active"); });
    if (mode === "corner" && DOM.btnModeCorner) DOM.btnModeCorner.classList.add("active");
    if (mode === "glyph" && DOM.btnModeGlyph) DOM.btnModeGlyph.classList.add("active");
    if (mode === "scene" && DOM.btnModeScene) DOM.btnModeScene.classList.add("active");
    if (mode === "scene") clearSelection();
    showSnackbar(`Mode: ${mode === "corner" ? "Vertices" : mode === "glyph" ? "Glyphs" : "Scene"}`);
    updateUISidebarVisibility();
    updateLayersUI();
  }

  function syncVertexToUI() {
    if (!selected_corner) return;
    if (DOM.inputVertexX) DOM.inputVertexX.value = Math.round(selected_corner.center.x);
    if (DOM.inputVertexY) DOM.inputVertexY.value = Math.round(selected_corner.center.y);
    if (DOM.slideVertexRadius) DOM.slideVertexRadius.value = selected_corner.radians;
    if (DOM.valVertexRadius) DOM.valVertexRadius.innerText = Math.round(selected_corner.radians);
  }

  function updateSelectedVertexFromUI() {
    if (!selected_corner) return;
    const nx = parseFloat(DOM.inputVertexX.value);
    const ny = parseFloat(DOM.inputVertexY.value);
    const nr = parseFloat(DOM.slideVertexRadius.value);
    if (!isNaN(nx)) selected_corner.center.x = nx;
    if (!isNaN(ny)) selected_corner.center.y = ny;
    selected_corner.radians = nr;
    if (DOM.valVertexRadius) DOM.valVertexRadius.innerText = Math.round(nr);
    updateLayersUI();
  }

  function deleteSelectedVertex() {
    if (!selected_corner) return;
    const parentGlyph = selected_corner.glyph;
    parentGlyph.removeCorner(selected_corner);
    if (parentGlyph.corners.length === 0) {
      scene_glyphs = scene_glyphs.filter(g => g !== parentGlyph);
    }
    clearSelection();
    saveHistoryState();
    updateUISidebarVisibility();
    updateLayersUI();
    showSnackbar("Vertex deleted");
  }

  function disconnectSelectedVertex() {
    if (!selected_corner) return;
    const parentGlyph = selected_corner.glyph;
    const newGlyph = parentGlyph.spliceAtCorner(selected_corner);
    if (newGlyph) {
      scene_glyphs.push(newGlyph);
      showSnackbar("Glyph split successfully");
    } else {
      showSnackbar("To split, the vertex must have exactly 2 links!");
    }
    clearSelection();
    saveHistoryState();
    updateUISidebarVisibility();
    updateLayersUI();
  }

  function syncGlyphToUI() {
    if (!selected_glyph) return;
    if (DOM.slideGlyphRotation) DOM.slideGlyphRotation.value = 0;
    if (DOM.valGlyphRotation) DOM.valGlyphRotation.innerText = "0°";
  }

  function deleteSelectedGlyph() {
    if (!selected_glyph) return;
    scene_glyphs = scene_glyphs.filter(g => g !== selected_glyph);
    clearSelection();
    saveHistoryState();
    updateUISidebarVisibility();
    updateLayersUI();
    showSnackbar("Glyph deleted");
  }

  function syncPatternToUI() {
    if (DOM.slidePatternXOffset) DOM.slidePatternXOffset.value = Math.round(pattern_xOffset);
    if (DOM.valPatternXOffset) DOM.valPatternXOffset.innerText = Math.round(pattern_xOffset);
    if (DOM.slidePatternYOffset) DOM.slidePatternYOffset.value = Math.round(pattern_yOffset);
    if (DOM.valPatternYOffset) DOM.valPatternYOffset.innerText = Math.round(pattern_yOffset);
    if (DOM.slidePatternRotation) DOM.slidePatternRotation.value = Math.round(p.degrees(pattern_rotation));
    if (DOM.valPatternRotation) DOM.valPatternRotation.innerText = `${Math.round(p.degrees(pattern_rotation))}°`;
  }

  function updatePatternFromUI() {
    pattern_xOffset = parseFloat(DOM.slidePatternXOffset.value);
    if (DOM.valPatternXOffset) DOM.valPatternXOffset.innerText = Math.round(pattern_xOffset);
    pattern_yOffset = parseFloat(DOM.slidePatternYOffset.value);
    if (DOM.valPatternYOffset) DOM.valPatternYOffset.innerText = Math.round(pattern_yOffset);
    const rotDeg = parseFloat(DOM.slidePatternRotation.value);
    pattern_rotation = p.radians(rotDeg);
    if (DOM.valPatternRotation) DOM.valPatternRotation.innerText = `${rotDeg}°`;
    pattern_alpha = parseFloat(DOM.slidePatternAlpha.value);
    if (DOM.valPatternAlpha) DOM.valPatternAlpha.innerText = Math.round(pattern_alpha);
  }

  // --- HISTORY (UNDO / REDO) ---

  function saveHistoryState() {
    const snapshot = scene_glyphs.map(g => g.serialize());
    history.save(snapshot);
    localStorage.setItem('vertice_autosave', JSON.stringify(snapshot));
  }

  function appUndo() {
    const snapshot = history.undo();
    if (!snapshot) { showSnackbar("History is empty!"); return; }
    scene_glyphs = snapshot.map(data => Glyph.deserialize(data));
    clearSelection();
    updateUISidebarVisibility();
    updateLayersUI();
    showSnackbar("Undo");
    p.redraw();
  }

  function appRedo() {
    const snapshot = history.redo();
    if (!snapshot) { showSnackbar("Nothing to redo!"); return; }
    scene_glyphs = snapshot.map(data => Glyph.deserialize(data));
    clearSelection();
    updateUISidebarVisibility();
    updateLayersUI();
    showSnackbar("Redo");
    p.redraw();
  }

  function appClearScene() {
    clearSelection();
    scene_glyphs = [];
    globalRotationValue = 0;
    if (DOM.slideGlobalRotation) DOM.slideGlobalRotation.value = 0;
    if (DOM.valGlobalRotation) DOM.valGlobalRotation.innerText = "0°";
    saveHistoryState();
    updateUISidebarVisibility();
    updateLayersUI();
    showSnackbar("Scene cleared");
  }

  // --- EXPORT & PROJECT ---

  function exportAsFormat(format) {
    const filename = (DOM.exportFilename && DOM.exportFilename.value.trim()) || "myGraphic";
    exportActive = true;
    if (format === "SVG") {
      exportSVGActive = true;
      // p5.svg doesn't natively support instance mode seamlessly in some older versions,
      // but assuming window global SVG or p.SVG exists:
      svgCanvas = p.createGraphics(p.width, p.height, p.SVG || p.window.SVG || 'svg');
      svgCanvas.background(backgroundColor);
      if (pattern_visibility) {
        const copiesX = 3, copiesY = 3;
        for (let x = -copiesX; x <= copiesX; x++) {
          for (let y = -copiesY; y <= copiesY; y++) {
            if (x === 0 && y === 0) continue;
            svgCanvas.push();
            const offset = p.createVector(x * pattern_xOffset, y * pattern_yOffset);
            offset.rotate(pattern_rotation);
            svgCanvas.translate(scene_center.x + offset.x, scene_center.y + offset.y);
            svgCanvas.scale(scene_scale);
            svgCanvas.rotate(scene_rotation);
            const c = p.color(shapeColor);
            c.setAlpha(pattern_alpha);
            const orig = shapeColor;
            shapeColor = c;
            scene_glyphs.forEach(glyph => glyph.drawScene(shapeColor, strokeCapRounded, svgCanvas));
            shapeColor = orig;
            svgCanvas.pop();
          }
        }
      }
      svgCanvas.push();
      svgCanvas.translate(scene_center.x, scene_center.y);
      svgCanvas.scale(scene_scale);
      svgCanvas.rotate(scene_rotation);
      scene_glyphs.forEach(glyph => glyph.drawScene(shapeColor, strokeCapRounded, svgCanvas));
      svgCanvas.pop();
      svgCanvas.save(`${filename}.svg`);
      exportSVGActive = false;
      svgCanvas = null;
      showSnackbar("Vector SVG exported!");
    } else if (format === "PNG") {
      p.redraw();
      p.saveCanvas(`${filename}`, 'png');
      showSnackbar("Raster PNG exported!");
    }
    exportActive = false;
  }

  // --- THEME & UTILS ---

  function applyTheme(themeKey) {
    if (themeKey === 'dark') {
      document.body.classList.add("theme-dark");
      backgroundColor = "#1e1e1e";
      shapeColor = "#ffffff";
    } else {
      document.body.classList.remove("theme-dark");
      backgroundColor = "#ffffff";
      shapeColor = "#000000";
    }
    updateUIColors();
  }
  p.applyTheme = applyTheme;

  function updateUIColors() {
    if (DOM.pickerBgColor) {
      DOM.pickerBgColor.value = backgroundColor;
      if (DOM.labelBg) DOM.labelBg.innerText = backgroundColor.toUpperCase();
    }
    if (DOM.pickerStrokeColor) {
      DOM.pickerStrokeColor.value = shapeColor;
      if (DOM.labelStroke) DOM.labelStroke.innerText = shapeColor.toUpperCase();
    }
  }

  function updateUISidebarVisibility() {
    if (!DOM.cardCorner || !DOM.cardGlyph) return;
    DOM.cardCorner.style.display = (activeMode === "corner" && selected_corner) ? "flex" : "none";
    DOM.cardGlyph.style.display = (activeMode === "glyph" && selected_glyph) ? "flex" : "none";
  }

  function showSnackbar(msg) {
    const sb = DOM.snackbar || document.getElementById("vertice-snackbar");
    if (!sb) return;
    sb.innerText = msg;
    sb.className = "show";
    if (snackbarTimeout) clearTimeout(snackbarTimeout);
    snackbarTimeout = setTimeout(() => { sb.className = ""; }, 2500);
  }

  function updateLayersUI() {
    if (!DOM.domLayersList) return;
    if (DOM.valLayersCount) DOM.valLayersCount.innerText = `Glyphs: ${scene_glyphs.length}`;
    if (scene_glyphs.length === 0) {
      DOM.domLayersList.innerHTML = `<div class="layer-item">Scene is empty</div>`;
      return;
    }
    
    // Clear the "Scene is empty" message if present
    if (DOM.domLayersList.innerHTML.includes("Scene is empty")) {
      DOM.domLayersList.innerHTML = "";
    }
    
    DOM.domLayersList.setAttribute("role", "listbox");
    DOM.domLayersList.setAttribute("aria-live", "polite");

    const flatData = [];
    scene_glyphs.forEach((glyph, gIndex) => {
      flatData.push({ type: 'glyph', glyph, index: gIndex });
      glyph.corners.forEach((corner, cIndex) => {
        flatData.push({ type: 'corner', glyph, corner, index: cIndex });
      });
    });

    diffAndUpdateDOM(
      DOM.domLayersList,
      flatData,
      (data, idx) => {
        const el = document.createElement("div");
        el.setAttribute("role", "option");
        el.tabIndex = 0; // Make focusable
        
        el.addEventListener('keydown', (e) => {
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
      },
      (el, data, idx) => {
        if (data.type === 'glyph') {
          el.className = `layer-item ${selected_glyph === data.glyph ? 'active' : ''}`;
          el.style.paddingLeft = "8px";
          el.style.borderLeft = "none";
          el.innerHTML = `<span>Glyph #${data.index + 1}</span><span class="vertex-count">Vertices: ${data.glyph.corners.length}</span>`;
          el.onclick = (e) => {
            e.stopPropagation();
            clearSelection();
            selected_glyph = data.glyph;
            selected_glyph.setActive(true);
            setAppMode("glyph");
            syncGlyphToUI();
            p.redraw();
          };
        } else {
          el.className = `layer-item ${selected_corner === data.corner ? 'active' : ''}`;
          el.style.paddingLeft = "24px";
          el.style.borderLeft = "1px dashed var(--border-color)";
          const isConn = data.glyph.connections.get(data.corner).length > 0;
          el.innerHTML = `<span>• Point #${data.index + 1} (R: ${Math.round(data.corner.radians)})</span><span class="vertex-count">${isConn ? 'Linked' : 'Single'}</span>`;
          el.onclick = (e) => {
            e.stopPropagation();
            clearSelection();
            selected_corner = data.corner;
            selected_corner.setActive(true);
            selected_glyph = data.glyph;
            setAppMode("corner");
            syncVertexToUI();
            p.redraw();
          };
        }
      }
    );
  }

  // --- INITIALIZATION ---


  function translateSelectedGlyph(dx, dy) {
    if (!selected_glyph) return;
    selected_glyph.translate(parseFloat(dx || 0), parseFloat(dy || 0));
    saveHistoryState();
    updateLayersUI();
  }

  function scaleSelectedGlyph(factor) {
    if (!selected_glyph || selected_glyph.corners.length === 0) return;
    
    // Берем в качестве опорной точки центр первой вершины глифа
    const pivot = selected_glyph.corners[0];
    selected_glyph.scale(factor, pivot);
    saveHistoryState();
  }

  function rotateSelectedGlyphFromUI(angleDegrees) {
    if (!selected_glyph || selected_glyph.corners.length === 0) return;
  
    const angle = p.radians(parseFloat(angleDegrees));
    const pivot = selected_glyph.corners[0];
    
    // Сбрасываем к исходному состоянию перед вращением, вращаем на дельту
    // или просто применяем вращение от текущего значения слайдера
    if (DOM.valGlyphRotation) DOM.valGlyphRotation.innerText = `${angleDegrees}°`;
    
    // Для плавной регулировки вращаем от центральной точки глифа
    selected_glyph.rotate(p.radians(angleDegrees - (selected_glyph.lastRotationSliderVal || 0)), pivot);
    selected_glyph.lastRotationSliderVal = angleDegrees;
  }

  function rotateAllGlyphsFromUI(angleDegrees) {
    const targetAngle = parseFloat(angleDegrees);
    const deltaDegrees = targetAngle - globalRotationValue;
    const deltaRad = p.radians(deltaDegrees);
  
    scene_glyphs.forEach(glyph => {
      if (glyph.corners.length > 0) {
        // Каждый глиф вращается вокруг своей первой вершины (локального центра)
        const pivot = glyph.corners[0];
        glyph.rotate(deltaRad, pivot);
      }
    });
  
    globalRotationValue = targetAngle;
    if (DOM.valGlobalRotation) DOM.valGlobalRotation.innerText = `${targetAngle}°`;
  }

  function createNewGlyphFromUI() {
    const newGlyph = new Glyph();
    
    // Создаем начальную вершину в текущем центре видимой области холста
    const centerOfCanvas = p.createVector(p.width / 2 - scene_center.x, p.height / 2 - scene_center.y);
    centerOfCanvas.div(scene_scale);
    centerOfCanvas.rotate(-scene_rotation);
  
    const newCorner = new Corner(centerOfCanvas, 40, newGlyph);
    newGlyph.addCorner(newCorner);
    scene_glyphs.push(newGlyph);
    
    clearSelection();
    selected_glyph = newGlyph;
    selected_glyph.setActive(true);
    selected_corner = newCorner;
    selected_corner.setActive(true);
    
    setAppMode("corner"); // Переключаемся на редактирование вершины нового глифа
    
    saveHistoryState();
    updateUISidebarVisibility();
    updateLayersUI();
    showSnackbar("New glyph created at center");
  }

  function saveProjectJSON() {
    const filename = (DOM.exportFilename.value.trim() || "project") + ".json";
    
    const projectData = {
      version: "1.0",
      backgroundColor: backgroundColor,
      shapeColor: shapeColor,
      strokeCapRounded: strokeCapRounded,
      pattern: {
        visibility: pattern_visibility,
        alpha: pattern_alpha,
        xOffset: pattern_xOffset,
        yOffset: pattern_yOffset,
        rotation: pattern_rotation
      },
      glyphs: scene_glyphs.map(glyph => {
        // Сохраняем вершины
        const cornersData = glyph.corners.map(corner => ({
          x: corner.center.x,
          y: corner.center.y,
          radians: corner.radians,
          scale: corner.scale
        }));
  
        // Сохраняем индексы связей
        const connectionsData = [];
        glyph.connections.forEach((neighbors, corner) => {
          const cIndex = glyph.corners.indexOf(corner);
          const nIndices = neighbors.map(n => glyph.corners.indexOf(n));
          connectionsData.push({
            cornerIndex: cIndex,
            neighborIndices: nIndices
          });
        });
  
        return {
          corners: cornersData,
          connections: connectionsData
        };
      })
    };
  
    // Скачивание файла
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    showSnackbar("Project saved!");
  }

  function loadProjectJSON() {
    document.getElementById("import-json-file").click();
  }

  function handleImportJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        
        // Загружаем глобальные стили
        if (data.backgroundColor) backgroundColor = data.backgroundColor;
        if (data.shapeColor) shapeColor = data.shapeColor;
        if (data.strokeCapRounded !== undefined) strokeCapRounded = data.strokeCapRounded;
        
        if (data.pattern) {
          pattern_visibility = data.pattern.visibility;
          pattern_alpha = data.pattern.alpha;
          pattern_xOffset = data.pattern.xOffset;
          pattern_yOffset = data.pattern.yOffset;
          pattern_rotation = data.pattern.rotation;
        }
  
        // Воссоздаем глифы
        const loadedGlyphs = [];
        data.glyphs.forEach(glyphData => {
          const glyph = new Glyph();
          
          // Воссоздаем вершины
          glyphData.corners.forEach(cData => {
            const corner = new Corner(p.createVector(cData.x, cData.y), cData.radians, glyph);
            corner.scale = cData.scale;
            glyph.addCorner(corner);
          });
  
          // Воссоздаем связи
          glyphData.connections.forEach(conn => {
            const mainCorner = glyph.corners[conn.cornerIndex];
            conn.neighborIndices.forEach(nIndex => {
              const neighborCorner = glyph.corners[nIndex];
              // Поскольку connections в классе двунаправленные, проверяем, чтобы не дублировать
              if (!glyph.isConnected(mainCorner, neighborCorner)) {
                glyph.connectCorners(mainCorner, neighborCorner);
              }
            });
          });
  
          loadedGlyphs.push(glyph);
        });
  
        // Перезаписываем сцену
        scene_glyphs = loadedGlyphs;
        clearSelection();
        
        // Сбрасываем историю на новое состояние
        undoHistory = [];
        saveHistoryState();
  
        // Сбрасываем глобальный поворот на 0, так как импортируется новая сцена
        globalRotationValue = 0;
        if (DOM.slideGlobalRotation) DOM.slideGlobalRotation.value = 0;
        if (DOM.valGlobalRotation) DOM.valGlobalRotation.innerText = "0°";
  
        // Синхронизируем UI элементы
        updateUIColors();
        updateColorsFromUI();
        syncPatternToUI();
        
        if (DOM.checkPatternVisible) DOM.checkPatternVisible.checked = pattern_visibility;
        if (DOM.checkStrokeRounded) DOM.checkStrokeRounded.checked = strokeCapRounded;
        if (DOM.slidePatternAlpha) DOM.slidePatternAlpha.value = pattern_alpha;
        
        updateUISidebarVisibility();
        updateLayersUI();
        
        showSnackbar("Project imported successfully!");
      } catch (err) {
        showSnackbar("Error reading JSON project file!");
        console.error(err);
      }
    };
    reader.readAsText(file);
    // Очищаем значение, чтобы можно было загрузить тот же файл повторно
    event.target.value = "";
  }

  function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
  }

  function handleBgImageUpload(input) {
    const file = input.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      p.loadImage(dataUrl, img => {
        bgImage = img;
        
        // Показываем кнопку удаления
        if (DOM.btnRemoveBgImage) DOM.btnRemoveBgImage.style.display = "block";
        
        showSnackbar("Background image loaded successfully!");
        p.redraw();
      }, () => {
        showSnackbar("Failed to load image!");
      });
    };
    reader.readAsDataURL(file);
    
    // Сбрасываем значение инпута
    input.value = "";
  }

  function updateBgImageSettingsFromUI() {
    if (DOM.slideBgOpacity) {
      bgImageOpacity = parseFloat(DOM.slideBgOpacity.value);
      if (DOM.valBgOpacity) DOM.valBgOpacity.innerText = bgImageOpacity + "%";
    }
    
    if (DOM.slideBgScale) {
      bgImageScale = parseFloat(DOM.slideBgScale.value);
      if (DOM.valBgScale) DOM.valBgScale.innerText = bgImageScale + "%";
    }
    
    if (DOM.slideBgRotation) {
      bgImageRotation = parseFloat(DOM.slideBgRotation.value);
      if (DOM.valBgRotation) DOM.valBgRotation.innerText = bgImageRotation + "°";
    }
    
    if (DOM.inputBgX) {
      bgImageX = parseFloat(DOM.inputBgX.value) || 0;
    }
    
    if (DOM.inputBgY) {
      bgImageY = parseFloat(DOM.inputBgY.value) || 0;
    }
  
    p.redraw();
  }

  function removeBgImage() {
    bgImage = null;
    
    // Сбрасываем значения стейта
    bgImageOpacity = 50;
    bgImageScale = 100;
    bgImageRotation = 0;
    bgImageX = 0;
    bgImageY = 0;
    
    // Синхронизируем UI
    if (DOM.slideBgOpacity) DOM.slideBgOpacity.value = 50;
    if (DOM.valBgOpacity) DOM.valBgOpacity.innerText = "50%";
    if (DOM.slideBgScale) DOM.slideBgScale.value = 100;
    if (DOM.valBgScale) DOM.valBgScale.innerText = "100%";
    if (DOM.slideBgRotation) DOM.slideBgRotation.value = 0;
    if (DOM.valBgRotation) DOM.valBgRotation.innerText = "0°";
    if (DOM.inputBgX) DOM.inputBgX.value = 0;
    if (DOM.inputBgY) DOM.inputBgY.value = 0;
    
    // Скрываем кнопку удаления
    if (DOM.btnRemoveBgImage) DOM.btnRemoveBgImage.style.display = "none";
    
    showSnackbar("Background image removed.");
    p.redraw();
  }


  function togglePatternVisible(visible) {
    pattern_visibility = visible;
  }

  function toggleStrokeCapRounded(rounded) {
    strokeCapRounded = rounded;
  }

  function updateColorsFromUI() {
    backgroundColor = DOM.pickerBgColor.value;
    shapeColor = DOM.pickerStrokeColor.value;
    
    // Принудительно обновляем цвет заднего фона у контейнера canvas
    const canvasContainer = document.getElementById("canvas-container");
    if (canvasContainer) {
      canvasContainer.style.backgroundColor = backgroundColor;
    }
  }

  function cacheDomElements() {
    DOM = {
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

  function setupEventListeners() {
    // Collapsible sections
    document.querySelectorAll('#app-vertice .panel-section h2.section-title').forEach(h => {
      h.addEventListener('click', () => h.closest('.panel-section').classList.toggle('collapsed'));
    });

    if (DOM.btnModeCorner) DOM.btnModeCorner.addEventListener('click', () => setAppMode('corner'));
    if (DOM.btnModeGlyph) DOM.btnModeGlyph.addEventListener('click', () => setAppMode('glyph'));
    if (DOM.btnModeScene) DOM.btnModeScene.addEventListener('click', () => setAppMode('scene'));

    // Vertex inputs
    if (DOM.inputVertexX) DOM.inputVertexX.addEventListener('input', updateSelectedVertexFromUI);
    if (DOM.inputVertexY) DOM.inputVertexY.addEventListener('input', updateSelectedVertexFromUI);
    if (DOM.slideVertexRadius) DOM.slideVertexRadius.addEventListener('input', updateSelectedVertexFromUI);
    
    const btnDelVert = document.getElementById("v-btn-delete-vertex");
    if (btnDelVert) btnDelVert.addEventListener('click', deleteSelectedVertex);
    const btnSplitVert = document.getElementById("v-btn-disconnect-vertex");
    if (btnSplitVert) btnSplitVert.addEventListener('click', disconnectSelectedVertex);

    // Pattern inputs
    if (DOM.checkPatternVisible) DOM.checkPatternVisible.addEventListener('change', e => togglePatternVisible(e.target.checked));
    if (DOM.slidePatternXOffset) DOM.slidePatternXOffset.addEventListener('input', updatePatternFromUI);
    if (DOM.slidePatternYOffset) DOM.slidePatternYOffset.addEventListener('input', updatePatternFromUI);
    if (DOM.slidePatternRotation) DOM.slidePatternRotation.addEventListener('input', updatePatternFromUI);
    if (DOM.slidePatternAlpha) DOM.slidePatternAlpha.addEventListener('input', updatePatternFromUI);

    // Style inputs
    if (DOM.checkStrokeRounded) DOM.checkStrokeRounded.addEventListener('change', e => {
      strokeCapRounded = e.target.checked;
    });
    if (DOM.pickerBgColor) DOM.pickerBgColor.addEventListener('input', () => {
      backgroundColor = DOM.pickerBgColor.value;
      if (DOM.labelBg) DOM.labelBg.innerText = backgroundColor.toUpperCase();
    });
    if (DOM.pickerStrokeColor) DOM.pickerStrokeColor.addEventListener('input', () => {
      shapeColor = DOM.pickerStrokeColor.value;
      if (DOM.labelStroke) DOM.labelStroke.innerText = shapeColor.toUpperCase();
    });

    // Top menu
    document.getElementById("v-btn-export-svg")?.addEventListener('click', () => exportAsFormat("SVG"));
    document.getElementById("v-btn-export-png")?.addEventListener('click', () => exportAsFormat("PNG"));
    document.getElementById("v-btn-reset")?.addEventListener('click', () => {
      if (confirm("Reset scene?")) appClearScene();
    });

    // Keyboard
    window.addEventListener('keydown', handleKeyDown);
  }

  // Expose UI functions to global window for inline HTML handlers
  window.appClearScene = appClearScene;
  window.appUndo = appUndo;
  window.closeModal = closeModal;
  window.createNewGlyphFromUI = createNewGlyphFromUI;
  window.deleteSelectedGlyph = deleteSelectedGlyph;
  window.deleteSelectedVertex = deleteSelectedVertex;
  window.disconnectSelectedVertex = disconnectSelectedVertex;
  window.exportAsFormat = exportAsFormat;
  window.handleBgImageUpload = handleBgImageUpload;
  window.loadProjectJSON = loadProjectJSON;
  window.removeBgImage = removeBgImage;
  window.rotateAllGlyphsFromUI = rotateAllGlyphsFromUI;
  window.rotateSelectedGlyphFromUI = rotateSelectedGlyphFromUI;
  window.saveHistoryState = saveHistoryState;
  window.saveProjectJSON = saveProjectJSON;
  window.scaleSelectedGlyph = scaleSelectedGlyph;
  window.setAppMode = setAppMode;
  window.showModal = showModal;
  window.togglePatternVisible = togglePatternVisible;
  window.toggleStrokeCapRounded = toggleStrokeCapRounded;
  window.translateSelectedGlyph = translateSelectedGlyph;
  window.updateBgImageSettingsFromUI = updateBgImageSettingsFromUI;
  window.updateColorsFromUI = updateColorsFromUI;
  window.updatePatternFromUI = updatePatternFromUI;
  window.updateSelectedVertexFromUI = updateSelectedVertexFromUI;
}
