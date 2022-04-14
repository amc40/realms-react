import p5 from "p5";
import Unit from "../units/unit";
import RGB from "../utils/RGB";

class RegularHexagon {
  private static readonly INIT_ANGLE = Math.PI / 6;
  private static readonly ROT_INCREMENT_ANGLE = Math.PI / 3;
  protected readonly radius: number;
  private readonly color: RGB;
  protected borderColor: RGB | null = null;
  private borderWidth: number;

  constructor(
    radius: number,
    color: RGB,
    borderColor: RGB | null = null,
    borderWidth: number = 1
  ) {
    this.radius = radius;
    this.color = color;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  getMinWidthHeight() {
    // 2 * height of sides (2 * 1/2 sqrt(2/3))
    return this.radius * Math.sqrt(2 / 3);
  }

  public onClick() {}

  public draw(p5: p5) {
    p5.push();
    const borderColor = this.borderColor;
    p5.noStroke();
    p5.fill(this.color.r, this.color.g, this.color.b);
    p5.beginShape();
    for (
      let angle = RegularHexagon.INIT_ANGLE;
      angle < 2 * Math.PI;
      angle += RegularHexagon.ROT_INCREMENT_ANGLE
    ) {
      p5.vertex(this.radius * Math.cos(angle), this.radius * Math.sin(angle));
    }
    p5.endShape(p5.CLOSE);
    p5.fill(0, 0);

    if (borderColor) {
      const borderRadius = this.radius - this.borderWidth / 2;
      p5.strokeWeight(this.borderWidth);
      p5.stroke(borderColor.r, borderColor.g, borderColor.b);
      p5.beginShape();
      for (
        let angle = RegularHexagon.INIT_ANGLE;
        angle < 2 * Math.PI;
        angle += RegularHexagon.ROT_INCREMENT_ANGLE
      ) {
        p5.vertex(
          borderRadius * Math.cos(angle),
          borderRadius * Math.sin(angle)
        );
      }
      p5.endShape(p5.CLOSE);
    }
    p5.pop();
  }
}

export default RegularHexagon;
