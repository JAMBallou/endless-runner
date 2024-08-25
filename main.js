import Player from "./player.js";
import InputHandler from "./input.js";
import Background from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";
import UI from "./ui.js";

window.addEventListener("load", () => {
  const ctx = canvas.getContext("2d");
  canvas.width = 900;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.speed = 0;
      this.maxSpeed = 4;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.messages = [];
      this.maxParticles = 100;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = false;
      this.score = 0;
      this.winningScore = 50;
      this.fontColor = "black";
      this.time = 0;
      this.maxTime = 30000;
      this.lives = 5;
      this.livesImg = livesImg;
      this.gameOver = false;
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }

    update(deltaTime) {
      this.time += deltaTime;
      if (this.time > this.maxTime) this.gameOver = true;

      this.background.update();
      this.player.update(this.input.keys, deltaTime);
      
      // handle enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((e) => {
        e.update(deltaTime);
        if (e.delete) this.enemies.splice(this.enemies.indexOf(e), 1)
      });

      // handle particles
      this.particles.forEach((p, idx) => p.update());
      this.particles = this.particles.filter((p) => !p.delete);
      if (this.particles.length > this.maxParticles) this.particles.length = this.maxParticles;

      // handle messages
      this.messages.forEach((m) => m.update());
      this.messages = this.messages.filter((m) => !m.delete);

      // handle collision
      this.collisions.forEach((c, idx) => c.update(deltaTime));
      this.collisions = this.collisions.filter((c) => !c.delete)
    }

    draw(ctx) { 
      this.background.draw(ctx);
      this.player.draw(ctx);
      this.enemies.forEach((e) => e.draw(ctx));
      this.particles.forEach((p) => p.draw(ctx));
      this.collisions.forEach((c) => c.draw(ctx));
      this.messages.forEach((m) => m.draw(ctx));
      this.ui.draw(ctx);
    }

    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      this.enemies.push(new FlyingEnemy(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  function animate(timeStamp) {
    // time each frame is on the screen (time between animation loops)
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);

    if (!game.gameOver) requestAnimationFrame(animate);
  }
  animate(0);
});