/* 
 * Utils
 * Martin's senile little utility belt library for being an #omyac
 * Please do not build life support systems with it.
 * (c) 2014 Q42
 * http://q42.com | @q42
 * Written by Martin Kool
 * martin@q42.nl | @mrtnkl
 */
function Utility() {
  var def = {
  isDoubleTapBug: function(evt) {
    if (!('ontouchstart' in document.documentElement)) return false;
    if (!evt.originalEvent.touches) {
      evt.preventDefault();
      evt.stopPropagation();
      return true;
    }
    return false;
  },
  touchEnded: function() {
    touchEndedSinceTap = true;
  },
  isTouch: function() {
    return 'ontouchstart' in document.documentElement;
  },
  padLeft: function (nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
  },
  trim: function (s) {
    return s.replace(/^\s*|\s*$/gi, '');
  },
  between: function (min, max, decimals) {
    if (decimals)
      return ((Math.random() * (max - min)) + min).toFixed(decimals) * 1;
    return Math.floor((Math.random() * (max - min + 1)) + min);
  },
  shuffleSimple: function(sourceArray) {
    sourceArray.sort(function() { return .5 - Math.random(); });
    return sourceArray;
  },
  shuffle: function (sourceArray) {
    for (var n = 0; n < sourceArray.length - 1; n++) {
      var k = n + Math.floor(Math.random() * (sourceArray.length - n));

      var temp = sourceArray[k];
      sourceArray[k] = sourceArray[n];
      sourceArray[n] = temp;
    }
    return sourceArray;
  },
  index: function (obj, i) {
    var j = 0;
    for (var name in obj) {
      if (j == i)
        return obj[name];
      j++;
    }
  },
  areArraysEqual: function(arr1, arr2) {
    if (!arr1 || !arr2) return false;
    return arr1.join('|') === arr2.join('|'); // dirty but enough
  },
  count: function (obj) {
    var count = 0;
    for (var name in obj)
      count++;
    return count;
  },
  eat: function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },
  pick: function (arr) {
    var drawFromArr = arr;
    if (arr.constructor == Object) {
      drawFromArr = [];
      for (var id in arr)
        drawFromArr.push(id);
    }
    var drawIndex = Utils.between(0, drawFromArr.length - 1);
    if (drawFromArr.length == 0)
      return null;
    return drawFromArr[drawIndex];
  },
  draw: function (arr, optionalValueToMatch) {
    var drawFromArr = arr;
    if (arr.constructor == Object) {
      drawFromArr = [];
      for (var id in arr)
        drawFromArr.push(id);
    }
    if (drawFromArr.length == 0)
      return null;
    var drawIndex = Utils.between(0, drawFromArr.length - 1);
    // if a value was given, find that one
    if (optionalValueToMatch != undefined) {
      var foundMatch = false;
      for (var i = 0; i < drawFromArr.length; i++) {
        if (drawFromArr[i] == optionalValueToMatch) {
          drawIndex = i;
          foundMatch = true;
          break;
        }
      }
      if (!foundMatch)
        return null;
    }
    var value = drawFromArr[drawIndex];
    drawFromArr.splice(drawIndex, 1);
    return value;
  },
  // removes the given value from arr
  removeFromArray: function (arr, val) {
    if (arr.length == 0)
      return null;
    var foundMatch = false, drawIndex = -1;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        drawIndex = i;
        foundMatch = true;
        break;
      }
    }
    if (!foundMatch)
      return null;
    var value = arr[drawIndex];
    arr.splice(drawIndex, 1);
    return value;
  },
  toArray: function (obj) {
    var arr = [];
    for (var id in obj)
      arr.push(id);
    return arr;
  },
  fillArray: function(min, max, repeatEachValue) {
    if (!repeatEachValue)
      repeatEachValue = 1;
    var arr = new Array();
    for (var repeat=0; repeat<repeatEachValue; repeat++)
      for (var i=min; i<=max; i++)
        arr.push(i);
    return arr;
  },
  contains: function(arr, item) {
    for (var i=0; i<arr.length; i++)
      if (arr[i] == item)
        return true;
    return false;
  },
  setCookie: function(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toGMTString();
    } else
      var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
  },
  getCookie: function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for ( var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ')
        c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0)
        return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  clearCookie: function(name) {
    this.setCookie(name, "", -1);
  },
  cssVendor: function($el, prop, value) {
    switch (prop) {
      case 'opacity':
        if ($.browser.ie) {
          $el.css('-ms-filter', '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + Math.round(value * 100) + ')"');
        }
        else
          $el.css(prop, value);
        break;
      default:
        var prefixes = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
        for (var i=0; i<prefixes.length; i++) {
          $el.css(prefixes[i] + prop, value);
        }
        break;
    }
  },
  createCSS: function(s, id) {
    id = id || 'tempcss';
    $('#' + id).remove();
    var style = '<style id="' + id + '">' + s + '</style>';
    $('head').first().append($(style));
  },
  setColorScheme: function(c1) {
    var c2 = Colors.getComplementary(c1),
        lum = 0.1,
        c1lum = Colors.luminateHex(c1, lum),
        c2lum = Colors.luminateHex(c2, lum);
    var css = '' +
      '.odd  .tile-1 .inner { background-color: ' + c1 + '; }' +
      '.even .tile-1 .inner { background-color: ' + c1lum + '; }' +
      '.odd  .tile-2 .inner { background-color: ' + c2 + '; }' +
      '.even .tile-2 .inner { background-color: ' + c2lum + '; }';
    Utils.createCSS(css);
  }

  };
  for (var o in def)
    this[o] = def[o];
}

