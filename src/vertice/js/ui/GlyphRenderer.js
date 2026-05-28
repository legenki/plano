/**
 * VERTICE - РЕНДЕРЕР ГЛИФОВ (VIEW)
 * 
 * Отвечает за отрисовку глифов, вершин и их соединений на холсте p5.js.
 * Полностью отделен от логики данных (Model).
 */

export class GlyphRenderer {
  constructor(p) {
    this.p = p;
    this.corner_radiansMin = 12;
    this.corner_radiansMax = 150;
    this.corner_buttonRadians = 8;
    this.corner_buttonStrokeWeight = 1.5;
  }

  /**
   * Отрисовка круга вершины на холсте (или в SVG при экспорте)
   */
  drawCorner(corner, shapeColor, g = null) {
    const scaledRadians = this.p.constrain(corner.radians * corner.scale, this.corner_radiansMin, this.corner_radiansMax);
    
    if (g) {
      g.fill(shapeColor);
      g.noStroke();
      g.ellipse(corner.center.x, corner.center.y, scaledRadians * 2, scaledRadians * 2);
    } else {
      this.p.fill(shapeColor);
      this.p.noStroke();
      this.p.ellipse(corner.center.x, corner.center.y, scaledRadians * 2, scaledRadians * 2);
    }
  }

  /**
   * Отрисовка маркера активности вершины при редактировании
   */
  drawCornerButton(corner, shapeColor, backgroundColor, activeMode, mouse) {
    if (corner.active || corner.checkHover(mouse) || activeMode === "glyph" || activeMode === "scene") {
      if ((activeMode === "corner" && corner.active) ||
          ((activeMode === "glyph" || activeMode === "scene") && corner.checkHover(mouse))) {
        this.p.fill(backgroundColor);
        this.p.stroke(shapeColor);
      } else {
        this.p.fill(shapeColor);
        this.p.stroke(backgroundColor);
      }
      this.p.strokeWeight(this.corner_buttonStrokeWeight);
      this.p.ellipse(corner.center.x, corner.center.y, this.corner_buttonRadians * 2, this.corner_buttonRadians * 2);
    }
  }

  /**
   * Отрисовка маркеров для всех вершин глифа
   */
  drawActiveButton(glyph, shapeColor, backgroundColor, activeMode, mouse) {
    glyph.corners.forEach(corner => this.drawCornerButton(corner, shapeColor, backgroundColor, activeMode, mouse));
  }

  /**
   * Вычисление геометрических точек касательных трапеций
   */
  getCommonExternalTangentsPoints(corner1, corner2, glyph, strokeCapRounded) {
    const center1 = corner1.center;
    const radians1 = this.p.constrain(corner1.radians * corner1.scale, this.corner_radiansMin, this.corner_radiansMax);
    const center2 = corner2.center;
    const radians2 = this.p.constrain(corner2.radians * corner2.scale, this.corner_radiansMin, this.corner_radiansMax);

    const d = this.p.dist(center1.x, center1.y, center2.x, center2.y);
    if (d < this.p.abs(radians1 - radians2)) return null;

    const angle = this.p.acos((radians1 - radians2) / d);
    const dir = this.p.createVector(center2.x - center1.x, center2.y - center1.y).normalize();

    // Use p5.Vector directly since it's global or available via this.p.constructor.Vector (in instance mode)
    const p5Vector = this.p.constructor.Vector || window.p5.Vector;

    const t1p1 = strokeCapRounded || glyph.connections.get(corner1).length > 1
      ? p5Vector.add(center1, p5Vector.fromAngle(dir.heading() + angle).mult(radians1))
      : p5Vector.add(center1, this.p.createVector(-dir.y, dir.x).mult(radians1));

    const t2p1 = strokeCapRounded || glyph.connections.get(corner1).length > 1
      ? p5Vector.add(center1, p5Vector.fromAngle(dir.heading() - angle).mult(radians1))
      : p5Vector.add(center1, this.p.createVector(dir.y, -dir.x).mult(radians1));

    const t1p2 = strokeCapRounded || glyph.connections.get(corner2).length > 1
      ? p5Vector.add(center2, p5Vector.fromAngle(dir.heading() + angle).mult(radians2))
      : p5Vector.add(center2, this.p.createVector(-dir.y, dir.x).mult(radians2));

    const t2p2 = strokeCapRounded || glyph.connections.get(corner2).length > 1
      ? p5Vector.add(center2, p5Vector.fromAngle(dir.heading() - angle).mult(radians2))
      : p5Vector.add(center2, this.p.createVector(dir.y, -dir.x).mult(radians2));

    return { t1p1, t1p2, t2p2, t2p1 };
  }

