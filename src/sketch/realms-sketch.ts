import p5 from "p5";
import CircularButton from "../assets/circular-button";
import NextTurn from "../assets/next-turn";
import City from "../cities/city";
import Map from "../grid/hex-grid";
import MapGenerator from "../grid/map-generation";
import MillitaryUnit from "../units/millitary/millitary-unit";
import Unit from "../units/unit";
import { MouseButton } from "../utils/mouse-events";
import { getSpacing } from "../utils/spacing";

type UnitActionButtons = {
  attackButton: CircularButton;
  moveButton: CircularButton;
  sleepButton: CircularButton;
};

class RealmsSketch extends p5 {
  private hexagonalGrid: Map | null = null;
  private nextTurnIndicator = new NextTurn(() => this.handleNextTurn());
  private openCityModal: (city: City) => void;
  private unitActionButtions: UnitActionButtons | null = null;
  private moveIcon: p5.Image | null = null;
  private attackIcon: p5.Image | null = null;
  private sleepIcon: p5.Image | null = null;

  constructor(canvasElement: HTMLElement, openCityModal: (city: City) => void) {
    super(() => {}, canvasElement);
    this.openCityModal = openCityModal;
  }

  preload(): void {
    this.moveIcon = this.loadImage("/assets/button-icons/move.png");
    this.attackIcon = this.loadImage("/assets/button-icons/battle.png");
    this.sleepIcon = this.loadImage("/assets/button-icons/sleep.png");
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
    const unitActionButtonX = getSpacing(this.width / 2, 100, 3);
    const unitActionButtonRadius = 30;
    const unitActionButtonY = this.height - unitActionButtonRadius - 50;

    this.unitActionButtions = {
      attackButton: new CircularButton(
        () => this.handleUnitAttack(),
        unitActionButtonX[0],
        unitActionButtonY,
        unitActionButtonRadius,
        this,
        this.attackIcon!
      ),
      moveButton: new CircularButton(
        () => this.handleUnitMove(),
        unitActionButtonX[1],
        unitActionButtonY,
        unitActionButtonRadius,
        this,
        this.moveIcon!
      ),
      sleepButton: new CircularButton(
        () => this.handleUnitSleep(),
        unitActionButtonX[2],
        unitActionButtonY,
        unitActionButtonRadius,
        this,
        this.sleepIcon!
      ),
    };
    Object.values(this.unitActionButtions!).forEach((button) =>
      button.setVisible()
    );
  }

  handleUnitMove() {
    if (this.isUnitMoveSelected()) {
      this.hexagonalGrid!.getCurrentSelectedUnit()!.stopSelectingMovement();
    } else {
      this.clearAllUnitActionSelections();
      this.hexagonalGrid!.getCurrentSelectedUnit()!.toggleSelectingMovement();
    }
  }

  clearAllUnitActionSelections() {
    this.hexagonalGrid!.getCurrentSelectedUnit()?.stopSelectingMovement();
    this.getCurrentSelectedMillitaryUnit()?.stopSelectingAttackTarget();
  }

  handleUnitSleep() {}

  getCurrentSelectedMillitaryUnit(): MillitaryUnit | null {
    const currentSelectedUnit = this.hexagonalGrid!.getCurrentSelectedUnit();
    if (
      currentSelectedUnit != null &&
      currentSelectedUnit instanceof MillitaryUnit
    ) {
      return currentSelectedUnit;
    }
    return null;
  }

  handleUnitAttack() {
    if (this.isAttackSelected()) {
      this.getCurrentSelectedMillitaryUnit()?.toggleSelectingAttackTarget();
    } else {
      this.clearAllUnitActionSelections();
      this.getCurrentSelectedMillitaryUnit()?.toggleSelectingAttackTarget();
    }
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
      Object.values(this.unitActionButtions!).some((button) =>
        button.handleClick(this, this.mouseX, this.mouseY)
      ) ||
        this.nextTurnIndicator.handleClick(this, this.mouseX, this.mouseY) ||
        this.hexagonalGrid?.handleClick(this, this.mouseX, this.mouseY);
    }
  }

  keyPressed(event: KeyboardEvent): void {}

  mouseWheel(e: WheelEvent): boolean {
    return this.hexagonalGrid!.handleMouseWheel(e, this.mouseX, this.mouseY);
  }

  isUnitMoveSelected() {
    return this.hexagonalGrid!.getCurrentSelectedUnit()?.havingMovementSelected();
  }

  isAttackSelected() {
    return this.getCurrentSelectedMillitaryUnit()?.isSelectingAttackTarget();
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
    if (this.hexagonalGrid!.getCurrentSelectedUnit() != null) {
      this.unitActionButtions?.attackButton.draw(this, this.isAttackSelected());
      this.unitActionButtions?.moveButton.draw(this, this.isUnitMoveSelected());
      this.unitActionButtions?.sleepButton.draw(this);
    }
    this.nextTurnIndicator.draw(this);
  }
}

export default RealmsSketch;
