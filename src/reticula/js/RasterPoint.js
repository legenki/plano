export class RasterPoint {
  constructor(p, x, y, state) {
    this.p = p;
    this.state = state;
    this.position = p.createVector(x, y);
    this.onOff = [];
    for (var i = 0; i <= 2; i++) {
      this.onOff[i] = [];
    }
    this.threshold = 50;
    this.elementSize = p.ceil(this.state.gridSize / 2);
    this.shapes = []; 
  }

  update(tempScreen, factor) {
    for (var y = -1; y <= 1; y++) {
      for (var x = -1; x <= 1; x++) {
        // use Math.floor instead of int
        const px = Math.floor((this.position.x + (this.state.gridSize * x)) / factor);
        const py = Math.floor((this.position.y + (this.state.gridSize * y)) / factor);
        var pointColor = tempScreen.get(px, py);
        if (this.p.brightness(pointColor) >= this.threshold) {
          this.onOff[x + 1][y + 1] = true;
        } else {
          this.onOff[x + 1][y + 1] = false;
        }
      }
    }
  }

  display() {
    this.elementSize = this.state.gridSize / 2;
    this.shapes = []; 
    this.p.push();
    this.p.ellipseMode(this.p.CENTER);
    this.p.translate(this.position.x, this.position.y);
    this.p.strokeWeight(2);
    this.p.stroke(this.state.gridElementColor);
    this.p.fill(this.state.gridElementColor);

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
    this.p.pop();
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
