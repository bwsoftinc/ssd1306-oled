'use strict';

class ssd1306base {
  constructor(busId, address, width, height) {
    this.ADDRESS = address || 0x3C;
    this.WIDTH   = width   ||  128;
    this.HEIGHT  = height  ||   64;
    this.BUSID   = busId   ||    1;

    this.font = require('./ssd1306font');
    this.buffer = new (require('./ssd1306buffer'))(this.WIDTH, this.HEIGHT);
    this.bus = require('i2c-bus').openSync(this.BUSID);

    this.CMD                   = 0x00;
    this.DATA                  = 0x40;

    this.CHARGEPUMP            = 0x8D;
    this.COMSCANDEC            = 0xC8;
    this.DISPLAYOFF            = 0xAE;
    this.DISPLAYON             = 0xAF;
    this.SETDISPLAYCLOCKDIV    = 0xD5;
    this.SETMULTIPLEX          = 0xA8;
    this.SETDISPLAYOFFSET      = 0xD3;
    this.SETSTARTLINE          = 0x40;
    this.MEMORYMODE            = 0x20;
    this.SEGREMAP              = 0xA1;
    this.SETCOMPINS            = 0xDA;
    this.SETCONTRAST           = 0x81;
    this.SETPRECHARGE          = 0xD9;
    this.SETVCOMLEVEL          = 0xDB;
    this.DISPLAYALLON          = 0xA5;
    this.DISPLAYRESUME         = 0xA4;
    this.NORMALDISPLAY         = 0xA6;
    this.INVERTDISPLAY         = 0xA7;
    this.COLUMNADDR            = 0x21;
    this.PAGEADDR              = 0x22;
    this.ACCESSCONFIG          = 0xAC;

    this.initBuffer = Buffer.from([
      this.DISPLAYOFF,
      this.SETDISPLAYCLOCKDIV,   0x80,
      this.SETMULTIPLEX,         0x3F,
      this.SETDISPLAYOFFSET,     0x00,
      this.SETSTARTLINE,
      this.CHARGEPUMP,           0x14,
      this.MEMORYMODE,           0x00,
      this.SEGREMAP,
      this.COMSCANDEC,
      this.SETCOMPINS,           0x12,
      this.SETCONTRAST,          0x7F,
      this.SETPRECHARGE,         0xF1,
      this.SETVCOMLEVEL,         0x40,
      this.DISPLAYRESUME,
      this.NORMALDISPLAY
    ]);

    this.flushBuffer = Buffer.from([
      this.COLUMNADDR, 0, this.WIDTH - 1,
      this.PAGEADDR, 0, (this.HEIGHT / 8) - 1
    ]);

    this.diplayInverted = false;
  }

  async drawString(x, y, string, leftAlign, until, fixed, color) {
    if(x < 0 || x >= this.WIDTH || y < 0 || y >= this.HEIGHT || !string) return;
    color = (typeof color === 'undefined' || color > 0)? 1 : 0;
    fixed = (typeof fixed === 'undefined' || !fixed)? false : true;
    leftAlign = (typeof leftAlign === 'undefined' || leftAlign)? true : false;
    until = (typeof until === 'undefined')? 0 : +until;

    var yo = y % 8, ptr = Math.floor(y / 8) * this.WIDTH;

    if(yo > 0)
      await this._drawOffsetString(x, yo, ptr, string, leftAlign, until, color, fixed);
    else
      await this._drawString(x, ptr, string, leftAlign, until, color, fixed);
  }

  async _drawOffsetString(x, yo, ptr, string, leftAlign, until, color, fixed) {
    var len = string.length, x1 = x,
        len1 = len - 1, oy = 8 - yo,
        dolo = ptr < this.buffer._bytes.byteLength - this.WIDTH;

    if(leftAlign) {
      for(var i = 0; i < len; i++) {
        if((x = await this._drawOffsetGlyph(x, yo, oy, ptr, dolo, this._getGlyph(string[i]), color, fixed)) < 0)
          return;

        if(i < len1) {
          await this._drawOffsetSpace(x++ + ptr, yo, oy, dolo, color);
          if(x % this.WIDTH == 0)
            return;
        }
      }

      for(until = x1 + until; x < until;) {
        await this._drawOffsetSpace(x++ + ptr, yo, oy, dolo, color);
        if(x % this.WIDTH == 0)
          return;
      }

      return;
    }

    for(var i = len-1; i >= 0; i--) {
      if((x = await this._drawOffsetGlyphReverse(x, yo, oy, ptr, dolo, this._getGlyph(string[i]), color, fixed)) < 0)
        return;

      if(i > 0) {
        await this._drawOffsetSpace(x-- + ptr, yo, oy, dolo, color);
        if(x + 1 % this.WIDTH == 0)
          return;
      }
    }

    for(until = x1 - until; x > until;) {
      await this._drawOffsetSpace(x-- + ptr, yo, oy, dolo, color);
      if(x + 1 % this.WIDTH == 0)
        return;
    }
  }

