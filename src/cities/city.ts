import p5 from "p5";
import HexTile from "../grid/hex-tile";
import CityTile from "../grid/tiles/city";
import Player from "../players/player";
import {
  addAllResourceQuantities,
  addResourceQuantities,
  AllResourceTypes,
  ResourceQuantity,
  resourceQuantityLessThanOrEqualTo,
} from "../resources";
import { ResourceTransferSrc } from "../resources/resource-transfer";
import Unit from "../units/unit";
import { ProductionItem } from "./production";

class City {
  private static popIncreaseFoodSurplus = 30;
  readonly name: string;
  _owner: Player;
  cityTile: CityTile | null = null;
  private resources: ResourceQuantity = {
    population: 1,
  };
  private baseResourcesPerTurn: ResourceQuantity = {
    food: 1,
    production: 1,
  };
  private currentProduction: ProductionItem | null = null;
  private readonly tiles: HexTile[] = [];
  private siegedThisRound = false;
  health = 100;
  strength = 20;

  onCaptured: () => void;

  constructor(
    name: string = "City",
    owner: Player,
    onCaptured: (city: City) => void
  ) {
    this.name = name;
    this._owner = owner;
    this.onCaptured = () => onCaptured(this);
  }

  get owner() {
    return this._owner;
  }

  set owner(player: Player) {
    this._owner = player;
    this.cityTile?.setColor(player.empire.color);
    this.onCaptured();
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
    const startTime = Date.now();
    const tileResources = this.tiles.map((tile) => tile.getAllResources());
    console.log("getAllResources time", Date.now() - startTime);
    return addAllResourceQuantities([
      { ...this.baseResourcesPerTurn },
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

  handleEndRound() {
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
    if (
      this.currentProduction != null &&
      (this.resources.production ?? 0) >= this.currentProduction.productionCost
    ) {
      this.resources.production = 0;
      this.currentProduction!.onProduced(this);
      this.currentProduction = null;
    }
    // heal 20 percent of the city's health if not sieged this round
    if (!this.siegedThisRound) {
      this.health = Math.min(100, this.health + 20);
    }
    this.siegedThisRound = false;
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
    return (this.getResources().population ?? 0) * 3;
  }

  getStablePopulation() {
    const { food } = this.getCurrentResourcesPerTurn();
    return Math.floor((food ?? 0) / 3);
  }

  setPopulation(newPopulation: number) {
    this.resources.population = newPopulation;
  }

  getSurplusFood() {
    const { food: foodProducedPerTurn } = this.getCurrentResourcesPerTurn();
    return (foodProducedPerTurn ?? 0) - this.getConsumedFoodPerTurn();
  }

  public getResourceTransferSrc(): ResourceTransferSrc {
    return {
      resourceSrcName: this.name,
      resourceSrcQuantity: this.getTransferrableResources(),
    };
  }

  setTransferableResources(transferableResourceQuantity: ResourceQuantity) {
    if (transferableResourceQuantity.population != null) {
      delete transferableResourceQuantity.population;
    }
    if (transferableResourceQuantity.production != null) {
      delete transferableResourceQuantity.production;
    }

    this.resources = {
      population: this.resources.population,
      production: this.resources.production,
      ...transferableResourceQuantity,
    };
  }

  getValidProductionSelections(productionItems: ProductionItem[]) {
    return productionItems.filter((productionItem) => {
      const resourceRequirements = productionItem.otherResourceCost;
      return resourceQuantityLessThanOrEqualTo(
        resourceRequirements,
        this.resources
      );
    });
  }

  setCurrentProduction(production: ProductionItem) {
    this.currentProduction = production;
    for (const _resource of Object.keys(production.otherResourceCost)) {
      const resource = _resource as AllResourceTypes;
      this.resources[resource] =
        (this.resources[resource] ?? 0) -
        (production.otherResourceCost[resource] ?? 0);
    }
  }
}

export default City;
