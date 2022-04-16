import p5 from "p5";
import Player from "../players/player";
import { AllResourceTypes, ResourceQuantity } from "../resources";

class City {
  readonly name: string;
  owner: Player;
  private resources: ResourceQuantity = {
    population: 10,
    food: 10,
    production: 10,
  };

  constructor(name: string = "City", owner: Player) {
    this.name = name;
    this.owner = owner;
  }

  public addResources(resourceQuantity: ResourceQuantity) {
    for (let resourceStr in Object.keys(resourceQuantity)) {
      const resource = resourceStr as AllResourceTypes;
      if (this.resources[resource] != null) {
        this.resources[resource]! += resourceQuantity[resource]!;
      } else {
        this.resources[resource] = resourceQuantity[resource];
      }
    }
  }

  public getResources() {
    return this.resources;
  }
}

export default City;
