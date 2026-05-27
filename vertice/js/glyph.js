/**
 * VERTICE - КЛАСС ГЛИФА (GLYPH)
 * 
 * Управляет набором вершин (Corner) и связями между ними.
 * Отвечает за расчет и отрисовку геометрии касательных линий,
 * соединяющих вершины, а также за операции трансформации (сдвиг, поворот, масштаб).
 */

class Glyph {
  constructor() {
    this.corners = [];
    this.connections = new Map();
    this.active = false;
  }

  /**
   * Создает полную глубокую копию глифа для сохранения состояния истории (Undo/Redo)
   */
  copy() {
    const glyphCopy = new Glyph();
    const cornersCopy = [];

    for (const corner of this.corners) {
      cornersCopy.push(corner.copy(glyphCopy));
    }

    const connectionsCopy = new Map();
    for (const [key, value] of this.connections) {
      const cornerIndex = this.corners.indexOf(key);
      const cornerConnections = [];
      for (const corner of value) {
        const cornerConnectionIndex = this.corners.indexOf(corner);
        cornerConnections.push(cornersCopy[cornerConnectionIndex]);
      }
      connectionsCopy.set(cornersCopy[cornerIndex], cornerConnections);
    }

    glyphCopy.corners = cornersCopy;
    glyphCopy.connections = connectionsCopy;
    glyphCopy.active = this.active;

    return glyphCopy;
  }

  /**
   * Добавляет вершину в глиф и инициализирует для нее пустой список связей
   */
  addCorner(newCorner) {
    this.corners.push(newCorner);
    this.connections.set(newCorner, []);
  }

  /**
   * Добавляет уже существующий экземпляр вершины в глиф
   */
  addCornerInstance(corner) {
    this.corners.push(corner);
    this.connections.set(corner, []);
  }

  /**
   * Создает двунаправленную связь между двумя вершинами
   */
  connectCorners(c1, c2) {
    if (this.connections.has(c1)) {
      this.connections.get(c1).push(c2);
    } else {
      this.connections.set(c1, [c2]);
    }

    if (this.connections.has(c2)) {
      this.connections.get(c2).push(c1);
    } else {
      this.connections.set(c2, [c1]);
    }
  }

  /**
   * Удаляет вершину и все связанные с ней линии соединения
   */
  removeCorner(corner) {
    this.corners = this.corners.filter(c => c !== corner);
    this.connections.delete(corner);
    this.connections.forEach(list => {
      const index = list.indexOf(corner);
      if (index > -1) list.splice(index, 1);
    });
  }

  /**
   * Разрезает глиф на две части по указанной вершине (если она имеет ровно 2 связи)
   */
  spliceAtCorner(corner) {
    const newGlyph = new Glyph();
    newGlyph.corners = [...this.corners];
    newGlyph.connections = new Map(this.connections);

    const connectedCorners = this.connections.get(corner);
    if (!connectedCorners || connectedCorners.length !== 2) return null;

    this.removeCorner(corner);
    newGlyph.removeCorner(corner);

    // Удаляем разделенные части вершин из соответствующих глифов
    this.removeCorners(this.collectAllFurtherConnections(connectedCorners[1], corner));
    newGlyph.removeCorners(newGlyph.collectAllFurtherConnections(connectedCorners[0], corner));

    // Обновляем родительские ссылки вершин для новой ветви
    for (const cornerInstance of newGlyph.corners) {
      cornerInstance.glyph = newGlyph;
    }

    return newGlyph.corners.length > 0 ? newGlyph : null;
  }

  /**
   * Обход графа связей для сбора всех вершин, соединенных с данной
   */
  collectAllFurtherConnections(corner, ignoreCorner) {
    const queue = [corner];
    const visited = new Set();
    const linkedConnections = new Set();

    while (queue.length > 0) {
      const current = queue.pop();
      if (visited.has(current)) continue;
      visited.add(current);
      linkedConnections.add(current);

      if (this.connections.has(current)) {
        this.connections.get(current).forEach(neighbor => {
          if (!visited.has(neighbor) && neighbor !== ignoreCorner) {
            queue.push(neighbor);
          }
        });
      }
    }

    return linkedConnections;
  }

  /**
   * Удаляет группу вершин из глифа
   */
  removeCorners(cornersToRemove) {
    this.corners = this.corners.filter(c => !cornersToRemove.has(c));
    cornersToRemove.forEach(corner => {
      this.connections.delete(corner);
    });
    this.connections.forEach((neighbors, key) => {
      this.connections.set(key, neighbors.filter(c => !cornersToRemove.has(c)));
    });
  }

