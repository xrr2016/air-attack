import { newGame } from './classes/game'
import Player from './classes/player'

const game = newGame()
const playerOpts = {
  x: game.width / 2,
  y: game.height - 120,
  vx: 0,
  vy: -5,
  color: 'white'
}
const player = new Player(playerOpts)
const objects = []

objects.push(player)
game.start(objects)

let raf = null

function draw (raf) {
  game.update()
  raf = window.requestAnimationFrame(draw)
}

draw(raf)

window.addEventListener('keyup', event => {
  const keyCode = event.keyCode

  switch (keyCode) {
    case 32:
      game.toggle(raf)
      break
    case 37:
      break
    case 39:
      break
    case 38:
      break
    case 40:
      break
  }
})
