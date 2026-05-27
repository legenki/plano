/**
 * GRAFEMA — Glyph Class (p5 Instance Mode)
 *
 * Factory that receives p5 instance and letter-class map,
 * returns the Glyph class and geometry utilities.
 */

export function createGlyphClass(p, LetterClasses) {

  class Glyph {
    constructor(x, y) {
      this.active = true;
      this.focus = false;

      this.position = p.createVector(x, y);
      this.rotation = 0;
      this.size = 200;
      this.sizeMin = 100;
      this.sizeMax = 500;

      this.par1 = 0.25;
      this.par2 = 0.5;
      this.par3 = 0.5;
      this.par4 = 0.5;

      this.abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      this.myLetterChar = 'A';
      for (var i = 0; i < this.abc.length; i++) {
        if (this.abc.charAt(i) === this.myLetterChar) this.abcIndex = i;
      }
      this.abcAngle = p.map(this.abcIndex, 0, this.abc.length, 0, 360);
      this.setLetter(this.myLetterChar);
    }

    // --- DISPLAY ---
    display(textColor, textColorMute, textColorFocus, glyphWeight) {
      p.push();
      p.translate(this.position.x, this.position.y);
      p.rotate(this.rotation);

      if (this.active) {
        p.stroke(this.focus ? textColorFocus : textColor);
      } else {
        p.stroke(textColorMute);
      }
      p.strokeWeight(glyphWeight);
      p.noFill();
      p.strokeCap(p.ROUND);
      p.strokeJoin(p.ROUND);

      this.myLetter.display(this.size, this.par1, this.par2, this.par3, this.par4);
      p.pop();
    }

    // --- UPDATE ---
    updateStatus() {
      this.active = !this.active;
    }

    updatePosition(t1, pt1, t2, pt2) {
      let touch = p5.Vector.lerp(p.createVector(t1.x, t1.y), p.createVector(t2.x, t2.y), 0.5);
      let prevtouch = p5.Vector.lerp(p.createVector(pt1.x, pt1.y), p.createVector(pt2.x, pt2.y), 0.5);
      let direction = p5.Vector.sub(touch, prevtouch);
      this.position.add(direction);
    }

    updateRotation(t1, pt1, t2, pt2) {
      let angle, prevangle;
      if (t2.y <= t1.y) {
        if (t2.x <= t1.x) angle = p.map(p.atan((t2.x - t1.x) / (t2.y - t1.y)), 90, 0, 270, 360);
        else angle = p.map(p.atan((t2.x - t1.x) / (t2.y - t1.y)), 0, -90, 0, 90);
      } else {
        angle = p.map(p.atan((t2.x - t1.x) / (t2.y - t1.y)), 90, -90, 90, 270);
      }
      if (pt2.y <= pt1.y) {
        if (pt2.x <= pt1.x) prevangle = p.map(p.atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 90, 0, 270, 360);
        else prevangle = p.map(p.atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 0, -90, 0, 90);
      } else {
        prevangle = p.map(p.atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 90, -90, 90, 270);
      }
      let dir = angle - prevangle;
      if (dir > 10.0 || dir < -10.0) dir = 0;
      this.rotation += dir * 3;
      if (this.rotation > 360) this.rotation -= 360;
      else if (this.rotation < 0) this.rotation += 360;
    }

    updateSize(t1, pt1, t2, pt2) {
      let d = p5.Vector.dist(p.createVector(t1.x, t1.y), p.createVector(t2.x, t2.y));
      let prevdistance = p5.Vector.dist(p.createVector(pt1.x, pt1.y), p.createVector(pt2.x, pt2.y));
      let direction = d - prevdistance;
      this.size += direction * 2;
      this.size = p.constrain(this.size, this.sizeMin, this.sizeMax);
    }

    updatePar1(t1, pt1, t2, pt2) {
      let touch = (t1.x + t2.x) / 2;
      let prevtouch = (pt1.x + pt2.x) / 2;
      let direction = touch - prevtouch;
      this.par1 += p.map(direction, 0, 250, 0.0, 1.0);
      this.par1 = p.constrain(this.par1, 0.0, 1.0);
    }

    updatePar2(t1, pt1, t2, pt2) {
      let touch = (t1.y + t2.y) / 2;
      let prevtouch = (pt1.y + pt2.y) / 2;
      let direction = touch - prevtouch;
      this.par2 += p.map(direction, 0, 250, 0.0, 1.0);
      this.par2 = p.constrain(this.par2, 0.0, 1.0);
    }

    updatePar3(t1, pt1, t2, pt2) {
      let angle, prevangle;
      if (t2.y <= t1.y) {
        if (t2.x <= t1.x) angle = p.map(p.atan((t2.x - t1.x) / (t2.y - t1.y)), 90, 0, 270, 360);
        else angle = p.map(p.atan((t2.x - t1.x) / (t2.y - t1.y)), 0, -90, 0, 90);
      } else {
        angle = p.map(p.atan((t2.x - t1.x) / (t2.y - t1.y)), 90, -90, 90, 270);
      }
      if (pt2.y <= pt1.y) {
        if (pt2.x <= pt1.x) prevangle = p.map(p.atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 90, 0, 270, 360);
        else prevangle = p.map(p.atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 0, -90, 0, 90);
      } else {
        prevangle = p.map(p.atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 90, -90, 90, 270);
      }
      let direction = prevangle - angle;
      if (direction > 10.0 || direction < -10.0) direction = 0;
      this.par3 += p.map(direction, 0, 50, 0.0, 1.0);
      this.par3 = p.constrain(this.par3, 0.0, 1.0);
    }

    updatePar4(t1, pt1, t2, pt2) {
      var d = p5.Vector.dist(p.createVector(t1.x, t1.y), p.createVector(t2.x, t2.y));
      var prevdistance = p5.Vector.dist(p.createVector(pt1.x, pt1.y), p.createVector(pt2.x, pt2.y));
      let direction = d - prevdistance;
      this.par4 += p.map(direction, 0, 500, 0.0, 1.0);
      this.par4 = p.constrain(this.par4, 0.0, 1.0);
    }

    updateLetter(t1, pt1, t2, pt2) {
      let angle, prevangle;
      if (t2.y <= t1.y) {
        if (t2.x <= t1.x) angle = p.map(p.atan((t2.x - t1.x) / (t2.y - t1.y)), 90, 0, 270, 360);
        else angle = p.map(p.atan((t2.x - t1.x) / (t2.y - t1.y)), 0, -90, 0, 90);
      } else {
        angle = p.map(p.atan((t2.x - t1.x) / (t2.y - t1.y)), 90, -90, 90, 270);
      }
      if (pt2.y <= pt1.y) {
        if (pt2.x <= pt1.x) prevangle = p.map(p.atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 90, 0, 270, 360);
        else prevangle = p.map(p.atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 0, -90, 0, 90);
      } else {
        prevangle = p.map(p.atan((pt2.x - pt1.x) / (pt2.y - pt1.y)), 90, -90, 90, 270);
      }
      let direction = angle - prevangle;
      if (direction > 10.0 || direction < -10.0) direction = 0;
      this.abcAngle += direction * 2;
      if (this.abcAngle > 360) this.abcAngle -= 360;
      else if (this.abcAngle < 0) this.abcAngle += 360;
      this.abcIndex = p.round(p.map(this.abcAngle, 0, 360, 0, this.abc.length));
      this.abcIndex = p.constrain(this.abcIndex, 0, this.abc.length - 1);
      this.myLetterChar = this.abc.charAt(this.abcIndex);
      this.setLetter(this.myLetterChar);
    }

    // --- HOVER ---
    isHovered(x, y) {
      this.updateDimensions();
      return pointInQuad(p.createVector(x, y), this.topLeft, this.topRight, this.bottomRight, this.bottomLeft);
    }

    updateDimensions() {
      this.topLeft = p.createVector(-this.myLetter.myWidth / 2, -this.size / 2);
      this.topRight = p.createVector(this.myLetter.myWidth / 2, -this.size / 2);
      this.bottomRight = p.createVector(this.myLetter.myWidth / 2, this.size / 2);
      this.bottomLeft = p.createVector(-this.myLetter.myWidth / 2, this.size / 2);
      this.topLeft.rotate(this.rotation);
      this.topRight.rotate(this.rotation);
      this.bottomRight.rotate(this.rotation);
      this.bottomLeft.rotate(this.rotation);
      this.topLeft.add(this.position);
      this.topRight.add(this.position);
      this.bottomRight.add(this.position);
      this.bottomLeft.add(this.position);
    }

    // --- SET LETTER ---
    setLetter(c) {
      const LetterClass = LetterClasses[c];
      if (LetterClass) {
        this.myLetter = new LetterClass();
        this.myLetterChar = c;
      }
    }

    // --- SERIALIZATION (for Undo/Redo) ---
    serialize() {
      return {
        x: this.position.x,
        y: this.position.y,
        rotation: this.rotation,
        size: this.size,
        par1: this.par1,
        par2: this.par2,
        par3: this.par3,
        par4: this.par4,
        letter: this.myLetterChar,
        active: this.active,
        focus: this.focus,
        abcIndex: this.abcIndex,
        abcAngle: this.abcAngle
      };
    }

    static deserialize(data) {
      const g = new Glyph(data.x, data.y);
      g.rotation = data.rotation;
      g.size = data.size;
      g.par1 = data.par1;
      g.par2 = data.par2;
      g.par3 = data.par3;
      g.par4 = data.par4;
      g.active = data.active;
      g.focus = data.focus;
      g.abcIndex = data.abcIndex;
      g.abcAngle = data.abcAngle;
      g.setLetter(data.letter);
      return g;
    }
  }

  // --- GEOMETRY UTILITIES ---

  function pointInQuad(pt, a, b, c, d) {
    const threshold = 30;
    const aa = p5.Vector.add(a, p.createVector(-threshold, -threshold));
    const bb = p5.Vector.add(b, p.createVector(threshold, -threshold));
    const cc = p5.Vector.add(c, p.createVector(threshold, threshold));
    const dd = p5.Vector.add(d, p.createVector(-threshold, threshold));
    return pointInTriangle(pt, aa, bb, cc) || pointInTriangle(pt, aa, cc, dd);
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
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  }

  function pointToSegmentDistance(pt, v, w) {
    let l2 = p5.Vector.dist(v, w) ** 2;
    if (l2 === 0) return p5.Vector.dist(pt, v);
    let t = ((pt.x - v.x) * (w.x - v.x) + (pt.y - v.y) * (w.y - v.y)) / l2;
    t = p.constrain(t, 0, 1);
    let projection = p.createVector(
      v.x + t * (w.x - v.x),
      v.y + t * (w.y - v.y)
    );
    return p5.Vector.dist(pt, projection);
  }

  return Glyph;
}