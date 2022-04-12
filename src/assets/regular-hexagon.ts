import p5 from "p5";
import RGB from "../utils/RGB";

class RegularHexagon {
  private static readonly INIT_ANGLE = Math.PI / 6;
  private static readonly ROT_INCREMENT_ANGLE = Math.PI / 3;
  private static readonly BORDER_WIDTH = 3;
  private readonly radius: number;
  private readonly color: RGB;
  private readonly random: number = Math.random();

  constructor(radius: number, color: RGB) {
    this.radius = radius;
    this.color = color;
  }

  getBorderColor(): RGB | null {
    // return null;

    if (this.random < 0.33) {
      return {
        r: 255,
        g: 0,
        b: 0,
      };
    } else if (this.random < 0.66) {
      return {
        r: 0,
        g: 0,
        b: 255,
      };
    } else {
      return {
        r: 0,
        g: 255,
        b: 0,
      };
    }
  }

  public draw(p5: p5, scale: number) {
    p5.push();
    const borderColor = this.getBorderColor();
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
    p5.beginShape();
    const borderRadius = this.radius - RegularHexagon.BORDER_WIDTH / 2;
    if (borderColor) {
      p5.strokeWeight(RegularHexagon.BORDER_WIDTH);
      p5.stroke(borderColor.r, borderColor.g, borderColor.b);
    } else {
      p5.stroke(0);
    }
    for (
      let angle = RegularHexagon.INIT_ANGLE;
      angle < 2 * Math.PI;
      angle += RegularHexagon.ROT_INCREMENT_ANGLE
    ) {
      p5.vertex(borderRadius * Math.cos(angle), borderRadius * Math.sin(angle));
    }
    p5.endShape(p5.CLOSE);
    p5.pop();
  }
}

export default RegularHexagon;
