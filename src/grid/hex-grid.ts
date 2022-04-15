import HexTile from "./hex-tile";
import ShortestPath, { Node } from "../utils/shortest-path";
import p5 from "p5";
import drawArrow from "../assets/arrow";
import Unit, { AugmentedTile as MoveAugmentedTile } from "../units/unit";
import CityTile from "./tiles/city";

export class AxialCoordinate {
  public readonly q: number;
  public readonly r: number;

  constructor(q: number, r: number) {
    this.q = q;
    this.r = r;
  }

  public toCubeCoordinate() {
    // as sum to 0
    return new CubeCoordinate(this.q, this.r, -this.q - this.r);
  }

  public toOffsetCoordinate() {
    const row = this.r;
    const col = this.q + (this.r - (this.r & 1)) / 2;
    return new OffsetCoordinate(row, col);
  }
}

export class CubeCoordinate {
  public readonly q: number;
  public readonly r: number;
  public readonly s: number;

  constructor(q: number, r: number, s: number) {
    this.q = q;
    this.r = r;
    this.s = s;
  }

  public static cubeRound(
    fracQ: number,
    fracR: number,
    fracS: number
  ): CubeCoordinate {
    let q = Math.round(fracQ);
    let r = Math.round(fracR);
    let s = Math.round(fracS);

    const qDiff = Math.abs(q - fracQ);
    const rDiff = Math.abs(r - fracR);
    const sDiff = Math.abs(s - fracS);

    if (qDiff > rDiff && qDiff > sDiff) {
      q = -r - s;
    } else if (rDiff > sDiff) {
      r = -q - s;
    } else {
      s = -q - r;
    }
    return new CubeCoordinate(q, r, s);
  }

  toOffsetCoordinate(): OffsetCoordinate {
    return new AxialCoordinate(this.q, this.r).toOffsetCoordinate();
  }

  add(q: number, r: number, s: number): CubeCoordinate {
    return new CubeCoordinate(this.q + q, this.r + r, this.s + s);
  }

  /**
   * Get the difference between two cube coordinates.
   * @param cubeCoordinate the cube coordinate to get the difference for.
   * @return the CubeCoordinate containing the difference.
   */
  diff(cubeCoordinate: CubeCoordinate): CubeCoordinate {
    return new CubeCoordinate(
      this.q - cubeCoordinate.q,
      this.r - cubeCoordinate.r,
      this.s - cubeCoordinate.s
    );
  }

  /**
   * @return the total of the absolute value of the coordinates.
   */
  public totalCoordMag() {
    return Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s);
  }
}

export class OffsetCoordinate {
  public readonly row: number;
  public readonly col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  toAxialCoordinate(): AxialCoordinate {
    const q = this.col - (this.row - (this.row & 1)) / 2;
    const r = this.row;
    return new AxialCoordinate(q, r);
  }

  toCubeCoordinate(): CubeCoordinate {
    return this.toAxialCoordinate().toCubeCoordinate();
  }

  inBounds(nRows: number, nCols: number) {
    return (
      this.row >= 0 && this.row < nRows && this.col >= 0 && this.col < nCols
    );
  }
}

class Map {
  private readonly x: number;
  private readonly y: number;
  private readonly width: number;
  private readonly height: number;
  private readonly hexagonGrid: HexTile[][];
  private readonly radius: number;
  private readonly nRows: number;
  private readonly nCols: number;
  // horizontal distance between hexagon centres
  private readonly horizontalDist: number;
  private xPan = 0;
  private yPan = 0;
  private scale = 1;

  private currentSelectedUnit: Unit | null = null;
  private units: Unit[] = [];

  private static getNeighbourOffsetCoords(
    row: number,
    col: number,
    nRows: number,
    nCols: number
  ): OffsetCoordinate[] {
    const neighbourCubeCoords: CubeCoordinate[] = [];
    const baseCube = new OffsetCoordinate(row, col).toCubeCoordinate();
    // add one and -1 to each of the q r and s
    neighbourCubeCoords.push(baseCube.add(0, -1, 1));
    neighbourCubeCoords.push(baseCube.add(1, -1, 0));
    neighbourCubeCoords.push(baseCube.add(-1, 0, 1));
    neighbourCubeCoords.push(baseCube.add(1, 0, -1));
    neighbourCubeCoords.push(baseCube.add(-1, 1, 0));
    neighbourCubeCoords.push(baseCube.add(0, 1, -1));

    const offsetCoordinates = neighbourCubeCoords.map((cubeCoordinate) =>
      cubeCoordinate.toOffsetCoordinate()
    );
    const inBoundsOffsetCoordinates = offsetCoordinates.filter(
      (offsetCoordinate) => offsetCoordinate.inBounds(nRows, nCols)
    );
    return inBoundsOffsetCoordinates;
  }

  addGridEdges() {
    for (let row = 0; row < this.nRows; row++) {
      for (let col = 0; col < this.nCols; col++) {
        for (let neighbourOffsetCoord of Map.getNeighbourOffsetCoords(
          row,
          col,
          this.nRows,
          this.nCols
        )) {
          const neighbour =
            this.hexagonGrid[neighbourOffsetCoord.row][
              neighbourOffsetCoord.col
            ];
          this.hexagonGrid[row][col].addNeighbour(neighbour);
        }
      }
    }
  }

