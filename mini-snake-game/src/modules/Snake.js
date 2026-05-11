export class Snake {
  constructor(canvasWidth, canvasHeight, gridSize = 20) {
    this.gridSize = gridSize
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.reset()
  }

  reset() {
    const centerX = Math.floor(this.canvasWidth / this.gridSize / 2)
    const centerY = Math.floor(this.canvasHeight / this.gridSize / 2)
    
    this.segments = [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY }
    ]
    this.direction = { x: 1, y: 0 }
    this.nextDirection = { x: 1, y: 0 }
  }

  setDirection(x, y) {
    if (
      (this.direction.x === 0 && x !== 0) ||
      (this.direction.y === 0 && y !== 0)
    ) {
      this.nextDirection = { x, y }
    }
  }

  move() {
    this.direction = this.nextDirection
    
    const head = { x: this.segments[0].x + this.direction.x, y: this.segments[0].y + this.direction.y }
    this.segments.unshift(head)
    this.segments.pop()
  }

  grow() {
    const tail = { ...this.segments[this.segments.length - 1] }
    this.segments.push(tail)
  }

  checkCollision() {
    const head = this.segments[0]
    
    if (
      head.x < 0 ||
      head.x >= this.canvasWidth / this.gridSize ||
      head.y < 0 ||
      head.y >= this.canvasHeight / this.gridSize
    ) {
      return true
    }

    for (let i = 1; i < this.segments.length; i++) {
      if (head.x === this.segments[i].x && head.y === this.segments[i].y) {
        return true
      }
    }

    return false
  }

  getHead() {
    return this.segments[0]
  }

  getSegments() {
    return this.segments
  }

  getLength() {
    return this.segments.length
  }
}