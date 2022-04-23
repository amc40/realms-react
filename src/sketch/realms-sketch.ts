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
import CityTile from "../grid/tiles/city";

type TransferResources = (
  resourceSrc1: ResourceTransferSrc,
  resourceSrc2: ResourceTransferSrc,
  onCompleted: (
    src1Quantity: ResourceQuantity,
    src2Quantity: ResourceQuantity
  ) => void
) => void;

class RealmsSketch extends p5 {
  private static instanceCount = 0;
  private maps: Map[] = [];
  currentMap: Map | null = null;
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
  private instanceN = ++RealmsSketch.instanceCount;

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
    const mapGenerator = new MapGenerator(
      this.openCityModal,
      this.selectMapAndCentreOn.bind(this)
    );
    const { mainRealm, otherRealms } = mapGenerator.generateMaps(
      this.width,
      this.height,
      0,
      0,
      20,
      20,
      5,
      20,
      5,
      20,
      this.allPlayers,
      this.units!,
      this
    );
    this.currentMap = mainRealm;
    this.maps = [mainRealm, ...otherRealms];
    this.rerender();

    Object.values(this.unitActionButtons!).forEach(({ button }) =>
      button.setVisible()
    );
    this.productionItems = new ProductionItems(
      this.units!,
      this.humanPlayer,
      this.currentMap
    );
    this.unitActions = new UnitActions(this);
  }

  handleUnitMove() {
    if (this.isUnitMoveSelected()) {
      this.currentMap!.getCurrentSelectedUnit()!.stopSelectingMovement();
    } else {
      this.clearAllUnitActionSelections();
      this.currentMap!.getCurrentSelectedUnit()!.toggleSelectingMovement();
    }
  }

  constructTileImprovement(tileImprovementType: TileImprovementType) {
    this.currentMap!.getCurrentSelectedUnit()?.currentTile?.addTileImprovement(
      this,
      tileImprovementType
    );
  }

  clearAllUnitActionSelections() {
    this.currentMap!.getCurrentSelectedUnit()?.stopSelectingMovement();
    this.getCurrentSelectedMillitaryUnit()?.stopSelectingAttackTarget();
    this.getCurrentSelectedTransportUnit()?.stopSelectingTransportTarget();
  }

  handleUnitSleep() {
    this.currentMap!.getCurrentSelectedUnit()?.setSleeping();
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
    const currentSelectedUnit = this.currentMap!.getCurrentSelectedUnit();
    if (
      currentSelectedUnit != null &&
      currentSelectedUnit instanceof MillitaryUnit
    ) {
      return currentSelectedUnit;
    }
    return null;
  }

  getCurrentSelectedTransportUnit() {
    const currentSelectedUnit = this.currentMap!.getCurrentSelectedUnit();
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
    const unitRequiringOrders = this.currentMap!.getUnitThatRequiresOrders(
      this.currentPlayer!
    );
    if (unitRequiringOrders != null) {
      this.currentMap!.centreOnAndSelectUnit(this, unitRequiringOrders);
      return;
    }
    const cityRequiringProductionChoice =
      this.currentMap!.getCityTileRequiringProductionChoice(
        this.currentPlayer!
      );
    if (cityRequiringProductionChoice != null) {
      this.currentMap!.centreOn(this, cityRequiringProductionChoice);
      this.openCityModal(cityRequiringProductionChoice.getCity()!);
      return;
    }

    this.currentMap?.handleNextTurn();
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
    this.currentMap?.handleMouseMove(
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
          this.currentMap?.handleClick(
            this,
            this.mouseX,
            this.mouseY,
            this.currentPlayer,
            this.isHumanPlayersTurn()
          ));
    }
  }

  mouseWheel(e: WheelEvent): boolean {
    return this.currentMap!.handleMouseWheel(e, this.mouseX, this.mouseY);
  }

  isUnitMoveSelected() {
    return this.currentMap!.getCurrentSelectedUnit()?.havingMovementSelected();
  }

  isAttackSelected() {
    return this.getCurrentSelectedMillitaryUnit()?.isSelectingAttackTarget();
  }

  isTransportSelected() {
    return this.getCurrentSelectedTransportUnit()?.havingTransportTargetSelected();
  }

  isSleepSelected() {
    return this.currentMap!.getCurrentSelectedUnit()?.isSleeping();
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

  handleUnitTransferResources() {
    const currentSelectedUnit = this.getCurrentSelectedTransportUnit();
    const unitTile = currentSelectedUnit?.currentTile;
    if (currentSelectedUnit != null && unitTile instanceof CityTile) {
      const city = unitTile.getCity()!;
      this.transferResources(
        currentSelectedUnit.getTransferResourceSrc(),
        city.getResourceTransferSrc(),
        (unitQuantity: ResourceQuantity, cityQuantity: ResourceQuantity) => {
          if (unitQuantity != null) {
            currentSelectedUnit.setResources(unitQuantity);
          }

          if (cityQuantity != null) {
            city.setTransferableResources(cityQuantity);
          }
        }
      );
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
      case "transfer-resources":
        this.handleUnitTransferResources();
    }
  }

  nextRightRealm() {
    if (this.maps.length > 0 && this.currentMap != null) {
      const nextRealmIdx =
        (this.maps.findIndex((m) => m === this.currentMap) + 1) %
        this.maps.length;
      this.currentMap = this.maps[nextRealmIdx];
      this.rerender();
    }
  }

  nextLeftRealm() {
    if (this.maps.length > 0 && this.currentMap != null) {
      const currentIdx = this.maps.findIndex((m) => m === this.currentMap);
      const nextIdx = currentIdx <= 0 ? this.maps.length - 1 : currentIdx - 1;
      this.currentMap = this.maps[nextIdx];
      this.rerender();
    }
  }

  selectMapAndCentreOn(mapToSelect: Map, centreOn: HexTile): void {
    this.currentMap = mapToSelect;
    this.currentMap!.centreOn(this, centreOn);
    this.rerender();
  }

  draw(): void {
    const selectedUnit = this.currentMap!.getCurrentSelectedUnit();
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
      this.currentMap!.panX(RealmsSketch.scrollSpeed);
    } else if (this.keyIsDown("D".charCodeAt(0))) {
      this.currentMap!.panX(-RealmsSketch.scrollSpeed);
    }
    if (this.keyIsDown("W".charCodeAt(0))) {
      this.currentMap!.panY(RealmsSketch.scrollSpeed);
    } else if (this.keyIsDown("S".charCodeAt(0))) {
      this.currentMap!.panY(-RealmsSketch.scrollSpeed);
    }
    this.background(0);
    this.currentMap!.draw(this);
    this.unitActionButtons.forEach(({ button, type }) =>
      button.draw(this, this.isUnitActionSelected(type))
    );
    console.log(this, "rendering", this.currentMap);
    if (this.currentPlayer != null) {
      this.nextTurnIndicator.draw(
        this,
        this.currentMap!.allUnitActionsExhausted(this.currentPlayer)
          ? this.currentMap!.citiesAllHaveProduction(this.currentPlayer)
            ? "Next Turn"
            : "Choose\nProduction"
          : "Needs\nOrders"
      );
    }
  }
}

export default RealmsSketch;
