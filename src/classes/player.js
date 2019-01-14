import Base from './base'

class Player extends Base {
  constructor (opts = {}) {
    super(opts)
    this.bindEvent()
    this.type = 'player'
    this.newX = this.x
    this.newY = this.y
    this.isMoving = false
    this.isShouldMove = false
    this.speed = opts.speed
  }

  render () {
    if (this.isShouldMove) {
      this.showDash()
      this.move()
    }

    this.context.save()
    this.context.translate(this.x, this.y)
    this.context.rotate(this.rotation)
    this.context.lineWidth = 1
    this.context.fillStyle = this.color
    this.context.beginPath()
    this.context.moveTo(0, 0)
    this.context.lineTo(this.width - 2, this.height + 2)
    this.context.lineTo(0, this.height - 1)
    this.context.lineTo(-this.width + 2, this.height + 2)
    this.context.closePath()
    this.context.fill()

    if (this.isMoving) {
      this.showFlame()
    }

    this.context.restore()
    this.stop()
  }

  showDash () {
    this.context.save()
    this.context.beginPath()
    this.context.lineWidth = 0.5
    this.context.strokeStyle = this.color
    this.context.setLineDash([5, 10])
    this.context.moveTo(this.x, this.y)
    this.context.lineTo(this.newX, this.newY)
    this.context.arc(this.newX, this.newY, 4, 0, Math.PI * 2)
    this.context.stroke()
    this.context.restore()
  }

  showFlame () {
    this.context.beginPath()
    this.context.moveTo(this.width / 2, this.height - 3)
    this.context.lineTo(0, this.height + 3)
    this.context.lineTo(-this.width / 2, this.height - 3)
    this.context.stroke()
  }

  move () {
    const dx = this.newX - this.x
    const dy = this.newY - this.y
    const distance = Math.sqrt(dx * dx, dy * dy)
    const moveTime = distance / this.speed

    this.vx = dx / moveTime
    this.vy = dy / moveTime

    this.x += this.vx
    this.y += this.vy
    this.isMoving = true
  }

  stop () {
    if (
      (this.vx > 0 && this.x >= this.newX) ||
      (this.vx < 0 && this.x <= this.newX) ||
      (this.vy > 0 && this.y >= this.newY) ||
      (this.vy < 0 && this.y <= this.newY)
    ) {
      this.isShouldMove = false
      this.isMoving = false
      this.x = this.newX
      this.y = this.newY
    }
  }

  bindEvent () {
    this.canvas.addEventListener('click', event => {
      const { offsetX, offsetY } = event
      this.newX = offsetX
      this.newY = offsetY
      this.isShouldMove = true
      this.move()
    })

    this.canvas.addEventListener('mousemove', event => {
      const { offsetX, offsetY } = event
      const dx = offsetX - this.x
      const dy = offsetY - this.y
      this.rotation = Math.atan2(dy, dx) + Math.PI / 2
    })
  }
}

export default Player