  public constructor(
    width: number,
    height: number,
    x: number,
    y: number,
    nRows: number,
    nCols: number,
    radius: number,
    hexagonGrid: HexTile[][]
  ) {
    if (nRows <= 0) throw new Error("nRows must be > 0");
    if (nCols <= 0) throw new Error("nCols must be > 0");
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.nRows = nRows;
    this.nCols = nCols;
    this.hexagonGrid = hexagonGrid;
    this.addGridEdges();
    this.horizontalDist = this.radius * Math.sqrt(3);
    this.height = height;
    this.width = width;
  }

  private firstOffset(row: number) {
    if (row % 2 === 0) return 0;
    return this.horizontalDist / 2;
  }

  public mouseXYInBounds(mouseX: number, mouseY: number): boolean {
    return (
      mouseX >= this.x &&
      mouseX < this.x + this.width &&
      mouseY >= this.y &&
      mouseY < this.y + this.height
    );
  }

  public mouseXYToOffset(mouseX: number, mouseY: number) {
    const topLeftRelativeX = mouseX - this.horizontalDist / 2;
    const topLeftRelativeY = mouseY - this.radius;
    const q =
      (Math.sqrt(3) * topLeftRelativeX - topLeftRelativeY) / (3 * this.radius);
    const r = (2 * topLeftRelativeY) / (3 * this.radius);
    const s = -q - r;
    const cubeCoordinate = CubeCoordinate.cubeRound(q, r, s);
    return cubeCoordinate.toOffsetCoordinate();
  }

  static distBetweenHexTileNodes(node1: Node<HexTile>, node2: Node<HexTile>) {
    const hexTile1 = node1.gamePoint;
    const hexTile2 = node2.gamePoint;
    const hexTile1CubeCoord = new OffsetCoordinate(
      hexTile1.getRow(),
      hexTile1.getCol()
    ).toCubeCoordinate();
    const hexTile2CubeCoord = new OffsetCoordinate(
      hexTile2.getRow(),
      hexTile2.getCol()
    ).toCubeCoordinate();
    return hexTile1CubeCoord.diff(hexTile2CubeCoord).totalCoordMag();
  }

  getCurrentSelectedUnit(): Unit | null {
    return this.currentSelectedUnit;
  }

  inBounds(row: number, col: number) {
    return row >= 0 && row < this.nRows && col >= 0 && col < this.nCols;
  }

  addUnit(unit: Unit, row: number, col: number) {
    if (!this.inBounds(row, col)) {
      throw new Error("row and col must be in bounds");
    }
    this.addUnitToTile(unit, this.hexagonGrid[row][col]);
  }

  private addUnitToTile(unit: Unit, hexTile: HexTile) {
    unit.currentTile = hexTile;
    this.units.push(unit);
  }

  handleNextTurn() {
    this.units.forEach((unit) => unit.handleNextTurn());
    this.currentSelectedUnit = null;
  }

  public handleMouseMove(mouseScreenX: number, mouseScreenY: number) {
    const currentSelectedUnit = this.getCurrentSelectedUnit();
    if (
      currentSelectedUnit != null &&
      currentSelectedUnit.havingMovementSelected()
    ) {
      const mouseX = (mouseScreenX - this.xPan) / this.scale;
      const mouseY = (mouseScreenY - this.yPan) / this.scale;
      if (this.mouseXYInBounds(mouseX, mouseY)) {
        const offsetCoordinate = this.mouseXYToOffset(mouseX, mouseY);
        if (offsetCoordinate.inBounds(this.nRows, this.nCols)) {
          const newMovementTarget =
            this.hexagonGrid[offsetCoordinate.row][offsetCoordinate.col];
          currentSelectedUnit.movementTarget = newMovementTarget;
        }
      }
    }
  }

  public handleClick(
    p5: p5,
    mouseScreenX: number,
    mouseScreenY: number
  ): boolean {
    const mouseX = (mouseScreenX - this.xPan) / this.scale;
    const mouseY = (mouseScreenY - this.yPan) / this.scale;
    const offsetCoordinate = this.mouseXYToOffset(mouseX, mouseY);
    if (offsetCoordinate.inBounds(this.nRows, this.nCols)) {
      const currentSelectedUnit = this.getCurrentSelectedUnit();
      if (
        currentSelectedUnit != null &&
        currentSelectedUnit.havingMovementSelected()
      ) {
        currentSelectedUnit.selectCurrentMovementTarget();
        currentSelectedUnit.toggleSelectingMovement();
      } else {
        const hexTile =
          this.hexagonGrid[offsetCoordinate.row][offsetCoordinate.col];
        const hexCentreX = this.getHexCentreX(hexTile);
        const hexCentreY = this.getHexCentreY(hexTile);
        const mouseRelativeToCentre = p5
          .createVector(mouseX, mouseY)
          .sub(hexCentreX, hexCentreY);
        hexTile.onClick(mouseRelativeToCentre.x, mouseRelativeToCentre.y);
        this.currentSelectedUnit = hexTile.getCurrentSelectedUnit();
      }
      // return true if processed click
      return true;
    } else {
      // return false if out of bounds so not processed
      return false;
    }
  }

