import Empire from "../empires/empire";
import RGB from "../utils/RGB";

abstract class Player {
  private readonly empire: Empire;

  constructor(empire: Empire) {
    this.empire = empire;
  }

  public getColor(): RGB {
    return this.empire.color;
  }
}

export default Player;
