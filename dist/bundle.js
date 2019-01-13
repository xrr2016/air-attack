(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  const GAME_STOP = 'GAME_STOP';
  const GAME_START = 'GAME_START';
  const GAME_PAUSE = 'GAME_PAUSE';
  const GAME_PLAYING = 'GAME_PLAYING';

  class Game {
    constructor (selector = 'air-attack', options = []) {
      this.init();
      this.status = GAME_STOP;
    }

    init () {
      const { devicePixelRatio, innerWidth, innerHeight } = window;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const width = (canvas.width = innerWidth * devicePixelRatio);
      const height = (canvas.height = innerHeight * devicePixelRatio);

      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';

      this.canvas = canvas;
      this.context = context;
      this.width = width;
      this.height = height;
      document.body.insertBefore(this.canvas, document.body.firstElementChild);
    }

    start (objects = []) {
      this.render();
      this.objects = objects;
      this.objects.forEach(obj => {
        obj.render(this.context);
      });
      this.status = GAME_START;
    }

    render () {
      this.context.save();
      this.context.fillStyle = '#323232';
      this.context.fillRect(0, 0, this.width, this.height);
      this.context.restore();
    }

    update () {
      if (this.status === GAME_PAUSE || this.status === GAME_STOP) {
        return
      }
      this.clear();
      this.render();
      this.objects.forEach(obj => {
        obj.render(this.context);
      });
    }

    stop () {
      this.clear();
      this.status = GAME_STOP;
      console.log(this.status);
    }

    toggle (raf) {
      if (this.status === GAME_PLAYING || this.status === GAME_START) {
        this.status = GAME_PAUSE;
        window.cancelAnimationFrame(raf);
      } else {
        this.status = GAME_PLAYING;
      }
      console.log(this.status);
    }

    clear () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  function newGame () {
    return new Game()
  }

  class Base {
    constructor (opts = {}) {
      this._opts = Object.assign({}, Base._opts, opts);
      for (const key in this._opts) {
        this[key] = this._opts[key];
      }
    }
  }

  Base._opts = {
    type: 'base',
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    width: 100,
    height: 100,
    color: 'blue'
  };

  class Player extends Base {
    constructor (opts = {}) {
      super(opts);
      this.showFlame = false;
      this.rotate = opts.rotate || 0;
    }

    render (context) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.rotation);

      context.lineWidth = 1;
      context.strokeStyle = this.color;

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(this.width - 50, this.height);
      context.lineTo(0, this.height - 30);
      context.lineTo(-this.width + 50, this.height);
      context.closePath();
      context.stroke();

      if (this.showFlame) {
        context.beginPath();
        context.moveTo(-7.5, -5);
        context.lineTo(-15, 0);
        context.lineTo(-7.5, 5);
        context.stroke();
      }
      context.restore();
      this.move();
    }

    move () {
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  const game = newGame();
  const playerOpts = {
    x: game.width / 2,
    y: game.height - 120,
    vx: 0,
    vy: -5,
    color: 'white'
  };
  const player = new Player(playerOpts);
  const objects = [];

  objects.push(player);
  game.start(objects);

  let raf = null;

  function draw (raf) {
    game.update();
    raf = window.requestAnimationFrame(draw);
  }

  draw(raf);

  window.addEventListener('keyup', event => {
    const keyCode = event.keyCode;

    switch (keyCode) {
      case 32:
        game.toggle(raf);
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
  });

}));