  /**
   * Проверяет, является ли вершина частью замкнутой петли
   */
  isPartOfClosedForm(corner) {
    const connectedCorners = this.connections.get(corner);
    if (!connectedCorners || connectedCorners.length !== 2) return false;

    const leftHandConnection = connectedCorners[0];
    const rightHandConnection = connectedCorners[1];

    const leftHandConnectionCorners = this.collectAllFurtherConnections(leftHandConnection, corner);
    const rightHandConnectionCorners = this.collectAllFurtherConnections(rightHandConnection, corner);

    return leftHandConnectionCorners.has(rightHandConnection) && rightHandConnectionCorners.has(leftHandConnection);
  }

  containsCorner(corner) {
    return this.corners.includes(corner);
  }

  isConnected(c1, c2) {
    return this.connections.has(c1) && this.connections.get(c1).includes(c2);
  }

  /**
   * Объединяет данный глиф с другим глифом (слияние вершин и связей)
   */
  mergeGlyph(other) {
    other.corners.forEach(corner => {
      this.addCornerInstance(corner);
      this.connections.set(corner, other.connections.get(corner));
      corner.glyph = this;
    });
  }

  /**
   * Смещение всех вершин глифа на дельту координат
   */
  translate(dx, dy) {
    this.corners.forEach(corner => {
      corner.center.x += dx;
      corner.center.y += dy;
    });
  }

  /**
   * Масштабирование глифа относительно опорной точки (pivot)
   */
  scale(scaleFactor, pivot) {
    const pivotCenter = pivot instanceof Corner ? pivot.center : pivot;

    this.corners.forEach(corner => {
      if (corner !== pivot) {
        const xnew = (corner.center.x - pivotCenter.x) * (1 + scaleFactor) + pivotCenter.x;
        const ynew = (corner.center.y - pivotCenter.y) * (1 + scaleFactor) + pivotCenter.y;
        corner.center.x = xnew;
        corner.center.y = ynew;
      }
    });
  }

  /**
   * Вращение глифа на угол (angle) вокруг опорной точки (pivot)
   */
  rotate(angle, pivot) {
    const pivotCenter = pivot instanceof Corner ? pivot.center : pivot;

    this.corners.forEach(corner => {
      const s = sin(angle);
      const c = cos(angle);
      const xnew = c * (corner.center.x - pivotCenter.x) - s * (corner.center.y - pivotCenter.y) + pivotCenter.x;
      const ynew = s * (corner.center.x - pivotCenter.x) + c * (corner.center.y - pivotCenter.y) + pivotCenter.y;
      corner.center.x = xnew;
      corner.center.y = ynew;
    });
  }

  /**
   * Отрисовка глифа: сначала круги-вершины, затем соединительные касательные
   */
  drawScene(g) {
    this.corners.forEach(corner => {
      // Рисуем вершину, если включены скругленные концы, либо вершина имеет связи, либо это одиночная вершина
      if (strokeCapRounded || this.connections.get(corner).length > 1 || this.corners.length === 1) {
        corner.draw(g);
      }
    });

    this.drawConnections(g);
  }

  /**
   * Отрисовка всех связей касательными
   */
  drawConnections(g) {
    this.connections.forEach((neighbors, c1) => {
      neighbors.forEach(c2 => {
        // Чтобы не рисовать одну связь дважды, рисуем только в одну сторону
        // (но для корректности рендеринга p5.js можно рисовать по списку соседей)
        this.drawCommonExternalTangents(c1, c2, g);
      });
    });
  }

