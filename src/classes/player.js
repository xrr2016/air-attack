import Base from './base'

class Player extends Base {
  constructor (opts = {}) {
    super(opts)
    this.showFlame = false
    this.rotate = opts.rotate || 0
  }

  render (context) {
    context.save()
    context.translate(this.x, this.y)
    context.rotate(this.rotation)

    context.lineWidth = 1
    context.strokeStyle = this.color

    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(this.width - 50, this.height)
    context.lineTo(0, this.height - 30)
    context.lineTo(-this.width + 50, this.height)
    context.closePath()
    context.stroke()

    if (this.showFlame) {
      context.beginPath()
      context.moveTo(-7.5, -5)
      context.lineTo(-15, 0)
      context.lineTo(-7.5, 5)
      context.stroke()
    }
    context.restore()
    this.move()
  }

  move () {
    this.x += this.vx
    this.y += this.vy
  }
}

export default Player
