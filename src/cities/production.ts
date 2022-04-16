import Unit from "../units/unit";

export interface ProductionItem {
  name: string;
  onProduced: () => void;
  productionCost: number;
  icon: JSX.Element;
}

class ProductionItems {
  readonly productionItems: ProductionItem[] = [];

  constructor() {}

  public getItems() {
    return this.productionItems;
  }
}