  /**
   * Вычисление геометрических точек касательных трапеций
   */
  getCommonExternalTangentsPoints(corner1, corner2) {
    const center1 = corner1.center;
    const radians1 = constrain(corner1.radians * corner1.scale, corner_radiansMin, corner_radiansMax);
    const center2 = corner2.center;
    const radians2 = constrain(corner2.radians * corner2.scale, corner_radiansMin, corner_radiansMax);

    const d = dist(center1.x, center1.y, center2.x, center2.y);
    // Если окружности пересекаются или вложены так, что касательные невозможны
    if (d < abs(radians1 - radians2)) return null;

    // Угол наклона касательной относительно линии центров
    const angle = acos((radians1 - radians2) / d);
    const dir = createVector(center2.x - center1.x, center2.y - center1.y).normalize();

    // Расчет точек касания на первой окружности (сверху и снизу)
    const t1p1 = strokeCapRounded || this.connections.get(corner1).length > 1
      ? p5.Vector.add(center1, p5.Vector.fromAngle(dir.heading() + angle).mult(radians1))
      : p5.Vector.add(center1, createVector(-dir.y, dir.x).mult(radians1));

    const t2p1 = strokeCapRounded || this.connections.get(corner1).length > 1
      ? p5.Vector.add(center1, p5.Vector.fromAngle(dir.heading() - angle).mult(radians1))
      : p5.Vector.add(center1, createVector(dir.y, -dir.x).mult(radians1));

    // Расчет точек касания на второй окружности
    const t1p2 = strokeCapRounded || this.connections.get(corner2).length > 1
      ? p5.Vector.add(center2, p5.Vector.fromAngle(dir.heading() + angle).mult(radians2))
      : p5.Vector.add(center2, createVector(-dir.y, dir.x).mult(radians2));

    const t2p2 = strokeCapRounded || this.connections.get(corner2).length > 1
      ? p5.Vector.add(center2, p5.Vector.fromAngle(dir.heading() - angle).mult(radians2))
      : p5.Vector.add(center2, createVector(dir.y, -dir.x).mult(radians2));

    return { t1p1, t1p2, t2p2, t2p1 };
  }

  /**
   * Алгоритм отрисовки общих внешних касательных между двумя окружностями
   */
  drawCommonExternalTangents(corner1, corner2, g) {
    const pts = this.getCommonExternalTangentsPoints(corner1, corner2);
    if (!pts) return;

    // Определяем целевой контекст рендеринга
    const target = g || (exportActive && exportSVGActive ? svgCanvas : null);

    // Отрисовка четырехугольника касательной трапеции
    if (target) {
      target.fill(shapeColor);
      target.noStroke();
      target.beginShape();
      target.vertex(pts.t1p1.x, pts.t1p1.y);
      target.vertex(pts.t1p2.x, pts.t1p2.y);
      target.vertex(pts.t2p2.x, pts.t2p2.y);
      target.vertex(pts.t2p1.x, pts.t2p1.y);
      target.endShape(CLOSE);
    } else {
      fill(shapeColor);
      noStroke();
      beginShape();
      vertex(pts.t1p1.x, pts.t1p1.y);
      vertex(pts.t1p2.x, pts.t1p2.y);
      vertex(pts.t2p2.x, pts.t2p2.y);
      vertex(pts.t2p1.x, pts.t2p1.y);
      endShape(CLOSE);
    }
  }

  /**
   * Добавляет все контуры глифа (круги и трапеции) в текущий путь 2D контекста Canvas
   */
  addSceneToPath(ctx) {
    // 1. Добавляем все круги-вершины в путь
    this.corners.forEach(corner => {
      if (strokeCapRounded || this.connections.get(corner).length > 1 || this.corners.length === 1) {
        const scaledRadians = constrain(corner.radians * corner.scale, corner_radiansMin, corner_radiansMax);
        ctx.moveTo(corner.center.x + scaledRadians, corner.center.y);
        ctx.arc(corner.center.x, corner.center.y, scaledRadians, 0, Math.PI * 2);
      }
    });

    // 2. Добавляем все касательные трапеции в путь
    this.connections.forEach((neighbors, c1) => {
      neighbors.forEach(c2 => {
        const pts = this.getCommonExternalTangentsPoints(c1, c2);
        if (pts) {
          ctx.moveTo(pts.t1p1.x, pts.t1p1.y);
          ctx.lineTo(pts.t1p2.x, pts.t1p2.y);
          ctx.lineTo(pts.t2p2.x, pts.t2p2.y);
          ctx.lineTo(pts.t2p1.x, pts.t2p1.y);
          ctx.closePath();
        }
      });
    });
  }

  /**
   * Отрисовка глифа единым контуром в указанном 2D контексте Canvas (без внутренних стыков)
   */
  drawSceneMerged(ctx, colorVal) {
    const colStr = colorVal ? colorVal.toString() : shapeColor.toString();
    ctx.fillStyle = colStr;
    ctx.beginPath();
    this.addSceneToPath(ctx);
    ctx.fill();
  }

  drawActiveButton() {
    this.corners.forEach(corner => corner.drawButton());
  }

  setActive(state) {
    this.active = state;
  }
}
