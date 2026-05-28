import { createUIManager } from "./ui/UIManager.js";
import { createAppController } from "./controllers/AppController.js";
import { env } from "./Config.js";
/**
 * VERTICE - ГЛАВНЫЙ КОНТРОЛЛЕР (p5 Instance Mode + ES6 Modules)
 * 
 * Экспортирует функцию скетча для вызова через `new p5(verticeSketch, container)`
 */

import { createCornerClass } from './corner.js';
import { createGlyphClass } from './glyph.js';
import { HistoryManager } from '../../js/HistoryManager.js';
import { GlyphRenderer } from './ui/GlyphRenderer.js';
import { diffAndUpdateDOM } from '../../js/ui-utils.js';
export function verticeSketch(p) {
  // --- НАСТРОЙКА МОДУЛЕЙ ---
  const Corner = createCornerClass(p);
  const Glyph = createGlyphClass(p, Corner);
  const history = new HistoryManager(30);
  env.UIManager = createUIManager(p, { env, Glyph });
  env.AppController = createAppController(p, { env, Glyph, Corner, history, UIManager: env.UIManager });


  // --- СОСТОЯНИЕ ---

  // "corner", "glyph", "scene"

  let snackbarTimeout = null;

  // --- ЖИЗНЕННЫЙ ЦИКЛ p5 ---

  p.setup = function () {
    env.GlyphRenderer = new GlyphRenderer(p);
    const container = document.getElementById("vertice-canvas");
    p.createCanvas(container.clientWidth, container.clientHeight);
    env.scene_center = p.createVector(p.width / 2, p.height / 2);
    env.mouse = p.createVector(0, 0);
    env.UIManager.cacheDomElements();
    env.AppController.setupEventListeners();
    env.UIManager.updateUIColors();
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
          env.scene_glyphs = snapshot.map(data => Glyph.deserialize(data));
          env.AppController.clearSelection();
          if (env.scene_glyphs.length > 0) {
            env.selected_glyph = env.scene_glyphs[env.scene_glyphs.length - 1];
            if (env.selected_glyph.corners.length > 0) {
              env.selected_corner = env.selected_glyph.corners[0];
            }
          }
        } else {
          env.AppController.createInitialDemoScene();
        }
      } catch (e) {
        console.error("Auto-save load failed:", e);
        env.AppController.createInitialDemoScene();
      }
    } else {
      env.AppController.createInitialDemoScene();
    }
    env.AppController.saveHistoryState();
    
    env.UIManager.updateUISidebarVisibility();
    env.UIManager.updateLayersUI();
  };
  p.draw = function () {
    calculateLocalMouse();
    p.background(env.backgroundColor);
    if (env.bgImage) {
      p.push();
      p.translate(env.scene_center.x, env.scene_center.y);
      p.scale(env.scene_scale);
      p.rotate(env.scene_rotation);
      p.translate(env.bgImageX, env.bgImageY);
      p.rotate(p.radians(env.bgImageRotation));
      p.scale(env.bgImageScale / 100);
      p.tint(255, env.bgImageOpacity * 2.55);
      p.imageMode(p.CENTER);
      p.image(env.bgImage, 0, 0);
      p.pop();
    }
    if (env.pattern_visibility) {
      drawPattern();
    }
    p.push();
    p.translate(env.scene_center.x, env.scene_center.y);
    p.scale(env.scene_scale);
    p.rotate(env.scene_rotation);
    env.scene_glyphs.forEach(glyph => {
      env.GlyphRenderer.drawScene(glyph, env.shapeColor, env.strokeCapRounded);
    });
    if (!env.exportActive) {
      env.scene_glyphs.forEach(glyph => {
        env.GlyphRenderer.drawActiveButton(glyph, env.shapeColor, env.backgroundColor, env.activeMode, env.mouse);
      });
    }
    p.pop();
  };
  p.windowResized = function () {
    const container = document.getElementById("vertice-canvas");
    if (container) {
      p.resizeCanvas(container.clientWidth, container.clientHeight);
      env.scene_center.set(p.width / 2, p.height / 2);
    }
  };
  function calculateLocalMouse() {
    let m = p.createVector(p.mouseX - env.scene_center.x, p.mouseY - env.scene_center.y);
    m.div(env.scene_scale);
    m.rotate(-env.scene_rotation);
    env.mouse = m;
  }
  function drawPattern() {
    const copiesX = 3;
    const copiesY = 3;
    const originalAlpha = p.drawingContext.globalAlpha;
    p.drawingContext.globalAlpha = env.pattern_alpha / 255;
    
    p.drawingContext.fillStyle = env.shapeColor.toString();
    p.drawingContext.beginPath();

    for (let x = -copiesX; x <= copiesX; x++) {
      for (let y = -copiesY; y <= copiesY; y++) {
        if (x === 0 && y === 0) continue;
        p.push();
        const offset = p.createVector(x * env.pattern_xOffset, y * env.pattern_yOffset);
        offset.rotate(env.pattern_rotation);
        p.translate(env.scene_center.x + offset.x, env.scene_center.y + offset.y);
        p.scale(env.scene_scale);
        p.rotate(env.scene_rotation);
        env.scene_glyphs.forEach(glyph => {
          env.GlyphRenderer.addSceneToPath(glyph, p.drawingContext, env.strokeCapRounded);
        });
        p.pop();
      }
    }
    
    p.drawingContext.fill();
    p.drawingContext.globalAlpha = originalAlpha;
  }

  // --- МЫШЬ ---

  p.mousePressed = function (e) {
    
    let evt = e || window.event;
    if (evt && evt.target && evt.target.tagName !== "CANVAS") return;
    if (!evt) {
        // Fallback for missing event object in p5
        const hovered = document.elementFromPoint(p.mouseX + (p.canvas.getBoundingClientRect().left || 0), p.mouseY + (p.canvas.getBoundingClientRect().top || 0));
        if (hovered && hovered.tagName !== "CANVAS") return;
    }
  
    const sidebar = document.querySelector('#app-vertice .sidebar');
    if (sidebar && p.mouseX > p.width - sidebar.clientWidth) return;
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;
    calculateLocalMouse();
    if (env.activeMode === "corner") {
      let hitCorner = null;
      for (const glyph of env.scene_glyphs) {
        for (const corner of glyph.corners) {
          if (corner.checkHoverButton(env.mouse) || corner.checkHover(env.mouse)) {
            hitCorner = corner;
            break;
          }
        }
        if (hitCorner) break;
      }
      if (hitCorner) {
        env.AppController.clearSelection();
        env.selected_corner = hitCorner;
        env.selected_corner.setActive(true);
        env.selected_corner.checkDrag(env.mouse);
        env.UIManager.syncVertexToUI();
    env.UIManager.updateUISidebarVisibility();
        env.UIManager.updateLayersUI();
      } else {
        const currentGlyph = env.selected_glyph || (env.scene_glyphs.length > 0 ? env.scene_glyphs[env.scene_glyphs.length - 1] : null);
        if (currentGlyph) {
          const newCorner = new Corner({
            x: env.mouse.x,
            y: env.mouse.y
          }, 30, currentGlyph);
          const prevCorner = env.selected_corner;
          currentGlyph.addCorner(newCorner);
          if (prevCorner && prevCorner.glyph === currentGlyph) {
            currentGlyph.connectCorners(prevCorner, newCorner);
          }
          env.AppController.clearSelection();
          env.selected_corner = newCorner;
          env.selected_corner.setActive(true);
          env.AppController.saveHistoryState();
          env.UIManager.syncVertexToUI();
    env.UIManager.updateUISidebarVisibility();
          env.UIManager.updateLayersUI();
          env.UIManager.showSnackbar("Vertex added");
        } else {
          const newGlyph = new Glyph();
          const newCorner = new Corner({
            x: env.mouse.x,
            y: env.mouse.y
          }, 30, newGlyph);
          newGlyph.addCorner(newCorner);
          env.scene_glyphs.push(newGlyph);
          env.AppController.clearSelection();
          env.selected_corner = newCorner;
          env.selected_corner.setActive(true);
          env.selected_glyph = newGlyph;
          env.AppController.saveHistoryState();
          env.UIManager.syncVertexToUI();
    env.UIManager.updateUISidebarVisibility();
          env.UIManager.updateLayersUI();
          env.UIManager.showSnackbar("Glyph and vertex created");
        }
      }
    } else if (env.activeMode === "glyph") {
      let hitGlyph = null;
      for (const glyph of env.scene_glyphs) {
        for (const corner of glyph.corners) {
          if (corner.checkHover(env.mouse)) {
            hitGlyph = glyph;
            break;
          }
        }
        if (hitGlyph) break;
      }
      if (hitGlyph) {
        env.AppController.clearSelection();
        env.selected_glyph = hitGlyph;
        env.selected_glyph.setActive(true);
        env.glyphDragStart = p.createVector(env.mouse.x, env.mouse.y);
        env.UIManager.syncGlyphToUI();
    env.UIManager.updateUISidebarVisibility();
        env.UIManager.updateLayersUI();
      } else {
        env.AppController.clearSelection();
    env.UIManager.updateUISidebarVisibility();
        env.UIManager.updateLayersUI();
      }
    } else if (env.activeMode === "scene") {
      if (p.keyIsDown(p.SHIFT)) {
        env.patternDragStart = p.createVector(p.mouseX, p.mouseY);
      } else {
        env.sceneDragging = true;
        env.sceneDragStart = p.createVector(p.mouseX - env.scene_center.x, p.mouseY - env.scene_center.y);
      }
    }
  };
  p.mouseDragged = function (e) {
    
    let evt = e || window.event;
    if (evt && evt.target && evt.target.tagName !== "CANVAS") return;
    if (!evt) {
        // Fallback for missing event object in p5
        const hovered = document.elementFromPoint(p.mouseX + (p.canvas.getBoundingClientRect().left || 0), p.mouseY + (p.canvas.getBoundingClientRect().top || 0));
        if (hovered && hovered.tagName !== "CANVAS") return;
    }
  
    calculateLocalMouse();
    if (env.activeMode === "corner" && env.selected_corner && env.selected_corner.dragging) {
      env.selected_corner.drag(env.mouse);
      env.UIManager.syncVertexToUI();
    } else if (env.activeMode === "glyph" && env.selected_glyph && env.glyphDragStart) {
      const dx = env.mouse.x - env.glyphDragStart.x;
      const dy = env.mouse.y - env.glyphDragStart.y;
      env.selected_glyph.translate(dx, dy);
      env.glyphDragStart.set(env.mouse.x, env.mouse.y);
    } else if (env.activeMode === "scene") {
      if (p.keyIsDown(p.SHIFT) && env.patternDragStart) {
        const dx = p.mouseX - env.patternDragStart.x;
        const dy = p.mouseY - env.patternDragStart.y;
        env.pattern_xOffset += dx;
        env.pattern_yOffset += dy;
        env.patternDragStart.set(p.mouseX, p.mouseY);
        env.UIManager.syncPatternToUI();
      } else if (env.sceneDragging && env.sceneDragStart) {
        env.scene_center.x = p.mouseX - env.sceneDragStart.x;
        env.scene_center.y = p.mouseY - env.sceneDragStart.y;
      }
    }
  };
  p.mouseReleased = function (e) {
    
    let evt = e || window.event;
    if (evt && evt.target && evt.target.tagName !== "CANVAS") return;
    if (!evt) {
        // Fallback for missing event object in p5
        const hovered = document.elementFromPoint(p.mouseX + (p.canvas.getBoundingClientRect().left || 0), p.mouseY + (p.canvas.getBoundingClientRect().top || 0));
        if (hovered && hovered.tagName !== "CANVAS") return;
    }
  
    if (env.selected_corner && env.selected_corner.dragging) {
      env.selected_corner.endDrag();
      env.AppController.saveHistoryState();
    }
    if (env.glyphDragStart) {
      env.glyphDragStart = null;
      env.AppController.saveHistoryState();
    }
    env.sceneDragging = false;
    env.sceneDragStart = null;
    env.patternDragStart = null;
  };

  // --- TOUCH HANDLERS ---
  p.touchStarted = function (e) {
    p.mousePressed(e);
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) return false;
  };
  p.touchMoved = function (e) {
    p.mouseDragged(e);
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) return false;
  };
  p.touchEnded = function (e) {
    p.mouseReleased(e);
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) return false;
  };
  p.doubleClicked = function (e) {
    
    let evt = e || window.event;
    if (evt && evt.target && evt.target.tagName !== "CANVAS") return;
    if (!evt) {
        // Fallback for missing event object in p5
        const hovered = document.elementFromPoint(p.mouseX + (p.canvas.getBoundingClientRect().left || 0), p.mouseY + (p.canvas.getBoundingClientRect().top || 0));
        if (hovered && hovered.tagName !== "CANVAS") return;
    }
  
    const sidebar = document.querySelector('#app-vertice .sidebar');
    if (sidebar && p.mouseX > p.width - sidebar.clientWidth) return;
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;
    calculateLocalMouse();
    if (env.activeMode === "corner") {
      let hitCorner = null;
      for (const glyph of env.scene_glyphs) {
        for (const corner of glyph.corners) {
          if (corner.checkHover(env.mouse)) {
            hitCorner = corner;
            break;
          }
        }
      }
      if (hitCorner) {
        if (!env.firstCornerToConnect) {
          env.firstCornerToConnect = hitCorner;
          env.UIManager.showSnackbar("Select second vertex to connect");
        } else {
          if (env.firstCornerToConnect !== hitCorner) {
            const g1 = env.firstCornerToConnect.glyph;
            const g2 = hitCorner.glyph;
            if (g1 === g2) {
              g1.connectCorners(env.firstCornerToConnect, hitCorner);
              env.UIManager.showSnackbar("Vertices connected");
            } else {
              g1.mergeGlyph(g2);
              g1.connectCorners(env.firstCornerToConnect, hitCorner);
              env.scene_glyphs = env.scene_glyphs.filter(g => g !== g2);
              env.UIManager.showSnackbar("Glyphs merged and connected");
            }
            env.AppController.saveHistoryState();
            env.UIManager.updateLayersUI();
          }
          env.firstCornerToConnect = null;
        }
      }
    } else if (env.activeMode === "glyph") {
      let hitAny = false;
      for (const glyph of env.scene_glyphs) {
        for (const corner of glyph.corners) {
          if (corner.checkHover(env.mouse)) {
            hitAny = true;
            break;
          }
        }
      }
      if (!hitAny) {
        const newGlyph = new Glyph();
        const newCorner = new Corner({
          x: env.mouse.x,
          y: env.mouse.y
        }, 40, newGlyph);
        newGlyph.addCorner(newCorner);
        env.scene_glyphs.push(newGlyph);
        env.AppController.clearSelection();
        env.selected_glyph = newGlyph;
        env.selected_glyph.setActive(true);
        env.selected_corner = newCorner;
        env.selected_corner.setActive(true);
        env.AppController.saveHistoryState();
    env.UIManager.updateUISidebarVisibility();
        env.UIManager.updateLayersUI();
        env.UIManager.showSnackbar("New glyph created");
      }
    }
  };
  p.mouseWheel = function (event) {
    const sidebar = document.querySelector('#app-vertice .sidebar');
    if (sidebar && p.mouseX > p.width - sidebar.clientWidth) return;
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;
    calculateLocalMouse();
    const scaleSpeed = 0.05;
    if (env.activeMode === "corner") {
      let hitCorner = null;
      for (const glyph of env.scene_glyphs) {
        for (const corner of glyph.corners) {
          if (corner.checkHover(env.mouse)) {
            hitCorner = corner;
            break;
          }
        }
      }
      if (hitCorner) {
        hitCorner.setRadians(event.deltaY < 0 ? 5 : -5);
        env.UIManager.syncVertexToUI();
        return false;
      }
    } else if (env.activeMode === "glyph" && env.selected_glyph) {
      if (p.keyIsDown(p.SHIFT)) {
        env.selected_glyph.rotate(event.deltaY < 0 ? p.radians(5) : p.radians(-5), env.mouse);
        env.UIManager.syncGlyphToUI();
      } else {
        env.selected_glyph.scale(event.deltaY < 0 ? 0.05 : -0.05, env.mouse);
      }
      return false;
    } else if (env.activeMode === "scene") {
      if (p.keyIsDown(p.SHIFT)) {
        env.pattern_rotation += event.deltaY < 0 ? p.radians(2) : p.radians(-2);
        env.UIManager.syncPatternToUI();
      } else {
        const factor = event.deltaY < 0 ? 1 + scaleSpeed : 1 - scaleSpeed;
        env.scene_scale = p.constrain(env.scene_scale * factor, 0.1, 10);
      }
      return false;
    }
  };

  // --- UI ACTIONS ---

  // --- HISTORY (UNDO / REDO) ---

  // --- EXPORT & PROJECT ---

  // --- THEME & UTILS ---

  p.applyTheme = env.UIManager.applyTheme;

  // --- INITIALIZATION ---

  // Expose UI functions to global window for inline HTML handlers
  window.appClearScene = env.AppController.appClearScene;
  window.appUndo = env.AppController.appUndo;
  window.closeModal = env.UIManager.closeModal;
  window.createNewGlyphFromUI = env.AppController.createNewGlyphFromUI;
  window.deleteSelectedGlyph = env.AppController.deleteSelectedGlyph;
  window.deleteSelectedVertex = env.AppController.deleteSelectedVertex;
  window.disconnectSelectedVertex = env.AppController.disconnectSelectedVertex;
  window.exportAsFormat = env.AppController.exportAsFormat;
  window.handleBgImageUpload = env.AppController.handleBgImageUpload;
  window.loadProjectJSON = env.AppController.loadProjectJSON;
  window.removeBgImage = env.AppController.removeBgImage;
  window.rotateAllGlyphsFromUI = env.AppController.rotateAllGlyphsFromUI;
  window.rotateSelectedGlyphFromUI = env.AppController.rotateSelectedGlyphFromUI;
  window.saveHistoryState = env.AppController.saveHistoryState;
  window.saveProjectJSON = env.AppController.saveProjectJSON;
  window.scaleSelectedGlyph = env.AppController.scaleSelectedGlyph;
  window.setAppMode = env.AppController.setAppMode;
  window.showModal = env.UIManager.showModal;
  window.togglePatternVisible = env.AppController.togglePatternVisible;
  window.toggleStrokeCapRounded = env.AppController.toggleStrokeCapRounded;
  window.translateSelectedGlyph = env.AppController.translateSelectedGlyph;
  window.updateBgImageSettingsFromUI = env.AppController.updateBgImageSettingsFromUI;
  window.updateColorsFromUI = env.AppController.updateColorsFromUI;
  window.updatePatternFromUI = env.AppController.updatePatternFromUI;
  window.updateSelectedVertexFromUI = env.AppController.updateSelectedVertexFromUI;
}