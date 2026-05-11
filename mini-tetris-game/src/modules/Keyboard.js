export class Keyboard {
  constructor(game) {
    this.game = game;
    this.keys = {};
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  handleKeyDown(e) {
    if (this.keys[e.code]) return;
    this.keys[e.code] = true;

    switch (e.code) {
      case 'ArrowLeft':
        e.preventDefault();
        this.game.moveLeft();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.game.moveRight();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.game.moveDown();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.game.rotate();
        break;
      case 'Space':
        e.preventDefault();
        this.game.togglePause();
        break;
    }
  }

  handleKeyUp(e) {
    this.keys[e.code] = false;
  }
}
