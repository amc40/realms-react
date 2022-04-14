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
  private resources: ResourceQuantity = {};

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
    for (let resourceStr in Object.keys(resourceQuantity)) {
      const resource = resourceStr as AllResourceTypes;
      if (this.resources[resource] != null) {
        this.resources[resource]! += resourceQuantity[resource]!;
      } else {
        this.resources[resource] = resourceQuantity[resource];
      }
    }
  }

  public onClick(): void {
    this.openCityModal(this.city);
  }
}

export default CityTile;
