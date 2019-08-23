(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var AudioFFT = require('../lib/index')

window.AudioFFT = AudioFFT.default

},{"../lib/index":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _color = require("@jiaminghi/color");

var _bezierCurve = require("@jiaminghi/bezier-curve");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @description Class of AudioFFT
 * @param {Object} canvas Canvas DOM
 * @param {Object} config configuration
 * @return {AudioFft} AudioFft Instance
 */
var AudioFFT = function AudioFFT(canvas) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  _classCallCheck(this, AudioFFT);

  if (!canvas) {
    console.warn('AudioFft: Missing parameters!');
    return false;
  } // Init config


  var defaultConfig = {
    /**
     * @description Analyser fast fourier transform
     * @type {Number}
     * @default analyserFFT = 2048
     */
    analyserFFT: 2048,

    /**
     * @description Spring Mode
     * @type {Boolean}
     * @default spring = false
     */
    spring: false,

    /**
     * @description Wave Mode
     * @type {Boolean}
     * @default wave = false
     */
    wave: false,

    /**
     * @description Symmetry Mode
     * @type {Boolean}
     * @default symmetry = false
     */
    symmetry: false,

    /**
     * @description Whether to show pick
     * @type {Boolean}
     * @default pick = true
     */
    pick: true,

    /**
     * @description Whether to enable color transition
     * @type {Boolean}
     * @default colorTransition = false
     */
    colorTransition: false,

    /**
     * @description Frequency colors
     * @type {Array<String>}
     * @default colors = ['#6ed4d3', '#f5738f', '#4bb7e4']
     * @example colors = ['red', '#6ed4d3', 'rgb(100, 100, 100)', 'rgba(100, 100, 100, 1)']
     */
    colors: ['#6ed4d3', '#f5738f', '#4bb7e4'],

    /**
     * @description Color opacity
     * @type {Number}
     * @default opacity = 1
     */
    opacity: 1,

    /**
     * @description Color transition frame
     * @type {Number}
     * @default transitionFrame = 300
     */
    transitionFrame: 300,

    /**
     * @description Column gap
     * @type {Number}
     * @default columnGap = 5
     */
    columnGap: 5,

    /**
     * @description Column width
     * @type {Number}
     * @default columnWidth = 10
     */
    columnWidth: 10,

    /**
     * @description Swing scale
     * @type {Number}
     * @default swingScale = 1
     */
    swingScale: 1
  };
  Object.assign(this, defaultConfig, config); // Init canvas

  this.ctx = canvas.getContext('2d');
  this.canvasWH = [0, 0];
  var clientWidth = canvas.clientWidth,
      clientHeight = canvas.clientHeight;
  this.canvasWH[0] = clientWidth;
  this.canvasWH[1] = clientHeight;
  canvas.setAttribute('width', clientWidth);
  canvas.setAttribute('height', clientHeight); // Init audio

  this.audios = new Map();
  this.frequency = [];
  this.lastFrequency = [];
  this.audioAnalyser = null;
  this.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // ConfigAble Not

  this.animation = false;
  this.transitionColorIndex = 0;
  this.transitionColorFrame = 0;
};

exports["default"] = AudioFFT;

AudioFFT.prototype.createAudioMediaAnalyser = function (audio) {
  var audioCtx = this.audioCtx,
      analyserFFT = this.analyserFFT;
  var audioSource = audioCtx.createMediaElementSource(audio);
  var audioAnalyser = audioCtx.createAnalyser();
  audioSource.connect(audioAnalyser);
  audioAnalyser.connect(audioCtx.destination);
  audioAnalyser.fftSize = analyserFFT;
  return audioAnalyser;
};
/**
 * @description Set audio instance
 * @param audio Audio instance
 * @return {Undefined} Void
 */


AudioFFT.prototype.setAudio = function (audio) {
  if (!audio) {
    console.warn('AudioFft.setAudio: Missing parameters!');
    return false;
  }

  var audios = this.audios;
  var audioAnalyser = this.audioAnalyser = audios.get(audio) || this.createAudioMediaAnalyser(audio);
  this.frequency = new Uint8Array(audioAnalyser.frequencyBinCount);
};
/**
 * @description Draw frequency
 * @return {Undefined} Void
 */


AudioFFT.prototype.draw = function () {
  var animation = this.animation;
  if (!animation) this.loop();
};

AudioFFT.prototype.loop = function () {
  var spring = this.spring,
      loop = this.loop;

  if (spring) {
    this.drawSpringFrequency();
  } else {
    this.drawNormalFrequency();
  }

  this.animation = requestAnimationFrame(loop.bind(this));
};

AudioFFT.prototype.getColumnNum = function () {
  var canvasWH = this.canvasWH,
      columnWidth = this.columnWidth,
      columnGap = this.columnGap;
  return Math.ceil(canvasWH[0] / (columnWidth + columnGap));
};
/**
 * @description Clear canvas
 * @return {Undefined} Void
 */


AudioFFT.prototype.clear = function () {
  var canvasWH = this.canvasWH,
      ctx = this.ctx;
  ctx.clearRect.apply(ctx, [0, 0].concat(_toConsumableArray(canvasWH)));
};

AudioFFT.prototype.getFrequency = function () {
  var audioAnalyser = this.audioAnalyser,
      frequency = this.frequency,
      swingScale = this.swingScale,
      symmetry = this.symmetry;
  var columnNum = this.getColumnNum();
  if (columnNum % 2 !== 0) columnNum++;
  audioAnalyser.getByteFrequencyData(frequency);
  frequency = frequency.slice(0, columnNum);

  if (symmetry) {
    frequency = frequency.slice(0, columnNum / 2);

    var reverse = _toConsumableArray(frequency).reverse();

    frequency = [].concat(_toConsumableArray(reverse), _toConsumableArray(frequency));
  }

  return frequency.map(function (n) {
    return n * parseFloat(swingScale);
  });
};

AudioFFT.prototype.getColor = function () {
  var ctx = this.ctx,
      canvasWH = this.canvasWH,
      colors = this.colors,
      colorTransition = this.colorTransition,
      opacity = this.opacity;
  if (colors.length === 1) colors = [colors[0], colors[0]];
  var colorNum = colors.length;
  colors = colors.map(function (color) {
    return (0, _color.fade)(color, opacity * 100);
  });
  var gradient = ctx.createLinearGradient(0, 0, 0, canvasWH[1]);

  if (!colorTransition) {
    var colorGap = 1 / (colorNum - 1);
    colors.forEach(function (color, i) {
      return gradient.addColorStop(0 + colorGap * i, color);
    });
    return gradient;
  }

  var transitionColorFrame = this.transitionColorFrame,
      transitionColorIndex = this.transitionColorIndex,
      transitionFrame = this.transitionFrame,
      spring = this.spring;
  var transitionColor = [colors[transitionColorIndex % colorNum], colors[(transitionColorIndex + 1) % colorNum], colors[(transitionColorIndex + 2) % colorNum]].map(function (color) {
    return (0, _color.getRgbaValue)(color);
  });
  var startColor = this.getTransitionColor(transitionColor[0], transitionColor[1], transitionColorFrame);
  var endColor = this.getTransitionColor(transitionColor[1], transitionColor[2], transitionColorFrame);

  if (spring) {
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(0.5, endColor);
    gradient.addColorStop(1, startColor);
  } else {
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
  }

  transitionColorFrame++;

  if (transitionFrame <= transitionColorFrame) {
    this.transitionColorFrame = 0;
    this.transitionColorIndex++;
  } else {
    this.transitionColorFrame = transitionColorFrame;
  }

  return gradient;
};

AudioFFT.prototype.getTransitionColor = function (start, end, frame) {
  var transitionFrame = this.transitionFrame;
  return (0, _color.getColorFromRgbValue)(start.map(function (v, i) {
    return (end[i] - v) / transitionFrame * frame + v;
  }));
};

AudioFFT.prototype.drawNormalFrequency = function () {
  var wave = this.wave;

  if (wave) {
    this.drawWaveFrequency();
    return;
  }

  this.clear();
  var columnWidth = this.columnWidth,
      columnGap = this.columnGap,
      ctx = this.ctx,
      lastFrequency = this.lastFrequency,
      canvasWH = this.canvasWH,
      pick = this.pick;
  var frequency = this.getFrequency();
  var color = this.getColor();
  var itemWidth = columnWidth + columnGap;
  frequency.forEach(function (height, i) {
    ctx.beginPath();
    var last = lastFrequency[i];
    var currentHeight = last;

    if (last && last >= height) {
      currentHeight--;
    } else if (!last || last < height) {
      currentHeight = height;
    }

    ctx.fillRect(itemWidth * i, canvasWH[1] - height, columnWidth, height);
    if (pick) ctx.fillRect(itemWidth * i, canvasWH[1] - currentHeight - 5, columnWidth, 2);
    ctx.fillStyle = color;
    lastFrequency[i] = currentHeight;
    ctx.closePath();
  });
};

AudioFFT.prototype.drawSpringFrequency = function () {
  var wave = this.wave;

  if (wave) {
    this.drawWaveFrequency(true);
    return;
  }

  this.clear();
  var columnWidth = this.columnWidth,
      columnGap = this.columnGap,
      ctx = this.ctx,
      lastFrequency = this.lastFrequency,
      canvasWH = this.canvasWH;
  var frequency = this.getFrequency();
  var color = this.getColor();
  var itemWidth = columnWidth + columnGap;
  frequency.forEach(function (height, i) {
    ctx.beginPath();
    ctx.fillRect(itemWidth * i, (canvasWH[1] - height) / 2, columnWidth, height);
    ctx.fillStyle = color;
    lastFrequency[i] = height;
    ctx.closePath();
  });
};

AudioFFT.prototype.drawWaveFrequency = function () {
  var spring = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  this.clear();
  var columnWidth = this.columnWidth,
      columnGap = this.columnGap,
      ctx = this.ctx,
      canvasWH = this.canvasWH;
  var frequency = this.getFrequency();
  var color = this.getColor();
  var itemWidth = columnWidth + columnGap;
  var points = [];

  if (spring) {
    var top = [],
        bottom = [];
    frequency.forEach(function (height, i) {
      return top[i] = [itemWidth * i, (canvasWH[1] - height) / 2];
    });
    frequency.forEach(function (height, i) {
      return bottom[i] = [itemWidth * i, (canvasWH[1] - height) / 2 + height];
    });
    bottom.reverse();
    points = [].concat(_toConsumableArray(top), _toConsumableArray(bottom));
  } else {
    frequency.forEach(function (height, i) {
      return points[i] = [itemWidth * i, canvasWH[1] - height];
    });
  }

  var bezierCurve = (0, _bezierCurve.polylineToBezierCurve)(points, spring);
  ctx.beginPath();
  ctx.moveTo(0, canvasWH[1]);
  ctx.lineTo.apply(ctx, _toConsumableArray(bezierCurve.splice(0, 1)[0]));
  bezierCurve.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        c1 = _ref2[0],
        c2 = _ref2[1],
        end = _ref2[2];

    ctx.bezierCurveTo.apply(ctx, _toConsumableArray(c1).concat(_toConsumableArray(c2), _toConsumableArray(end)));
  });

  if (!spring) {
    ctx.lineTo(canvasWH[0], canvasWH[1]);
    ctx.lineTo(0, canvasWH[1]);
  }

  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};
/**
 * @description Stop drawing
 * @return {Undefined} Void
 */


AudioFFT.prototype.stop = function () {
  var animation = this.animation;
  if (animation) cancelAnimationFrame(animation);
  this.animation = false;
};
/**
 * @description Update config
 * @return {Undefined} Void
 */


AudioFFT.prototype.updateConfig = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  Object.assign(this, config);
};
},{"@jiaminghi/bezier-curve":5,"@jiaminghi/color":7}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bezierCurveToPolyline = bezierCurveToPolyline;
exports.getBezierCurveLength = getBezierCurveLength;
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var sqrt = Math.sqrt,
    pow = Math.pow,
    ceil = Math.ceil,
    abs = Math.abs; // Initialize the number of points per curve

var defaultSegmentPointsNum = 50;
/**
 * @example data structure of bezierCurve
 * bezierCurve = [
 *  // Starting point of the curve
 *  [10, 10],
 *  // BezierCurve segment data (controlPoint1, controlPoint2, endPoint)
 *  [
 *    [20, 20], [40, 20], [50, 10]
 *  ],
 *  ...
 * ]
 */

/**
 * @description               Abstract the curve as a polyline consisting of N points
 * @param {Array} bezierCurve bezierCurve data
 * @param {Number} precision  calculation accuracy. Recommended for 1-20. Default = 5
 * @return {Object}           Calculation results and related data
 * @return {Array}            Option.segmentPoints Point data that constitutes a polyline after calculation
 * @return {Number}           Option.cycles Number of iterations
 * @return {Number}           Option.rounds The number of recursions for the last iteration
 */

function abstractBezierCurveToPolyline(bezierCurve) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  var segmentsNum = bezierCurve.length - 1;
  var startPoint = bezierCurve[0];
  var endPoint = bezierCurve[segmentsNum][2];
  var segments = bezierCurve.slice(1);
  var getSegmentTPointFuns = segments.map(function (seg, i) {
    var beginPoint = i === 0 ? startPoint : segments[i - 1][2];
    return createGetBezierCurveTPointFun.apply(void 0, [beginPoint].concat(_toConsumableArray(seg)));
  }); // Initialize the curve to a polyline

  var segmentPointsNum = new Array(segmentsNum).fill(defaultSegmentPointsNum);
  var segmentPoints = getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum); // Calculate uniformly distributed points by iteratively

  var result = calcUniformPointsByIteration(segmentPoints, getSegmentTPointFuns, segments, precision);
  result.segmentPoints.push(endPoint);
  return result;
}
/**
 * @description  Generate a method for obtaining corresponding point by t according to curve data
 * @param {Array} beginPoint    BezierCurve begin point. [x, y]
 * @param {Array} controlPoint1 BezierCurve controlPoint1. [x, y]
 * @param {Array} controlPoint2 BezierCurve controlPoint2. [x, y]
 * @param {Array} endPoint      BezierCurve end point. [x, y]
 * @return {Function} Expected function
 */


function createGetBezierCurveTPointFun(beginPoint, controlPoint1, controlPoint2, endPoint) {
  return function (t) {
    var tSubed1 = 1 - t;
    var tSubed1Pow3 = pow(tSubed1, 3);
    var tSubed1Pow2 = pow(tSubed1, 2);
    var tPow3 = pow(t, 3);
    var tPow2 = pow(t, 2);
    return [beginPoint[0] * tSubed1Pow3 + 3 * controlPoint1[0] * t * tSubed1Pow2 + 3 * controlPoint2[0] * tPow2 * tSubed1 + endPoint[0] * tPow3, beginPoint[1] * tSubed1Pow3 + 3 * controlPoint1[1] * t * tSubed1Pow2 + 3 * controlPoint2[1] * tPow2 * tSubed1 + endPoint[1] * tPow3];
  };
}
/**
 * @description Get the distance between two points
 * @param {Array} point1 BezierCurve begin point. [x, y]
 * @param {Array} point2 BezierCurve controlPoint1. [x, y]
 * @return {Number} Expected distance
 */


function getTwoPointDistance(_ref, _ref2) {
  var _ref3 = _slicedToArray(_ref, 2),
      ax = _ref3[0],
      ay = _ref3[1];

  var _ref4 = _slicedToArray(_ref2, 2),
      bx = _ref4[0],
      by = _ref4[1];

  return sqrt(pow(ax - bx, 2) + pow(ay - by, 2));
}
/**
 * @description Get the sum of the array of numbers
 * @param {Array} nums An array of numbers
 * @return {Number} Expected sum
 */


function getNumsSum(nums) {
  return nums.reduce(function (sum, num) {
    return sum + num;
  }, 0);
}
/**
 * @description Get the distance of multiple sets of points
 * @param {Array} segmentPoints Multiple sets of point data
 * @return {Array} Distance of multiple sets of point data
 */


function getSegmentPointsDistance(segmentPoints) {
  return segmentPoints.map(function (points, i) {
    return new Array(points.length - 1).fill(0).map(function (temp, j) {
      return getTwoPointDistance(points[j], points[j + 1]);
    });
  });
}
/**
 * @description Get the distance of multiple sets of points
 * @param {Array} segmentPoints Multiple sets of point data
 * @return {Array} Distance of multiple sets of point data
 */


function getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum) {
  return getSegmentTPointFuns.map(function (getSegmentTPointFun, i) {
    var tGap = 1 / segmentPointsNum[i];
    return new Array(segmentPointsNum[i]).fill('').map(function (foo, j) {
      return getSegmentTPointFun(j * tGap);
    });
  });
}
/**
 * @description Get the sum of deviations between line segment and the average length
 * @param {Array} segmentPointsDistance Segment length of polyline
 * @param {Number} avgLength            Average length of the line segment
 * @return {Number} Deviations
 */


function getAllDeviations(segmentPointsDistance, avgLength) {
  return segmentPointsDistance.map(function (seg) {
    return seg.map(function (s) {
      return abs(s - avgLength);
    });
  }).map(function (seg) {
    return getNumsSum(seg);
  }).reduce(function (total, v) {
    return total + v;
  }, 0);
}
/**
 * @description Calculate uniformly distributed points by iteratively
 * @param {Array} segmentPoints        Multiple setd of points that make up a polyline
 * @param {Array} getSegmentTPointFuns Functions of get a point on the curve with t
 * @param {Array} segments             BezierCurve data
 * @param {Number} precision           Calculation accuracy
 * @return {Object} Calculation results and related data
 * @return {Array}  Option.segmentPoints Point data that constitutes a polyline after calculation
 * @return {Number} Option.cycles Number of iterations
 * @return {Number} Option.rounds The number of recursions for the last iteration
 */


