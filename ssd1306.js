'use strict';

var i2c = require('i2c-bus');
var font = require('./ssd1306font');

var _ssd1306 = function(busId, address, width, height) {

  this.bus = i2c.openSync(busId || 1);  
  this.ADDRESS = address || 0x3C,
  this.WIDTH   = width   ||  128,
  this.HEIGHT  = height  ||   64,
  this.CMD     = 0x00,
  this.DATA    = 0x40;

  this.CHARGEPUMP            = 0x8D,
  this.COMSCANDEC            = 0xC8,
  this.COMSCANINC            = 0xC0,
  this.DISPLAYOFF            = 0xAE,
  this.DISPLAYON             = 0xAF,
  this.EXTERNALVCC           = 0x01,
  this.SETDISPLAYCLOCKDIV    = 0xD5,
  this.SETMULTIPLEX          = 0xA8,
  this.SETDISPLAYOFFSET      = 0xD3,
  this.SETSTARTLINE          = 0x40,
  this.SWITCHCAPVCC          = 0x02,
  this.MEMORYMODE            = 0x20,
  this.SEGREMAP              = 0xA1,
  this.SETCOMPINS            = 0xDA,
  this.SETCONTRAST           = 0x81,
  this.SETPRECHARGE          = 0xD9,
  this.SETVCOMLEVEL          = 0xDB,
  this.DISPLAYALLON          = 0xA5,
  this.DISPLAYRESUME         = 0xA4,
  this.NORMALDISPLAY         = 0xA6,
  this.COLUMNADDR            = 0x21,
  this.PAGEADDR              = 0x22,
  this.INVERTDISPLAY         = 0xA7;
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
    
  var _dirty = function() {
    this.bytes = {};  
    this.byteArr = [];
    this.add = function(val) {
      var v = val.toString();
    
      if(!this.bytes.hasOwnProperty(v)) {
        this.bytes[v] = val;
        this.byteArr.push(val);
      }
    }
    this.clear = function() {
      this.bytes = {};
      this.byteArr = [];    
    }
  };
  
  this.diplayInverted = false;
  this.buffer = new Buffer(this.WIDTH * this.HEIGHT / 8);
  this.dirtyBytes = new _dirty();

  this.waitForWriteSync = function(callback) {
    while (this.bus.readByteSync(this.ADDRESS, this.ACCESSCONFIG) & 0x10);
    callback();
  }  
   
  this.setContrast = function(val) {
    if(val > 255) val = 0xFF;
    if(val < 0) val = 0x00;
    var cmd = new Buffer([this.SETCONTRAST, val]);
    this.waitForWrite(function() {   
      this.bus.writeI2cBlockSync(this.ADDRESS, this.CMD, 2, cmd);
    }.bind(this));    
  }
  
  this.invertDisplay = function() {
    this.waitForWrite(function() {   
      this.bus.writeByteSync(this.ADDRESS, this.CMD, this.displayInverted? this.NORMALDISPLAY : this.INVERTDISPLAY);
      this.displayInverted = !this.displayInverted;
    }.bind(this));
  }
  
  this.displayOn = function() {
    this.waitForWriteSync(function() {
      this.bus.writeByteSync(this.ADDRESS, this.CMD, this.DISPLAYON);      
    }.bind(this));    
  }
  
  this.displayOff = function() {
    this.waitForWriteSync(function() {
      this.bus.writeByteSync(this.ADDRESS, this.CMD, this.DISPLAYOFF);      
    }.bind(this));    
  }
  
  this.clearBuffer = function() {
    var len = this.buffer.length
    for (var i = 0; i < len; i += 1) {
      if (this.buffer[i] !== 0x00) {
        this.buffer[i] = 0x00;
        this.dirtyBytes.add(i);
      }
    }
  }
  
  this.clearDisplay = function() {
    this.buffer.fill(0x00);
    this.flush();    
  }
    
  this.init = function() {
    this.bus.writeI2cBlockSync(this.ADDRESS, this.CMD, this.initBuffer.length, this.initBuffer);
    this.clearDisplay();
    this.displayOn();
  }
  
  this.drawStringByPixel = function(x, y, string, color, fixed) {  
    color = (typeof color === 'undefined' || color > 0)? 1 : 0;
    fixed = (typeof fixed === 'undefined' || !fixed)? false : true;
    
    var len = string.length, uncolor = !color;
    for(var i = 0; i < len; i++) {
      var glyph = this._getGlyph(string[i]), bytes = glyph.bytes, 
          start = fixed? 0 : glyph.lead, end = fixed? bytes.length : bytes.length - glyph.trail;
    
      for (var m = start; m < end; m++)
        for (var n = 0; n < 8; n++)
          this._drawPixel(x + m - start, y + n, (bytes[m] >> n & 1) == color);
      
      x+= fixed? font.width : glyph.width;
      for (var k = 0; k < 8; k++)
        this._drawPixel(x++, y + k, uncolor);
    }
  }
  
  this.drawString = function(x, y, string, color, fixed) {
    if(x < 0 || x >= this.WIDTH || y < 0 || y >= this.HEIGHT) return;
    color = (typeof color === 'undefined' || color > 0)? 1 : 0;
    fixed = (typeof fixed === 'undefined' || !fixed)? false : true;
    
    var yo = y % 8, ptr = Math.floor(y / 8) * this.WIDTH;
  
    if(yo > 0)
      this._drawOffsetString(x, yo, ptr, string, color, fixed);
    else
      this._drawString(x, ptr, string, color, fixed);
  }
  
  this._drawOffsetString = function(x, yo, ptr, string, color, fixed) {
    var len = string.length, len1 = len - 1, oy = 8 - yo, 
        dolo = ptr <= this.WIDTH * this.HEIGHT - this.WIDTH;
    
    for(var i = 0; i < len; i++) {      
      if((x = this._drawOffsetGlyph(x, yo, oy, ptr, dolo, this._getGlyph(string[i]), color, fixed)) < 0)
        break;
    
      if(i < len1) {
        this._drawOffsetSpace(x++ + ptr, yo, oy, dolo, color);
        if(x % this.WIDTH == 0)
          break;
	  }
    }
  }
  
  this._drawString = function(x, ptr, string, color, fixed) {
    var len = string.length, len1 = len - 1;
    for(var i = 0; i < len; i++) {
      if((x = this._drawGlyph(x, ptr, this._getGlyph(string[i]), color, fixed)) < 0)
        break;
      
      if(i < len1) {
        this._drawSpace(x++ + ptr, color);
        if(x % this.WIDTH == 0)
          break;
	  }
    }
  }
  
  this._drawSpace = function(idx, color) {    
    this.buffer[idx] = color? 0 : 1;
    this.dirtyBytes.add(idx);
  }
  
  this._drawOffsetGlyph = function(x, yo, oy, ptr, dolo, glyph, color, fixed) {    
    var start = fixed? 0 : glyph.lead, end = fixed? font.width : font.width - glyph.trail,
        idxhi = ptr + x, idxlo = idxhi + this.WIDTH, byteval = this.buffer[idxhi], bytes = 0;

    for(; start < end; start++) {
      bytes = color? glyph.bytes[start] : ~glyph.bytes[start];
      byteval = ((byteval << oy) & 0xFF) >> oy;
      byteval |= bytes << yo;
      this.buffer[idxhi] = byteval;
      this.dirtyBytes.add(idxhi++);
    
      if(dolo) {
        byteval = this.buffer[idxlo] >> yo << yo;
        byteval |= bytes >> oy; 
        this.buffer[idxlo] = byteval;
        this.dirtyBytes.add(idxlo++);
      }
    
      if(++x % this.WIDTH == 0) return -1;
      byteval = this.buffer[idxhi];
    }    
    return x;
  }
  
  this._drawGlyph = function(x, ptr, glyph, color, fixed) {
    var start = fixed? 0 : glyph.lead, end = fixed? font.width :  font.width - glyph.trail;
    
    for(var idx = ptr + x; start < end; start++) {
      this.buffer[idx] = color? glyph.bytes[start] : ~glyph.bytes[start];
      this.dirtyBytes.add(idx++);
      if(++x % this.WIDTH == 0) return -1;
    }
    return x;
  }
  
  this._drawOffsetSpace = function(idxhi, yo, oy, dolo, color) {
    var bytes = color? 0 : 1, byteval = this.buffer[idxhi];
    byteval = ((byteval << oy) & 0xFF) >> oy;
    byteval |= bytes << yo;
    this.buffer[idxhi] = byteval;
    this.dirtyBytes.add(idxhi);
    
    if(dolo) {
      idxhi += this.WIDTH;      
      byteval = (this.buffer[idxhi] >> yo) << yo;
      byteval |= bytes >> oy; 
      this.buffer[idxhi] = byteval;
      this.dirtyBytes.add(idxhi);
    }
  }
  
  this._getGlyph = function(c) {
    var cc = c.charCodeAt(0);
    if(cc > 255 || cc < 0) cc = 0;
    return font.data[cc];
  }
  
  this._drawPixel = function(x, y, color) {
    if (x >= this.WIDTH || y >= this.HEIGHT || x < 0 || y < 0) return;
    
    var page = Math.floor(y / 8), mask = 0x01 << (y - 8 * page),
        b = x + (this.WIDTH * page);
    
    if (color)
      this.buffer[b] |= mask;
    else 
      this.buffer[b] &= ~mask;      
    
    this.dirtyBytes.add(b);
  }

  this.flush = function() {
    this.waitForWriteSync(function() {      
      var cmd = new Buffer([
        this.COLUMNADDR, 0, this.WIDTH - 1,
        this.PAGEADDR, 0, (this.HEIGHT / 8) - 1
      ]);
  
      this.bus.writeI2cBlockSync(this.ADDRESS, this.CMD, 6, cmd);
    
      for (var v = 0; v < 1024; v += 32)
        this.bus.writeI2cBlockSync(this.ADDRESS, this.DATA, 32, this.buffer.slice(v, v + 32));
    }.bind(this));
    this.dirtyBytes.clear();
  }
  
  this.sync = function() {
    var dirt = this.dirtyBytes.byteArr.sort(function(a,b) { return a - b; }),
      start = 0, end = 1, len = dirt.length, segments = [], segment = [],
      bufstart = 0, bufend = 0, buflen = 0;
  
    //TODO: Further optimization if text wraps EOL, doensn't need to be split into separate segment
	
    for(;start < len; start = end, end++) {
      for(;dirt[end-1] + 1 == dirt[end] && end - start % 32 > 0 && dirt[end] % 32 > 0; end++);
      segments.push([dirt[start], dirt[end-1]]);    
    }
  
    len = segments.length;
  
    var logged = false;
    this.waitForWriteSync(function() {
      for(var i = 0; i < len; i++) {
        segment = segments[i], bufstart = segment[0], bufend = segment[1] + 1, buflen = bufend - bufstart;
        start = bufstart % this.WIDTH, end = Math.floor(bufstart / this.WIDTH);
      
        var cmd = new Buffer([
          this.COLUMNADDR, start, start + buflen - 1, this.PAGEADDR, end, end
        ]);
    
        this.bus.writeI2cBlockSync(this.ADDRESS, this.CMD, 6, cmd);    
        this.bus.writeI2cBlockSync(this.ADDRESS, this.DATA, buflen, this.buffer.slice(bufstart, bufend));
      }
    }.bind(this));
    this.dirtyBytes.clear();
  }
  
  this.init();
}

module.exports = _ssd1306;

