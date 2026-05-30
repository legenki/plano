export class RasterPoint {
  constructor(p, x, y, state) {
    this.p = p;
    this.state = state;
    this.position = p.createVector(x, y);
    this.onOff = [];
    for (let i = 0; i < 3; i++) {
      this.onOff[i] = [];
    }
    this.centerBrightness = 0;
    this.elementSize = p.ceil(this.state.gridSize / 2);
    this.shapes = [];
  }

  update(tempScreen, factor) {
    // p.brightness() returns 0–100 (HSB). threshold is also 0–100.
    const threshold = this.state.densityThreshold ?? 50;
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const px = Math.floor((this.position.x + (this.state.gridSize * x)) / factor);
        const py = Math.floor((this.position.y + (this.state.gridSize * y)) / factor);
        const pointColor = tempScreen.get(px, py);
        const bright = this.p.brightness(pointColor); // 0–100
        if (x === 0 && y === 0) this.centerBrightness = bright;
        this.onOff[x + 1][y + 1] = bright >= threshold;
      }
    }
  }

  display() {
    const baseSize = this.state.gridSize / 2;
    const t = this.centerBrightness / 100; // normalised 0–1

    // --- Size mapping ---
    const sizeMapping = this.state.sizeMapping ?? 'fixed';
    if (sizeMapping === 'brightness') {
      this.elementSize = baseSize * t;
    } else if (sizeMapping === 'inverse') {
      this.elementSize = baseSize * (1 - t);
    } else {
      this.elementSize = baseSize;
    }
    // Guard against near-zero size
    if (this.elementSize < 1) this.elementSize = 1;

    // --- Stroke / Fill mode ---
    const strokeFill = this.state.strokeFill ?? 'fill';

    this.shapes = [];
    const shapeType = this.state.shapeType ?? 'metaball';

    this.p.push();
    this.p.translate(this.position.x, this.position.y);

    // Apply color with computed alpha
    const col = this.state.gridElementColor;
    const r = this.p.red(col);
    const g = this.p.green(col);
    const b = this.p.blue(col);

    const sw = this.state.strokeWeight ?? 2;

    if (strokeFill === 'fill') {
      this.p.noStroke();
      this.p.fill(r, g, b);
    } else if (strokeFill === 'stroke') {
      this.p.noFill();
      this.p.stroke(r, g, b);
      this.p.strokeWeight(sw);
    } else { // both
      this.p.fill(r, g, b);
      this.p.stroke(r, g, b);
      this.p.strokeWeight(sw);
    }

    this.p.ellipseMode(this.p.CENTER);
    this.p.rectMode(this.p.CENTER);

    if (shapeType === 'metaball') {
      this._displayMetaball();
    } else if (this.onOff[1][1]) {
      this._displaySimpleShape(shapeType);
    }

    this.p.pop();
  }

  // --- Original marching-squares metaball logic ---
  _displayMetaball() {
    this.p.rectMode(this.p.CORNER);
    if (this.onOff[1][1]) {
      // DOWN RIGHT
      if (this.onOff[2][1] || this.onOff[2][2] || this.onOff[1][2]) {
        this.element0();
        this.shapes.push({ type: "rect", rotation: 0 });
      } else {
        this.element1();
        this.shapes.push({ type: "curve", rotation: 0 });
      }

      // DOWN LEFT
      this.p.rotate(this.p.radians(90));
      if (this.onOff[0][1] || this.onOff[0][2] || this.onOff[1][2]) {
        this.element0();
        this.shapes.push({ type: "rect", rotation: 90 });
      } else {
        this.element1();
        this.shapes.push({ type: "curve", rotation: 90 });
      }

      // UP LEFT
      this.p.rotate(this.p.radians(90));
      if (this.onOff[0][1] || this.onOff[0][0] || this.onOff[1][0]) {
        this.element0();
        this.shapes.push({ type: "rect", rotation: 180 });
      } else {
        this.element1();
        this.shapes.push({ type: "curve", rotation: 180 });
      }

      // UP RIGHT
      this.p.rotate(this.p.radians(90));
      if (this.onOff[1][0] || this.onOff[2][0] || this.onOff[2][1]) {
        this.element0();
        this.shapes.push({ type: "rect", rotation: 270 });
      } else {
        this.element1();
        this.shapes.push({ type: "curve", rotation: 270 });
      }
    } else {
      // DOWN RIGHT
      if (this.onOff[2][1] && this.onOff[1][2]) {
        this.element2();
        this.shapes.push({ type: "curve2", rotation: 0 });
      }

      // DOWN LEFT
      this.p.rotate(this.p.radians(90));
      if (this.onOff[1][2] && this.onOff[0][1]) {
        this.element2();
        this.shapes.push({ type: "curve2", rotation: 90 });
      }

      // UP LEFT
      this.p.rotate(this.p.radians(90));
      if (this.onOff[0][1] && this.onOff[1][0]) {
        this.element2();
        this.shapes.push({ type: "curve2", rotation: 180 });
      }

      // UP RIGHT
      this.p.rotate(this.p.radians(90));
      if (this.onOff[1][0] && this.onOff[2][1]) {
        this.element2();
        this.shapes.push({ type: "curve2", rotation: 270 });
      }
    }
  }

  // --- Simple shape modes ---
  _displaySimpleShape(shapeType) {
    const s = this.elementSize;
    if (shapeType === 'circle') {
      this.p.ellipse(0, 0, s * 2, s * 2);
      this.shapes.push({ type: 'circle', rotation: 0 });
    } else if (shapeType === 'rect') {
      this.p.rect(0, 0, s * 2, s * 2);
      this.shapes.push({ type: 'rect-simple', rotation: 0 });
    } else if (shapeType === 'cross') {
      const w = s * 0.35;
      this.p.rect(0, 0, s * 2, w * 2);
      this.p.rect(0, 0, w * 2, s * 2);
      this.shapes.push({ type: 'cross', rotation: 0 });
    } else if (shapeType === 'custom') {
      this._displayCustomShape(s);
    }
  }

  _displayCustomShape(s) {
    const raw = this.state.customShapePath ?? '';
    if (!raw.trim()) return;

    // Replace the token 's' with the actual half-size value
    const d = raw.replace(/\bs\b/g, s.toFixed(2));

    try {
      const path = new Path2D(d);
      const ctx = this.p.drawingContext;
      const strokeFill = this.state.strokeFill ?? 'fill';
      if (strokeFill !== 'stroke') ctx.fill(path);
      if (strokeFill !== 'fill')   ctx.stroke(path);
      // Push a generic shape so SVG export can include it
      this.shapes.push({ type: 'custom', rotation: 0, d });
    } catch (e) {
      // Invalid path — draw a small dot as fallback
      this.p.ellipse(0, 0, s * 0.5, s * 0.5);
    }
  }

  element0() {
    this.p.rect(0, 0, this.elementSize, this.elementSize);
  }

  element1() {
    this.p.beginShape();
    this.p.vertex(0, 0);
    this.p.vertex(this.elementSize, 0);
    this.p.bezierVertex(
      this.elementSize, this.elementSize * this.state.magicNr,
      this.elementSize * this.state.magicNr, this.elementSize,
      0, this.elementSize
    );
    this.p.endShape(this.p.CLOSE);
  }

  element2() {
    this.p.beginShape();
    this.p.vertex(this.elementSize, 0);
    this.p.bezierVertex(
      this.elementSize, this.elementSize * this.state.magicNr,
      this.elementSize * this.state.magicNr, this.elementSize,
      0, this.elementSize
    );
    this.p.vertex(this.elementSize, this.elementSize);
    this.p.endShape(this.p.CLOSE);
  }
}