function calcUniformPointsByIteration(segmentPoints, getSegmentTPointFuns, segments, precision) {
  // The number of loops for the current iteration
  var rounds = 4; // Number of iterations

  var cycles = 1;

  var _loop = function _loop() {
    // Recalculate the number of points per curve based on the last iteration data
    var totalPointsNum = segmentPoints.reduce(function (total, seg) {
      return total + seg.length;
    }, 0); // Add last points of segment to calc exact segment length

    segmentPoints.forEach(function (seg, i) {
      return seg.push(segments[i][2]);
    });
    var segmentPointsDistance = getSegmentPointsDistance(segmentPoints);
    var lineSegmentNum = segmentPointsDistance.reduce(function (total, seg) {
      return total + seg.length;
    }, 0);
    var segmentlength = segmentPointsDistance.map(function (seg) {
      return getNumsSum(seg);
    });
    var totalLength = getNumsSum(segmentlength);
    var avgLength = totalLength / lineSegmentNum; // Check if precision is reached

    var allDeviations = getAllDeviations(segmentPointsDistance, avgLength);
    if (allDeviations <= precision) return "break";
    totalPointsNum = ceil(avgLength / precision * totalPointsNum * 1.1);
    var segmentPointsNum = segmentlength.map(function (length) {
      return ceil(length / totalLength * totalPointsNum);
    }); // Calculate the points after redistribution

    segmentPoints = getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum);
    totalPointsNum = segmentPoints.reduce(function (total, seg) {
      return total + seg.length;
    }, 0);
    var segmentPointsForLength = JSON.parse(JSON.stringify(segmentPoints));
    segmentPointsForLength.forEach(function (seg, i) {
      return seg.push(segments[i][2]);
    });
    segmentPointsDistance = getSegmentPointsDistance(segmentPointsForLength);
    lineSegmentNum = segmentPointsDistance.reduce(function (total, seg) {
      return total + seg.length;
    }, 0);
    segmentlength = segmentPointsDistance.map(function (seg) {
      return getNumsSum(seg);
    });
    totalLength = getNumsSum(segmentlength);
    avgLength = totalLength / lineSegmentNum;
    var stepSize = 1 / totalPointsNum / 10; // Recursively for each segment of the polyline

    getSegmentTPointFuns.forEach(function (getSegmentTPointFun, i) {
      var currentSegmentPointsNum = segmentPointsNum[i];
      var t = new Array(currentSegmentPointsNum).fill('').map(function (foo, j) {
        return j / segmentPointsNum[i];
      }); // Repeated recursive offset

      for (var r = 0; r < rounds; r++) {
        var distance = getSegmentPointsDistance([segmentPoints[i]])[0];
        var deviations = distance.map(function (d) {
          return d - avgLength;
        });
        var offset = 0;

        for (var j = 0; j < currentSegmentPointsNum; j++) {
          if (j === 0) return;
          offset += deviations[j - 1];
          t[j] -= stepSize * offset;
          if (t[j] > 1) t[j] = 1;
          if (t[j] < 0) t[j] = 0;
          segmentPoints[i][j] = getSegmentTPointFun(t[j]);
        }
      }
    });
    rounds *= 4;
    cycles++;
  };

  do {
    var _ret = _loop();

    if (_ret === "break") break;
  } while (rounds <= 1025);

  segmentPoints = segmentPoints.reduce(function (all, seg) {
    return all.concat(seg);
  }, []);
  return {
    segmentPoints: segmentPoints,
    cycles: cycles,
    rounds: rounds
  };
}
/**
 * @description Get the polyline corresponding to the Bezier curve
 * @param {Array} bezierCurve BezierCurve data
 * @param {Number} precision  Calculation accuracy. Recommended for 1-20. Default = 5
 * @return {Array|Boolean} Point data that constitutes a polyline after calculation (Invalid input will return false)
 */


function bezierCurveToPolyline(bezierCurve) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

  if (!bezierCurve) {
    console.error('bezierCurveToPolyline: Missing parameters!');
    return false;
  }

  if (!(bezierCurve instanceof Array)) {
    console.error('bezierCurveToPolyline: Parameter bezierCurve must be an array!');
    return false;
  }

  if (typeof precision !== 'number') {
    console.error('bezierCurveToPolyline: Parameter precision must be a number!');
    return false;
  }

  var _abstractBezierCurveT = abstractBezierCurveToPolyline(bezierCurve, precision),
      segmentPoints = _abstractBezierCurveT.segmentPoints;

  return segmentPoints;
}
/**
 * @description Get the bezier curve length
 * @param {Array} bezierCurve bezierCurve data
 * @param {Number} precision  calculation accuracy. Recommended for 5-10. Default = 5
 * @return {Number|Boolean} BezierCurve length (Invalid input will return false)
 */


function getBezierCurveLength(bezierCurve) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

  if (!bezierCurve) {
    console.error('getBezierCurveLength: Missing parameters!');
    return false;
  }

  if (!(bezierCurve instanceof Array)) {
    console.error('getBezierCurveLength: Parameter bezierCurve must be an array!');
    return false;
  }

  if (typeof precision !== 'number') {
    console.error('getBezierCurveLength: Parameter precision must be a number!');
    return false;
  }

  var _abstractBezierCurveT2 = abstractBezierCurveToPolyline(bezierCurve, precision),
      segmentPoints = _abstractBezierCurveT2.segmentPoints; // Calculate the total length of the points that make up the polyline


  var pointsDistance = getSegmentPointsDistance([segmentPoints])[0];
  var length = getNumsSum(pointsDistance);
  return length;
}

var _default = bezierCurveToPolyline;
exports["default"] = _default;
},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * @description Abstract the polyline formed by N points into a set of bezier curve
 * @param {Array} polyline A set of points that make up a polyline
 * @param {Boolean} close  Closed curve
 * @param {Number} offsetA Smoothness
 * @param {Number} offsetB Smoothness
 * @return {Array|Boolean} A set of bezier curve (Invalid input will return false)
 */
function polylineToBezierCurve(polyline) {
  var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var offsetA = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.25;
  var offsetB = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25;

  if (!(polyline instanceof Array)) {
    console.error('polylineToBezierCurve: Parameter polyline must be an array!');
    return false;
  }

  if (polyline.length <= 2) {
    console.error('polylineToBezierCurve: Converting to a curve requires at least 3 points!');
    return false;
  }

  var startPoint = polyline[0];
  var bezierCurveLineNum = polyline.length - 1;
  var bezierCurvePoints = new Array(bezierCurveLineNum).fill(0).map(function (foo, i) {
    return [].concat(_toConsumableArray(getBezierCurveLineControlPoints(polyline, i, close, offsetA, offsetB)), [polyline[i + 1]]);
  });
  if (close) closeBezierCurve(bezierCurvePoints, startPoint);
  bezierCurvePoints.unshift(polyline[0]);
  return bezierCurvePoints;
}
/**
 * @description Get the control points of the Bezier curve
 * @param {Array} polyline A set of points that make up a polyline
 * @param {Number} index   The index of which get controls points's point in polyline
 * @param {Boolean} close  Closed curve
 * @param {Number} offsetA Smoothness
 * @param {Number} offsetB Smoothness
 * @return {Array} Control points
 */


function getBezierCurveLineControlPoints(polyline, index) {
  var close = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var offsetA = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25;
  var offsetB = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.25;
  var pointNum = polyline.length;
  if (pointNum < 3 || index >= pointNum) return;
  var beforePointIndex = index - 1;
  if (beforePointIndex < 0) beforePointIndex = close ? pointNum + beforePointIndex : 0;
  var afterPointIndex = index + 1;
  if (afterPointIndex >= pointNum) afterPointIndex = close ? afterPointIndex - pointNum : pointNum - 1;
  var afterNextPointIndex = index + 2;
  if (afterNextPointIndex >= pointNum) afterNextPointIndex = close ? afterNextPointIndex - pointNum : pointNum - 1;
  var pointBefore = polyline[beforePointIndex];
  var pointMiddle = polyline[index];
  var pointAfter = polyline[afterPointIndex];
  var pointAfterNext = polyline[afterNextPointIndex];
  return [[pointMiddle[0] + offsetA * (pointAfter[0] - pointBefore[0]), pointMiddle[1] + offsetA * (pointAfter[1] - pointBefore[1])], [pointAfter[0] - offsetB * (pointAfterNext[0] - pointMiddle[0]), pointAfter[1] - offsetB * (pointAfterNext[1] - pointMiddle[1])]];
}
/**
 * @description Get the last curve of the closure
 * @param {Array} bezierCurve A set of sub-curve
 * @param {Array} startPoint  Start point
 * @return {Array} The last curve for closure
 */


function closeBezierCurve(bezierCurve, startPoint) {
  var firstSubCurve = bezierCurve[0];
  var lastSubCurve = bezierCurve.slice(-1)[0];
  bezierCurve.push([getSymmetryPoint(lastSubCurve[1], lastSubCurve[2]), getSymmetryPoint(firstSubCurve[0], startPoint), startPoint]);
  return bezierCurve;
}
/**
 * @description Get the symmetry point
 * @param {Array} point       Symmetric point
 * @param {Array} centerPoint Symmetric center
 * @return {Array} Symmetric point
 */


function getSymmetryPoint(point, centerPoint) {
  var _point = _slicedToArray(point, 2),
      px = _point[0],
      py = _point[1];

  var _centerPoint = _slicedToArray(centerPoint, 2),
      cx = _centerPoint[0],
      cy = _centerPoint[1];

  var minusX = cx - px;
  var minusY = cy - py;
  return [cx + minusX, cy + minusY];
}

var _default = polylineToBezierCurve;
exports["default"] = _default;
},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "bezierCurveToPolyline", {
  enumerable: true,
  get: function get() {
    return _bezierCurveToPolyline.bezierCurveToPolyline;
  }
});
Object.defineProperty(exports, "getBezierCurveLength", {
  enumerable: true,
  get: function get() {
    return _bezierCurveToPolyline.getBezierCurveLength;
  }
});
Object.defineProperty(exports, "polylineToBezierCurve", {
  enumerable: true,
  get: function get() {
    return _polylineToBezierCurve["default"];
  }
});
exports["default"] = void 0;

var _bezierCurveToPolyline = require("./core/bezierCurveToPolyline");

var _polylineToBezierCurve = _interopRequireDefault(require("./core/polylineToBezierCurve"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  bezierCurveToPolyline: _bezierCurveToPolyline.bezierCurveToPolyline,
  getBezierCurveLength: _bezierCurveToPolyline.getBezierCurveLength,
  polylineToBezierCurve: _polylineToBezierCurve["default"]
};
exports["default"] = _default;
},{"./core/bezierCurveToPolyline":3,"./core/polylineToBezierCurve":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = new Map([['transparent', 'rgba(0,0,0,0)'], ['black', '#000000'], ['silver', '#C0C0C0'], ['gray', '#808080'], ['white', '#FFFFFF'], ['maroon', '#800000'], ['red', '#FF0000'], ['purple', '#800080'], ['fuchsia', '#FF00FF'], ['green', '#008000'], ['lime', '#00FF00'], ['olive', '#808000'], ['yellow', '#FFFF00'], ['navy', '#000080'], ['blue', '#0000FF'], ['teal', '#008080'], ['aqua', '#00FFFF'], ['aliceblue', '#f0f8ff'], ['antiquewhite', '#faebd7'], ['aquamarine', '#7fffd4'], ['azure', '#f0ffff'], ['beige', '#f5f5dc'], ['bisque', '#ffe4c4'], ['blanchedalmond', '#ffebcd'], ['blueviolet', '#8a2be2'], ['brown', '#a52a2a'], ['burlywood', '#deb887'], ['cadetblue', '#5f9ea0'], ['chartreuse', '#7fff00'], ['chocolate', '#d2691e'], ['coral', '#ff7f50'], ['cornflowerblue', '#6495ed'], ['cornsilk', '#fff8dc'], ['crimson', '#dc143c'], ['cyan', '#00ffff'], ['darkblue', '#00008b'], ['darkcyan', '#008b8b'], ['darkgoldenrod', '#b8860b'], ['darkgray', '#a9a9a9'], ['darkgreen', '#006400'], ['darkgrey', '#a9a9a9'], ['darkkhaki', '#bdb76b'], ['darkmagenta', '#8b008b'], ['darkolivegreen', '#556b2f'], ['darkorange', '#ff8c00'], ['darkorchid', '#9932cc'], ['darkred', '#8b0000'], ['darksalmon', '#e9967a'], ['darkseagreen', '#8fbc8f'], ['darkslateblue', '#483d8b'], ['darkslategray', '#2f4f4f'], ['darkslategrey', '#2f4f4f'], ['darkturquoise', '#00ced1'], ['darkviolet', '#9400d3'], ['deeppink', '#ff1493'], ['deepskyblue', '#00bfff'], ['dimgray', '#696969'], ['dimgrey', '#696969'], ['dodgerblue', '#1e90ff'], ['firebrick', '#b22222'], ['floralwhite', '#fffaf0'], ['forestgreen', '#228b22'], ['gainsboro', '#dcdcdc'], ['ghostwhite', '#f8f8ff'], ['gold', '#ffd700'], ['goldenrod', '#daa520'], ['greenyellow', '#adff2f'], ['grey', '#808080'], ['honeydew', '#f0fff0'], ['hotpink', '#ff69b4'], ['indianred', '#cd5c5c'], ['indigo', '#4b0082'], ['ivory', '#fffff0'], ['khaki', '#f0e68c'], ['lavender', '#e6e6fa'], ['lavenderblush', '#fff0f5'], ['lawngreen', '#7cfc00'], ['lemonchiffon', '#fffacd'], ['lightblue', '#add8e6'], ['lightcoral', '#f08080'], ['lightcyan', '#e0ffff'], ['lightgoldenrodyellow', '#fafad2'], ['lightgray', '#d3d3d3'], ['lightgreen', '#90ee90'], ['lightgrey', '#d3d3d3'], ['lightpink', '#ffb6c1'], ['lightsalmon', '#ffa07a'], ['lightseagreen', '#20b2aa'], ['lightskyblue', '#87cefa'], ['lightslategray', '#778899'], ['lightslategrey', '#778899'], ['lightsteelblue', '#b0c4de'], ['lightyellow', '#ffffe0'], ['limegreen', '#32cd32'], ['linen', '#faf0e6'], ['magenta', '#ff00ff'], ['mediumaquamarine', '#66cdaa'], ['mediumblue', '#0000cd'], ['mediumorchid', '#ba55d3'], ['mediumpurple', '#9370db'], ['mediumseagreen', '#3cb371'], ['mediumslateblue', '#7b68ee'], ['mediumspringgreen', '#00fa9a'], ['mediumturquoise', '#48d1cc'], ['mediumvioletred', '#c71585'], ['midnightblue', '#191970'], ['mintcream', '#f5fffa'], ['mistyrose', '#ffe4e1'], ['moccasin', '#ffe4b5'], ['navajowhite', '#ffdead'], ['oldlace', '#fdf5e6'], ['olivedrab', '#6b8e23'], ['orange', '#ffa500'], ['orangered', '#ff4500'], ['orchid', '#da70d6'], ['palegoldenrod', '#eee8aa'], ['palegreen', '#98fb98'], ['paleturquoise', '#afeeee'], ['palevioletred', '#db7093'], ['papayawhip', '#ffefd5'], ['peachpuff', '#ffdab9'], ['peru', '#cd853f'], ['pink', '#ffc0cb'], ['plum', '#dda0dd'], ['powderblue', '#b0e0e6'], ['rosybrown', '#bc8f8f'], ['royalblue', '#4169e1'], ['saddlebrown', '#8b4513'], ['salmon', '#fa8072'], ['sandybrown', '#f4a460'], ['seagreen', '#2e8b57'], ['seashell', '#fff5ee'], ['sienna', '#a0522d'], ['skyblue', '#87ceeb'], ['slateblue', '#6a5acd'], ['slategray', '#708090'], ['slategrey', '#708090'], ['snow', '#fffafa'], ['springgreen', '#00ff7f'], ['steelblue', '#4682b4'], ['tan', '#d2b48c'], ['thistle', '#d8bfd8'], ['tomato', '#ff6347'], ['turquoise', '#40e0d0'], ['violet', '#ee82ee'], ['wheat', '#f5deb3'], ['whitesmoke', '#f5f5f5'], ['yellowgreen', '#9acd32']]);

exports["default"] = _default;
},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRgbValue = getRgbValue;
exports.getRgbaValue = getRgbaValue;
exports.getOpacity = getOpacity;
exports.toRgb = toRgb;
exports.toHex = toHex;
exports.getColorFromRgbValue = getColorFromRgbValue;
exports.darken = darken;
exports.lighten = lighten;
exports.fade = fade;
exports["default"] = void 0;

