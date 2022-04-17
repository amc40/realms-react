import p5 from "p5";
import Unit from "../unit";

class CivilUnit extends Unit {
  constructor(
    nMovementPoints: number,
    owner: Player,
    onKilled: (unit: Unit) => void,
    icon: p5.Image
  ) {
    super(nMovementPoints, owner, onKilled, icon);
  }

  
}

export default CivilUnit;
