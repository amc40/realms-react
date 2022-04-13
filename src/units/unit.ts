import p5 from "p5";
import HexagonalGrid from "../grid/hex-grid";
import HexTile from "../grid/hex-tile";
import ShortestPath from "../utils/shortest-path";

enum State {
  WAITING_FOR_ORDERS,
  FOLLOWING_ORDERS,
  SELECTING_MOVEMENT,
}

class Unit {
  unselectedImage: p5.Image;
  selectedImage: p5.Image;
  selected: boolean = false;
  private _currentTile: HexTile | null = null;
  // TODO: maybe add a temp target so can cancel ordering movement
  private _movementTarget: HexTile | null = null;
  readonly hexTileShortestPath = new ShortestPath<HexTile>(
    HexagonalGrid.distBetweenHexTileNodes
  );
  private _shortestPathToTarget: HexTile[] | null = null;
  private state: State = State.WAITING_FOR_ORDERS;
  readonly movementPoints;
  private remainingMovementPoints: number;

  constructor(p5: p5, movementPoints: number) {
    this.unselectedImage = p5.loadImage(
      "assets/shields/shield-blue-unselected.png"
    );
    this.selectedImage = p5.loadImage(
      "assets/shields/shield-blue-selected.png"
    );
    this.movementPoints = movementPoints;
    this.remainingMovementPoints = movementPoints;
  }

  toggleSelected() {
    this.selected = !this.selected;
    return this.selected;
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
    return this.state === State.SELECTING_MOVEMENT;
  }

  private checkIfReachedTarget() {
    if (this.currentTile === this.movementTarget) {
      this.state = State.WAITING_FOR_ORDERS;
    }
  }

  startSelectingMovement() {
    this.state = State.SELECTING_MOVEMENT;
  }

  requiresOrders() {
    return this.state === State.WAITING_FOR_ORDERS && this.movementPoints > 0;
  }

  private moveAlongShortestPath() {
    console.log("moving along shortest path");
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
        console.log("moved to", this.currentTile);
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
    this.remainingMovementPoints = this.movementPoints;
  }

  selectCurrentMovementTarget() {
    // already have the current target set, just move along that path and set state to
    // FOLLOWING_ORDERS, or WAITING_FOR_ORDERS if reached target
    if (this._shortestPathToTarget != null) {
      this.state = State.FOLLOWING_ORDERS;
      this.moveAlongShortestPath();
    } else if (this.remainingMovementPoints > 0) {
      this.state = State.WAITING_FOR_ORDERS;
    } else {
      // TODO: ensure that at the end of the turn we update the state to WAITING_FOR_ORDERS
      this.state = State.FOLLOWING_ORDERS;
    }
  }

  get shortestPathToTarget() {
    return this._shortestPathToTarget;
  }

  draw(p5: p5) {
    p5.imageMode(p5.CENTER);
    if (this.selected) {
      p5.image(this.selectedImage, 0, 0, 30, 30);
    } else {
      p5.image(this.unselectedImage, 0, 0, 30, 30);
    }
  }
}

export default Unit;
