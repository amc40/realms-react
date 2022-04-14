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
