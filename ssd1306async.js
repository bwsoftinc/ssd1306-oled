'use strict';
const ssd1306base = require('./ssd1306base');

class ssd1306async extends ssd1306base {
  constructor(busId, address, width, height) {
    super(busId, address, width, height);
  }

  async init(str) {
    var init = this.writeBytes(this.CMD, this.initBuffer);
    this.buffer._bytes.fill(0x00);

    if(str)
      await this.drawString(0, 0, str);

    this.buffer._dirty = [];
    this.buffer._lookup = {};

    await init;
    await this._flush(this.buffer._bytes);
    await this.displayOn();
  }

  async waitForWrite() {
    if(await this.readByte(this.ACCESSCONFIG) & 0x10)
      await waitForWrite();
  }

  readByte(addr) {
    return new Promise(async (resolve, reject) =>
      this.bus.readByte(
        this.ADDRESS,
        addr,
        (err, data) => err? reject(err) : resolve(data))
    );
  }

  async setContrast(val) {
    val &= 0xFF;
    await this.waitForWrite();
    await this.writeBytes(this.CMD, Buffer.from([this.SETCONTRAST, val]));
  }

  async invertDisplay() {
    await this.waitForWrite();
    await this.writeByte(this.CMD, this.displayInverted? this.NORMALDISPLAY : this.INVERTDISPLAY);
    this.displayInverted = !this.displayInverted;
  }

  writeBytes(cmd, buffer) {
    return new Promise((resolve, reject) =>
      this.bus.writeI2cBlock(
        this.ADDRESS,
        cmd,
        buffer.byteLength,
        buffer,
        (err) => err? reject(err) : resolve())
    );
  }

  writeByte(cmd, byte) {
    return new Promise((resolve, reject) =>
      this.bus.writeByte(
        this.ADDRESS,
        cmd,
        byte,
        (err) => err? reject(err) : resolve())
    );
  }

  async displayOn() {
    await this.waitForWrite();
    await this.writeByte(this.CMD, this.DISPLAYON);
  }

  async displayOff() {
    await this.waitForWrite();
    await this.writeByte(this.CMD, this.DISPLAYOFF);
  }

  async clearDisplay() {
    await ssd1306async.lock.acquire();
    this.buffer.bytes.fill(0x00);
    var buffer = await this.buffer.doubleBuffer();
    await this._flush(buffer.bytes);
    ssd1306async.lock.release();
  }

  async _flush(buf) {
    await this.waitForWrite();
    var len = buf.byteLength;
    await this.writeBytes(this.CMD, this.flushBuffer);
    for(var v = 0; v < len; v += 32)
      await this.writeBytes(this.DATA, buf.slice(v, v + 32));
  }

  async sync() {
    if(!this.buffer._dirty.length) return;

    await ssd1306async.lock.acquire();
    var buffer = await this.buffer.doubleBuffer();
    var buf = buffer.bytes,
        start = 0, end = 1, end1 = 0, bstart = 0, bend = 0,
        dirt = buffer.dirty.sort((a,b) => a - b),
        len = dirt.length, de = 0, de1 = 0, ds = dirt[start],
        cmd = Buffer.from([
          this.COLUMNADDR, 0, 0,
          this.PAGEADDR, 1, 1
        ]);

    await this.waitForWrite();

    for(; end1 < len; end1 = end++) {
      if(end === len || (de = dirt[end]) % 128 === 0 || dirt[end1] + 1 !== de) {
        cmd[1] = ds % 128;
        cmd[2] = cmd[1] + (de1 = dirt[end1]) - ds;
        cmd[4] = cmd[5] = Math.floor(ds / this.WIDTH);

        await this.writeBytes(this.CMD, cmd);
        for(bstart = ds, bend = Math.min(bstart + 31, de1); start < end;
            bstart = dirt[start += 32], bend = Math.min(bstart + 31, de1)) {
            buffer = buf.slice(bstart, bend + 1);
            await this.writeBytes(this.DATA, buffer);
        }

        ds = dirt[start = end];
      }
    }
    ssd1306async.lock.release();
  }
}

ssd1306async.lock = {
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

module.exports = ssd1306async;
