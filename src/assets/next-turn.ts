import p5 from "p5";

class NextTurn {
  private static readonly OUTER_RADIUS = 50;
  private static readonly INNER_RADIUS = 45;
  private static readonly MARGIN = 50;

  draw(p5: p5) {
    p5.push();
    p5.ellipseMode(p5.CENTER);
    p5.ellipse(
      p5.width - NextTurn.OUTER_RADIUS - NextTurn.MARGIN,
      p5.height - NextTurn.OUTER_RADIUS - NextTurn.MARGIN,
      NextTurn.OUTER_RADIUS * 2,
      NextTurn.OUTER_RADIUS * 2
    );
    p5.ellipse(
      p5.width - NextTurn.OUTER_RADIUS - NextTurn.MARGIN,
      p5.height - NextTurn.OUTER_RADIUS - NextTurn.MARGIN,
      NextTurn.INNER_RADIUS * 2,
      NextTurn.INNER_RADIUS * 2
    );
    p5.textSize(16);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(
      "Next Turn",
      p5.width - NextTurn.OUTER_RADIUS - NextTurn.MARGIN,
      p5.height - NextTurn.OUTER_RADIUS - NextTurn.MARGIN
    );

    p5.pop();
  }
}

export default NextTurn;
