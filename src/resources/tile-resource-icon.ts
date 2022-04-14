import p5 from "p5";

class TileResourceIcon {
  readonly type: TileResourceIcon;
  // TODO: add image

  constructor(type: TileResourceIcon) {
    this.type = type;
  }

  draw(p5: p5) {
    p5.color(255);
    p5.ellipse(0, 0, 10, 10);
  }
}
