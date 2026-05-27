/**
 * VERTICE - КЛАСС ВЕРШИНЫ (CORNER / VERTEX)
 * 
 * Управляет отдельными кругами-вершинами, их координатами, 
 * радиусом, отрисовкой, перетаскиванием мышью и состояниями.
 */

class Corner {
  constructor(center, radians, glyph) {
    // Координаты центра вершины
    this.center = createVector(center.x, center.y);
    // Радиус вершины
    this.radians = radians;
    // Текущий масштаб
    this.scale = 1;
    // Флаг перетаскивания вершины
    this.dragging = false;
    // Флаг активности (выделения) вершины
    this.active = false;
    // Смещение мыши при начале перетаскивания
    this.offsetX = 0;
    this.offsetY = 0;
    // Ссылка на родительский глиф
    this.glyph = glyph;
  }

  /**
   * Создает копию вершины для буфера истории (Undo/Redo)
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
   * Отрисовка круга вершины на холсте (или в SVG при экспорте)
   */
  draw(g) {
    const scaledRadians = constrain(this.radians * this.scale, corner_radiansMin, corner_radiansMax);
    const target = g || (exportActive && exportSVGActive ? svgCanvas : null);

    if (target) {
      target.fill(shapeColor);
      target.noStroke();
      target.ellipse(this.center.x, this.center.y, scaledRadians * 2, scaledRadians * 2);
    } else {
      fill(shapeColor);
      noStroke();
      ellipse(this.center.x, this.center.y, scaledRadians * 2, scaledRadians * 2);
    }
  }

  /**
   * Отрисовка маркера активности вершины при редактировании
   */
  drawButton() {
    if (this.active || this.checkHover() || activeMode === "glyph" || activeMode === "scene") {
      if ((activeMode === "corner" && this.active) ||
          ((activeMode === "glyph" || activeMode === "scene") && this.checkHover())) {
        fill(backgroundColor);
        stroke(shapeColor);
      } else {
        fill(shapeColor);
        stroke(backgroundColor);
      }
      strokeWeight(corner_buttonStrokeWeight);
      ellipse(this.center.x, this.center.y, corner_buttonRadians * 2, corner_buttonRadians * 2);
    }
  }

  /**
   * Проверяет, была ли нажата мышь в области маркера вершины для начала перетаскивания
   */
  checkDrag() {
    if (dist(mouse.x, mouse.y, this.center.x, this.center.y) < corner_buttonRadians) {
      this.dragging = true;
      this.offsetX = mouse.x - this.center.x;
      this.offsetY = mouse.y - this.center.y;
      return true;
    }
    return false;
  }

  /**
   * Обновляет координаты центра при перетаскивании
   */
  drag() {
    if (this.dragging) {
      this.center.x = mouse.x - this.offsetX;
      this.center.y = mouse.y - this.offsetY;
    }
  }

  /**
   * Завершает процесс перетаскивания
   */
  endDrag() {
    this.dragging = false;
  }

  /**
   * Проверяет наведение мыши на маркер вершины
   */
  checkHoverButton() {
    return dist(mouse.x, mouse.y, this.center.x, this.center.y) < corner_buttonRadians;
  }

  /**
   * Проверяет наведение мыши на саму область круга вершины
   */
  checkHover() {
    return dist(mouse.x, mouse.y, this.center.x, this.center.y) < this.radians;
  }

  /**
   * Изменение радиуса вершины с ограничением диапазона
   */
  setRadians(increment) {
    this.radians += increment;
    this.radians = constrain(this.radians, corner_radiansMin, corner_radiansMax);
  }

  /**
   * Установка масштаба вершины
   */
  setScale(increment) {
    this.scale += increment;
  }

  /**
   * Установка флага активности выделения вершины
   */
  setActive(state) {
    this.active = state;
  }
}
