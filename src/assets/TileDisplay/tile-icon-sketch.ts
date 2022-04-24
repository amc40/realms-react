import p5 from "p5";
import HexTile from "../../grid/hex-tile";
import RGB from "../../utils/RGB";

class TileIconSketch extends p5 {
  readonly iconEnclosingCircleDiameter: number;
  readonly hexScale: number;
  readonly backgroundColor: RGB;
  hexTile: HexTile | null = null;
  readonly strokeWeightVal = 3;

  constructor(
    canvasElement: HTMLElement,
    hexScale: number,
    backgroundColor: RGB
  ) {
    super(() => {}, canvasElement);

    this.hexScale = hexScale;
    this.backgroundColor = backgroundColor;
    this.iconEnclosingCircleDiameter = this.width - this.strokeWeightVal * 2;
  }

  setup() {
    const parentElement = document.getElementById("tile-display-icon-div")!;
    const width = parentElement.offsetWidth;
    const height = parentElement.offsetHeight;
    const widthHeight = Math.min(width, height);
    this.createCanvas(widthHeight, widthHeight);
  }

  draw(): void {
    this.background(
      this.backgroundColor.r,
      this.backgroundColor.g,
      this.backgroundColor.b
    );
    this.stroke(0, 0, 0);
    this.strokeWeight(this.strokeWeightVal);
    this.ellipseMode(this.CENTER);
    this.fill(200, 200, 200);
    this.ellipse(
      this.width / 2,
      this.height / 2,
      this.iconEnclosingCircleDiameter,
      this.iconEnclosingCircleDiameter
    );
    if (this.hexTile) {
      this.translate(this.width / 2, this.height / 2);
      this.scale(this.hexScale);
      this.hexTile.draw(this);
      this.hexTile.drawUnitsAndText(this);
    }
  }
}

export default TileIconSketch;
