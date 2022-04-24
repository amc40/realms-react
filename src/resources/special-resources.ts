export type SpecialResourceTypes = "iron" | "wood";

export type SpecialResourceQuantity = {
  [key in SpecialResourceTypes]?: number;
};
