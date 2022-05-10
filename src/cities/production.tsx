import p5 from "p5";
import React, { useEffect } from "react";
import GameMap from "../grid/game-map";
import Player from "../players/player";
import RealmsSketch from "../sketch/realms-sketch";
import Units, { UnitType } from "../units";
import Unit from "../units/unit";
import City from "./city";

export interface ProductionItem {
  name: string;
  onProduced: (city: City) => void;
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
  readonly civilUnits: ProductionItem[] = [];

  private static getMillitaryIcon() {}

  constructor(units: Units, player: Player, sketch: RealmsSketch) {
    const produceUnit = (city: City, unitType: UnitType) =>
      city.cityTile!.produceUnit(
        units.getUnit(unitType, city.owner, sketch.onUnitKilled)
      );
    this.millitaryUnits.push({
      name: "Swordsman",
      onProduced: (city: City) => produceUnit(city, "swordsman"),
      productionCost: 30,
      icon: <UnitIcon unit={units.getSwordsman(player, () => {})} />,
    });
    this.civilUnits.push({
      name: "Worker",
      onProduced: (city: City) => produceUnit(city, "worker"),
      productionCost: 30,
      icon: <UnitIcon unit={units.getWorker(player, () => {})} />,
    });
    this.civilUnits.push({
      name: "Settler",
      onProduced: (city: City) => produceUnit(city, "settler"),
      productionCost: 60,
      icon: <UnitIcon unit={units.getSettler(player, () => {})} />,
    });
    this.civilUnits.push({
      name: "Caravan",
      onProduced: (city: City) => produceUnit(city, "caravan"),
      productionCost: 30,
      icon: <UnitIcon unit={units.getCaravan(player, () => {})} />,
    });
  }

  public getItems() {
    return [...this.millitaryUnits, ...this.civilUnits];
  }
}

export default ProductionItems;
