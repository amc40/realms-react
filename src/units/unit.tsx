import p5 from "p5";
import { ProductionItem } from "../cities/production";
import GameMap from "../grid/game-map";
import HexTile from "../grid/hex-tile";
import Player from "../players/player";
import ShortestPath, { Node } from "../utils/shortest-path";
import { CivilUnitActionType } from "./civil/civil-unit";
import { UnitActionType } from "./unit-actions";

enum State {
  WAITING_FOR_ORDERS,
  FOLLOWING_ORDERS,
  SLEEPING,
}

export type AugmentedTile = {
  tile: HexTile;
  nMoves?: number;
};

const minUnitMovementPoints = 1;

abstract class Unit {
  public static WIDTH = 35;
  public static HEIGHT = Unit.WIDTH;

  protected selected: boolean = false;
  private _currentTile: HexTile | null = null;
  // TODO: maybe add a temp target so can cancel ordering movement
  private _movementTarget: HexTile | null = null;
  readonly hexTileShortestPath = new ShortestPath<HexTile>(
    (nodeA: Node<HexTile>, nodeB: Node<HexTile>): number => {
      const { gamePoint: hexA } = nodeA;
      const { gamePoint: hexB } = nodeB;
      const nodeAMap = hexA.getMap()!;
      const nodeBMap = hexB.getMap()!;
      // if in the same map apply simple distance heuristic within the same map
      if (nodeAMap === nodeBMap) {
        return GameMap.distBetweenHexTiles(hexA, hexB) * minUnitMovementPoints;
      }

      const portalDistancesA = nodeAMap.getPortalsTo(hexA, nodeBMap);
      let minTotalDistance = Infinity;
      // if not reachable then set as infinite distance so will be checked last
      for (let portalDistanceA of portalDistancesA) {
        if (portalDistanceA != null) {
          const portalTileA = portalDistanceA.portalTile;
          const portal = portalTileA.portal;
          const { tile: portalTileB } =
            portal.getOtherEndMapAndTile(portalTileA);
          const distanceFromPortalB = GameMap.distBetweenHexTiles(
            portalTileB,
            hexB
          );
          const totalDistance = portalDistanceA.distance + distanceFromPortalB;
          minTotalDistance = Math.min(minTotalDistance, totalDistance);
        }
      }
      return minTotalDistance * minUnitMovementPoints;
    }
  );
  private _shortestPathToTarget: HexTile[] | null = null;
  private state: State = State.WAITING_FOR_ORDERS;
  readonly movementPoints;
  protected remainingMovementPoints: number;
  private selectingMovement = false;
  owner: Player;
  readonly _onKilled: (unit: Unit) => void;

  constructor(
    p5: p5,
    movementPoints: number,
    owner: Player,
    onKilled: (unit: Unit) => void
  ) {
    this.movementPoints = movementPoints;
    this.remainingMovementPoints = movementPoints;
    this.owner = owner;
    this._onKilled = onKilled;
  }

  toggleSelected() {
    this.selected = !this.selected;
    return this.selected;
  }

  select() {
    this.selected = true;
  }

  unselect() {
    this.selected = false;
  }

  onKilled() {
    this._onKilled(this);
  }

  set movementTarget(movementTarget: HexTile | null) {
    if (movementTarget !== this._movementTarget) {
      this._movementTarget = movementTarget;
      if (this.currentTile != null && this._movementTarget != null) {
        const shortestPathResult = this.hexTileShortestPath.getShortestPath(
          this.currentTile.getNode(),
          this._movementTarget.getNode()
        );
        this._shortestPathToTarget =
          shortestPathResult != null ? shortestPathResult.path : null;
      } else if (this._movementTarget == null) {
        this._shortestPathToTarget = null;
      }
    }
  }

  get movementTarget() {
    return this._movementTarget;
  }

  set currentTile(hexTile: HexTile | null) {
    this._currentTile?.removeUnit(this);
    this._currentTile = hexTile;
    this._currentTile?.addUnit(this);
  }

  get currentTile() {
    return this._currentTile;
  }

  havingMovementSelected() {
    return this.selectingMovement;
  }

  private checkIfReachedTarget() {
    if (this.currentTile === this.movementTarget) {
      this.state = State.WAITING_FOR_ORDERS;
    }
  }

  toggleSelectingMovement() {
    this.selectingMovement = !this.selectingMovement;
  }

  stopSelectingMovement() {
    this.selectingMovement = false;
  }

  requiresOrders() {
    return this.state === State.WAITING_FOR_ORDERS && this.movementPoints > 0;
  }

  setSleeping() {
    this.movementTarget = null;
    this.state = State.SLEEPING;
  }

  isSleeping() {
    return this.state === State.SLEEPING;
  }

