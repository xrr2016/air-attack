export const GAME_STOP = 'GAME_STOP'
export const GAME_START = 'GAME_START'
export const GAME_PAUSE = 'GAME_PAUSE'
export const GAME_PLAYING = 'GAME_PLAYING'

export class Game {
  constructor (selector = 'air-attack', options = []) {
    this.init()
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
    this.objects = objects
    this.objects.forEach(obj => {
      obj.render(this.context)
    })
    this.status = GAME_START
  }

  render () {
    this.context.save()
    this.context.fillStyle = '#323232'
    this.context.fillRect(0, 0, this.width, this.height)
    this.context.restore()
  }

  update () {
    if (this.status === GAME_PAUSE || this.status === GAME_STOP) {
      return
    }
    this.clear()
    this.render()
    this.objects.forEach(obj => {
      obj.render(this.context)
    })
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
    console.log(this.status)
  }

  clear () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

export function newGame () {
  return new Game()
}
