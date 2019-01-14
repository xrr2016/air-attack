import { newGame } from './classes/game'
import Player from './classes/player'
import Block from './classes/block'

import { randomColor } from './utils/index'

const game = newGame()

const playerOpts = {
  x: game.width / 2,
  y: game.height - 40,
  vx: 1,
  vy: 1,
  width: 15,
  height: 15,
  speed: 4,
  rotation: 0,
  color: '#333',
  canvas: game.canvas,
  context: game.context
}
const player = new Player(playerOpts)

const gameObjects = []
gameObjects.push(player)

for (let index = 0; index < 100; index++) {
  const block = new Block({
    id: `block-${index}`,
    x: Math.random() * game.width,
    y: Math.random() * game.height,
    vx: Math.random() > 0.5 ? Math.random() : -Math.random(),
    vy: Math.random() > 0.5 ? Math.random() : -Math.random(),
    vr: Math.random() * Math.PI,
    width: Math.random() * 5 + 5,
    height: Math.random() * 5 + 5,
    rotation: 0,
    color: randomColor(),
    canvas: game.canvas,
    context: game.context
  })
  gameObjects.push(block)
}

game.start(gameObjects)

let raf = null

function draw (raf) {
  game.update()
  raf = window.requestAnimationFrame(draw)
}

window.addEventListener('keyup', event => {
  const keyCode = event.keyCode

  switch (keyCode) {
    case 32:
      game.toggle(raf)
      break
  }
})

draw(raf)
