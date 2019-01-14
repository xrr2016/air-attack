(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  const scoreAudio = new Audio('/src/assets/dingmp3.mp3');
  scoreAudio.volume = 1;

  const GAME_STOP = 'GAME_STOP';
  const GAME_START = 'GAME_START';
  const GAME_PAUSE = 'GAME_PAUSE';
  const GAME_PLAYING = 'GAME_PLAYING';

  class Game {
    constructor (selector = 'air-attack', options = []) {
      this.init();
      this.score = 0;
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
      this.renderSore();
      this.objects = objects;
      this.objects.forEach(obj => {
        obj.render(this.context);
      });
      this.status = GAME_START;
    }

    render () {
      this.context.save();
      this.context.fillStyle = '#f2f3f4';
      this.context.fillRect(0, 0, this.width, this.height);
      this.context.restore();
    }

    renderSore () {
      this.context.save();
      this.context.font = '22px sans-serif';
      this.context.fillStyle = '#323232';
      this.context.fillText(`SCORE: ${this.score}`, this.width - 160, 40);
      this.context.restore();
    }

    update () {
      if (this.status === GAME_PAUSE || this.status === GAME_STOP) {
        return
      }
      this.clear();
      this.render();
      this.renderSore();
      this.objects.forEach(obj => {
        obj.render(this.context);
      });
      this.collisionDetect();
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
    }

    clear () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    collisionDetect () {
      const self = this;
      const player = this.objects[0];
      const blocks = this.objects.slice(1);

      if (blocks.length <= 0) {
        alert('YOU WIN!');
      }

      function remove (block) {
        const index = self.objects.findIndex(b => b.id === block.id);
        self.objects.splice(index, 1);
      }

      blocks.forEach(block => {
        const dx = block.x - player.x;
        const dy = block.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.width + block.width) {
          self.score += 10;
          scoreAudio.play();
          remove(block);
        }
      });
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
    width: 50,
    height: 50,
    color: 'blue'
  };

  class Player extends Base {
    constructor (opts = {}) {
      super(opts);
      this.bindEvent();
      this.type = 'player';
      this.newX = this.x;
      this.newY = this.y;
      this.isMoving = false;
      this.isShouldMove = false;
      this.speed = opts.speed;
    }

    render () {
      if (this.isShouldMove) {
        this.showDash();
        this.move();
      }

      this.context.save();
      this.context.translate(this.x, this.y);
      this.context.rotate(this.rotation);
      this.context.lineWidth = 1;
      this.context.fillStyle = this.color;
      this.context.beginPath();
      this.context.moveTo(0, 0);
      this.context.lineTo(this.width - 2, this.height + 2);
      this.context.lineTo(0, this.height - 1);
      this.context.lineTo(-this.width + 2, this.height + 2);
      this.context.closePath();
      this.context.fill();

      if (this.isMoving) {
        this.showFlame();
      }

      this.context.restore();
      this.stop();
    }

    showDash () {
      this.context.save();
      this.context.beginPath();
      this.context.lineWidth = 0.5;
      this.context.strokeStyle = this.color;
      this.context.setLineDash([5, 10]);
      this.context.moveTo(this.x, this.y);
      this.context.lineTo(this.newX, this.newY);
      this.context.arc(this.newX, this.newY, 4, 0, Math.PI * 2);
      this.context.stroke();
      this.context.restore();
    }

    showFlame () {
      this.context.beginPath();
      this.context.moveTo(this.width / 2, this.height - 3);
      this.context.lineTo(0, this.height + 3);
      this.context.lineTo(-this.width / 2, this.height - 3);
      this.context.stroke();
    }

    move () {
      const dx = this.newX - this.x;
      const dy = this.newY - this.y;
      const distance = Math.sqrt(dx * dx, dy * dy);
      const moveTime = distance / this.speed;

      this.vx = dx / moveTime;
      this.vy = dy / moveTime;

      this.x += this.vx;
      this.y += this.vy;
      this.isMoving = true;
    }

    stop () {
      if (
        (this.vx > 0 && this.x >= this.newX) ||
        (this.vx < 0 && this.x <= this.newX) ||
        (this.vy > 0 && this.y >= this.newY) ||
        (this.vy < 0 && this.y <= this.newY)
      ) {
        this.isShouldMove = false;
        this.isMoving = false;
        this.x = this.newX;
        this.y = this.newY;
      }
    }

    bindEvent () {
      this.canvas.addEventListener('click', event => {
        const { offsetX, offsetY } = event;
        this.newX = offsetX;
        this.newY = offsetY;
        this.isShouldMove = true;
        this.move();
      });

      this.canvas.addEventListener('mousemove', event => {
        const { offsetX, offsetY } = event;
        const dx = offsetX - this.x;
        const dy = offsetY - this.y;
        this.rotation = Math.atan2(dy, dx) + Math.PI / 2;
      });
    }
  }

  class Block extends Base {
    constructor (opts = {}) {
      super(opts);
      this.id = opts.id;
      this.type = 'block';
      this.isMoving = false;
      this.game = {};
      this.game.left = 0;
      this.game.right = this.canvas.width;
      this.game.top = 0;
      this.game.bottom = this.canvas.height;
    }

    render () {
      this.context.save();
      this.context.translate(this.x, this.y);
      this.context.rotate(this.rotation);
      this.context.lineWidth = 1.5;
      this.context.strokeStyle = this.color;
      this.context.beginPath();
      this.context.moveTo(this.width, this.height);
      this.context.lineTo(this.width, -this.height);
      this.context.lineTo(-this.width, -this.height);
      this.context.lineTo(-this.width, this.height);
      this.context.closePath();
      this.context.stroke();
      this.context.restore();
      this.update();
      this.borderWrap();
    }

    update () {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.vr;
      this.isMoving = true;
    }

    borderWrap () {
      if (this.x - this.width > this.game.right) {
        this.x = this.game.left - this.width;
      } else if (this.x + this.width < this.game.left) {
        this.x = this.game.right + this.width;
      }
      if (this.y - this.height > this.game.bottom) {
        this.y = this.game.top - this.height;
      } else if (this.y + this.height < this.game.top) {
        this.y = this.game.bottom + this.height;
      }
    }
  }

  const LETTERS = '0123456789abcdef';

  function randomColor () {
    let color = '#';

    while (color.length < 7) {
      color += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }

    return color
  }

  const game = newGame();

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
  };
  const player = new Player(playerOpts);

  const gameObjects = [];
  gameObjects.push(player);

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
    });
    gameObjects.push(block);
  }

  game.start(gameObjects);

  let raf = null;

  function draw (raf) {
    game.update();
    raf = window.requestAnimationFrame(draw);
  }

  window.addEventListener('keyup', event => {
    const keyCode = event.keyCode;

    switch (keyCode) {
      case 32:
        game.toggle(raf);
        break
    }
  });

  draw(raf);

}));
