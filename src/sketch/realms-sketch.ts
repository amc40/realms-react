import p5 from "p5";
import NextTurn from "../assets/next-turn";
import City from "../cities/city";
import HexagonalGrid from "../grid/hex-grid";
import MapGenerator from "../grid/map-generation";
import Unit from "../units/unit";
import { MouseButton } from "../utils/mouse-events";

class RealmsSketch extends p5 {
  private hexagonalGrid: HexagonalGrid | null = null;
  private nextTurnIndicator = new NextTurn(() => this.handleNextTurn());
  private openCityModal: (city: City) => void;
  selectedUnit: Unit | null = null;

  constructor(canvasElement: HTMLElement, openCityModal: (city: City) => void) {
    super(() => {}, canvasElement);
    this.openCityModal = openCityModal;
  }

  setup(): void {
    this.createCanvas(this.windowWidth, this.windowHeight);
    const mapGenerator = new MapGenerator(this.openCityModal);
    this.hexagonalGrid = mapGenerator.generateMap(
      this.width,
      this.height,
      0,
      0,
      20,
      20,
      this
    );
  }

  handleNextTurn() {
    this.hexagonalGrid?.handleNextTurn();
  }

  windowResized(event?: object): void {
    this.resizeCanvas(this.windowWidth, this.windowHeight);
  }

  mouseMoved(event?: MouseEvent): void {
    this.hexagonalGrid?.handleMouseMove(this.mouseX, this.mouseY);
  }

  mouseClicked(event: MouseEvent): void {
    if (event.button === MouseButton.LEFT) {
      this.nextTurnIndicator.handleClick(this, this.mouseX, this.mouseY) ||
        this.hexagonalGrid?.handleClick(this.mouseX, this.mouseY);
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
    this.nextTurnIndicator.draw(this);
  }
}

export default RealmsSketch;
