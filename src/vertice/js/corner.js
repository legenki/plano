/**
 * VERTICE - CORNER CLASS (CORNER / VERTEX)
 * (p5 Instance Mode)
 *
 * Manages individual circle-vertices: coordinates, radius,
 * rendering, mouse drag, and selection state.
 */

export function createCornerClass(p) {

  // Style constants — defined locally rather than read from the app object.
  const corner_radiansMin = 12;
  const corner_radiansMax = 150;
  const corner_buttonRadians = 8;
  const corner_buttonStrokeWeight = 1.5;

  class Corner {
    constructor(center, radians, glyph) {
      this.center = p.createVector(center.x, center.y);
      this.radians = radians;
      this.scale = 1;
      this.dragging = false;
      this.active = false;
      this.offsetX = 0;
      this.offsetY = 0;
      this.glyph = glyph; // Reference to the parent glyph (not serialized directly — restored on load)
    }

    /**
     * Creates a copy of this corner for the undo/redo history buffer.
     */
    copy(glyph) {
      const cornerCopy = new Corner(this.center, this.radians, glyph);
      cornerCopy.scale = this.scale;
      cornerCopy.active = this.active;
      cornerCopy.offsetX = this.offsetX;
      cornerCopy.offsetY = this.offsetY;
      return cornerCopy;
    }



    /**
     * Checks whether the mouse was pressed inside the corner handle to begin dragging.
     */
    checkDrag(mouse) {
      if (p.dist(mouse.x, mouse.y, this.center.x, this.center.y) < corner_buttonRadians) {
        this.dragging = true;
        this.offsetX = mouse.x - this.center.x;
        this.offsetY = mouse.y - this.center.y;
        return true;
      }
      return false;
    }

    /**
     * Updates the center coordinates while dragging.
     */
    drag(mouse) {
      if (this.dragging) {
        this.center.x = mouse.x - this.offsetX;
        this.center.y = mouse.y - this.offsetY;
      }
    }

    /**
     * Ends the drag operation.
     */
    endDrag() {
      this.dragging = false;
    }

    /**
     * Checks whether the mouse is hovering over the corner handle button.
     */
    checkHoverButton(mouse) {
      return p.dist(mouse.x, mouse.y, this.center.x, this.center.y) < corner_buttonRadians;
    }

    /**
     * Checks whether the mouse is hovering over the corner circle area.
     */
    checkHover(mouse) {
      return p.dist(mouse.x, mouse.y, this.center.x, this.center.y) < this.radians;
    }

    /**
     * Adjusts the corner radius by an increment, clamped to the allowed range.
     */
    setRadians(increment) {
      this.radians += increment;
      this.radians = p.constrain(this.radians, corner_radiansMin, corner_radiansMax);
    }

    /**
     * Sets the corner scale.
     */
    setScale(increment) {
      this.scale += increment;
    }

    /**
     * Sets the active/selected state of the corner.
     */
    setActive(state) {
      this.active = state;
    }

    // --- SERIALIZATION (for JSON file and HistoryManager) ---
    
    serialize() {
      return {
        x: this.center.x,
        y: this.center.y,
        r: this.radians,
        s: this.scale,
        active: this.active
      };
    }

    static deserialize(data, glyphInstance) {
      const c = new Corner({x: data.x, y: data.y}, data.r, glyphInstance);
      c.scale = data.s !== undefined ? data.s : 1;
      c.active = data.active || false;
      return c;
    }
  }

  return Corner;
}
