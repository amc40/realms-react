import p5 from "p5";
import CircularButton from "../assets/circular-button";
import NextTurn from "../assets/next-turn";
import City from "../cities/city";
import ProductionItems from "../cities/production";
import { Empires } from "../empires/empire";
import GameMap from "../grid/game-map";
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
import { randomElement, randomInt } from "../utils/random";
import AIPlayer from "../players/ai-player";
import RandomAIPlayer from "../players/random-ai-player";
import Settler from "../units/civil/settler";

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
  private maps: GameMap[] = [];
  currentMap: GameMap | null = null;
  private nextTurnIndicator = new NextTurn(() => this.handleNextTurn());

  private openCityModal: (city: City) => void;
  private transferResources: TransferResources;
  private setHoverHexTile: (hoverHexTile: HexTile | null) => void;

  private mapGenerator: MapGenerator | null = null;

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

  private selectedUnit: Unit | null = null;
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
    transferResources: TransferResources,
    setHoverHexTile: (hoverHexTile: HexTile | null) => void
  ) {
    super(() => {}, canvasElement);
    this.rerender = rerender;
    this.nPlayers = nPlayers;
    this.openCityModal = openCityModal;
    this.transferResources = transferResources;
    this.setHoverHexTile = setHoverHexTile;
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
    this.allPlayers = [new Player(this.empires!.empires[0])];
    for (let i = 1; i < this.nPlayers; i++) {
      this.allPlayers.push(new RandomAIPlayer(this.empires!.empires[i]));
    }
    this.humanPlayer = this.allPlayers[0];
    this.currentPlayer = this.humanPlayer;
    this.mapGenerator = new MapGenerator(
      this.openCityModal,
      this.selectMapAndCentreOn.bind(this),
      this.resources!,
      () => this.selectedUnit,
      (newSelectedUnit: Unit | null) => {
        this.selectedUnit = newSelectedUnit;
      }
    );
    const { mainRealm, otherRealms } = this.mapGenerator.generateMaps(
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
      this
    );
    this.unitActions = new UnitActions(this);
  }

  handleUnitMove() {
    if (this.isUnitMoveSelected()) {
      this.selectedUnit?.stopSelectingMovement();
    } else {
      this.clearAllUnitActionSelections();
      this.selectedUnit?.toggleSelectingMovement();
    }
  }

  constructTileImprovement(tileImprovementType: TileImprovementType) {
    this.selectedUnit!.currentTile?.addTileImprovement(
      this,
      tileImprovementType
    );
  }

  clearAllUnitActionSelections() {
    this.selectedUnit?.stopSelectingMovement();
    this.getCurrentSelectedMillitaryUnit()?.stopSelectingAttackTarget();
    this.getCurrentSelectedTransportUnit()?.stopSelectingTransportTarget();
  }

  handleUnitSleep() {
    this.selectedUnit?.setSleeping();
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
    if (
      this.selectedUnit != null &&
      this.selectedUnit instanceof MillitaryUnit
    ) {
      return this.selectedUnit;
    }
    return null;
  }

  getCurrentSelectedTransportUnit() {
    if (this.selectedUnit instanceof Caravan) {
      return this.selectedUnit;
    }
    return null;
  }

  getCitiesBelongingToPlayer(player: Player) {
    return this.maps!.flatMap((map) =>
      map.getCityTilesBelongingToPlayer(player)
    );
  }

  handleUnitAttack() {
    if (this.isAttackSelected()) {
      this.getCurrentSelectedMillitaryUnit()?.toggleSelectingAttackTarget();
    } else {
      this.clearAllUnitActionSelections();
      this.getCurrentSelectedMillitaryUnit()?.toggleSelectingAttackTarget();
    }
  }

  getCityTilesRequiringProductionChoice(): CityTile[] {
    return this.maps.flatMap((map) =>
      map.getCityTilesRequiringProductionChoice(this.currentPlayer!)
    );
  }

  getCityTileRequiringProductionChoice(): CityTile | null {
    const cityTilesRequiringProductionChoice =
      this.getCityTilesRequiringProductionChoice();
    if (cityTilesRequiringProductionChoice.length > 0) {
      return cityTilesRequiringProductionChoice[0];
    }
    return null;
  }

  handleNextTurn() {
    const unitsRequiringOrders = this.getUnitsRequiringActions();
    if (unitsRequiringOrders.length > 0) {
      const unitRequiringOrders = unitsRequiringOrders[0];
      const unitMap = unitRequiringOrders.currentTile?.getMap();
      if (unitMap != null) {
        if (this.currentMap !== unitMap) {
          this.currentMap = unitMap;
        }
        this.currentMap!.centreOnAndSelectUnit(this, unitRequiringOrders);
      }

      return;
    }
    const cityRequiringProductionChoice =
      this.getCityTileRequiringProductionChoice();
    if (cityRequiringProductionChoice != null) {
      const cityMap = cityRequiringProductionChoice.getMap();
      if (cityMap != null) {
        if (this.currentMap !== cityMap) {
          this.currentMap = cityMap;
        }
        this.currentMap!.centreOn(this, cityRequiringProductionChoice);
        this.openCityModal(cityRequiringProductionChoice.getCity()!);
      }
      return;
    }

    this.currentMap?.handleNextTurn(this.currentPlayer!);
    this.currentPlayer = this.getNextPlayer();
    // end of a round of turns
    if (this.currentPlayer === this.allPlayers[0]) {
      this.currentMap?.handleEndRound();
    }
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
    const hexTile = this.currentMap?.handleMouseMove(
      this.mouseX,
      this.mouseY,
      this.isHumanPlayersTurn()
    );
    this.setHoverHexTile(hexTile ?? null);
  }

  mouseClicked(event: MouseEvent): void {
    if (event.button === MouseButton.LEFT) {
      console.log("click in sketch");
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
    return this.selectedUnit?.havingMovementSelected();
  }

  isAttackSelected() {
    return this.getCurrentSelectedMillitaryUnit()?.isSelectingAttackTarget();
  }

  isTransportSelected() {
    return this.getCurrentSelectedTransportUnit()?.havingTransportTargetSelected();
  }

  isSleepSelected() {
    return this.selectedUnit?.isSleeping();
  }

  isSiegeSelected() {
    return this.getCurrentSelectedMillitaryUnit()?.isSelectingSeigeTarget();
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
      case "siege":
        return this.isSiegeSelected();
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

  getCurrentSelectedSettler(): Settler | null {
    if (this.selectedUnit instanceof Settler) {
      return this.selectedUnit;
    }
    return null;
  }

  handleUnitSettleCity() {
    const currentSelectedSettler = this.getCurrentSelectedSettler();
    if (currentSelectedSettler != null) {
      const unitTile = currentSelectedSettler.currentTile;
      const map = unitTile?.getMap();
      if (map != null && unitTile != null) {
        const unitTileRow = unitTile?.getRow();
        const unitTileCol = unitTile?.getCol();
        const owner = currentSelectedSettler.owner;
        map.addCityTile(
          this.mapGenerator!.getCityTile(unitTileRow, unitTileCol, owner, map)
        );
        currentSelectedSettler.onSettleCity();
      }
    }
  }

  handleUnitSeige() {}

  onUnitKilled(unit: Unit) {
    unit.currentTile?.removeUnit(unit);
    unit.currentTile = null;
    if (this.selectedUnit === unit) {
      this.selectedUnit = null;
    }
    this.rerender();
  }

  handleUnitAction(unitActionType: UnitActionType) {
    console.log("handling unit action", unitActionType);
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
      case "construct-lumber-mill":
        this.constructTileImprovement("lumber-mill");
        break;
      case "transfer-resources":
        this.handleUnitTransferResources();
        break;
      case "settle-city":
        this.handleUnitSettleCity();
        break;
      case "siege":
        this.handleUnitSeige();
        break;
      default:
        throw new Error("Unknown unit action type", unitActionType);
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

  getRandomMap() {
    return randomElement(this.maps);
  }

  getRandomTile() {
    const randomMap = this.getRandomMap();
    if (!randomMap) return null;
    const row = randomInt(0, randomMap.nRows);
    const col = randomInt(0, randomMap.nCols);
    return randomMap.getTile(row, col);
  }

  selectMapAndCentreOn(mapToSelect: GameMap, centreOn: HexTile): void {
    this.currentMap = mapToSelect;
    this.currentMap!.centreOn(this, centreOn);
    this.rerender();
  }

  allUnitActionsExhausted() {
    if (this.currentPlayer == null) return true;
    return this.maps.every((m) =>
      m.allUnitActionsExhausted(this.currentPlayer!)
    );
  }

  citiesAllHaveProduction() {
    if (this.currentPlayer == null) return true;
    return this.maps.every((m) =>
      m.citiesAllHaveProduction(this.currentPlayer!)
    );
  }

  getUnitsRequiringActions() {
    return this.maps.flatMap((m) =>
      m.getUnitsThatRequireOrders(this.currentPlayer!)
    );
  }

  handleAI() {
    if (this.currentPlayer instanceof AIPlayer) {
      let unitsRequiringActions = this.getUnitsRequiringActions();
      while (unitsRequiringActions.length > 0) {
        for (let unitRequiringOrders of unitsRequiringActions) {
          this.currentPlayer.chooseUnitAction(this, unitRequiringOrders);
        }
        unitsRequiringActions = this.getUnitsRequiringActions();
      }

      const citesRequiringProductionChoice =
        this.getCityTilesRequiringProductionChoice();
      for (let cityTile of citesRequiringProductionChoice) {
        const city = cityTile.getCity()!;
        const production = this.currentPlayer.chooseCityProduction(
          this,
          this.productionItems!.getItems(),
          city
        );
        city.setCurrentProduction(production);
      }
      this.handleNextTurn();
    }
  }

  draw(): void {
    if (
      this.selectedUnit !== this.prevSelectedUnit ||
      (this.selectedUnit?.currentTile ?? null) !== this.prevSelectedUnitTile ||
      this.isHumanPlayersTurn() !== this.prevIsHumanPlayersTurn
    ) {
      if (
        this.selectedUnit != null &&
        this.selectedUnit.owner === this.humanPlayer &&
        this.isHumanPlayersTurn()
      ) {
        const unitActionTypes =
          this.selectedUnit.getCurrentPossibleUnitActionTypes();
        this.unitActionButtons = this.unitActions!.getUnitActionButtons(
          unitActionTypes,
          this
        );
      } else {
        this.unitActionButtons = [];
      }
    }
    this.prevSelectedUnit = this.selectedUnit;
    this.prevSelectedUnitTile = this.selectedUnit?.currentTile ?? null;
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
    if (this.currentPlayer != null) {
      this.nextTurnIndicator.draw(
        this,
        this.allUnitActionsExhausted()
          ? this.citiesAllHaveProduction()
            ? "Next Turn"
            : "Choose\nProduction"
          : "Needs\nOrders"
      );
    }
    this.handleAI();
  }
}

export default RealmsSketch;
