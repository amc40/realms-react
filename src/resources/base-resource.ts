export type BasicResourceTypes = "food" | "production" | "population";

export type BasicResourceQuantity = {
  [key in BasicResourceTypes]?: number;
};
