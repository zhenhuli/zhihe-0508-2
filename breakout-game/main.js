const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let gameState = {
  level: 1,
  score: 0,
  lives: 3,
  isPlaying: false,
  isPaused: false
};

let paddle = {
  x: canvas.width / 2 - 60,
  y: canvas.height - 30,
  width: 120,
  height: 15,
  speed: 8,
  color: '#667eea',
  originalWidth: 120,
  widthTimer: 0
};

let balls = [];

let bricks = [];
const brickRowCount = 5;
const brickColumnCount = 10;
const brickWidth = 70;
const brickHeight = 25;
const brickPadding = 5;
const brickOffsetTop = 60;
const brickOffsetLeft = (canvas.width - (brickColumnCount * (brickWidth + brickPadding) - brickPadding)) / 2;

let powerUps = [];
const powerUpTypes = ['wide', 'multiBall'];
const powerUpColors = {
  wide: '#4ade80',
  multiBall: '#f472b6'
};

let wall = {
  y: brickOffsetTop + brickRowCount * (brickHeight + brickPadding) + 30,
  height: 20,
  gapWidth: 100,
  gapX: 0
};

function createBall() {
  return {
    x: paddle.x + paddle.width / 2,
    y: paddle.y - 12,
    radius: 10,
    dx: 5,
    dy: -5,
    color: '#ffffff',
    attached: balls.length === 0
  };
}

function initBalls() {
  balls = [createBall()];
}

const brickPatterns = [
  'standard',
  'pyramid',
  'xShape',
  'checkerboard',
  'border',
  'diamond',
  'random',
  'heart'
];

const patternNames = {
  'standard': '标准模式',
  'pyramid': '金字塔',
  'xShape': 'X形',
  'checkerboard': '棋盘格',
  'border': '边框',
  'diamond': '钻石',
  'random': '随机',
  'heart': '爱心'
};

function createBricks() {
  bricks = [];
  const patternIndex = (gameState.level - 1) % brickPatterns.length;
  const pattern = brickPatterns[patternIndex];
  const rows = brickRowCount + Math.floor(gameState.level / 2);
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
  
  switch (pattern) {
    case 'standard':
      createStandardBricks(rows, colors);
      break;
    case 'pyramid':
      createPyramidBricks(rows, colors);
      break;
    case 'xShape':
      createXShapeBricks(rows, colors);
      break;
    case 'checkerboard':
      createCheckerboardBricks(rows, colors);
      break;
    case 'border':
      createBorderBricks(rows, colors);
      break;
    case 'diamond':
      createDiamondBricks(rows, colors);
      break;
    case 'random':
      createRandomBricks(rows, colors);
      break;
    case 'heart':
      createHeartBricks(rows, colors);
      break;
  }
}

function createStandardBricks(rows, colors) {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < rows; r++) {
      const hits = r < 2 && gameState.level > 3 ? 2 : 1;
      bricks[c][r] = {
        x: c * (brickWidth + brickPadding) + brickOffsetLeft,
        y: r * (brickHeight + brickPadding) + brickOffsetTop,
        status: 1,
        color: colors[r % colors.length],
        hits: hits,
        maxHits: hits
      };
    }
  }
}

function createPyramidBricks(rows, colors) {
  const centerCol = Math.floor(brickColumnCount / 2);
  for (let r = 0; r < rows; r++) {
    for (let c = centerCol - r; c <= centerCol + r; c++) {
      if (c >= 0 && c < brickColumnCount) {
        if (!bricks[c]) bricks[c] = [];
        const hits = gameState.level > 2 ? 2 : 1;
        bricks[c][r] = {
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          status: 1,
          color: colors[r % colors.length],
          hits: hits,
          maxHits: hits
        };
      }
    }
  }
}

function createXShapeBricks(rows, colors) {
  const centerCol = Math.floor(brickColumnCount / 2);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < brickColumnCount; c++) {
      if (!bricks[c]) bricks[c] = [];
      if (c === centerCol - r || c === centerCol + r || c === r || c === brickColumnCount - 1 - r) {
        const hits = gameState.level > 2 ? 2 : 1;
        bricks[c][r] = {
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          status: 1,
          color: colors[r % colors.length],
          hits: hits,
          maxHits: hits
        };
      }
    }
  }
}

