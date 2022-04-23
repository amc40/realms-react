import p5 from "p5";
import CircularButton from "../assets/circular-button";
import NextTurn from "../assets/next-turn";
import City from "../cities/city";
import ProductionItems from "../cities/production";
import { Empires } from "../empires/empire";
import Map from "../grid/map";
import HexTile from "../grid/hex-tile";
import MapGenerator from "../grid/map-generation";
import { TileImprovementType } from "../grid/tile-improvements";
import Player from "../players/player";
import Resources, { ResourceQuantity } from "../resources";
import Units from "../units";
import Caravan from "../units/civil/caravan";
import MillitaryUnit from "../units/millitary/millitary-unit";
import Unit from "../units/unit";
import UnitActions, { UnitActionType } from "../units/unit-actions";
import { MouseButton } from "../utils/mouse-events";
import { getSpacing } from "../utils/spacing";
import { ResourceTransferSrc } from "../resources/resource-transfer";

type TransferResources = (
  resourceSrc1: ResourceTransferSrc,
  resourceSrc2: ResourceTransferSrc,
  onCompleted: (
    src1Quantity: ResourceQuantity,
    src2Quantity: ResourceQuantity
  ) => void
) => void;

class RealmsSketch extends p5 {
  private hexagonalGrid: Map | null = null;
  private nextTurnIndicator = new NextTurn(() => this.handleNextTurn());
  private openCityModal: (city: City) => void;
  private transferResources: TransferResources;
  private unitActionButtons: {
    type: UnitActionType;
    button: CircularButton;
  }[] = [];
  private empires: Empires | null = null;
  private units: Units | null = null;
  private unitActions: UnitActions | null = null;

  private rerender: () => void;

  allPlayers: Player[] = [];
  humanPlayer: Player | null = null;
  _currentPlayer: Player | null = null;
  resources: Resources | null = null;
  productionItems: ProductionItems | null = null;

  private prevSelectedUnit: Unit | null = null;
  private prevSelectedUnitTile: HexTile | null = null;
  private prevIsHumanPlayersTurn = false;

  private static scrollSpeed = 8;
  private readonly nPlayers;

  constructor(
    canvasElement: HTMLElement,
    nPlayers = 4,
    openCityModal: (city: City) => void,
    rerender: () => void,
    transferResources: TransferResources
  ) {
    super(() => {}, canvasElement);
    this.rerender = rerender;
    this.nPlayers = nPlayers;
    this.openCityModal = openCityModal;
    this.transferResources = transferResources;
  }

  preload(): void {
    this.empires = new Empires(this);
    this.resources = new Resources(this);
    this.units = new Units(this);
  }

  get currentPlayer() {
    return this._currentPlayer;
  }

  set currentPlayer(player: Player | null) {
    this._currentPlayer = player;
    // rerender to show the updated player indicator
    this.rerender();
  }

  setup(): void {
    this.createCanvas(this.windowWidth, this.windowHeight);
    // add players
    this.allPlayers = this.empires!.empires.slice(0, this.nPlayers).map(
      (empire) => new Player(empire)
    );
    this.humanPlayer = this.allPlayers[0];
    this.currentPlayer = this.humanPlayer;
    const mapGenerator = new MapGenerator(this.openCityModal);
    this.hexagonalGrid = mapGenerator.generateMap(
      this.width,
      this.height,
      0,
      0,
      20,
      20,
      this.allPlayers,
      this.units!,
      this
    );

    Object.values(this.unitActionButtons!).forEach(({ button }) =>
      button.setVisible()
    );
    this.productionItems = new ProductionItems(
      this.units!,
      this.humanPlayer,
      this.hexagonalGrid
    );
    this.unitActions = new UnitActions(this);
  }

  handleUnitMove() {
    if (this.isUnitMoveSelected()) {
      this.hexagonalGrid!.getCurrentSelectedUnit()!.stopSelectingMovement();
    } else {
      this.clearAllUnitActionSelections();
      this.hexagonalGrid!.getCurrentSelectedUnit()!.toggleSelectingMovement();
    }
  }

  constructTileImprovement(tileImprovementType: TileImprovementType) {
    this.hexagonalGrid!.getCurrentSelectedUnit()?.currentTile?.addTileImprovement(
      this,
      tileImprovementType
    );
  }

  clearAllUnitActionSelections() {
    this.hexagonalGrid!.getCurrentSelectedUnit()?.stopSelectingMovement();
    this.getCurrentSelectedMillitaryUnit()?.stopSelectingAttackTarget();
    this.getCurrentSelectedTransportUnit()?.stopSelectingTransportTarget();
  }

  handleUnitSleep() {
    this.hexagonalGrid!.getCurrentSelectedUnit()?.setSleeping();
  }

  handleUnitTransport() {
    if (this.isTransportSelected()) {
      this.getCurrentSelectedTransportUnit()?.stopSelectingTransportTarget();
    } else {
      this.clearAllUnitActionSelections();
      this.getCurrentSelectedTransportUnit()?.startSelectingTransportTarget();
    }
  }

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

