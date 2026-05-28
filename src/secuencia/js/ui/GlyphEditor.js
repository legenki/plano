
import { createRenderMethods } from './editor/GlyphEditorRender.js';
import { createInputMethods } from './editor/GlyphEditorInput.js';
import { createMathMethods } from './editor/GlyphEditorMath.js';

/**
 * SECUENCIA — GlyphEditor UI
 * Canvas-based interactive glyph editing tool.
 * Requires _p5 (p5.js instance) passed as factory parameter.
 */

export function createGlyphEditorClass(_p5, {
  GuideButton,
  PathButton,
  AnchorButton,
  Path,
  Anchor}) {
  class GlyphEditor {
    constructor() {
      this.position = _p5.createVector(0, 0);
      this.width;
      this.height;
      this.isHovered;
      this.gridSize = _p5.env.glyphEditor_gridSize_DEFAULT;
      this.gridsPerSegment = _p5.env.glyphEditor_gridsPerSegment_DEFAULT;
      this.scriptStrokeWeight = _p5.env.glyphEditor_scriptStrokeWeight_DEFAULT;
      this.buttonSizeBig = _p5.env.glyphEditor_buttonSizeBig_DEFAULT;
      this.buttonSizeSmall = _p5.env.glyphEditor_buttonSizeSmall_DEFAULT;
      this.baselinePositionFactor = 0.65;
      this.leftBoundingPositionFactor = 0.25;
      this.baseline;
      this.xHeight;
      this.ascenderHeight;
      this.decenderHeight;
      this.leftBounding;
      this.rightBounding;
      this.baselineButton = new GuideButton(0, 0, this.buttonSizeBig);
      this.xHeightButton = new GuideButton(0, 0, this.buttonSizeSmall);
      this.ascenderHeightButton = new GuideButton(0, 0, this.buttonSizeSmall);
      this.descenderHeightButton = new GuideButton(0, 0, this.buttonSizeSmall);
      this.leftBoundingButton = new GuideButton(0, 0, this.buttonSizeBig);
      this.rightBoundingButton = new GuideButton(0, 0, this.buttonSizeBig);
      this.activeGlyph;
      this.activePath;
      this.activeAnchor;
      this.pathButtonsBuffer = [];
      this.pathButtonsBufferMax = 10;
      this.addBuffer = false;
      this.pathButtons = [];
      this.lockedButton = false;
      this.mouseWasPressed = false;
      this.mode = 'editPath'; // 'editPath', 'editAnchor', 'editHandle', 'drawPath'
      this.contextMenu = false;
      this.displayInfo = true;
      this.setActiveGlyph(_p5.env.activeScript.glyphs[0].name);
    }

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    setDimensions(x, y, w, h) {
      // _p5.save new dimensions
      this.position = _p5.createVector(x, y);
      this.width = w;
      this.height = h;
      this.repositionGuides();
    }
    setMode(mode) {
      if (this.mode == 'drawPath' && mode != 'drawPath' && this.activePath != null) {
        if (this.activePath.anchors.length < 2) {
          this.removePath(this.activePath);
        }
      }
      if (mode == 'editPath') {
        this.mode = mode;
      } else if (mode == 'editAnchor') {
        this.mode = mode;
      } else if (mode == 'editHandle') {
        this.mode = mode;
      } else if (mode == 'drawPath') {
        this.mode = mode;
      }
    }

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    setActiveGlyph(character) {
      let glyph = _p5.env.activeScript.getGlyph(character);
      if (glyph != null) {
        this.resetActiveGlyph();
        this.activeGlyph = glyph;
        for (let i = 0; i < this.activeGlyph.paths.length; i++) {
          let path = this.activeGlyph.paths[i];
          let pathButton = new PathButton(0, 0, this.scriptStrokeWeight * 1.5, path.connectionToPrev, path.connectionToNext, i);
          for (let j = 0; j < path.anchors.length; j++) {
            let anchor = path.anchors[j];
            let handleToPrev = anchor.handleToPrev;
            let handleToNext = anchor.handleToNext;
            let xPosition = this.relativeXPosition(anchor.position.x);
            let yPosition = this.relativeYPosition(anchor.position.y);
            let handleToPrev_xPosition = this.relativeXPosition(handleToPrev.position.x);
            let handleToPrev_yPosition = this.relativeYPosition(handleToPrev.position.y);
            let handleToNext_xPosition = this.relativeXPosition(handleToNext.position.x);
            let handleToNext_yPosition = this.relativeYPosition(handleToNext.position.y);
            let first = j == 0 ? true : false;
            let last = j == path.anchors.length - 1 ? true : false;
            if (j == path.anchors.length - 1 && anchor.position.x == path.anchors[0].position.x && anchor.position.y == path.anchors[0].position.y) {
              pathButton.closed = true;
            } else {
              pathButton.anchors.push(new AnchorButton(pathButton, xPosition, yPosition, this.buttonSizeBig, this.buttonSizeSmall, handleToPrev_xPosition, handleToPrev_yPosition, handleToNext_xPosition, handleToNext_yPosition, first, last, j));
            }
          }
          this.pathButtons.push(pathButton);
        }
        this.resetActivePath();
        this.rightBounding = this.relativeXPosition(this.activeGlyph.advancedWidth);
        this.rightBoundingButton.updatePosition(this.gridify(this.rightBounding), this.gridify(this.position.y + this.height));
      }
      this.addBuffer = true;
    }
    setActiveGlyphName(character) {
      if (this.activeGlyph != null) {
        let doubleGlyphIndex = _p5.env.activeScript.glyphs.findIndex(glyph => glyph.name === character);
        if (doubleGlyphIndex != -1) {
          let activeGlyphIndex = _p5.env.activeScript.glyphs.findIndex(glyph => glyph.name === this.activeGlyph.name);
          _p5.env.activeScript.glyphs[doubleGlyphIndex] = this.activeGlyph;
          _p5.env.activeScript.glyphs.splice(activeGlyphIndex, 1);
        }
        this.activeGlyph.name = character;
      }
    }
    clearActiveGlyph() {
      this.pathButtons = [];
      this.resetActivePath();
      this.updateActiveGlyph();
      this.activeGlyph.updateWidth(_p5.env.activeScript.defaultGlyphWidth);
      this.repositionGuides();
    }
    resetActiveGlyph() {
      this.pathButtons = [];
      this.resetPathButtonsBuffer();
      if (this.activeGlyph != null) {
        this.activeGlyph = null;
      }
      this.resetActivePath();
    }
    reloadActiveGlyph() {
      this.setActiveGlyph(this.activeGlyph.name);
    }
    updateActiveGlyph() {
      let absolutePaths = [];
      for (let i = 0; i < this.pathButtons.length; i++) {
        let path = this.pathButtons[i];
        let absoluteAnchors = [];
        for (let j = 0; j < path.anchors.length; j++) {
          let anchor = path.anchors[j];
          let handleToPrev = anchor.handleToPrev;
          let handleToNext = anchor.handleToNext;
          let xPosition = this.absoluteXPosition(anchor.position.x);
          let yPosition = this.absoluteYPosition(anchor.position.y);
          let handleToPrev_xPosition = this.absoluteXPosition(handleToPrev.position.x);
          let handleToPrev_yPosition = this.absoluteYPosition(handleToPrev.position.y);
          let handleToNext_xPosition = this.absoluteXPosition(handleToNext.position.x);
          let handleToNext_yPosition = this.absoluteYPosition(handleToNext.position.y);
          absoluteAnchors.push(new Anchor(j, xPosition, yPosition, handleToPrev_xPosition, handleToPrev_yPosition, handleToNext_xPosition, handleToNext_yPosition));
        }
        if (path.closed == true) {
          let reference = absoluteAnchors[0];
          let copy = new Anchor(absoluteAnchors.length, reference.position.x, reference.position.y, reference.handleToPrev.position.x, reference.handleToPrev.position.y, reference.handleToNext.position.x, reference.handleToNext.position.y);
          absoluteAnchors.push(copy);
        }
        let connectionToPrev = path.connectionToPrev;
        let connectionToNext = path.connectionToNext;
        absolutePaths.push(new Path(i, absoluteAnchors, connectionToPrev, connectionToNext));
      }
      this.activeGlyph.updatePaths(absolutePaths);
    }

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    resetPathButtonsBuffer() {
      this.pathButtons = [];
      this.pathButtonsBuffer = [];
    }
    addPathButtonsBuffer() {
      let currentStatePaths = [];
      for (let i = 0; i < this.pathButtons.length; i++) {
        currentStatePaths.push(this.pathButtons[i].copy());
      }
      this.pathButtonsBuffer.push(currentStatePaths);
      if (this.pathButtonsBuffer.length > this.pathButtonsBufferMax) {
        this.pathButtonsBuffer.splice(0, 1);
      }
      this.addBuffer = false;
    }
    undoPathButtonsBuffer() {
      if (this.pathButtonsBuffer.length > 1) {
        let undoState = this.pathButtonsBuffer[this.pathButtonsBuffer.length - 2];
        let undoStatePaths = [];
        for (let i = 0; i < undoState.length; i++) {
          undoStatePaths.push(undoState[i].copy());
        }
        this.pathButtons = undoStatePaths;
        this.pathButtonsBuffer.splice(this.pathButtonsBuffer.length - 1, 1);
      }
    }

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    setActivePath(path) {
      this.resetActivePath();
      this.activePath = path;
      this.activePath.active = true;
    }
    resetActivePath() {
      if (this.activePath != null) {
        this.activePath.active = false;
      }
      this.activePath = null;
      this.resetActiveAnchor();
    }
    removePath(path) {
      for (let i = 0; i < this.pathButtons.length; i++) {
        if (this.pathButtons[i] == path) {
          if (this.activePath == path) {
            this.resetActivePath();
          }
          this.pathButtons.splice(i, 1);
          break;
        }
      }

      // reset path index values
      for (let i = 0; i < this.pathButtons.length; i++) {
        this.pathButtons[i].index = i;
      }
    }
    setPathPosition(path) {
      this.setActivePath(path);
      this.activePath.updatePosition(_p5.mouseX - _p5.pmouseX, _p5.mouseY - _p5.pmouseY);
      this.lockedButton = true;
    }
    gridifyPathPosition(path) {
      this.setActivePath(path);
      this.activePath.gridifyPosition();
      this.lockedButton = true;
    }
    addPath() {
      let newPath = new PathButton(0, 0, this.scriptStrokeWeight * 1.5, false, false, this.pathButtons.length);
      this.pathButtons.push(newPath);
      this.setActivePath(newPath);
      this.addAnchor();
    }
    closePath(path) {
      this.setActivePath(path);
      this.activePath.close();
      this.resetActiveAnchor();
    }
    combinePaths(path1, path2, anchor) {
      let collectedAnchors = this.activeAnchor.first == true ? anchor.first == true ? [...path2.anchors.reverse(), ...path1.anchors] : [...path2.anchors, ...path1.anchors] : anchor.first == true ? [...path1.anchors, ...path2.anchors] : [...path1.anchors, ...path2.anchors.reverse()];
      let newPath = new PathButton(0, 0, this.scriptStrokeWeight * 1.5, false, false, _p5.min(path1.index, path2.index));
      for (let j = 0; j < collectedAnchors.length; j++) {
        let anchor = collectedAnchors[j];
        let handleToPrev = anchor.handleToPrev;
        let handleToNext = anchor.handleToNext;
        let xPosition = anchor.position.x;
        let yPosition = anchor.position.y;
        let handleToPrev_xPosition = handleToPrev.position.x;
        let handleToPrev_yPosition = handleToPrev.position.y;
        let handleToNext_xPosition = handleToNext.position.x;
        let handleToNext_yPosition = handleToNext.position.y;
        let first = j == 0 ? true : false;
        let last = j == collectedAnchors.length - 1 ? true : false;
        newPath.anchors.push(new AnchorButton(newPath, xPosition, yPosition, this.buttonSizeBig, this.buttonSizeSmall, handleToPrev_xPosition, handleToPrev_yPosition, handleToNext_xPosition, handleToNext_yPosition, first, last, j));
      }
      this.pathButtons.push(newPath);
      this.removePath(path1);
      this.removePath(path2);
      this.setActivePath(newPath);
      this.updateActiveGlyph();
    }

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    setActiveAnchor(anchor) {
      this.setActivePath(anchor.path);
      this.resetActiveAnchor();
      this.activeAnchor = anchor;
      this.activeAnchor.active = true;
    }
    resetActiveAnchor() {
      if (this.activeAnchor != null) {
        this.activeAnchor.active = false;
        this.activeAnchor = null;
      }
    }
    addAnchor() {
      let addAsFirst = this.activePath.anchors.length > 1 && this.activeAnchor == this.activePath.anchors[0] ? true : false;
      let xPosition = this.gridify(this.xInsideBounds(_p5.mouseX));
      let handleToPrev_xPosition = xPosition;
      let handleToNext_xPosition = xPosition;
      let yPosition = this.gridify(this.yInsideBounds(_p5.mouseY));
      let handleToPrev_yPosition = yPosition;
      let handleToNext_yPosition = yPosition;
      let first = this.activePath.anchors.length == 0 || addAsFirst == true ? true : false;
      let last = addAsFirst == true ? false : true;
      let index = addAsFirst == true ? 1 : this.activePath.anchors.length;
      let newAnchor = new AnchorButton(this.activePath, xPosition, yPosition, this.buttonSizeBig, this.buttonSizeSmall, handleToPrev_xPosition, handleToPrev_yPosition, handleToNext_xPosition, handleToNext_yPosition, first, last, index);
      if (addAsFirst) {
        this.activePath.anchors.unshift(newAnchor);
      } else {
        this.activePath.anchors.push(newAnchor);
      }
      if (this.activePath.anchors.length > 2) {
        if (addAsFirst) {
          this.activePath.anchors[1].first = false;
          for (let i = 0; i < this.activePath.anchors.length; i++) {
            this.activePath.anchors[i].index = i;
          }
        } else {
          this.activePath.anchors[this.activePath.anchors.length - 2].last = false;
        }
      }
      this.setActiveAnchor(newAnchor);
      this.lockedButton == true;
    }
    removeAnchor(anchor) {
      let path = anchor.path;
      for (let i = 0; i < path.anchors.length; i++) {
        if (path.anchors[i] == anchor) {
          if (this.activeAnchor == anchor) {
            this.resetActiveAnchor();
          }
          path.anchors.splice(i, 1);
          break;
        }
      }
      if (path.anchors.size == 0) {
        this.removePath(path);
      }
    }
    setAnchorPosition(anchor) {
      this.setActiveAnchor(anchor);
      if (this.activeAnchor.handleToNext.isPressed == true || this.activeAnchor.handleToPrev.isPressed == true) {
        if (this.activeAnchor.angular == true) {
          if (this.activeAnchor.handleToPrev.isPressed == true && this.activeAnchor.handleToPrev.locked == false) {
            this.activeAnchor.handleToPrev.updatePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)));
          } else if (this.activeAnchor.handleToNext.isPressed == true && this.activeAnchor.handleToNext.locked == false) {
            this.activeAnchor.handleToNext.updatePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)));
          } else {
            this.activeAnchor.updatePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)));
          }
        } else {
          this.activeAnchor.updateBothHandlePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)), false);
        }
      } else if (this.activeAnchor.isPressed == true) {
        this.activeAnchor.updatePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)));
      }
      this.lockedButton = true;
    }
    setHandlePosition(anchor) {
      this.setActiveAnchor(anchor);
      if (this.mode == 'editHandle' || this.mode == 'drawPath') {
        this.activeAnchor.angular = false;
      }
      if (this.activeAnchor.first == true) {
        this.activeAnchor.updateBothHandlePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)), true);
      } else {
        this.activeAnchor.updateBothHandlePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)), false);
      }
      this.lockedButton = true;
    }
    setHandlesLocked(anchor) {
      this.setActiveAnchor(anchor);
      this.activeAnchor.updateBothHandlePosition(this.activeAnchor.position.x, this.activeAnchor.position.y, false);
      this.lockedButton = true;
    }
    switchAnchorAngular(anchor) {
      this.setActiveAnchor(anchor);
      this.activeAnchor.switchAngular();
    }
    switchConnectionToPrev() {
      this.activePath.connectionToPrev = !this.activePath.connectionToPrev;
      this.addBuffer = true;
    }
    switchConnectionToNext() {
      this.activePath.connectionToNext = !this.activePath.connectionToNext;
      this.addBuffer = true;
    }
    switchMainPath() {
      this.pathButtons[this.activePath.index] = this.pathButtons[0];
      this.pathButtons[0] = this.activePath;

      // reset path index values
      for (let i = 0; i < this.pathButtons.length; i++) {
        this.pathButtons[i].index = i;
      }
      this.addBuffer = true;
    }

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    editGuides() {
      if (this.baselineButton.isPressed == true) {
        let shift = this.gridify(this.yInsideBounds(_p5.mouseY)) - this.baselineButton.position.y;
        this.baselineButton.updatePosition(this.gridify(this.position.x), this.gridify(this.yInsideBounds(_p5.mouseY)));
        this.xHeightButton.updatePositionRelative(0, shift);
        this.ascenderHeightButton.updatePositionRelative(0, shift);
        this.descenderHeightButton.updatePositionRelative(0, shift);
      } else if (this.xHeightButton.isPressed == true) {
        let yPosition = _p5.min(this.yInsideBounds(_p5.mouseY), this.baselineButton.position.y - this.gridSize);
        this.xHeightButton.updatePosition(this.gridify(this.position.x), this.gridify(yPosition));
      } else if (this.ascenderHeightButton.isPressed == true) {
        let yPosition = _p5.min(this.yInsideBounds(_p5.mouseY), this.xHeightButton.position.y - this.gridSize);
        this.ascenderHeightButton.updatePosition(this.gridify(this.position.x), this.gridify(yPosition));
      } else if (this.descenderHeightButton.isPressed == true) {
        let yPosition = _p5.max(this.yInsideBounds(_p5.mouseY), this.baselineButton.position.y + this.gridSize);
        this.descenderHeightButton.updatePosition(this.gridify(this.position.x), this.gridify(yPosition));
      } else if (this.leftBoundingButton.isPressed == true) {
        let xPosition = _p5.min(this.xInsideBounds(_p5.mouseX), this.rightBoundingButton.position.x - this.gridSize);
        this.leftBoundingButton.updatePosition(this.gridify(xPosition), this.gridify(this.position.y + this.height));
      } else if (this.rightBoundingButton.isPressed == true) {
        let xPosition = _p5.max(this.xInsideBounds(_p5.mouseX), this.leftBoundingButton.position.x + this.gridSize);
        this.rightBoundingButton.updatePosition(this.gridify(xPosition), this.gridify(this.position.y + this.height));
      }
      this.lockedButton = true;
      this.baseline = this.baselineButton.position.y;
      this.xHeight = this.xHeightButton.position.y;
      _p5.env.activeScript.xHeight = (this.baseline - this.xHeight) / (this.width * 0.9);
      this.ascenderHeight = this.ascenderHeightButton.position.y;
      _p5.env.activeScript.ascenderHeight = (this.baseline - this.ascenderHeight) / (this.width * 0.9);
      this.descenderHeight = this.descenderHeightButton.position.y;
      _p5.env.activeScript.descenderHeight = (this.baseline - this.descenderHeight) / (this.width * 0.9);
      this.leftBounding = this.leftBoundingButton.position.x;
      this.rightBounding = this.rightBoundingButton.position.x;
      this.activeGlyph.updateWidth(this.absoluteXPosition(this.rightBounding));
    }
    repositionGuides() {
      // calc guide positions
      this.baseline = this.position.y + this.gridifySegments(this.height * this.baselinePositionFactor);
      this.xHeight = this.baseline - _p5.env.activeScript.xHeight * (this.width * 0.9);
      this.ascenderHeight = this.baseline - _p5.env.activeScript.ascenderHeight * (this.width * 0.9);
      this.descenderHeight = this.baseline - _p5.env.activeScript.descenderHeight * (this.width * 0.9);
      this.leftBounding = this.position.x + this.width * this.leftBoundingPositionFactor;

      // reposition guide buttons
      this.baselineButton.updatePosition(this.gridify(this.position.x), this.gridify(this.baseline));
      this.xHeightButton.updatePosition(this.gridify(this.position.x), this.gridify(this.xHeight));
      this.ascenderHeightButton.updatePosition(this.gridify(this.position.x), this.gridify(this.ascenderHeight));
      this.descenderHeightButton.updatePosition(this.gridify(this.position.x), this.gridify(this.descenderHeight));
      this.leftBoundingButton.updatePosition(this.gridify(this.leftBounding), this.gridify(this.position.y + this.height));
      this.reloadActiveGlyph();
    }

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    setContextMenu() {
      this.contextMenu = true;
      _p5.env.updateInterface_glyphEditorContext_state();
    }
    resetContextMenu() {
      this.contextMenu = false;
      _p5.env.updateInterface_glyphEditorContext_state();
    }

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    update() {
      const toolsElement = document.getElementById('glyphEditorTools');
      this.isHovered = _p5.env.mouseOverRect(this.position.x, this.position.y, this.width, this.height) && (!toolsElement || toolsElement.matches(':hover') == false);
      this.updateButtonStates();
      if (this.addBuffer == true) {
        this.addPathButtonsBuffer();
      }
    }
    updateButtonStates() {
      if (this.lockedButton == false) {
        for (let i = 0; i < this.pathButtons.length; i++) {
          this.pathButtons[i].checkState();
        }
        this.baselineButton.checkState();
        this.xHeightButton.checkState();
        this.ascenderHeightButton.checkState();
        this.descenderHeightButton.checkState();
        this.leftBoundingButton.checkState();
        this.rightBoundingButton.checkState();
      }
      if (this.mouseWasPressed == true) {
        this.mouseWasPressed = false;
      } else {
        this.lockedButton = false;
      }
      if (_p5.mouseIsPressed) {
        this.mouseWasPressed = true;
      }
    }

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    // from glyph dimensions to glyhbox dimensions

    // from glyhbox dimensions to glyph dimensions

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  }

  // --- FILE: secuencia/js/buttons.js ---

  Object.assign(GlyphEditor.prototype, createRenderMethods(_p5), createInputMethods(_p5), createMathMethods(_p5));
  return GlyphEditor;
}