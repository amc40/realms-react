import Player from "../../players/player";
import Portal from "../../portals/portal";
import { ResourceQuantity } from "../../resources";
import RGB from "../../utils/RGB";
import HexTile from "../hex-tile";
import Map from "../map";

export type SelectMapAndCentreOn = (
  mapToSelect: Map,
  centreOn: HexTile
) => void;

class PortalTile extends HexTile {
  private static readonly nMovementPoints = 2;
  private static readonly resources: ResourceQuantity = {};
  private static readonly color: RGB = {
    r: 82,
    g: 170,
    b: 251,
  };
  readonly portal: Portal;
  readonly selectMapAndCentreOn: SelectMapAndCentreOn;

  constructor(
    name: string,
    portal: Portal,
    radius: number,
    row: number,
    col: number,
    selectMapAndCentreOn: SelectMapAndCentreOn
  ) {
    super(
      "Portal",
      radius,
      row,
      col,
      PortalTile.color,
      PortalTile.nMovementPoints,
      PortalTile.resources,
      { text: `Portal ${name}` }
    );
    this.portal = portal;
    this.selectMapAndCentreOn = selectMapAndCentreOn;
  }

  public onClick(
    mouseRelativeX: number,
    mouseRelativeY: number,
    player: Player
  ): void {
    if (this.intersectsWithText(mouseRelativeX, mouseRelativeY)) {
      const { map: otherMap, tile: otherTile } =
        this.portal.getOtherEndMapAndTile(this);
      this.selectMapAndCentreOn(otherMap, otherTile);
    } else {
      super.onClick(mouseRelativeX, mouseRelativeY, player);
    }
  }
}

export default PortalTile;