  /**
   * Get the tiles which are reachable using this turn's remaining movement points
   */
  getReachableTiles() {
    const currentTile = this.currentTile;
    if (currentTile == null) {
      return [];
    }
    let reachable: HexTile[] = [currentTile];
    let toConsider: {
      prevTile: HexTile;
      tile: HexTile;
      costSoFar: number;
    }[] = currentTile.getNeighbours().map((tile) => ({
      prevTile: currentTile,
      tile,
      costSoFar: 0,
    }));
    const visitedSet = new Set<HexTile>();
    while (toConsider.length > 1) {
      const { prevTile, tile, costSoFar } = toConsider.shift()!;
      const additionalMovementCost = prevTile.movementCostTo(tile);
      if (
        visitedSet.has(tile) ||
        additionalMovementCost == null ||
        costSoFar + additionalMovementCost > this.remainingMovementPoints
      ) {
        continue;
      }
      visitedSet.add(tile);
      reachable.push(tile);
      const totalCost = costSoFar + additionalMovementCost;
      for (let neighbour of tile.getNeighbours()) {
        toConsider.push({
          prevTile: tile,
          tile: neighbour,
          costSoFar: totalCost,
        });
      }
    }
    return reachable;
  }

  protected moveAlongShortestPath() {
    if (
      this.currentTile != null &&
      this.shortestPathToTarget != null &&
      this.shortestPathToTarget.length > 1
    ) {
      let nextTile: HexTile | null = this.shortestPathToTarget[1];
      while (
        nextTile != null &&
        this.remainingMovementPoints >=
          this.currentTile.movementCostTo(nextTile)!
      ) {
        this.remainingMovementPoints -=
          this.currentTile.movementCostTo(nextTile)!;
        this.currentTile = nextTile;
        this.shortestPathToTarget.shift();
        nextTile =
          this.shortestPathToTarget.length > 1
            ? this.shortestPathToTarget[1]
            : null;
      }
      this.checkIfReachedTarget();
    }
  }

  handleNextTurn() {
    if (this.state === State.FOLLOWING_ORDERS) {
      if (this.currentTile !== this.movementTarget) {
        this.moveAlongShortestPath();
      }
    }
    if (this.state === State.FOLLOWING_ORDERS) {
      this.remainingMovementPoints += this.movementPoints;
    } else {
      this.remainingMovementPoints = this.movementPoints;
    }
  }

  selectCurrentMovementTarget() {
    // already have the current target set, just move along that path and set state to
    // FOLLOWING_ORDERS, or WAITING_FOR_ORDERS if reached target
    if (this.shortestPathToTarget != null) {
      this.state = State.FOLLOWING_ORDERS;
      this.moveAlongShortestPath();
    } else if (this.remainingMovementPoints > 0) {
      this.state = State.WAITING_FOR_ORDERS;
    } else {
      // TODO: ensure that at the end of the turn we update the state to WAITING_FOR_ORDERS
      this.state = State.FOLLOWING_ORDERS;
    }
    return this.currentTile;
  }

  get shortestPathToTarget() {
    return this._shortestPathToTarget;
  }

  getMoveAugmentedShortestPathToTarget() {
    if (
      this.shortestPathToTarget != null &&
      this.shortestPathToTarget.length > 1
    ) {
      let nMoves = 0;
      let prevTile = this.shortestPathToTarget[0];
      let simulatedRemainingMoves = this.remainingMovementPoints;
      let moveAugmentedShortestPath: AugmentedTile[] = [];
      moveAugmentedShortestPath.push({
        tile: prevTile,
      });
      for (let i = 1; i < this.shortestPathToTarget.length; i++) {
        const currentTile = this.shortestPathToTarget[i];
        const cost = prevTile.movementCostTo(currentTile)!;
        if (cost > simulatedRemainingMoves) {
          nMoves++;
          moveAugmentedShortestPath[
            moveAugmentedShortestPath.length - 1
          ].nMoves = nMoves;
          simulatedRemainingMoves += this.movementPoints - cost;
        } else {
          simulatedRemainingMoves -= cost;
        }
        moveAugmentedShortestPath.push({
          tile: currentTile,
        });
        prevTile = currentTile;
      }
      return moveAugmentedShortestPath;
    } else {
      return null;
    }
  }

  abstract getCurrentPossibleUnitActionTypes(): UnitActionType[];

  protected static drawAdditionalUnitsIcon(p5: p5) {}

  abstract draw(p5: p5): void;

  drawAdditionalUnitsIcon(p5: p5): void {
    p5.translate(Unit.WIDTH / 2, -Unit.HEIGHT / 2);
    p5.ellipseMode(p5.CENTER);
    p5.stroke(0);
    p5.strokeWeight(1);
    const ellipseDiameter = 10;
    p5.fill(255);
    p5.ellipse(0, 0, ellipseDiameter, ellipseDiameter);
    const lineLength = ellipseDiameter - 4;
    p5.line(-lineLength / 2, 0, lineLength / 2, 0);
    p5.line(0, -lineLength / 2, 0, lineLength / 2);
  }
}

export default Unit;