  /**
   * Алгоритм отрисовки общих внешних касательных между двумя окружностями
   */
  drawCommonExternalTangents(corner1, corner2, glyph, shapeColor, strokeCapRounded, g = null) {
    const pts = this.getCommonExternalTangentsPoints(corner1, corner2, glyph, strokeCapRounded);
    if (!pts) return;

    if (g) {
      g.fill(shapeColor);
      g.noStroke();
      g.beginShape();
      g.vertex(pts.t1p1.x, pts.t1p1.y);
      g.vertex(pts.t1p2.x, pts.t1p2.y);
      g.vertex(pts.t2p2.x, pts.t2p2.y);
      g.vertex(pts.t2p1.x, pts.t2p1.y);
      g.endShape(this.p.CLOSE);
    } else {
      this.p.fill(shapeColor);
      this.p.noStroke();
      this.p.beginShape();
      this.p.vertex(pts.t1p1.x, pts.t1p1.y);
      this.p.vertex(pts.t1p2.x, pts.t1p2.y);
      this.p.vertex(pts.t2p2.x, pts.t2p2.y);
      this.p.vertex(pts.t2p1.x, pts.t2p1.y);
      this.p.endShape(this.p.CLOSE);
    }
  }

  /**
   * Отрисовка всех связей касательными
   */
  drawConnections(glyph, shapeColor, strokeCapRounded, g = null) {
    glyph.connections.forEach((neighbors, c1) => {
      neighbors.forEach(c2 => {
        this.drawCommonExternalTangents(c1, c2, glyph, shapeColor, strokeCapRounded, g);
      });
    });
  }

  /**
   * Отрисовка глифа: сначала круги-вершины, затем соединительные касательные
   */
  drawScene(glyph, shapeColor, strokeCapRounded, g = null) {
    glyph.corners.forEach(corner => {
      if (strokeCapRounded || glyph.connections.get(corner).length > 1 || glyph.corners.length === 1) {
        this.drawCorner(corner, shapeColor, g);
      }
    });
    this.drawConnections(glyph, shapeColor, strokeCapRounded, g);
  }

  /**
   * Добавляет все контуры глифа в путь 2D контекста Canvas
   */
  addSceneToPath(glyph, ctx, strokeCapRounded) {
    glyph.corners.forEach(corner => {
      if (strokeCapRounded || glyph.connections.get(corner).length > 1 || glyph.corners.length === 1) {
        const scaledRadians = this.p.constrain(corner.radians * corner.scale, this.corner_radiansMin, this.corner_radiansMax);
        ctx.moveTo(corner.center.x + scaledRadians, corner.center.y);
        ctx.arc(corner.center.x, corner.center.y, scaledRadians, 0, Math.PI * 2);
      }
    });

    glyph.connections.forEach((neighbors, c1) => {
      neighbors.forEach(c2 => {
        const pts = this.getCommonExternalTangentsPoints(c1, c2, glyph, strokeCapRounded);
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
  drawSceneMerged(glyph, ctx, shapeColor, strokeCapRounded) {
    const colStr = shapeColor.toString();
    ctx.fillStyle = colStr;
    ctx.beginPath();
    this.addSceneToPath(glyph, ctx, strokeCapRounded);
    ctx.fill();
  }
}
