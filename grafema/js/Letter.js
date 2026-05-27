class Letter {
  constructor() {
    this.myWidth = 0.0;
    this.kappa = 0.553;
  }
}

class LetterA extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– A

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 1.0 * map(p1, 0.0, 1.0, 0.4, 2.0);
    var bar = map(p2, 0.0, 1.0, 0.7, 0.1);
    var topWidth = this.myWidth * constrain(map(p3, 0.0, 1.0, -1.0, 1.0), 0.01, 1.0);
    var par4 = map(p4, 0.0, 1.0, 0.0, 1.0);

    // FIX POINTS
    var topLeft = (this.myWidth/2)-(topWidth/2);
    var topRight = (this.myWidth/2)+(topWidth/2);
    var x1b = lerp(0, topLeft, bar);
    var y1b = lerp(0, -s, bar);
    var x2b = lerp(this.myWidth, topRight, bar);
    var y2b = lerp(0, -s, bar);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(0, 0);
    vertex(topLeft, -s);
    vertex(topRight, -s);
    vertex(this.myWidth, 0);
    endShape();
    line(x1b, y1b, x2b, y2b);
    pop();
  }
}

class LetterB extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– B

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.5 * map(p1, 0.0, 1.0, 0.2, 2.2);
    var yCenter = s * map(p2, 0.0, 1.0, 0.74, 0.3);
    var ratio = map(p3, 0.0, 1.0, 0.2, 0.8);

    // FIX POINTS
    var yCenUp = (s-yCenter)/2;
    var yCenDown = yCenter/2;
    var xWideUp = (this.myWidth*2)*ratio;
    var xWideDown = (this.myWidth*2)*(1-ratio);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(0, 0);
    vertex(0, -s);
    vertex(xWideUp, -s);
    bezierVertex(xWideUp+(yCenUp*this.kappa), -s,
      xWideUp+yCenUp, -(yCenter+yCenUp+(yCenUp*this.kappa)),
      xWideUp+yCenUp, -(yCenter+yCenUp));
    bezierVertex( xWideUp+yCenUp, -(yCenter+yCenUp-(yCenUp*this.kappa)),
      xWideUp+(yCenUp*this.kappa), -yCenter,
      xWideUp, -yCenter);
    vertex(0, -yCenter);
    vertex(xWideDown, -yCenter);
    bezierVertex( xWideDown+(yCenDown*this.kappa), -yCenter,
      xWideDown+yCenDown, -(yCenDown+(yCenDown*this.kappa)),
      xWideDown+yCenDown, -yCenDown);
    bezierVertex( xWideDown+yCenDown, -(yCenDown-(yCenDown*this.kappa)),
      xWideDown+(yCenDown*this.kappa), 0,
      xWideDown, 0);
    endShape(CLOSE);
    pop();
  }
}

class LetterC extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– C

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s;
    var aperture = 90 * map(p1, 0.0, 1.0, 1.0, 0.2);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    ellipseMode(CENTER);
    arc(s/2, -s/2, s, s, 0+aperture, 360-aperture, OPEN);
    ellipseMode(LEFT);
    pop();
  }
}

class LetterD extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– D

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.3 * map(p1, 0.0, 1.0, 0.2, 3.2);

    // FIX POINTS
    var offCurve = (s/2)*this.kappa;

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(0, 0);
    vertex(0, -s);
    vertex(this.myWidth, -s);
    bezierVertex( this.myWidth + offCurve, -s,
      this.myWidth+(s/2), -((s/2)+offCurve),
      this.myWidth+(s/2), -(s/2));
    bezierVertex( this.myWidth+(s/2), -((s/2)-offCurve),
      this.myWidth + offCurve, 0,
      this.myWidth, 0);
    endShape(CLOSE);
    pop();
  }
}

class LetterE extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– E

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.7 * map(p1, 0.0, 1.0, 0.2, 2.2);
    var yCenter = s * map(p2, 0.0, 1.0, 0.74, 0.3);
    var barLength = map(p3, 0.0, 1.0, 0.5, 0.95);

    // FIX POINTS
    var xCenter = this.myWidth/2;

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(this.myWidth, -s);
    vertex(0, -s);
    vertex(0, 0);
    vertex(this.myWidth, 0);
    endShape();
    line(0, -yCenter, this.myWidth*barLength, -yCenter);
    pop();
  }
}

