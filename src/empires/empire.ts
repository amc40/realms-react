import p5 from "p5";
import RGB from "../utils/RGB";

export type EmpireColor = "blue";

class Empire {
  readonly name: string;
  readonly color: RGB;
  readonly colorName: string;
  readonly shieldSelectedIcon: p5.Image;
  readonly shieldUnselectedIcon: p5.Image;

  constructor(name: string, color: RGB, colorName: string, p5: p5) {
    this.name = name;
    this.color = color;
    this.colorName = colorName;
    this.shieldSelectedIcon = p5.loadImage(
      `/assets/shields/shield-${colorName}-selected.png`
    );
    this.shieldUnselectedIcon = p5.loadImage(
      `/assets/shields/shield-${colorName}-unselected.png`
    );
  }
}

export class Empires {
  readonly empires: Empire[];

  constructor(p5: p5) {
    this.empires = [
      new Empire(
        "Dark Green",
        {
          r: 7,
          g: 107,
          b: 0,
        },
        "dark-green",
        p5
      ),
      new Empire(
        "Dark Blue",
        {
          r: 46,
          g: 45,
          b: 183,
        },
        "dark-blue",
        p5
      ),
      new Empire(
        "Orange",
        {
          r: 255,
          g: 185,
          b: 51,
        },
        "orange",
        p5
      ),
      new Empire(
        "Red",
        {
          r: 124,
          g: 0,
          b: 0,
        },
        "red",
        p5
      ),
      new Empire(
        "Pink",
        {
          r: 255,
          g: 135,
          b: 186,
        },
        "pink",
        p5
      ),
      new Empire(
        "Purple",
        {
          r: 122,
          g: 33,
          b: 139,
        },
        "purple",
        p5
      ),
      new Empire(
        "Brown",
        {
          r: 101,
          g: 72,
          b: 54,
        },
        "brown",
        p5
      ),
    ];
  }
}

export default Empire;
