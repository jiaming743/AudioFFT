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