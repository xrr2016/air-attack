import Base from './base'

class Player extends Base {
  constructor (opts = {}) {
    super(opts)
    this.bindEvent()
    this.type = 'player'
    this.newX = this.x
    this.newY = this.y
    this.isMoving = false
    this.movePath = false
    this.speed = opts.speed
    this.destinations = []
  }

  render () {
    if (this.isMoving) {
      this.showDash()
      this.showFlame()
    }

    if (this.destinations.length) {
      this.showDash()
    }

    this.move()
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
    this.context.restore()
    this.stop()
  }

  showDash () {
    this.context.save()
    this.context.lineWidth = 0.5
    this.context.strokeStyle = '#666'
    this.context.fillStyle = '#666'
    this.context.setLineDash([5, 10])

    if (this.destinations.length) {
      const dests = this.destinations
      this.context.moveTo(this.x, this.y)
      this.context.lineTo(dests[0].x, dests[0].y)
      this.context.stroke()
      this.context.beginPath()
      this.context.arc(dests[0].x, dests[0].y, 3, 0, Math.PI * 2)
      this.context.fill()

      for (let index = 0; index < dests.length - 1; index++) {
        this.context.beginPath()
        this.context.moveTo(dests[index].x, dests[index].y)
        this.context.lineTo(dests[index + 1].x, dests[index + 1].y)
        this.context.stroke()
        this.context.beginPath()
        this.context.arc(dests[index + 1].x, dests[index + 1].y, 3, 0, Math.PI * 2)
        this.context.fill()
      }
    } else {
      this.context.beginPath()
      this.context.moveTo(this.x, this.y)
      this.context.lineTo(this.newX, this.newY)
      this.context.stroke()
    }
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
    if (this.movePath && this.destinations.length) {
      const dests = this.destinations
      this.x += this.vx
      this.y += this.vy
    } else {
      this.x += this.vx
      this.y += this.vy
    }
  }

  stop () {
    if (
      (this.vx > 0 && this.x >= this.newX) ||
      (this.vx < 0 && this.x <= this.newX) ||
      (this.vy > 0 && this.y >= this.newY) ||
      (this.vy < 0 && this.y <= this.newY)
    ) {
      this.x = this.newX
      this.y = this.newY
      this.isMoving = false
    }
  }

  bindEvent () {
    this.canvas.addEventListener(
      'click',
      event => {
        const speed = this.speed
        const { offsetX, offsetY } = event

        this.newX = offsetX
        this.newY = offsetY
        const dx = offsetX - this.x
        const dy = offsetY - this.y
        const angle = Math.atan2(dy, dx)
        this.vx = speed * Math.cos(angle)
        this.vy = speed * Math.sin(angle)
        this.isMoving = true
      },
      false
    )

    this.canvas.addEventListener(
      'contextmenu',
      event => {
        event.preventDefault()

        const speed = this.speed
        const { offsetX, offsetY } = event
        const dx = offsetX - this.x
        const dy = offsetY - this.y
        const angle = Math.atan2(dy, dx)
        const dist = Math.sqrt(dx * dx, dy * dy)
        const spend = dist / speed

        this.destinations.push({
          speed,
          x: offsetX,
          y: offsetY,
          angle: Math.atan2(dy, dx),
          vx: speed * Math.cos(angle),
          vy: speed * Math.sin(angle)
        })
      },
      false
    )

    this.canvas.addEventListener(
      'mousemove',
      event => {
        const { offsetX, offsetY } = event
        const dx = offsetX - this.x
        const dy = offsetY - this.y
        this.rotation = Math.atan2(dy, dx) + Math.PI / 2
      },
      false
    )

    document.addEventListener(
      'keypress',
      event => {
        if (event.key === 'Enter') {
          this.movePath = true
        }
      },
      false
    )
  }
}

export default Player
