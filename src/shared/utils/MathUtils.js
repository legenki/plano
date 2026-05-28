export function createMathUtils(_p5) {
  const p5 = window.p5;

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function mouseOverEllipse(x, y, diameter) {
  return _p5.dist(x, y, _p5.mouseX, _p5.mouseY) < diameter / 2;
}

  function mouseOverRect(x, y, width, height) {
  return _p5.mouseX >= x && _p5.mouseX <= x + width && _p5.mouseY >= y && _p5.mouseY <= y + height;
}

  function mouseOverBezier(p1, p2, p3, p4, tolerance) {
  // Check points along the Bézier _p5.curve
  for (let t = 0; t <= 1; t += 0.01) {
    let x = _p5.bezierPoint(p1.x, p2.x, p3.x, p4.x, t);
    let y = _p5.bezierPoint(p1.y, p2.y, p3.y, p4.y, t);

    // If _p5.cursor is within the tolerance range of a _p5.point, return true
    if (mouseOverEllipse(x, y, tolerance)) {
      return true;
    }
  }
  return false;
}

  function calcDirection(position, targetPosition) {
  let direction = p5.Vector.sub(position, targetPosition);
  direction.normalize();
  return direction;
}

  function calcAngle(prevPosition, position, nextPosition) {
  // Check if the distance to the previous or next _p5.point is zero (Return zero angle if distance is zero)
  if (p5.Vector.dist(position, prevPosition) == 0 || p5.Vector.dist(position, nextPosition) == 0) {
    return 0;
  }

  // Calculate normalized vectors to previous and next points
  let v1 = p5.Vector.sub(position, prevPosition);
  let v2 = p5.Vector.sub(position, nextPosition);
  v1.normalize();
  v2.normalize();
  let dotProduct = v1.dot(v2);
  let angle = _p5.round(_p5.degrees(_p5.acos(dotProduct)));
  if (angle == 180) {
    angle = 0;
  }
  return angle;
}

  function calcCenterDirection(prevPosition, position, nextPosition, angle) {
  let centerDirection;

  // if (this.angleCenterDirection.x == 0 && this.angleCenterDirection.y == 0) {
  if (angle == 0) {
    let v = p5.Vector.sub(nextPosition, prevPosition);
    v.normalize();
    centerDirection = _p5.createVector(-v.y, v.x);
  } else {
    // Calculate normalized vectors to previous and next points
    let directionToPrev = p5.Vector.sub(position, prevPosition);
    let directionToNext = p5.Vector.sub(position, nextPosition);
    directionToPrev.normalize();
    directionToNext.normalize();

    // Calculate the bisector of the angle
    centerDirection = p5.Vector.add(directionToPrev, directionToNext).normalize();
  }
  return centerDirection;
}

  function calcReflectionPoint(position, center) {
  return _p5.createVector(center.x + (center.x - position.x), center.y + (center.y - position.y));
}


  return {
    mouseOverEllipse,
    mouseOverRect,
    mouseOverBezier,
    calcDirection,
    calcAngle,
    calcCenterDirection,
    calcReflectionPoint,
  };
}
