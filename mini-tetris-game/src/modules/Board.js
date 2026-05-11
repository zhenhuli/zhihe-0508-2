import { BOARD_WIDTH, BOARD_HEIGHT } from './Pieces.js';

export class Board {
  constructor() {
    this.width = BOARD_WIDTH;
    this.height = BOARD_HEIGHT;
    this.grid = this.createEmptyGrid();
  }

  createEmptyGrid() {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => null)
    );
  }

  reset() {
    this.grid = this.createEmptyGrid();
  }

  isValidPosition(piece) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x;
          const newY = piece.y + y;

          if (newX < 0 || newX >= this.width || newY >= this.height) {
            return false;
          }

          if (newY >= 0 && this.grid[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  placePiece(piece) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const gridY = piece.y + y;
          const gridX = piece.x + x;
          if (gridY >= 0) {
            this.grid[gridY][gridX] = piece.color;
          }
        }
      }
    }
  }

  clearLines() {
    let linesCleared = 0;
    
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.isLineComplete(y)) {
        this.removeLine(y);
        linesCleared++;
        y++;
      }
    }

    return linesCleared;
  }

  isLineComplete(y) {
    return this.grid[y].every(cell => cell !== null);
  }

  removeLine(y) {
    this.grid.splice(y, 1);
    this.grid.unshift(Array.from({ length: this.width }, () => null));
  }
}
