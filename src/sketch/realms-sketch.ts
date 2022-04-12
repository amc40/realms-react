import p5 from "p5";
import HexagonalGrid from "../grid/hex-grid";
import MapGenerator from "../grid/map-generation";
import { MouseButton } from "../utils/mouse-events";

class RealmsSketch extends p5 {
  private hexagonalGrid: HexagonalGrid | null = null;

  constructor(canvasElement: HTMLElement) {
    super(() => {}, canvasElement);
  }

  setup(): void {
    this.createCanvas(this.windowWidth, this.windowHeight);
    const mapGenerator = new MapGenerator();
    this.hexagonalGrid = mapGenerator.generateMap(
      this.width,
      this.height,
      0,
      0,
      20,
      20
    );
  }

  windowResized(event?: object): void {
    this.resizeCanvas(this.windowWidth, this.windowHeight);
  }

  mouseMoved(event?: MouseEvent): void {
    this.hexagonalGrid!.handleMouseMove(this.mouseX, this.mouseY);
  }

  mouseClicked(event: MouseEvent): void {
    if (event.button === MouseButton.LEFT) {
      this.hexagonalGrid!.handleClick(this.mouseX, this.mouseY);
    }
  }

  keyPressed(event: KeyboardEvent): void {}

  mouseWheel(e: WheelEvent): boolean {
    return this.hexagonalGrid!.handleMouseWheel(e, this.mouseX, this.mouseY);
  }

  draw(): void {
    if (this.keyIsDown("A".charCodeAt(0))) {
      this.hexagonalGrid!.panX(3);
    } else if (this.keyIsDown("D".charCodeAt(0))) {
      this.hexagonalGrid!.panX(-3);
    }
    if (this.keyIsDown("W".charCodeAt(0))) {
      this.hexagonalGrid!.panY(3);
    } else if (this.keyIsDown("S".charCodeAt(0))) {
      this.hexagonalGrid!.panY(-3);
    }
    this.background(0);
    this.hexagonalGrid!.draw(this);
  }
}

export default RealmsSketch;
