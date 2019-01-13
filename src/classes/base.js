class Base {
  constructor (opts = {}) {
    this._opts = Object.assign({}, Base._opts, opts)
    for (const key in this._opts) {
      this[key] = this._opts[key]
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
}

export default Base
