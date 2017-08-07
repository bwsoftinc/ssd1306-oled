'use strict';

class ssd1306 {
  constructor(busId, address, width, height) {
    this.i2c = require('i2c-bus');
    this.font = require('./ssd1306font');
    
    this.bus = this.i2c.openSync(busId || 1);  
    this.ADDRESS = address || 0x3C;
    this.WIDTH   = width   ||  128;
    this.HEIGHT  = height  ||   64;
    this.CMD     = 0x00;
    this.DATA    = 0x40;
    
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
    
    this.initBuffer = new Buffer([
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
          
    this.flushBuffer = new Buffer([
      this.COLUMNADDR, 0, this.WIDTH - 1,
      this.PAGEADDR, 0, (this.HEIGHT / 8) - 1
    ]);
    
    var self = this;
    this.diplayInverted = false;
    
    this.buffer = new function() {
      var that = this;
      this._lock = false;
      this._lookup = {};  
      this._dirty = [];
      this._bytes = new Buffer(self.WIDTH * self.HEIGHT / 8);
      this._blocks = this._bytes.length / 32;
      
      this.setHigh = function(idx, val, yo) {
        if(this._lock) {
          setImmediate(function() { that.setHigh(idx, val, yo); });
          return;
        }
        
        this._lock = true;
        var b = this._bytes[idx];
        b &= 0xFF << yo;
        this._bytes[idx] = b | val;        
        this._flag(idx);
        this._lock = false;
      }
      
      this.setLow = function(idx, val, yo) {
        if(this._lock) {
          setImmediate(function() { that.setLow(idx, val, yo); });
          return;
        }
        
        this._lock = true;
        var b = this._bytes[idx];
        b &= 0xFF >> yo;
        this._bytes[idx] = b | val;        
        this._flag(idx);
        this._lock = false;
      }
      
      this.setOr = function(idx, val) {
        if(this._lock) {
          setImmediate(function() { that.setOr(idx, val); });
          return;
        }
        
        this._lock = true;
        this._bytes[idx] |= val;
        this._flag(idx);
        this._lock = false;
      }
      
      this.setAnd = function(idx, val) {
        if(this._lock) {
          setImmediate(function() { that.setAnd(idx, val); });
          return;
        }
        
        this._lock = true;
        this._bytes[idx] &= val;
        this._flag(idx);
        this._lock = false;
      }
      
      this.set = function(idx, val) {
        if(this._lock) {
          setImmediate(function() { that.set(idx, val); }, 1);
          return;
        }
        
        this._lock = true;
        this._bytes[idx] = val;
        this._flag(idx);
        this._lock = false;
      }
      
      this._flag = function(val) {
        var v = val.toString();    
        if(!this._lookup.hasOwnProperty(v)) {
          this._lookup[v] = val;
          this._dirty.push(val);
        }
      }
      
      this.doubleBuffer = function(callback) {
        if(this._lock) {
          setImmediate(function() { that.doubleBuffer(callback); });
          return;
        }
        
        this._lock = true;
        
        var ret = {
          dirty : this._dirty.slice(),
          bytes : new Buffer(this._bytes)          
        };
        
        this._lookup = {};
        this._dirty = [];        
        this._lock = false;
        callback(ret);
      }
      
      this.clear = function() {
        if(this._lock) {
          setImmediate(function() { that.clear(); });
          return;
        }
        
        this._lock = true;
        
        var len = this._bytes.length
        for (var i = 0; i < len; i += 1) {
          if (this._bytes[i] !== 0x00) {
            this._bytes[i] = 0x00;
            this._flag(i);
          }
        }
        
        this._lock = false;
      }
    };

  }
  
  init(str) {
    return new Promise((rs, rj) => {
      this.bus.writeI2cBlock(this.ADDRESS, this.CMD, this.initBuffer.length, this.initBuffer, (err) => {
        if(err) return rj(err);        
        this.buffer._bytes.fill(0x00);
        
        if(str)
          this.drawString(0, 0, str);
        
        this.buffer._dirty = [];
        this.buffer._lookup = {};
        
        this._flush(this.buffer._bytes, () => {  
          this.displayOn().then(() => { 
            return rs();
          });
        }, rj);
      });
    });
  }
  
  initSync(str) {
    this.bus.writeI2cBlockSync(this.ADDRESS, this.CMD, this.initBuffer.length, this.initBuffer);
    this.buffer._bytes.fill(0x00);
    
    if(str)
      this.drawString(0,0, str);

    this.buffer._dirty = [];
    this.buffer._lookup = {};
    this._flushSync(this.buffer._bytes);
    this.displayOnSync();
  }
  
  waitForWrite() {
    return new Promise((rs, rj) => {
      (function wait(that) {
        that.bus.readByte(that.ADDRESS, that.ACCESSCONFIG, (err, data) => {
          if(err) return rj(err);
          if(data & 0x10) wait(that);
          return rs();
        });
      })(this);
    });
  }  
   
  waitForWriteSync() {
    while(this.bus.readByteSync(this.ADDRESS, this.ACCESSCONFIG) & 0x10);    
  }
   
  setContrast(val) {
    if(val > 255) val = 0xFF;
    else if(val < 0) val = 0x00;
    
    return new Promise((rs, rj) => {
      this.waitForWrite().then(() => {   
        this.bus.writeI2cBlock(this.ADDRESS, this.CMD, 2, new Buffer([this.SETCONTRAST, val]), (err) => {
          return err? rj(err) : rs();
        });
      });
    });
  }
  
  setContrastSync(val) {
    if(val > 255) val = 0xFF;
    else if(val < 0) val = 0x00;    
    this.waitForWriteSync();    
    this.bus.writeI2cBlockSync(this.ADDRESS, this.CMD, 2, new Buffer([this.SETCONTRAST, val]));
  }
  
  invertDisplay() {
    return new Promise((rs, rj) => {
      this.waitForWrite().then(() => {   
        this.bus.writeByte(this.ADDRESS, this.CMD, this.displayInverted? this.NORMALDISPLAY : this.INVERTDISPLAY, (err) => {
          if(err) return rj(err);
          this.displayInverted = !this.displayInverted;
          return rs();
        });
      });
    });
  }
  
  invertDisplaySync() {
    this.waitForWrite();
    this.bus.writeByteSync(this.ADDRESS, this.CMD, this.displayInverted? this.NORMALDISPLAY : this.INVERTDISPLAY);
    this.displayInverted = !this.displayInverted;
  }
  
  displayOn() {
    return new Promise((rs, rj) => {
      this.waitForWrite().then(() => {
        this.bus.writeByte(this.ADDRESS, this.CMD, this.DISPLAYON, (err) => {
          return err? rj(err) : rs();
        });      
      });   
    });
  }
  
  displayOnSync() {
    this.waitForWriteSync();
    this.bus.writeByteSync(this.ADDRESS, this.CMD, this.DISPLAYON);
  }  
  
  displayOff() {
    return new Promise((rs, rj) => {
      this.waitForWrite().then(() => {
        this.bus.writeByte(this.ADDRESS, this.CMD, this.DISPLAYOFF, (err) => {
          return err? rj(err) : rs();
        });      
      });    
    });
  }
  
  displayOffSync() {
    this.waitForWriteSync();
    this.bus.writeByteSync(this.ADDRESS, this.CMD, this.DISPLAYOFF);
  }
  
  clearDisplay() {
    return new Promise((rs, rj) => {
      this.buffer.bytes.fill(0x00);
      this.flush().then(() => { return rs(); });
    });
  }
  
  clearDisplaySync() {
    this.buffer.bytes.fill(0x00);
    this.flushSync();
  }
    
  drawString(x, y, string, leftAlign, until, fixed, color) {
    if(x < 0 || x >= this.WIDTH || y < 0 || y >= this.HEIGHT || !string) return;
    color = (typeof color === 'undefined' || color > 0)? 1 : 0;
    fixed = (typeof fixed === 'undefined' || !fixed)? false : true;
    leftAlign = (typeof leftAlign === 'undefined' || leftAlign)? true : false;
    until = (typeof until === 'undefined')? 0 : +until;
    
    var yo = y % 8, ptr = Math.floor(y / 8) * this.WIDTH;
  
    if(yo > 0)
      this._drawOffsetString(x, yo, ptr, string, leftAlign, until, color, fixed);
    else
      this._drawString(x, ptr, string, leftAlign, until, color, fixed);
  }
  
  _drawOffsetString(x, yo, ptr, string, leftAlign, until, color, fixed) {
    var len = string.length, x1 = x,
        len1 = len - 1, oy = 8 - yo, 
        dolo = ptr < this.buffer._bytes.length - this.WIDTH;
  
    if(leftAlign) {
      for(var i = 0; i < len; i++) {
        if((x = this._drawOffsetGlyph(x, yo, oy, ptr, dolo, this._getGlyph(string[i]), color, fixed)) < 0)
          return;
      
        if(i < len1) {
          this._drawOffsetSpace(x++ + ptr, yo, oy, dolo, color);
          if(x % this.WIDTH == 0)
            return;
        }
      }
      
      for(until = x1 + until; x < until;) {
        this._drawOffsetSpace(x++ + ptr, yo, oy, dolo, color);        
        if(x % this.WIDTH == 0)
          return;
      }
      
      return;
    }
    
    for(var i = len-1; i >= 0; i--) {
      if((x = this._drawOffsetGlyphReverse(x, yo, oy, ptr, dolo, this._getGlyph(string[i]), color, fixed)) < 0)
        return;
    
      if(i > 0) {
        this._drawOffsetSpace(x-- + ptr, yo, oy, dolo, color);
        if(x + 1 % this.WIDTH == 0)
          return;
      }
    }
    
    for(until = x1 - until; x > until;) {
      this._drawOffsetSpace(x-- + ptr, yo, oy, dolo, color);
      if(x + 1 % this.WIDTH == 0)
        return;
    }
  }
  
  _drawString(x, ptr, string, leftAlign, until, color, fixed) {    
    var len = string.length, x1 = x,
        len1 = len - 1;
        
    if(leftAlign) {
      for(var i = 0; i < len; i++) {
        if((x = this._drawGlyph(x, ptr, this._getGlyph(string[i]), color, fixed)) < 0)
          return;
        
        if(i < len1) {
          this._drawSpace(x++ + ptr, color);
          if(x % this.WIDTH == 0)
            return;
        }
      }
      
      for(until = x1 + until; x < until;) {
        this._drawSpace(x++ + ptr, color);          
        if(x % this.WIDTH == 0)
          return;
      }
      
      return;
    }       
    
    for(var i = len1; i >= 0; i--) {
      if((x = this._drawGlyphReverse(x, ptr, this._getGlyph(string[i]), color, fixed)) < 0)
        return;
    
      if(i > 0) {
        this._drawSpace(x-- + ptr, color);
        if(x + 1 % this.WIDTH == 0)
          return;
      }
    }
    
    for(until = x1 - until; x > until;) {
      this._drawSpace(x-- + ptr, color);
      if(x + 1 % this.WIDTH == 0)
        return;
    }
  }
  
  _drawOffsetGlyphReverse(x, yo, oy, ptr, next, glyph, color, fixed) {    
    var end = fixed? 0 : glyph.lead, 
        start = (fixed? this.font.width : this.font.width - glyph.trail) - 1,
        idxhi = ptr + x, 
        idxlo = idxhi + this.WIDTH, 
        buf = this.buffer,
        b = 0x00;
        
    for(; start >= end; start--) {
      b = color? glyph.bytes[start] : ~glyph.bytes[start];
      buf.setLow(idxhi--, b << yo, oy);
    
      if(next)
        buf.setHigh(idxlo--, b >> oy, yo);
    
      if(x-- % this.WIDTH == 0) return -1;
    }    
    return x;
  }
  
  _drawOffsetGlyph(x, yo, oy, ptr, next, glyph, color, fixed) {    
    var start = fixed? 0 : glyph.lead, 
        end = fixed? this.font.width : this.font.width - glyph.trail,
        idxhi = ptr + x, 
        idxlo = idxhi + this.WIDTH, 
        buf = this.buffer,
        b = 0x00;
        
    for(; start < end; start++) {
      b = color? glyph.bytes[start] : ~glyph.bytes[start];
      buf.setLow(idxhi++, b << yo, oy);
    
      if(next)
        buf.setHigh(idxlo++, b >> oy, yo);
    
      if(++x % this.WIDTH == 0) return -1;
    }    
    return x;
  }
  
  _drawGlyph(x, ptr, glyph, color, fixed) {
    var start = fixed? 0 : glyph.lead, 
        end = fixed? this.font.width : this.font.width - glyph.trail,
        buf = this.buffer;
    
    for(var idx = ptr + x; start < end; start++) {
      buf.set(idx++, color? glyph.bytes[start] : ~glyph.bytes[start]);
      if(++x % this.WIDTH == 0) return -1;
    }
    return x;
  }
  
  _drawGlyphReverse(x, ptr, glyph, color, fixed) {
    var end = fixed? 0 : glyph.lead, 
        start = (fixed? this.font.width : this.font.width - glyph.trail) - 1,
        buf = this.buffer;
    
    for(var idx = ptr + x; start >= end; start--) {
      buf.set(idx--, color? glyph.bytes[start] : ~glyph.bytes[start]);
      if(x-- % this.WIDTH == 0) return -1;
    }
    return x;
  }
  
  _drawSpace(idx, color) {
    this.buffer.set(idx, color? 0x00 : 0xFF);
  }
  
  _drawOffsetSpace(idxhi, yo, oy, next, color) {
    var b = color? 0x00 : 0xFF, 
        buf = this.buffer;
        
    buf.setLow(idxhi, b << yo, oy);
    
    if(next)
      buf.setHigh(idxhi + this.WIDTH, b >> oy, yo)
  }
  
  _getGlyph(c) {
    var cc = c.charCodeAt(0);
    if(cc > 255 || cc < 0) cc = 0;
    return this.font.data[cc];
  }
  
  _drawPixel(x, y, color) {
    if (x >= this.WIDTH || y >= this.HEIGHT || x < 0 || y < 0) return;
    
    var page = Math.floor(y / 8), 
        mask = 0x01 << (y - 8 * page),
        b = x + (this.WIDTH * page), 
        buf = this.buffer;
    
    if (color)
      buf.setOr(b, mask);
    else 
      buf.setAnd(b, ~mask);
  }

  flush() {
    return new Promise((rs, rj) => {
      this.buffer.doubleBuffer((b) => {
        return _flush(b.bytes, rs, rj);        
      });
    })
  }
  
  _flush(buf, rs, rj) {
    this.waitForWrite().then(() => {
      var len = this.buffer._bytes.length;      
      this.bus.writeI2cBlock(this.ADDRESS, this.CMD, 6, this.flushBuffer, (err) => {
        if(err) return rj(err);
        (function loop(that, v) {
          that.bus.writeI2cBlock(that.ADDRESS, that.DATA, 32, buf.slice(v, v + 32), (err) => {
            if(err) return rj(err);
            if((v += 32) < len) return loop(that, v);
            return rs();
          });
        })(this, 0);
      });
    });
  }

  flushSync() {
    this.buffer.doubleBuffer((buffer) => {  
      this._flushSync(buffer.bytes);
    });
  }
  
  _flushSync(buf) {
    var len = buf.length;
    this.bus.writeI2cBlockSync(this.ADDRESS, this.CMD, 6, this.flushBuffer);
    for(var v = 0; v < len; v += 32)
      this.bus.writeI2cBlockSync(this.ADDRESS, this.DATA, 32, buf.slice(v, v + 32));
  }
  
  sync() { 
    return new Promise((rs, rj) => {
      if(!this.buffer._dirty.length) return rs();  
      this.buffer.doubleBuffer((buffer) => {
        
        var buf = buffer.bytes, 
            dirt = buffer.dirty.sort((a,b) => a - b),
            len = dirt.length, 
            cmd = new Buffer([
              this.COLUMNADDR, 0, 0,
              this.PAGEADDR, 1, 1
            ]);
            
        this.waitForWrite().then(() => {
          (function cloop(that, start, end1, end, ds, de1, de) {
            if(end === len || de % 128 === 0 || de1 + 1 !== de) {
              cmd[1] = ds % 128;
              cmd[2] = cmd[1] + de1 - ds;
              cmd[4] = cmd[5] = Math.floor(ds / that.WIDTH);
              
              that.bus.writeI2cBlock(that.ADDRESS, that.CMD, 6, cmd, (err) => {
                if(err) return rj(err);
                (function dloop(that, start, end1, end, bstart, bend) {
                  var buffer = buf.slice(bstart, bend + 1);
                  that.bus.writeI2cBlock(that.ADDRESS, that.DATA, buffer.length, buffer, (err) => {
                    if(err) return rj(err);
                    if((start += 32) < end) 
                      return dloop(that, start, end1, end, dirt[start], Math.min(dirt[start] + 31, de1));
                    return((end1 = end++) < len)? cloop(that, end1, end1, end, dirt[end1], dirt[end1], dirt[end]) : rs();  
                  });
                })(that, start, end1, end, ds, Math.min(ds + 31, de1));
              });  
            }
            else
              return (end1 = end++) < len? cloop(that, start, end1, end, ds, dirt[end1], dirt[end]) : rs();
          })(this, 0, 0, 1, dirt[0], dirt[0], dirt[1]);
        });
      });
    });
  }
  
  syncSync() { 
    if(!this.buffer._dirty.length) return;     
    this.buffer.doubleBuffer((buffer) => {
      
      var buf = buffer.bytes, 
          start = 0, end = 1, end1 = 0, bstart = 0, bend = 0,
          dirt = buffer.dirty.sort((a,b) => a - b),
          len = dirt.length, de = 0, de1 = 0, ds = dirt[start],
          cmd = new Buffer([
            this.COLUMNADDR, 0, 0,
            this.PAGEADDR, 1, 1
          ]);
      
      this.waitForWriteSync();
      for(; end1 < len; end1 = end++) { 
      
        if(end === len || (de = dirt[end]) % 128 === 0 || dirt[end1] + 1 !== de) {
          cmd[1] = ds % 128;
          cmd[2] = cmd[1] + (de1 = dirt[end1]) - ds;
          cmd[4] = cmd[5] = Math.floor(ds / this.WIDTH);

          this.bus.writeI2cBlockSync(this.ADDRESS, this.CMD, 6, cmd);
          
          for(bstart = ds, bend = Math.min(bstart + 31, de1); start < end;
              bstart = dirt[start += 32], bend = Math.min(bstart + 31, de1)) {
            buffer = buf.slice(bstart, bend + 1);
            this.bus.writeI2cBlockSync(this.ADDRESS, this.DATA, buffer.length, buffer);
          }
          ds = dirt[start = end];
        }
      }
    });
  }
  
}

module.exports = ssd1306;