var _keywords = _interopRequireDefault(require("./config/keywords"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var hexReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
var rgbReg = /^(rgb|rgba|RGB|RGBA)/;
var rgbaReg = /^(rgba|RGBA)/;
/**
 * @description Color validator
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {String|Boolean} Valid color Or false
 */

function validator(color) {
  var isHex = hexReg.test(color);
  var isRgb = rgbReg.test(color);
  if (isHex || isRgb) return color;
  color = getColorByKeyword(color);

  if (!color) {
    console.error('Color: Invalid color!');
    return false;
  }

  return color;
}
/**
 * @description Get color by keyword
 * @param {String} keyword Color keyword like red, green and etc.
 * @return {String|Boolean} Hex or rgba color (Invalid keyword will return false)
 */


function getColorByKeyword(keyword) {
  if (!keyword) {
    console.error('getColorByKeywords: Missing parameters!');
    return false;
  }

  if (!_keywords["default"].has(keyword)) return false;
  return _keywords["default"].get(keyword);
}
/**
 * @description Get the Rgb value of the color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Array<Number>|Boolean} Rgb value of the color (Invalid input will return false)
 */


function getRgbValue(color) {
  if (!color) {
    console.error('getRgbValue: Missing parameters!');
    return false;
  }

  color = validator(color);
  if (!color) return false;
  var isHex = hexReg.test(color);
  var isRgb = rgbReg.test(color);
  var lowerColor = color.toLowerCase();
  if (isHex) return getRgbValueFromHex(lowerColor);
  if (isRgb) return getRgbValueFromRgb(lowerColor);
}
/**
 * @description Get the rgb value of the hex color
 * @param {String} color Hex color
 * @return {Array<Number>} Rgb value of the color
 */


function getRgbValueFromHex(color) {
  color = color.replace('#', '');
  if (color.length === 3) color = Array.from(color).map(function (hexNum) {
    return hexNum + hexNum;
  }).join('');
  color = color.split('');
  return new Array(3).fill(0).map(function (t, i) {
    return parseInt("0x".concat(color[i * 2]).concat(color[i * 2 + 1]));
  });
}
/**
 * @description Get the rgb value of the rgb/rgba color
 * @param {String} color Hex color
 * @return {Array} Rgb value of the color
 */


function getRgbValueFromRgb(color) {
  return color.replace(/rgb\(|rgba\(|\)/g, '').split(',').slice(0, 3).map(function (n) {
    return parseInt(n);
  });
}
/**
 * @description Get the Rgba value of the color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Array<Number>|Boolean} Rgba value of the color (Invalid input will return false)
 */


function getRgbaValue(color) {
  if (!color) {
    console.error('getRgbaValue: Missing parameters!');
    return false;
  }

  var colorValue = getRgbValue(color);
  if (!colorValue) return false;
  colorValue.push(getOpacity(color));
  return colorValue;
}
/**
 * @description Get the opacity of color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Number|Boolean} Color opacity (Invalid input will return false)
 */


function getOpacity(color) {
  if (!color) {
    console.error('getOpacity: Missing parameters!');
    return false;
  }

  color = validator(color);
  if (!color) return false;
  var isRgba = rgbaReg.test(color);
  if (!isRgba) return 1;
  color = color.toLowerCase();
  return Number(color.split(',').slice(-1)[0].replace(/[)|\s]/g, ''));
}
/**
 * @description Convert color to Rgb|Rgba color
 * @param {String} color   Hex|Rgb|Rgba color or color keyword
 * @param {Number} opacity The opacity of color
 * @return {String|Boolean} Rgb|Rgba color (Invalid input will return false)
 */


function toRgb(color, opacity) {
  if (!color) {
    console.error('toRgb: Missing parameters!');
    return false;
  }

  var rgbValue = getRgbValue(color);
  if (!rgbValue) return false;
  var addOpacity = typeof opacity === 'number';
  if (addOpacity) return 'rgba(' + rgbValue.join(',') + ",".concat(opacity, ")");
  return 'rgb(' + rgbValue.join(',') + ')';
}
/**
 * @description Convert color to Hex color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {String|Boolean} Hex color (Invalid input will return false)
 */


function toHex(color) {
  if (!color) {
    console.error('toHex: Missing parameters!');
    return false;
  }

  if (hexReg.test(color)) return color;
  color = getRgbValue(color);
  if (!color) return false;
  return '#' + color.map(function (n) {
    return Number(n).toString(16);
  }).map(function (n) {
    return n === '0' ? '00' : n;
  }).join('');
}
/**
 * @description Get Color from Rgb|Rgba value
 * @param {Array<Number>} value Rgb|Rgba color value
 * @return {String|Boolean} Rgb|Rgba color (Invalid input will return false)
 */


function getColorFromRgbValue(value) {
  if (!value) {
    console.error('getColorFromRgbValue: Missing parameters!');
    return false;
  }

  var valueLength = value.length;

  if (valueLength !== 3 && valueLength !== 4) {
    console.error('getColorFromRgbValue: Value is illegal!');
    return false;
  }

  var color = valueLength === 3 ? 'rgb(' : 'rgba(';
  color += value.join(',') + ')';
  return color;
}
/**
 * @description Deepen color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Number} Percent of Deepen (1-100)
 * @return {String|Boolean} Rgba color (Invalid input will return false)
 */


function darken(color) {
  var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!color) {
    console.error('darken: Missing parameters!');
    return false;
  }

  var rgbaValue = getRgbaValue(color);
  if (!rgbaValue) return false;
  rgbaValue = rgbaValue.map(function (v, i) {
    return i === 3 ? v : v - Math.ceil(2.55 * percent);
  }).map(function (v) {
    return v < 0 ? 0 : v;
  });
  return getColorFromRgbValue(rgbaValue);
}
/**
 * @description Brighten color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Number} Percent of brighten (1-100)
 * @return {String|Boolean} Rgba color (Invalid input will return false)
 */


function lighten(color) {
  var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!color) {
    console.error('lighten: Missing parameters!');
    return false;
  }

  var rgbaValue = getRgbaValue(color);
  if (!rgbaValue) return false;
  rgbaValue = rgbaValue.map(function (v, i) {
    return i === 3 ? v : v + Math.ceil(2.55 * percent);
  }).map(function (v) {
    return v > 255 ? 255 : v;
  });
  return getColorFromRgbValue(rgbaValue);
}
/**
 * @description Adjust color opacity
 * @param {String} color   Hex|Rgb|Rgba color or color keyword
 * @param {Number} Percent of opacity
 * @return {String|Boolean} Rgba color (Invalid input will return false)
 */


function fade(color) {
  var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

  if (!color) {
    console.error('fade: Missing parameters!');
    return false;
  }

  var rgbValue = getRgbValue(color);
  if (!rgbValue) return false;
  var rgbaValue = [].concat(_toConsumableArray(rgbValue), [percent / 100]);
  return getColorFromRgbValue(rgbaValue);
}