class LetterF extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– F

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.7 * map(p1, 0.0, 1.0, 0.2, 2.2);
    var yCenter = s * map(p2, 0.0, 1.0, 0.74, 0.3);
    var barLength = map(p3, 0.0, 1.0, 0.5, 0.95);

    // FIX POINTS
    var xCenter = this.myWidth/2;

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(this.myWidth, -s);
    vertex(0, -s);
    vertex(0, 0);
    endShape();
    line(0, -yCenter, this.myWidth*barLength, -yCenter);
    pop();
  }
}

class LetterG extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– G

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s;
    var aperture = 90 * map(p1, 0.0, 1.0, 1.0, 0.2);
    this.myKappa = this.myWidth/2*this.kappa;
    var barLength = s * map(p2, 0.0, 1.0, 0.3, 0.8);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    ellipseMode(CENTER);
    arc(s/2, -s/2, s, s, 90, 360-aperture, OPEN);
    ellipseMode(LEFT);
    beginShape();
    vertex(this.myWidth/2, 0);
    bezierVertex(this.myWidth/2+this.myKappa, 0, this.myWidth, -this.myWidth/2+this.myKappa, this.myWidth, -this.myWidth/2);
    vertex(barLength, -this.myWidth/2);
    endShape();
    point(this.myWidth/2, 0);
    pop();
  }
}

class LetterH extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– H

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.8 * map(p1, 0.0, 1.0, 0.3, 2.2);
    var yCenter = s * map(p2, 0.0, 1.0, 0.74, 0.3);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    line(0, 0, 0, -s);
    line(this.myWidth, 0, this.myWidth, -s);
    line(0, -yCenter, this.myWidth, -yCenter);
    pop();
  }
}

class LetterI extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– I

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.5 * constrain(map(p1, 0.0, 1.0, -1.0, 1.0), 0.0, 1.0);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    //if (this.myWidth>minWeight) {
    //  line(0, 0, this.myWidth, 0);
    //  line(0, -s, this.myWidth, -s);
    //}
    line(this.myWidth/2, -s, this.myWidth/2, 0);
    pop();
  }
}

class LetterJ extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– J

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.5 * map(p1, 0.0, 1.0, 0.4, 2.0);
    var aperture = 135 * map(p2, 0.0, 1.0, 1.0, 0.0);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    ellipseMode(CENTER);
    arc(this.myWidth/2, -this.myWidth/2, this.myWidth, this.myWidth, 0, 90+aperture, OPEN);
    line(this.myWidth, -this.myWidth/2, this.myWidth, -s);
    ellipseMode(LEFT);
    point(this.myWidth, -this.myWidth/2);
    pop();
  }
}

class LetterK extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– K

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.6 * map(p1, 0.0, 1.0, 0.6, 2.4);
    var armPos = constrain(map(p2, 0.0, 1.0, 1.0, 0.0), 0.0, 0.8);
    var legPos = map(constrain(p3, 0.5, 1.0), 0.0, 1.0, -0.8, 0.8);

    // FIX POINTS
    var yArm = lerp(0, -s, armPos);
    var xHalfArm = lerp(0, this.myWidth, .5);
    var yHalfArm = lerp(yArm, -s, .5);
    var xLeg = lerp(0, this.myWidth, legPos);
    var yLeg = lerp(yArm, -s, legPos);
    var xHalfLeg = lerp(xLeg, this.myWidth, .5);
    var yHalfLeg = lerp(yLeg, 0, .5);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    line(0, 0, 0, -s);
    line(0, yArm, xHalfArm, yHalfArm);
    line(xLeg, yLeg, xHalfLeg, yHalfLeg);
    line(xHalfArm, yHalfArm, this.myWidth, -s);
    line(xHalfLeg, yHalfLeg, this.myWidth, 0);
    pop();
  }
}

class LetterL extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– L

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.5 * map(p1, 0.0, 1.0, 0.2, 2.2);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(0, -s);
    vertex(0, 0);
    vertex(this.myWidth, 0);
    endShape();
    pop();
  }
}

class LetterM extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– M

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.8 * map(p1, 0.0, 1.0, 0.6, 3.8);
    var yCenter = s * map(p2, 0.0, 1.0, 0.7, 0.0);
    var flatWidth = this.myWidth/3 * constrain(map(p3, 0.0, 1.0, -1.0, 1.0), 0.2, 1.0);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(0, 0);
    vertex(0, -s);
    //vertex(flatWidth, -s);
    //vertex((this.myWidth/2)-(flatWidth/2), -yCenter);
    vertex(this.myWidth/2, -yCenter);
    //vertex((this.myWidth/2)+(flatWidth/2), -yCenter);
    //vertex(this.myWidth-flatWidth, -s);
    vertex(this.myWidth, -s);
    vertex(this.myWidth, 0);
    endShape();
    pop();
  }
}

