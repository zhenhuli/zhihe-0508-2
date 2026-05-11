export class Food {
  constructor(canvasWidth, canvasHeight, gridSize = 20) {
    this.gridSize = gridSize
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.position = { x: 0, y: 0 }
    this.generate()
  }

  generate(snakeSegments = []) {
    let validPosition = false
    let attempts = 0
    const maxAttempts = 100

    while (!validPosition && attempts < maxAttempts) {
      const x = Math.floor(Math.random() * (this.canvasWidth / this.gridSize))
      const y = Math.floor(Math.random() * (this.canvasHeight / this.gridSize))

      validPosition = !snakeSegments.some(segment => segment.x === x && segment.y === y)

      if (validPosition) {
        this.position = { x, y }
      }

      attempts++
    }
  }

  getPosition() {
    return this.position
  }
}