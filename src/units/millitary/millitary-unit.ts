import p5 from "p5";
import Unit from "../unit";

class MillitaryUnit extends Unit {
  private static readonly HEALTH_BAR_WIDTH = 30;
  private static readonly HEALTH_BAR_HEIGHT = 5;
  private readonly strength: number;
  private readonly health = 50;
  private selectingAttackTarget = false;

  constructor(strength: number, movementPoints: number, p5: p5) {
    super(p5, movementPoints);
    this.strength = strength;
  }

  public isSelectingAttackTarget() {
    return this.selectingAttackTarget;
  }

  public toggleSelectingAttackTarget() {
    this.selectingAttackTarget = !this.selectingAttackTarget;
  }

  public draw(p5: p5) {
    super.draw(p5);
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
}

export default MillitaryUnit;
