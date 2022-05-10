import Empire from "../empires/empire";
import RGB from "../utils/RGB";

class Player {
  nCities = 0;
  readonly empire: Empire;

  constructor(empire: Empire) {
    this.empire = empire;
  }

  public getColor(): RGB {
    return this.empire.color;
  }

  public incrementThenGetNCities(): number {
    return ++this.nCities;
  }
}

export default Player;
