import p5 from "p5";
import { TileImprovementType } from ".";
import RegularHexagon from "../../assets/regular-hexagon";
import RGB from "../../utils/RGB";

class TileImprovementIconHex extends RegularHexagon {
  constructor() {
    super(30, { r: 255, g: 255, b: 255 });
  }

  getBorderColor(): RGB | null {
    return {
      r: 0,
      g: 0,
      b: 0,
    };
  }
}

class TileImprovementIcon {
  readonly type: TileImprovementType;
  readonly enclosingHex: RegularHexagon;
  readonly image: p5.Image;
  // TODO: add image

  constructor(type: TileImprovementType, image: p5.Image) {
    this.type = type;
    this.enclosingHex = new TileImprovementIconHex();
    this.image = image;
  }

  draw(p5: p5) {
    this.enclosingHex.draw(p5);
    p5.imageMode(p5.CENTER);
    const widthHeight = this.enclosingHex.getMinWidthHeight() * 1.4;
    p5.image(this.image, 0, 0, widthHeight, widthHeight);
  }
}

export default TileImprovementIcon;
