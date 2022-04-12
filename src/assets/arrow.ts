import p5 from "p5";

function drawArrow(p5: p5, x1: number, y1: number, x2: number, y2: number) {
  p5.push();
  p5.translate(x1, y1);
  p5.angleMode(p5.RADIANS);
  const start = p5.createVector(x1, y1);
  const end = p5.createVector(x2, y2);
  const startToEnd = end.sub(start);
  const vectAngle = startToEnd.heading();
  p5.rotate(vectAngle);
  p5.line(0, 0, startToEnd.mag(), 0);
  p5.line(startToEnd.mag(), 0, startToEnd.mag() - 8, -8);
  p5.line(startToEnd.mag(), 0, startToEnd.mag() - 8, 8);
  p5.pop();
}

export default drawArrow;
