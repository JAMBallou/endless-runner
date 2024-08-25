import { Dust, Fire, Splash } from "./particle.js";

const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
};

class State {
  constructor(state, game) {
    this.state = state;
    this.game = game;
  }
}

export class Sitting extends State {
  constructor(game) {
    super("SITTING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.frames = 4;
    this.game.player.frameY = 5;
  }

  handleInput(keys) {
    if (keys.includes("ArrowLeft") || keys.includes("ArrowRight")) this.game.player.setState(states.RUNNING);
    else if (keys.includes(" ")) this.game.player.setState(states.ROLLING, 2);
    if (keys.includes("ArrowUp")) this.game.player.setState(states.JUMPING);
  }
}

export class Running extends State {
  constructor(game) {
    super("RUNNING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.frames = 8; 
    this.game.player.frameY = 3;
  }

  handleInput(keys) {
    this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.3, this.game.player.y + this.game.player.height));
    if (keys.includes("ArrowDown")) this.game.player.setState(states.SITTING, 0);
    if (keys.includes("ArrowUp")) this.game.player.setState(states.JUMPING);
    else if (keys.includes(" ")) this.game.player.setState(states.ROLLING, 2);
  }
}

export class Jumping extends State {
  constructor(game) {
    super("JUMPING", game);
  }

  enter() {
    if (this.game.player.onGround()) this.game.player.vy -= 25;
    this.game.player.frameX = 0;
    this.game.player.frames = 6;
    this.game.player.frameY = 1;
  }

  handleInput(keys) {
    if (this.game.player.vy > this.game.player.gravity) this.game.player.setState(states.FALLING);
    else if (keys.includes(" ")) this.game.player.setState(states.ROLLING, 2);
    else if (keys.includes("ArrowDown") && !this.game.player.onGround()) this.game.player.setState(states.DIVING, 0);
  }
}

export class Falling extends State {
  constructor(game) {
    super("FALLING", game);
  }

  enter() {
    if (this.game.player.onGround()) this.game.player.vy -= 27;
    this.game.player.frameX = 0;
    this.game.player.frames = 6;
    this.game.player.frameY = 2;
  }

  handleInput(keys) {
    if (this.game.player.onGround()) this.game.player.setState(states.RUNNING);
    else if (keys.includes("ArrowDown")) this.game.player.setState(states.DIVING, 0);
  }
}

export class Rolling extends State {
  constructor(game) {
    super("ROLLING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.frames = 6;
    this.game.player.frameY = 6;
  }

  handleInput(keys) {
    this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
    if (!keys.includes(" ") && this.game.player.onGround()) this.game.player.setState(states.RUNNING);
    else if (!keys.includes(" ") && !this.game.player.onGround()) this.game.player.setState(states.FALLING);
    else if (keys.includes(" ") && keys.includes("ArrowUp") && this.game.player.onGround()) this.game.player.vy -= 27;
    else if (keys.includes("ArrowDown") && !this.game.player.onGround()) this.game.player.setState(states.DIVING, 0);
  }
}

export class Diving extends State {
  constructor(game) {
    super("DIVING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.frames = 6;
    this.game.player.frameY = 6;
    this.game.player.vy = 20;
  }

  handleInput(keys) {
    this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
    if (this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING);
      for (let i = 0; i < 30; ++i) {
        this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width, this.game.player.y + this.game.player.height));
      }
    }
    else if (keys.includes(" ") && this.game.player.onGround()) this.game.player.setState(states.ROLLING, 2);
  }
}

export class Hit extends State {
  constructor(game) {
    super("HIT", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.frames = 10;
    this.game.player.frameY = 4;
  }

  handleInput(keys) {
    if (this.game.player.frameX >= 10 && this.game.player.onGround()) this.game.player.setState(states.RUNNING);
    else if (this.game.player.frameX >= 10 && !this.game.player.onGround()) this.game.player.setState(states.FALLING, 2);
  }
}