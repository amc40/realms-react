import p5 from "p5";
import Player from "../players/player";

class CurrentPlayerIndicator {

  readonly diameter = 50;
  readonly distFromBottom = 20;

  draw(p5: p5, currentPlayer: Player) {
    const currentPlayerEmpire = currentPlayer.empire;
    const currentPlayerEmpireColor = currentPlayerEmpire.color;
    p5.push();
    p5.translate(p5.width / 2, p5.height - (this.diameter / 2) - this.distFromBottom);
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.ellipseMode(p5.CENTER);
    p5.ellipse(0, 0, this.diameter, this.diameter);
    p5.pop();
  }
}

export default CurrentPlayerIndicator;