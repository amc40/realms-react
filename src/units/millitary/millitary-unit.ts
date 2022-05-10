import p5 from "p5";
import HexTile from "../../grid/hex-tile";
import Player from "../../players/player";
import Unit from "../unit";
import { UnitActionType } from "../unit-actions";

export type MillitaryUnitActionType = "move" | "melee-attack" | "sleep";

abstract class MillitaryUnit extends Unit {
  private static readonly HEALTH_BAR_WIDTH = 30;
  private static readonly HEALTH_BAR_HEIGHT = 5;
  private readonly strength: number;
  private health = 100;
  private selectingAttackTarget = false;
  private readonly icon: p5.Image;
  private unselectedImage: p5.Image;
  private selectedImage: p5.Image;

  constructor(
    strength: number,
    movementPoints: number,
    p5: p5,
    owner: Player,
    onKilled: (unit: Unit) => void,
    icon: p5.Image
  ) {
    super(p5, movementPoints, owner, onKilled);
    this.unselectedImage = owner.empire.shieldUnselectedIcon;
    this.selectedImage = owner.empire.shieldSelectedIcon;
    this.strength = strength;
    this.icon = icon;
  }

  public isSelectingAttackTarget() {
    return this.selectingAttackTarget;
  }

  public toggleSelectingAttackTarget() {
    this.selectingAttackTarget = !this.selectingAttackTarget;
  }
  public stopSelectingAttackTarget() {
    this.selectingAttackTarget = false;
  }

  private static getDamage(
    attackingUnit: MillitaryUnit,
    defendingUnit: MillitaryUnit
  ): number {
    const strengthRatio = attackingUnit.strength / defendingUnit.strength;
    // TODO: add randomness
    // need 3x strength to have guaranteed kill
    const damage = (strengthRatio / 3) * 100;
    return damage;
  }

  /**
   *
   * @param attackingUnit the unit that is attacking
   * @param defendingUnit the unit which is defending
   * @returns true if the attack was successful, false otherwise.
   */
  private static simulateMeleeAttack(
    attackingUnit: MillitaryUnit,
    defendingUnit: Unit
  ): boolean {
    if (defendingUnit instanceof MillitaryUnit) {
      const attackingDamage = MillitaryUnit.getDamage(
        attackingUnit,
        defendingUnit
      );
      let success = false;
      const defendingDamage = MillitaryUnit.getDamage(
        defendingUnit,
        attackingUnit
      );
      defendingUnit.health -= attackingDamage;
      if (defendingUnit.health <= 0) {
        defendingUnit.onKilled();
        success = true;
      }
      attackingUnit.health -= defendingDamage;
      if (attackingUnit.health <= 0) {
        attackingUnit.onKilled();
        success = false;
      }

      return success;
    } else {
      // automatically convert undefended civilian units
      return true;
    }
  }

  getAttackableTargets() {
    const currentUnitReachableTiles = this.getReachableTiles();
    const attackableTiles = currentUnitReachableTiles.filter(
      (hexTile: HexTile) => hexTile.hasEnemyUnit(this.owner)
    );
    return attackableTiles;
  }

  /**
   * Melee attack a given target unit.
   * Note: the target unit should be within range with the current move's remaining movement points.
   * @param unit the unit to attack.
   */
  meleeAttack(unit: Unit) {
    const shortesPathToUnit = this.hexTileShortestPath.getShortestPath(
      this.currentTile!.getNode(),
      unit.currentTile!.getNode()
    );
    if (shortesPathToUnit == null) {
      console.warn(
        this,
        "could not find path to",
        unit,
        "when trying to attack"
      );
      return;
    }
    const { minCost, path } = shortesPathToUnit;
    if (minCost > this.remainingMovementPoints) {
      console.warn(
        this,
        "could not find path below",
        minCost,
        "to",
        unit,
        "when trying to attack"
      );
      return;
    }
    if (path.length < 2) {
      console.warn("path appears to show that", this, "is already on", unit);
    }
    // move to the tile adjacent to the target unit
    this.movementTarget = path[path.length - 2];
    this.moveAlongShortestPath();
    if (MillitaryUnit.simulateMeleeAttack(this, unit)) {
      // battle was a success -- advance to the target tile
      const takenTile = unit.currentTile;
      this.currentTile = takenTile;
      // and capture any civilian units on it
      takenTile?.getUnits().forEach((unit) => {
        if (!(unit instanceof MillitaryUnit)) {
          unit.owner = this.owner;
        }
      });
    }
  }

  public draw(p5: p5) {
    p5.imageMode(p5.CENTER);
    if (this.selected) {
      p5.image(this.selectedImage, 0, 0, Unit.WIDTH, Unit.HEIGHT);
    } else {
      p5.image(this.unselectedImage, 0, 0, Unit.WIDTH, Unit.HEIGHT);
    }
    p5.image(this.icon, 0, 0, Unit.WIDTH * 0.6, Unit.HEIGHT * 0.6);
    const offsetY = Unit.HEIGHT / 2 + 5 + MillitaryUnit.HEALTH_BAR_HEIGHT / 2;
    p5.rectMode(p5.CENTER);
    p5.noStroke();
    p5.fill(255, 0, 0);
    p5.rect(
      0,
      offsetY,
      MillitaryUnit.HEALTH_BAR_WIDTH,
      MillitaryUnit.HEALTH_BAR_HEIGHT
    );
    const healthBarWidth = MillitaryUnit.HEALTH_BAR_WIDTH * (this.health / 100);
    p5.fill(0, 255, 0);
    p5.rectMode(p5.CORNER);
    p5.rect(
      -MillitaryUnit.HEALTH_BAR_WIDTH / 2,
      offsetY - MillitaryUnit.HEALTH_BAR_HEIGHT / 2,
      healthBarWidth,
      MillitaryUnit.HEALTH_BAR_HEIGHT
    );
  }

  getCurrentPossibleUnitActionTypes(): UnitActionType[] {
    return ["melee-attack", "move", "sleep"];
  }
}

export default MillitaryUnit;
