

  lch2rgb = function(l, c, h) {
    var L, a, args, b, g, r, ref, ref1;
    ref = lch2lab(l, c, h), L = ref[0], a = ref[1], b = ref[2];
    ref1 = lab2rgb(L, a, b), r = ref1[0], g = ref1[1], b = ref1[2];
    // return [limit(r, 0, 255), limit(g, 0, 255), limit(b, 0, 255), args.length > 3 ? args[3] : 1];
    return tagRgbClipped([r, g, b]);
  };

  lch2lab = function(l, c, h) {

    /*
    Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
    These formulas were invented by David Dalrymple to obtain maximum contrast without going
    out of gamut if the parameters are in the range 0-1.
    
    A saturation multiplier was added by Gregor Aisch
     */
    h = h * DEG2RAD;
    return [l, cos(h) * c, sin(h) * c];
  };

  lab2rgb = function(l, a, b) {
    var g, r, x, y, z;
    y = (l + 16) / 116;
    x = isNaN(a) ? y : y + a / 500;
    z = isNaN(b) ? y : y - b / 200;
    y = LAB_CONSTANTS.Yn * lab_xyz(y);
    x = LAB_CONSTANTS.Xn * lab_xyz(x);
    z = LAB_CONSTANTS.Zn * lab_xyz(z);
    r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
    g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
    b = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);
    // r = limit(r, 0, 255);
    // g = limit(g, 0, 255);
    // b = limit(b, 0, 255);
    return [r, g, b];
  };

  xyz_rgb = function(r) {
    return round(255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow(r, 1 / 2.4) - 0.055));
  };

  lab_xyz = function(t) {
    if (t > LAB_CONSTANTS.t1) {
      return t * t * t;
    } else {
      return LAB_CONSTANTS.t2 * (t - LAB_CONSTANTS.t0);
    }
  };

  LAB_CONSTANTS = {
    Kn: 18,
    Xn: 0.950470,
    Yn: 1,
    Zn: 1.088830,
    t0: 0.137931034,
    t1: 0.206896552,
    t2: 0.12841855,
    t3: 0.008856452
  };

  PI = Math.PI, round = Math.round, cos = Math.cos, floor = Math.floor, pow = Math.pow, log = Math.log, sin = Math.sin, sqrt = Math.sqrt, atan2 = Math.atan2, max = Math.max, abs = Math.abs;

  TWOPI = PI * 2;

  PITHIRD = PI / 3;

  DEG2RAD = PI / 180;

  RAD2DEG = 180 / PI;


  tagRgbClipped = function(rgb) {
    rgb.clipped = is_rgb_clipped(rgb);
    return rgb;
  }

  is_rgb_clipped = function(rgb) {
    for (var i=0; i < rgb.length; i++) {
      if (i < 3) {
        if (rgb[i] < 0 || rgb[i] > 255) {
          return true;
        }
      } else if (i === 3) {
        if (rgb[i] < 0 || rgb[i] > 1) {
          return true;
        }
      }
    }
    return false;
  };