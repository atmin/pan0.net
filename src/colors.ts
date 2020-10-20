const from = (input: string): [number, number, number] => {
  const m = input.match(/^#([0-9a-f]{6})$/i)[1];
  return [
    parseInt(m.substr(0, 2), 16) / 255,
    parseInt(m.substr(2, 2), 16) / 255,
    parseInt(m.substr(4, 2), 16) / 255,
  ];
};

// Red
export const INDIANRED = from('#CD5C5C');
export const LIGHTCORAL = from('#F08080');
export const SALMON = from('#FA8072');
export const DARKSALMON = from('#E9967A');
export const CRIMSON = from('#DC143C');
export const RED = from('#FF0000');
export const FIREBRICK = from('#B22222');
export const DARKRED = from('#8B0000');

// Pink
export const PINK = from('#FFC0CB');
export const LIGHTPINK = from('#FFB6C1');
export const HOTPINK = from('#FF69B4');
export const DEEPPINK = from('#FF1493');
export const MEDIUMVIOLETRED = from('#C71585');
export const PALEVIOLETRED = from('#DB7093');

// Orange
export const LIGHTSALMON = from('#FFA07A');
export const CORAL = from('#FF7F50');
export const TOMATO = from('#FF6347');
export const ORANGERED = from('#FF4500');
export const DARKORANGE = from('#FF8C00');
export const ORANGE = from('#FFA500');

// Yellow
export const GOLD = from('#FFD700');
export const YELLOW = from('#FFFF00');
export const LIGHTYELLOW = from('#FFFFE0');
export const LEMONCHIFFON = from('#FFFACD');
export const LIGHTGOLDENRODYELLOW = from('#FAFAD2');
export const PAPAYAWHIP = from('#FFEFD5');
export const MOCCASIN = from('#FFE4B5');
export const PEACHPUFF = from('#FFDAB9');
export const PALEGOLDENROD = from('#EEE8AA');
export const KHAKI = from('#F0E68C');
export const DARKKHAKI = from('#BDB76B');

// Brown
export const CORNSILK = from('#FFF8DC');
export const BLANCHEDALMOND = from('#FFEBCD');
export const BISQUE = from('#FFE4C4');
export const NAVAJOWHITE = from('#FFDEAD');
export const WHEAT = from('#F5DEB3');
export const BURLYWOOD = from('#DEB887');
export const TAN = from('#D2B48C');
export const ROSYBROWN = from('#BC8F8F');
export const SANDYBROWN = from('#F4A460');
export const GOLDENROD = from('#DAA520');
export const DARKGOLDENROD = from('#B8860B');
export const PERU = from('#CD853F');
export const CHOCOLATE = from('#D2691E');
export const SADDLEBROWN = from('#8B4513');
export const SIENNA = from('#A0522D');
export const BROWN = from('#A52A2A');
export const MAROON = from('#800000');

// Purple
export const LAVENDER = from('#E6E6FA');
export const THISTLE = from('#D8BFD8');
export const PLUM = from('#DDA0DD');
export const VIOLET = from('#EE82EE');
export const ORCHID = from('#DA70D6');
export const FUCHSIA = from('#FF00FF');
export const MAGENTA = from('#FF00FF');
export const MEDIUMORCHID = from('#BA55D3');
export const MEDIUMPURPLE = from('#9370DB');
export const AMETHYST = from('#9966CC');
export const BLUEVIOLET = from('#8A2BE2');
export const DARKVIOLET = from('#9400D3');
export const DARKORCHID = from('#9932CC');
export const DARKMAGENTA = from('#8B008B');
export const PURPLE = from('#800080');
export const INDIGO = from('#4B0082');
export const SLATEBLUE = from('#6A5ACD');
export const DARKSLATEBLUE = from('#483D8B');
export const MEDIUMSLATEBLUE = from('#7B68EE');

// Green
export const GREENYELLOW = from('#ADFF2F');
export const CHARTREUSE = from('#7FFF00');
export const LAWNGREEN = from('#7CFC00');
export const LIME = from('#00FF00');
export const LIMEGREEN = from('#32CD32');
export const PALEGREEN = from('#98FB98');
export const LIGHTGREEN = from('#90EE90');
export const MEDIUMSPRINGGREEN = from('#00FA9A');
export const SPRINGGREEN = from('#00FF7F');
export const MEDIUMSEAGREEN = from('#3CB371');
export const SEAGREEN = from('#2E8B57');
export const FORESTGREEN = from('#228B22');
export const GREEN = from('#008000');
export const DARKGREEN = from('#006400');
export const YELLOWGREEN = from('#9ACD32');
export const OLIVEDRAB = from('#6B8E23');
export const OLIVE = from('#808000');
export const DARKOLIVEGREEN = from('#556B2F');
export const MEDIUMAQUAMARINE = from('#66CDAA');
export const DARKSEAGREEN = from('#8FBC8F');
export const LIGHTSEAGREEN = from('#20B2AA');
export const DARKCYAN = from('#008B8B');
export const TEAL = from('#008080');

// Blue
export const AQUA = from('#00FFFF');
export const CYAN = from('#00FFFF');
export const LIGHTCYAN = from('#E0FFFF');
export const PALETURQUOISE = from('#AFEEEE');
export const AQUAMARINE = from('#7FFFD4');
export const TURQUOISE = from('#40E0D0');
export const MEDIUMTURQUOISE = from('#48D1CC');
export const DARKTURQUOISE = from('#00CED1');
export const CADETBLUE = from('#5F9EA0');
export const STEELBLUE = from('#4682B4');
export const LIGHTSTEELBLUE = from('#B0C4DE');
export const POWDERBLUE = from('#B0E0E6');
export const LIGHTBLUE = from('#ADD8E6');
export const SKYBLUE = from('#87CEEB');
export const LIGHTSKYBLUE = from('#87CEFA');
export const DEEPSKYBLUE = from('#00BFFF');
export const DODGERBLUE = from('#1E90FF');
export const CORNFLOWERBLUE = from('#6495ED');
export const ROYALBLUE = from('#4169E1');
export const BLUE = from('#0000FF');
export const MEDIUMBLUE = from('#0000CD');
export const DARKBLUE = from('#00008B');
export const NAVY = from('#000080');
export const MIDNIGHTBLUE = from('#191970');

// White
export const WHITE = from('#FFFFFF');
export const SNOW = from('#FFFAFA');
export const HONEYDEW = from('#F0FFF0');
export const MINTCREAM = from('#F5FFFA');
export const AZURE = from('#F0FFFF');
export const ALICEBLUE = from('#F0F8FF');
export const GHOSTWHITE = from('#F8F8FF');
export const WHITESMOKE = from('#F5F5F5');
export const SEASHELL = from('#FFF5EE');
export const BEIGE = from('#F5F5DC');
export const OLDLACE = from('#FDF5E6');
export const FLORALWHITE = from('#FFFAF0');
export const IVORY = from('#FFFFF0');
export const ANTIQUEWHITE = from('#FAEBD7');
export const LINEN = from('#FAF0E6');
export const LAVENDERBLUSH = from('#FFF0F5');
export const MISTYROSE = from('#FFE4E1');

// Grey
export const GAINSBORO = from('#DCDCDC');
export const LIGHTGREY = from('#D3D3D3');
export const SILVER = from('#C0C0C0');
export const DARKGRAY = from('#A9A9A9');
export const GRAY = from('#808080');
export const DIMGRAY = from('#696969');
export const LIGHTSLATEGRAY = from('#778899');
export const SLATEGRAY = from('#708090');
export const DARKSLATEGRAY = from('#2F4F4F');
export const BLACK = from('#000000');