function createCheckerboardBricks(rows, colors) {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < rows; r++) {
      if ((c + r) % 2 === 0) {
        const hits = gameState.level > 3 ? 2 : 1;
        bricks[c][r] = {
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          status: 1,
          color: colors[(c + r) % colors.length],
          hits: hits,
          maxHits: hits
        };
      }
    }
  }
}

function createBorderBricks(rows, colors) {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < rows; r++) {
      if (c === 0 || c === brickColumnCount - 1 || r === 0 || r === rows - 1) {
        const hits = gameState.level > 2 ? 2 : 1;
        bricks[c][r] = {
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          status: 1,
          color: colors[Math.max(c, r) % colors.length],
          hits: hits,
          maxHits: hits
        };
      }
    }
  }
}

function createDiamondBricks(rows, colors) {
  const centerCol = Math.floor(brickColumnCount / 2);
  const centerRow = Math.floor(rows / 2);
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < rows; r++) {
      const distance = Math.abs(c - centerCol) + Math.abs(r - centerRow);
      if (distance <= Math.min(centerCol, centerRow)) {
        const hits = distance < 2 && gameState.level > 2 ? 2 : 1;
        bricks[c][r] = {
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          status: 1,
          color: colors[distance % colors.length],
          hits: hits,
          maxHits: hits
        };
      }
    }
  }
}

function createRandomBricks(rows, colors) {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < rows; r++) {
      if (Math.random() > 0.3) {
        const hits = Math.random() > 0.7 && gameState.level > 2 ? 2 : 1;
        bricks[c][r] = {
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          status: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          hits: hits,
          maxHits: hits
        };
      }
    }
  }
}

function createHeartBricks(rows, colors) {
  const centerCol = Math.floor(brickColumnCount / 2);
  const heartPattern = [
    '  XX  XX  ',
    ' XXXXXXXX ',
    ' XXXXXXXX ',
    '  XXXXXX  ',
    '   XXXX   ',
    '    XX    '
  ];
  
  for (let r = 0; r < Math.min(rows, heartPattern.length); r++) {
    const row = heartPattern[r];
    for (let c = 0; c < brickColumnCount; c++) {
      if (!bricks[c]) bricks[c] = [];
      const patternIndex = c - centerCol + Math.floor(row.length / 2);
      if (patternIndex >= 0 && patternIndex < row.length && row[patternIndex] === 'X') {
        const hits = gameState.level > 2 ? 2 : 1;
        bricks[c][r] = {
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          status: 1,
          color: colors[r % colors.length],
          hits: hits,
          maxHits: hits
        };
      }
    }
  }
}

function createPowerUp(x, y) {
  if (Math.random() < 0.2) {
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    powerUps.push({
      x: x,
      y: y,
      width: 30,
      height: 20,
      type: type,
      color: powerUpColors[type],
      dy: 3
    });
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 8);
  const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
  gradient.addColorStop(0, paddle.color);
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.closePath();
}

function drawBalls() {
  balls.forEach(ball => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 0, ball.x, ball.y, ball.radius);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#a5b4fc');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
  });
}

function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.status === 1) {
        ctx.beginPath();
        ctx.roundRect(brick.x, brick.y, brickWidth, brickHeight, 5);
        ctx.fillStyle = brick.color;
        ctx.fill();
        
        if (brick.hits > 1) {
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(brick.hits.toString(), brick.x + brickWidth / 2, brick.y + brickHeight / 2 + 5);
        }
        
        ctx.closePath();
      }
    });
  });
}

function drawPowerUps() {
  powerUps.forEach(powerUp => {
    ctx.beginPath();
    ctx.roundRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height, 5);
    ctx.fillStyle = powerUp.color;
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    const text = powerUp.type === 'wide' ? 'W' : 'M';
    ctx.fillText(text, powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2 + 4);
    ctx.closePath();
  });
}

