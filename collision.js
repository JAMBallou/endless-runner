export default class Collision {
  constructor(game, x, y) {
    this.game = game;
    this.image = boomImg;
    this.spriteWidth = 100;
    this.spriteHeight = 90;
    this.sizeModifier = Math.random() + 0.5;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
    this.frame = 0;
    this.frames = 4;
    this.fps = Math.random() * 10 + 5;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
    this.delete = false;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, 100, 90, this.x, this.y, this.width, this.height);
  }

  update(deltaTime) {
    this.x -= this.game.speed;
    if (this.frameTimer > this.frameInterval) {
      this.frame++;
      if (this.frameX > this.frames) this.delete = true;
    } else {
      this.frameTimer += deltaTime
    }
  }
}