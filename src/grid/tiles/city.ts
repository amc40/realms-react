import City from "../../cities/city";
import Player from "../../players/player";
import Resources, {
  AllResourceTypes,
  getNoResources,
  ResourceQuantity,
} from "../../resources";
import Unit from "../../units/unit";
import HexTile from "../hex-tile";

class CityTile extends HexTile {
  private static readonly nMovementPoints = 1;
  private readonly openCityModal: (city: City) => void;
  private static readonly resources = getNoResources();
  readonly produceUnit: (unit: Unit) => void;

  constructor(
    radius: number,
    row: number,
    col: number,
    city: City,
    resourceIconRepo: Resources,
    openCityModal: (city: City) => void,
    produceUnit: (unit: Unit) => void
  ) {
    super(
      "City",
      radius,
      row,
      col,
      city.owner.getColor(),
      CityTile.nMovementPoints,
      CityTile.resources,
      resourceIconRepo,
      { city, text: city.name }
    );
    this.city = city;
    this.city.setCityTile(this);
    this.openCityModal = openCityModal;
    this.produceUnit = produceUnit;
  }

  public addResources(resourceQuantity: ResourceQuantity) {
    this.city!.addResources(resourceQuantity);
  }

  public onClick(
    mouseRelativeX: number,
    mouseRelativeY: number,
    player: Player
  ): void {
    if (
      this.intersectsWithText(mouseRelativeX, mouseRelativeY) &&
      player === this.getOwner()
    ) {
      this.openCityModal(this.city!);
    } else {
      super.onClick(mouseRelativeX, mouseRelativeY, player);
    }
  }
}

export default CityTile;
