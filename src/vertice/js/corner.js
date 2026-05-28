/**
 * VERTICE - КЛАСС ВЕРШИНЫ (CORNER / VERTEX)
 * (p5 Instance Mode)
 * 
 * Управляет отдельными кругами-вершинами, их координатами, 
 * радиусом, отрисовкой, перетаскиванием мышью и состояниями.
 */

export function createCornerClass(p) {

  // Глобальные переменные стилей из основного приложения
  // Передаем их через замыкание или читаем напрямую из объекта app если нужно,
  // но лучше определить статические константы здесь.
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
      this.glyph = glyph; // Ссылка на родительский глиф (не сериализуется напрямую, восстанавливается при загрузке)
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
     * Проверяет, была ли нажата мышь в области маркера вершины для начала перетаскивания
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
     * Обновляет координаты центра при перетаскивании
     */
    drag(mouse) {
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
    checkHoverButton(mouse) {
      return p.dist(mouse.x, mouse.y, this.center.x, this.center.y) < corner_buttonRadians;
    }

    /**
     * Проверяет наведение мыши на саму область круга вершины
     */
    checkHover(mouse) {
      return p.dist(mouse.x, mouse.y, this.center.x, this.center.y) < this.radians;
    }

    /**
     * Изменение радиуса вершины с ограничением диапазона
     */
    setRadians(increment) {
      this.radians += increment;
      this.radians = p.constrain(this.radians, corner_radiansMin, corner_radiansMax);
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

    // --- СЕРИАЛИЗАЦИЯ (для файла JSON и HistoryManager) ---
    
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
