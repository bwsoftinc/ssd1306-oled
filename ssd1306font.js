module.exports = {
  width: 5,
  height: 7,
  data: [
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 0 }, // [NUL]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 1 }, // [SOH]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 2 }, // [STX]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 3 }, // [ETX]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 4 }, // [EOT]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 5 }, // [ENQ]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 6 }, // [ACK]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 7 }, // [BEL]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 8 }, // [BS]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 9 }, // [HT]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 10 }, // [LF]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 11 }, // [VT]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 12 }, // [FF]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 13 }, // [CR]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 14 }, // [SO]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 15 }, // [SI]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 16 }, // [DLE]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 17 }, // [DC1]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 18 }, // [DC2]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 19 }, // [DC3]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 20 }, // [DC4]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 21 }, // [NAK]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 22 }, // [SYN]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 23 }, // [ETB]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 24 }, // [CAN]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 25 }, // [EM]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 26 }, // [SUB]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 27 }, // [ESC]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 28 }, // [FS]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 29 }, // [GS]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 30 }, // [RS]
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 31 }, // [US]
    { lead: 1, trail: 2, width: 2, bytes: [0x00, 0x00, 0x00, 0x00, 0x00], intCode: 32 }, // (space)
    { lead: 2, trail: 2, width: 1, bytes: [0x00, 0x00, 0x5F, 0x00, 0x00], intCode: 33 }, // '!'
    { lead: 1, trail: 1, width: 3, bytes: [0x00, 0x07, 0x00, 0x07, 0x00], intCode: 34 }, // '"'
    { lead: 0, trail: 0, width: 5, bytes: [0x14, 0x7F, 0x14, 0x7F, 0x14], intCode: 35 }, // '#'
    { lead: 0, trail: 0, width: 5, bytes: [0x24, 0x2A, 0x7F, 0x2A, 0x12], intCode: 36 }, // '$'
    { lead: 0, trail: 0, width: 5, bytes: [0x23, 0x13, 0x08, 0x64, 0x62], intCode: 37 }, // '%'
    { lead: 0, trail: 0, width: 5, bytes: [0x36, 0x49, 0x55, 0x22, 0x50], intCode: 38 }, // '&'
    { lead: 1, trail: 2, width: 2, bytes: [0x00, 0x05, 0x03, 0x00, 0x00], intCode: 39 }, // '''
    { lead: 1, trail: 1, width: 3, bytes: [0x00, 0x1C, 0x22, 0x41, 0x00], intCode: 40 }, // '('
    { lead: 1, trail: 1, width: 3, bytes: [0x00, 0x41, 0x22, 0x1C, 0x00], intCode: 41 }, // ')'
    { lead: 0, trail: 0, width: 5, bytes: [0x08, 0x2A, 0x1C, 0x2A, 0x08], intCode: 42 }, // '*'
    { lead: 0, trail: 0, width: 5, bytes: [0x08, 0x08, 0x3E, 0x08, 0x08], intCode: 43 }, // '+'
    { lead: 1, trail: 2, width: 2, bytes: [0x00, 0x50, 0x30, 0x00, 0x00], intCode: 44 }, // ','
    { lead: 0, trail: 0, width: 5, bytes: [0x08, 0x08, 0x08, 0x08, 0x08], intCode: 45 }, // '-'
    { lead: 1, trail: 2, width: 2, bytes: [0x00, 0x60, 0x60, 0x00, 0x00], intCode: 46 }, // '.'
    { lead: 0, trail: 0, width: 5, bytes: [0x20, 0x10, 0x08, 0x04, 0x02], intCode: 47 }, // '/'
    { lead: 0, trail: 0, width: 5, bytes: [0x3E, 0x51, 0x49, 0x45, 0x3E], intCode: 48 }, // '0'
    { lead: 1, trail: 1, width: 3, bytes: [0x00, 0x42, 0x7F, 0x40, 0x00], intCode: 49 }, // '1'
    { lead: 0, trail: 0, width: 5, bytes: [0x42, 0x61, 0x51, 0x49, 0x46], intCode: 50 }, // '2'
    { lead: 0, trail: 0, width: 5, bytes: [0x21, 0x41, 0x45, 0x4B, 0x31], intCode: 51 }, // '3'
    { lead: 0, trail: 0, width: 5, bytes: [0x18, 0x14, 0x12, 0x7F, 0x10], intCode: 52 }, // '4'
    { lead: 0, trail: 0, width: 5, bytes: [0x27, 0x45, 0x45, 0x45, 0x39], intCode: 53 }, // '5'
    { lead: 0, trail: 0, width: 5, bytes: [0x3C, 0x4A, 0x49, 0x49, 0x30], intCode: 54 }, // '6'
    { lead: 0, trail: 0, width: 5, bytes: [0x01, 0x71, 0x09, 0x05, 0x03], intCode: 55 }, // '7'
    { lead: 0, trail: 0, width: 5, bytes: [0x36, 0x49, 0x49, 0x49, 0x36], intCode: 56 }, // '8'
    { lead: 0, trail: 0, width: 5, bytes: [0x06, 0x49, 0x49, 0x29, 0x1E], intCode: 57 }, // '9'
    { lead: 1, trail: 2, width: 2, bytes: [0x00, 0x36, 0x36, 0x00, 0x00], intCode: 58 }, // ':'
    { lead: 1, trail: 2, width: 2, bytes: [0x00, 0x56, 0x36, 0x00, 0x00], intCode: 59 }, // ';'
    { lead: 1, trail: 0, width: 4, bytes: [0x00, 0x08, 0x14, 0x22, 0x41], intCode: 60 }, // '<'
    { lead: 0, trail: 0, width: 5, bytes: [0x14, 0x14, 0x14, 0x14, 0x14], intCode: 61 }, // '='
    { lead: 0, trail: 1, width: 4, bytes: [0x41, 0x22, 0x14, 0x08, 0x00], intCode: 62 }, // '>'
    { lead: 0, trail: 0, width: 5, bytes: [0x02, 0x01, 0x51, 0x09, 0x06], intCode: 63 }, // '?'
    { lead: 0, trail: 0, width: 5, bytes: [0x32, 0x49, 0x79, 0x41, 0x3E], intCode: 64 }, // '@'
    { lead: 0, trail: 0, width: 5, bytes: [0x7E, 0x11, 0x11, 0x11, 0x7E], intCode: 65 }, // 'A'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x49, 0x49, 0x49, 0x36], intCode: 66 }, // 'B'
    { lead: 0, trail: 0, width: 5, bytes: [0x3E, 0x41, 0x41, 0x41, 0x22], intCode: 67 }, // 'C'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x41, 0x41, 0x22, 0x1C], intCode: 68 }, // 'D'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x49, 0x49, 0x49, 0x41], intCode: 69 }, // 'E'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x09, 0x09, 0x01, 0x01], intCode: 70 }, // 'F'
    { lead: 0, trail: 0, width: 5, bytes: [0x3E, 0x41, 0x41, 0x51, 0x32], intCode: 71 }, // 'G'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x08, 0x08, 0x08, 0x7F], intCode: 72 }, // 'H'
    { lead: 1, trail: 1, width: 3, bytes: [0x00, 0x41, 0x7F, 0x41, 0x00], intCode: 73 }, // 'I'
    { lead: 0, trail: 0, width: 5, bytes: [0x20, 0x40, 0x41, 0x3F, 0x01], intCode: 74 }, // 'J'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x08, 0x14, 0x22, 0x41], intCode: 75 }, // 'K'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x40, 0x40, 0x40, 0x40], intCode: 76 }, // 'L'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x02, 0x04, 0x02, 0x7F], intCode: 77 }, // 'M'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x04, 0x08, 0x10, 0x7F], intCode: 78 }, // 'N'
    { lead: 0, trail: 0, width: 5, bytes: [0x3E, 0x41, 0x41, 0x41, 0x3E], intCode: 79 }, // 'O'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x09, 0x09, 0x09, 0x06], intCode: 80 }, // 'P'
    { lead: 0, trail: 0, width: 5, bytes: [0x3E, 0x41, 0x51, 0x21, 0x5E], intCode: 81 }, // 'Q'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x09, 0x19, 0x29, 0x46], intCode: 82 }, // 'R'
    { lead: 0, trail: 0, width: 5, bytes: [0x46, 0x49, 0x49, 0x49, 0x31], intCode: 83 }, // 'S'
    { lead: 0, trail: 0, width: 5, bytes: [0x01, 0x01, 0x7F, 0x01, 0x01], intCode: 84 }, // 'T'
    { lead: 0, trail: 0, width: 5, bytes: [0x3F, 0x40, 0x40, 0x40, 0x3F], intCode: 85 }, // 'U'
    { lead: 0, trail: 0, width: 5, bytes: [0x1F, 0x20, 0x40, 0x20, 0x1F], intCode: 86 }, // 'V'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x20, 0x18, 0x20, 0x7F], intCode: 87 }, // 'W'
    { lead: 0, trail: 0, width: 5, bytes: [0x63, 0x14, 0x08, 0x14, 0x63], intCode: 88 }, // 'X'
    { lead: 0, trail: 0, width: 5, bytes: [0x03, 0x04, 0x78, 0x04, 0x03], intCode: 89 }, // 'Y'
    { lead: 0, trail: 0, width: 5, bytes: [0x61, 0x51, 0x49, 0x45, 0x43], intCode: 90 }, // 'Z'
    { lead: 2, trail: 0, width: 3, bytes: [0x00, 0x00, 0x7F, 0x41, 0x41], intCode: 91 }, // '['
    { lead: 0, trail: 0, width: 5, bytes: [0x02, 0x04, 0x08, 0x10, 0x20], intCode: 92 }, // '\'
    { lead: 0, trail: 2, width: 3, bytes: [0x41, 0x41, 0x7F, 0x00, 0x00], intCode: 93 }, // ']'
    { lead: 0, trail: 0, width: 5, bytes: [0x04, 0x02, 0x01, 0x02, 0x04], intCode: 94 }, // '^'
    { lead: 0, trail: 0, width: 5, bytes: [0x40, 0x40, 0x40, 0x40, 0x40], intCode: 95 }, // '_'
    { lead: 1, trail: 1, width: 3, bytes: [0x00, 0x01, 0x02, 0x04, 0x00], intCode: 96 }, // '`'
    { lead: 0, trail: 0, width: 5, bytes: [0x20, 0x54, 0x54, 0x54, 0x78], intCode: 97 }, // 'a'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x48, 0x44, 0x44, 0x38], intCode: 98 }, // 'b'
    { lead: 0, trail: 0, width: 5, bytes: [0x38, 0x44, 0x44, 0x44, 0x20], intCode: 99 }, // 'c'
    { lead: 0, trail: 0, width: 5, bytes: [0x38, 0x44, 0x44, 0x48, 0x7F], intCode: 100 }, // 'd'
    { lead: 0, trail: 0, width: 5, bytes: [0x38, 0x54, 0x54, 0x54, 0x18], intCode: 101 }, // 'e'
    { lead: 0, trail: 0, width: 5, bytes: [0x08, 0x7E, 0x09, 0x01, 0x02], intCode: 102 }, // 'f'
    { lead: 0, trail: 0, width: 5, bytes: [0x08, 0x14, 0x54, 0x54, 0x3C], intCode: 103 }, // 'g'
    { lead: 0, trail: 0, width: 5, bytes: [0x7F, 0x08, 0x04, 0x04, 0x78], intCode: 104 }, // 'h'
    { lead: 1, trail: 1, width: 3, bytes: [0x00, 0x44, 0x7D, 0x40, 0x00], intCode: 105 }, // 'i'
    { lead: 0, trail: 1, width: 4, bytes: [0x20, 0x40, 0x44, 0x3D, 0x00], intCode: 106 }, // 'j'
    { lead: 1, trail: 0, width: 4, bytes: [0x00, 0x7F, 0x10, 0x28, 0x44], intCode: 107 }, // 'k'
    { lead: 1, trail: 1, width: 3, bytes: [0x00, 0x41, 0x7F, 0x40, 0x00], intCode: 108 }, // 'l'
    { lead: 0, trail: 0, width: 5, bytes: [0x7C, 0x04, 0x18, 0x04, 0x78], intCode: 109 }, // 'm'
    { lead: 0, trail: 0, width: 5, bytes: [0x7C, 0x08, 0x04, 0x04, 0x78], intCode: 110 }, // 'n'
    { lead: 0, trail: 0, width: 5, bytes: [0x38, 0x44, 0x44, 0x44, 0x38], intCode: 111 }, // 'o'
    { lead: 0, trail: 0, width: 5, bytes: [0x7C, 0x14, 0x14, 0x14, 0x08], intCode: 112 }, // 'p'
    { lead: 0, trail: 0, width: 5, bytes: [0x08, 0x14, 0x14, 0x18, 0x7C], intCode: 113 }, // 'q'
    { lead: 0, trail: 0, width: 5, bytes: [0x7C, 0x08, 0x04, 0x04, 0x08], intCode: 114 }, // 'r'
    { lead: 0, trail: 0, width: 5, bytes: [0x48, 0x54, 0x54, 0x54, 0x20], intCode: 115 }, // 's'
    { lead: 0, trail: 0, width: 5, bytes: [0x04, 0x3F, 0x44, 0x40, 0x20], intCode: 116 }, // 't'
    { lead: 0, trail: 0, width: 5, bytes: [0x3C, 0x40, 0x40, 0x20, 0x7C], intCode: 117 }, // 'u'
    { lead: 0, trail: 0, width: 5, bytes: [0x1C, 0x20, 0x40, 0x20, 0x1C], intCode: 118 }, // 'v'
    { lead: 0, trail: 0, width: 5, bytes: [0x3C, 0x40, 0x30, 0x40, 0x3C], intCode: 119 }, // 'w'
    { lead: 0, trail: 0, width: 5, bytes: [0x44, 0x28, 0x10, 0x28, 0x44], intCode: 120 }, // 'x'
    { lead: 0, trail: 0, width: 5, bytes: [0x0C, 0x50, 0x50, 0x50, 0x3C], intCode: 121 }, // 'y'
    { lead: 0, trail: 0, width: 5, bytes: [0x44, 0x64, 0x54, 0x4C, 0x44], intCode: 122 }, // 'z'
    { lead: 1, trail: 1, width: 3, bytes: [0x00, 0x08, 0x36, 0x41, 0x00], intCode: 123 }, // '{'
    { lead: 2, trail: 2, width: 1, bytes: [0x00, 0x00, 0x7F, 0x00, 0x00], intCode: 124 }, // '|'
    { lead: 1, trail: 1, width: 3, bytes: [0x00, 0x41, 0x36, 0x08, 0x00], intCode: 125 }, // '}'
    { lead: 0, trail: 0, width: 5, bytes: [0x02, 0x04, 0x02, 0x02, 0x04], intCode: 126 }, // '~'
    { lead: 0, trail: 1, width: 4, bytes: [0x7F, 0x41, 0x41, 0x7F, 0x00], intCode: 127 }, // [DEL]
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    { lead: 1, trail: 1, width: 3, bytes: [0x00, 0x07, 0x05, 0x07, 0x00], intCode: 176 },  // °
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    { lead: 1, trail: 1, width: 3, bytes: [0x00, 0x07, 0x05, 0x07, 0x00], intCode: 248 },  // °
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ]
};
