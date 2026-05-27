/**
 * GRAFEMA — Letter Classes (p5 Instance Mode)
 *
 * Factory function that receives a p5 instance and returns
 * all 27 letter/period classes. Each class draws its glyph
 * using the provided p5 instance methods.
 */

export function createLetterClasses(p) {

  class Letter {
    constructor() {
      this.myWidth = 0.0;
      this.kappa = 0.553;
    }
  }

  class LetterA extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 1.0 * p.map(p1, 0.0, 1.0, 0.4, 2.0);
      var bar = p.map(p2, 0.0, 1.0, 0.7, 0.1);
      var topWidth = this.myWidth * p.constrain(p.map(p3, 0.0, 1.0, -1.0, 1.0), 0.01, 1.0);
      var topLeft = (this.myWidth/2)-(topWidth/2);
      var topRight = (this.myWidth/2)+(topWidth/2);
      var x1b = p.lerp(0, topLeft, bar);
      var y1b = p.lerp(0, -s, bar);
      var x2b = p.lerp(this.myWidth, topRight, bar);
      var y2b = p.lerp(0, -s, bar);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(0, 0);
      p.vertex(topLeft, -s);
      p.vertex(topRight, -s);
      p.vertex(this.myWidth, 0);
      p.endShape();
      p.line(x1b, y1b, x2b, y2b);
      p.pop();
    }
  }

  class LetterB extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.5 * p.map(p1, 0.0, 1.0, 0.2, 2.2);
      var yCenter = s * p.map(p2, 0.0, 1.0, 0.74, 0.3);
      var ratio = p.map(p3, 0.0, 1.0, 0.2, 0.8);
      var yCenUp = (s-yCenter)/2;
      var yCenDown = yCenter/2;
      var xWideUp = (this.myWidth*2)*ratio;
      var xWideDown = (this.myWidth*2)*(1-ratio);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(0, 0);
      p.vertex(0, -s);
      p.vertex(xWideUp, -s);
      p.bezierVertex(xWideUp+(yCenUp*this.kappa), -s, xWideUp+yCenUp, -(yCenter+yCenUp+(yCenUp*this.kappa)), xWideUp+yCenUp, -(yCenter+yCenUp));
      p.bezierVertex(xWideUp+yCenUp, -(yCenter+yCenUp-(yCenUp*this.kappa)), xWideUp+(yCenUp*this.kappa), -yCenter, xWideUp, -yCenter);
      p.vertex(0, -yCenter);
      p.vertex(xWideDown, -yCenter);
      p.bezierVertex(xWideDown+(yCenDown*this.kappa), -yCenter, xWideDown+yCenDown, -(yCenDown+(yCenDown*this.kappa)), xWideDown+yCenDown, -yCenDown);
      p.bezierVertex(xWideDown+yCenDown, -(yCenDown-(yCenDown*this.kappa)), xWideDown+(yCenDown*this.kappa), 0, xWideDown, 0);
      p.endShape(p.CLOSE);
      p.pop();
    }
  }

  class LetterC extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s;
      var aperture = 90 * p.map(p1, 0.0, 1.0, 1.0, 0.2);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.ellipseMode(p.CENTER);
      p.arc(s/2, -s/2, s, s, 0+aperture, 360-aperture, p.OPEN);
      p.ellipseMode(p.LEFT);
      p.pop();
    }
  }

  class LetterD extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.3 * p.map(p1, 0.0, 1.0, 0.2, 3.2);
      var offCurve = (s/2)*this.kappa;
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(0, 0);
      p.vertex(0, -s);
      p.vertex(this.myWidth, -s);
      p.bezierVertex(this.myWidth + offCurve, -s, this.myWidth+(s/2), -((s/2)+offCurve), this.myWidth+(s/2), -(s/2));
      p.bezierVertex(this.myWidth+(s/2), -((s/2)-offCurve), this.myWidth + offCurve, 0, this.myWidth, 0);
      p.endShape(p.CLOSE);
      p.pop();
    }
  }

  class LetterE extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.7 * p.map(p1, 0.0, 1.0, 0.2, 2.2);
      var yCenter = s * p.map(p2, 0.0, 1.0, 0.74, 0.3);
      var barLength = p.map(p3, 0.0, 1.0, 0.5, 0.95);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(this.myWidth, -s);
      p.vertex(0, -s);
      p.vertex(0, 0);
      p.vertex(this.myWidth, 0);
      p.endShape();
      p.line(0, -yCenter, this.myWidth*barLength, -yCenter);
      p.pop();
    }
  }

  class LetterF extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.7 * p.map(p1, 0.0, 1.0, 0.2, 2.2);
      var yCenter = s * p.map(p2, 0.0, 1.0, 0.74, 0.3);
      var barLength = p.map(p3, 0.0, 1.0, 0.5, 0.95);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(this.myWidth, -s);
      p.vertex(0, -s);
      p.vertex(0, 0);
      p.endShape();
      p.line(0, -yCenter, this.myWidth*barLength, -yCenter);
      p.pop();
    }
  }

  class LetterG extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s;
      var aperture = 90 * p.map(p1, 0.0, 1.0, 1.0, 0.2);
      var myKappa = this.myWidth/2*this.kappa;
      var barLength = s * p.map(p2, 0.0, 1.0, 0.3, 0.8);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.ellipseMode(p.CENTER);
      p.arc(s/2, -s/2, s, s, 90, 360-aperture, p.OPEN);
      p.ellipseMode(p.LEFT);
      p.beginShape();
      p.vertex(this.myWidth/2, 0);
      p.bezierVertex(this.myWidth/2+myKappa, 0, this.myWidth, -this.myWidth/2+myKappa, this.myWidth, -this.myWidth/2);
      p.vertex(barLength, -this.myWidth/2);
      p.endShape();
      p.point(this.myWidth/2, 0);
      p.pop();
    }
  }

  class LetterH extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.8 * p.map(p1, 0.0, 1.0, 0.3, 2.2);
      var yCenter = s * p.map(p2, 0.0, 1.0, 0.74, 0.3);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.line(0, 0, 0, -s);
      p.line(this.myWidth, 0, this.myWidth, -s);
      p.line(0, -yCenter, this.myWidth, -yCenter);
      p.pop();
    }
  }

  class LetterI extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.5 * p.constrain(p.map(p1, 0.0, 1.0, -1.0, 1.0), 0.0, 1.0);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.line(this.myWidth/2, -s, this.myWidth/2, 0);
      p.pop();
    }
  }

  class LetterJ extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.5 * p.map(p1, 0.0, 1.0, 0.4, 2.0);
      var aperture = 135 * p.map(p2, 0.0, 1.0, 1.0, 0.0);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.ellipseMode(p.CENTER);
      p.arc(this.myWidth/2, -this.myWidth/2, this.myWidth, this.myWidth, 0, 90+aperture, p.OPEN);
      p.line(this.myWidth, -this.myWidth/2, this.myWidth, -s);
      p.ellipseMode(p.LEFT);
      p.point(this.myWidth, -this.myWidth/2);
      p.pop();
    }
  }

  class LetterK extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.6 * p.map(p1, 0.0, 1.0, 0.6, 2.4);
      var armPos = p.constrain(p.map(p2, 0.0, 1.0, 1.0, 0.0), 0.0, 0.8);
      var legPos = p.map(p.constrain(p3, 0.5, 1.0), 0.0, 1.0, -0.8, 0.8);
      var yArm = p.lerp(0, -s, armPos);
      var xHalfArm = p.lerp(0, this.myWidth, .5);
      var yHalfArm = p.lerp(yArm, -s, .5);
      var xLeg = p.lerp(0, this.myWidth, legPos);
      var yLeg = p.lerp(yArm, -s, legPos);
      var xHalfLeg = p.lerp(xLeg, this.myWidth, .5);
      var yHalfLeg = p.lerp(yLeg, 0, .5);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.line(0, 0, 0, -s);
      p.line(0, yArm, xHalfArm, yHalfArm);
      p.line(xLeg, yLeg, xHalfLeg, yHalfLeg);
      p.line(xHalfArm, yHalfArm, this.myWidth, -s);
      p.line(xHalfLeg, yHalfLeg, this.myWidth, 0);
      p.pop();
    }
  }

  class LetterL extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.5 * p.map(p1, 0.0, 1.0, 0.2, 2.2);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(0, -s);
      p.vertex(0, 0);
      p.vertex(this.myWidth, 0);
      p.endShape();
      p.pop();
    }
  }

  class LetterM extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.8 * p.map(p1, 0.0, 1.0, 0.6, 3.8);
      var yCenter = s * p.map(p2, 0.0, 1.0, 0.7, 0.0);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(0, 0);
      p.vertex(0, -s);
      p.vertex(this.myWidth/2, -yCenter);
      p.vertex(this.myWidth, -s);
      p.vertex(this.myWidth, 0);
      p.endShape();
      p.pop();
    }
  }

  class LetterN extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.6 * p.map(p1, 0.0, 1.0, 0.6, 3.8);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(0, 0);
      p.vertex(0, -s);
      p.vertex(this.myWidth, 0);
      p.vertex(this.myWidth, -s);
      p.endShape();
      p.pop();
    }
  }

  class LetterO extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s;
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.ellipseMode(p.CENTER);
      p.ellipse(s/2, -s/2, s, s);
      p.ellipseMode(p.LEFT);
      p.pop();
    }
  }

  class LetterP extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.5 * p.map(p1, 0.0, 1.0, 0.0, 2.2);
      var yCenter = s * p.map(p2, 0.0, 1.0, 0.74, 0.2);
      var yCenUp = (s-yCenter)/2;
      var xWideUp = this.myWidth;
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(0, 0);
      p.vertex(0, -s);
      p.vertex(xWideUp, -s);
      p.bezierVertex(xWideUp+(yCenUp*this.kappa), -s, xWideUp+yCenUp, -(yCenter+yCenUp+(yCenUp*this.kappa)), xWideUp+yCenUp, -(yCenter+yCenUp));
      p.bezierVertex(xWideUp+yCenUp, -(yCenter+yCenUp-(yCenUp*this.kappa)), xWideUp+(yCenUp*this.kappa), -yCenter, xWideUp, -yCenter);
      p.vertex(0, -yCenter);
      p.endShape();
      p.pop();
    }
  }

  class LetterQ extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s;
      var tailRotation = p.map(p3, 0.0, 1.0, 0.0, -45.0);
      var tail = p.map(p4, 0.0, 1.0, 0.2, 0.6);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.ellipseMode(p.CENTER);
      p.ellipse(s/2, -s/2, s, s);
      p.ellipseMode(p.LEFT);
      p.translate(this.myWidth/2, -s/2);
      p.rotate(tailRotation);
      p.line(0, (this.myWidth/2)-s*tail, 0, (this.myWidth/2)+s*tail);
      p.pop();
    }
  }

  class LetterR extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.5 * p.map(p1, 0.0, 1.0, 0.0, 3.0);
      var yCenter = s * p.map(p2, 0.0, 1.0, 0.74, 0.3);
      var legTop = p.map(p3, 0.0, 1.0, 0.0, 1.0);
      var legBottom = p.map(p4, 0.0, 1.0, 1.5, 0.2);
      var yCenUp = (s-yCenter)/2;
      var xWideUp = this.myWidth;
      var xWideDown = xWideUp*legTop;
      var legBottomX = xWideDown+s*legBottom;
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(0, 0);
      p.vertex(0, -s);
      p.vertex(xWideUp, -s);
      p.bezierVertex(xWideUp+(yCenUp*this.kappa), -s, xWideUp+yCenUp, -(yCenter+yCenUp+(yCenUp*this.kappa)), xWideUp+yCenUp, -(yCenter+yCenUp));
      p.bezierVertex(xWideUp+yCenUp, -(yCenter+yCenUp-(yCenUp*this.kappa)), xWideUp+(yCenUp*this.kappa), -yCenter, xWideUp, -yCenter);
      p.vertex(0, -yCenter);
      p.vertex(xWideDown, -yCenter);
      p.vertex(legBottomX, 0);
      p.endShape();
      p.pop();
    }
  }

  class LetterS extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s;
      var apertureTop = 90 * p.map(p1, 0.0, 1.0, 0.0, 1.0);
      var yCenter = s * p.map(p2, 0.0, 1.0, 0.74, 0.3);
      var apertureBottom = 90 * p.map(p3, 0.0, 1.0, 0.0, 1.1);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.ellipseMode(p.CENTER);
      p.arc(this.myWidth/2, -s + (s/2-yCenter/2), s-yCenter, s-yCenter, 90, 360-apertureTop, p.OPEN);
      p.arc(this.myWidth/2, -yCenter/2, yCenter, yCenter, 270, 450+apertureBottom, p.OPEN);
      p.point(this.myWidth/2, -yCenter);
      p.ellipseMode(p.LEFT);
      p.pop();
    }
  }

  class LetterT extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.6 * p.map(p1, 0.0, 1.0, 0.4, 2.2);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.line(0, -s, this.myWidth, -s);
      p.line((this.myWidth/2), -s, (this.myWidth/2), 0);
      p.pop();
    }
  }

  class LetterU extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.5 * p.map(p1, 0.0, 1.0, 0.4, 2.6);
      var myKappa = this.myWidth/2*this.kappa;
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(0, -s);
      p.vertex(0, -this.myWidth/2);
      p.bezierVertex(0, -this.myWidth/2+myKappa, this.myWidth/2-myKappa, 0, this.myWidth/2, 0);
      p.bezierVertex(this.myWidth/2+myKappa, 0, this.myWidth, -this.myWidth/2+myKappa, this.myWidth, -this.myWidth/2);
      p.vertex(this.myWidth, -s);
      p.endShape();
      p.pop();
    }
  }

  class LetterV extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 1.0 * p.map(p1, 0.0, 1.0, 0.4, 2.0);
      var bottomWidth = this.myWidth * p.constrain(p.map(p3, 0.0, 1.0, -1.0, 1.0), 0.05, 1.0);
      var bottomLeft = (this.myWidth/2)-(bottomWidth/2);
      var bottomRight = (this.myWidth/2)+(bottomWidth/2);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(0, -s);
      p.vertex(bottomLeft, 0);
      p.vertex(bottomRight, 0);
      p.vertex(this.myWidth, -s);
      p.endShape();
      p.pop();
    }
  }

  class LetterW extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 1.4 * p.map(p1, 0.0, 1.0, 0.4, 2.0);
      var segWidth = this.myWidth/4;
      var flat = 2;
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(0, -s);
      p.vertex(segWidth-flat, 0);
      p.vertex(segWidth+flat, 0);
      p.vertex(segWidth*2-flat, -s);
      p.vertex(segWidth*2+flat, -s);
      p.vertex(this.myWidth-segWidth-flat, 0);
      p.vertex(this.myWidth-segWidth+flat, 0);
      p.vertex(this.myWidth, -s);
      p.endShape();
      p.pop();
    }
  }

  class LetterX extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.8 * p.map(p1, 0.0, 1.0, 0.4, 2.4);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.line(0, -s, this.myWidth, 0);
      p.line(0, 0, this.myWidth, -s);
      p.pop();
    }
  }

  class LetterY extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 1.0 * p.map(p1, 0.0, 1.0, 0.4, 2.0);
      var yCenter = s * p.map(p2, 0.0, 1.0, 0.74, 0.3);
      var bottomWidth = this.myWidth * p.constrain(p.map(p3, 0.0, 1.0, -1.0, 1.0), 0.05, 1.0);
      var bottomLeft = (this.myWidth/2)-(bottomWidth/2);
      var bottomRight = (this.myWidth/2)+(bottomWidth/2);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex(0, -s);
      p.vertex(bottomLeft, -yCenter);
      p.vertex(bottomRight, -yCenter);
      p.vertex(this.myWidth, -s);
      p.endShape();
      p.line(this.myWidth/2, -yCenter, this.myWidth/2, 0);
      p.pop();
    }
  }

  class LetterZ extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 0.8 * p.map(p1, 0.0, 1.0, 0.4, 2.4);
      var topWidth = this.myWidth * p.map(p2, 0.0, 1.0, 0.2, 0.8);
      var bottomWidth = this.myWidth-topWidth;
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.beginShape();
      p.vertex((this.myWidth-topWidth)/2, -s);
      p.vertex(this.myWidth-(this.myWidth-topWidth)/2, -s);
      p.vertex((this.myWidth-bottomWidth)/2, 0);
      p.vertex(this.myWidth-(this.myWidth-bottomWidth)/2, 0);
      p.endShape();
      p.pop();
    }
  }

  class Period extends Letter {
    constructor() { super(); }
    display(s, p1, p2, p3, p4) {
      this.myWidth = s * 1.0 * p.map(p1, 0.0, 1.0, 0.4, 2.0);
      p.push();
      p.translate(-this.myWidth/2, s/2);
      p.point(0, 0);
      p.pop();
    }
  }

  // Return a map of character → class for easy lookup
  return {
    A: LetterA, B: LetterB, C: LetterC, D: LetterD,
    E: LetterE, F: LetterF, G: LetterG, H: LetterH,
    I: LetterI, J: LetterJ, K: LetterK, L: LetterL,
    M: LetterM, N: LetterN, O: LetterO, P: LetterP,
    Q: LetterQ, R: LetterR, S: LetterS, T: LetterT,
    U: LetterU, V: LetterV, W: LetterW, X: LetterX,
    Y: LetterY, Z: LetterZ, '.': Period
  };
}