# ssd1306-oled
Fast I2C oled display driver, font and text writing library for ssd1306 controller in nodejs

## What makes it faster (unlike other libraries)
* Renders 1 byte at a time rather than 1 pixel at a time
* Software double buffer
	* Update one buffer while other buffer is syncing with display
	* Only keep track of display differences
	* Only update display with differences
* Writes up to 32 contiguous bytes over I2C at a time rather than addressing 1 byte at a time
  
## Features
* Custom 5x7 font
* Render glyphs in fixed width or proportional width modes
* Right align or left align text
* Text can be rendered to pixel coordinates
* Clear a set number of pixles in front of or after text
	* Great for updating/overwriting value displays without flushing entire 1k hardware buffer.
