import City from "../../cities/city";
import Player from "../../players/player";
import HexTile from "../hex-tile";

class CityTile extends HexTile {
  private static readonly nMovementPoints = Infinity;
  private readonly openCityModal: (city: City) => void;
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
      city.owner,
      city.name
    );
    this.city = city;
    this.openCityModal = openCityModal;
  }

  public onClick(): void {
    this.openCityModal(this.city);
  }
}

export default CityTile;