var _default = {
  fade: fade,
  toHex: toHex,
  toRgb: toRgb,
  darken: darken,
  lighten: lighten,
  getOpacity: getOpacity,
  getRgbValue: getRgbValue,
  getRgbaValue: getRgbaValue,
  getColorFromRgbValue: getColorFromRgbValue
};
exports["default"] = _default;
},{"./config/keywords":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL0FkbWluaXN0cmF0b3IvQXBwRGF0YS9Sb2FtaW5nL25wbS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvZW50cnkuanMiLCJsaWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvQGppYW1pbmdoaS9iZXppZXItY3VydmUvbGliL2NvcmUvYmV6aWVyQ3VydmVUb1BvbHlsaW5lLmpzIiwibm9kZV9tb2R1bGVzL0BqaWFtaW5naGkvYmV6aWVyLWN1cnZlL2xpYi9jb3JlL3BvbHlsaW5lVG9CZXppZXJDdXJ2ZS5qcyIsIm5vZGVfbW9kdWxlcy9AamlhbWluZ2hpL2Jlemllci1jdXJ2ZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvQGppYW1pbmdoaS9jb2xvci9saWIvY29uZmlnL2tleXdvcmRzLmpzIiwibm9kZV9tb2R1bGVzL0BqaWFtaW5naGkvY29sb3IvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDemJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwidmFyIEF1ZGlvRkZUID0gcmVxdWlyZSgnLi4vbGliL2luZGV4JylcclxuXHJcbndpbmRvdy5BdWRpb0ZGVCA9IEF1ZGlvRkZULmRlZmF1bHRcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9jb2xvciA9IHJlcXVpcmUoXCJAamlhbWluZ2hpL2NvbG9yXCIpO1xuXG52YXIgX2JlemllckN1cnZlID0gcmVxdWlyZShcIkBqaWFtaW5naGkvYmV6aWVyLWN1cnZlXCIpO1xuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHsgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX2UgPSB1bmRlZmluZWQ7IHRyeSB7IGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7IH1cblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikgeyBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyKSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlcikgPT09IFwiW29iamVjdCBBcmd1bWVudHNdXCIpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBDbGFzcyBvZiBBdWRpb0ZGVFxyXG4gKiBAcGFyYW0ge09iamVjdH0gY2FudmFzIENhbnZhcyBET01cclxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBjb25maWd1cmF0aW9uXHJcbiAqIEByZXR1cm4ge0F1ZGlvRmZ0fSBBdWRpb0ZmdCBJbnN0YW5jZVxyXG4gKi9cbnZhciBBdWRpb0ZGVCA9IGZ1bmN0aW9uIEF1ZGlvRkZUKGNhbnZhcykge1xuICB2YXIgY29uZmlnID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQXVkaW9GRlQpO1xuXG4gIGlmICghY2FudmFzKSB7XG4gICAgY29uc29sZS53YXJuKCdBdWRpb0ZmdDogTWlzc2luZyBwYXJhbWV0ZXJzIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSAvLyBJbml0IGNvbmZpZ1xuXG5cbiAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gQW5hbHlzZXIgZmFzdCBmb3VyaWVyIHRyYW5zZm9ybVxyXG4gICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAqIEBkZWZhdWx0IGFuYWx5c2VyRkZUID0gMjA0OFxyXG4gICAgICovXG4gICAgYW5hbHlzZXJGRlQ6IDIwNDgsXG5cbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBTcHJpbmcgTW9kZVxyXG4gICAgICogQHR5cGUge0Jvb2xlYW59XHJcbiAgICAgKiBAZGVmYXVsdCBzcHJpbmcgPSBmYWxzZVxyXG4gICAgICovXG4gICAgc3ByaW5nOiBmYWxzZSxcblxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFdhdmUgTW9kZVxyXG4gICAgICogQHR5cGUge0Jvb2xlYW59XHJcbiAgICAgKiBAZGVmYXVsdCB3YXZlID0gZmFsc2VcclxuICAgICAqL1xuICAgIHdhdmU6IGZhbHNlLFxuXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gU3ltbWV0cnkgTW9kZVxyXG4gICAgICogQHR5cGUge0Jvb2xlYW59XHJcbiAgICAgKiBAZGVmYXVsdCBzeW1tZXRyeSA9IGZhbHNlXHJcbiAgICAgKi9cbiAgICBzeW1tZXRyeTogZmFsc2UsXG5cbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBXaGV0aGVyIHRvIHNob3cgcGlja1xyXG4gICAgICogQHR5cGUge0Jvb2xlYW59XHJcbiAgICAgKiBAZGVmYXVsdCBwaWNrID0gdHJ1ZVxyXG4gICAgICovXG4gICAgcGljazogdHJ1ZSxcblxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFdoZXRoZXIgdG8gZW5hYmxlIGNvbG9yIHRyYW5zaXRpb25cclxuICAgICAqIEB0eXBlIHtCb29sZWFufVxyXG4gICAgICogQGRlZmF1bHQgY29sb3JUcmFuc2l0aW9uID0gZmFsc2VcclxuICAgICAqL1xuICAgIGNvbG9yVHJhbnNpdGlvbjogZmFsc2UsXG5cbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBGcmVxdWVuY3kgY29sb3JzXHJcbiAgICAgKiBAdHlwZSB7QXJyYXk8U3RyaW5nPn1cclxuICAgICAqIEBkZWZhdWx0IGNvbG9ycyA9IFsnIzZlZDRkMycsICcjZjU3MzhmJywgJyM0YmI3ZTQnXVxyXG4gICAgICogQGV4YW1wbGUgY29sb3JzID0gWydyZWQnLCAnIzZlZDRkMycsICdyZ2IoMTAwLCAxMDAsIDEwMCknLCAncmdiYSgxMDAsIDEwMCwgMTAwLCAxKSddXHJcbiAgICAgKi9cbiAgICBjb2xvcnM6IFsnIzZlZDRkMycsICcjZjU3MzhmJywgJyM0YmI3ZTQnXSxcblxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIENvbG9yIG9wYWNpdHlcclxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgKiBAZGVmYXVsdCBvcGFjaXR5ID0gMVxyXG4gICAgICovXG4gICAgb3BhY2l0eTogMSxcblxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIENvbG9yIHRyYW5zaXRpb24gZnJhbWVcclxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgKiBAZGVmYXVsdCB0cmFuc2l0aW9uRnJhbWUgPSAzMDBcclxuICAgICAqL1xuICAgIHRyYW5zaXRpb25GcmFtZTogMzAwLFxuXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gQ29sdW1uIGdhcFxyXG4gICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAqIEBkZWZhdWx0IGNvbHVtbkdhcCA9IDVcclxuICAgICAqL1xuICAgIGNvbHVtbkdhcDogNSxcblxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIENvbHVtbiB3aWR0aFxyXG4gICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAqIEBkZWZhdWx0IGNvbHVtbldpZHRoID0gMTBcclxuICAgICAqL1xuICAgIGNvbHVtbldpZHRoOiAxMCxcblxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFN3aW5nIHNjYWxlXHJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICogQGRlZmF1bHQgc3dpbmdTY2FsZSA9IDFcclxuICAgICAqL1xuICAgIHN3aW5nU2NhbGU6IDFcbiAgfTtcbiAgT2JqZWN0LmFzc2lnbih0aGlzLCBkZWZhdWx0Q29uZmlnLCBjb25maWcpOyAvLyBJbml0IGNhbnZhc1xuXG4gIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIHRoaXMuY2FudmFzV0ggPSBbMCwgMF07XG4gIHZhciBjbGllbnRXaWR0aCA9IGNhbnZhcy5jbGllbnRXaWR0aCxcbiAgICAgIGNsaWVudEhlaWdodCA9IGNhbnZhcy5jbGllbnRIZWlnaHQ7XG4gIHRoaXMuY2FudmFzV0hbMF0gPSBjbGllbnRXaWR0aDtcbiAgdGhpcy5jYW52YXNXSFsxXSA9IGNsaWVudEhlaWdodDtcbiAgY2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBjbGllbnRXaWR0aCk7XG4gIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGNsaWVudEhlaWdodCk7IC8vIEluaXQgYXVkaW9cblxuICB0aGlzLmF1ZGlvcyA9IG5ldyBNYXAoKTtcbiAgdGhpcy5mcmVxdWVuY3kgPSBbXTtcbiAgdGhpcy5sYXN0RnJlcXVlbmN5ID0gW107XG4gIHRoaXMuYXVkaW9BbmFseXNlciA9IG51bGw7XG4gIHRoaXMuYXVkaW9DdHggPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKTsgLy8gQ29uZmlnQWJsZSBOb3RcblxuICB0aGlzLmFuaW1hdGlvbiA9IGZhbHNlO1xuICB0aGlzLnRyYW5zaXRpb25Db2xvckluZGV4ID0gMDtcbiAgdGhpcy50cmFuc2l0aW9uQ29sb3JGcmFtZSA9IDA7XG59O1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEF1ZGlvRkZUO1xuXG5BdWRpb0ZGVC5wcm90b3R5cGUuY3JlYXRlQXVkaW9NZWRpYUFuYWx5c2VyID0gZnVuY3Rpb24gKGF1ZGlvKSB7XG4gIHZhciBhdWRpb0N0eCA9IHRoaXMuYXVkaW9DdHgsXG4gICAgICBhbmFseXNlckZGVCA9IHRoaXMuYW5hbHlzZXJGRlQ7XG4gIHZhciBhdWRpb1NvdXJjZSA9IGF1ZGlvQ3R4LmNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZShhdWRpbyk7XG4gIHZhciBhdWRpb0FuYWx5c2VyID0gYXVkaW9DdHguY3JlYXRlQW5hbHlzZXIoKTtcbiAgYXVkaW9Tb3VyY2UuY29ubmVjdChhdWRpb0FuYWx5c2VyKTtcbiAgYXVkaW9BbmFseXNlci5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbiAgYXVkaW9BbmFseXNlci5mZnRTaXplID0gYW5hbHlzZXJGRlQ7XG4gIHJldHVybiBhdWRpb0FuYWx5c2VyO1xufTtcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gU2V0IGF1ZGlvIGluc3RhbmNlXHJcbiAqIEBwYXJhbSBhdWRpbyBBdWRpbyBpbnN0YW5jZVxyXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9IFZvaWRcclxuICovXG5cblxuQXVkaW9GRlQucHJvdG90eXBlLnNldEF1ZGlvID0gZnVuY3Rpb24gKGF1ZGlvKSB7XG4gIGlmICghYXVkaW8pIHtcbiAgICBjb25zb2xlLndhcm4oJ0F1ZGlvRmZ0LnNldEF1ZGlvOiBNaXNzaW5nIHBhcmFtZXRlcnMhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGF1ZGlvcyA9IHRoaXMuYXVkaW9zO1xuICB2YXIgYXVkaW9BbmFseXNlciA9IHRoaXMuYXVkaW9BbmFseXNlciA9IGF1ZGlvcy5nZXQoYXVkaW8pIHx8IHRoaXMuY3JlYXRlQXVkaW9NZWRpYUFuYWx5c2VyKGF1ZGlvKTtcbiAgdGhpcy5mcmVxdWVuY3kgPSBuZXcgVWludDhBcnJheShhdWRpb0FuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50KTtcbn07XG4vKipcclxuICogQGRlc2NyaXB0aW9uIERyYXcgZnJlcXVlbmN5XHJcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH0gVm9pZFxyXG4gKi9cblxuXG5BdWRpb0ZGVC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGFuaW1hdGlvbiA9IHRoaXMuYW5pbWF0aW9uO1xuICBpZiAoIWFuaW1hdGlvbikgdGhpcy5sb29wKCk7XG59O1xuXG5BdWRpb0ZGVC5wcm90b3R5cGUubG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNwcmluZyA9IHRoaXMuc3ByaW5nLFxuICAgICAgbG9vcCA9IHRoaXMubG9vcDtcblxuICBpZiAoc3ByaW5nKSB7XG4gICAgdGhpcy5kcmF3U3ByaW5nRnJlcXVlbmN5KCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5kcmF3Tm9ybWFsRnJlcXVlbmN5KCk7XG4gIH1cblxuICB0aGlzLmFuaW1hdGlvbiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wLmJpbmQodGhpcykpO1xufTtcblxuQXVkaW9GRlQucHJvdG90eXBlLmdldENvbHVtbk51bSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNhbnZhc1dIID0gdGhpcy5jYW52YXNXSCxcbiAgICAgIGNvbHVtbldpZHRoID0gdGhpcy5jb2x1bW5XaWR0aCxcbiAgICAgIGNvbHVtbkdhcCA9IHRoaXMuY29sdW1uR2FwO1xuICByZXR1cm4gTWF0aC5jZWlsKGNhbnZhc1dIWzBdIC8gKGNvbHVtbldpZHRoICsgY29sdW1uR2FwKSk7XG59O1xuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBDbGVhciBjYW52YXNcclxuICogQHJldHVybiB7VW5kZWZpbmVkfSBWb2lkXHJcbiAqL1xuXG5cbkF1ZGlvRkZULnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNhbnZhc1dIID0gdGhpcy5jYW52YXNXSCxcbiAgICAgIGN0eCA9IHRoaXMuY3R4O1xuICBjdHguY2xlYXJSZWN0LmFwcGx5KGN0eCwgWzAsIDBdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoY2FudmFzV0gpKSk7XG59O1xuXG5BdWRpb0ZGVC5wcm90b3R5cGUuZ2V0RnJlcXVlbmN5ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgYXVkaW9BbmFseXNlciA9IHRoaXMuYXVkaW9BbmFseXNlcixcbiAgICAgIGZyZXF1ZW5jeSA9IHRoaXMuZnJlcXVlbmN5LFxuICAgICAgc3dpbmdTY2FsZSA9IHRoaXMuc3dpbmdTY2FsZSxcbiAgICAgIHN5bW1ldHJ5ID0gdGhpcy5zeW1tZXRyeTtcbiAgdmFyIGNvbHVtbk51bSA9IHRoaXMuZ2V0Q29sdW1uTnVtKCk7XG4gIGlmIChjb2x1bW5OdW0gJSAyICE9PSAwKSBjb2x1bW5OdW0rKztcbiAgYXVkaW9BbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YShmcmVxdWVuY3kpO1xuICBmcmVxdWVuY3kgPSBmcmVxdWVuY3kuc2xpY2UoMCwgY29sdW1uTnVtKTtcblxuICBpZiAoc3ltbWV0cnkpIHtcbiAgICBmcmVxdWVuY3kgPSBmcmVxdWVuY3kuc2xpY2UoMCwgY29sdW1uTnVtIC8gMik7XG5cbiAgICB2YXIgcmV2ZXJzZSA9IF90b0NvbnN1bWFibGVBcnJheShmcmVxdWVuY3kpLnJldmVyc2UoKTtcblxuICAgIGZyZXF1ZW5jeSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkocmV2ZXJzZSksIF90b0NvbnN1bWFibGVBcnJheShmcmVxdWVuY3kpKTtcbiAgfVxuXG4gIHJldHVybiBmcmVxdWVuY3kubWFwKGZ1bmN0aW9uIChuKSB7XG4gICAgcmV0dXJuIG4gKiBwYXJzZUZsb2F0KHN3aW5nU2NhbGUpO1xuICB9KTtcbn07XG5cbkF1ZGlvRkZULnByb3RvdHlwZS5nZXRDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGN0eCA9IHRoaXMuY3R4LFxuICAgICAgY2FudmFzV0ggPSB0aGlzLmNhbnZhc1dILFxuICAgICAgY29sb3JzID0gdGhpcy5jb2xvcnMsXG4gICAgICBjb2xvclRyYW5zaXRpb24gPSB0aGlzLmNvbG9yVHJhbnNpdGlvbixcbiAgICAgIG9wYWNpdHkgPSB0aGlzLm9wYWNpdHk7XG4gIGlmIChjb2xvcnMubGVuZ3RoID09PSAxKSBjb2xvcnMgPSBbY29sb3JzWzBdLCBjb2xvcnNbMF1dO1xuICB2YXIgY29sb3JOdW0gPSBjb2xvcnMubGVuZ3RoO1xuICBjb2xvcnMgPSBjb2xvcnMubWFwKGZ1bmN0aW9uIChjb2xvcikge1xuICAgIHJldHVybiAoMCwgX2NvbG9yLmZhZGUpKGNvbG9yLCBvcGFjaXR5ICogMTAwKTtcbiAgfSk7XG4gIHZhciBncmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCBjYW52YXNXSFsxXSk7XG5cbiAgaWYgKCFjb2xvclRyYW5zaXRpb24pIHtcbiAgICB2YXIgY29sb3JHYXAgPSAxIC8gKGNvbG9yTnVtIC0gMSk7XG4gICAgY29sb3JzLmZvckVhY2goZnVuY3Rpb24gKGNvbG9yLCBpKSB7XG4gICAgICByZXR1cm4gZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAgKyBjb2xvckdhcCAqIGksIGNvbG9yKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZ3JhZGllbnQ7XG4gIH1cblxuICB2YXIgdHJhbnNpdGlvbkNvbG9yRnJhbWUgPSB0aGlzLnRyYW5zaXRpb25Db2xvckZyYW1lLFxuICAgICAgdHJhbnNpdGlvbkNvbG9ySW5kZXggPSB0aGlzLnRyYW5zaXRpb25Db2xvckluZGV4LFxuICAgICAgdHJhbnNpdGlvbkZyYW1lID0gdGhpcy50cmFuc2l0aW9uRnJhbWUsXG4gICAgICBzcHJpbmcgPSB0aGlzLnNwcmluZztcbiAgdmFyIHRyYW5zaXRpb25Db2xvciA9IFtjb2xvcnNbdHJhbnNpdGlvbkNvbG9ySW5kZXggJSBjb2xvck51bV0sIGNvbG9yc1sodHJhbnNpdGlvbkNvbG9ySW5kZXggKyAxKSAlIGNvbG9yTnVtXSwgY29sb3JzWyh0cmFuc2l0aW9uQ29sb3JJbmRleCArIDIpICUgY29sb3JOdW1dXS5tYXAoZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgcmV0dXJuICgwLCBfY29sb3IuZ2V0UmdiYVZhbHVlKShjb2xvcik7XG4gIH0pO1xuICB2YXIgc3RhcnRDb2xvciA9IHRoaXMuZ2V0VHJhbnNpdGlvbkNvbG9yKHRyYW5zaXRpb25Db2xvclswXSwgdHJhbnNpdGlvbkNvbG9yWzFdLCB0cmFuc2l0aW9uQ29sb3JGcmFtZSk7XG4gIHZhciBlbmRDb2xvciA9IHRoaXMuZ2V0VHJhbnNpdGlvbkNvbG9yKHRyYW5zaXRpb25Db2xvclsxXSwgdHJhbnNpdGlvbkNvbG9yWzJdLCB0cmFuc2l0aW9uQ29sb3JGcmFtZSk7XG5cbiAgaWYgKHNwcmluZykge1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBzdGFydENvbG9yKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC41LCBlbmRDb2xvcik7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsIHN0YXJ0Q29sb3IpO1xuICB9IGVsc2Uge1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBzdGFydENvbG9yKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgZW5kQ29sb3IpO1xuICB9XG5cbiAgdHJhbnNpdGlvbkNvbG9yRnJhbWUrKztcblxuICBpZiAodHJhbnNpdGlvbkZyYW1lIDw9IHRyYW5zaXRpb25Db2xvckZyYW1lKSB7XG4gICAgdGhpcy50cmFuc2l0aW9uQ29sb3JGcmFtZSA9IDA7XG4gICAgdGhpcy50cmFuc2l0aW9uQ29sb3JJbmRleCsrO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudHJhbnNpdGlvbkNvbG9yRnJhbWUgPSB0cmFuc2l0aW9uQ29sb3JGcmFtZTtcbiAgfVxuXG4gIHJldHVybiBncmFkaWVudDtcbn07XG5cbkF1ZGlvRkZULnByb3RvdHlwZS5nZXRUcmFuc2l0aW9uQ29sb3IgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgZnJhbWUpIHtcbiAgdmFyIHRyYW5zaXRpb25GcmFtZSA9IHRoaXMudHJhbnNpdGlvbkZyYW1lO1xuICByZXR1cm4gKDAsIF9jb2xvci5nZXRDb2xvckZyb21SZ2JWYWx1ZSkoc3RhcnQubWFwKGZ1bmN0aW9uICh2LCBpKSB7XG4gICAgcmV0dXJuIChlbmRbaV0gLSB2KSAvIHRyYW5zaXRpb25GcmFtZSAqIGZyYW1lICsgdjtcbiAgfSkpO1xufTtcblxuQXVkaW9GRlQucHJvdG90eXBlLmRyYXdOb3JtYWxGcmVxdWVuY3kgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB3YXZlID0gdGhpcy53YXZlO1xuXG4gIGlmICh3YXZlKSB7XG4gICAgdGhpcy5kcmF3V2F2ZUZyZXF1ZW5jeSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuY2xlYXIoKTtcbiAgdmFyIGNvbHVtbldpZHRoID0gdGhpcy5jb2x1bW5XaWR0aCxcbiAgICAgIGNvbHVtbkdhcCA9IHRoaXMuY29sdW1uR2FwLFxuICAgICAgY3R4ID0gdGhpcy5jdHgsXG4gICAgICBsYXN0RnJlcXVlbmN5ID0gdGhpcy5sYXN0RnJlcXVlbmN5LFxuICAgICAgY2FudmFzV0ggPSB0aGlzLmNhbnZhc1dILFxuICAgICAgcGljayA9IHRoaXMucGljaztcbiAgdmFyIGZyZXF1ZW5jeSA9IHRoaXMuZ2V0RnJlcXVlbmN5KCk7XG4gIHZhciBjb2xvciA9IHRoaXMuZ2V0Q29sb3IoKTtcbiAgdmFyIGl0ZW1XaWR0aCA9IGNvbHVtbldpZHRoICsgY29sdW1uR2FwO1xuICBmcmVxdWVuY3kuZm9yRWFjaChmdW5jdGlvbiAoaGVpZ2h0LCBpKSB7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIHZhciBsYXN0ID0gbGFzdEZyZXF1ZW5jeVtpXTtcbiAgICB2YXIgY3VycmVudEhlaWdodCA9IGxhc3Q7XG5cbiAgICBpZiAobGFzdCAmJiBsYXN0ID49IGhlaWdodCkge1xuICAgICAgY3VycmVudEhlaWdodC0tO1xuICAgIH0gZWxzZSBpZiAoIWxhc3QgfHwgbGFzdCA8IGhlaWdodCkge1xuICAgICAgY3VycmVudEhlaWdodCA9IGhlaWdodDtcbiAgICB9XG5cbiAgICBjdHguZmlsbFJlY3QoaXRlbVdpZHRoICogaSwgY2FudmFzV0hbMV0gLSBoZWlnaHQsIGNvbHVtbldpZHRoLCBoZWlnaHQpO1xuICAgIGlmIChwaWNrKSBjdHguZmlsbFJlY3QoaXRlbVdpZHRoICogaSwgY2FudmFzV0hbMV0gLSBjdXJyZW50SGVpZ2h0IC0gNSwgY29sdW1uV2lkdGgsIDIpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBsYXN0RnJlcXVlbmN5W2ldID0gY3VycmVudEhlaWdodDtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gIH0pO1xufTtcblxuQXVkaW9GRlQucHJvdG90eXBlLmRyYXdTcHJpbmdGcmVxdWVuY3kgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB3YXZlID0gdGhpcy53YXZlO1xuXG4gIGlmICh3YXZlKSB7XG4gICAgdGhpcy5kcmF3V2F2ZUZyZXF1ZW5jeSh0cnVlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLmNsZWFyKCk7XG4gIHZhciBjb2x1bW5XaWR0aCA9IHRoaXMuY29sdW1uV2lkdGgsXG4gICAgICBjb2x1bW5HYXAgPSB0aGlzLmNvbHVtbkdhcCxcbiAgICAgIGN0eCA9IHRoaXMuY3R4LFxuICAgICAgbGFzdEZyZXF1ZW5jeSA9IHRoaXMubGFzdEZyZXF1ZW5jeSxcbiAgICAgIGNhbnZhc1dIID0gdGhpcy5jYW52YXNXSDtcbiAgdmFyIGZyZXF1ZW5jeSA9IHRoaXMuZ2V0RnJlcXVlbmN5KCk7XG4gIHZhciBjb2xvciA9IHRoaXMuZ2V0Q29sb3IoKTtcbiAgdmFyIGl0ZW1XaWR0aCA9IGNvbHVtbldpZHRoICsgY29sdW1uR2FwO1xuICBmcmVxdWVuY3kuZm9yRWFjaChmdW5jdGlvbiAoaGVpZ2h0LCBpKSB7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5maWxsUmVjdChpdGVtV2lkdGggKiBpLCAoY2FudmFzV0hbMV0gLSBoZWlnaHQpIC8gMiwgY29sdW1uV2lkdGgsIGhlaWdodCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGxhc3RGcmVxdWVuY3lbaV0gPSBoZWlnaHQ7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICB9KTtcbn07XG5cbkF1ZGlvRkZULnByb3RvdHlwZS5kcmF3V2F2ZUZyZXF1ZW5jeSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNwcmluZyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogZmFsc2U7XG4gIHRoaXMuY2xlYXIoKTtcbiAgdmFyIGNvbHVtbldpZHRoID0gdGhpcy5jb2x1bW5XaWR0aCxcbiAgICAgIGNvbHVtbkdhcCA9IHRoaXMuY29sdW1uR2FwLFxuICAgICAgY3R4ID0gdGhpcy5jdHgsXG4gICAgICBjYW52YXNXSCA9IHRoaXMuY2FudmFzV0g7XG4gIHZhciBmcmVxdWVuY3kgPSB0aGlzLmdldEZyZXF1ZW5jeSgpO1xuICB2YXIgY29sb3IgPSB0aGlzLmdldENvbG9yKCk7XG4gIHZhciBpdGVtV2lkdGggPSBjb2x1bW5XaWR0aCArIGNvbHVtbkdhcDtcbiAgdmFyIHBvaW50cyA9IFtdO1xuXG4gIGlmIChzcHJpbmcpIHtcbiAgICB2YXIgdG9wID0gW10sXG4gICAgICAgIGJvdHRvbSA9IFtdO1xuICAgIGZyZXF1ZW5jeS5mb3JFYWNoKGZ1bmN0aW9uIChoZWlnaHQsIGkpIHtcbiAgICAgIHJldHVybiB0b3BbaV0gPSBbaXRlbVdpZHRoICogaSwgKGNhbnZhc1dIWzFdIC0gaGVpZ2h0KSAvIDJdO1xuICAgIH0pO1xuICAgIGZyZXF1ZW5jeS5mb3JFYWNoKGZ1bmN0aW9uIChoZWlnaHQsIGkpIHtcbiAgICAgIHJldHVybiBib3R0b21baV0gPSBbaXRlbVdpZHRoICogaSwgKGNhbnZhc1dIWzFdIC0gaGVpZ2h0KSAvIDIgKyBoZWlnaHRdO1xuICAgIH0pO1xuICAgIGJvdHRvbS5yZXZlcnNlKCk7XG4gICAgcG9pbnRzID0gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheSh0b3ApLCBfdG9Db25zdW1hYmxlQXJyYXkoYm90dG9tKSk7XG4gIH0gZWxzZSB7XG4gICAgZnJlcXVlbmN5LmZvckVhY2goZnVuY3Rpb24gKGhlaWdodCwgaSkge1xuICAgICAgcmV0dXJuIHBvaW50c1tpXSA9IFtpdGVtV2lkdGggKiBpLCBjYW52YXNXSFsxXSAtIGhlaWdodF07XG4gICAgfSk7XG4gIH1cblxuICB2YXIgYmV6aWVyQ3VydmUgPSAoMCwgX2JlemllckN1cnZlLnBvbHlsaW5lVG9CZXppZXJDdXJ2ZSkocG9pbnRzLCBzcHJpbmcpO1xuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5tb3ZlVG8oMCwgY2FudmFzV0hbMV0pO1xuICBjdHgubGluZVRvLmFwcGx5KGN0eCwgX3RvQ29uc3VtYWJsZUFycmF5KGJlemllckN1cnZlLnNwbGljZSgwLCAxKVswXSkpO1xuICBiZXppZXJDdXJ2ZS5mb3JFYWNoKGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgdmFyIF9yZWYyID0gX3NsaWNlZFRvQXJyYXkoX3JlZiwgMyksXG4gICAgICAgIGMxID0gX3JlZjJbMF0sXG4gICAgICAgIGMyID0gX3JlZjJbMV0sXG4gICAgICAgIGVuZCA9IF9yZWYyWzJdO1xuXG4gICAgY3R4LmJlemllckN1cnZlVG8uYXBwbHkoY3R4LCBfdG9Db25zdW1hYmxlQXJyYXkoYzEpLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoYzIpLCBfdG9Db25zdW1hYmxlQXJyYXkoZW5kKSkpO1xuICB9KTtcblxuICBpZiAoIXNwcmluZykge1xuICAgIGN0eC5saW5lVG8oY2FudmFzV0hbMF0sIGNhbnZhc1dIWzFdKTtcbiAgICBjdHgubGluZVRvKDAsIGNhbnZhc1dIWzFdKTtcbiAgfVxuXG4gIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgY3R4LmZpbGwoKTtcbiAgY3R4LmNsb3NlUGF0aCgpO1xufTtcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gU3RvcCBkcmF3aW5nXHJcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH0gVm9pZFxyXG4gKi9cblxuXG5BdWRpb0ZGVC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGFuaW1hdGlvbiA9IHRoaXMuYW5pbWF0aW9uO1xuICBpZiAoYW5pbWF0aW9uKSBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb24pO1xuICB0aGlzLmFuaW1hdGlvbiA9IGZhbHNlO1xufTtcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gVXBkYXRlIGNvbmZpZ1xyXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9IFZvaWRcclxuICovXG5cblxuQXVkaW9GRlQucHJvdG90eXBlLnVwZGF0ZUNvbmZpZyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNvbmZpZyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gIE9iamVjdC5hc3NpZ24odGhpcywgY29uZmlnKTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmJlemllckN1cnZlVG9Qb2x5bGluZSA9IGJlemllckN1cnZlVG9Qb2x5bGluZTtcbmV4cG9ydHMuZ2V0QmV6aWVyQ3VydmVMZW5ndGggPSBnZXRCZXppZXJDdXJ2ZUxlbmd0aDtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHsgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX2UgPSB1bmRlZmluZWQ7IHRyeSB7IGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7IH1cblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikgeyBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyKSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlcikgPT09IFwiW29iamVjdCBBcmd1bWVudHNdXCIpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IH1cblxudmFyIHNxcnQgPSBNYXRoLnNxcnQsXG4gICAgcG93ID0gTWF0aC5wb3csXG4gICAgY2VpbCA9IE1hdGguY2VpbCxcbiAgICBhYnMgPSBNYXRoLmFiczsgLy8gSW5pdGlhbGl6ZSB0aGUgbnVtYmVyIG9mIHBvaW50cyBwZXIgY3VydmVcblxudmFyIGRlZmF1bHRTZWdtZW50UG9pbnRzTnVtID0gNTA7XG4vKipcclxuICogQGV4YW1wbGUgZGF0YSBzdHJ1Y3R1cmUgb2YgYmV6aWVyQ3VydmVcclxuICogYmV6aWVyQ3VydmUgPSBbXHJcbiAqICAvLyBTdGFydGluZyBwb2ludCBvZiB0aGUgY3VydmVcclxuICogIFsxMCwgMTBdLFxyXG4gKiAgLy8gQmV6aWVyQ3VydmUgc2VnbWVudCBkYXRhIChjb250cm9sUG9pbnQxLCBjb250cm9sUG9pbnQyLCBlbmRQb2ludClcclxuICogIFtcclxuICogICAgWzIwLCAyMF0sIFs0MCwgMjBdLCBbNTAsIDEwXVxyXG4gKiAgXSxcclxuICogIC4uLlxyXG4gKiBdXHJcbiAqL1xuXG4vKipcclxuICogQGRlc2NyaXB0aW9uICAgICAgICAgICAgICAgQWJzdHJhY3QgdGhlIGN1cnZlIGFzIGEgcG9seWxpbmUgY29uc2lzdGluZyBvZiBOIHBvaW50c1xyXG4gKiBAcGFyYW0ge0FycmF5fSBiZXppZXJDdXJ2ZSBiZXppZXJDdXJ2ZSBkYXRhXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBwcmVjaXNpb24gIGNhbGN1bGF0aW9uIGFjY3VyYWN5LiBSZWNvbW1lbmRlZCBmb3IgMS0yMC4gRGVmYXVsdCA9IDVcclxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgQ2FsY3VsYXRpb24gcmVzdWx0cyBhbmQgcmVsYXRlZCBkYXRhXHJcbiAqIEByZXR1cm4ge0FycmF5fSAgICAgICAgICAgIE9wdGlvbi5zZWdtZW50UG9pbnRzIFBvaW50IGRhdGEgdGhhdCBjb25zdGl0dXRlcyBhIHBvbHlsaW5lIGFmdGVyIGNhbGN1bGF0aW9uXHJcbiAqIEByZXR1cm4ge051bWJlcn0gICAgICAgICAgIE9wdGlvbi5jeWNsZXMgTnVtYmVyIG9mIGl0ZXJhdGlvbnNcclxuICogQHJldHVybiB7TnVtYmVyfSAgICAgICAgICAgT3B0aW9uLnJvdW5kcyBUaGUgbnVtYmVyIG9mIHJlY3Vyc2lvbnMgZm9yIHRoZSBsYXN0IGl0ZXJhdGlvblxyXG4gKi9cblxuZnVuY3Rpb24gYWJzdHJhY3RCZXppZXJDdXJ2ZVRvUG9seWxpbmUoYmV6aWVyQ3VydmUpIHtcbiAgdmFyIHByZWNpc2lvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogNTtcbiAgdmFyIHNlZ21lbnRzTnVtID0gYmV6aWVyQ3VydmUubGVuZ3RoIC0gMTtcbiAgdmFyIHN0YXJ0UG9pbnQgPSBiZXppZXJDdXJ2ZVswXTtcbiAgdmFyIGVuZFBvaW50ID0gYmV6aWVyQ3VydmVbc2VnbWVudHNOdW1dWzJdO1xuICB2YXIgc2VnbWVudHMgPSBiZXppZXJDdXJ2ZS5zbGljZSgxKTtcbiAgdmFyIGdldFNlZ21lbnRUUG9pbnRGdW5zID0gc2VnbWVudHMubWFwKGZ1bmN0aW9uIChzZWcsIGkpIHtcbiAgICB2YXIgYmVnaW5Qb2ludCA9IGkgPT09IDAgPyBzdGFydFBvaW50IDogc2VnbWVudHNbaSAtIDFdWzJdO1xuICAgIHJldHVybiBjcmVhdGVHZXRCZXppZXJDdXJ2ZVRQb2ludEZ1bi5hcHBseSh2b2lkIDAsIFtiZWdpblBvaW50XS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KHNlZykpKTtcbiAgfSk7IC8vIEluaXRpYWxpemUgdGhlIGN1cnZlIHRvIGEgcG9seWxpbmVcblxuICB2YXIgc2VnbWVudFBvaW50c051bSA9IG5ldyBBcnJheShzZWdtZW50c051bSkuZmlsbChkZWZhdWx0U2VnbWVudFBvaW50c051bSk7XG4gIHZhciBzZWdtZW50UG9pbnRzID0gZ2V0U2VnbWVudFBvaW50c0J5TnVtKGdldFNlZ21lbnRUUG9pbnRGdW5zLCBzZWdtZW50UG9pbnRzTnVtKTsgLy8gQ2FsY3VsYXRlIHVuaWZvcm1seSBkaXN0cmlidXRlZCBwb2ludHMgYnkgaXRlcmF0aXZlbHlcblxuICB2YXIgcmVzdWx0ID0gY2FsY1VuaWZvcm1Qb2ludHNCeUl0ZXJhdGlvbihzZWdtZW50UG9pbnRzLCBnZXRTZWdtZW50VFBvaW50RnVucywgc2VnbWVudHMsIHByZWNpc2lvbik7XG4gIHJlc3VsdC5zZWdtZW50UG9pbnRzLnB1c2goZW5kUG9pbnQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiAgR2VuZXJhdGUgYSBtZXRob2QgZm9yIG9idGFpbmluZyBjb3JyZXNwb25kaW5nIHBvaW50IGJ5IHQgYWNjb3JkaW5nIHRvIGN1cnZlIGRhdGFcclxuICogQHBhcmFtIHtBcnJheX0gYmVnaW5Qb2ludCAgICBCZXppZXJDdXJ2ZSBiZWdpbiBwb2ludC4gW3gsIHldXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGNvbnRyb2xQb2ludDEgQmV6aWVyQ3VydmUgY29udHJvbFBvaW50MS4gW3gsIHldXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGNvbnRyb2xQb2ludDIgQmV6aWVyQ3VydmUgY29udHJvbFBvaW50Mi4gW3gsIHldXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGVuZFBvaW50ICAgICAgQmV6aWVyQ3VydmUgZW5kIHBvaW50LiBbeCwgeV1cclxuICogQHJldHVybiB7RnVuY3Rpb259IEV4cGVjdGVkIGZ1bmN0aW9uXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZUdldEJlemllckN1cnZlVFBvaW50RnVuKGJlZ2luUG9pbnQsIGNvbnRyb2xQb2ludDEsIGNvbnRyb2xQb2ludDIsIGVuZFBvaW50KSB7XG4gIHJldHVybiBmdW5jdGlvbiAodCkge1xuICAgIHZhciB0U3ViZWQxID0gMSAtIHQ7XG4gICAgdmFyIHRTdWJlZDFQb3czID0gcG93KHRTdWJlZDEsIDMpO1xuICAgIHZhciB0U3ViZWQxUG93MiA9IHBvdyh0U3ViZWQxLCAyKTtcbiAgICB2YXIgdFBvdzMgPSBwb3codCwgMyk7XG4gICAgdmFyIHRQb3cyID0gcG93KHQsIDIpO1xuICAgIHJldHVybiBbYmVnaW5Qb2ludFswXSAqIHRTdWJlZDFQb3czICsgMyAqIGNvbnRyb2xQb2ludDFbMF0gKiB0ICogdFN1YmVkMVBvdzIgKyAzICogY29udHJvbFBvaW50MlswXSAqIHRQb3cyICogdFN1YmVkMSArIGVuZFBvaW50WzBdICogdFBvdzMsIGJlZ2luUG9pbnRbMV0gKiB0U3ViZWQxUG93MyArIDMgKiBjb250cm9sUG9pbnQxWzFdICogdCAqIHRTdWJlZDFQb3cyICsgMyAqIGNvbnRyb2xQb2ludDJbMV0gKiB0UG93MiAqIHRTdWJlZDEgKyBlbmRQb2ludFsxXSAqIHRQb3czXTtcbiAgfTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcclxuICogQHBhcmFtIHtBcnJheX0gcG9pbnQxIEJlemllckN1cnZlIGJlZ2luIHBvaW50LiBbeCwgeV1cclxuICogQHBhcmFtIHtBcnJheX0gcG9pbnQyIEJlemllckN1cnZlIGNvbnRyb2xQb2ludDEuIFt4LCB5XVxyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEV4cGVjdGVkIGRpc3RhbmNlXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFR3b1BvaW50RGlzdGFuY2UoX3JlZiwgX3JlZjIpIHtcbiAgdmFyIF9yZWYzID0gX3NsaWNlZFRvQXJyYXkoX3JlZiwgMiksXG4gICAgICBheCA9IF9yZWYzWzBdLFxuICAgICAgYXkgPSBfcmVmM1sxXTtcblxuICB2YXIgX3JlZjQgPSBfc2xpY2VkVG9BcnJheShfcmVmMiwgMiksXG4gICAgICBieCA9IF9yZWY0WzBdLFxuICAgICAgYnkgPSBfcmVmNFsxXTtcblxuICByZXR1cm4gc3FydChwb3coYXggLSBieCwgMikgKyBwb3coYXkgLSBieSwgMikpO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIHN1bSBvZiB0aGUgYXJyYXkgb2YgbnVtYmVyc1xyXG4gKiBAcGFyYW0ge0FycmF5fSBudW1zIEFuIGFycmF5IG9mIG51bWJlcnNcclxuICogQHJldHVybiB7TnVtYmVyfSBFeHBlY3RlZCBzdW1cclxuICovXG5cblxuZnVuY3Rpb24gZ2V0TnVtc1N1bShudW1zKSB7XG4gIHJldHVybiBudW1zLnJlZHVjZShmdW5jdGlvbiAoc3VtLCBudW0pIHtcbiAgICByZXR1cm4gc3VtICsgbnVtO1xuICB9LCAwKTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSBkaXN0YW5jZSBvZiBtdWx0aXBsZSBzZXRzIG9mIHBvaW50c1xyXG4gKiBAcGFyYW0ge0FycmF5fSBzZWdtZW50UG9pbnRzIE11bHRpcGxlIHNldHMgb2YgcG9pbnQgZGF0YVxyXG4gKiBAcmV0dXJuIHtBcnJheX0gRGlzdGFuY2Ugb2YgbXVsdGlwbGUgc2V0cyBvZiBwb2ludCBkYXRhXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFNlZ21lbnRQb2ludHNEaXN0YW5jZShzZWdtZW50UG9pbnRzKSB7XG4gIHJldHVybiBzZWdtZW50UG9pbnRzLm1hcChmdW5jdGlvbiAocG9pbnRzLCBpKSB7XG4gICAgcmV0dXJuIG5ldyBBcnJheShwb2ludHMubGVuZ3RoIC0gMSkuZmlsbCgwKS5tYXAoZnVuY3Rpb24gKHRlbXAsIGopIHtcbiAgICAgIHJldHVybiBnZXRUd29Qb2ludERpc3RhbmNlKHBvaW50c1tqXSwgcG9pbnRzW2ogKyAxXSk7XG4gICAgfSk7XG4gIH0pO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIGRpc3RhbmNlIG9mIG11bHRpcGxlIHNldHMgb2YgcG9pbnRzXHJcbiAqIEBwYXJhbSB7QXJyYXl9IHNlZ21lbnRQb2ludHMgTXVsdGlwbGUgc2V0cyBvZiBwb2ludCBkYXRhXHJcbiAqIEByZXR1cm4ge0FycmF5fSBEaXN0YW5jZSBvZiBtdWx0aXBsZSBzZXRzIG9mIHBvaW50IGRhdGFcclxuICovXG5cblxuZnVuY3Rpb24gZ2V0U2VnbWVudFBvaW50c0J5TnVtKGdldFNlZ21lbnRUUG9pbnRGdW5zLCBzZWdtZW50UG9pbnRzTnVtKSB7XG4gIHJldHVybiBnZXRTZWdtZW50VFBvaW50RnVucy5tYXAoZnVuY3Rpb24gKGdldFNlZ21lbnRUUG9pbnRGdW4sIGkpIHtcbiAgICB2YXIgdEdhcCA9IDEgLyBzZWdtZW50UG9pbnRzTnVtW2ldO1xuICAgIHJldHVybiBuZXcgQXJyYXkoc2VnbWVudFBvaW50c051bVtpXSkuZmlsbCgnJykubWFwKGZ1bmN0aW9uIChmb28sIGopIHtcbiAgICAgIHJldHVybiBnZXRTZWdtZW50VFBvaW50RnVuKGogKiB0R2FwKTtcbiAgICB9KTtcbiAgfSk7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCB0aGUgc3VtIG9mIGRldmlhdGlvbnMgYmV0d2VlbiBsaW5lIHNlZ21lbnQgYW5kIHRoZSBhdmVyYWdlIGxlbmd0aFxyXG4gKiBAcGFyYW0ge0FycmF5fSBzZWdtZW50UG9pbnRzRGlzdGFuY2UgU2VnbWVudCBsZW5ndGggb2YgcG9seWxpbmVcclxuICogQHBhcmFtIHtOdW1iZXJ9IGF2Z0xlbmd0aCAgICAgICAgICAgIEF2ZXJhZ2UgbGVuZ3RoIG9mIHRoZSBsaW5lIHNlZ21lbnRcclxuICogQHJldHVybiB7TnVtYmVyfSBEZXZpYXRpb25zXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldEFsbERldmlhdGlvbnMoc2VnbWVudFBvaW50c0Rpc3RhbmNlLCBhdmdMZW5ndGgpIHtcbiAgcmV0dXJuIHNlZ21lbnRQb2ludHNEaXN0YW5jZS5tYXAoZnVuY3Rpb24gKHNlZykge1xuICAgIHJldHVybiBzZWcubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gYWJzKHMgLSBhdmdMZW5ndGgpO1xuICAgIH0pO1xuICB9KS5tYXAoZnVuY3Rpb24gKHNlZykge1xuICAgIHJldHVybiBnZXROdW1zU3VtKHNlZyk7XG4gIH0pLnJlZHVjZShmdW5jdGlvbiAodG90YWwsIHYpIHtcbiAgICByZXR1cm4gdG90YWwgKyB2O1xuICB9LCAwKTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQ2FsY3VsYXRlIHVuaWZvcm1seSBkaXN0cmlidXRlZCBwb2ludHMgYnkgaXRlcmF0aXZlbHlcclxuICogQHBhcmFtIHtBcnJheX0gc2VnbWVudFBvaW50cyAgICAgICAgTXVsdGlwbGUgc2V0ZCBvZiBwb2ludHMgdGhhdCBtYWtlIHVwIGEgcG9seWxpbmVcclxuICogQHBhcmFtIHtBcnJheX0gZ2V0U2VnbWVudFRQb2ludEZ1bnMgRnVuY3Rpb25zIG9mIGdldCBhIHBvaW50IG9uIHRoZSBjdXJ2ZSB3aXRoIHRcclxuICogQHBhcmFtIHtBcnJheX0gc2VnbWVudHMgICAgICAgICAgICAgQmV6aWVyQ3VydmUgZGF0YVxyXG4gKiBAcGFyYW0ge051bWJlcn0gcHJlY2lzaW9uICAgICAgICAgICBDYWxjdWxhdGlvbiBhY2N1cmFjeVxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IENhbGN1bGF0aW9uIHJlc3VsdHMgYW5kIHJlbGF0ZWQgZGF0YVxyXG4gKiBAcmV0dXJuIHtBcnJheX0gIE9wdGlvbi5zZWdtZW50UG9pbnRzIFBvaW50IGRhdGEgdGhhdCBjb25zdGl0dXRlcyBhIHBvbHlsaW5lIGFmdGVyIGNhbGN1bGF0aW9uXHJcbiAqIEByZXR1cm4ge051bWJlcn0gT3B0aW9uLmN5Y2xlcyBOdW1iZXIgb2YgaXRlcmF0aW9uc1xyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IE9wdGlvbi5yb3VuZHMgVGhlIG51bWJlciBvZiByZWN1cnNpb25zIGZvciB0aGUgbGFzdCBpdGVyYXRpb25cclxuICovXG5cblxuZnVuY3Rpb24gY2FsY1VuaWZvcm1Qb2ludHNCeUl0ZXJhdGlvbihzZWdtZW50UG9pbnRzLCBnZXRTZWdtZW50VFBvaW50RnVucywgc2VnbWVudHMsIHByZWNpc2lvbikge1xuICAvLyBUaGUgbnVtYmVyIG9mIGxvb3BzIGZvciB0aGUgY3VycmVudCBpdGVyYXRpb25cbiAgdmFyIHJvdW5kcyA9IDQ7IC8vIE51bWJlciBvZiBpdGVyYXRpb25zXG5cbiAgdmFyIGN5Y2xlcyA9IDE7XG5cbiAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoKSB7XG4gICAgLy8gUmVjYWxjdWxhdGUgdGhlIG51bWJlciBvZiBwb2ludHMgcGVyIGN1cnZlIGJhc2VkIG9uIHRoZSBsYXN0IGl0ZXJhdGlvbiBkYXRhXG4gICAgdmFyIHRvdGFsUG9pbnRzTnVtID0gc2VnbWVudFBvaW50cy5yZWR1Y2UoZnVuY3Rpb24gKHRvdGFsLCBzZWcpIHtcbiAgICAgIHJldHVybiB0b3RhbCArIHNlZy5sZW5ndGg7XG4gICAgfSwgMCk7IC8vIEFkZCBsYXN0IHBvaW50cyBvZiBzZWdtZW50IHRvIGNhbGMgZXhhY3Qgc2VnbWVudCBsZW5ndGhcblxuICAgIHNlZ21lbnRQb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoc2VnLCBpKSB7XG4gICAgICByZXR1cm4gc2VnLnB1c2goc2VnbWVudHNbaV1bMl0pO1xuICAgIH0pO1xuICAgIHZhciBzZWdtZW50UG9pbnRzRGlzdGFuY2UgPSBnZXRTZWdtZW50UG9pbnRzRGlzdGFuY2Uoc2VnbWVudFBvaW50cyk7XG4gICAgdmFyIGxpbmVTZWdtZW50TnVtID0gc2VnbWVudFBvaW50c0Rpc3RhbmNlLnJlZHVjZShmdW5jdGlvbiAodG90YWwsIHNlZykge1xuICAgICAgcmV0dXJuIHRvdGFsICsgc2VnLmxlbmd0aDtcbiAgICB9LCAwKTtcbiAgICB2YXIgc2VnbWVudGxlbmd0aCA9IHNlZ21lbnRQb2ludHNEaXN0YW5jZS5tYXAoZnVuY3Rpb24gKHNlZykge1xuICAgICAgcmV0dXJuIGdldE51bXNTdW0oc2VnKTtcbiAgICB9KTtcbiAgICB2YXIgdG90YWxMZW5ndGggPSBnZXROdW1zU3VtKHNlZ21lbnRsZW5ndGgpO1xuICAgIHZhciBhdmdMZW5ndGggPSB0b3RhbExlbmd0aCAvIGxpbmVTZWdtZW50TnVtOyAvLyBDaGVjayBpZiBwcmVjaXNpb24gaXMgcmVhY2hlZFxuXG4gICAgdmFyIGFsbERldmlhdGlvbnMgPSBnZXRBbGxEZXZpYXRpb25zKHNlZ21lbnRQb2ludHNEaXN0YW5jZSwgYXZnTGVuZ3RoKTtcbiAgICBpZiAoYWxsRGV2aWF0aW9ucyA8PSBwcmVjaXNpb24pIHJldHVybiBcImJyZWFrXCI7XG4gICAgdG90YWxQb2ludHNOdW0gPSBjZWlsKGF2Z0xlbmd0aCAvIHByZWNpc2lvbiAqIHRvdGFsUG9pbnRzTnVtICogMS4xKTtcbiAgICB2YXIgc2VnbWVudFBvaW50c051bSA9IHNlZ21lbnRsZW5ndGgubWFwKGZ1bmN0aW9uIChsZW5ndGgpIHtcbiAgICAgIHJldHVybiBjZWlsKGxlbmd0aCAvIHRvdGFsTGVuZ3RoICogdG90YWxQb2ludHNOdW0pO1xuICAgIH0pOyAvLyBDYWxjdWxhdGUgdGhlIHBvaW50cyBhZnRlciByZWRpc3RyaWJ1dGlvblxuXG4gICAgc2VnbWVudFBvaW50cyA9IGdldFNlZ21lbnRQb2ludHNCeU51bShnZXRTZWdtZW50VFBvaW50RnVucywgc2VnbWVudFBvaW50c051bSk7XG4gICAgdG90YWxQb2ludHNOdW0gPSBzZWdtZW50UG9pbnRzLnJlZHVjZShmdW5jdGlvbiAodG90YWwsIHNlZykge1xuICAgICAgcmV0dXJuIHRvdGFsICsgc2VnLmxlbmd0aDtcbiAgICB9LCAwKTtcbiAgICB2YXIgc2VnbWVudFBvaW50c0Zvckxlbmd0aCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc2VnbWVudFBvaW50cykpO1xuICAgIHNlZ21lbnRQb2ludHNGb3JMZW5ndGguZm9yRWFjaChmdW5jdGlvbiAoc2VnLCBpKSB7XG4gICAgICByZXR1cm4gc2VnLnB1c2goc2VnbWVudHNbaV1bMl0pO1xuICAgIH0pO1xuICAgIHNlZ21lbnRQb2ludHNEaXN0YW5jZSA9IGdldFNlZ21lbnRQb2ludHNEaXN0YW5jZShzZWdtZW50UG9pbnRzRm9yTGVuZ3RoKTtcbiAgICBsaW5lU2VnbWVudE51bSA9IHNlZ21lbnRQb2ludHNEaXN0YW5jZS5yZWR1Y2UoZnVuY3Rpb24gKHRvdGFsLCBzZWcpIHtcbiAgICAgIHJldHVybiB0b3RhbCArIHNlZy5sZW5ndGg7XG4gICAgfSwgMCk7XG4gICAgc2VnbWVudGxlbmd0aCA9IHNlZ21lbnRQb2ludHNEaXN0YW5jZS5tYXAoZnVuY3Rpb24gKHNlZykge1xuICAgICAgcmV0dXJuIGdldE51bXNTdW0oc2VnKTtcbiAgICB9KTtcbiAgICB0b3RhbExlbmd0aCA9IGdldE51bXNTdW0oc2VnbWVudGxlbmd0aCk7XG4gICAgYXZnTGVuZ3RoID0gdG90YWxMZW5ndGggLyBsaW5lU2VnbWVudE51bTtcbiAgICB2YXIgc3RlcFNpemUgPSAxIC8gdG90YWxQb2ludHNOdW0gLyAxMDsgLy8gUmVjdXJzaXZlbHkgZm9yIGVhY2ggc2VnbWVudCBvZiB0aGUgcG9seWxpbmVcblxuICAgIGdldFNlZ21lbnRUUG9pbnRGdW5zLmZvckVhY2goZnVuY3Rpb24gKGdldFNlZ21lbnRUUG9pbnRGdW4sIGkpIHtcbiAgICAgIHZhciBjdXJyZW50U2VnbWVudFBvaW50c051bSA9IHNlZ21lbnRQb2ludHNOdW1baV07XG4gICAgICB2YXIgdCA9IG5ldyBBcnJheShjdXJyZW50U2VnbWVudFBvaW50c051bSkuZmlsbCgnJykubWFwKGZ1bmN0aW9uIChmb28sIGopIHtcbiAgICAgICAgcmV0dXJuIGogLyBzZWdtZW50UG9pbnRzTnVtW2ldO1xuICAgICAgfSk7IC8vIFJlcGVhdGVkIHJlY3Vyc2l2ZSBvZmZzZXRcblxuICAgICAgZm9yICh2YXIgciA9IDA7IHIgPCByb3VuZHM7IHIrKykge1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSBnZXRTZWdtZW50UG9pbnRzRGlzdGFuY2UoW3NlZ21lbnRQb2ludHNbaV1dKVswXTtcbiAgICAgICAgdmFyIGRldmlhdGlvbnMgPSBkaXN0YW5jZS5tYXAoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICByZXR1cm4gZCAtIGF2Z0xlbmd0aDtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBvZmZzZXQgPSAwO1xuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY3VycmVudFNlZ21lbnRQb2ludHNOdW07IGorKykge1xuICAgICAgICAgIGlmIChqID09PSAwKSByZXR1cm47XG4gICAgICAgICAgb2Zmc2V0ICs9IGRldmlhdGlvbnNbaiAtIDFdO1xuICAgICAgICAgIHRbal0gLT0gc3RlcFNpemUgKiBvZmZzZXQ7XG4gICAgICAgICAgaWYgKHRbal0gPiAxKSB0W2pdID0gMTtcbiAgICAgICAgICBpZiAodFtqXSA8IDApIHRbal0gPSAwO1xuICAgICAgICAgIHNlZ21lbnRQb2ludHNbaV1bal0gPSBnZXRTZWdtZW50VFBvaW50RnVuKHRbal0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcm91bmRzICo9IDQ7XG4gICAgY3ljbGVzKys7XG4gIH07XG5cbiAgZG8ge1xuICAgIHZhciBfcmV0ID0gX2xvb3AoKTtcblxuICAgIGlmIChfcmV0ID09PSBcImJyZWFrXCIpIGJyZWFrO1xuICB9IHdoaWxlIChyb3VuZHMgPD0gMTAyNSk7XG5cbiAgc2VnbWVudFBvaW50cyA9IHNlZ21lbnRQb2ludHMucmVkdWNlKGZ1bmN0aW9uIChhbGwsIHNlZykge1xuICAgIHJldHVybiBhbGwuY29uY2F0KHNlZyk7XG4gIH0sIFtdKTtcbiAgcmV0dXJuIHtcbiAgICBzZWdtZW50UG9pbnRzOiBzZWdtZW50UG9pbnRzLFxuICAgIGN5Y2xlczogY3ljbGVzLFxuICAgIHJvdW5kczogcm91bmRzXG4gIH07XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCB0aGUgcG9seWxpbmUgY29ycmVzcG9uZGluZyB0byB0aGUgQmV6aWVyIGN1cnZlXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGJlemllckN1cnZlIEJlemllckN1cnZlIGRhdGFcclxuICogQHBhcmFtIHtOdW1iZXJ9IHByZWNpc2lvbiAgQ2FsY3VsYXRpb24gYWNjdXJhY3kuIFJlY29tbWVuZGVkIGZvciAxLTIwLiBEZWZhdWx0ID0gNVxyXG4gKiBAcmV0dXJuIHtBcnJheXxCb29sZWFufSBQb2ludCBkYXRhIHRoYXQgY29uc3RpdHV0ZXMgYSBwb2x5bGluZSBhZnRlciBjYWxjdWxhdGlvbiAoSW52YWxpZCBpbnB1dCB3aWxsIHJldHVybiBmYWxzZSlcclxuICovXG5cblxuZnVuY3Rpb24gYmV6aWVyQ3VydmVUb1BvbHlsaW5lKGJlemllckN1cnZlKSB7XG4gIHZhciBwcmVjaXNpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDU7XG5cbiAgaWYgKCFiZXppZXJDdXJ2ZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2JlemllckN1cnZlVG9Qb2x5bGluZTogTWlzc2luZyBwYXJhbWV0ZXJzIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghKGJlemllckN1cnZlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgY29uc29sZS5lcnJvcignYmV6aWVyQ3VydmVUb1BvbHlsaW5lOiBQYXJhbWV0ZXIgYmV6aWVyQ3VydmUgbXVzdCBiZSBhbiBhcnJheSEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodHlwZW9mIHByZWNpc2lvbiAhPT0gJ251bWJlcicpIHtcbiAgICBjb25zb2xlLmVycm9yKCdiZXppZXJDdXJ2ZVRvUG9seWxpbmU6IFBhcmFtZXRlciBwcmVjaXNpb24gbXVzdCBiZSBhIG51bWJlciEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgX2Fic3RyYWN0QmV6aWVyQ3VydmVUID0gYWJzdHJhY3RCZXppZXJDdXJ2ZVRvUG9seWxpbmUoYmV6aWVyQ3VydmUsIHByZWNpc2lvbiksXG4gICAgICBzZWdtZW50UG9pbnRzID0gX2Fic3RyYWN0QmV6aWVyQ3VydmVULnNlZ21lbnRQb2ludHM7XG5cbiAgcmV0dXJuIHNlZ21lbnRQb2ludHM7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCB0aGUgYmV6aWVyIGN1cnZlIGxlbmd0aFxyXG4gKiBAcGFyYW0ge0FycmF5fSBiZXppZXJDdXJ2ZSBiZXppZXJDdXJ2ZSBkYXRhXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBwcmVjaXNpb24gIGNhbGN1bGF0aW9uIGFjY3VyYWN5LiBSZWNvbW1lbmRlZCBmb3IgNS0xMC4gRGVmYXVsdCA9IDVcclxuICogQHJldHVybiB7TnVtYmVyfEJvb2xlYW59IEJlemllckN1cnZlIGxlbmd0aCAoSW52YWxpZCBpbnB1dCB3aWxsIHJldHVybiBmYWxzZSlcclxuICovXG5cblxuZnVuY3Rpb24gZ2V0QmV6aWVyQ3VydmVMZW5ndGgoYmV6aWVyQ3VydmUpIHtcbiAgdmFyIHByZWNpc2lvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogNTtcblxuICBpZiAoIWJlemllckN1cnZlKSB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0QmV6aWVyQ3VydmVMZW5ndGg6IE1pc3NpbmcgcGFyYW1ldGVycyEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIShiZXppZXJDdXJ2ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2dldEJlemllckN1cnZlTGVuZ3RoOiBQYXJhbWV0ZXIgYmV6aWVyQ3VydmUgbXVzdCBiZSBhbiBhcnJheSEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodHlwZW9mIHByZWNpc2lvbiAhPT0gJ251bWJlcicpIHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRCZXppZXJDdXJ2ZUxlbmd0aDogUGFyYW1ldGVyIHByZWNpc2lvbiBtdXN0IGJlIGEgbnVtYmVyIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBfYWJzdHJhY3RCZXppZXJDdXJ2ZVQyID0gYWJzdHJhY3RCZXppZXJDdXJ2ZVRvUG9seWxpbmUoYmV6aWVyQ3VydmUsIHByZWNpc2lvbiksXG4gICAgICBzZWdtZW50UG9pbnRzID0gX2Fic3RyYWN0QmV6aWVyQ3VydmVUMi5zZWdtZW50UG9pbnRzOyAvLyBDYWxjdWxhdGUgdGhlIHRvdGFsIGxlbmd0aCBvZiB0aGUgcG9pbnRzIHRoYXQgbWFrZSB1cCB0aGUgcG9seWxpbmVcblxuXG4gIHZhciBwb2ludHNEaXN0YW5jZSA9IGdldFNlZ21lbnRQb2ludHNEaXN0YW5jZShbc2VnbWVudFBvaW50c10pWzBdO1xuICB2YXIgbGVuZ3RoID0gZ2V0TnVtc1N1bShwb2ludHNEaXN0YW5jZSk7XG4gIHJldHVybiBsZW5ndGg7XG59XG5cbnZhciBfZGVmYXVsdCA9IGJlemllckN1cnZlVG9Qb2x5bGluZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7IHJldHVybiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCBfbm9uSXRlcmFibGVSZXN0KCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIik7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgeyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyOyB9XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHsgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoaXRlcikgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGl0ZXIpID09PSBcIltvYmplY3QgQXJndW1lbnRzXVwiKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSB9XG5cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQWJzdHJhY3QgdGhlIHBvbHlsaW5lIGZvcm1lZCBieSBOIHBvaW50cyBpbnRvIGEgc2V0IG9mIGJlemllciBjdXJ2ZVxyXG4gKiBAcGFyYW0ge0FycmF5fSBwb2x5bGluZSBBIHNldCBvZiBwb2ludHMgdGhhdCBtYWtlIHVwIGEgcG9seWxpbmVcclxuICogQHBhcmFtIHtCb29sZWFufSBjbG9zZSAgQ2xvc2VkIGN1cnZlXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXRBIFNtb290aG5lc3NcclxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldEIgU21vb3RobmVzc1xyXG4gKiBAcmV0dXJuIHtBcnJheXxCb29sZWFufSBBIHNldCBvZiBiZXppZXIgY3VydmUgKEludmFsaWQgaW5wdXQgd2lsbCByZXR1cm4gZmFsc2UpXHJcbiAqL1xuZnVuY3Rpb24gcG9seWxpbmVUb0JlemllckN1cnZlKHBvbHlsaW5lKSB7XG4gIHZhciBjbG9zZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XG4gIHZhciBvZmZzZXRBID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAwLjI1O1xuICB2YXIgb2Zmc2V0QiA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogMC4yNTtcblxuICBpZiAoIShwb2x5bGluZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ3BvbHlsaW5lVG9CZXppZXJDdXJ2ZTogUGFyYW1ldGVyIHBvbHlsaW5lIG11c3QgYmUgYW4gYXJyYXkhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHBvbHlsaW5lLmxlbmd0aCA8PSAyKSB7XG4gICAgY29uc29sZS5lcnJvcigncG9seWxpbmVUb0JlemllckN1cnZlOiBDb252ZXJ0aW5nIHRvIGEgY3VydmUgcmVxdWlyZXMgYXQgbGVhc3QgMyBwb2ludHMhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHN0YXJ0UG9pbnQgPSBwb2x5bGluZVswXTtcbiAgdmFyIGJlemllckN1cnZlTGluZU51bSA9IHBvbHlsaW5lLmxlbmd0aCAtIDE7XG4gIHZhciBiZXppZXJDdXJ2ZVBvaW50cyA9IG5ldyBBcnJheShiZXppZXJDdXJ2ZUxpbmVOdW0pLmZpbGwoMCkubWFwKGZ1bmN0aW9uIChmb28sIGkpIHtcbiAgICByZXR1cm4gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShnZXRCZXppZXJDdXJ2ZUxpbmVDb250cm9sUG9pbnRzKHBvbHlsaW5lLCBpLCBjbG9zZSwgb2Zmc2V0QSwgb2Zmc2V0QikpLCBbcG9seWxpbmVbaSArIDFdXSk7XG4gIH0pO1xuICBpZiAoY2xvc2UpIGNsb3NlQmV6aWVyQ3VydmUoYmV6aWVyQ3VydmVQb2ludHMsIHN0YXJ0UG9pbnQpO1xuICBiZXppZXJDdXJ2ZVBvaW50cy51bnNoaWZ0KHBvbHlsaW5lWzBdKTtcbiAgcmV0dXJuIGJlemllckN1cnZlUG9pbnRzO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIGNvbnRyb2wgcG9pbnRzIG9mIHRoZSBCZXppZXIgY3VydmVcclxuICogQHBhcmFtIHtBcnJheX0gcG9seWxpbmUgQSBzZXQgb2YgcG9pbnRzIHRoYXQgbWFrZSB1cCBhIHBvbHlsaW5lXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCAgIFRoZSBpbmRleCBvZiB3aGljaCBnZXQgY29udHJvbHMgcG9pbnRzJ3MgcG9pbnQgaW4gcG9seWxpbmVcclxuICogQHBhcmFtIHtCb29sZWFufSBjbG9zZSAgQ2xvc2VkIGN1cnZlXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXRBIFNtb290aG5lc3NcclxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldEIgU21vb3RobmVzc1xyXG4gKiBAcmV0dXJuIHtBcnJheX0gQ29udHJvbCBwb2ludHNcclxuICovXG5cblxuZnVuY3Rpb24gZ2V0QmV6aWVyQ3VydmVMaW5lQ29udHJvbFBvaW50cyhwb2x5bGluZSwgaW5kZXgpIHtcbiAgdmFyIGNsb3NlID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmYWxzZTtcbiAgdmFyIG9mZnNldEEgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IDAuMjU7XG4gIHZhciBvZmZzZXRCID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiAwLjI1O1xuICB2YXIgcG9pbnROdW0gPSBwb2x5bGluZS5sZW5ndGg7XG4gIGlmIChwb2ludE51bSA8IDMgfHwgaW5kZXggPj0gcG9pbnROdW0pIHJldHVybjtcbiAgdmFyIGJlZm9yZVBvaW50SW5kZXggPSBpbmRleCAtIDE7XG4gIGlmIChiZWZvcmVQb2ludEluZGV4IDwgMCkgYmVmb3JlUG9pbnRJbmRleCA9IGNsb3NlID8gcG9pbnROdW0gKyBiZWZvcmVQb2ludEluZGV4IDogMDtcbiAgdmFyIGFmdGVyUG9pbnRJbmRleCA9IGluZGV4ICsgMTtcbiAgaWYgKGFmdGVyUG9pbnRJbmRleCA+PSBwb2ludE51bSkgYWZ0ZXJQb2ludEluZGV4ID0gY2xvc2UgPyBhZnRlclBvaW50SW5kZXggLSBwb2ludE51bSA6IHBvaW50TnVtIC0gMTtcbiAgdmFyIGFmdGVyTmV4dFBvaW50SW5kZXggPSBpbmRleCArIDI7XG4gIGlmIChhZnRlck5leHRQb2ludEluZGV4ID49IHBvaW50TnVtKSBhZnRlck5leHRQb2ludEluZGV4ID0gY2xvc2UgPyBhZnRlck5leHRQb2ludEluZGV4IC0gcG9pbnROdW0gOiBwb2ludE51bSAtIDE7XG4gIHZhciBwb2ludEJlZm9yZSA9IHBvbHlsaW5lW2JlZm9yZVBvaW50SW5kZXhdO1xuICB2YXIgcG9pbnRNaWRkbGUgPSBwb2x5bGluZVtpbmRleF07XG4gIHZhciBwb2ludEFmdGVyID0gcG9seWxpbmVbYWZ0ZXJQb2ludEluZGV4XTtcbiAgdmFyIHBvaW50QWZ0ZXJOZXh0ID0gcG9seWxpbmVbYWZ0ZXJOZXh0UG9pbnRJbmRleF07XG4gIHJldHVybiBbW3BvaW50TWlkZGxlWzBdICsgb2Zmc2V0QSAqIChwb2ludEFmdGVyWzBdIC0gcG9pbnRCZWZvcmVbMF0pLCBwb2ludE1pZGRsZVsxXSArIG9mZnNldEEgKiAocG9pbnRBZnRlclsxXSAtIHBvaW50QmVmb3JlWzFdKV0sIFtwb2ludEFmdGVyWzBdIC0gb2Zmc2V0QiAqIChwb2ludEFmdGVyTmV4dFswXSAtIHBvaW50TWlkZGxlWzBdKSwgcG9pbnRBZnRlclsxXSAtIG9mZnNldEIgKiAocG9pbnRBZnRlck5leHRbMV0gLSBwb2ludE1pZGRsZVsxXSldXTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSBsYXN0IGN1cnZlIG9mIHRoZSBjbG9zdXJlXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGJlemllckN1cnZlIEEgc2V0IG9mIHN1Yi1jdXJ2ZVxyXG4gKiBAcGFyYW0ge0FycmF5fSBzdGFydFBvaW50ICBTdGFydCBwb2ludFxyXG4gKiBAcmV0dXJuIHtBcnJheX0gVGhlIGxhc3QgY3VydmUgZm9yIGNsb3N1cmVcclxuICovXG5cblxuZnVuY3Rpb24gY2xvc2VCZXppZXJDdXJ2ZShiZXppZXJDdXJ2ZSwgc3RhcnRQb2ludCkge1xuICB2YXIgZmlyc3RTdWJDdXJ2ZSA9IGJlemllckN1cnZlWzBdO1xuICB2YXIgbGFzdFN1YkN1cnZlID0gYmV6aWVyQ3VydmUuc2xpY2UoLTEpWzBdO1xuICBiZXppZXJDdXJ2ZS5wdXNoKFtnZXRTeW1tZXRyeVBvaW50KGxhc3RTdWJDdXJ2ZVsxXSwgbGFzdFN1YkN1cnZlWzJdKSwgZ2V0U3ltbWV0cnlQb2ludChmaXJzdFN1YkN1cnZlWzBdLCBzdGFydFBvaW50KSwgc3RhcnRQb2ludF0pO1xuICByZXR1cm4gYmV6aWVyQ3VydmU7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCB0aGUgc3ltbWV0cnkgcG9pbnRcclxuICogQHBhcmFtIHtBcnJheX0gcG9pbnQgICAgICAgU3ltbWV0cmljIHBvaW50XHJcbiAqIEBwYXJhbSB7QXJyYXl9IGNlbnRlclBvaW50IFN5bW1ldHJpYyBjZW50ZXJcclxuICogQHJldHVybiB7QXJyYXl9IFN5bW1ldHJpYyBwb2ludFxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRTeW1tZXRyeVBvaW50KHBvaW50LCBjZW50ZXJQb2ludCkge1xuICB2YXIgX3BvaW50ID0gX3NsaWNlZFRvQXJyYXkocG9pbnQsIDIpLFxuICAgICAgcHggPSBfcG9pbnRbMF0sXG4gICAgICBweSA9IF9wb2ludFsxXTtcblxuICB2YXIgX2NlbnRlclBvaW50ID0gX3NsaWNlZFRvQXJyYXkoY2VudGVyUG9pbnQsIDIpLFxuICAgICAgY3ggPSBfY2VudGVyUG9pbnRbMF0sXG4gICAgICBjeSA9IF9jZW50ZXJQb2ludFsxXTtcblxuICB2YXIgbWludXNYID0gY3ggLSBweDtcbiAgdmFyIG1pbnVzWSA9IGN5IC0gcHk7XG4gIHJldHVybiBbY3ggKyBtaW51c1gsIGN5ICsgbWludXNZXTtcbn1cblxudmFyIF9kZWZhdWx0ID0gcG9seWxpbmVUb0JlemllckN1cnZlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImJlemllckN1cnZlVG9Qb2x5bGluZVwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfYmV6aWVyQ3VydmVUb1BvbHlsaW5lLmJlemllckN1cnZlVG9Qb2x5bGluZTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJnZXRCZXppZXJDdXJ2ZUxlbmd0aFwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfYmV6aWVyQ3VydmVUb1BvbHlsaW5lLmdldEJlemllckN1cnZlTGVuZ3RoO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInBvbHlsaW5lVG9CZXppZXJDdXJ2ZVwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfcG9seWxpbmVUb0JlemllckN1cnZlW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9iZXppZXJDdXJ2ZVRvUG9seWxpbmUgPSByZXF1aXJlKFwiLi9jb3JlL2JlemllckN1cnZlVG9Qb2x5bGluZVwiKTtcblxudmFyIF9wb2x5bGluZVRvQmV6aWVyQ3VydmUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2NvcmUvcG9seWxpbmVUb0JlemllckN1cnZlXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBfZGVmYXVsdCA9IHtcbiAgYmV6aWVyQ3VydmVUb1BvbHlsaW5lOiBfYmV6aWVyQ3VydmVUb1BvbHlsaW5lLmJlemllckN1cnZlVG9Qb2x5bGluZSxcbiAgZ2V0QmV6aWVyQ3VydmVMZW5ndGg6IF9iZXppZXJDdXJ2ZVRvUG9seWxpbmUuZ2V0QmV6aWVyQ3VydmVMZW5ndGgsXG4gIHBvbHlsaW5lVG9CZXppZXJDdXJ2ZTogX3BvbHlsaW5lVG9CZXppZXJDdXJ2ZVtcImRlZmF1bHRcIl1cbn07XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0OyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfZGVmYXVsdCA9IG5ldyBNYXAoW1sndHJhbnNwYXJlbnQnLCAncmdiYSgwLDAsMCwwKSddLCBbJ2JsYWNrJywgJyMwMDAwMDAnXSwgWydzaWx2ZXInLCAnI0MwQzBDMCddLCBbJ2dyYXknLCAnIzgwODA4MCddLCBbJ3doaXRlJywgJyNGRkZGRkYnXSwgWydtYXJvb24nLCAnIzgwMDAwMCddLCBbJ3JlZCcsICcjRkYwMDAwJ10sIFsncHVycGxlJywgJyM4MDAwODAnXSwgWydmdWNoc2lhJywgJyNGRjAwRkYnXSwgWydncmVlbicsICcjMDA4MDAwJ10sIFsnbGltZScsICcjMDBGRjAwJ10sIFsnb2xpdmUnLCAnIzgwODAwMCddLCBbJ3llbGxvdycsICcjRkZGRjAwJ10sIFsnbmF2eScsICcjMDAwMDgwJ10sIFsnYmx1ZScsICcjMDAwMEZGJ10sIFsndGVhbCcsICcjMDA4MDgwJ10sIFsnYXF1YScsICcjMDBGRkZGJ10sIFsnYWxpY2VibHVlJywgJyNmMGY4ZmYnXSwgWydhbnRpcXVld2hpdGUnLCAnI2ZhZWJkNyddLCBbJ2FxdWFtYXJpbmUnLCAnIzdmZmZkNCddLCBbJ2F6dXJlJywgJyNmMGZmZmYnXSwgWydiZWlnZScsICcjZjVmNWRjJ10sIFsnYmlzcXVlJywgJyNmZmU0YzQnXSwgWydibGFuY2hlZGFsbW9uZCcsICcjZmZlYmNkJ10sIFsnYmx1ZXZpb2xldCcsICcjOGEyYmUyJ10sIFsnYnJvd24nLCAnI2E1MmEyYSddLCBbJ2J1cmx5d29vZCcsICcjZGViODg3J10sIFsnY2FkZXRibHVlJywgJyM1ZjllYTAnXSwgWydjaGFydHJldXNlJywgJyM3ZmZmMDAnXSwgWydjaG9jb2xhdGUnLCAnI2QyNjkxZSddLCBbJ2NvcmFsJywgJyNmZjdmNTAnXSwgWydjb3JuZmxvd2VyYmx1ZScsICcjNjQ5NWVkJ10sIFsnY29ybnNpbGsnLCAnI2ZmZjhkYyddLCBbJ2NyaW1zb24nLCAnI2RjMTQzYyddLCBbJ2N5YW4nLCAnIzAwZmZmZiddLCBbJ2RhcmtibHVlJywgJyMwMDAwOGInXSwgWydkYXJrY3lhbicsICcjMDA4YjhiJ10sIFsnZGFya2dvbGRlbnJvZCcsICcjYjg4NjBiJ10sIFsnZGFya2dyYXknLCAnI2E5YTlhOSddLCBbJ2RhcmtncmVlbicsICcjMDA2NDAwJ10sIFsnZGFya2dyZXknLCAnI2E5YTlhOSddLCBbJ2RhcmtraGFraScsICcjYmRiNzZiJ10sIFsnZGFya21hZ2VudGEnLCAnIzhiMDA4YiddLCBbJ2RhcmtvbGl2ZWdyZWVuJywgJyM1NTZiMmYnXSwgWydkYXJrb3JhbmdlJywgJyNmZjhjMDAnXSwgWydkYXJrb3JjaGlkJywgJyM5OTMyY2MnXSwgWydkYXJrcmVkJywgJyM4YjAwMDAnXSwgWydkYXJrc2FsbW9uJywgJyNlOTk2N2EnXSwgWydkYXJrc2VhZ3JlZW4nLCAnIzhmYmM4ZiddLCBbJ2RhcmtzbGF0ZWJsdWUnLCAnIzQ4M2Q4YiddLCBbJ2RhcmtzbGF0ZWdyYXknLCAnIzJmNGY0ZiddLCBbJ2RhcmtzbGF0ZWdyZXknLCAnIzJmNGY0ZiddLCBbJ2Rhcmt0dXJxdW9pc2UnLCAnIzAwY2VkMSddLCBbJ2Rhcmt2aW9sZXQnLCAnIzk0MDBkMyddLCBbJ2RlZXBwaW5rJywgJyNmZjE0OTMnXSwgWydkZWVwc2t5Ymx1ZScsICcjMDBiZmZmJ10sIFsnZGltZ3JheScsICcjNjk2OTY5J10sIFsnZGltZ3JleScsICcjNjk2OTY5J10sIFsnZG9kZ2VyYmx1ZScsICcjMWU5MGZmJ10sIFsnZmlyZWJyaWNrJywgJyNiMjIyMjInXSwgWydmbG9yYWx3aGl0ZScsICcjZmZmYWYwJ10sIFsnZm9yZXN0Z3JlZW4nLCAnIzIyOGIyMiddLCBbJ2dhaW5zYm9ybycsICcjZGNkY2RjJ10sIFsnZ2hvc3R3aGl0ZScsICcjZjhmOGZmJ10sIFsnZ29sZCcsICcjZmZkNzAwJ10sIFsnZ29sZGVucm9kJywgJyNkYWE1MjAnXSwgWydncmVlbnllbGxvdycsICcjYWRmZjJmJ10sIFsnZ3JleScsICcjODA4MDgwJ10sIFsnaG9uZXlkZXcnLCAnI2YwZmZmMCddLCBbJ2hvdHBpbmsnLCAnI2ZmNjliNCddLCBbJ2luZGlhbnJlZCcsICcjY2Q1YzVjJ10sIFsnaW5kaWdvJywgJyM0YjAwODInXSwgWydpdm9yeScsICcjZmZmZmYwJ10sIFsna2hha2knLCAnI2YwZTY4YyddLCBbJ2xhdmVuZGVyJywgJyNlNmU2ZmEnXSwgWydsYXZlbmRlcmJsdXNoJywgJyNmZmYwZjUnXSwgWydsYXduZ3JlZW4nLCAnIzdjZmMwMCddLCBbJ2xlbW9uY2hpZmZvbicsICcjZmZmYWNkJ10sIFsnbGlnaHRibHVlJywgJyNhZGQ4ZTYnXSwgWydsaWdodGNvcmFsJywgJyNmMDgwODAnXSwgWydsaWdodGN5YW4nLCAnI2UwZmZmZiddLCBbJ2xpZ2h0Z29sZGVucm9keWVsbG93JywgJyNmYWZhZDInXSwgWydsaWdodGdyYXknLCAnI2QzZDNkMyddLCBbJ2xpZ2h0Z3JlZW4nLCAnIzkwZWU5MCddLCBbJ2xpZ2h0Z3JleScsICcjZDNkM2QzJ10sIFsnbGlnaHRwaW5rJywgJyNmZmI2YzEnXSwgWydsaWdodHNhbG1vbicsICcjZmZhMDdhJ10sIFsnbGlnaHRzZWFncmVlbicsICcjMjBiMmFhJ10sIFsnbGlnaHRza3libHVlJywgJyM4N2NlZmEnXSwgWydsaWdodHNsYXRlZ3JheScsICcjNzc4ODk5J10sIFsnbGlnaHRzbGF0ZWdyZXknLCAnIzc3ODg5OSddLCBbJ2xpZ2h0c3RlZWxibHVlJywgJyNiMGM0ZGUnXSwgWydsaWdodHllbGxvdycsICcjZmZmZmUwJ10sIFsnbGltZWdyZWVuJywgJyMzMmNkMzInXSwgWydsaW5lbicsICcjZmFmMGU2J10sIFsnbWFnZW50YScsICcjZmYwMGZmJ10sIFsnbWVkaXVtYXF1YW1hcmluZScsICcjNjZjZGFhJ10sIFsnbWVkaXVtYmx1ZScsICcjMDAwMGNkJ10sIFsnbWVkaXVtb3JjaGlkJywgJyNiYTU1ZDMnXSwgWydtZWRpdW1wdXJwbGUnLCAnIzkzNzBkYiddLCBbJ21lZGl1bXNlYWdyZWVuJywgJyMzY2IzNzEnXSwgWydtZWRpdW1zbGF0ZWJsdWUnLCAnIzdiNjhlZSddLCBbJ21lZGl1bXNwcmluZ2dyZWVuJywgJyMwMGZhOWEnXSwgWydtZWRpdW10dXJxdW9pc2UnLCAnIzQ4ZDFjYyddLCBbJ21lZGl1bXZpb2xldHJlZCcsICcjYzcxNTg1J10sIFsnbWlkbmlnaHRibHVlJywgJyMxOTE5NzAnXSwgWydtaW50Y3JlYW0nLCAnI2Y1ZmZmYSddLCBbJ21pc3R5cm9zZScsICcjZmZlNGUxJ10sIFsnbW9jY2FzaW4nLCAnI2ZmZTRiNSddLCBbJ25hdmFqb3doaXRlJywgJyNmZmRlYWQnXSwgWydvbGRsYWNlJywgJyNmZGY1ZTYnXSwgWydvbGl2ZWRyYWInLCAnIzZiOGUyMyddLCBbJ29yYW5nZScsICcjZmZhNTAwJ10sIFsnb3JhbmdlcmVkJywgJyNmZjQ1MDAnXSwgWydvcmNoaWQnLCAnI2RhNzBkNiddLCBbJ3BhbGVnb2xkZW5yb2QnLCAnI2VlZThhYSddLCBbJ3BhbGVncmVlbicsICcjOThmYjk4J10sIFsncGFsZXR1cnF1b2lzZScsICcjYWZlZWVlJ10sIFsncGFsZXZpb2xldHJlZCcsICcjZGI3MDkzJ10sIFsncGFwYXlhd2hpcCcsICcjZmZlZmQ1J10sIFsncGVhY2hwdWZmJywgJyNmZmRhYjknXSwgWydwZXJ1JywgJyNjZDg1M2YnXSwgWydwaW5rJywgJyNmZmMwY2InXSwgWydwbHVtJywgJyNkZGEwZGQnXSwgWydwb3dkZXJibHVlJywgJyNiMGUwZTYnXSwgWydyb3N5YnJvd24nLCAnI2JjOGY4ZiddLCBbJ3JveWFsYmx1ZScsICcjNDE2OWUxJ10sIFsnc2FkZGxlYnJvd24nLCAnIzhiNDUxMyddLCBbJ3NhbG1vbicsICcjZmE4MDcyJ10sIFsnc2FuZHlicm93bicsICcjZjRhNDYwJ10sIFsnc2VhZ3JlZW4nLCAnIzJlOGI1NyddLCBbJ3NlYXNoZWxsJywgJyNmZmY1ZWUnXSwgWydzaWVubmEnLCAnI2EwNTIyZCddLCBbJ3NreWJsdWUnLCAnIzg3Y2VlYiddLCBbJ3NsYXRlYmx1ZScsICcjNmE1YWNkJ10sIFsnc2xhdGVncmF5JywgJyM3MDgwOTAnXSwgWydzbGF0ZWdyZXknLCAnIzcwODA5MCddLCBbJ3Nub3cnLCAnI2ZmZmFmYSddLCBbJ3NwcmluZ2dyZWVuJywgJyMwMGZmN2YnXSwgWydzdGVlbGJsdWUnLCAnIzQ2ODJiNCddLCBbJ3RhbicsICcjZDJiNDhjJ10sIFsndGhpc3RsZScsICcjZDhiZmQ4J10sIFsndG9tYXRvJywgJyNmZjYzNDcnXSwgWyd0dXJxdW9pc2UnLCAnIzQwZTBkMCddLCBbJ3Zpb2xldCcsICcjZWU4MmVlJ10sIFsnd2hlYXQnLCAnI2Y1ZGViMyddLCBbJ3doaXRlc21va2UnLCAnI2Y1ZjVmNSddLCBbJ3llbGxvd2dyZWVuJywgJyM5YWNkMzInXV0pO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0OyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5nZXRSZ2JWYWx1ZSA9IGdldFJnYlZhbHVlO1xuZXhwb3J0cy5nZXRSZ2JhVmFsdWUgPSBnZXRSZ2JhVmFsdWU7XG5leHBvcnRzLmdldE9wYWNpdHkgPSBnZXRPcGFjaXR5O1xuZXhwb3J0cy50b1JnYiA9IHRvUmdiO1xuZXhwb3J0cy50b0hleCA9IHRvSGV4O1xuZXhwb3J0cy5nZXRDb2xvckZyb21SZ2JWYWx1ZSA9IGdldENvbG9yRnJvbVJnYlZhbHVlO1xuZXhwb3J0cy5kYXJrZW4gPSBkYXJrZW47XG5leHBvcnRzLmxpZ2h0ZW4gPSBsaWdodGVuO1xuZXhwb3J0cy5mYWRlID0gZmFkZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX2tleXdvcmRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9jb25maWcva2V5d29yZHNcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikgeyBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyKSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlcikgPT09IFwiW29iamVjdCBBcmd1bWVudHNdXCIpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IH1cblxudmFyIGhleFJlZyA9IC9eIyhbMC05YS1mQS1mXXszfXxbMC05YS1mQS1mXXs2fSkkLztcbnZhciByZ2JSZWcgPSAvXihyZ2J8cmdiYXxSR0J8UkdCQSkvO1xudmFyIHJnYmFSZWcgPSAvXihyZ2JhfFJHQkEpLztcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQ29sb3IgdmFsaWRhdG9yXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciBIZXh8UmdifFJnYmEgY29sb3Igb3IgY29sb3Iga2V5d29yZFxyXG4gKiBAcmV0dXJuIHtTdHJpbmd8Qm9vbGVhbn0gVmFsaWQgY29sb3IgT3IgZmFsc2VcclxuICovXG5cbmZ1bmN0aW9uIHZhbGlkYXRvcihjb2xvcikge1xuICB2YXIgaXNIZXggPSBoZXhSZWcudGVzdChjb2xvcik7XG4gIHZhciBpc1JnYiA9IHJnYlJlZy50ZXN0KGNvbG9yKTtcbiAgaWYgKGlzSGV4IHx8IGlzUmdiKSByZXR1cm4gY29sb3I7XG4gIGNvbG9yID0gZ2V0Q29sb3JCeUtleXdvcmQoY29sb3IpO1xuXG4gIGlmICghY29sb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdDb2xvcjogSW52YWxpZCBjb2xvciEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gY29sb3I7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCBjb2xvciBieSBrZXl3b3JkXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXl3b3JkIENvbG9yIGtleXdvcmQgbGlrZSByZWQsIGdyZWVuIGFuZCBldGMuXHJcbiAqIEByZXR1cm4ge1N0cmluZ3xCb29sZWFufSBIZXggb3IgcmdiYSBjb2xvciAoSW52YWxpZCBrZXl3b3JkIHdpbGwgcmV0dXJuIGZhbHNlKVxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRDb2xvckJ5S2V5d29yZChrZXl3b3JkKSB7XG4gIGlmICgha2V5d29yZCkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2dldENvbG9yQnlLZXl3b3JkczogTWlzc2luZyBwYXJhbWV0ZXJzIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghX2tleXdvcmRzW1wiZGVmYXVsdFwiXS5oYXMoa2V5d29yZCkpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIF9rZXl3b3Jkc1tcImRlZmF1bHRcIl0uZ2V0KGtleXdvcmQpO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIFJnYiB2YWx1ZSBvZiB0aGUgY29sb3JcclxuICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIEhleHxSZ2J8UmdiYSBjb2xvciBvciBjb2xvciBrZXl3b3JkXHJcbiAqIEByZXR1cm4ge0FycmF5PE51bWJlcj58Qm9vbGVhbn0gUmdiIHZhbHVlIG9mIHRoZSBjb2xvciAoSW52YWxpZCBpbnB1dCB3aWxsIHJldHVybiBmYWxzZSlcclxuICovXG5cblxuZnVuY3Rpb24gZ2V0UmdiVmFsdWUoY29sb3IpIHtcbiAgaWYgKCFjb2xvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2dldFJnYlZhbHVlOiBNaXNzaW5nIHBhcmFtZXRlcnMhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29sb3IgPSB2YWxpZGF0b3IoY29sb3IpO1xuICBpZiAoIWNvbG9yKSByZXR1cm4gZmFsc2U7XG4gIHZhciBpc0hleCA9IGhleFJlZy50ZXN0KGNvbG9yKTtcbiAgdmFyIGlzUmdiID0gcmdiUmVnLnRlc3QoY29sb3IpO1xuICB2YXIgbG93ZXJDb2xvciA9IGNvbG9yLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChpc0hleCkgcmV0dXJuIGdldFJnYlZhbHVlRnJvbUhleChsb3dlckNvbG9yKTtcbiAgaWYgKGlzUmdiKSByZXR1cm4gZ2V0UmdiVmFsdWVGcm9tUmdiKGxvd2VyQ29sb3IpO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIHJnYiB2YWx1ZSBvZiB0aGUgaGV4IGNvbG9yXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciBIZXggY29sb3JcclxuICogQHJldHVybiB7QXJyYXk8TnVtYmVyPn0gUmdiIHZhbHVlIG9mIHRoZSBjb2xvclxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRSZ2JWYWx1ZUZyb21IZXgoY29sb3IpIHtcbiAgY29sb3IgPSBjb2xvci5yZXBsYWNlKCcjJywgJycpO1xuICBpZiAoY29sb3IubGVuZ3RoID09PSAzKSBjb2xvciA9IEFycmF5LmZyb20oY29sb3IpLm1hcChmdW5jdGlvbiAoaGV4TnVtKSB7XG4gICAgcmV0dXJuIGhleE51bSArIGhleE51bTtcbiAgfSkuam9pbignJyk7XG4gIGNvbG9yID0gY29sb3Iuc3BsaXQoJycpO1xuICByZXR1cm4gbmV3IEFycmF5KDMpLmZpbGwoMCkubWFwKGZ1bmN0aW9uICh0LCBpKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KFwiMHhcIi5jb25jYXQoY29sb3JbaSAqIDJdKS5jb25jYXQoY29sb3JbaSAqIDIgKyAxXSkpO1xuICB9KTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSByZ2IgdmFsdWUgb2YgdGhlIHJnYi9yZ2JhIGNvbG9yXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciBIZXggY29sb3JcclxuICogQHJldHVybiB7QXJyYXl9IFJnYiB2YWx1ZSBvZiB0aGUgY29sb3JcclxuICovXG5cblxuZnVuY3Rpb24gZ2V0UmdiVmFsdWVGcm9tUmdiKGNvbG9yKSB7XG4gIHJldHVybiBjb2xvci5yZXBsYWNlKC9yZ2JcXCh8cmdiYVxcKHxcXCkvZywgJycpLnNwbGl0KCcsJykuc2xpY2UoMCwgMykubWFwKGZ1bmN0aW9uIChuKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KG4pO1xuICB9KTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSBSZ2JhIHZhbHVlIG9mIHRoZSBjb2xvclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sb3IgSGV4fFJnYnxSZ2JhIGNvbG9yIG9yIGNvbG9yIGtleXdvcmRcclxuICogQHJldHVybiB7QXJyYXk8TnVtYmVyPnxCb29sZWFufSBSZ2JhIHZhbHVlIG9mIHRoZSBjb2xvciAoSW52YWxpZCBpbnB1dCB3aWxsIHJldHVybiBmYWxzZSlcclxuICovXG5cblxuZnVuY3Rpb24gZ2V0UmdiYVZhbHVlKGNvbG9yKSB7XG4gIGlmICghY29sb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRSZ2JhVmFsdWU6IE1pc3NpbmcgcGFyYW1ldGVycyEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgY29sb3JWYWx1ZSA9IGdldFJnYlZhbHVlKGNvbG9yKTtcbiAgaWYgKCFjb2xvclZhbHVlKSByZXR1cm4gZmFsc2U7XG4gIGNvbG9yVmFsdWUucHVzaChnZXRPcGFjaXR5KGNvbG9yKSk7XG4gIHJldHVybiBjb2xvclZhbHVlO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIG9wYWNpdHkgb2YgY29sb3JcclxuICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIEhleHxSZ2J8UmdiYSBjb2xvciBvciBjb2xvciBrZXl3b3JkXHJcbiAqIEByZXR1cm4ge051bWJlcnxCb29sZWFufSBDb2xvciBvcGFjaXR5IChJbnZhbGlkIGlucHV0IHdpbGwgcmV0dXJuIGZhbHNlKVxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRPcGFjaXR5KGNvbG9yKSB7XG4gIGlmICghY29sb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRPcGFjaXR5OiBNaXNzaW5nIHBhcmFtZXRlcnMhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29sb3IgPSB2YWxpZGF0b3IoY29sb3IpO1xuICBpZiAoIWNvbG9yKSByZXR1cm4gZmFsc2U7XG4gIHZhciBpc1JnYmEgPSByZ2JhUmVnLnRlc3QoY29sb3IpO1xuICBpZiAoIWlzUmdiYSkgcmV0dXJuIDE7XG4gIGNvbG9yID0gY29sb3IudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIE51bWJlcihjb2xvci5zcGxpdCgnLCcpLnNsaWNlKC0xKVswXS5yZXBsYWNlKC9bKXxcXHNdL2csICcnKSk7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIENvbnZlcnQgY29sb3IgdG8gUmdifFJnYmEgY29sb3JcclxuICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yICAgSGV4fFJnYnxSZ2JhIGNvbG9yIG9yIGNvbG9yIGtleXdvcmRcclxuICogQHBhcmFtIHtOdW1iZXJ9IG9wYWNpdHkgVGhlIG9wYWNpdHkgb2YgY29sb3JcclxuICogQHJldHVybiB7U3RyaW5nfEJvb2xlYW59IFJnYnxSZ2JhIGNvbG9yIChJbnZhbGlkIGlucHV0IHdpbGwgcmV0dXJuIGZhbHNlKVxyXG4gKi9cblxuXG5mdW5jdGlvbiB0b1JnYihjb2xvciwgb3BhY2l0eSkge1xuICBpZiAoIWNvbG9yKSB7XG4gICAgY29uc29sZS5lcnJvcigndG9SZ2I6IE1pc3NpbmcgcGFyYW1ldGVycyEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcmdiVmFsdWUgPSBnZXRSZ2JWYWx1ZShjb2xvcik7XG4gIGlmICghcmdiVmFsdWUpIHJldHVybiBmYWxzZTtcbiAgdmFyIGFkZE9wYWNpdHkgPSB0eXBlb2Ygb3BhY2l0eSA9PT0gJ251bWJlcic7XG4gIGlmIChhZGRPcGFjaXR5KSByZXR1cm4gJ3JnYmEoJyArIHJnYlZhbHVlLmpvaW4oJywnKSArIFwiLFwiLmNvbmNhdChvcGFjaXR5LCBcIilcIik7XG4gIHJldHVybiAncmdiKCcgKyByZ2JWYWx1ZS5qb2luKCcsJykgKyAnKSc7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIENvbnZlcnQgY29sb3IgdG8gSGV4IGNvbG9yXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciBIZXh8UmdifFJnYmEgY29sb3Igb3IgY29sb3Iga2V5d29yZFxyXG4gKiBAcmV0dXJuIHtTdHJpbmd8Qm9vbGVhbn0gSGV4IGNvbG9yIChJbnZhbGlkIGlucHV0IHdpbGwgcmV0dXJuIGZhbHNlKVxyXG4gKi9cblxuXG5mdW5jdGlvbiB0b0hleChjb2xvcikge1xuICBpZiAoIWNvbG9yKSB7XG4gICAgY29uc29sZS5lcnJvcigndG9IZXg6IE1pc3NpbmcgcGFyYW1ldGVycyEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoaGV4UmVnLnRlc3QoY29sb3IpKSByZXR1cm4gY29sb3I7XG4gIGNvbG9yID0gZ2V0UmdiVmFsdWUoY29sb3IpO1xuICBpZiAoIWNvbG9yKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiAnIycgKyBjb2xvci5tYXAoZnVuY3Rpb24gKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4pLnRvU3RyaW5nKDE2KTtcbiAgfSkubWFwKGZ1bmN0aW9uIChuKSB7XG4gICAgcmV0dXJuIG4gPT09ICcwJyA/ICcwMCcgOiBuO1xuICB9KS5qb2luKCcnKTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IENvbG9yIGZyb20gUmdifFJnYmEgdmFsdWVcclxuICogQHBhcmFtIHtBcnJheTxOdW1iZXI+fSB2YWx1ZSBSZ2J8UmdiYSBjb2xvciB2YWx1ZVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd8Qm9vbGVhbn0gUmdifFJnYmEgY29sb3IgKEludmFsaWQgaW5wdXQgd2lsbCByZXR1cm4gZmFsc2UpXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldENvbG9yRnJvbVJnYlZhbHVlKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRDb2xvckZyb21SZ2JWYWx1ZTogTWlzc2luZyBwYXJhbWV0ZXJzIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciB2YWx1ZUxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcblxuICBpZiAodmFsdWVMZW5ndGggIT09IDMgJiYgdmFsdWVMZW5ndGggIT09IDQpIHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRDb2xvckZyb21SZ2JWYWx1ZTogVmFsdWUgaXMgaWxsZWdhbCEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgY29sb3IgPSB2YWx1ZUxlbmd0aCA9PT0gMyA/ICdyZ2IoJyA6ICdyZ2JhKCc7XG4gIGNvbG9yICs9IHZhbHVlLmpvaW4oJywnKSArICcpJztcbiAgcmV0dXJuIGNvbG9yO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBEZWVwZW4gY29sb3JcclxuICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIEhleHxSZ2J8UmdiYSBjb2xvciBvciBjb2xvciBrZXl3b3JkXHJcbiAqIEByZXR1cm4ge051bWJlcn0gUGVyY2VudCBvZiBEZWVwZW4gKDEtMTAwKVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd8Qm9vbGVhbn0gUmdiYSBjb2xvciAoSW52YWxpZCBpbnB1dCB3aWxsIHJldHVybiBmYWxzZSlcclxuICovXG5cblxuZnVuY3Rpb24gZGFya2VuKGNvbG9yKSB7XG4gIHZhciBwZXJjZW50ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuXG4gIGlmICghY29sb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdkYXJrZW46IE1pc3NpbmcgcGFyYW1ldGVycyEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcmdiYVZhbHVlID0gZ2V0UmdiYVZhbHVlKGNvbG9yKTtcbiAgaWYgKCFyZ2JhVmFsdWUpIHJldHVybiBmYWxzZTtcbiAgcmdiYVZhbHVlID0gcmdiYVZhbHVlLm1hcChmdW5jdGlvbiAodiwgaSkge1xuICAgIHJldHVybiBpID09PSAzID8gdiA6IHYgLSBNYXRoLmNlaWwoMi41NSAqIHBlcmNlbnQpO1xuICB9KS5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICByZXR1cm4gdiA8IDAgPyAwIDogdjtcbiAgfSk7XG4gIHJldHVybiBnZXRDb2xvckZyb21SZ2JWYWx1ZShyZ2JhVmFsdWUpO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBCcmlnaHRlbiBjb2xvclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sb3IgSGV4fFJnYnxSZ2JhIGNvbG9yIG9yIGNvbG9yIGtleXdvcmRcclxuICogQHJldHVybiB7TnVtYmVyfSBQZXJjZW50IG9mIGJyaWdodGVuICgxLTEwMClcclxuICogQHJldHVybiB7U3RyaW5nfEJvb2xlYW59IFJnYmEgY29sb3IgKEludmFsaWQgaW5wdXQgd2lsbCByZXR1cm4gZmFsc2UpXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGxpZ2h0ZW4oY29sb3IpIHtcbiAgdmFyIHBlcmNlbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG5cbiAgaWYgKCFjb2xvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2xpZ2h0ZW46IE1pc3NpbmcgcGFyYW1ldGVycyEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcmdiYVZhbHVlID0gZ2V0UmdiYVZhbHVlKGNvbG9yKTtcbiAgaWYgKCFyZ2JhVmFsdWUpIHJldHVybiBmYWxzZTtcbiAgcmdiYVZhbHVlID0gcmdiYVZhbHVlLm1hcChmdW5jdGlvbiAodiwgaSkge1xuICAgIHJldHVybiBpID09PSAzID8gdiA6IHYgKyBNYXRoLmNlaWwoMi41NSAqIHBlcmNlbnQpO1xuICB9KS5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICByZXR1cm4gdiA+IDI1NSA/IDI1NSA6IHY7XG4gIH0pO1xuICByZXR1cm4gZ2V0Q29sb3JGcm9tUmdiVmFsdWUocmdiYVZhbHVlKTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQWRqdXN0IGNvbG9yIG9wYWNpdHlcclxuICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yICAgSGV4fFJnYnxSZ2JhIGNvbG9yIG9yIGNvbG9yIGtleXdvcmRcclxuICogQHBhcmFtIHtOdW1iZXJ9IFBlcmNlbnQgb2Ygb3BhY2l0eVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd8Qm9vbGVhbn0gUmdiYSBjb2xvciAoSW52YWxpZCBpbnB1dCB3aWxsIHJldHVybiBmYWxzZSlcclxuICovXG5cblxuZnVuY3Rpb24gZmFkZShjb2xvcikge1xuICB2YXIgcGVyY2VudCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMTAwO1xuXG4gIGlmICghY29sb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdmYWRlOiBNaXNzaW5nIHBhcmFtZXRlcnMhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHJnYlZhbHVlID0gZ2V0UmdiVmFsdWUoY29sb3IpO1xuICBpZiAoIXJnYlZhbHVlKSByZXR1cm4gZmFsc2U7XG4gIHZhciByZ2JhVmFsdWUgPSBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KHJnYlZhbHVlKSwgW3BlcmNlbnQgLyAxMDBdKTtcbiAgcmV0dXJuIGdldENvbG9yRnJvbVJnYlZhbHVlKHJnYmFWYWx1ZSk7XG59XG5cbnZhciBfZGVmYXVsdCA9IHtcbiAgZmFkZTogZmFkZSxcbiAgdG9IZXg6IHRvSGV4LFxuICB0b1JnYjogdG9SZ2IsXG4gIGRhcmtlbjogZGFya2VuLFxuICBsaWdodGVuOiBsaWdodGVuLFxuICBnZXRPcGFjaXR5OiBnZXRPcGFjaXR5LFxuICBnZXRSZ2JWYWx1ZTogZ2V0UmdiVmFsdWUsXG4gIGdldFJnYmFWYWx1ZTogZ2V0UmdiYVZhbHVlLFxuICBnZXRDb2xvckZyb21SZ2JWYWx1ZTogZ2V0Q29sb3JGcm9tUmdiVmFsdWVcbn07XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0OyJdfQ==
