class Sprite {
  constructor({ position, image, frames = { max: 1, hold: 10 }, sprites, animate = false  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elasped: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.width = this.image.height;
    };
    this.animate = animate
    this.sprites = sprites
  }
  draw() {
    c.drawImage(
      this.image,
      this.frames.val * 48,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
    if (!this.animate) {
      if (this.frames.max > 1) {
        this.frames.elasped++;
    }
  }
    if (this.frames.elasped % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
}

attack({attack, recipient}) {
  const tl = gsap.timeline()
  tl.to(this.position, {
    x: this.position.x - 50
  }).to(this.position, {
    x: this.position.x + 90
  }).to(this.position, {
    x: this.position.x
  })
}

}

class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
