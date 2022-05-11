import p5 from "p5";
import React, { useEffect } from "react";
import GameMap from "../grid/game-map";
import Player from "../players/player";
import { ResourceQuantity } from "../resources";
import { SpecialResourceQuantity } from "../resources/special-resources";
import RealmsSketch from "../sketch/realms-sketch";
import Units, { UnitType } from "../units";
import Unit from "../units/unit";
import City from "./city";

export type ProductionItemName =
  | "Swordsman"
  | "Spearman"
  | "Millitia"
  | "Worker"
  | "Settler"
  | "Caravan";

export interface ProductionItem {
  name: ProductionItemName;
  onProduced: (city: City) => void;
  productionCost: number;
  otherResourceCost: ResourceQuantity;
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
  private static getMillitaryIcon() {}
  private readonly units: Units;
  private readonly sketch: RealmsSketch;

  constructor(units: Units, sketch: RealmsSketch) {
    this.units = units;
    this.sketch = sketch;
  }

  public getItems(player: Player) {
    const produceUnit = (city: City, unitType: UnitType) =>
      city.cityTile!.produceUnit(
        this.units.getUnit(unitType, city.owner, (unit: Unit) =>
          this.sketch.onUnitKilled(unit)
        )
      );
    const millitaryUnits: ProductionItem[] = [];
    millitaryUnits.push(
      {
        name: "Swordsman",
        onProduced: (city: City) => produceUnit(city, "swordsman"),
        productionCost: 60,
        icon: <UnitIcon unit={this.units.getSwordsman(player, () => {})} />,
        otherResourceCost: {
          population: 1,
          iron: 3,
        },
      },
      {
        name: "Spearman",
        onProduced: (city: City) => produceUnit(city, "spearman"),
        productionCost: 50,
        icon: <UnitIcon unit={this.units.getSpearman(player, () => {})} />,
        otherResourceCost: {
          population: 1,
          wood: 3,
        },
      },
      {
        name: "Millitia",
        onProduced: (city: City) => produceUnit(city, "millitia"),
        productionCost: 40,
        icon: <UnitIcon unit={this.units.getMillitia(player, () => {})} />,
        otherResourceCost: {
          population: 3,
        },
      }
    );
    const civilUnits: ProductionItem[] = [];
    civilUnits.push({
      name: "Worker",
      onProduced: (city: City) => produceUnit(city, "worker"),
      productionCost: 60,
      icon: <UnitIcon unit={this.units.getWorker(player, () => {})} />,
      otherResourceCost: {
        population: 1,
      },
    });
    civilUnits.push({
      name: "Settler",
      onProduced: (city: City) => produceUnit(city, "settler"),
      productionCost: 120,
      icon: <UnitIcon unit={this.units.getSettler(player, () => {})} />,
      otherResourceCost: {
        population: 3,
      },
    });
    civilUnits.push({
      name: "Caravan",
      onProduced: (city: City) => produceUnit(city, "caravan"),
      productionCost: 60,
      icon: <UnitIcon unit={this.units.getCaravan(player, () => {})} />,
      otherResourceCost: {
        population: 1,
      },
    });
    return [...millitaryUnits, ...civilUnits];
  }
}

export default ProductionItems;
