/**
 * SECUENCIA — Button Classes
 * Canvas button hierarchy for the glyph editor.
 * Requires _p5 (p5.js instance) passed as factory parameter.
 */

export function createButtonClasses(_p5) {
  class Button {
    constructor(x, y, s, t) {
      this.position = _p5.createVector(x, y);
      this.size = s;
      this.type = t;
      this.active = false;

      // State properties
      this.isHovered = false;
      this.isPressed = false;
      this.isHold = false;
      this.isClicked = false;
      this.isDoubleClicked = false;

      // Timing control properties
      this.lastClickTime = 0;
      this.clickThreshold = 250;
      this.holdTimeout;
      this.holdThreshold = 75; // 200;
      this.releasedTimeout;
      this.releasedThreshold = this.clickThreshold + 5;
    }
    checkState() {
      this.isDoubleClicked = false;
      if (_p5.frameCount - this.lastClickFrame > 0) {
        this.isClicked = false;
      }

      // Hover state
      if (this.type == "path") { /* empty */ } else {
        this.isHovered = _p5.env.mouseOverEllipse(this.position.x, this.position.y, this.size);
      }

      // clicked state
      if (_p5.mouseIsPressed == false && this.isPressed == true) {
        const currentTime = _p5.millis();

        // Check if within the double-click threshold
        if (currentTime - this.lastClickTime < this.clickThreshold) {
          clearTimeout(this.clickTimeout); // Cancel pending single-click
          this.isDoubleClicked = true;
          this.isClicked = false;
          this.lastClickFrame = _p5.frameCount;
        } else {
          // Set a timeout to confirm a single click if no double-click occurs
          this.isClicked = true;
          this.lastClickFrame = _p5.frameCount;
          this.lastClickTime = currentTime;
        }
      }

      // pressed and hold state
      if (_p5.mouseIsPressed) {
        if (this.isHovered) {
          if (this.isPressed == false) {
            this.holdTimeout = setTimeout(() => {
              if (this.isPressed) {
                this.isHold = true;
              }
            }, this.holdThreshold);
          }
          this.isPressed = true;
        }
      } else {
        clearTimeout(this.holdTimeout);
        if (this.isPressed == true) {
          this.isPressed = false;
          if (this.isHold == true) {
            this.releasedTimeout = setTimeout(() => {
              this.isHold = false;
            }, this.releasedThreshold);
          }
        }
      }
    }

    // WITH CLICK ONLY TRUE IF NO DOUBLE CLICK
    // checkState() {

    //   this.isDoubleClicked = false;
    //   if (_p5.frameCount - this.lastClickFrame > 1) {
    //     this.isClicked = false;
    //   }

    //   // Hover state
    //   this.isHovered = _p5.env.mouseOverEllipse(this.position.x, this.position.y, this.size);

    //   // clicked state
    //   if (_p5.mouseIsPressed == false && this.isPressed == true) {

    //     const currentTime = _p5.millis();

    //     // Check if within the double-click threshold
    //     if (currentTime - this.lastClickTime < this.clickThreshold) {
    //       clearTimeout(this.clickTimeout); // Cancel pending single-click
    //       this.isDoubleClicked = true;
    //       this.isClicked = false;
    //       this.lastClickFrame = _p5.frameCount;
    //     } else {
    //       // Set a timeout to confirm a single click if no double-click occurs
    //       this.isDoubleClicked = false;
    //       this.clickTimeout = setTimeout(() => {
    //         if (this.isHold == false) {
    //           this.isClicked = true;
    //           this.lastClickFrame = _p5.frameCount;
    //         }
    //         this.isHold == false;
    //       }, this.clickThreshold);
    //     }

    //     this.lastClickTime = currentTime;
    //   }

    //   // pressed and hold state
    //   if (_p5.mouseIsPressed && this.isHovered) {
    //     this.isPressed = true;
    //     this.holdTimeout = setTimeout(() => {
    //       this.isHold = true;
    //     }, this.holdThreshold);
    //   } else {
    //     this.isPressed = false;
    //     clearTimeout(this.holdTimeout);
    //     this.releasedTimeout = setTimeout(() => {
    //       this.isHold = false;
    //       clearTimeout(this.releasedTimeout);
    //     }, this.releasedThreshold);
    //   }
    // }
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  class GuideButton extends Button {
    constructor(x, y, s) {
      super(x, y, s, "guide");
    }

    // –––––––––––––––––––––––––––––––––

    updatePosition(x, y) {
      this.position = _p5.createVector(x, y);
    }
    updatePositionRelative(x, y) {
      this.position = _p5.createVector(this.position.x + x, this.position.y + y);
    }

    // –––––––––––––––––––––––––––––––––

    display() {
      _p5.push();
      _p5.stroke(_p5.env.glyphEditor_guideColor);
      _p5.strokeWeight(_p5.env.interfaceStrokeWeight);
      _p5.fill(this.isHovered == true ? _p5.env.glyphEditor_guideColor : _p5.env.backgroundColor);
      _p5.ellipse(this.position.x, this.position.y, this.size, this.size);
      _p5.pop();
    }
  }
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  class PathButton extends Button {
    constructor(x, y, s, cTP, CTN, i) {
      super(x, y, s, "path");
      this.anchors = [];
      this.connectionToPrev = cTP;
      this.connectionToNext = CTN;
      this.index = i;
      this.xMin = this.position.x;
      this.xMax = this.position.x;
      this.yMin = this.position.y;
      this.yMax = this.position.y;
      this.closed = false;
    }
    copy() {
      let myCopy = new PathButton(this.position.x, this.position.y, this.size, this.connectionToPrev, this.connectionToNext, this.index);
      myCopy.active = this.active;
      myCopy.xMin = this.xMin;
      myCopy.xMax = this.xMax;
      myCopy.yMin = this.yMin;
      myCopy.yMax = this.yMax;
      myCopy.closed = this.closed;
      for (let i = 0; i < this.anchors.length; i++) {
        myCopy.anchors.push(this.anchors[i].copy(myCopy));
      }
      return myCopy;
    }

    // –––––––––––––––––––––––––––––––––

    checkState() {
      this.isHovered = false;
      for (let i = 0; i < this.anchors.length - 1; i++) {
        let anchor = this.anchors[i];
        let handleToNext = anchor.handleToNext;
        let nextAnchor = this.anchors[i + 1];
        let nextAnchor_handleToPrev = nextAnchor.handleToPrev;
        if (_p5.env.mouseOverBezier(anchor.position, handleToNext.position, nextAnchor_handleToPrev.position, nextAnchor.position, _p5.env.glyphEditor.scriptStrokeWeight * 2) == true) {
          this.isHovered = true;
        }
      }
      for (let i = 0; i < this.anchors.length; i++) {
        this.anchors[i].checkState();
        if (this.anchors[i].isHovered == true) {
          this.isHovered = true;
        }
      }
      let wasPressed = this.isPressed;
      super.checkState();
    }

    // –––––––––––––––––––––––––––––––––

    updatePosition(x, y) {
      // this.position = _p5.createVector(x, y);
      this.position.add(x, y);
      for (let anchor of this.anchors) {
        anchor.updatePositionRelativeToPath();
      }
    }
    gridifyPosition() {
      this.position = _p5.createVector(_p5.env.glyphEditor.gridify(this.position.x), _p5.env.glyphEditor.gridify(this.position.y));
      for (let anchor of this.anchors) {
        anchor.updatePositionRelativeToPath();
      }
    }
    updateBounding() {
            this.xMin = Infinity;
      this.xMax = -Infinity;
      this.yMin = Infinity;
      this.yMax = -Infinity;

      function getBezierExtremes(p0, p1, p2, p3) {
        let tValues = [0, 1];
        let a = -p0 + 3 * p1 - 3 * p2 + p3;
        let b = 2 * (p0 - 2 * p1 + p2);
        let c = p1 - p0;
        
        if (Math.abs(a) < 1e-12) {
          if (Math.abs(b) > 1e-12) {
            let t = -c / b;
            if (t > 0 && t < 1) tValues.push(t);
          }
        } else {
          let discriminant = b * b - 4 * a * c;
          if (discriminant >= 0) {
            let sqrtD = Math.sqrt(discriminant);
            let t1 = (-b + sqrtD) / (2 * a);
            let t2 = (-b - sqrtD) / (2 * a);
            if (t1 > 0 && t1 < 1) tValues.push(t1);
            if (t2 > 0 && t2 < 1) tValues.push(t2);
          }
        }
        
        let min = Math.min(p0, p3);
        let max = Math.max(p0, p3);
        
        for (let t of tValues) {
          let mt = 1 - t;
          let val = (mt * mt * mt * p0) + (3 * mt * mt * t * p1) + (3 * mt * t * t * p2) + (t * t * t * p3);
          if (val < min) min = val;
          if (val > max) max = val;
        }
        return { min, max };
      }

      for (let i = 0; i < this.anchors.length - 1; i++) {
        let anchor = this.anchors[i];
        let handleToNext = anchor.handleToNext;
        let nextAnchor = this.anchors[i + 1];
        let nextAnchor_handleToPrev = nextAnchor.handleToPrev;

        let xExtremes = getBezierExtremes(
          anchor.position.x, handleToNext.position.x, 
          nextAnchor_handleToPrev.position.x, nextAnchor.position.x
        );
        let yExtremes = getBezierExtremes(
          anchor.position.y, handleToNext.position.y, 
          nextAnchor_handleToPrev.position.y, nextAnchor.position.y
        );

        if (xExtremes.min < this.xMin) this.xMin = xExtremes.min;
        if (xExtremes.max > this.xMax) this.xMax = xExtremes.max;
        if (yExtremes.min < this.yMin) this.yMin = yExtremes.min;
        if (yExtremes.max > this.yMax) this.yMax = yExtremes.max;
      }

      // Single point fallback
      if (this.anchors.length === 1) {
          let pos = this.anchors[0].position;
          if (pos.x < this.xMin) this.xMin = pos.x;
          if (pos.x > this.xMax) this.xMax = pos.x;
          if (pos.y < this.yMin) this.yMin = pos.y;
          if (pos.y > this.yMax) this.yMax = pos.y;
      }

      if (this.xMin !== Infinity) {
        this.xMin -= this.size;
        this.xMax += this.size;
        this.yMin -= this.size;
        this.yMax += this.size;
      }
    }
    close() {
      this.closed = true;
      for (let i = 0; i < this.anchors.length; i++) {
        this.anchors[i].first = false;
        this.anchors[i].last = false;
      }
    }

    // –––––––––––––––––––––––––––––––––

    display() {
      if (!this.anchors || this.anchors.length === 0) {
        return;
      }
      this.updateBounding();
      if (this.connectionToPrev == true) {
        this.displayPathConnection("prev");
      }
      if (this.connectionToNext == true) {
        this.displayPathConnection("next");
      }
      this.displayPath();
      if (_p5.env.glyphEditor.displayInfo == true) {
        if (_p5.env.glyphEditor.mode != 'drawPath') {
          this.displayIndex();
        }
        if (_p5.env.glyphEditor.mode == 'editPath') {
          if (this.active == true) {
            this.displayBounding();
            if (this.connectionToPrev == true && this.anchors[0]) {
              this.anchors[0].displayConnection();
            }
            if (this.connectionToNext == true && this.anchors[this.anchors.length - 1]) {
              this.anchors[this.anchors.length - 1].displayConnection();
            }
          }
        }
        if (_p5.env.glyphEditor.mode == 'editAnchor' || _p5.env.glyphEditor.mode == 'editHandle') {
          for (let anchor of this.anchors) {
            if (this.active == true) {
              anchor.display(true);
            }
          }
        }
        if (_p5.env.glyphEditor.mode == 'drawPath') {
          for (let anchor of this.anchors) {
            if (this.active == true) {
              anchor.display(true);
            } else if (anchor.first == true && this.isHovered == true || anchor.last == true && this.isHovered == true) {
              anchor.display(false);
            }
          }
        }
      }
    }
    displayPath() {
      _p5.push();
      _p5.stroke(_p5.env.scriptColor);
      _p5.strokeWeight(_p5.env.glyphEditor.scriptStrokeWeight);
      _p5.noFill();
      if (_p5.env.glyphEditor.displayInfo == true) {
        if (this.isHovered == true && this.active == false) {
          _p5.stroke(_p5.env.hoverColor);
        }
      }
      for (let i = 0; i < this.anchors.length - 1; i++) {
        let anchor = this.anchors[i];
        let handleToNext = anchor.handleToNext;
        let nextAnchor = this.anchors[i + 1];
        let nextAnchor_handleToPrev = nextAnchor.handleToPrev;
        _p5.bezier(anchor.position.x, anchor.position.y, handleToNext.position.x, handleToNext.position.y, nextAnchor_handleToPrev.position.x, nextAnchor_handleToPrev.position.y, nextAnchor.position.x, nextAnchor.position.y);
      }
      if (this.closed == true) {
        let anchor = this.anchors[this.anchors.length - 1];
        let handleToNext = anchor.handleToNext;
        let nextAnchor = this.anchors[0];
        let nextAnchor_handleToPrev = nextAnchor.handleToPrev;
        _p5.bezier(anchor.position.x, anchor.position.y, handleToNext.position.x, handleToNext.position.y, nextAnchor_handleToPrev.position.x, nextAnchor_handleToPrev.position.y, nextAnchor.position.x, nextAnchor.position.y);
      } else if (this.active == true && _p5.env.glyphEditor.mode == 'drawPath' && _p5.env.glyphEditor.checkAnyGuideIsHovered() == false && _p5.env.glyphEditor.isHovered == true && _p5.env.glyphEditor.isHovered == true && _p5.env.glyphEditor.activeAnchor != null && _p5.env.glyphEditor.activeAnchor.isPressed == false) {
        this.displayCurrentDraw();
      }
      _p5.pop();
    }
    displayPathConnection(direction) {
      let anchor1, handle1, anchor2, handle2;
      if (direction == "prev") {
        anchor2 = this.anchors[0].position;
        handle2 = this.anchors[0].handleToPrev.position;
        let x = _p5.env.glyphEditor.xInsideBounds(this.xMin - 0.15 * _p5.env.glyphEditor.width);
        let y = _p5.env.glyphEditor.yInsideBounds(_p5.env.glyphEditor.xHeightButton.position.y);
        anchor1 = _p5.createVector(x, y);
        handle1 = _p5.createVector(x, y);
      } else {
        anchor1 = this.anchors[this.anchors.length - 1].position;
        handle1 = this.anchors[this.anchors.length - 1].handleToNext.position;
        let x = _p5.env.glyphEditor.xInsideBounds(this.xMax + 0.15 * _p5.env.glyphEditor.width);
        let y = _p5.env.glyphEditor.yInsideBounds(_p5.env.glyphEditor.xHeightButton.position.y);
        anchor2 = _p5.createVector(x, y);
        handle2 = _p5.createVector(x, y);
      }
      _p5.push();
      _p5.stroke(_p5.env.hoverColor);
      _p5.strokeWeight(_p5.env.glyphEditor.scriptStrokeWeight);
      _p5.noFill();
      _p5.bezier(anchor1.x, anchor1.y, handle1.x, handle1.y, handle2.x, handle2.y, anchor2.x, anchor2.y);
      _p5.pop();
    }
    displayCurrentDraw() {
      let anchor = _p5.env.glyphEditor.activeAnchor.first == true ? this.anchors[0] : this.anchors[this.anchors.length - 1];
      let handle = _p5.env.glyphEditor.activeAnchor.first == true ? anchor.handleToPrev : anchor.handleToNext;
      _p5.bezier(anchor.position.x, anchor.position.y, handle.position.x, handle.position.y, _p5.mouseX, _p5.mouseY, _p5.mouseX, _p5.mouseY);
    }
    displayIndex() {
      if (!this.anchors || this.anchors.length === 0) {
        return;
      }
      let firstAnchor = this.anchors[0];
      if (!firstAnchor || !firstAnchor.inwardsCenteredDirection) {
        return;
      }
      let shift;
      if ((firstAnchor.inwardsCenteredDirection.x == 0 && firstAnchor.inwardsCenteredDirection.y == 0) == false) {
        shift = firstAnchor.inwardsCenteredDirection.copy();
      } else {
        let secondAnchor = this.anchors.length > 1 ? this.anchors[1] : firstAnchor;
        shift = _p5.env.calcCenterDirection(firstAnchor.handleToPrev.position, firstAnchor.position, secondAnchor.position, 0);
      }
      shift.mult(_p5.env.interfaceFontSize);
      let x = firstAnchor.position.x + shift.x;
      let y = firstAnchor.position.y + shift.y;
      _p5.noStroke();
      _p5.fill(_p5.env.scriptColor);
      _p5.textFont(_p5.env.interfaceFont);
      _p5.textSize(_p5.env.interfaceFontSize);
      _p5.textAlign(_p5.CENTER, _p5.CENTER);
      _p5.text(this.index + 1, x, y);
    }
    displayConnection(anchor) {
      if (!anchor || !anchor.inwardsCenteredDirection) {
        return;
      }
      let shift;
      if ((anchor.inwardsCenteredDirection.x == 0 && anchor.inwardsCenteredDirection.y == 0) == false) {
        shift = anchor.inwardsCenteredDirection.copy();
      } else {
        let secondAnchor = this.anchors.length > 1 ? this.anchors[1] : anchor;
        shift = _p5.env.calcCenterDirection(anchor.handleToPrev.position, anchor.position, secondAnchor.position, 0);
      }
      shift.mult(_p5.env.interfaceFontSize * 2);
      let x = anchor.position.x + shift.x;
      let y = anchor.position.y + shift.y;
      _p5.noStroke();
      _p5.fill(_p5.env.scriptColor);
      _p5.textFont(_p5.env.interfaceFont);
      _p5.textSize(_p5.env.interfaceFontSize);
      _p5.textAlign(_p5.CENTER, _p5.CENTER);
      if (anchor.first == true) {
        _p5.text('toPrev', x, y);
      }
      if (anchor.last == true) {
        _p5.text('toNext', x, y);
      }
    }
    displayBounding() {
      _p5.push();
      _p5.rectMode(_p5.CORNER);
      _p5.stroke(_p5.env.scriptColor);
      _p5.strokeWeight(_p5.env.interfaceStrokeWeight);
      _p5.noFill();
      _p5.rect(this.xMin, this.yMin, this.xMax - this.xMin, this.yMax - this.yMin);
      _p5.pop();
    }
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  class AnchorButton extends Button {
    constructor(p, x, y, s, hs, hpx, hpy, hnx, hny, f, l, i) {
      super(x, y, s, "anchor");
      this.index = i;
      this.path = p;
      this.positionRelativeToPath = _p5.createVector(this.position.x - this.path.position.x, this.position.y - this.path.position.y);
      this.handleToPrev = new HandleButton(this, hpx, hpy, hs);
      this.handleToNext = new HandleButton(this, hnx, hny, hs);
      this.first = f;
      this.last = l;
      this.angular = false;
      this.handleToPrevDistance;
      this.handleToNextDistance;
      this.handleToPrevDirection;
      this.handleToNextDirection;
      this.angle;
      this.analyze();
      this.checkForHandleLock();
    }
    copy(path) {
      let myCopy = new AnchorButton(path, this.position.x, this.position.y, this.size, this.handleToPrev.size, this.handleToPrev.position.x, this.handleToPrev.position.y, this.handleToNext.position.x, this.handleToNext.position.y, this.first, this.last, this.index);
      return myCopy;
    }

    // –––––––––––––––––––––––––––––––––

    updatePosition(x, y) {
      this.position = _p5.createVector(x, y);
      this.positionRelativeToPath = _p5.createVector(this.position.x - this.path.position.x, this.position.y - this.path.position.y);
      this.handleToNext.updatePositionRelativeToAnchor();
      this.handleToPrev.updatePositionRelativeToAnchor();
      this.analyze();
      this.checkForHandleLock();
    }
    updatePositionRelativeToPath() {
      let x = this.path.position.x + this.positionRelativeToPath.x;
      let y = this.path.position.y + this.positionRelativeToPath.y;
      this.position = _p5.createVector(x, y);
      this.handleToNext.updatePositionRelativeToAnchor();
      this.handleToPrev.updatePositionRelativeToAnchor();
      this.analyze();
      this.checkForHandleLock();
    }
    updateBothHandlePosition(x, y, reversed) {
      if (this.handleToNext.isPressed == true && reversed == false) {
        this.handleToNext.updatePosition(x, y);
        let reflectionPoint = (this.handleToNext.position, this.position);
        this.handleToPrev.updatePosition(reflectionPoint.x, reflectionPoint.y);
      } else {
        this.handleToPrev.updatePosition(x, y);
        let reflectionPoint = (this.handleToPrev.position, this.position);
        this.handleToNext.updatePosition(reflectionPoint.x, reflectionPoint.y);
      }
      this.analyze();
      this.checkForHandleLock();
    }
    switchAngular() {
      if (this.handleToPrev.locked == false && this.handleToNext.locked == false) {
        this.angular = !this.angular;
        if (this.angular == false) {
          this.alignHandles();
        }
        this.analyze();
      }
    }
    alignHandles() {
      this.analyze();
      let alignedDistance = _p5.abs((this.handleToPrevDistance + this.handleToNextDistance) * 0.5);
      let direction1 = this.handleToPrevDirection;
      let direction2 = (this.handleToNextDirection, _p5.createVector(0, 0));
      let alignedDirection = p5.Vector.add(direction1, direction2).normalize();
      alignedDirection.mult(alignedDistance);
      let handlePos = _p5.createVector(this.position.x + alignedDirection.x, this.position.y + alignedDirection.y);
      let handlePosReflection = (handlePos, this.position);
      this.handleToPrev.updatePosition(handlePosReflection.x, handlePosReflection.y);
      this.handleToNext.updatePosition(handlePos.x, handlePos.y);
    }

    // –––––––––––––––––––––––––––––––––

    display(displayHandle) {
      _p5.push();
      if (displayHandle == true) {
        // _p5.line from anchor to handle
        _p5.strokeWeight(_p5.env.interfaceStrokeWeight);
        _p5.stroke(_p5.env.glyphEditor_anchorColor);
        _p5.noFill();
        _p5.line(this.handleToPrev.position.x, this.handleToPrev.position.y, this.position.x, this.position.y);
        _p5.line(this.handleToNext.position.x, this.handleToNext.position.y, this.position.x, this.position.y);
      }

      // _p5.env.display settings
      _p5.stroke(_p5.env.glyphEditor_anchorColor);
      if (this.active == true) {
        _p5.fill(_p5.env.activeColor);
      } else if (this.isHovered == true) {
        _p5.fill(_p5.env.hoverColor);
      } else {
        _p5.fill(_p5.env.backgroundColor);
      }
      if (this.angular == true) {
        _p5.rect(this.position.x, this.position.y, this.size * 0.9, this.size * 0.9);
        if (this.first == true || this.last == true) {
          _p5.noFill();
          _p5.rect(this.position.x, this.position.y, this.size * 0.9 + _p5.env.interfaceStrokeWeight * 6, this.size * 0.9 + _p5.env.interfaceStrokeWeight * 6);
        }
      } else {
        _p5.ellipse(this.position.x, this.position.y, this.size, this.size);
        if (this.first == true || this.last == true) {
          _p5.noFill();
          _p5.ellipse(this.position.x, this.position.y, this.size + _p5.env.interfaceStrokeWeight * 6, this.size + _p5.env.interfaceStrokeWeight * 6);
        }
      }
      this.displayConnection();
      if (displayHandle == true && this.handleToPrev.locked == false) {
        this.handleToPrev.display();
      }
      if (displayHandle == true && this.handleToNext.locked == false) {
        this.handleToNext.display();
      }
      _p5.pop();
    }
    displayConnection() {
      if (this.first == true && this.path.connectionToPrev == true || this.last == true && this.path.connectionToNext == true) {
        _p5.strokeWeight(_p5.env.interfaceStrokeWeight);
        if (this.active == true) {
          _p5.stroke(_p5.env.backgroundColor);
        } else if (this.isHovered == true) {
          _p5.stroke(_p5.env.glyphEditor_anchorColor);
        } else {
          _p5.stroke(_p5.env.glyphEditor_anchorColor);
        }
        _p5.noFill();
        if (this.angular == true) {
          _p5.line(this.position.x - this.size * 0.5, this.position.y - this.size * 0.5, this.position.x + this.size * 0.5, this.position.y + this.size * 0.5);
          _p5.line(this.position.x + this.size * 0.5, this.position.y - this.size * 0.5, this.position.x - this.size * 0.5, this.position.y + this.size * 0.5);
        } else {
          _p5.line(this.position.x - this.size * 0.35, this.position.y - this.size * 0.35, this.position.x + this.size * 0.35, this.position.y + this.size * 0.35);
          _p5.line(this.position.x + this.size * 0.35, this.position.y - this.size * 0.35, this.position.x - this.size * 0.35, this.position.y + this.size * 0.35);
        }
      }
    }

    // –––––––––––––––––––––––––––––––––

    checkState() {
      super.checkState();
      this.handleToPrev.checkState();
      this.handleToNext.checkState();
    }
    checkForHandleLock() {
      if (this.handleToPrevDistance < this.size * 0.5) {
        this.handleToPrev.locked = true;
        if (this.position.x != this.handleToPrev.position.x || this.position.y != this.handleToPrev.position.y) {
          this.handleToPrev.updatePosition(this.position.x, this.position.y);
        }
      } else {
        this.handleToPrev.locked = false;
      }
      if (this.handleToNextDistance < this.size * 0.5) {
        this.handleToNext.locked = true;
        if (this.position.x != this.handleToNext.position.x || this.position.y != this.handleToNext.position.y) {
          this.handleToNext.updatePosition(this.position.x, this.position.y);
        }
      } else {
        this.handleToNext.locked = false;
      }
      if (this.handleToPrev.locked == true || this.handleToNext.locked == true) {
        this.angular = true;
      }
    }
    analyze() {
      this.handleToPrevDistance = p5.Vector.dist(this.position, this.handleToPrev.position);
      this.handleToNextDistance = p5.Vector.dist(this.position, this.handleToNext.position);
      this.handleToPrevDirection = _p5.env.calcDirection(this.position, this.handleToPrev.position);
      this.handleToNextDirection = _p5.env.calcDirection(this.position, this.handleToNext.position);
      this.angle = _p5.env.calcAngle(this.handleToPrev.position, this.position, this.handleToNext.position);
      this.inwardsCenteredDirection = _p5.env.calcCenterDirection(this.handleToPrev.position, this.position, this.handleToNext.position, this.angle);
      this.outwardsCenteredDirection = _p5.env.calcCenterDirection(this.handleToNext.position, this.position, this.handleToPrev.position, this.angle);
    }
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  class HandleButton extends Button {
    constructor(a, x, y, s) {
      super(x, y, s, "handle");
      this.anchor = a;
      this.positionRelativeToAnchor = _p5.createVector(this.position.x - this.anchor.position.x, this.position.y - this.anchor.position.y);
      this.locked = false;
    }

    // –––––––––––––––––––––––––––––––––

    updatePosition(x, y) {
      this.position = _p5.createVector(x, y);
      this.positionRelativeToAnchor = _p5.createVector(this.position.x - this.anchor.position.x, this.position.y - this.anchor.position.y);
      this.anchor.analyze();
      this.anchor.checkForHandleLock();
    }
    updatePositionRelativeToAnchor() {
      let x = this.anchor.position.x + this.positionRelativeToAnchor.x;
      let y = this.anchor.position.y + this.positionRelativeToAnchor.y;
      this.position = _p5.createVector(x, y);
      this.anchor.analyze();
      this.anchor.checkForHandleLock();
    }

    // –––––––––––––––––––––––––––––––––

    display() {
      _p5.stroke(_p5.env.scriptColor);
      _p5.strokeWeight(_p5.env.interfaceStrokeWeight);
      if (this.anchor.active == true) {
        _p5.fill(_p5.env.activeColor);
      } else if (this.isHovered == true) {
        _p5.fill(_p5.env.hoverColor);
      } else {
        _p5.fill(_p5.env.backgroundColor);
      }
      _p5.ellipse(this.position.x, this.position.y, this.size, this.size);
    }
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  function rhombus(x, y, w, h) {
    _p5.beginShape();
    _p5.vertex(x, y - h * 0.5);
    _p5.vertex(x + w * 0.5, y);
    _p5.vertex(x, y + h * 0.5);
    _p5.vertex(x - w * 0.5, y);
    _p5.endShape(_p5.CLOSE);
  }
  // --- FILE: secuencia/js/export.js ---

  return {
    Button,
    GuideButton,
    PathButton,
    AnchorButton,
    HandleButton,
    
    
    
    rhombus,
    
    
  };
}