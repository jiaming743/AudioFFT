import { getRgbaValue, getColorFromRgbValue, fade } from '@jiaminghi/color'
import { polylineToBezierCurve } from '@jiaminghi/bezier-curve'

/**
 * @description Class of AudioFFT
 * @param {Object} canvas Canvas DOM
 * @param {Object} config configuration
 * @return {AudioFft} AudioFft Instance
 */
export default class AudioFFT {
  constructor (canvas, config = {}) {
    if (!canvas) {
      console.warn('AudioFft: Missing parameters!')

      return false
    }

    // Init config
    const defaultConfig = {
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
    }

    Object.assign(this, defaultConfig, config)

    // Init canvas
    this.ctx = canvas.getContext('2d')
    this.canvasWH = [0, 0]

    const { clientWidth, clientHeight } = canvas

    this.canvasWH[0] = clientWidth
    this.canvasWH[1] = clientHeight

    canvas.setAttribute('width', clientWidth)
    canvas.setAttribute('height', clientHeight)

    // Init audio
    this.audios = new Map()
    this.frequency = []
    this.lastFrequency = []
    this.audioAnalyser = null
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()

    // ConfigAble Not
    this.animation = false
    this.transitionColorIndex = 0
    this.transitionColorFrame = 0
  }
}

AudioFFT.prototype.createAudioMediaAnalyser = function (audio) {
  const { audioCtx, analyserFFT } = this

  const audioSource = audioCtx.createMediaElementSource(audio)
  const audioAnalyser = audioCtx.createAnalyser()

  audioSource.connect(audioAnalyser)
  audioAnalyser.connect(audioCtx.destination)

  audioAnalyser.fftSize = analyserFFT

  return audioAnalyser
}

/**
 * @description Set audio instance
 * @param audio Audio instance
 * @return {Undefined} Void
 */
AudioFFT.prototype.setAudio = function (audio) {
  if (!audio) {
    console.warn('AudioFft.setAudio: Missing parameters!')

    return false
  }

  const { audios } = this

  const audioAnalyser = this.audioAnalyser = audios.get(audio) || this.createAudioMediaAnalyser(audio)

  this.frequency = new Uint8Array(audioAnalyser.frequencyBinCount)
}

/**
 * @description Draw frequency
 * @return {Undefined} Void
 */
AudioFFT.prototype.draw = function () {
  const { animation } = this

  if (!animation) this.loop()
}

AudioFFT.prototype.loop = function () {
  const { spring, loop } = this

  if (spring) {
    this.drawSpringFrequency()
  } else {
    this.drawNormalFrequency()
  }

  this.animation = requestAnimationFrame(loop.bind(this))
}

AudioFFT.prototype.getColumnNum = function () {
  const { canvasWH, columnWidth, columnGap } = this

  return Math.ceil(canvasWH[0] / (columnWidth + columnGap))
}

/**
 * @description Clear canvas
 * @return {Undefined} Void
 */
AudioFFT.prototype.clear = function () {
  const { canvasWH, ctx } = this

  ctx.clearRect(0, 0, ...canvasWH)
}

AudioFFT.prototype.getFrequency = function () {
  let { audioAnalyser, frequency, swingScale, symmetry } = this

  let columnNum = this.getColumnNum()
  if (columnNum % 2 !== 0) columnNum++

  audioAnalyser.getByteFrequencyData(frequency)

  frequency = frequency.slice(0, columnNum)

  if (symmetry) {
    frequency = frequency.slice(0, columnNum / 2)
    const reverse = [...frequency].reverse()
    frequency = [...reverse, ...frequency]
  }

  return frequency.map(n => n * parseFloat(swingScale))
}