function drawWall() {
  ctx.beginPath();
  ctx.rect(0, wall.y, wall.gapX, wall.height);
  ctx.rect(wall.gapX + wall.gapWidth, wall.y, canvas.width - wall.gapX - wall.gapWidth, wall.height);
  const gradient = ctx.createLinearGradient(0, wall.y, 0, wall.y + wall.height);
  gradient.addColorStop(0, '#6b7280');
  gradient.addColorStop(0.5, '#9ca3af');
  gradient.addColorStop(1, '#6b7280');
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.closePath();
}

function movePaddle(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  paddle.x = mouseX - paddle.width / 2;
  
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

function wallCollision(ball) {
  if (ball.y + ball.radius > wall.y &&
      ball.y - ball.radius < wall.y + wall.height) {
    if (ball.x < wall.gapX || ball.x > wall.gapX + wall.gapWidth) {
      if (ball.dy > 0) {
        ball.y = wall.y - ball.radius;
      } else {
        ball.y = wall.y + wall.height + ball.radius;
      }
      ball.dy = -ball.dy;
    }
  }
}

function collisionDetection() {
  balls.forEach(ball => {
    if (!ball.attached) {
      wallCollision(ball);
    }
    
    bricks.forEach(column => {
      column.forEach(brick => {
        if (brick.status === 1) {
          if (ball.x + ball.radius > brick.x &&
              ball.x - ball.radius < brick.x + brickWidth &&
              ball.y + ball.radius > brick.y &&
              ball.y - ball.radius < brick.y + brickHeight) {
            ball.dy = -ball.dy;
            brick.hits--;
            
            if (brick.hits <= 0) {
              brick.status = 0;
              gameState.score += 10 * gameState.level;
              updateScore();
              createPowerUp(brick.x + brickWidth / 2, brick.y + brickHeight / 2);
            }
          }
        }
      });
    });
  });
}

function checkWin() {
  let remainingBricks = 0;
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.status === 1) remainingBricks++;
    });
  });
  
  if (remainingBricks === 0) {
    gameState.level++;
    updateLevel();
    nextLevel();
  }
}

function updateWallPosition() {
  const rows = brickRowCount + Math.floor(gameState.level / 2);
  wall.y = brickOffsetTop + rows * (brickHeight + brickPadding) + 20;
}

function nextLevel() {
  createBricks();
  initBalls();
  paddle.width = paddle.originalWidth;
  powerUps = [];
  updateWallPosition();
  wall.gapX = Math.random() * (canvas.width - wall.gapWidth - 40) + 20;
  wall.gapWidth = Math.max(60, 100 - gameState.level * 5);
}

function updateScore() {
  document.getElementById('score').textContent = gameState.score;
}

function updateLevel() {
  document.getElementById('level').textContent = gameState.level;
  const patternIndex = (gameState.level - 1) % brickPatterns.length;
  document.getElementById('patternName').textContent = patternNames[brickPatterns[patternIndex]];
}

function changeLevel(delta) {
  const newLevel = gameState.level + delta;
  if (newLevel >= 1) {
    gameState.level = newLevel;
    gameState.score = 0;
    updateLevel();
    updateScore();
    createBricks();
    initBalls();
    paddle.width = paddle.originalWidth;
    powerUps = [];
    wall.gapX = Math.random() * (canvas.width - wall.gapWidth - 40) + 20;
    wall.gapWidth = Math.max(60, 100 - gameState.level * 5);
  }
}

function updateLives() {
  document.getElementById('lives').textContent = gameState.lives;
}

function activatePowerUp(type) {
  if (type === 'wide') {
    paddle.width = paddle.originalWidth * 1.5;
    paddle.widthTimer = 300;
  } else if (type === 'multiBall') {
    const newBalls = [];
    balls.forEach(ball => {
      const ball1 = {...ball, dx: ball.dx + 1, dy: ball.dy - 1, attached: false};
      const ball2 = {...ball, dx: ball.dx - 1, dy: ball.dy + 1, attached: false};
      newBalls.push(ball1, ball2);
    });
    balls.push(...newBalls);
  }
}

