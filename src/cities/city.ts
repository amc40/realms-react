import p5 from "p5";
import HexTile from "../grid/hex-tile";
import Player from "../players/player";
import {
  addAllResourceQuantities,
  addResourceQuantities,
  AllResourceTypes,
  ResourceQuantity,
} from "../resources";
import { ProductionItem } from "./production";

class City {
  readonly name: string;
  owner: Player;
  private resources: ResourceQuantity = {
    population: 10,
    food: 10,
    production: 10,
  };
  private baseResourcesPerTurn: ResourceQuantity = {
    food: 1,
    production: 1,
  };
  private currentProduction: ProductionItem | null = null;
  private readonly tiles: HexTile[] = [];

  constructor(name: string = "City", owner: Player) {
    this.name = name;
    this.owner = owner;
  }

  addTile(tile: HexTile) {
    this.tiles.push(tile);
  }

  removeTile(tile: HexTile) {
    this.tiles.splice(this.tiles.indexOf(tile), 1);
  }

  getCurrentResourcesPerTurn() {
    const tileResources = this.tiles.map((tile) => tile.getResources());
    return addAllResourceQuantities([
      this.baseResourcesPerTurn,
      ...tileResources,
    ]);
  }

  getProductionPerTurn(): number {
    return this.getCurrentResourcesPerTurn().production ?? 0;
  }

  public addResources(resourceQuantity: ResourceQuantity) {
    this.resources = addResourceQuantities(this.resources, resourceQuantity);
  }

  public getResources() {
    return this.resources;
  }
}

export default City;