AudioFFT.prototype.getColor = function () {
  let { ctx, canvasWH, colors, colorTransition, opacity } = this

  if (colors.length === 1) colors = [colors[0], colors[0]]
  const colorNum = colors.length

  colors = colors.map(color => fade(color, opacity * 100))

  const gradient = ctx.createLinearGradient(0, 0, 0, canvasWH[1])

  if (!colorTransition) {
    const colorGap = 1 / (colorNum - 1)

    colors.forEach((color, i) => gradient.addColorStop(0 + colorGap * i, color))

    return gradient
  }

  let { transitionColorFrame, transitionColorIndex, transitionFrame, spring } = this

  const transitionColor = [
    colors[transitionColorIndex % colorNum],
    colors[(transitionColorIndex + 1) % colorNum],
    colors[(transitionColorIndex + 2) % colorNum]
  ].map(color => getRgbaValue(color))

  const startColor = this.getTransitionColor(transitionColor[0], transitionColor[1], transitionColorFrame)
  const endColor = this.getTransitionColor(transitionColor[1], transitionColor[2], transitionColorFrame)

  if (spring) {
    gradient.addColorStop(0, startColor)
    gradient.addColorStop(0.5, endColor)
    gradient.addColorStop(1, startColor)
  } else {
    gradient.addColorStop(0, startColor)
    gradient.addColorStop(1, endColor)
  }

  transitionColorFrame++

  if (transitionFrame <= transitionColorFrame) {
    this.transitionColorFrame = 0
    this.transitionColorIndex++
  } else {
    this.transitionColorFrame = transitionColorFrame
  }

  return gradient
}

AudioFFT.prototype.getTransitionColor = function (start, end, frame) {
  const { transitionFrame } = this

  return getColorFromRgbValue(start.map((v, i) => {
    return (end[i] - v) / transitionFrame * frame + v
  }))
}

AudioFFT.prototype.drawNormalFrequency = function () {
  const { wave } = this

  if (wave) {
    this.drawWaveFrequency()

    return
  }

  this.clear()

  const { columnWidth, columnGap, ctx, lastFrequency, canvasWH, pick } = this
  const frequency = this.getFrequency()
  const color = this.getColor()

  const itemWidth = columnWidth + columnGap

  frequency.forEach((height, i) => {
    ctx.beginPath()

    const last = lastFrequency[i]
    let currentHeight = last

    if (last && last >= height) {
      currentHeight--
    } else if (!last || last < height) {
      currentHeight = height
    }

    ctx.fillRect(itemWidth * i, canvasWH[1] - height, columnWidth, height)
    if (pick) ctx.fillRect(itemWidth * i, canvasWH[1] - currentHeight - 5, columnWidth, 2)

    ctx.fillStyle = color

    lastFrequency[i] = currentHeight

    ctx.closePath()
  })
}

AudioFFT.prototype.drawSpringFrequency = function () {
  const { wave } = this

  if (wave) {
    this.drawWaveFrequency(true)

    return
  }

  this.clear()

  const { columnWidth, columnGap, ctx, lastFrequency, canvasWH } = this
  const frequency = this.getFrequency()
  const color = this.getColor()

  const itemWidth = columnWidth + columnGap

  frequency.forEach((height, i) => {
    ctx.beginPath()

    ctx.fillRect(itemWidth * i, (canvasWH[1] - height) / 2, columnWidth, height)

    ctx.fillStyle = color

    lastFrequency[i] = height

    ctx.closePath()
  })
}

AudioFFT.prototype.drawWaveFrequency = function (spring = false) {
  this.clear()

  const { columnWidth, columnGap, ctx, canvasWH } = this
  const frequency = this.getFrequency()
  const color = this.getColor()

  const itemWidth = columnWidth + columnGap

  let points = []

  if (spring) {
    const [top, bottom] = [[], []]
    frequency.forEach((height, i) => (top[i] = [itemWidth * i, (canvasWH[1] - height) / 2]))
    frequency.forEach((height, i) => (bottom[i] = [itemWidth * i, (canvasWH[1] - height) / 2 + height]))
    bottom.reverse()
    points = [...top, ...bottom]
  } else {
    frequency.forEach((height, i) => (points[i] = [itemWidth * i, canvasWH[1] - height]))
  }

  const bezierCurve = polylineToBezierCurve(points, spring)

  ctx.beginPath()

  ctx.moveTo(0, canvasWH[1])
  ctx.lineTo(...bezierCurve.splice(0, 1)[0])

  bezierCurve.forEach(([c1, c2, end]) => {
    ctx.bezierCurveTo(...c1, ...c2, ...end)
  })

  if (!spring) {
    ctx.lineTo(canvasWH[0], canvasWH[1])
    ctx.lineTo(0, canvasWH[1])
  }

  ctx.fillStyle = color
  ctx.fill()

  ctx.closePath()
}

/**
 * @description Stop drawing
 * @return {Undefined} Void
 */
AudioFFT.prototype.stop = function () {
  const { animation } = this

  if (animation) cancelAnimationFrame(animation)

  this.animation = false
}

/**
 * @description Update config
 * @return {Undefined} Void
 */
AudioFFT.prototype.updateConfig = function (config = {}) {
  Object.assign(this, config)
}
