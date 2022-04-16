import p5 from "p5";
import RegularHexagon from "../assets/regular-hexagon";
import { BasicResourceTypes } from "./base-resource";
import { ExtraResourceTypes } from "./extra-resources";

export type AllResourceTypes = BasicResourceTypes | ExtraResourceTypes;

export type ResourceQuantity = {
  [key in AllResourceTypes]?: number;
};

export function getNoResources(): ResourceQuantity {
  return {};
}

class Resources {
  foodIcon: p5.Image;
  productionIcon: p5.Image;
  populationIcon: p5.Image;
  woodIcon: p5.Image;
  ironIcon: p5.Image;

  public static getIconUrl(resourceType: AllResourceTypes) {
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
    }
    throw Error("Unknown resource type: " + resourceType);
  }

  constructor(p5: p5) {
    this.foodIcon = p5.loadImage(Resources.getIconUrl("food"));
    this.productionIcon = p5.loadImage(Resources.getIconUrl("production"));
    this.populationIcon = p5.loadImage(Resources.getIconUrl("population"));
    this.woodIcon = p5.loadImage(Resources.getIconUrl("wood"));
    this.ironIcon = p5.loadImage(Resources.getIconUrl("iron"));
  }

  getResourceIcon(resourceType: AllResourceTypes): p5.Image {
    if (resourceType === "food") {
      return this.foodIcon;
    } else if (resourceType === "production") {
      return this.productionIcon;
    } else if (resourceType === "population") {
      return this.populationIcon;
    } else if (resourceType === "wood") {
      return this.woodIcon;
    } else if (resourceType === "iron") {
      return this.ironIcon;
    }
    throw Error("Unknown resource type: " + resourceType);
  }
}

export default Resources;
