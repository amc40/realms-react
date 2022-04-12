import RGB from "../utils/RGB";

export type EmpireColor = "blue";

class Empire {
  readonly color: RGB;

  constructor(color: RGB) {
    this.color = color;
  }
}

export default Empire;