  handleMouseWheel(e: WheelEvent, mouseX: number, mouseY: number): boolean {
    const zoomSensitivity = 0.1;
    let scaleFactor = null;
    if (e.deltaY < 0) {
      scaleFactor = 1 + zoomSensitivity;
    } else {
      scaleFactor = 1 - zoomSensitivity;
    }

    // Apply transformation and scale incrementally
    this.scale = this.scale * scaleFactor;
    this.xPan = mouseX - mouseX * scaleFactor + this.xPan * scaleFactor;
    this.yPan = mouseY - mouseY * scaleFactor + this.yPan * scaleFactor;
    return false;
  }

  public panX(x: number) {
    this.xPan += x;
  }

  public panY(y: number) {
    this.yPan += y;
  }

  private getHexCentreX(hexTile: HexTile) {
    return (
      this.horizontalDist / 2 +
      this.firstOffset(hexTile.getRow()) +
      hexTile.getCol() * this.horizontalDist
    );
  }

  private getHexCentreY(hexTile: HexTile) {
    return this.radius * (1 + hexTile.getRow() * 1.5);
  }

  addCityTile(cityTile: CityTile) {
    const row = cityTile.getRow();
    const col = cityTile.getCol();
    this.hexagonGrid[row][col] = cityTile;
    for (let neighbourCoords of Map.getNeighbourOffsetCoords(
      row,
      col,
      this.nRows,
      this.nCols
    )) {
      const neighbourTile =
        this.hexagonGrid[neighbourCoords.row][neighbourCoords.col];
      if (!neighbourTile.hasOwner()) {
        neighbourTile.setOwner(cityTile.getOwner());
      }
    }
  }

  drawPath(p5: p5, path: HexTile[]) {
    if (path.length > 1) {
      p5.strokeWeight(3);
      let prevHex = path[0];
      let prevHexX = this.getHexCentreX(prevHex);
      let prevHexY = this.getHexCentreY(prevHex);
      for (let i = 1; i < path.length - 1; i++) {
        const currentHex = path[i];
        const currentHexX = this.getHexCentreX(currentHex);
        const currentHexY = this.getHexCentreY(currentHex);
        p5.line(prevHexX, prevHexY, currentHexX, currentHexY);
        prevHex = currentHex;
        prevHexX = currentHexX;
        prevHexY = currentHexY;
      }
      const finalHex = path[path.length - 1];
      drawArrow(
        p5,
        prevHexX,
        prevHexY,
        this.getHexCentreX(finalHex),
        this.getHexCentreY(finalHex)
      );
    }
  }

  private drawEllipseWithText(x: number, y: number, text: string, p5: p5) {
    p5.ellipseMode(p5.CENTER);
    p5.ellipse(x, y, 20, 20);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(text, x, y);
  }

  drawAugmentedPath(p5: p5, path: MoveAugmentedTile[]) {
    if (path.length > 1) {
      p5.strokeWeight(3);
      let prevHex = path[0].tile;
      let prevHexX = this.getHexCentreX(prevHex);
      let prevHexY = this.getHexCentreY(prevHex);
      for (let i = 1; i < path.length - 1; i++) {
        const currentHex = path[i].tile;
        const currentHexX = this.getHexCentreX(currentHex);
        const currentHexY = this.getHexCentreY(currentHex);
        p5.line(prevHexX, prevHexY, currentHexX, currentHexY);
        prevHex = currentHex;
        prevHexX = currentHexX;
        prevHexY = currentHexY;
      }

      const finalHex = path[path.length - 1];
      drawArrow(
        p5,
        prevHexX,
        prevHexY,
        this.getHexCentreX(finalHex.tile),
        this.getHexCentreY(finalHex.tile)
      );
      for (let i = 1; i < path.length - 1; i++) {
        const { nMoves, tile } = path[i];
        if (nMoves != null) {
          this.drawEllipseWithText(
            this.getHexCentreX(tile),
            this.getHexCentreY(tile),
            nMoves.toString(),
            p5
          );
        }
      }
    }
  }

  draw(p5: p5) {
    p5.push();
    p5.translate(this.xPan, this.yPan);
    p5.scale(this.scale);
    p5.push();
    p5.translate(this.horizontalDist / 2, this.radius);
    for (let row = 0; row < this.nRows; row++) {
      p5.push();
      p5.translate(this.firstOffset(row), 0);
      for (let col = 0; col < this.nCols; col++) {
        this.hexagonGrid[row][col].draw(p5);
        p5.translate(this.horizontalDist, 0);
      }
      p5.pop();
      p5.translate(0, this.radius * 1.5);
    }
    p5.pop();
    const currentSelectedUnit = this.getCurrentSelectedUnit();
    const augmentedPath =
      currentSelectedUnit?.getMoveAugmentedShortestPathToTarget();
    if (augmentedPath != null) {
      this.drawAugmentedPath(p5, augmentedPath);
    }

    p5.pop();
  }
}

export default Map;
