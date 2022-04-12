import Player from "../players/player";

class City {
  readonly name: string;
  owner: Player;

  constructor(name: string = "City", owner: Player) {
    this.name = name;
    this.owner = owner;
  }
}

export default City;