function update() {
  if (!gameState.isPlaying || gameState.isPaused) return;
  
  if (paddle.widthTimer > 0) {
    paddle.widthTimer--;
    if (paddle.widthTimer === 0) {
      paddle.width = paddle.originalWidth;
    }
  }
  
  balls.forEach((ball, index) => {
    if (ball.attached) {
      ball.x = paddle.x + paddle.width / 2;
      ball.y = paddle.y - ball.radius;
    } else {
      ball.x += ball.dx * (1 + gameState.level * 0.1);
      ball.y += ball.dy * (1 + gameState.level * 0.1);
      
      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
      }
      if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }
      
      if (ball.y + ball.radius > paddle.y &&
          ball.y - ball.radius < paddle.y + paddle.height &&
          ball.x > paddle.x &&
          ball.x < paddle.x + paddle.width) {
        ball.dy = -Math.abs(ball.dy);
        const hitPos = (ball.x - paddle.x) / paddle.width;
        ball.dx = (hitPos - 0.5) * 10;
      }
      
      if (ball.y + ball.radius > canvas.height) {
        balls.splice(index, 1);
        if (balls.length === 0) {
          gameState.lives--;
          updateLives();
          
          if (gameState.lives <= 0) {
            gameOver();
          } else {
            initBalls();
          }
        }
      }
    }
  });
  
  powerUps.forEach((powerUp, index) => {
    if (powerUp.y + powerUp.height > wall.y &&
        powerUp.y < wall.y + wall.height) {
      if (powerUp.x < wall.gapX || powerUp.x + powerUp.width > wall.gapX + wall.gapWidth) {
        powerUps.splice(index, 1);
        return;
      }
    }
    
    powerUp.y += powerUp.dy;
    
    if (powerUp.y > canvas.height) {
      powerUps.splice(index, 1);
    }
    
    if (powerUp.y + powerUp.height > paddle.y &&
        powerUp.y < paddle.y + paddle.height &&
        powerUp.x + powerUp.width > paddle.x &&
        powerUp.x < paddle.x + paddle.width) {
      activatePowerUp(powerUp.type);
      powerUps.splice(index, 1);
    }
  });
  
  collisionDetection();
  checkWin();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawWall();
  drawPaddle();
  drawBalls();
  drawPowerUps();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function gameOver() {
  gameState.isPlaying = false;
  document.getElementById('overlayTitle').textContent = '游戏结束';
  document.getElementById('overlayMessage').textContent = `最终分数: ${gameState.score}`;
  document.getElementById('gameOverlay').classList.remove('hidden');
}

function startGame() {
  gameState.level = 1;
  gameState.score = 0;
  gameState.lives = 3;
  gameState.isPlaying = true;
  
  updateLevel();
  updateScore();
  updateLives();
  
  paddle.x = canvas.width / 2 - paddle.width / 2;
  paddle.width = paddle.originalWidth;
  powerUps = [];
  wall.gapX = canvas.width / 2 - 50;
  wall.gapWidth = 100;
  
  createBricks();
  initBalls();
  
  document.getElementById('gameOverlay').classList.add('hidden');
}

document.getElementById('startBtn').addEventListener('click', startGame);

document.getElementById('prevLevel').addEventListener('click', () => changeLevel(-1));
document.getElementById('nextLevel').addEventListener('click', () => changeLevel(1));

canvas.addEventListener('mousemove', movePaddle);

canvas.addEventListener('click', () => {
  if (gameState.isPlaying) {
    balls.forEach(ball => {
      if (ball.attached) {
        ball.attached = false;
      }
    });
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && gameState.isPlaying) {
    balls.forEach(ball => {
      if (ball.attached) {
        ball.attached = false;
      }
    });
  }
});

createBricks();
initBalls();
wall.gapX = canvas.width / 2 - 50;
gameLoop();