  getCurrentSelectedTransportUnit() {
    const currentSelectedUnit = this.hexagonalGrid!.getCurrentSelectedUnit();
    if (currentSelectedUnit instanceof Caravan) {
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
    const unitRequiringOrders = this.hexagonalGrid!.getUnitThatRequiresOrders(
      this.currentPlayer!
    );
    if (unitRequiringOrders != null) {
      this.hexagonalGrid!.centreOnAndSelectUnit(this, unitRequiringOrders);
      return;
    }
    const cityRequiringProductionChoice =
      this.hexagonalGrid!.getCityTileRequiringProductionChoice(
        this.currentPlayer!
      );
    if (cityRequiringProductionChoice != null) {
      this.hexagonalGrid!.centreOn(this, cityRequiringProductionChoice);
      this.openCityModal(cityRequiringProductionChoice.getCity()!);
      return;
    }

    this.hexagonalGrid?.handleNextTurn();
    this.currentPlayer = this.getNextPlayer();
  }
  getNextPlayer(): Player | null {
    if (this.currentPlayer != null) {
      const nextPlayerIdx =
        (this.allPlayers.indexOf(this.currentPlayer) + 1) %
        this.allPlayers.length;
      return this.allPlayers[nextPlayerIdx];
    }
    return null;
  }

  windowResized(event?: object): void {
    this.resizeCanvas(this.windowWidth, this.windowHeight);
  }

  isHumanPlayersTurn() {
    return this.currentPlayer === this.humanPlayer;
  }

  mouseMoved(event?: MouseEvent): void {
    this.hexagonalGrid?.handleMouseMove(
      this.mouseX,
      this.mouseY,
      this.isHumanPlayersTurn()
    );
  }

  mouseClicked(event: MouseEvent): void {
    if (event.button === MouseButton.LEFT) {
      Object.values(this.unitActionButtons!).some(({ button }) =>
        button.handleClick(this, this.mouseX, this.mouseY)
      ) ||
        this.nextTurnIndicator.handleClick(this, this.mouseX, this.mouseY) ||
        (this.currentPlayer &&
          this.hexagonalGrid?.handleClick(
            this,
            this.mouseX,
            this.mouseY,
            this.currentPlayer,
            this.isHumanPlayersTurn()
          ));
    }
  }

  mouseWheel(e: WheelEvent): boolean {
    return this.hexagonalGrid!.handleMouseWheel(e, this.mouseX, this.mouseY);
  }

  isUnitMoveSelected() {
    return this.hexagonalGrid!.getCurrentSelectedUnit()?.havingMovementSelected();
  }

  isAttackSelected() {
    return this.getCurrentSelectedMillitaryUnit()?.isSelectingAttackTarget();
  }

  isTransportSelected() {
    return this.getCurrentSelectedTransportUnit()?.havingTransportTargetSelected();
  }

  isSleepSelected() {
    return this.hexagonalGrid!.getCurrentSelectedUnit()?.isSleeping();
  }

  isUnitActionSelected(unitActionType: UnitActionType) {
    switch (unitActionType) {
      case "move":
        return this.isUnitMoveSelected();
      case "melee-attack":
        return this.isAttackSelected();
      case "transport":
        return this.isTransportSelected();
      case "sleep":
        return this.isSleepSelected();
      default:
        return false;
    }
  }

  handleUnitAction(unitActionType: UnitActionType) {
    switch (unitActionType) {
      case "move":
        this.handleUnitMove();
        break;
      case "melee-attack":
        this.handleUnitAttack();
        break;
      case "sleep":
        this.handleUnitSleep();
        break;
      case "transport":
        this.handleUnitTransport();
        break;
      case "construct-farm":
        this.constructTileImprovement("farm");
        break;
      case "construct-mine":
        this.constructTileImprovement("mine");
        break;
    }
  }

  draw(): void {
    const selectedUnit = this.hexagonalGrid!.getCurrentSelectedUnit();
    if (
      selectedUnit !== this.prevSelectedUnit ||
      selectedUnit?.currentTile !== this.prevSelectedUnitTile ||
      this.isHumanPlayersTurn() !== this.prevIsHumanPlayersTurn
    ) {
      if (
        selectedUnit != null &&
        selectedUnit.owner === this.humanPlayer &&
        this.isHumanPlayersTurn()
      ) {
        const unitActionTypes = selectedUnit.getUnitActionTypes();
        this.unitActionButtons = this.unitActions!.getUnitActionButtons(
          unitActionTypes,
          this
        );
      }
    }
    this.prevSelectedUnit = selectedUnit;
    this.prevSelectedUnitTile = selectedUnit?.currentTile ?? null;
    this.prevIsHumanPlayersTurn = this.isHumanPlayersTurn();
    if (this.keyIsDown("A".charCodeAt(0))) {
      this.hexagonalGrid!.panX(RealmsSketch.scrollSpeed);
    } else if (this.keyIsDown("D".charCodeAt(0))) {
      this.hexagonalGrid!.panX(-RealmsSketch.scrollSpeed);
    }
    if (this.keyIsDown("W".charCodeAt(0))) {
      this.hexagonalGrid!.panY(RealmsSketch.scrollSpeed);
    } else if (this.keyIsDown("S".charCodeAt(0))) {
      this.hexagonalGrid!.panY(-RealmsSketch.scrollSpeed);
    }
    this.background(0);
    this.hexagonalGrid!.draw(this);
    this.unitActionButtons.forEach(({ button, type }) =>
      button.draw(this, this.isUnitActionSelected(type))
    );
    if (this.currentPlayer != null) {
      this.nextTurnIndicator.draw(
        this,
        this.hexagonalGrid!.allUnitActionsExhausted(this.currentPlayer)
          ? this.hexagonalGrid!.citiesAllHaveProduction(this.currentPlayer)
            ? "Next Turn"
            : "Choose\nProduction"
          : "Needs\nOrders"
      );
    }
  }
}

export default RealmsSketch;
