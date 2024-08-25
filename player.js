import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./state.js";
import Collision from "./collision.js";
import Message from "./message.js";

export default class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.gravity = 1;
    this.image = player;
    this.frameX = 0;
    this.frameY = 0;
    this.frames;
    this.fps = 20;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
    this.speed = 0;
    this.maxSpeed = 10;
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game),
    ];
    this.currentState = null;
  }

  update(keys, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(keys);
    
    // horizontal movement
    this.x += this.speed
    // player can move left and right in all states
    if (keys.includes("ArrowRight") && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
    else if (keys.includes("ArrowLeft") && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
    else this.speed = 0;
    // horizontal boundaries
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width) this.x = this.game.width - this.width; 

    // vertical movement
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.gravity;
    else this.vy = 0;
    // vertical boundaries
    if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;

    // sprite animation
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX < this.frames) this.frameX++;
      else this.frameX = 0;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }

  draw(ctx) {
    if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state, speed = 1) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }

  checkCollision() {
    this.game.enemies.forEach((e) => {
      if (e.x < this.x + this.width &&
          e.x + e.width > this.x &&
          e.y < this.y + this.height && 
          e.y + e.height > this.y) {
        // collision detected
        e.delete = true;
        this.game.collisions.push(new Collision(this.game, e.x + e.width * 0.5, e.y + e.height * 0.5))
        if (this.currentState === this.states[4] || this.currentState === this.states[5]) {
          this.game.score++;
          this.game.messages.push(new Message("+1", e.x, e.y, 150, 50));
        } else {
          this.setState(6, 0);
          this.game.score -= 5;
          this.game.lives--;
          if (this.game.lives <= 0) this.game.gameOver = true;
        }
      }
    });
  }
}