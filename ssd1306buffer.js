'use strict';

class ssd1306buffer {
  constructor(width, height) {
    this._lookup = {};
    this._dirty = [];
    this._bytes = Buffer.allocUnsafe(width * height / 8);
    this._blocks = this._bytes.byteLength / 32;
  }

  async setHigh(idx, val, yo) {
    await ssd1306buffer.lock.acquire();
    var b = this._bytes[idx];
    b &= 0xFF << yo;
    this._bytes[idx] = b | val;
    this._flag(idx);
    ssd1306buffer.lock.release();
  }

  async setLow(idx, val, yo) {
    await ssd1306buffer.lock.acquire();
    var b = this._bytes[idx];
    b &= 0xFF >> yo;
    this._bytes[idx] = b | val;
    this._flag(idx);
    ssd1306buffer.lock.release();
  }

  async setOr(idx, val) {
    await ssd1306buffer.lock.acquire();
    this._bytes[idx] |= val;
    this._flag(idx);
    ssd1306buffer.lock.release();
  }

  async setAnd(idx, val) {
    await ssd1306buffer.lock.acquire();
    this._bytes[idx] &= val;
    this._flag(idx);
    ssd1306buffer.lock.release();
  }

  async set(idx, val) {
    await ssd1306buffer.lock.acquire();
    this._bytes[idx] = val;
    this._flag(idx);
    ssd1306buffer.lock.release();
  }

  _flag(val) {
    var v = val.toString();
    if(!this._lookup.hasOwnProperty(v)) {
      this._lookup[v] = val;
      this._dirty.push(val);
    }
  }

  async doubleBuffer(callback) {
    await ssd1306buffer.lock.acquire();
    var ret = {
      dirty : this._dirty.slice(),
      bytes : Buffer.from(this._bytes)
    };

    this._lookup = {};
    this._dirty = [];
    ssd1306buffer.lock.release();
    return ret;
  }

  async clear() {
    await ssd1306buffer.lock.acquire();
    var len = this._bytes.byteLength;
    for (var i = 0; i < len; i += 1) {
      if (this._bytes[i] !== 0x00) {
        this._bytes[i] = 0x00;
        this._flag(i);
      }
    }
    ssd1306buffer.lock.release();
  }
}

ssd1306buffer.lock = {
  _lock: false,
  acquire: function() {
    var self = this;
    return new Promise(function exec(resolve, reject) {
      if(!self._lock) {
        self._lock = true;
        resolve();
      }
      else
        setImmediate(() => exec(resolve, reject));
    });
  },
  release: function() { this._lock = false; }
};

module.exports = ssd1306buffer;
