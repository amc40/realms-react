import City from "../cities/city";
import { ProductionItem } from "../cities/production";
import RealmsSketch from "../sketch/realms-sketch";
import Unit from "../units/unit";
import Player from "./player";

abstract class AIPlayer extends Player {
  abstract chooseCityProduction(
    gameSketch: RealmsSketch,
    possibleProductionItems: ProductionItem[],
    city: City
  ): ProductionItem;
  abstract chooseUnitAction(gameSketch: RealmsSketch, unit: Unit): void;
}

export default AIPlayer;
