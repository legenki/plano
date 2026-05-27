/**
 * SECUENCIA — GlyphEditor UI
 * Canvas-based interactive glyph editing tool.
 * Requires _p5 (p5.js instance) passed as factory parameter.
 */

export function createGlyphEditorClass(_p5) {

class GlyphEditor {

  constructor() {

    this.position = _p5.createVector(0, 0);
    this.width;
    this.height;

    this.isHovered;

    this.gridSize = glyphEditor_gridSize_DEFAULT;
    this.gridsPerSegment = glyphEditor_gridsPerSegment_DEFAULT;

    this.scriptStrokeWeight = glyphEditor_scriptStrokeWeight_DEFAULT;

    this.buttonSizeBig = glyphEditor_buttonSizeBig_DEFAULT;
    this.buttonSizeSmall = glyphEditor_buttonSizeSmall_DEFAULT;

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

    this.mode = 'editPath';  // 'editPath', 'editAnchor', 'editHandle', 'drawPath'
    this.contextMenu = false;
    this.displayInfo = true;

    this.setActiveGlyph(activeScript.glyphs[0].name);
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

    let glyph = activeScript.getGlyph(character);

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

          if (j == path.anchors.length - 1 &&
            anchor.position.x == path.anchors[0].position.x && anchor.position.y == path.anchors[0].position.y) {
            pathButton.closed = true;
          } else {
            pathButton.anchors.push(new AnchorButton(pathButton, xPosition, yPosition, this.buttonSizeBig, this.buttonSizeSmall,
              handleToPrev_xPosition, handleToPrev_yPosition, handleToNext_xPosition, handleToNext_yPosition,
              first, last, j));
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




      let doubleGlyphIndex = activeScript.glyphs.findIndex(glyph => glyph.name === character);
      if (doubleGlyphIndex != -1) {
        let activeGlyphIndex = activeScript.glyphs.findIndex(glyph => glyph.name === this.activeGlyph.name);
        activeScript.glyphs[doubleGlyphIndex] = this.activeGlyph;
        activeScript.glyphs.splice(activeGlyphIndex, 1);
      }

      this.activeGlyph.name = character;


    }
  }

  clearActiveGlyph() {
    this.pathButtons = [];
    this.resetActivePath();
    this.updateActiveGlyph();
    this.activeGlyph.updateWidth(activeScript.defaultGlyphWidth);
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

    let absolutePaths = []

    for (let i = 0; i < this.pathButtons.length; i++) {

      let path = this.pathButtons[i];
      let absoluteAnchors = []
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

        absoluteAnchors.push(new Anchor(j, xPosition, yPosition,
          handleToPrev_xPosition, handleToPrev_yPosition, handleToNext_xPosition, handleToNext_yPosition));
      }

      if (path.closed == true) {
        let reference = absoluteAnchors[0];
        let copy = new Anchor(absoluteAnchors.length, reference.position.x, reference.position.y,
          reference.handleToPrev.position.x, reference.handleToPrev.position.y, reference.handleToNext.position.x, reference.handleToNext.position.y)
        absoluteAnchors.push(copy);
      }

      let connectionToPrev = path.connectionToPrev;
      let connectionToNext = path.connectionToNext;

      absolutePaths.push(new Path(j, absoluteAnchors, connectionToPrev, connectionToNext));
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

    let collectedAnchors = this.activeAnchor.first == true ?
      anchor.first == true ?
        [...path2.anchors.reverse(), ...path1.anchors] :
        [...path2.anchors, ...path1.anchors] :
      anchor.first == true ?
        [...path1.anchors, ...path2.anchors] :
        [...path1.anchors, ...path2.anchors.reverse()];

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

      newPath.anchors.push(new AnchorButton(newPath, xPosition, yPosition, this.buttonSizeBig, this.buttonSizeSmall,
        handleToPrev_xPosition, handleToPrev_yPosition, handleToNext_xPosition, handleToNext_yPosition,
        first, last, j));
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

    let newAnchor = new AnchorButton(this.activePath, xPosition, yPosition, this.buttonSizeBig, this.buttonSizeSmall,
      handleToPrev_xPosition, handleToPrev_yPosition, handleToNext_xPosition, handleToNext_yPosition,
      first, last, index);

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
    activeScript.xHeight = (this.baseline - this.xHeight) / (this.width * 0.9);

    this.ascenderHeight = this.ascenderHeightButton.position.y;
    activeScript.ascenderHeight = (this.baseline - this.ascenderHeight) / (this.width * 0.9);

    this.descenderHeight = this.descenderHeightButton.position.y;
    activeScript.descenderHeight = (this.baseline - this.descenderHeight) / (this.width * 0.9);

    this.leftBounding = this.leftBoundingButton.position.x;
    this.rightBounding = this.rightBoundingButton.position.x;

    this.activeGlyph.updateWidth(this.absoluteXPosition(this.rightBounding));
  }

  repositionGuides() {

    // calc guide positions
    this.baseline = this.position.y + this.gridifySegments(this.height * this.baselinePositionFactor);
    this.xHeight = this.baseline - (activeScript.xHeight * (this.width * 0.9));
    this.ascenderHeight = this.baseline - (activeScript.ascenderHeight * (this.width * 0.9));
    this.descenderHeight = this.baseline - (activeScript.descenderHeight * (this.width * 0.9));
    this.leftBounding = this.position.x + (this.width * this.leftBoundingPositionFactor);

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
    updateInterface_glyphEditorContext_state();
  }

  resetContextMenu() {
    this.contextMenu = false;
    updateInterface_glyphEditorContext_state();
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  update() {

    this.isHovered = mouseOverRect(this.position.x, this.position.y, this.width, this.height) && glyphEditorToolsElement.matches(':hover') == false;

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
    } if (this.mouseWasPressed == true) {
      this.mouseWasPressed = false;
    } else {
      this.lockedButton = false;
    }

    if (_p5.mouseIsPressed) {
      this.mouseWasPressed = true;
    }

  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  handleDrag() {

    if (this.checkAnyGuideIsPressed() == true) {
      this.editGuides();
    } else {

    if (this.mode == 'editPath') {
      if (this.checkAnyPathIsPressed() == true) {
        this.setPathPosition(this.getPressedPath());
      } else if (this.activePath != null && mouseOverRect(this.activePath.xMin, this.activePath.yMin, this.activePath.xMax - this.activePath.xMin, this.activePath.yMax - this.activePath.yMin)) {
        this.setPathPosition(this.activePath);
      }
    } else if (this.mode == 'editAnchor') {
      if (this.checkAnyAnchorInclHandleIsPressed() == true) {
        this.setAnchorPosition(this.getPressedAnchor());
      }
    } else if (this.mode == 'editHandle') {
      if (this.checkAnyAnchorInclHandleIsPressed() == true) {
        this.setHandlePosition(this.getPressedAnchor());
      }
    } else if (this.mode == 'drawPath') {
      if (this.checkAnyAnchorInclHandleIsPressed() == true) {
        let anchor = this.getPressedAnchor();
        if (anchor == this.activeAnchor) {
          this.setHandlePosition(anchor);
        }

      } else if (this.isHovered == true) {

        if (this.activeAnchor == null) {
          this.addPath();
        } else {
          this.addAnchor();
        }

      }
    }
  }

    this.updateActiveGlyph();
  }

  handleClick() {

    this.addBuffer = true;

    if (this.lockedButton == false) {
      if (this.contextMenu == true) {

        this.resetContextMenu();

      } else if (this.checkAnyButtonIsHovered() == true) {

        if (this.mode == 'editPath') {
          if (this.checkAnyPathIsHovered() == true) {
            this.setActivePath(this.getHoveredPath());
            this.addBuffer = false;
          }
        } else if (this.mode == 'editAnchor') {

          if (this.checkAnyPathIsHovered() == true) {
            this.setActivePath(this.getHoveredPath());
            this.addBuffer = false;
          }
          if (this.checkAnyAnchorIsHovered() == true) {
            this.setActiveAnchor(this.getHoveredAnchor());
            this.addBuffer = false;
          }
        } else if (this.mode == 'editHandle') {
          if (this.checkAnyAnchorIsHovered() == true) {
            this.setHandlesLocked(this.getHoveredAnchor());

          } else if (this.checkAnyPathIsHovered() == true) {
            this.setActivePath(this.getHoveredPath());
            this.addBuffer = false;
          }
        } else if (this.mode == 'drawPath') {

            if (this.checkAnyAnchorIsHovered() == true) {

              let anchor = this.getHoveredAnchor();
              if (anchor.first == true || anchor.last == true) {
                if (this.activeAnchor == null) {
                  this.setActiveAnchor(anchor);
                  this.addBuffer = false;
                } else if (anchor != this.activeAnchor && anchor.path == this.activePath) {
                  this.closePath(anchor.path);
                } else if (this.activePath != anchor.path) {
                  this.combinePaths(this.activePath, anchor.path, anchor);
                }
              } else if (anchor.path == this.activePath) {
                this.removeAnchor(anchor);
              }
            } else {
              if (this.activeAnchor == null) {
                this.addPath();
              } else {
                this.addAnchor();
              }
            }

          }
        

      } else if (this.checkAnyButtonIsHovered() == false) {

        if (this.mode == 'drawPath') {
          if (this.activeAnchor == null) {
            this.addPath();
          } else {
            this.addAnchor();
          }
        } else if (this.contextMenu == false && this.lockedButton == false) {
          this.resetActiveAnchor();
          this.resetActivePath();
          this.addBuffer = false;
          _p5.print("infinity click")
        }

      }

      this.updateActiveGlyph();

    } else {
      if (this.mode == 'editPath') {
        if (this.activePath != null) {
          this.gridifyPathPosition(this.activePath);
        }
      }
    }

    if (this.checkAnyGuideIsHovered() == true) {
      this.repositionGuides();
    }

  }

  handleDoubleClick() {

    this.addBuffer = true;

    if (this.lockedButton == false && this.checkAnyButtonIsHovered() == false) {
      this.resetActiveAnchor();
      this.resetActivePath();
      this.addBuffer = false;
    } else {
      if (this.mode == 'editPath') {
      } else if (this.mode == 'editAnchor') {
        if (this.checkAnyAnchorIsHovered() == true) {
          this.switchAnchorAngular(this.getHoveredAnchor());
        }
      } else if (this.mode == 'editHandle') {
      } else if (this.mode == 'drawPath') {
      }
    }

    this.updateActiveGlyph();
  }

  handleRightClick() {

    this.addBuffer = false;

    if (this.mode != 'drawPath') {
      if (this.checkAnyPathIsHovered() == true) {
        this.setActivePath(this.getHoveredPath());
        this.setContextMenu();
      }
    }

  }

  handleDelete() {

    this.addBuffer = true;

    if (this.mode == 'editPath') {
      if (this.activePath != null) {
        this.removePath(this.activePath);
      }
    } else if (this.mode == 'editAnchor') {
      if (this.activeAnchor != null) {
        this.removeAnchor(this.activeAnchor);
      }
    } else if (this.mode == 'editHandle') {
      if (this.activeAnchor != null) {
        this.removeAnchor(this.activeAnchor);
      }
    } else if (this.mode == 'drawPath') {
      if (this.activeAnchor != null) {

        let removedIndex = this.activeAnchor.index;
        this.removeAnchor(this.activeAnchor);

        let newIndex = removedIndex == 0 ? 0 : removedIndex - 1;
        this.setActiveAnchor(this.activePath.anchors[newIndex]);

      } else if (this.activePath != null) {
        this.removePath(this.activePath);
      }
    }

    this.updateActiveGlyph();
  }

  handleEscape() {

    this.addBuffer = false;

    if (this.mode == 'drawPath') {

      if (this.activePath.anchors.length < 2) {
        this.removePath(this.activePath);
      }
      this.resetActivePath();
    }

    this.updateActiveGlyph();
  }

  handleAlt(status) {

    this.addBuffer = false;

    if (status == 'pressed') {

      if (this.mode == 'editHandle') {
        this.setMode('editAnchor');
        updateInterface_glyphEditorTools_state();
      } else if (this.mode == 'editAnchor') {
        this.setMode('editHandle');
        updateInterface_glyphEditorTools_state();
      } if (this.mode == 'drawPath') {
        
        // HIER



      }

    } else if (status == 'released') {

      if (this.mode == 'editHandle') {
        this.setMode('editAnchor');
        updateInterface_glyphEditorTools_state();
      } else if (this.mode == 'editAnchor') {
        this.setMode('editHandle');
        updateInterface_glyphEditorTools_state();
      }

    }

  }

  handleCmdZ() {
    this.addBuffer = false;
    this.undoPathButtonsBuffer();
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  display() {
    if (this.displayInfo) {
      this.displayGrid();
    }
    this.displayBox();
    this.displayGuides();
    this.displayGlyph();
  }

  displayGrid() {
    _p5.strokeWeight(interfaceStrokeWeight);
    _p5.stroke(gridColorLight);

    for (let x = 0; x < this.width; x += this.gridSize) {
      _p5.line(this.position.x + x, this.position.y, this.position.x + x, this.position.y + this.height);
    }

    for (let y = 0; y < this.height; y += this.gridSize) {
      _p5.line(this.position.x, this.position.y + y, this.position.x + this.width, this.position.y + y);
    }

    _p5.stroke(gridColor);
    for (let x = 0; x < this.width; x += this.gridSize * this.gridsPerSegment) {
      _p5.line(this.position.x + x, this.position.y, this.position.x + x, this.position.y + this.height);
    }
    for (let y = 0; y < this.height; y += this.gridSize * this.gridsPerSegment) {
      _p5.line(this.position.x, this.position.y + y, this.position.x + this.width, this.position.y + y);
    }
  }

  displayBox() {
    _p5.stroke(gridColor);
    _p5.strokeWeight(interfaceStrokeWeight);
    _p5.noFill();
    _p5.rect(this.position.x + (this.width * 0.5), this.position.y + (this.height * 0.5), this.width, this.height);
  }

  displayGuides() {

    _p5.strokeWeight(interfaceStrokeWeight);
    _p5.stroke(this.displayInfo == true ? glyphEditor_guideColor : gridColor);

    // x-_p5.height
    _p5.line(this.position.x, this.xHeight, this.position.x + this.width, this.xHeight);

    // ascender _p5.height
    _p5.line(this.position.x, this.ascenderHeight, this.position.x + this.width, this.ascenderHeight);

    // descender _p5.height
    _p5.line(this.position.x, this.descenderHeight, this.position.x + this.width, this.descenderHeight);

    // baseline
    _p5.line(this.position.x, this.baseline, this.position.x + this.width, this.baseline);

    // left bounding
    _p5.line(this.leftBounding, this.position.y, this.leftBounding, this.position.y + this.height);

    // right bounding
    _p5.line(this.rightBounding, this.position.y, this.rightBounding, this.position.y + this.height);

    // display buttons
    if (this.displayInfo) {
      this.xHeightButton.display();
      this.ascenderHeightButton.display();
      this.descenderHeightButton.display();
      this.baselineButton.display();
      this.leftBoundingButton.display();
      this.rightBoundingButton.display();
    }

  }

  displayGlyph() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      path.display();
    }
  }


  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // from glyph dimensions to glyhbox dimensions
  relativeXPosition(absoluteXPosition) {
    return _p5.int(absoluteXPosition * (this.width * 0.9) + this.leftBounding);
  }

  relativeYPosition(absoluteYPosition) {
    return _p5.int(absoluteYPosition * (this.width * 0.9) + this.baseline);
  }

  // from glyhbox dimensions to glyph dimensions
  absoluteXPosition(relativeXPosition) {
    return (relativeXPosition - this.leftBounding) / (this.width * 0.9);
  }

  absoluteYPosition(relativeYPosition) {
    return (relativeYPosition - this.baseline) / (this.width * 0.9);
  }

  xInsideBounds(xPosition) {
    return _p5.int(_p5.constrain(xPosition, this.position.x, this.position.x + this.width));
  }

  yInsideBounds(yPosition) {
    return _p5.int(_p5.constrain(yPosition, this.position.y, this.position.y + this.height));
  }

  checkInsideBounds(xPosition, yPosition) {
    if (xPosition > this.position.x && xPosition < this.position.x + this.width) {
      if (yPosition > this.position.y && yPosition < this.position.y + this.height) {
        return true;
      }
    }
    return false;
  }

  gridify(value) {
    return _p5.round(value / this.gridSize) * this.gridSize;
  }

  gridifySegments(value) {
    return _p5.round(value / (this.gridSize * this.gridsPerSegment)) * (this.gridSize * this.gridsPerSegment);
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  checkAnyGuideIsPressed() {
    if (this.baselineButton.isPressed == true || this.xHeightButton.isPressed == true ||
      this.ascenderHeightButton.isPressed == true || this.descenderHeightButton.isPressed == true ||
      this.leftBoundingButton.isPressed == true || this.rightBoundingButton.isPressed == true) {
      return true;
    } else {
      return false
    }
  }

  getPressedGuide() {
    if (this.baselineButton.isPressed == true) {
      return this.baselineButton;
    } else if (this.xHeightButton.isPressed == true) {
      return this.xHeightButton;
    } else if (this.ascenderHeightButton.isPressed == true) {
      return this.ascenderHeightButton;
    } else if (this.descenderHeightButton.isPressed == true) {
      return this.descenderHeightButton;
    } else if (this.leftBoundingButton.isPressed == true) {
      return this.leftBoundingButton;
    } else if (this.rightBoundingButton.isPressed == true) {
      return this.rightBoundingButton;
    }
    return;
  }

  checkAnyPathIsPressed() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      if (this.pathButtons[i].isPressed == true) {
        return true;
      }
    }
    return false
  }

  getPressedPath() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      if (this.pathButtons[i].isPressed == true) {
        return this.pathButtons[i];
      }
    }
    return;
  }

  checkAnyAnchorIsPressed() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isPressed == true) {
          return true;
        }
      }
    }
    return false
  }

  checkAnyAnchorInclHandleIsPressed() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isPressed == true || anchor.handleToNext.isPressed == true || anchor.handleToPrev.isPressed == true) {
          return true;
        }
      }
    }
    return false
  }

  checkAnyHandleIsPressed() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.handleToNext.isPressed == true || anchor.handleToPrev.isPressed == true) {
          return true;
        }
      }
    }
    return false
  }

  getPressedAnchor() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isPressed == true || anchor.handleToNext.isPressed == true || anchor.handleToPrev.isPressed == true) {
          return anchor;
        }
      }
    }
    return;
  }

  checkAnyButtonIsHovered() {
    if (this.checkAnyGuideIsHovered() == true || this.checkAnyPathIsHovered() == true ||
      this.checkAnyAnchorInclHandleIsHovered() == true) {
      return true;
    } else {
      return false;
    }
  }

  checkAnyGuideIsHovered() {
    if (this.baselineButton.isHovered == true || this.xHeightButton.isHovered == true ||
      this.ascenderHeightButton.isHovered == true || this.descenderHeightButton.isHovered == true ||
      this.leftBoundingButton.isHovered == true || this.rightBoundingButton.isHovered == true) {
      return true;
    } else {
      return false
    }
  }

  checkAnyPathIsHovered() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      if (this.pathButtons[i].isHovered == true) {
        return true;
      }
    }
    return false;
  }

  getHoveredPath() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      if (this.pathButtons[i].isHovered == true) {
        return this.pathButtons[i];
      }
    }
    return;
  }

  checkAnyAnchorIsHovered() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isHovered == true) {
          return true;
        }
      }
    }
    return false;
  }

  checkAnyAnchorInclHandleIsHovered() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isHovered == true || anchor.handleToNext.isHovered == true || anchor.handleToPrev.isHovered == true) {
          return true;
        }
      }
    }
    return false;
  }

  getHoveredAnchor() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isHovered == true) {
          return anchor;
        }
      }
    }
    return;
  }

}

// --- FILE: secuencia/js/buttons.js ---

  return GlyphEditor;
}
