import Empire from "../empires/empire";
import RGB from "../utils/RGB";

class Player {
  readonly empire: Empire;

  constructor(empire: Empire) {
    this.empire = empire;
  }

  public getColor(): RGB {
    return this.empire.color;
  }
}

export default Player;