  async _drawString(x, ptr, string, leftAlign, until, color, fixed) {
    var len = string.length, x1 = x,
        len1 = len - 1;

    if(leftAlign) {
      for(var i = 0; i < len; i++) {
        if((x = await this._drawGlyph(x, ptr, this._getGlyph(string[i]), color, fixed)) < 0)
          return;

        if(i < len1) {
          await this._drawSpace(x++ + ptr, color);
          if(x % this.WIDTH == 0)
            return;
        }
      }

      for(until = x1 + until; x < until;) {
        await this._drawSpace(x++ + ptr, color);
        if(x % this.WIDTH == 0)
          return;
      }

      return;
    }

    for(var i = len1; i >= 0; i--) {
      if((x = await this._drawGlyphReverse(x, ptr, this._getGlyph(string[i]), color, fixed)) < 0)
        return;

      if(i > 0) {
        await this._drawSpace(x-- + ptr, color);
        if(x + 1 % this.WIDTH == 0)
          return;
      }
    }

    for(until = x1 - until; x > until;) {
      await this._drawSpace(x-- + ptr, color);
      if(x + 1 % this.WIDTH == 0)
        return;
    }
  }

  async _drawOffsetGlyphReverse(x, yo, oy, ptr, next, glyph, color, fixed) {
    var end = fixed? 0 : glyph.lead,
        start = (fixed? this.font.width : this.font.width - glyph.trail) - 1,
        idxhi = ptr + x,
        idxlo = idxhi + this.WIDTH,
        buf = this.buffer,
        b = 0x00;

    for(; start >= end; start--) {
      b = color? glyph.bytes[start] : ~glyph.bytes[start];
      await buf.setLow(idxhi--, b << yo, oy);

      if(next)
        await buf.setHigh(idxlo--, b >> oy, yo);

      if(x-- % this.WIDTH == 0) return -1;
    }
    return x;
  }

  async _drawOffsetGlyph(x, yo, oy, ptr, next, glyph, color, fixed) {
    var start = fixed? 0 : glyph.lead,
        end = fixed? this.font.width : this.font.width - glyph.trail,
        idxhi = ptr + x,
        idxlo = idxhi + this.WIDTH,
        buf = this.buffer,
        b = 0x00;

    for(; start < end; start++) {
      b = color? glyph.bytes[start] : ~glyph.bytes[start];
      await buf.setLow(idxhi++, b << yo, oy);

      if(next)
        await buf.setHigh(idxlo++, b >> oy, yo);

      if(++x % this.WIDTH == 0) return -1;
    }
    return x;
  }

  async _drawGlyph(x, ptr, glyph, color, fixed) {
    var start = fixed? 0 : glyph.lead,
        end = fixed? this.font.width : this.font.width - glyph.trail,
        buf = this.buffer;

    for(var idx = ptr + x; start < end; start++) {
      await buf.set(idx++, color? glyph.bytes[start] : ~glyph.bytes[start]);
      if(++x % this.WIDTH == 0) return -1;
    }
    return x;
  }

  async _drawGlyphReverse(x, ptr, glyph, color, fixed) {
    var end = fixed? 0 : glyph.lead,
        start = (fixed? this.font.width : this.font.width - glyph.trail) - 1,
        buf = this.buffer;

    for(var idx = ptr + x; start >= end; start--) {
      await buf.set(idx--, color? glyph.bytes[start] : ~glyph.bytes[start]);
      if(x-- % this.WIDTH == 0) return -1;
    }
    return x;
  }

  async _drawSpace(idx, color) {
    await this.buffer.set(idx, color? 0x00 : 0xFF);
  }

  async _drawOffsetSpace(idxhi, yo, oy, next, color) {
    var b = color? 0x00 : 0xFF,
        buf = this.buffer;

    await buf.setLow(idxhi, b << yo, oy);

    if(next)
      await buf.setHigh(idxhi + this.WIDTH, b >> oy, yo)
  }

  _getGlyph(c) {
    var cc = c.charCodeAt(0);
    if(cc > 255 || cc < 0) cc = 0;
    return this.font.data[cc];
  }

  async _drawPixel(x, y, color) {
    if (x >= this.WIDTH || y >= this.HEIGHT || x < 0 || y < 0) return;

    var page = Math.floor(y / 8),
        mask = 0x01 << (y - 8 * page),
        b = x + (this.WIDTH * page),
        buf = this.buffer;

    if (color)
      await buf.setOr(b, mask);
    else
      await buf.setAnd(b, ~mask);
  }
}

module.exports = ssd1306base;
