export type ResourceTypes = "wheat" | "wood";

export type ResourceQuantity = {
  [key in ResourceTypes]: number;
};