var Utils = new Utility();

var Colors = new (function() {
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbToHex(r, g, b) {
    if (typeof r == 'object') {
      g = r.g;
      b = r.b;
      r = r.r;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function colorToRgb(color) {
    if (!isNaN(color))
      color = PALETTE[color];
    return hexToRgb(color);
  }

  function colorsMatch(c1, c2) {
    if (c1.r != c2.r) return false;
    if (c1.g != c2.g) return false;
    if (c1.b != c2.b) return false;
    return true;
  }
 
  function getComplementary(rgb) {
    var asHex = false;
    if (typeof rgb == 'string')
      asHex = true;
    if (asHex)
      rgb = hexToRgb(rgb);
    var comp = rgbToHsv(rgb);
    comp.hue = hueShift(comp.hue, 180.0);
    var result = hsvToRgb(comp);
    if (asHex)
      result = rgbToHex(result);
    return result;
  }

  function rgbToHsv(rgb) {
      hsv = new Object();
      max=max3(rgb.r,rgb.g,rgb.b);
      dif=max-min3(rgb.r,rgb.g,rgb.b);
      hsv.saturation=(max==0.0)?0:(100*dif/max);
      if (hsv.saturation==0) hsv.hue=0;
      else if (rgb.r==max) hsv.hue=60.0*(rgb.g-rgb.b)/dif;
      else if (rgb.g==max) hsv.hue=120.0+60.0*(rgb.b-rgb.r)/dif;
      else if (rgb.b==max) hsv.hue=240.0+60.0*(rgb.r-rgb.g)/dif;
      if (hsv.hue<0.0) hsv.hue+=360.0;
      hsv.value=Math.round(max*100/255);
      hsv.hue=Math.round(hsv.hue);
      hsv.saturation=Math.round(hsv.saturation);
      return hsv;
  }

  // rgbToHsv and hsvToRgb are based on Color Match Remix [http://color.twysted.net/]
  // which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
  function hsvToRgb(hsv) {
      var rgb=new Object();
      if (hsv.saturation==0) {
          rgb.r=rgb.g=rgb.b=Math.round(hsv.value*2.55);
      } else {
          hsv.hue/=60;
          hsv.saturation/=100;
          hsv.value/=100;
          i=Math.floor(hsv.hue);
          f=hsv.hue-i;
          p=hsv.value*(1-hsv.saturation);
          q=hsv.value*(1-hsv.saturation*f);
          t=hsv.value*(1-hsv.saturation*(1-f));
          switch(i) {
          case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break;
          case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break;
          case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break;
          case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break;
          case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break;
          default: rgb.r=hsv.value; rgb.g=p; rgb.b=q;
          }
          rgb.r=Math.round(rgb.r*255);
          rgb.g=Math.round(rgb.g*255);
          rgb.b=Math.round(rgb.b*255);
      }
      return rgb;
  }

  function luminateHex (hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;
    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i*2,2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00"+c).substr(c.length);
    }
    return rgb;
  }

  function hueShift(h,s) { 
      h+=s; while (h>=360.0) h-=360.0; while (h<0.0) h+=360.0; return h; 
  }

  function min3(a,b,c) { 
      return (a<b)?((a<c)?a:c):((b<c)?b:c); 
  } 
  function max3(a,b,c) { 
      return (a>b)?((a>c)?a:c):((b>c)?b:c); 
  }

  this.hexToRgb = hexToRgb;
  this.componentToHex = componentToHex;
  this.rgbToHex = rgbToHex;
  this.colorToRgb = colorToRgb;
  this.colorsMatch = colorsMatch;
  this.getComplementary = getComplementary;
  this.rgbToHsv = rgbToHsv;
  this.hsvToRgb = hsvToRgb;
  this.luminateHex = luminateHex;
})();

window.$ = window.$ || {};
$.browser = {};
$.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
$.browser.android = /android/.test(navigator.userAgent.toLowerCase());
$.browser.safari = /safari/.test(navigator.userAgent.toLowerCase());
$.browser.ipad = /ipad/.test(navigator.userAgent.toLowerCase());
$.browser.iphone = /iphone|ipod/.test(navigator.userAgent.toLowerCase());
$.browser.ios = /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase());
$.browser.ie = /msie/.test(navigator.userAgent.toLowerCase());