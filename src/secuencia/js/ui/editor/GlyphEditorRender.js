import { env } from '../../Config.js';

export function createRenderMethods(_p5) {
  return {
  display() {
    if (this.displayInfo) {
      this.displayGrid();
    }
    this.displayBox();
    this.displayGuides();
    this.displayGlyph();
  },
  displayGrid() {
    _p5.strokeWeight(_p5.env.interfaceStrokeWeight);
    _p5.stroke(_p5.env.gridColorLight);
    for (let x = 0; x < this.width; x += this.gridSize) {
      _p5.line(this.position.x + x, this.position.y, this.position.x + x, this.position.y + this.height);
    }
    for (let y = 0; y < this.height; y += this.gridSize) {
      _p5.line(this.position.x, this.position.y + y, this.position.x + this.width, this.position.y + y);
    }
    _p5.stroke(_p5.env.gridColor);
    for (let x = 0; x < this.width; x += this.gridSize * this.gridsPerSegment) {
      _p5.line(this.position.x + x, this.position.y, this.position.x + x, this.position.y + this.height);
    }
    for (let y = 0; y < this.height; y += this.gridSize * this.gridsPerSegment) {
      _p5.line(this.position.x, this.position.y + y, this.position.x + this.width, this.position.y + y);
    }
  },
  displayBox() {
    _p5.stroke(_p5.env.gridColor);
    _p5.strokeWeight(_p5.env.interfaceStrokeWeight);
    _p5.noFill();
    _p5.rect(this.position.x + this.width * 0.5, this.position.y + this.height * 0.5, this.width, this.height);
  },
  displayGuides() {
    _p5.strokeWeight(_p5.env.interfaceStrokeWeight);
    _p5.stroke(this.displayInfo == true ? _p5.env.glyphEditor_guideColor : _p5.env.gridColor);

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

    // _p5.env.display buttons
    if (this.displayInfo) {
      this.xHeightButton.display();
      this.ascenderHeightButton.display();
      this.descenderHeightButton.display();
      this.baselineButton.display();
      this.leftBoundingButton.display();
      this.rightBoundingButton.display();
    }
  },
  displayGlyph() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      path.display();
    }
  }
};
}
