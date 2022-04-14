import p5 from "p5";

class CircularButton {
  private onClick: () => void;
  private x: number;
  private y: number;
  private radius: number;
  private centre: p5.Vector;
  private icon: p5.Image;

  constructor(
    onClick: () => void,
    x: number,
    y: number,
    radius: number,
    p5: p5,
    icon: p5.Image
  ) {
    this.onClick = onClick;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.centre = p5.createVector(x, y);
    this.icon = icon;
  }

  handleClick(p5: p5, mouseX: number, mouseY: number): boolean {
    const centreToMouse = p5.createVector(mouseX, mouseY).sub(this.centre);
    const distance = centreToMouse.mag();
    if (distance < this.radius) {
      this.onClick();
      return true;
    }
    return false;
  }

  draw(p5: p5) {
    p5.push();
    p5.ellipseMode(p5.CENTER);
    p5.ellipse(this.x, this.y, this.radius * 2, this.radius);
    p5.textSize(16);
    // p5.textAlign(p5.CENTER, p5.CENTER);
    // p5.text("Next Turn", this.x, this.y);
    p5.imageMode(p5.CENTER);
    p5.image(this.icon, this.x, this.y, this.radius * 1.5, this.radius * 1.5);
    p5.pop();
  }
}

export default CircularButton;
