const scoreAudio = new Audio('/src/assets/dingmp3.mp3')
scoreAudio.volume = 1

export const GAME_STOP = 'GAME_STOP'
export const GAME_START = 'GAME_START'
export const GAME_PAUSE = 'GAME_PAUSE'
export const GAME_PLAYING = 'GAME_PLAYING'

export class Game {
  constructor (selector = 'air-attack', options = []) {
    this.init()
    this.score = 0
    this.status = GAME_STOP
  }

  init () {
    const { devicePixelRatio, innerWidth, innerHeight } = window
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const width = (canvas.width = innerWidth * devicePixelRatio)
    const height = (canvas.height = innerHeight * devicePixelRatio)

    canvas.style.width = innerWidth + 'px'
    canvas.style.height = innerHeight + 'px'

    this.canvas = canvas
    this.context = context
    this.width = width
    this.height = height
    document.body.insertBefore(this.canvas, document.body.firstElementChild)
  }

  start (objects = []) {
    this.render()
    this.renderSore()
    this.objects = objects
    this.objects.forEach(obj => {
      obj.render(this.context)
    })
    this.status = GAME_START
  }

  render () {
    this.context.save()
    this.context.fillStyle = '#f2f3f4'
    this.context.fillRect(0, 0, this.width, this.height)
    this.context.restore()
  }

  renderSore () {
    this.context.save()
    this.context.font = '22px sans-serif'
    this.context.fillStyle = '#323232'
    this.context.fillText(`SCORE: ${this.score}`, this.width - 160, 40)
    this.context.restore()
  }

  update () {
    if (this.status === GAME_PAUSE || this.status === GAME_STOP) {
      return
    }
    this.clear()
    this.render()
    this.renderSore()
    this.objects.forEach(obj => {
      obj.render(this.context)
    })
    this.collisionDetect()
  }

  stop () {
    this.clear()
    this.status = GAME_STOP
    console.log(this.status)
  }

  toggle (raf) {
    if (this.status === GAME_PLAYING || this.status === GAME_START) {
      this.status = GAME_PAUSE
      window.cancelAnimationFrame(raf)
    } else {
      this.status = GAME_PLAYING
    }
  }

  clear () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  collisionDetect () {
    const self = this
    const player = this.objects[0]
    const blocks = this.objects.slice(1)

    if (blocks.length <= 0) {
      alert('YOU WIN!')
    }

    function remove (block) {
      const index = self.objects.findIndex(b => b.id === block.id)
      self.objects.splice(index, 1)
    }

    blocks.forEach(block => {
      const dx = block.x - player.x
      const dy = block.y - player.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < player.width + block.width) {
        self.score += 10
        scoreAudio.play()
        remove(block)
      }
    })
  }
}

export function newGame () {
  return new Game()
}
