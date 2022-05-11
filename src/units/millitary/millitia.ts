import p5 from "p5";
import Player from "../../players/player";
import Unit from "../unit";
import MillitaryUnit from "./millitary-unit";

class Millitia extends MillitaryUnit {
  private static strength = 3;
  private static nMovementPoints = 2;

  constructor(
    p5: p5,
    owner: Player,
    onKilled: (unit: Unit) => void,
    icon: p5.Image
  ) {
    super(
      Millitia.strength,
      Millitia.nMovementPoints,
      p5,
      owner,
      onKilled,
      icon
    );
  }
}
export default Millitia;
