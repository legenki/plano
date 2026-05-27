class Glyph {

  // CONSTRUCTOR / VARIABLES -----------------------------------------------------------------------------------
  constructor(x, y) {
    this.index = glyphs.length;
    this.active = true;
    this.focus = false;

    this.position = createVector(x, y);
    this.rotation = 0;
    this.size = 200;
    this.sizeMin = 100;
    this.sizeMax = 500;

    this.par1 = 0.25;
    this.par2 = 0.5;
    this.par3 = 0.5;
    this.par4 = 0.5;

    this.abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.myLetter = 'A';
    for (var i = 0; i < this.abc.length; i++) if (this.abc.charAt(i) == this.myLetter) this.abcIndex = i;
    this.abcAngle = map(this.abcIndex, 0, this.abc.length, 0, 360);
    this.setLetter(this.myLetter);
  }

  // DISPLAY -----------------------------------------------------------------------------------
  display() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotation);

    if (this.active == true) {
      if (this.focus == true) {
        stroke(textColorFocus);
      } else {
        stroke(textColor);
      }
    } else {
      stroke(textColorMute);
    }
    strokeWeight(glyphWeight);
    noFill();
    strokeCap(ROUND);
    strokeJoin(ROUND);

    this.myLetter.display(this.size, this.par1, this.par2, this.par3, this.par4);
    pop();

  }

  // UPDATE -----------------------------------------------------------------------------------
  updateStatus() {
    this.active != this.active;
  }

  updatePosition(t1, pt1, t2, pt2) {
    let touch = p5.Vector.lerp(createVector(t1.x, t1.y), createVector(t2.x, t2.y), 0.5);
    let prevtouch = p5.Vector.lerp(createVector(pt1.x, pt1.y), createVector(pt2.x, pt2.y), 0.5);
    let direction = p5.Vector.sub(touch, prevtouch);
    this.position.add(direction);
  }

  updateRotation(t1, pt1, t2, pt2) {
    let angle, prevangle;
    if (t2.y <= t1.y) {
      if (t2.x <= t1.x) angle = map(atan((t2.x - t1.x) / (t2.y - t1.y)), 90, 0, 270, 360);
      else angle = map(atan((t2.x - t1.x) / (t2.y - t1.y)), 0, -90, 0, 90);
    } else {
      angle = map(atan((t2.x - t1.x) / (t2.y - t1.y)), 90, -90, 90, 270);
    }

    if (pt2.y <= pt1.y) {
      if (pt2.x <= pt1.x) prevangle = map(atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 90, 0, 270, 360);
      else prevangle = map(atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 0, -90, 0, 90);
    } else {
      prevangle = map(atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 90, -90, 90, 270);
    }

    let direction = angle - prevangle;
    if (direction > 10.0 || direction < -10.0) direction = 0;
    this.rotation += direction * 3;
    if (this.rotation > 360) {
      this.rotation = this.rotation - 360;
    } else if (this.rotation < 0) {
      this.rotation = this.rotation + 360;
    }
  }

  updateSize(t1, pt1, t2, pt2) {
    let dist = p5.Vector.dist(createVector(t1.x, t1.y), createVector(t2.x, t2.y));
    let prevdistance = p5.Vector.dist(createVector(pt1.x, pt1.y), createVector(pt2.x, pt2.y));
    let direction = dist - prevdistance;
    this.size += direction * 2;
    this.size = constrain(this.size, this.sizeMin, this.sizeMax);
  }

  updatePar1(t1, pt1, t2, pt2) {
    let touch = (t1.x + t2.x) / 2;
    let prevtouch = (pt1.x + pt2.x) / 2;
    let direction = touch - prevtouch;
    this.par1 += map(direction, 0, 250, 0.0, 1.0);
    this.par1 = constrain(this.par1, 0.0, 1.0);
  }

  updatePar2(t1, pt1, t2, pt2) {
    let touch = (t1.y + t2.y) / 2;
    let prevtouch = (pt1.y + pt2.y) / 2;
    let direction = touch - prevtouch;
    this.par2 += map(direction, 0, 250, 0.0, 1.0);
    this.par2 = constrain(this.par2, 0.0, 1.0);
  }

  updatePar3(t1, pt1, t2, pt2) {
    let angle, prevangle;

    if (t2.y <= t1.y) {
      if (t2.x <= t1.x) angle = map(atan((t2.x - t1.x) / (t2.y - t1.y)), 90, 0, 270, 360);
      else angle = map(atan((t2.x - t1.x) / (t2.y - t1.y)), 0, -90, 0, 90);
    } else {
      angle = map(atan((t2.x - t1.x) / (t2.y - t1.y)), 90, -90, 90, 270);
    }

    if (pt2.y <= pt1.y) {
      if (pt2.x <= pt1.x) prevangle = map(atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 90, 0, 270, 360);
      else prevangle = map(atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 0, -90, 0, 90);
    } else {
      prevangle = map(atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 90, -90, 90, 270);
    }

    let direction = prevangle - angle;
    if (direction > 10.0 || direction < -10.0) direction = 0;
    this.par3 += map(direction, 0, 50, 0.0, 1.0);
    this.par3 = constrain(this.par3, 0.0, 1.0);
  }

  updatePar4(t1, pt1, t2, pt2) {
    var dist = p5.Vector.dist(createVector(t1.x, t1.y), createVector(t2.x, t2.y));
    var prevdistance = p5.Vector.dist(createVector(pt1.x, pt1.y), createVector(pt2.x, pt2.y));
    let direction = dist - prevdistance;
    this.par4 += map(direction, 0, 500, 0.0, 1.0);
    this.par4 = constrain(this.par4, 0.0, 1.0);
  }

  updateLetter(t1, pt1, t2, pt2) {
    let angle, prevangle;
    if (t2.y <= t1.y) {
      if (t2.x <= t1.x) angle = map(atan((t2.x - t1.x) / (t2.y - t1.y)), 90, 0, 270, 360);
      else angle = map(atan((t2.x - t1.x) / (t2.y - t1.y)), 0, -90, 0, 90);
    } else {
      angle = map(atan((t2.x - t1.x) / (t2.y - t1.y)), 90, -90, 90, 270);
    }

    if (pt2.y <= pt1.y) {
      if (pt2.x <= pt1.x) prevangle = map(atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 90, 0, 270, 360);
      else prevangle = map(atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 0, -90, 0, 90);
    } else {
      prevangle = map(atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 90, -90, 90, 270);
    }

    let direction = angle - prevangle;
    if (direction > 10.0 || direction < -10.0) direction = 0;
    this.abcAngle += direction * 2;
    if (this.abcAngle > 360) {
      this.abcAngle = this.abcAngle - 360;
    } else if (this.abcAngle < 0) {
      this.abcAngle = this.abcAngle + 360;
    }

    this.abcIndex = round(map(this.abcAngle, 0, 360, 0, this.abc.length));
    this.abcIndex = constrain(this.abcIndex, 0, this.abc.length - 1);
    this.myLetter = this.abc.charAt(this.abcIndex);
    this.setLetter(this.myLetter);
  }

  // HOVER -----------------------------------------------------------------------------------
  isHovered(x, y) {
    this.updateDimensions();
    if (pointInQuad(createVector(x, y), this.topLeft, this.topRight, this.bottomRight, this.bottomLeft)) {
      return true;
    } else {
      return false;
    }
  }

  updateDimensions() {
    this.topLeft = createVector(- this.myLetter.myWidth / 2, - this.size / 2);
    this.topRight = createVector(this.myLetter.myWidth / 2, - this.size / 2);
    this.bottomRight = createVector(this.myLetter.myWidth / 2, this.size / 2);
    this.bottomLeft = createVector(- this.myLetter.myWidth / 2, this.size / 2);
    this.topLeft.rotate(this.rotation);
    this.topRight.rotate(this.rotation);
    this.bottomRight.rotate(this.rotation);
    this.bottomLeft.rotate(this.rotation);
    this.topLeft.add(this.position);
    this.topRight.add(this.position);
    this.bottomRight.add(this.position);
    this.bottomLeft.add(this.position);
  }

  // SETUP  -----------------------------------------------------------------------------------
  setLetter(c) {

    switch (c) {
      case 'A':
        this.myLetter = new LetterA();
        break;
      case 'B':
        this.myLetter = new LetterB();
        break;
      case 'C':
        this.myLetter = new LetterC();
        break;
      case 'D':
        this.myLetter = new LetterD();
        break;
      case 'E':
        this.myLetter = new LetterE();
        break;
      case 'F':
        this.myLetter = new LetterF();
        break;
      case 'G':
        this.myLetter = new LetterG();
        break;
      case 'H':
        this.myLetter = new LetterH();
        break;
      case 'I':
        this.myLetter = new LetterI();
        break;
      case 'J':
        this.myLetter = new LetterJ();
        break;
      case 'K':
        this.myLetter = new LetterK();
        break;
      case 'L':
        this.myLetter = new LetterL();
        break;
      case 'M':
        this.myLetter = new LetterM();
        break;
      case 'N':
        this.myLetter = new LetterN();
        break;
      case 'O':
        this.myLetter = new LetterO();
        break;
      case 'P':
        this.myLetter = new LetterP();
        break;
      case 'Q':
        this.myLetter = new LetterQ();
        break;
      case 'R':
        this.myLetter = new LetterR();
        break;
      case 'S':
        this.myLetter = new LetterS();
        break;
      case 'T':
        this.myLetter = new LetterT();
        break;
      case 'U':
        this.myLetter = new LetterU();
        break;
      case 'V':
        this.myLetter = new LetterV();
        break;
      case 'W':
        this.myLetter = new LetterW();
        break;
      case 'X':
        this.myLetter = new LetterX();
        break;
      case 'Y':
        this.myLetter = new LetterY();
        break;
      case 'Z':
        this.myLetter = new LetterZ();
        break;
      case '.':
        this.myLetter = new Period();
        break;
      default:
        break;
    }
  }
}

function pointInQuad(pt, a, b, c, d) {
  let threshold = 30;

  a.add(createVector(-threshold, -threshold))
  b.add(createVector(threshold, -threshold))
  c.add(createVector(threshold, threshold))
  d.add(createVector(-threshold, threshold))

  return pointInTriangle(pt, a, b, c) || pointInTriangle(pt, a, c, d);
}

function pointInTriangle(pt, v1, v2, v3) {
  let d1 = sign(pt, v1, v2);
  let d2 = sign(pt, v2, v3);
  let d3 = sign(pt, v3, v1);

  let hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  let hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

  return !(hasNeg && hasPos);
}

function sign(p1, p2, p3) {
  return (p1.x - p3.x) * (p2.y - p3.y) -
    (p2.x - p3.x) * (p1.y - p3.y);
}

function pointToSegmentDistance(p, v, w) {
  // Abstand eines Punkts p zu einer Linie (v -> w)
  let l2 = p5.Vector.dist(v, w) ** 2;
  if (l2 === 0) return p5.Vector.dist(p, v);

  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = constrain(t, 0, 1);

  let projection = createVector(
    v.x + t * (w.x - v.x),
    v.y + t * (w.y - v.y)
  );

  return p5.Vector.dist(p, projection);
}