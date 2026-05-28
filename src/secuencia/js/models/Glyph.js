/**
 * SECUENCIA — Glyph Model
 * Contains Glyph, Path, Anchor, Handle classes.
 * Requires _p5 (p5.js instance) passed as factory parameter.
 */

let _p5;
export function initGlyphModels(p) { _p5 = p; }

export class Glyph {
  constructor(n, p, aW) {
    this.name = n;
    this.charCode = n.charCodeAt(0);
    this.paths = p;
    this.advancedWidth = aW;
    this.width;
    this.leftSideBearing;
    this.rightSideBearing;
    this.updateSideBearings();
  }

  toJSON() {
    return {
      name: this.name,
      paths: this.paths.map(path => path.toJSON()),
      advancedWidth: this.advancedWidth,
      width: this.width,
      leftSideBearing: this.leftSideBearing,
      rightSideBearing: this.rightSideBearing,
    };
  }

  updateWidth(aW) {
    this.advancedWidth = aW;
    this.updateSideBearings();
  }

  updatePaths(updatedPaths) {
    this.reset();
    this.paths = updatedPaths;
    this.updateSideBearings();
  }

  reset() {
    this.paths = [];
  }

  updateSideBearings() {

    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

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

    for (let path of this.paths) {
      for (let i = 0; i < path.anchors.length - 1; i++) {
        let anchor = path.anchors[i];
        let handleToNext = anchor.handleToNext;
        let nextAnchor = path.anchors[i + 1];
        let nextAnchor_handleToPrev = nextAnchor.handleToPrev;

        let xExtremes = getBezierExtremes(
          anchor.position.x, handleToNext.position.x, 
          nextAnchor_handleToPrev.position.x, nextAnchor.position.x
        );
        let yExtremes = getBezierExtremes(
          anchor.position.y, handleToNext.position.y, 
          nextAnchor_handleToPrev.position.y, nextAnchor.position.y
        );

        if (xExtremes.min < xMin) xMin = xExtremes.min;
        if (xExtremes.max > xMax) xMax = xExtremes.max;
        if (yExtremes.min < yMin) yMin = yExtremes.min;
        if (yExtremes.max > yMax) yMax = yExtremes.max;
      }

      if (path.anchors.length === 1) {
          let pos = path.anchors[0].position;
          if (pos.x < xMin) xMin = pos.x;
          if (pos.x > xMax) xMax = pos.x;
      }

      if (xMin !== Infinity) {
        this.leftSideBearing = xMin;
        this.rightSideBearing = this.advancedWidth - xMax;
        this.width = this.advancedWidth - this.leftSideBearing - this.rightSideBearing;
      }
    }
  }

}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

export class Path {
  constructor(i, a, cTP, cTN) {
    this.index = i;
    this.anchors = a;
    this.connectionToPrev = cTP;
    this.connectionToNext = cTN;
  }


  toJSON() {
    return {
      index: this.index,
      anchors: this.anchors.map(anchor => anchor.toJSON()),
      connectionToPrev: this.connectionToPrev,
      connectionToNext: this.connectionToNext,
    };
  }

  updateAnchors(updatedAnchors) {
    this.reset();
    this.anchors = updatedAnchors;
  }

  reset() {
    this.anchors = [];
  }
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

export class Anchor {
  constructor(i, x, y, hpx, hpy, hnx, hny) {
    this.index = i;
    this.position = _p5.createVector(x, y);
    this.handleToPrev = new Handle(this, hpx, hpy);
    this.handleToNext = new Handle(this, hnx, hny);
  }
  toJSON() {
    return {
      index: this.index,
      position: { x: this.position.x, y: this.position.y },
      handleToPrev: this.handleToPrev.toJSON(),
      handleToNext: this.handleToNext.toJSON(),
    };
  }
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

export class Handle {
  constructor(a, x, y) {
    this.position = _p5.createVector(x, y);
    this.anchor = a;
    this.positionRelativeToAnchor = _p5.createVector(this.position.x - this.anchor.position.x, this.position.y - this.anchor.position.y);
  }

  toJSON() {
    return {
      position: { x: this.position.x, y: this.position.y },
      positionRelativeToAnchor: {
        x: this.positionRelativeToAnchor.x,
        y: this.positionRelativeToAnchor.y,
      },
    };
  }
}

// --- FILE: secuencia/js/script.js ---

  
