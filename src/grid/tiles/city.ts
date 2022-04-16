import City from "../../cities/city";
import Player from "../../players/player";
import {
  AllResourceTypes,
  getNoResources,
  ResourceQuantity,
} from "../../resources";
import HexTile from "../hex-tile";

class CityTile extends HexTile {
  private static readonly nMovementPoints = 1;
  private readonly openCityModal: (city: City) => void;
  private static readonly resources = getNoResources();
  private readonly city: City;

  constructor(
    radius: number,
    row: number,
    col: number,
    city: City,
    openCityModal: (city: City) => void
  ) {
    super(
      radius,
      row,
      col,
      city.owner.getColor(),
      CityTile.nMovementPoints,
      CityTile.resources,
      city.owner,
      city.name
    );
    this.city = city;
    this.openCityModal = openCityModal;
  }

  public addResources(resourceQuantity: ResourceQuantity) {
    this.city.addResources(resourceQuantity);
  }

  public onClick(mouseRelativeX: number, mouseRelativeY: number): void {
    if (this.intersectsWithText(mouseRelativeX, mouseRelativeY)) {
      this.openCityModal(this.city);
    } else {
      super.onClick(mouseRelativeX, mouseRelativeY);
    }
  }
}

export default CityTile;