class LetterN extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– N

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.6 * map(p1, 0.0, 1.0, 0.6, 3.8);
    var flatWidth = this.myWidth/2 * constrain(map(p3, 0.0, 1.0, -1.0, 1.0), 0.1, 1.0);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(0, 0);
    vertex(0, -s);
    //vertex(flatWidth, -s);
    //vertex(this.myWidth-flatWidth, 0);
    vertex(this.myWidth, 0);
    vertex(this.myWidth, -s);
    endShape();
    pop();
  }
}

class LetterO extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– O

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s;

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    ellipseMode(CENTER);
    ellipse(s/2, -s/2, s, s);
    ellipseMode(LEFT);
    pop();
  }
}

class LetterP extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– P

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.5 * map(p1, 0.0, 1.0, 0.0, 2.2);
    var yCenter = s * map(p2, 0.0, 1.0, 0.74, 0.2);

    // FIX POINTS
    var yCenUp = (s-yCenter)/2;
    var yCenDown = yCenter/2;
    var xWideUp = this.myWidth;

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(0, 0);
    vertex(0, -s);
    vertex(xWideUp, -s);
    bezierVertex( xWideUp+(yCenUp*this.kappa), -s,
      xWideUp+yCenUp, -(yCenter+yCenUp+(yCenUp*this.kappa)),
      xWideUp+yCenUp, -(yCenter+yCenUp));
    bezierVertex( xWideUp+yCenUp, -(yCenter+yCenUp-(yCenUp*this.kappa)),
      xWideUp+(yCenUp*this.kappa), -yCenter,
      xWideUp, -yCenter);
    vertex(0, -yCenter);
    endShape();
    pop();
  }
}

class LetterQ extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– Q

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s;
    var tailRotation = map(p3, 0.0, 1.0, 0.0, -45.0);
    var tail = map(p4, 0.0, 1.0, 0.2, 0.6);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    ellipseMode(CENTER);
    ellipse(s/2, -s/2, s, s);
    ellipseMode(LEFT);

    translate(this.myWidth/2, -s/2);
    rotate(tailRotation);
    line(0, (this.myWidth/2)-s*tail, 0, (this.myWidth/2)+s*tail);
    pop();
  }
}

class LetterR extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– R

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.5 * map(p1, 0.0, 1.0, 0.0, 3.0);
    var yCenter = s * map(p2, 0.0, 1.0, 0.74, 0.3);
    var legTop = map(p3, 0.0, 1.0, 0.0, 1.0);
    var legBottom = map(p4, 0.0, 1.0, 1.5, 0.2);

    // FIX POINTS
    var yCenUp = (s-yCenter)/2;
    var yCenDown = yCenter/2;
    var xWideUp = this.myWidth;
    var xWideDown = xWideUp*legTop;
    var legBottomX = xWideDown+s*legBottom;

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(0, 0);
    vertex(0, -s);
    vertex(xWideUp, -s);
    bezierVertex( xWideUp+(yCenUp*this.kappa), -s,
      xWideUp+yCenUp, -(yCenter+yCenUp+(yCenUp*this.kappa)),
      xWideUp+yCenUp, -(yCenter+yCenUp));
    bezierVertex( xWideUp+yCenUp, -(yCenter+yCenUp-(yCenUp*this.kappa)),
      xWideUp+(yCenUp*this.kappa), -yCenter,
      xWideUp, -yCenter);
    vertex(0, -yCenter);
    vertex(xWideDown, -yCenter);
    vertex(legBottomX, 0);
    endShape();
    pop();
  }
}

class LetterS extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– S

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s;
    var apertureTop = 90 * map(p1, 0.0, 1.0, 0.0, 1.0);
    var yCenter = s * map(p2, 0.0, 1.0, 0.74, 0.3);
    var apertureBottom = 90 * map(p3, 0.0, 1.0, 0.0, 1.1);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    ellipseMode(CENTER);
    arc(this.myWidth/2, -s + (s/2-yCenter/2), s-yCenter, s-yCenter, 90, 360-apertureTop, OPEN);
    arc(this.myWidth/2, -yCenter/2, yCenter, yCenter, 270, 450+apertureBottom, OPEN);
    point(this.myWidth/2, -yCenter);
    ellipseMode(LEFT);
    pop();
  }
}

