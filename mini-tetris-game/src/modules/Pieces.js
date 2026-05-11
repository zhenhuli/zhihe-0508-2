export const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00f5ff'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#ffff00'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#a855f7'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: '#22c55e'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: '#ef4444'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#3b82f6'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#f97316'
  }
};

export const TETROMINO_KEYS = Object.keys(TETROMINOES);

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 24;

export function getRandomTetromino() {
  const key = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
  return {
    type: key,
    shape: TETROMINOES[key].shape.map(row => [...row]),
    color: TETROMINOES[key].color,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOES[key].shape[0].length / 2),
    y: 0
  };
}

export function rotateMatrix(matrix) {
  const N = matrix.length;
  const result = matrix.map((row, i) =>
    row.map((_, j) => matrix[N - 1 - j][i])
  );
  return result;
}
