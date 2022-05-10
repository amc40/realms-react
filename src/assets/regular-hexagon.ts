import p5 from "p5";
import Unit from "../units/unit";
import RGB from "../utils/RGB";

class RegularHexagon {
  private static readonly INIT_ANGLE = Math.PI / 6;
  private static readonly ROT_INCREMENT_ANGLE = Math.PI / 3;
  protected readonly radius: number;
  private readonly color: RGB;
  private borderWidth: number;

  constructor(radius: number, color: RGB, borderWidth: number = 1) {
    this.radius = radius;
    this.color = color;
    this.borderWidth = borderWidth;
  }

  getBorderColor(): RGB | null {
    return null;
  }

  getInnerBorderColor(): RGB | null {
    return null;
  }

  getMinWidthHeight() {
    // 2 * height of sides (2 * 1/2 sqrt(2/3))
    return this.radius * Math.sqrt(2 / 3);
  }

  private static drawHexagon(p5: p5, radius: number) {
    // Start adapted code from
    // Patel, A. (2022, April 19). Hexagonal grids. Red Blob Games. Retrieved May 8, 2022,
    // from https://www.redblobgames.com/grids/hexagons/#conversions
    p5.beginShape();
    for (
      let angle = RegularHexagon.INIT_ANGLE;
      angle < 2 * Math.PI;
      angle += RegularHexagon.ROT_INCREMENT_ANGLE
    ) {
      p5.vertex(radius * Math.cos(angle), radius * Math.sin(angle));
    }
    // end adapted code
    p5.endShape(p5.CLOSE);
  }

  public draw(p5: p5) {
    p5.push();
    p5.noStroke();
    p5.fill(this.color.r, this.color.g, this.color.b);
    RegularHexagon.drawHexagon(p5, this.radius);
    p5.fill(0, 0);
    const borderColor = this.getBorderColor();
    if (borderColor) {
      const borderRadius = this.radius - this.borderWidth / 2;
      p5.strokeWeight(this.borderWidth);
      p5.stroke(borderColor.r, borderColor.g, borderColor.b);
      RegularHexagon.drawHexagon(p5, borderRadius);
    }
    const innerBorderColor = this.getInnerBorderColor();
    if (innerBorderColor) {
      const innerBorderRadius = this.radius - (this.borderWidth * 3) / 2;
      p5.strokeWeight(this.borderWidth);
      p5.stroke(innerBorderColor.r, innerBorderColor.g, innerBorderColor.b);
      RegularHexagon.drawHexagon(p5, innerBorderRadius);
    }
    p5.pop();
  }
}

export default RegularHexagon;