class LetterT extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– T

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.6 * map(p1, 0.0, 1.0, 0.4, 2.2);
    var xCenter = this.myWidth * map(p3, 0.0, 1.0, -0.2, 0.2);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    line(0, -s, this.myWidth, -s);
    //line((this.myWidth/2)+xCenter, -s, (this.myWidth/2)+xCenter, 0);
    line((this.myWidth/2), -s, (this.myWidth/2), 0);
    pop();
  }
}

class LetterU extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– U

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.5 * map(p1, 0.0, 1.0, 0.4, 2.6);

    // FIX POINTS
    this.myKappa = this.myWidth/2*this.kappa;

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(0, -s);
    vertex(0, -this.myWidth/2);
    bezierVertex(0, -this.myWidth/2+this.myKappa, this.myWidth/2-this.myKappa, 0, this.myWidth/2, 0);
    bezierVertex(this.myWidth/2+this.myKappa, 0, this.myWidth, -this.myWidth/2+this.myKappa, this.myWidth, -this.myWidth/2);
    vertex(this.myWidth, -s);
    endShape();
    pop();
  }
}

class LetterV extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– V

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 1.0 * map(p1, 0.0, 1.0, 0.4, 2.0);
    var bottomWidth = this.myWidth * constrain(map(p3, 0.0, 1.0, -1.0, 1.0), 0.05, 1.0);

    // FIX POINTS
    var bottomLeft = (this.myWidth/2)-(bottomWidth/2);
    var bottomRight = (this.myWidth/2)+(bottomWidth/2);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(0, -s);
    vertex(bottomLeft, 0);
    vertex(bottomRight, 0);
    vertex(this.myWidth, -s);
    endShape();
    pop();
  }
}

class LetterW extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– W

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 1.4 * map(p1, 0.0, 1.0, 0.4, 2.0);
    var segWidth = this.myWidth/4;
    var flat = 2;
    //var par2 = map(p2, 0.0, 1.0, 0.0, 1.0);
    //var par3 = map(p3, 0.0, 1.0, 0.0, 1.0);
    //var par4 = map(p4, 0.0, 1.0, 0.0, 1.0);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(0, -s);
    vertex(segWidth-flat, 0);
    vertex(segWidth+flat, 0);

    vertex(segWidth*2-flat, -s);
    vertex(segWidth*2+flat, -s);

    vertex(this.myWidth-segWidth-flat, 0);
    vertex(this.myWidth-segWidth+flat, 0);

    vertex(this.myWidth, -s);
    endShape();
    pop();
  }
}

class LetterX extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– X

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.8 * map(p1, 0.0, 1.0, 0.4, 2.4);
    var topWidth = this.myWidth * map(p2, 0.0, 1.0, 0.2, 0.8);
    var bottomWidth = this.myWidth-topWidth;

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    line(0, -s, this.myWidth, 0);
    line(0, 0, this.myWidth, -s);
    pop();
  }
}

class LetterY extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– Y

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 1.0 * map(p1, 0.0, 1.0, 0.4, 2.0);
    var yCenter = s * map(p2, 0.0, 1.0, 0.74, 0.3);
    var bottomWidth = this.myWidth * constrain(map(p3, 0.0, 1.0, -1.0, 1.0), 0.05, 1.0);

    // FIX POINTS
    var bottomLeft = (this.myWidth/2)-(bottomWidth/2);
    var bottomRight = (this.myWidth/2)+(bottomWidth/2);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex(0, -s);
    vertex(bottomLeft, -yCenter);
    vertex(bottomRight, -yCenter);
    vertex(this.myWidth, -s);
    endShape();
    line(this.myWidth/2, -yCenter, this.myWidth/2, 0);
    pop();
  }
}

class LetterZ extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– Z

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 0.8 * map(p1, 0.0, 1.0, 0.4, 2.4);
    var topWidth = this.myWidth * map(p2, 0.0, 1.0, 0.2, 0.8);
    var bottomWidth = this.myWidth-topWidth;

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    beginShape();
    vertex((this.myWidth-topWidth)/2, -s);
    vertex(this.myWidth-(this.myWidth-topWidth)/2, -s);
    vertex((this.myWidth-bottomWidth)/2, 0);
    vertex(this.myWidth-(this.myWidth-bottomWidth)/2, 0);
    endShape();
    pop();
  }
}

class Period extends Letter { // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– Period

  constructor() {
    super();
  }

  display(s, p1, p2, p3, p4) {

    // PARAMETERS
    this.myWidth = s * 1.0 * map(p1, 0.0, 1.0, 0.4, 2.0);

    // DRAW GLYPH
    push();
    translate(-this.myWidth/2, s/2);
    point(0, 0);
    pop();
  }
}