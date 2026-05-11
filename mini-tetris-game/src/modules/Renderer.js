import { CELL_SIZE, BOARD_WIDTH, BOARD_HEIGHT } from './Pieces.js';

export class Renderer {
  constructor(canvas, nextCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nextCanvas = nextCanvas;
    this.nextCtx = nextCanvas.getContext('2d');
  }

  render(board, currentPiece, nextPiece) {
    this.clearBoard();
    this.drawBoard(board);
    this.drawPiece(currentPiece);
    this.drawNextPiece(nextPiece);
  }

  clearBoard() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;
    
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * CELL_SIZE, 0);
      this.ctx.lineTo(x * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
      this.ctx.stroke();
    }
    
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * CELL_SIZE);
      this.ctx.lineTo(BOARD_WIDTH * CELL_SIZE, y * CELL_SIZE);
      this.ctx.stroke();
    }
  }

  drawBoard(board) {
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        if (board.grid[y][x]) {
          this.drawCell(x, y, board.grid[y][x]);
        }
      }
    }
  }

  drawPiece(piece) {
    if (!piece) return;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const drawX = piece.x + x;
          const drawY = piece.y + y;
          if (drawY >= 0) {
            this.drawCell(drawX, drawY, piece.color);
          }
        }
      }
    }
  }

  drawCell(x, y, color) {
    const padding = 1;
    const size = CELL_SIZE - padding * 2;
    
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      x * CELL_SIZE + padding,
      y * CELL_SIZE + padding,
      size,
      size
    );
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(
      x * CELL_SIZE + padding,
      y * CELL_SIZE + padding,
      size,
      3
    );
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(
      x * CELL_SIZE + padding,
      y * CELL_SIZE + padding,
      3,
      size
    );
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(
      x * CELL_SIZE + padding + size - 3,
      y * CELL_SIZE + padding,
      3,
      size
    );
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(
      x * CELL_SIZE + padding,
      y * CELL_SIZE + padding + size - 3,
      size,
      3
    );
  }

  drawNextPiece(piece) {
    this.nextCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
    
    if (!piece) return;
    
    const pieceSize = 24;
    const padding = 2;
    const cellSize = pieceSize - padding * 2;
    
    const offsetX = (this.nextCanvas.width - piece.shape[0].length * pieceSize) / 2;
    const offsetY = (this.nextCanvas.height - piece.shape.length * pieceSize) / 2;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const drawX = offsetX + x * pieceSize + padding;
          const drawY = offsetY + y * pieceSize + padding;
          
          this.nextCtx.fillStyle = piece.color;
          this.nextCtx.fillRect(drawX, drawY, cellSize, cellSize);
          
          this.nextCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          this.nextCtx.fillRect(drawX, drawY, cellSize, 2);
          
          this.nextCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          this.nextCtx.fillRect(drawX, drawY, 2, cellSize);
        }
      }
    }
  }
}
