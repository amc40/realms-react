import p5 from "p5";
import React, { useEffect } from "react";
import Player from "../players/player";
import Units from "../units";
import Unit from "../units/unit";

export interface ProductionItem {
  name: string;
  onProduced: () => void;
  productionCost: number;
  icon: JSX.Element;
}

class UnitIconSketch extends p5 {
  static iconWidth = 35;
  static iconHeight = UnitIconSketch.iconWidth;
  unit: Unit;
  selected: boolean;
  constructor(unit: Unit, canvasElement: HTMLElement) {
    super(() => {}, canvasElement);
    this.unit = unit;
    this.selected = false;
  }

  setup(): void {
    this.createCanvas(UnitIconSketch.iconWidth, UnitIconSketch.iconHeight);
  }

  draw() {
    this.translate(UnitIconSketch.iconWidth / 2, UnitIconSketch.iconHeight / 2);
    this.unit.draw(this);
  }
}

const UnitIcon: React.FC<{ unit: Unit }> = ({ unit }) => {
  const canvasRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef?.current) {
      const canvas = canvasRef.current;
      const sketch = new UnitIconSketch(unit, canvas);
    }
  }, [canvasRef]);

  return <div ref={canvasRef} />;
};

class ProductionItems {
  readonly millitaryUnits: ProductionItem[] = [];

  private static getMillitaryIcon() {}

  constructor(units: Units, player: Player) {
    this.millitaryUnits.push({
      name: "Swordsman",
      onProduced: () => {},
      productionCost: 30,
      icon: <UnitIcon unit={units.getSwordsman(player, () => {})} />,
    });
  }

  public getItems() {
    return this.millitaryUnits;
  }
}

export default ProductionItems;
