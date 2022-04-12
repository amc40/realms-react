import p5 from "p5";

class Unit {
  unselectedImage: p5.Image;
  selectedImage: p5.Image;
  selected: boolean = false;

  constructor(p5: p5) {
    this.unselectedImage = p5.loadImage(
      "assets/shields/shield-blue-unselected.png"
    );
    this.selectedImage = p5.loadImage(
      "assets/shields/shield-blue-selected.png"
    );
  }

  toggleSelected() {
    this.selected = !this.selected;
    return this.selected;
  }

  draw(p5: p5) {
    p5.imageMode(p5.CENTER);
    if (this.selected) {
      p5.image(this.selectedImage, 0, 0, 30, 30);
    } else {
      p5.image(this.unselectedImage, 0, 0, 30, 30);
    }
  }
}

export default Unit;
