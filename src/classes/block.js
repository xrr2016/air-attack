import Base from './base'

class Block extends Base {
  constructor (opts = {}) {
    super(opts)
    this.id = opts.id
    this.type = 'block'
    this.isMoving = false
    this.game = {}
    this.game.left = 0
    this.game.right = this.canvas.width
    this.game.top = 0
    this.game.bottom = this.canvas.height
  }

  render () {
    this.context.save()
    this.context.translate(this.x, this.y)
    this.context.rotate(this.rotation)
    this.context.lineWidth = 1.5
    this.context.strokeStyle = this.color
    this.context.beginPath()
    this.context.moveTo(this.width, this.height)
    this.context.lineTo(this.width, -this.height)
    this.context.lineTo(-this.width, -this.height)
    this.context.lineTo(-this.width, this.height)
    this.context.closePath()
    this.context.stroke()
    this.context.restore()
    this.update()
    this.borderWrap()
  }

  update () {
    this.x += this.vx
    this.y += this.vy
    this.rotation += this.vr
    this.isMoving = true
  }

  borderWrap () {
    if (this.x - this.width > this.game.right) {
      this.x = this.game.left - this.width
    } else if (this.x + this.width < this.game.left) {
      this.x = this.game.right + this.width
    }
    if (this.y - this.height > this.game.bottom) {
      this.y = this.game.top - this.height
    } else if (this.y + this.height < this.game.top) {
      this.y = this.game.bottom + this.height
    }
  }
}

export default Block
