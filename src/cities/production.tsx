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
        this.units.getUnit(unitType, city.owner, this.sketch.onUnitKilled)
      );
    const millitaryUnits = [];
    millitaryUnits.push({
      name: "Swordsman",
      onProduced: (city: City) => produceUnit(city, "swordsman"),
      productionCost: 30,
      icon: <UnitIcon unit={this.units.getSwordsman(player, () => {})} />,
    });
    const civilUnits = [];
    civilUnits.push({
      name: "Worker",
      onProduced: (city: City) => produceUnit(city, "worker"),
      productionCost: 30,
      icon: <UnitIcon unit={this.units.getWorker(player, () => {})} />,
    });
    civilUnits.push({
      name: "Settler",
      onProduced: (city: City) => produceUnit(city, "settler"),
      productionCost: 60,
      icon: <UnitIcon unit={this.units.getSettler(player, () => {})} />,
    });
    civilUnits.push({
      name: "Caravan",
      onProduced: (city: City) => produceUnit(city, "caravan"),
      productionCost: 30,
      icon: <UnitIcon unit={this.units.getCaravan(player, () => {})} />,
    });
    return [...millitaryUnits, ...civilUnits];
  }
}

export default ProductionItems;
