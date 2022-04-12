import p5 from "p5";
import Unit from "../units/unit";
import RGB from "../utils/RGB";

class RegularHexagon {
  private static readonly INIT_ANGLE = Math.PI / 6;
  private static readonly ROT_INCREMENT_ANGLE = Math.PI / 3;
  private static readonly BORDER_WIDTH = 3;
  private readonly radius: number;
  private readonly color: RGB;
  private borderColor: RGB | null = null;
  private readonly random: number = Math.random();
  private _unit: Unit | null = null;
  private text: string | null;

  constructor(
    radius: number,
    color: RGB,
    borderColor: RGB | null = null,
    text: string | null = null
  ) {
    this.radius = radius;
    this.color = color;
    this.borderColor = borderColor;
    this.text = text;
  }

  get unit() {
    return this._unit;
  }

  set unit(unit: Unit | null) {
    this._unit = unit;
  }

  public onClick() {}

  public draw(p5: p5, scale: number) {
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
      const borderRadius = this.radius - RegularHexagon.BORDER_WIDTH / 2;
      p5.strokeWeight(RegularHexagon.BORDER_WIDTH);
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

    if (this.text) {
      p5.rectMode(p5.CENTER);
      p5.fill(255);
      p5.stroke(0);
      p5.strokeWeight(1.5);
      p5.rect(0, 0, this.radius * 2 - 30, 30);
      p5.push();
      p5.strokeWeight(1);
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(this.text, 0, 0);
      p5.pop();
    }

    this._unit?.draw(p5);
    p5.pop();
  }
}

export default RegularHexagon;
