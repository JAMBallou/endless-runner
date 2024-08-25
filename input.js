export default class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];

    window.addEventListener("keydown", (evt) => {
      if (( evt.key === "ArrowDown" || 
            evt.key === "ArrowUp" ||
            evt.key === "ArrowLeft" ||
            evt.key === "ArrowRight" ||
            evt.key === " "
          ) && this.keys.indexOf(evt.key) === -1) {
        this.keys.push(evt.key);
      } else if (evt.key === "d") this.game.debug = !this.game.debug;
    });

    window.addEventListener("keyup", (evt) => {
      if (  evt.key === "ArrowDown" || 
            evt.key === "ArrowUp" ||
            evt.key === "ArrowLeft" ||
            evt.key === "ArrowRight" ||
            evt.key === " ") {
        this.keys.splice(this.keys.indexOf(evt.key, 1));
      }
    });
  }
}