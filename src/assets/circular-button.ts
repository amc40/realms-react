import p5 from "p5";
import RGB from "../utils/RGB";

class CircularButton {
  private onClick: () => void;
  private x: number;
  private y: number;
  private radius: number;
  private centre: p5.Vector;
  private icon: p5.Image;
  private visible: boolean;
  private static readonly selectedColor: RGB = {
    r: 105,
    g: 143,
    b: 202,
  };

  constructor(
    onClick: () => void,
    x: number,
    y: number,
    radius: number,
    p5: p5,
    icon: p5.Image,
    visible: boolean = false
  ) {
    this.onClick = onClick;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.centre = p5.createVector(x, y);
    this.icon = icon;
    this.visible = visible;
  }

  handleClick(p5: p5, mouseX: number, mouseY: number): boolean {
    if (this.visible) {
      const centreToMouse = p5.createVector(mouseX, mouseY).sub(this.centre);
      const distance = centreToMouse.mag();
      if (distance < this.radius) {
        this.onClick();
        return true;
      }
    }
    return false;
  }

  setVisible() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  draw(p5: p5, selected = false) {
    if (this.visible) {
      p5.push();
      if (selected) {
        p5.fill(
          CircularButton.selectedColor.r,
          CircularButton.selectedColor.g,
          CircularButton.selectedColor.b
        );
      } else {
        p5.fill(255);
      }
      p5.ellipseMode(p5.CENTER);
      p5.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
      p5.textSize(16);
      // p5.textAlign(p5.CENTER, p5.CENTER);
      // p5.text("Next Turn", this.x, this.y);
      p5.imageMode(p5.CENTER);
      p5.image(this.icon, this.x, this.y, this.radius * 1.2, this.radius * 1.2);
      p5.pop();
    }
  }
}

export default CircularButton;
