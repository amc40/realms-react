import p5 from "p5";

class NextTurn {
  static readonly OUTER_RADIUS = 60;
  static readonly INNER_RADIUS = 55;
  static readonly MARGIN = 50;
  private nextTurn: () => void;

  constructor(nextTurn: () => void) {
    this.nextTurn = nextTurn;
  }

  getCentre(p5: p5): p5.Vector {
    return p5.createVector(
      p5.width - NextTurn.OUTER_RADIUS - NextTurn.MARGIN,
      p5.height - NextTurn.OUTER_RADIUS - NextTurn.MARGIN
    );
  }

  handleClick(p5: p5, mouseX: number, mouseY: number): boolean {
    const centreToMouse = p5
      .createVector(mouseX, mouseY)
      .sub(this.getCentre(p5));
    const distance = centreToMouse.mag();
    if (distance < NextTurn.OUTER_RADIUS) {
      this.nextTurn();
      return true;
    }
    return false;
  }

  draw(p5: p5, text: "Next Turn" | "Needs\nOrders" | "Choose\nProduction") {
    p5.push();
    p5.ellipseMode(p5.CENTER);
    p5.ellipse(
      this.getCentre(p5).x,
      this.getCentre(p5).y,
      NextTurn.OUTER_RADIUS * 2,
      NextTurn.OUTER_RADIUS * 2
    );
    p5.ellipse(
      this.getCentre(p5).x,
      this.getCentre(p5).y,
      NextTurn.INNER_RADIUS * 2,
      NextTurn.INNER_RADIUS * 2
    );
    p5.textSize(16);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(text, this.getCentre(p5).x, this.getCentre(p5).y);

    p5.pop();
  }
}

export default NextTurn;
