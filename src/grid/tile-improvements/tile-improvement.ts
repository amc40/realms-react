import p5 from "p5";
import { ResourceQuantity } from "../../resources";

class TileImprovement {
  readonly resourceYield: ResourceQuantity;
  readonly image: p5.Image;
  constructor(resourceYield: ResourceQuantity, image: p5.Image) {
    this.resourceYield = resourceYield;
    this.image = image;
  }
}
