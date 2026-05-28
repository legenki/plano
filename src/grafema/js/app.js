import { createUIManager } from "./ui/UIManager.js";
import { createAppController } from "./controllers/AppController.js";
import { env } from "./Config.js";
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
  env.UIManager = createUIManager(p, { env, Glyph });
  env.AppController = createAppController(p, { env, Glyph, history, UIManager: env.UIManager });


  // --- STATE ---

  // Background Reference Image

  let snackbarTimeout = null;

  // --- P5 LIFECYCLE ---

  p.setup = function () {
    const container = document.getElementById('grafema-canvas');
    p.createCanvas(container.clientWidth, container.clientHeight);
    p.angleMode(p.DEGREES);
    env.UIManager.cacheDomElements();
    env.UIManager.applyTheme('light');
    env.UIManager.buildLetterGrid();
    env.AppController.setupEventListeners();
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
          env.glyphs = snapshot.map(data => Glyph.deserialize(data));
          env.AppController.setActiveGlyph(env.glyphs[env.glyphs.length - 1]);
          env.UIManager.updateLayersList();
          history.clear();
          history.save(snapshot);
        } else {
          env.AppController.resetCanvas();
        }
      } catch (e) {
        console.error("Auto-save load failed:", e);
        env.AppController.resetCanvas();
      }
    } else {
      env.AppController.resetCanvas();
    }
  };
  p.draw = function () {
    p.background(env.bgColor);

    // Background reference image
    if (env.bgImage) {
      p.push();
      p.translate(p.width / 2 + env.bgImageX, p.height / 2 + env.bgImageY);
      p.rotate(env.bgImageRotation);
      p.scale(env.bgImageScale / 100);
      p.tint(255, env.bgImageOpacity * 2.55);
      p.imageMode(p.CENTER);
      p.image(env.bgImage, 0, 0);
      p.pop();
    }
    if (env.interactionState.showGrid) {
      drawGrid();
    }

    // Draw inactive glyphs
    for (let i = 0; i < env.glyphs.length; i++) {
      if (env.glyphs[i] !== env.activeGlyph) {
        env.glyphs[i].display(env.textColor, env.textColorMute, env.textColorFocus, env.glyphWeight);
      }
    }

    // Draw active glyph with overlay on top
    if (env.activeGlyph !== null) {
      env.activeGlyph.display(env.textColor, env.textColorMute, env.textColorFocus, env.glyphWeight);
      drawSelectionOverlay();
    }
  };
  p.windowResized = function () {
    const container = document.getElementById('grafema-canvas');
    if (container) {
      p.resizeCanvas(container.clientWidth, container.clientHeight);
    }
  };

  // --- VISUAL GUIDES ---

  function drawGrid() {
    const isDarkBg = p.brightness(env.bgColor) < 50;
    p.stroke(isDarkBg ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)');
    p.strokeWeight(1);
    const step = 60;
    for (let x = 0; x < p.width; x += step) p.line(x, 0, x, p.height);
    for (let y = 0; y < p.height; y += step) p.line(0, y, p.width, y);
  }
  function drawSelectionOverlay() {
    env.activeGlyph.updateDimensions();
    p.push();
    p.stroke(env.textColorFocus);
    p.strokeWeight(1.2);
    p.noFill();

    // Dashed outline
    p.drawingContext.setLineDash([6, 6]);
    p.beginShape();
    p.vertex(env.activeGlyph.topLeft.x, env.activeGlyph.topLeft.y);
    p.vertex(env.activeGlyph.topRight.x, env.activeGlyph.topRight.y);
    p.vertex(env.activeGlyph.bottomRight.x, env.activeGlyph.bottomRight.y);
    p.vertex(env.activeGlyph.bottomLeft.x, env.activeGlyph.bottomLeft.y);
    p.endShape(p.CLOSE);
    p.drawingContext.setLineDash([]);

    // Crosshair in center
    const crossSize = 6;
    p.line(env.activeGlyph.position.x - crossSize, env.activeGlyph.position.y, env.activeGlyph.position.x + crossSize, env.activeGlyph.position.y);
    p.line(env.activeGlyph.position.x, env.activeGlyph.position.y - crossSize, env.activeGlyph.position.x, env.activeGlyph.position.y + crossSize);

    // Rotation handle
    const upVec = p.createVector(0, -1).rotate(env.activeGlyph.rotation);
    const rotHandlePos = p5.Vector.add(env.activeGlyph.position, p5.Vector.mult(upVec, env.activeGlyph.size / 2 + 30));
    const topCenter = p5.Vector.add(env.activeGlyph.position, p5.Vector.mult(upVec, env.activeGlyph.size / 2));
    p.line(topCenter.x, topCenter.y, rotHandlePos.x, rotHandlePos.y);
    const pulseSize = 10 + p.sin(p.frameCount * 6) * 1.5;
    p.fill(env.bgColor);
    p.strokeWeight(2);
    p.ellipse(rotHandlePos.x, rotHandlePos.y, pulseSize, pulseSize);

    // Scale thumb
    p.rectMode(p.CENTER);
    p.fill(env.bgColor);
    p.rect(env.activeGlyph.bottomRight.x, env.activeGlyph.bottomRight.y, 10, 10);
    p.pop();
  }

  // --- MOUSE HANDLERS ---

  p.mousePressed = function (e) {
    if (e && e.target && e.target.tagName !== "CANVAS") return;
    // Ignore clicks on sidebar area
    const sidebar = document.querySelector('#app-grafema .sidebar');
    if (sidebar && p.mouseX > p.width - sidebar.clientWidth - 20) return;
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;
    if (env.activeGlyph !== null) {
      // 1. Rotation handle hit test
      const upVec = p.createVector(0, -1).rotate(env.activeGlyph.rotation);
      const rotHandlePos = p5.Vector.add(env.activeGlyph.position, p5.Vector.mult(upVec, env.activeGlyph.size / 2 + 30));
      if (p.dist(p.mouseX, p.mouseY, rotHandlePos.x, rotHandlePos.y) < 15) {
        env.interactionState.isRotating = true;
        return;
      }
      // 2. Scale handle hit test
      if (p.dist(p.mouseX, p.mouseY, env.activeGlyph.bottomRight.x, env.activeGlyph.bottomRight.y) < 15) {
        env.interactionState.isScaling = true;
        env.interactionState.startScaleDist = p.dist(p.mouseX, p.mouseY, env.activeGlyph.position.x, env.activeGlyph.position.y);
        env.interactionState.startGlyphSize = env.activeGlyph.size;
        return;
      }
    }

    // 3. Select glyph under cursor
    for (let i = env.glyphs.length - 1; i >= 0; i--) {
      if (env.glyphs[i].isHovered(p.mouseX, p.mouseY)) {
        env.AppController.setActiveGlyph(env.glyphs[i]);
        env.interactionState.isDragging = true;
        env.interactionState.dragOffsetX = p.mouseX - env.glyphs[i].position.x;
        env.interactionState.dragOffsetY = p.mouseY - env.glyphs[i].position.y;
        return;
      }
    }

    // 4. Click outside to deselect
    env.AppController.setActiveGlyph(null);
  };
  p.mouseDragged = function (e) {
    if (e && e.target && e.target.tagName !== "CANVAS") return;
    if (env.activeGlyph === null) return;
    if (env.interactionState.isDragging) {
      env.activeGlyph.position.x = p.mouseX - env.interactionState.dragOffsetX;
      env.activeGlyph.position.y = p.mouseY - env.interactionState.dragOffsetY;
      env.UIManager.syncSidebarInputs();
    } else if (env.interactionState.isRotating) {
      const mouseVec = p.createVector(p.mouseX - env.activeGlyph.position.x, p.mouseY - env.activeGlyph.position.y);
      let angle = mouseVec.heading() + 90;
      env.activeGlyph.rotation = (angle + 360) % 360;
      env.UIManager.syncSidebarInputs();
    } else if (env.interactionState.isScaling) {
      const currentDist = p.dist(p.mouseX, p.mouseY, env.activeGlyph.position.x, env.activeGlyph.position.y);
      let scaleRatio = currentDist / env.interactionState.startScaleDist;
      env.activeGlyph.size = p.constrain(env.interactionState.startGlyphSize * scaleRatio, 100, 500);
      env.UIManager.syncSidebarInputs();
    }
  };
  p.mouseReleased = function (e) {
    if (e && e.target && e.target.tagName !== "CANVAS") return;
    if (env.interactionState.isDragging || env.interactionState.isRotating || env.interactionState.isScaling) {
      env.AppController.saveHistoryState();
    }
    env.interactionState.isDragging = false;
    env.interactionState.isRotating = false;
    env.interactionState.isScaling = false;
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
    if (e && e.target && e.target.tagName !== "CANVAS") return;
    const sidebar = document.querySelector('#app-grafema .sidebar');
    if (sidebar && p.mouseX > p.width - sidebar.clientWidth - 20) return;
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;
    for (let i = 0; i < env.glyphs.length; i++) {
      if (env.glyphs[i].isHovered(p.mouseX, p.mouseY)) return;
    }
    env.AppController.addGlyph(p.mouseX, p.mouseY);
  };

  // --- GLYPHS & LAYERS MANAGEMENT ---

  // --- HISTORY (UNDO / REDO) ---

  // --- THEME ---

  // Expose for parent controller
  p.applyTheme = env.UIManager.applyTheme;

  // --- BACKGROUND REFERENCE IMAGE ---

  // --- INTERFACE BUILD ---

  // --- DOM CACHE ---

  // --- EVENT LISTENERS ---
}