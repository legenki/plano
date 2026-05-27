class TextBox {

  constructor(tL) {

    this.seed = random(1000);

    this.position = createVector(0, 0);
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
    this.position = createVector(x, y);
    this.width = w;
    this.height = h;
    this.padding = p;
    this.reset();
  }

  setText(input) {
    this.textLines = input;
  }

  reset() {
    this.tempSize = size;
    this.tempWordSpace = (activeScript.wordSpace) * this.tempSize * 0.8 * (1 + wordSpace);

    this.tempSlant = slant;
    this.tempLetterSpace = letterSpace;
    this.tempLetterWidth = letterWidth;
    this.tempLetterHeight = letterHeight;
    this.temBaselineOffset = 0;

    this.prevGlyph = null;
    this.currGlyph = null;
    this.nextGlyph = null;

    this.resetX = this.position.x + this.padding;
    this.resetY = this.position.y + this.padding + lineHeight;

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

    strokeWeight(interfaceStrokeWeight);
    stroke(gridColor);

    let totalLines = floor((this.height - this.padding * 2) / (lineHeight));
    for (let y = 1; y <= totalLines; y++) {
      line(this.position.x + this.padding, this.position.y + this.padding + (y * lineHeight),
        this.position.x + this.width - this.padding, this.position.y + this.padding + (y * lineHeight));
    }
  }

  displayBox() {
    noFill();
    strokeWeight(interfaceStrokeWeight);
    stroke(gridColor);
    rect(this.position.x + (this.width * 0.5), this.position.y + (this.height * 0.5), this.width, this.height);
  }

  displayMissingGlyphs() {
    stroke(missingColor);
    // strokeWeight(scriptStrokeWeight * size / 100);
    strokeWeight(scriptStrokeWeight);
    noFill();
    for (let missing of this.displayMissingCollection) {
      let x = missing[0];
      let y = missing[1];
      let w = missing[2];
      let h = missing[3];
      rect(x + (w * 0.5), y + (h * 0.5), w, h);
      line(x, y, x + w, y + h);
      line(x, y + h, x + w, y);
    }
  }

  displayPaths() {
    stroke(scriptColor);
    // strokeWeight(scriptStrokeWeight * size / 100);
    strokeWeight(scriptStrokeWeight);
    noFill();
    strokeCap(ROUND);
    strokeJoin(ROUND);

    if (exportActive == true && exportSVGActive == true) {
      svgCanvas.stroke(scriptColor);
      // svgCanvas.strokeWeight(scriptStrokeWeight * size / 100);
      svgCanvas.strokeWeight(scriptStrokeWeight);
      svgCanvas.noFill();
      svgCanvas.strokeCap(ROUND);
      svgCanvas.strokeJoin(ROUND);
    }

    for (let path of this.displayPathsCollection) {

      if (exportActive == true && exportSVGActive == true) {
        svgCanvas.beginShape();
      } else {
        beginShape();
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
            vertex(p1.x, p1.y);
          }
        }

        if (exportActive == true && exportSVGActive == true) {
          svgCanvas.bezierVertex(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
        } else {
          bezierVertex(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
        }

      }

      if (exportActive == true && exportSVGActive == true) {
        svgCanvas.endShape();
      } else {
        endShape();
      }
    }
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  update() {

    noiseSeed(this.seed);

    this.reset();

    // Step through text line by line
    for (let i = 0; i < this.textLines.length; i++) {

      // end draw if word reach height max
      if (this.checkInsideYBounds(this.currGlyphY) == false) {
        break;
      }

      let words = this.textLines[i].split(/\s+/);

      for (let j = 0; j < words.length; j++) {

        // end draw if word reach height max
        if (this.checkInsideYBounds(this.currGlyphY) == false) {
          break;
        }


        // Step through lines glyph by glyph
        for (let k = 0; k < words[j].length; k++) {
          
          randomSeed((i+j+k) * 100);
          this.noiseIndex = random(10000);
    
        // end draw if word reach height max
        if (this.checkInsideYBounds(this.currGlyphY) == false) {
          break;
        }

          this.prevGlyph = (k > 0 && this.currGlyphX != this.resetX) ? activeScript.getGlyph(words[j].charAt(k - 1)) : null;
          this.currGlyph = activeScript.getGlyph(words[j].charAt(k));
          this.nextGlyph = k + 1 < words[j].length ? activeScript.getGlyph(words[j].charAt(k + 1)) : null;

          // If glyph is unknown add a wordspace
          if (this.currGlyph == null) {

            // this.addWordSpace();
            this.addMissing();

          } else {

            if (k > 0) {
              this.currGlyphX += this.relativeXPosition(this.tempLetterSpace);
            }

            this.tempSize += (noise(this.getNoiseIndex()) - 0.5) * randomSize;
            this.tempSize = max(this.tempSize, sizeMin);

            this.temBaselineOffset = (noise(this.getNoiseIndex()) - 0.5) * randomBaselineOffset;

            this.tempLetterSpace = letterSpace + ((noise(this.getNoiseIndex()) - 0.5) * (randomLetterSpace));
            this.tempLetterSpace = max(this.tempLetterSpace, letterSpaceMin);

            this.tempLetterWidth = letterWidth + ((noise(this.getNoiseIndex()) - 0.5) * randomLetterWidth);
            this.tempLetterWidth = max(this.tempLetterWidth, letterWidthMin);

            this.tempLetterHeight = letterHeight + ((noise(this.getNoiseIndex()) - 0.5) * randomLetterHeight);
            this.tempLetterHeight = max(this.tempLetterHeight, letterHeightMin);

            this.tempSlant = slant + ((noise(this.getNoiseIndex()) - 0.5) * randomSlant);
            // this.tempSlant = min(max(this.tempSlant, slantMin), slantMax);
            this.tempSlant = constrain(this.tempSlant, slantMin, slantMax) * -1; 

            if (this.currGlyph.paths.length > 0) {
              this.addGlyph();
              this.currGlyphX += this.relativeXPosition((this.currGlyph.width * this.tempLetterWidth) + this.currGlyph.leftSideBearing + this.currGlyph.rightSideBearing);
            } else {
              this.addMissing();
              this.currGlyphX += this.relativeXPosition((activeScript.defaultGlyphWidth * this.tempLetterWidth));
            }

            // reset tempSize to global value
            this.tempSize = size;
          }

          // check if word fits in line, else add linebreak and begin to redraw word
          if (this.checkInsideXBounds(this.currGlyphX) == false) {

            if (j == 0) { 
              // if first word in line is longer than line, save path points and jump to next line
              this.addTempPathsToGlobalPaths();
            } else {
              // reset temp paths and start all over again in next line
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

      // reset to start new line
      this.resetToNextLine();
    }

// reset seed
    randomSeed(Date.now()); 
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
        let tempNoiseX = (noise(this.getNoiseIndex()) - 0.5) * precision;
        let tempNoiseY = (noise(this.getNoiseIndex()) - 0.5) * precision;

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
          let angle = radians(rotateAll);
          let cosA = cos(angle);
          let sinA = sin(angle);
          
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

        // add bezier points to point collection array
        if (j > 0 || connectionToPrev == true) {
          if (this.tempWordDisplayPathsLevels[currPathLevel].length == 0) {
            this.tempWordDisplayPathsLevels[currPathLevel].push(createVector(this.prevAnchorX, this.prevAnchorY));
          }
          if (j > 0) {
            // add handle to prev if not already drawn before (prev glyphs path handle to next)
            this.tempWordDisplayPathsLevels[currPathLevel].push(createVector(this.prevHandleX, this.prevHandleY));
          }
          this.tempWordDisplayPathsLevels[currPathLevel].push(createVector(currHandleToPrevX, currHandleToPrevY));
          this.tempWordDisplayPathsLevels[currPathLevel].push(createVector(currentAnchorX, currentAnchorY));
        }

        // save current values for next anchor
        this.prevAnchorX = currentAnchorX;
        this.prevAnchorY = currentAnchorY;
        this.prevHandleX = currHandleToNextX;
        this.prevHandleY = currHandleToNextY;
      }

      // save points and reset path array if path ends
      if (connectionToNext == false) {
        this.tempWordDisplayPaths.push(this.tempWordDisplayPathsLevels[currPathLevel]);
        this.tempWordDisplayPathsLevels[currPathLevel] = [];
      } else {
        // already add handle to next for bezier in path
        this.tempWordDisplayPathsLevels[currPathLevel].push(createVector(this.prevHandleX, this.prevHandleY));
      }

    }

  }

  addMissing() {
    let w = this.relativeXPosition(activeScript.defaultGlyphWidth * letterWidth);
    let h = this.relativeYPosition(activeScript.ascenderHeight * letterHeight) * -1;
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
    this.currGlyphY += lineHeight;
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
