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
  private static popIncreaseFoodSurplus = 30;
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

  getCurrentProduction() {
    return this.currentProduction;
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

  getFoodRequiredForPopIncrease() {
    return City.popIncreaseFoodSurplus;
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

  getConsumedFoodPerTurn() {
    return this.getResources().population ?? 0;
  }

  getSurplusFood() {
    const { food: foodProducedPerTurn } = this.getCurrentResourcesPerTurn();
    return (foodProducedPerTurn ?? 0) - this.getConsumedFoodPerTurn();
  }

  setCurrentProduction(production: ProductionItem) {
    this.currentProduction = production;
  }
}

export default City;
