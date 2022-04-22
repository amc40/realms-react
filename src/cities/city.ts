import p5 from "p5";
import HexTile from "../grid/hex-tile";
import CityTile from "../grid/tiles/city";
import Player from "../players/player";
import {
  addAllResourceQuantities,
  addResourceQuantities,
  AllResourceTypes,
  ResourceQuantity,
} from "../resources";
import Unit from "../units/unit";
import { ProductionItem } from "./production";

class City {
  private static popIncreaseFoodSurplus = 30;
  readonly name: string;
  owner: Player;
  cityTile: CityTile | null = null;
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

  setCityTile(cityTile: CityTile) {
    this.cityTile = cityTile;
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

  getCurrentNetResourcesPerTurn() {
    const currentProducedResourcesPerTurn = this.getCurrentResourcesPerTurn();
    return addResourceQuantities(currentProducedResourcesPerTurn, {
      food: -this.getConsumedFoodPerTurn(),
    });
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

  handleNextTurn() {
    this.addResources(this.getCurrentNetResourcesPerTurn());
    if ((this.resources.food ?? 0) >= this.getFoodRequiredForPopIncrease()) {
      this.resources.population = (this.resources.population ?? 0) + 1;
      this.resources.food =
        (this.resources.food ?? 0) - this.getFoodRequiredForPopIncrease();
    } else if ((this.resources.food ?? 0) < 0) {
      this.resources.population = (this.resources.population ?? 0) - 1;
      this.resources.food =
        this.getFoodRequiredForPopIncrease() + (this.resources.food ?? 0);
    }
  }

  public getResources() {
    return this.resources;
  }

  public getTransferrableResources() {
    let transferrableResources: ResourceQuantity = {
      ...this.resources,
    };
    delete transferrableResources.population;
    delete transferrableResources.production;
    return transferrableResources;
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
