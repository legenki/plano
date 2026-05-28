import { env } from '../../Config.js';

export function createMathMethods(_p5) {
  return {
  relativeXPosition(absoluteXPosition) {
    return _p5.int(absoluteXPosition * (this.width * 0.9) + this.leftBounding);
  },
  relativeYPosition(absoluteYPosition) {
    return _p5.int(absoluteYPosition * (this.width * 0.9) + this.baseline);
  },
  absoluteXPosition(relativeXPosition) {
    return (relativeXPosition - this.leftBounding) / (this.width * 0.9);
  },
  absoluteYPosition(relativeYPosition) {
    return (relativeYPosition - this.baseline) / (this.width * 0.9);
  },
  xInsideBounds(xPosition) {
    return _p5.int(_p5.constrain(xPosition, this.position.x, this.position.x + this.width));
  },
  yInsideBounds(yPosition) {
    return _p5.int(_p5.constrain(yPosition, this.position.y, this.position.y + this.height));
  },
  checkInsideBounds(xPosition, yPosition) {
    if (xPosition > this.position.x && xPosition < this.position.x + this.width) {
      if (yPosition > this.position.y && yPosition < this.position.y + this.height) {
        return true;
      }
    }
    return false;
  },
  gridify(value) {
    return _p5.round(value / this.gridSize) * this.gridSize;
  },
  gridifySegments(value) {
    return _p5.round(value / (this.gridSize * this.gridsPerSegment)) * (this.gridSize * this.gridsPerSegment);
  },
  checkAnyGuideIsPressed() {
    if (this.baselineButton.isPressed == true || this.xHeightButton.isPressed == true || this.ascenderHeightButton.isPressed == true || this.descenderHeightButton.isPressed == true || this.leftBoundingButton.isPressed == true || this.rightBoundingButton.isPressed == true) {
      return true;
    } else {
      return false;
    }
  },
  getPressedGuide() {
    if (this.baselineButton.isPressed == true) {
      return this.baselineButton;
    } else if (this.xHeightButton.isPressed == true) {
      return this.xHeightButton;
    } else if (this.ascenderHeightButton.isPressed == true) {
      return this.ascenderHeightButton;
    } else if (this.descenderHeightButton.isPressed == true) {
      return this.descenderHeightButton;
    } else if (this.leftBoundingButton.isPressed == true) {
      return this.leftBoundingButton;
    } else if (this.rightBoundingButton.isPressed == true) {
      return this.rightBoundingButton;
    }
    return;
  },
  checkAnyPathIsPressed() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      if (this.pathButtons[i].isPressed == true) {
        return true;
      }
    }
    return false;
  },
  getPressedPath() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      if (this.pathButtons[i].isPressed == true) {
        return this.pathButtons[i];
      }
    }
    return;
  },
  checkAnyAnchorIsPressed() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isPressed == true) {
          return true;
        }
      }
    }
    return false;
  },
  checkAnyAnchorInclHandleIsPressed() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isPressed == true || anchor.handleToNext.isPressed == true || anchor.handleToPrev.isPressed == true) {
          return true;
        }
      }
    }
    return false;
  },
  checkAnyHandleIsPressed() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.handleToNext.isPressed == true || anchor.handleToPrev.isPressed == true) {
          return true;
        }
      }
    }
    return false;
  },
  getPressedAnchor() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isPressed == true || anchor.handleToNext.isPressed == true || anchor.handleToPrev.isPressed == true) {
          return anchor;
        }
      }
    }
    return;
  },
  checkAnyButtonIsHovered() {
    if (this.checkAnyGuideIsHovered() == true || this.checkAnyPathIsHovered() == true || this.checkAnyAnchorInclHandleIsHovered() == true) {
      return true;
    } else {
      return false;
    }
  },
  checkAnyGuideIsHovered() {
    if (this.baselineButton.isHovered == true || this.xHeightButton.isHovered == true || this.ascenderHeightButton.isHovered == true || this.descenderHeightButton.isHovered == true || this.leftBoundingButton.isHovered == true || this.rightBoundingButton.isHovered == true) {
      return true;
    } else {
      return false;
    }
  },
  checkAnyPathIsHovered() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      if (this.pathButtons[i].isHovered == true) {
        return true;
      }
    }
    return false;
  },
  getHoveredPath() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      if (this.pathButtons[i].isHovered == true) {
        return this.pathButtons[i];
      }
    }
    return;
  },
  checkAnyAnchorIsHovered() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isHovered == true) {
          return true;
        }
      }
    }
    return false;
  },
  checkAnyAnchorInclHandleIsHovered() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isHovered == true || anchor.handleToNext.isHovered == true || anchor.handleToPrev.isHovered == true) {
          return true;
        }
      }
    }
    return false;
  },
  getHoveredAnchor() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isHovered == true) {
          return anchor;
        }
      }
    }
    return;
  }
};
}
