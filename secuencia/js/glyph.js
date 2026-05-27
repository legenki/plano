
class Glyph {
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

    for (let path of this.paths) {
      for (let i = 0; i < path.anchors.length - 1; i++) {

        let anchor = path.anchors[i];
        let handleToNext = anchor.handleToNext;
        let nextAnchor = path.anchors[i + 1];
        let nextAnchor_handleToPrev = nextAnchor.handleToPrev;

        for (let t = 0; t <= 1; t += 0.01) {
          let x = bezierPoint(anchor.position.x, handleToNext.position.x, nextAnchor_handleToPrev.position.x, nextAnchor.position.x, t);
          let y = bezierPoint(anchor.position.y, handleToNext.position.y, nextAnchor_handleToPrev.position.y, nextAnchor.position.y, t);
          if (x < xMin) xMin = x;
          if (x > xMax) xMax = x;
          if (y < yMin) yMin = y;
          if (y > yMax) yMax = y;
        }
      }

      this.leftSideBearing = xMin;
      this.rightSideBearing = this.advancedWidth - xMax;
      this.width = this.advancedWidth - this.leftSideBearing - this.rightSideBearing
    }
  }

}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

class Path {
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

class Anchor {
  constructor(i, x, y, hpx, hpy, hnx, hny) {
    this.index = i;
    this.position = createVector(x, y);
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

class Handle {
  constructor(a, x, y) {
    this.position = createVector(x, y);
    this.anchor = a;
    this.positionRelativeToAnchor = createVector(this.position.x - this.anchor.position.x, this.position.y - this.anchor.position.y);
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