import { env } from '../../Config.js';

export function createInputMethods(_p5) {
  return {
  handleDrag() {
    if (this.checkAnyGuideIsPressed() == true) {
      this.editGuides();
    } else {
      if (this.mode == 'editPath') {
        if (this.checkAnyPathIsPressed() == true) {
          this.setPathPosition(this.getPressedPath());
        } else if (this.activePath != null && _p5.env.mouseOverRect(this.activePath.xMin, this.activePath.yMin, this.activePath.xMax - this.activePath.xMin, this.activePath.yMax - this.activePath.yMin)) {
          this.setPathPosition(this.activePath);
        }
      } else if (this.mode == 'editAnchor') {
        if (this.checkAnyAnchorInclHandleIsPressed() == true) {
          this.setAnchorPosition(this.getPressedAnchor());
        }
      } else if (this.mode == 'editHandle') {
        if (this.checkAnyAnchorInclHandleIsPressed() == true) {
          this.setHandlePosition(this.getPressedAnchor());
        }
      } else if (this.mode == 'drawPath') {
        if (this.checkAnyAnchorInclHandleIsPressed() == true) {
          let anchor = this.getPressedAnchor();
          if (anchor == this.activeAnchor) {
            this.setHandlePosition(anchor);
          }
        } else if (this.isHovered == true) {
          if (this.activeAnchor == null) {
            this.addPath();
          } else {
            this.addAnchor();
          }
        }
      }
    }
    this.updateActiveGlyph();
  },
  handleClick() {
    this.addBuffer = true;
    if (this.lockedButton == false) {
      if (this.contextMenu == true) {
        this.resetContextMenu();
      } else if (this.checkAnyButtonIsHovered() == true) {
        if (this.mode == 'editPath') {
          if (this.checkAnyPathIsHovered() == true) {
            this.setActivePath(this.getHoveredPath());
            this.addBuffer = false;
          }
        } else if (this.mode == 'editAnchor') {
          if (this.checkAnyPathIsHovered() == true) {
            this.setActivePath(this.getHoveredPath());
            this.addBuffer = false;
          }
          if (this.checkAnyAnchorIsHovered() == true) {
            this.setActiveAnchor(this.getHoveredAnchor());
            this.addBuffer = false;
          }
        } else if (this.mode == 'editHandle') {
          if (this.checkAnyAnchorIsHovered() == true) {
            this.setHandlesLocked(this.getHoveredAnchor());
          } else if (this.checkAnyPathIsHovered() == true) {
            this.setActivePath(this.getHoveredPath());
            this.addBuffer = false;
          }
        } else if (this.mode == 'drawPath') {
          if (this.checkAnyAnchorIsHovered() == true) {
            let anchor = this.getHoveredAnchor();
            if (anchor.first == true || anchor.last == true) {
              if (this.activeAnchor == null) {
                this.setActiveAnchor(anchor);
                this.addBuffer = false;
              } else if (anchor != this.activeAnchor && anchor.path == this.activePath) {
                this.closePath(anchor.path);
              } else if (this.activePath != anchor.path) {
                this.combinePaths(this.activePath, anchor.path, anchor);
              }
            } else if (anchor.path == this.activePath) {
              this.removeAnchor(anchor);
            }
          } else {
            if (this.activeAnchor == null) {
              this.addPath();
            } else {
              this.addAnchor();
            }
          }
        }
      } else if (this.checkAnyButtonIsHovered() == false) {
        if (this.mode == 'drawPath') {
          if (this.activeAnchor == null) {
            this.addPath();
          } else {
            this.addAnchor();
          }
        } else if (this.contextMenu == false && this.lockedButton == false) {
          this.resetActiveAnchor();
          this.resetActivePath();
          this.addBuffer = false;
          _p5.print("infinity click");
        }
      }
      this.updateActiveGlyph();
    } else {
      if (this.mode == 'editPath') {
        if (this.activePath != null) {
          this.gridifyPathPosition(this.activePath);
        }
      }
    }
    if (this.checkAnyGuideIsHovered() == true) {
      this.repositionGuides();
    }
  },
  handleDoubleClick() {
    this.addBuffer = true;
    if (this.lockedButton == false && this.checkAnyButtonIsHovered() == false) {
      this.resetActiveAnchor();
      this.resetActivePath();
      this.addBuffer = false;
    } else {
      if (this.mode == 'editPath') { /* empty */ } else if (this.mode == 'editAnchor') {
        if (this.checkAnyAnchorIsHovered() == true) {
          this.switchAnchorAngular(this.getHoveredAnchor());
        }
      } else if (this.mode == 'editHandle') { /* empty */ } else if (this.mode == 'drawPath') { /* empty */ }
    }
    this.updateActiveGlyph();
  },
  handleRightClick() {
    this.addBuffer = false;
    if (this.mode != 'drawPath') {
      if (this.checkAnyPathIsHovered() == true) {
        this.setActivePath(this.getHoveredPath());
        this.setContextMenu();
      }
    }
  },
  handleDelete() {
    this.addBuffer = true;
    if (this.mode == 'editPath') {
      if (this.activePath != null) {
        this.removePath(this.activePath);
      }
    } else if (this.mode == 'editAnchor') {
      if (this.activeAnchor != null) {
        this.removeAnchor(this.activeAnchor);
      }
    } else if (this.mode == 'editHandle') {
      if (this.activeAnchor != null) {
        this.removeAnchor(this.activeAnchor);
      }
    } else if (this.mode == 'drawPath') {
      if (this.activeAnchor != null) {
        let removedIndex = this.activeAnchor.index;
        this.removeAnchor(this.activeAnchor);
        let newIndex = removedIndex == 0 ? 0 : removedIndex - 1;
        this.setActiveAnchor(this.activePath.anchors[newIndex]);
      } else if (this.activePath != null) {
        this.removePath(this.activePath);
      }
    }
    this.updateActiveGlyph();
  },
  handleEscape() {
    this.addBuffer = false;
    if (this.mode == 'drawPath') {
      if (this.activePath.anchors.length < 2) {
        this.removePath(this.activePath);
      }
      this.resetActivePath();
    }
    this.updateActiveGlyph();
  },
  handleAlt(status) {
    this.addBuffer = false;
    if (status == 'pressed') {
      if (this.mode == 'editHandle') {
        this.setMode('editAnchor');
        _p5.env.updateInterface_glyphEditorTools_state();
      } else if (this.mode == 'editAnchor') {
        this.setMode('editHandle');
        _p5.env.updateInterface_glyphEditorTools_state();
      }
      if (this.mode == 'drawPath') {

        // HIER
      }
    } else if (status == 'released') {
      if (this.mode == 'editHandle') {
        this.setMode('editAnchor');
        _p5.env.updateInterface_glyphEditorTools_state();
      } else if (this.mode == 'editAnchor') {
        this.setMode('editHandle');
        _p5.env.updateInterface_glyphEditorTools_state();
      }
    }
  },
  handleCmdZ() {
    this.addBuffer = false;
    this.undoPathButtonsBuffer();
  }
};
}
