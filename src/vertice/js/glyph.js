/**
 * VERTICE - КЛАСС ГЛИФА (GLYPH)
 * (p5 Instance Mode)
 * 
 * Управляет набором вершин (Corner) и связями между ними.
 * Отвечает за расчет и отрисовку геометрии касательных линий,
 * соединяющих вершины, а также за операции трансформации (сдвиг, поворот, масштаб).
 */

export function createGlyphClass(p, CornerClass) {

  // Константы
  const corner_radiansMin = 12;
  const corner_radiansMax = 150;
  
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
      const pivotCenter = pivot instanceof CornerClass ? pivot.center : pivot;

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
      const pivotCenter = pivot instanceof CornerClass ? pivot.center : pivot;

      this.corners.forEach(corner => {
        const s = p.sin(angle);
        const c = p.cos(angle);
        const xnew = c * (corner.center.x - pivotCenter.x) - s * (corner.center.y - pivotCenter.y) + pivotCenter.x;
        const ynew = s * (corner.center.x - pivotCenter.x) + c * (corner.center.y - pivotCenter.y) + pivotCenter.y;
        corner.center.x = xnew;
        corner.center.y = ynew;
      });
    }

    /**
     * Отрисовка глифа: сначала круги-вершины, затем соединительные касательные
     */
    drawScene(shapeColor, strokeCapRounded, g = null) {
      this.corners.forEach(corner => {
        if (strokeCapRounded || this.connections.get(corner).length > 1 || this.corners.length === 1) {
          corner.draw(shapeColor, g);
        }
      });
      this.drawConnections(shapeColor, strokeCapRounded, g);
    }

    /**
     * Отрисовка всех связей касательными
     */
    drawConnections(shapeColor, strokeCapRounded, g = null) {
      this.connections.forEach((neighbors, c1) => {
        neighbors.forEach(c2 => {
          this.drawCommonExternalTangents(c1, c2, shapeColor, strokeCapRounded, g);
        });
      });
    }

    /**
     * Вычисление геометрических точек касательных трапеций
     */
    getCommonExternalTangentsPoints(corner1, corner2, strokeCapRounded) {
      const center1 = corner1.center;
      const radians1 = p.constrain(corner1.radians * corner1.scale, corner_radiansMin, corner_radiansMax);
      const center2 = corner2.center;
      const radians2 = p.constrain(corner2.radians * corner2.scale, corner_radiansMin, corner_radiansMax);

      const d = p.dist(center1.x, center1.y, center2.x, center2.y);
      if (d < p.abs(radians1 - radians2)) return null;

      const angle = p.acos((radians1 - radians2) / d);
      const dir = p.createVector(center2.x - center1.x, center2.y - center1.y).normalize();

      const t1p1 = strokeCapRounded || this.connections.get(corner1).length > 1
        ? p5.Vector.add(center1, p5.Vector.fromAngle(dir.heading() + angle).mult(radians1))
        : p5.Vector.add(center1, p.createVector(-dir.y, dir.x).mult(radians1));

      const t2p1 = strokeCapRounded || this.connections.get(corner1).length > 1
        ? p5.Vector.add(center1, p5.Vector.fromAngle(dir.heading() - angle).mult(radians1))
        : p5.Vector.add(center1, p.createVector(dir.y, -dir.x).mult(radians1));

      const t1p2 = strokeCapRounded || this.connections.get(corner2).length > 1
        ? p5.Vector.add(center2, p5.Vector.fromAngle(dir.heading() + angle).mult(radians2))
        : p5.Vector.add(center2, p.createVector(-dir.y, dir.x).mult(radians2));

      const t2p2 = strokeCapRounded || this.connections.get(corner2).length > 1
        ? p5.Vector.add(center2, p5.Vector.fromAngle(dir.heading() - angle).mult(radians2))
        : p5.Vector.add(center2, p.createVector(dir.y, -dir.x).mult(radians2));

      return { t1p1, t1p2, t2p2, t2p1 };
    }

    /**
     * Алгоритм отрисовки общих внешних касательных между двумя окружностями
     */
    drawCommonExternalTangents(corner1, corner2, shapeColor, strokeCapRounded, g = null) {
      const pts = this.getCommonExternalTangentsPoints(corner1, corner2, strokeCapRounded);
      if (!pts) return;

      if (g) {
        g.fill(shapeColor);
        g.noStroke();
        g.beginShape();
        g.vertex(pts.t1p1.x, pts.t1p1.y);
        g.vertex(pts.t1p2.x, pts.t1p2.y);
        g.vertex(pts.t2p2.x, pts.t2p2.y);
        g.vertex(pts.t2p1.x, pts.t2p1.y);
        g.endShape(p.CLOSE);
      } else {
        p.fill(shapeColor);
        p.noStroke();
        p.beginShape();
        p.vertex(pts.t1p1.x, pts.t1p1.y);
        p.vertex(pts.t1p2.x, pts.t1p2.y);
        p.vertex(pts.t2p2.x, pts.t2p2.y);
        p.vertex(pts.t2p1.x, pts.t2p1.y);
        p.endShape(p.CLOSE);
      }
    }

    /**
     * Добавляет все контуры глифа в путь 2D контекста Canvas
     */
    addSceneToPath(ctx, strokeCapRounded) {
      this.corners.forEach(corner => {
        if (strokeCapRounded || this.connections.get(corner).length > 1 || this.corners.length === 1) {
          const scaledRadians = p.constrain(corner.radians * corner.scale, corner_radiansMin, corner_radiansMax);
          ctx.moveTo(corner.center.x + scaledRadians, corner.center.y);
          ctx.arc(corner.center.x, corner.center.y, scaledRadians, 0, Math.PI * 2);
        }
      });

      this.connections.forEach((neighbors, c1) => {
        neighbors.forEach(c2 => {
          const pts = this.getCommonExternalTangentsPoints(c1, c2, strokeCapRounded);
          if (pts) {
            let cross = (pts.t1p2.x - pts.t1p1.x) * (pts.t2p2.y - pts.t1p2.y) - (pts.t1p2.y - pts.t1p1.y) * (pts.t2p2.x - pts.t1p2.x);
            if (cross < 0) {
              ctx.moveTo(pts.t1p1.x, pts.t1p1.y);
              ctx.lineTo(pts.t2p1.x, pts.t2p1.y);
              ctx.lineTo(pts.t2p2.x, pts.t2p2.y);
              ctx.lineTo(pts.t1p2.x, pts.t1p2.y);
            } else {
              ctx.moveTo(pts.t1p1.x, pts.t1p1.y);
              ctx.lineTo(pts.t1p2.x, pts.t1p2.y);
              ctx.lineTo(pts.t2p2.x, pts.t2p2.y);
              ctx.lineTo(pts.t2p1.x, pts.t2p1.y);
            }
            ctx.closePath();
          }
        });
      });
    }

    /**
     * Отрисовка глифа единым контуром (без внутренних стыков)
     */
    drawSceneMerged(ctx, shapeColor, strokeCapRounded) {
      const colStr = shapeColor.toString();
      ctx.fillStyle = colStr;
      ctx.beginPath();
      this.addSceneToPath(ctx, strokeCapRounded);
      ctx.fill();
    }

    drawActiveButton(shapeColor, backgroundColor, activeMode, mouse) {
      this.corners.forEach(corner => corner.drawButton(shapeColor, backgroundColor, activeMode, mouse));
    }

    setActive(state) {
      this.active = state;
    }

    // --- СЕРИАЛИЗАЦИЯ ---
    
    serialize() {
      // Сохраняем вершины с их индексами, чтобы восстановить связи
      const cornersData = this.corners.map(c => c.serialize());
      const connectionsData = [];
      
      this.connections.forEach((neighbors, corner) => {
        const c1Index = this.corners.indexOf(corner);
        neighbors.forEach(neighbor => {
          const c2Index = this.corners.indexOf(neighbor);
          // Сохраняем каждую связь один раз (c1 < c2)
          if (c1Index < c2Index) {
            connectionsData.push([c1Index, c2Index]);
          }
        });
      });

      return {
        corners: cornersData,
        connections: connectionsData,
        active: this.active
      };
    }

    static deserialize(data) {
      const g = new Glyph();
      g.active = data.active || false;
      
      data.corners.forEach(cData => {
        const c = CornerClass.deserialize(cData, g);
        g.addCornerInstance(c);
      });

      data.connections.forEach(pair => {
        const c1 = g.corners[pair[0]];
        const c2 = g.corners[pair[1]];
        if (c1 && c2) {
          g.connectCorners(c1, c2);
        }
      });

      return g;
    }
  }

  return Glyph;
}
