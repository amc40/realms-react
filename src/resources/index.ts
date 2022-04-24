import p5 from "p5";
import RegularHexagon from "../assets/regular-hexagon";
import { objectToArrOfEntries } from "../utils/object-utils";
import { BasicResourceTypes } from "./base-resource";
import { SpecialResourceTypes } from "./special-resources";

export type AllResourceTypes = BasicResourceTypes | SpecialResourceTypes;

export type ResourceQuantity = {
  [key in AllResourceTypes]?: number;
};

export function resourceQuantityToArray(
  resourceQuantity: ResourceQuantity
): [AllResourceTypes, number][] {
  return objectToArrOfEntries(resourceQuantity);
}

export function getNoResources(): ResourceQuantity {
  return {};
}

export function addResourceQuantities(
  resourceQuantity1: ResourceQuantity,
  resourceQuantity2: ResourceQuantity
) {
  let currentQuantity = resourceQuantity1;
  for (let resourceStr of Object.keys(resourceQuantity2)) {
    const resource = resourceStr as AllResourceTypes;
    if (currentQuantity[resource] != null) {
      currentQuantity[resource]! += resourceQuantity2[resource]!;
    } else {
      currentQuantity[resource] = resourceQuantity2[resource];
    }
  }
  return currentQuantity;
}

export function addAllResourceQuantities(
  resourceQuantities: ResourceQuantity[]
) {
  let currentQuantity = getNoResources();
  for (let resourceQuantity of resourceQuantities) {
    currentQuantity = addResourceQuantities(currentQuantity, resourceQuantity);
  }
  return currentQuantity;
}

type MiscResourceTypes = "turns";

class Resources {
  icons: { [key in AllResourceTypes | MiscResourceTypes]: p5.Image };

  public static getIconUrl(resourceType: AllResourceTypes | MiscResourceTypes) {
    if (resourceType === "food") {
      return "assets/resources/food.png";
    } else if (resourceType === "production") {
      return "assets/resources/production.png";
    } else if (resourceType === "population") {
      return "assets/resources/population.png";
    } else if (resourceType === "wood") {
      return "assets/resources/wood.png";
    } else if (resourceType === "iron") {
      return "assets/resources/iron.png";
    } else if (resourceType === "turns") {
      return "assets/turn.png";
    }
    throw Error("Unknown resource type: " + resourceType);
  }

  constructor(p5: p5) {
    const foodIcon = p5.loadImage(Resources.getIconUrl("food"));
    const productionIcon = p5.loadImage(Resources.getIconUrl("production"));
    const populationIcon = p5.loadImage(Resources.getIconUrl("population"));
    const woodIcon = p5.loadImage(Resources.getIconUrl("wood"));
    const ironIcon = p5.loadImage(Resources.getIconUrl("iron"));
    const turnsIcon = p5.loadImage(Resources.getIconUrl("turns"));
    this.icons = {
      food: foodIcon,
      production: productionIcon,
      population: populationIcon,
      wood: woodIcon,
      iron: ironIcon,
      turns: turnsIcon,
    };
  }

  getResourceIcon(
    resourceType: AllResourceTypes | MiscResourceTypes
  ): p5.Image {
    return this.icons[resourceType];
  }
}

export default Resources;
