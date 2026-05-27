/**
 * SECUENCIA — TextBox Model
 * Manages the text typesetting and rendering logic.
 * Requires _p5 (p5.js instance) passed as factory parameter.
 */

export function createTextBoxClass(_p5) {

class TextBox {

  constructor(tL) {

    this.seed = _p5.random(1000);

    this.position = _p5.createVector(0, 0);
    this.width;
    this.height;
    this.padding;

    this.setText(tL);

    this.tempSize;
    this.tempWordsSpace
    this.tempSpacing;
    this.tempLetterWidth;
    this.tempLetterHeight;
    this.tempSlant;
    this.temBaselineOffset;

    this.noiseIndex;

    this.prevGlyph;
    this.currGlyph;
    this.nextGlyph;

    this.resetX;
    this.resetY;

    this.currGlyphX;
    this.currGlyphY;

    this.prevAnchorX;
    this.prevAnchorY;
    this.prevHandleX;
    this.prevHandleY;

    this.displayPathsCollection;
    this.tempWordDisplayPaths;
    this.tempWordDisplayPathsLevels;

    this.displayMissingCollection;
    this.tempWordDisplayMissing;

    this.displayInfo = true;

    this.reset();
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  setDimensions(x, y, w, h, p) {
    this.position = _p5.createVector(x, y);
    this.width = w;
    this.height = h;
    this.padding = p;
    this.reset();
  }

  setText(input) {
    this.textLines = input;
  }

  reset() {
    this.tempSize = _p5.env.size;
    this.tempWordSpace = (_p5.env.activeScript.wordSpace) * this.tempSize * 0.8 * (1 + _p5.env.wordSpace);

    this.tempSlant = _p5.env.slant;
    this.tempLetterSpace = _p5.env.letterSpace;
    this.tempLetterWidth = _p5.env.letterWidth;
    this.tempLetterHeight = _p5.env.letterHeight;
    this.temBaselineOffset = 0;

    this.prevGlyph = null;
    this.currGlyph = null;
    this.nextGlyph = null;

    this.resetX = this.position.x + this.padding;
    this.resetY = this.position.y + this.padding + _p5.env.lineHeight;

    this.currGlyphX = this.resetX;
    this.currGlyphY = this.resetY;

    this.prevAnchorX = 0;
    this.prevAnchorY = 0;
    this.prevHandleX = 0;
    this.prevHandleY = 0;

    this.noiseIndex = 0;

    this.displayPathsCollection = [];
    this.tempWordDisplayPaths = [];
    this.tempWordDisplayPathsLevels = [];

    this.displayMissingCollection = [];
    this.tempWordDisplayMissing = [];
  }

  switchDisplayInfo() {
    this.displayInfo = !this.displayInfo;
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  display() {

    this.update();

    if (exportActive == false) {
      if (this.displayInfo) {
        this.displayLines();
        this.displayMissingGlyphs();
      }
    }

    this.displayPaths();

  }

  displayLines() {

    _p5.strokeWeight(interfaceStrokeWeight);
    _p5.stroke(_p5.env.gridColor);

    let totalLines = _p5.floor((this.height - this.padding * 2) / (_p5.env.lineHeight));
    for (let y = 1; y <= totalLines; y++) {
      _p5.line(this.position.x + this.padding, this.position.y + this.padding + (y * _p5.env.lineHeight),
        this.position.x + this.width - this.padding, this.position.y + this.padding + (y * _p5.env.lineHeight));
    }
  }

  displayBox() {
    _p5.noFill();
    _p5.strokeWeight(interfaceStrokeWeight);
    _p5.stroke(_p5.env.gridColor);
    _p5.rect(this.position.x + (this.width * 0.5), this.position.y + (this.height * 0.5), this.width, this.height);
  }

  displayMissingGlyphs() {
    _p5.stroke(_p5.env.missingColor);
    // _p5.strokeWeight(_p5.env.scriptStrokeWeight * _p5.env.size / 100);
    _p5.strokeWeight(_p5.env.scriptStrokeWeight);
    _p5.noFill();
    for (let missing of this.displayMissingCollection) {
      let x = missing[0];
      let y = missing[1];
      let w = missing[2];
      let h = missing[3];
      _p5.rect(x + (w * 0.5), y + (h * 0.5), w, h);
      _p5.line(x, y, x + w, y + h);
      _p5.line(x, y + h, x + w, y);
    }
  }

  displayPaths() {
    _p5.stroke(_p5.env.scriptColor);
    // _p5.strokeWeight(_p5.env.scriptStrokeWeight * _p5.env.size / 100);
    _p5.strokeWeight(_p5.env.scriptStrokeWeight);
    _p5.noFill();
    _p5.strokeCap(_p5.ROUND);
    _p5.strokeJoin(_p5.ROUND);

    if (exportActive == true && exportSVGActive == true) {
      svgCanvas.stroke(_p5.env.scriptColor);
      // svgCanvas.strokeWeight(_p5.env.scriptStrokeWeight * _p5.env.size / 100);
      svgCanvas.strokeWeight(_p5.env.scriptStrokeWeight);
      svgCanvas.noFill();
      svgCanvas.strokeCap(_p5.ROUND);
      svgCanvas.strokeJoin(_p5.ROUND);
    }

    for (let path of this.displayPathsCollection) {

      if (exportActive == true && exportSVGActive == true) {
        svgCanvas.beginShape();
      } else {
        _p5.beginShape();
      }

      // display points based on type
      for (var i = 0; i < path.length - 3; i += 3) {

        let p1 = path[i];
        let p2 = path[i + 1];
        let p3 = path[i + 2];
        let p4 = path[i + 3];

        if (i == 0) {
          if (exportActive == true && exportSVGActive == true) {
            svgCanvas.vertex(p1.x, p1.y);
          } else {
            _p5.vertex(p1.x, p1.y);
          }
        }

        if (exportActive == true && exportSVGActive == true) {
          svgCanvas.bezierVertex(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
        } else {
          _p5.bezierVertex(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
        }

      }

      if (exportActive == true && exportSVGActive == true) {
        svgCanvas.endShape();
      } else {
        _p5.endShape();
      }
    }
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  update() {

    _p5.noiseSeed(this.seed);

    this.reset();

    // Step through text _p5.line by _p5.line
    for (let i = 0; i < this.textLines.length; i++) {

      // end _p5.draw if word reach _p5.height _p5.max
      if (this.checkInsideYBounds(this.currGlyphY) == false) {
        break;
      }

      let words = this.textLines[i].split(/\s+/);

      for (let j = 0; j < words.length; j++) {

        // end _p5.draw if word reach _p5.height _p5.max
        if (this.checkInsideYBounds(this.currGlyphY) == false) {
          break;
        }


        // Step through lines glyph by glyph
        for (let k = 0; k < words[j].length; k++) {
          
          _p5.randomSeed((i+j+k) * 100);
          this.noiseIndex = _p5.random(10000);
    
        // end _p5.draw if word reach _p5.height _p5.max
        if (this.checkInsideYBounds(this.currGlyphY) == false) {
          break;
        }

          this.prevGlyph = (k > 0 && this.currGlyphX != this.resetX) ? _p5.env.activeScript.getGlyph(words[j].charAt(k - 1)) : null;
          this.currGlyph = _p5.env.activeScript.getGlyph(words[j].charAt(k));
          this.nextGlyph = k + 1 < words[j].length ? _p5.env.activeScript.getGlyph(words[j].charAt(k + 1)) : null;

          // If glyph is unknown add a wordspace
          if (this.currGlyph == null) {

            // this.addWordSpace();
            this.addMissing();

          } else {

            if (k > 0) {
              this.currGlyphX += this.relativeXPosition(this.tempLetterSpace);
            }

            this.tempSize += (_p5.noise(this.getNoiseIndex()) - 0.5) * _p5.env.randomSize;
            this.tempSize = _p5.max(this.tempSize, sizeMin);

            this.temBaselineOffset = (_p5.noise(this.getNoiseIndex()) - 0.5) * _p5.env.randomBaselineOffset;

            this.tempLetterSpace = _p5.env.letterSpace + ((_p5.noise(this.getNoiseIndex()) - 0.5) * (_p5.env.randomLetterSpace));
            this.tempLetterSpace = _p5.max(this.tempLetterSpace, letterSpaceMin);

            this.tempLetterWidth = _p5.env.letterWidth + ((_p5.noise(this.getNoiseIndex()) - 0.5) * _p5.env.randomLetterWidth);
            this.tempLetterWidth = _p5.max(this.tempLetterWidth, letterWidthMin);

            this.tempLetterHeight = _p5.env.letterHeight + ((_p5.noise(this.getNoiseIndex()) - 0.5) * _p5.env.randomLetterHeight);
            this.tempLetterHeight = _p5.max(this.tempLetterHeight, letterHeightMin);

            this.tempSlant = _p5.env.slant + ((_p5.noise(this.getNoiseIndex()) - 0.5) * _p5.env.randomSlant);
            // this.tempSlant = _p5.min(_p5.max(this.tempSlant, slantMin), slantMax);
            this.tempSlant = _p5.constrain(this.tempSlant, slantMin, slantMax) * -1; 

            if (this.currGlyph.paths.length > 0) {
              this.addGlyph();
              this.currGlyphX += this.relativeXPosition((this.currGlyph.width * this.tempLetterWidth) + this.currGlyph.leftSideBearing + this.currGlyph.rightSideBearing);
            } else {
              this.addMissing();
              this.currGlyphX += this.relativeXPosition((_p5.env.activeScript.defaultGlyphWidth * this.tempLetterWidth));
            }

            // reset tempSize to global value
            this.tempSize = _p5.env.size;
          }

          // check if word fits in _p5.line, else add linebreak and begin to redraw word
          if (this.checkInsideXBounds(this.currGlyphX) == false) {

            if (j == 0) { 
              // if first word in _p5.line is longer than _p5.line, _p5.save path points and jump to next _p5.line
              this.addTempPathsToGlobalPaths();
            } else {
              // reset temp paths and start all over again in next _p5.line
              this.resetTempPaths();
              k = -1; // reset loop index
            }

            this.resetToNextLine();

          }

        }

        // add paths of word to global displayPathsCollection
        this.addTempPathsToGlobalPaths();

        // add word spacing at end of word
        this.addWordSpace();
      }

      // reset to start new _p5.line
      this.resetToNextLine();
    }

// reset seed
    _p5.randomSeed(Date.now()); 
  }

  addGlyph() {

    for (let currPathLevel = 0; currPathLevel < this.currGlyph.paths.length; currPathLevel++) {

      if (currPathLevel == this.tempWordDisplayPathsLevels.length) {
        this.tempWordDisplayPathsLevels.push(new Array());
      }

      let path = this.currGlyph.paths[currPathLevel];

      if (this.currGlyph.paths[currPathLevel].connectionToPrev == false) {
        this.tempWordDisplayPathsLevels[currPathLevel] = [];
      }

      let connectionToPrev = (
        this.prevGlyph != null 
        && this.prevGlyph.paths.length > currPathLevel
        && this.prevGlyph.paths[currPathLevel].connectionToNext == true
        && this.currGlyph.paths[currPathLevel].connectionToPrev == true
      ) ? true : false;


      let connectionToNext = (
        this.currGlyph.paths[currPathLevel].connectionToNext == true
        && this.nextGlyph != null
        && this.nextGlyph.paths.length > currPathLevel
        && this.nextGlyph.paths[currPathLevel].connectionToPrev == true
      ) ? true : false;

      for (let j = 0; j < path.anchors.length; j++) {

        let anchor = path.anchors[j];
        let handleToPrev = anchor.handleToPrev;
        let handleToNext = anchor.handleToNext;

        // tempNoise for similar anchor and handle distortion
        let tempNoiseX = (_p5.noise(this.getNoiseIndex()) - 0.5) * _p5.env.precision;
        let tempNoiseY = (_p5.noise(this.getNoiseIndex()) - 0.5) * _p5.env.precision;

        // calc temp anchor positioning
        let tempAnchorX = this.relativeXPosition((((anchor.position.x - this.currGlyph.leftSideBearing) * this.tempLetterWidth) + this.currGlyph.leftSideBearing) + tempNoiseX);
        let tempAnchorY = this.relativeYPosition((anchor.position.y * this.tempLetterHeight) + (this.temBaselineOffset * this.tempLetterHeight) + tempNoiseY);
        let tempHandleToPrevX = this.relativeXPosition((((handleToPrev.position.x - this.currGlyph.leftSideBearing) * this.tempLetterWidth) + this.currGlyph.leftSideBearing) + tempNoiseX);
        let tempHandleToPrevY = this.relativeYPosition((handleToPrev.position.y * this.tempLetterHeight) + (this.temBaselineOffset * this.tempLetterHeight) + tempNoiseY);
        let tempHandleToNextX = this.relativeXPosition((((handleToNext.position.x - this.currGlyph.leftSideBearing) * this.tempLetterWidth) + this.currGlyph.leftSideBearing) + tempNoiseX);
        let tempHandleToNextY = this.relativeYPosition((handleToNext.position.y * this.tempLetterHeight) + (this.temBaselineOffset * this.tempLetterHeight) + tempNoiseY);


        // calc current anchor and handle position
        let currentAnchorX, currentAnchorY, currHandleToPrevX, currHandleToPrevY, currHandleToNextX, currHandleToNextY;

        if (typeof rotateAll !== 'undefined' && rotateAll !== 0) {
          let angle = _p5.radians(rotateAll);
          let cosA = _p5.cos(angle);
          let sinA = _p5.sin(angle);
          
          let ax = tempAnchorX + (tempAnchorY * this.tempSlant);
          let ay = tempAnchorY;
          currentAnchorX = this.currGlyphX + (ax * cosA - ay * sinA);
          currentAnchorY = this.currGlyphY + (ax * sinA + ay * cosA);

          let hpx = tempHandleToPrevX + (tempHandleToPrevY * this.tempSlant);
          let hpy = tempHandleToPrevY;
          currHandleToPrevX = this.currGlyphX + (hpx * cosA - hpy * sinA);
          currHandleToPrevY = this.currGlyphY + (hpx * sinA + hpy * cosA);

          let hnx = tempHandleToNextX + (tempHandleToNextY * this.tempSlant);
          let hny = tempHandleToNextY;
          currHandleToNextX = this.currGlyphX + (hnx * cosA - hny * sinA);
          currHandleToNextY = this.currGlyphY + (hnx * sinA + hny * cosA);
        } else {
          currentAnchorX = this.currGlyphX + tempAnchorX + (tempAnchorY * this.tempSlant);
          currentAnchorY = this.currGlyphY + tempAnchorY;
          currHandleToPrevX = this.currGlyphX + tempHandleToPrevX + (tempHandleToPrevY * this.tempSlant);
          currHandleToPrevY = this.currGlyphY + tempHandleToPrevY;
          currHandleToNextX = this.currGlyphX + tempHandleToNextX + (tempHandleToNextY * this.tempSlant);
          currHandleToNextY = this.currGlyphY + tempHandleToNextY;
        }

        // add _p5.bezier points to _p5.point collection array
        if (j > 0 || connectionToPrev == true) {
          if (this.tempWordDisplayPathsLevels[currPathLevel].length == 0) {
            this.tempWordDisplayPathsLevels[currPathLevel].push(_p5.createVector(this.prevAnchorX, this.prevAnchorY));
          }
          if (j > 0) {
            // add handle to prev if not already drawn before (prev glyphs path handle to next)
            this.tempWordDisplayPathsLevels[currPathLevel].push(_p5.createVector(this.prevHandleX, this.prevHandleY));
          }
          this.tempWordDisplayPathsLevels[currPathLevel].push(_p5.createVector(currHandleToPrevX, currHandleToPrevY));
          this.tempWordDisplayPathsLevels[currPathLevel].push(_p5.createVector(currentAnchorX, currentAnchorY));
        }

        // _p5.save current values for next anchor
        this.prevAnchorX = currentAnchorX;
        this.prevAnchorY = currentAnchorY;
        this.prevHandleX = currHandleToNextX;
        this.prevHandleY = currHandleToNextY;
      }

      // _p5.save points and reset path array if path ends
      if (connectionToNext == false) {
        this.tempWordDisplayPaths.push(this.tempWordDisplayPathsLevels[currPathLevel]);
        this.tempWordDisplayPathsLevels[currPathLevel] = [];
      } else {
        // already add handle to next for _p5.bezier in path
        this.tempWordDisplayPathsLevels[currPathLevel].push(_p5.createVector(this.prevHandleX, this.prevHandleY));
      }

    }

  }

  addMissing() {
    let w = this.relativeXPosition(_p5.env.activeScript.defaultGlyphWidth * _p5.env.letterWidth);
    let h = this.relativeYPosition(_p5.env.activeScript.ascenderHeight * _p5.env.letterHeight) * -1;
    let x = this.currGlyphX;
    let y = this.currGlyphY;
    this.tempWordDisplayMissing.push([x, y, w, h]);
  }

  addWordSpace() {

    // this.currGlyphX += this.relativeXPosition(this.tempWordSpace);
    this.currGlyphX += this.tempWordSpace + this.relativeXPosition(this.tempLetterSpace);
    this.prevAnchorX = this.currGlyphX;
    this.prevAnchorY = this.currGlyphY;

  }

  addTempPathsToGlobalPaths() {

    for (let level of this.tempWordDisplayPathsLevels) {
      this.tempWordDisplayPaths.push(level);
    }

    for (let path of this.tempWordDisplayPaths) {
      this.displayPathsCollection.push(path);
    }
    for (let missing of this.tempWordDisplayMissing) {
      this.displayMissingCollection.push(missing);
    }

    this.resetTempPaths();
  }

  resetTempPaths() {
    this.tempWordDisplayPathsLevels = [];
    this.tempWordDisplayPaths = [];
    this.tempWordDisplayMissing = [];
  }

  resetToNextLine() {
    this.currGlyphX = this.resetX;
    this.currGlyphY += _p5.env.lineHeight;
    this.prevGlyph = null;
    this.currGlyph = null;
    this.nextGlyph = null;
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  relativeXPosition(absolutePosition) {
    this.increaseNoiseIndex();
    // return ((absolutePosition * this.tempLetterWidth) * this.tempSize);
    return (absolutePosition * this.tempSize);
  }

  relativeYPosition(absolutePosition) {
    this.increaseNoiseIndex();
    // return ((absolutePosition * this.tempLetterHeight) * this.tempSize);
    return (absolutePosition * this.tempSize);
  }

  absoluteXPosition(relativePosition) {
    this.increaseNoiseIndex();
    return ((relativePosition / this.tempLetterWidth) / this.tempSize);
  }

  absoluteYPosition(relativePosition) {
    this.increaseNoiseIndex();
    return ((relativePosition / this.tempLetterHeight) / this.tempSize);
  }

  checkInsideXBounds(checkPosition) {
    if (checkPosition >= this.position.x + this.padding &&
      checkPosition <= this.position.x + this.width - this.padding) {
      return true;
    }
    return false;
  }

  checkInsideYBounds(checkPosition) {
    if (checkPosition >= this.position.y + this.padding &&
      checkPosition <= this.position.y + this.height - this.padding) {
      return true;
    }
    return false;
  }

  getNoiseIndex() {
    this.increaseNoiseIndex();
    return this.noiseIndex;
  }

  increaseNoiseIndex() {
    this.noiseIndex++;
  }

}


// --- FILE: secuencia/js/glyph.js ---

  return TextBox;
}
