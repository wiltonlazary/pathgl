! function() {
pathgl.shaderParameters = {
  rgb: [0, 0, 0, 0]
, translate: [0, 0]
, time: [0]
, rotation: [0, 1]
, opacity: [1]
, resolution: [0, 0]
, scale: [1, 1]
, mouse: pathgl.mouse = [0, 0]
}

pathgl.fragment = [ "precision mediump float;"
                  , "uniform vec4 rgb;"
                  , "uniform float time;"
                  , "uniform float opacity;"
                  , "uniform vec2 resolution;"

                  , "void main(void) {"
                  , "  gl_FragColor = vec4(rgb.xyz, opacity);"
                  , "}"
                  ].join('\n')

pathgl.vertex = [ "precision mediump float;"
                , "attribute vec3 aVertexPosition;"
                , "uniform vec2 translate;"
                , "uniform vec2 resolution;"
                , "uniform vec2 rotation;"
                , "uniform vec2 scale;"

                , "void main(void) {"

                , "vec3 pos = aVertexPosition;"
                , "pos.y = resolution.y - pos.y;"

                , "vec3 scaled_position = pos * vec3(scale, 1.0);"

                , "vec2 rotated_position = vec2(scaled_position.x * rotation.y + scaled_position.y * rotation.x, "
                + "scaled_position.y * rotation.y - scaled_position.x * rotation.x);"

                , "vec2 position = vec2(rotated_position.x + translate.x, rotated_position.y - translate.y);"

                , "vec2 zeroToOne = position / resolution;"
                , "vec2 zeroToTwo = zeroToOne * 2.0;"
                , "vec2 clipSpace = zeroToTwo - 1.0;"

                , "gl_Position = vec4(clipSpace, 1, 1);"

                , "}"
                ].join('\n')
;this.pathgl = pathgl

pathgl.stop = d3.functor()

function pathgl(canvas) {
  var gl, program, programs

  canvas = 'string' == typeof canvas ? document.querySelector(canvas) :
    canvas instanceof d3.selection ? canvas.node() :
    canvas

  if (! canvas.getContext) return console.log(canvas, 'is not a valid canvas')
;var circleVertex = [
  'precision mediump float;'
, 'attribute vec3 aVertexPosition;'
, "uniform vec2 resolution;"
, 'void main() {'
, "    vec2 normalize = aVertexPosition.xy / resolution;"
, "    vec2 clipSpace = (normalize * 2.0) - 1.0;"
, "    gl_Position = vec4(clipSpace, 1, 1);"
, '    gl_PointSize = 20.0;'
, '}'
].join('\n')


var ccccfff = [
  'precision mediump float;'
, 'void main() {'
, 'if (distance(gl_PointCoord, vec2(0.5)) > 0.5) discard;'
, 'gl_FragColor = vec4(noise1(),0,0,1);'
, '}'
].join('\n')

var circleFragment = [
  'precision mediump float;'
,'float adnan(vec2 co){'
, '    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);'
, '}'
, 'void main() {'
, 'float dist = distance(gl_PointCoord, vec2(0.5));'
, 'if (dist > 0.5) discard;'
//, '    if (distance(gl_PointCoord, vec2(0.5)) > 0.4) gl_FragColor = vec4(.5, 1, 0, 1);'
//, '		 else gl_FragColor = vec4(1, .5 ,1, 1);'
, 'float alpha = 1.0 - smoothstep(0.45, 0.5, dist);'
, 'gl_FragColor = vec4(dist, .8 - dist, .8, 1.1-dist);'
, '}'
].join('\n')

var stopRendering = false

pathgl.stop = function () { stopRendering = true }

function init(c) {
  canvas = c
  programs = canvas.programs = (canvas.programs || {})
  pathgl.shaderParameters.resolution = [canvas.width, canvas.height]
  gl = initContext(canvas)
  initShader(pathgl.fragment, '_identity')
  override(canvas)
  d3.select(canvas).on('mousemove.pathgl', mousemoved)
  d3.timer(runLoop)
  extend(programs.circle = createProgram(circleVertex, circleFragment), {name : 'circle'})
  return gl ? canvas : null
}

function mousemoved() {
  var m = d3.mouse(this)
  pathgl.mouse = [m[0] / innerWidth, m[1] / innerHeight]
}

function override(canvas) {
  var scene = []
  return extend(canvas, {
    appendChild: appendChild
  , querySelectorAll: querySelectorAll
  , querySelector: querySelector
  , removeChild: removeChild
  , insertBefore: insertBefore

  , gl: gl
  , __scene__: scene
  , __pos__: []
  , __id__: 0
  , __program__: void 0
  })
}

function compileShader (type, src) {
  var shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw src + ' ' + gl.getShaderInfoLog(shader)
  return shader
}

function initShader(_, name) {
  return program = (programs[name] ?
                    programs[name] :
                    programs[name] = createProgram(pathgl.vertex, _))
}

function createProgram(vs, fs) {
  program = gl.createProgram()

  gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vs))
  gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fs))

  gl.linkProgram(program)
  gl.useProgram(program)

  if (! gl.getProgramParameter(program, gl.LINK_STATUS)) throw name + ': ' + gl.getProgramInfoLog(program)

  each(pathgl.shaderParameters, bindUniform)
  program.vertexPosition = gl.getAttribLocation(program, "aVertexPosition")
  gl.enableVertexAttribArray(program.vertexPosition)

  program.name = name
  return program
}

function bindUniform(val, key) {
  var loc = program[key] || (program[key] = gl.getUniformLocation(program, key))
  gl['uniform' + val.length + 'fv'](loc, val)
}

function initContext(canvas) {
  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  return gl && extend(gl, { viewportWidth: canvas.width, viewportHeight: canvas.height })
}
;  var methods = { m: moveTo
                , z: closePath
                , l: lineTo

                , h: horizontalLine
                , v: verticalLine
                , c: curveTo
                , s: shortCurveTo
                , q: quadraticBezier
                , t: smoothQuadraticBezier
                , a: elipticalArc
                }

function horizontalLine() {}
function verticalLine() {}
function curveTo() {}
function shortCurveTo() {}
function quadraticBezier() {}
function smoothQuadraticBezier () {}
function elipticalArc(){}

function group(coords) {
  var s = []
  twoEach(coords, function (a, b) { s.push([a, b, 0]) })
  return s
}

function parse (str) {
  var path = addToBuffer(this)

  if (path.length) return render()

  str.match(/[a-z][^a-z]*/ig).forEach(function (segment, i, match) {
    var instruction = methods[segment[0].toLowerCase()]
      , coords = segment.slice(1).trim().split(/,| /g)

    ;[].push.apply(path.coords, group(coords))
    if (! instruction) return
    if (instruction.name == 'closePath' && match[i+1]) return instruction.call(path, match[i+1])

    if ('function' == typeof instruction)
      coords.length == 1 ? instruction.call(path) : twoEach(coords, instruction, path)
    else
      console.error(instruction + ' ' + segment[0] + ' is not yet implemented')
  })
  var buff = toBuffer(this.path.coords)
  this.path.length = 0
  this.path.push(buff)
}

function moveTo(x, y) {
  pos = [x, y]
}

var subpathStart
function closePath(next) {
  subpathStart = pos
  lineTo.apply(this, /m/i.test(next) ? next.slice(1).trim().split(/,| /g) : this.coords[0])
}

function lineTo(x, y) {
  this.push(x, y, 0)
}
;var proto = {
  circle: { r: noop, cx: noop, cy: noop, render: renderCircles } //point
, ellipse: {cx: buildEllipse, cy: buildEllipse, rx: buildEllipse, ry: buildEllipse } //point
, line: { x1: buildLine, y1: buildLine, x2: buildLine, y2: buildLine } //line
, path: { d: buildPath, pathLength: buildPath } //lines
, polygon: { points: points } //lines
, polyline: { points: points } //lines
, rect: { width: buildRect, height: buildRect, x: noop, y: noop, rx: roundedCorner } //point
, image: { 'xlink:href': noop, height: rectPoints, width: rectPoints, x: noop, y: noop } //point
, text: { x: noop, y: noop, dx: noop, dy: noop } //...
, g: { appendChild: noop } //fake
}
var allCircles = new Float32Array(1e6);

//cx
//cy
//r
//fill rgba
//stroke rgba
//width
//height
//stroke-width

function renderCircles() {}

var baseProto = {
  querySelectorAll: noop
, querySelector: noop
, createElementNS: noop
, insertBefore: noop
, ownerDocument: { createElementNS: noop }
, render: function render(node) {
  this.buffer && drawFill(this)
  drawStroke(this)
}
, nextSibling: function () { canvas.scene[canvas.__scene__.indexOf()  + 1] }

, fill: function (val) {
    isId(val) && initShader(d3.select(val).text(), val)
  }

, transform: function (d) {
    var parse = d3.transform(d)
      , radians = parse.rotate * Math.PI / 180

    if (parse.rotate) delete parse.translate//fixme

    extend(this.attr, parse, { rotation: [ Math.sin(radians), Math.cos(radians) ] })
  }

, stroke: function (val) {
    isId(val) && initShader(d3.select(val).text(), val)
  }

  , getAttribute: function (name) {
      return this.attr[name]
    }

  , setAttribute: function (name, value) {
      this.attr[name] = value
      this[name] && this[name](value)
    }

  , removeAttribute: function (name) {
      delete this.attr[name]
    }

  , textContent: noop
  , removeEventListener: noop
  , addEventListener: event
  }

var roundedCorner = noop

var types = [
  function circle () {}
, function rect() {}
, function path() {}
, function ellipse() {}
, function line() {}
, function path() {}
, function polygon() {}
, function polyline() {}
, function rect() {}

, function image() {}
, function text() {}
, function g() {}
, function use() {}
].reduce(function (a, type) {
              a[type.name] = type
              type.prototype = extend(Object.create(baseProto), proto[type.name])
              return a
            }, {})

function buildCircle () {
  var a = [], r = this.attr.r
  for (var i = 0; i < 361; i+=18)
    a.push(50 + r * Math.cos(i * Math.PI / 180),
           50 + r * Math.sin(i * Math.PI / 180),
           0)
  this.path = [this.buffer = toBuffer(a)]
}

function buildRect() {
  if (! this.attr.width && this.attr.height) return
  addToBuffer(this)
  this.path.coords = rectPoints(this.attr.width, this.attr.height)
  extend(this.path, [buildBuffer(this.path.coords)])
  this.buffer = buildBuffer(this.path.coords)
}

function buildLine () {}
function buildPath () {
  parse.call(this, this.attr.d)
  this.buffer = toBuffer(this.path.coords)
}
function points () {}
function buildEllipse() {
  return;
  var a = []
  for (var i = 0; i < 361; i+=18)
    a.push(50 + r * Math.cos(i * Math.PI / 180),
           50 + r * Math.sin(i * Math.PI / 180),
           0)
  return a
}

function rectPoints(w, h) {
  return [0,0,0,
          0,h,0,
          w,h,0,
          w,0,0,
         ]
}

function insertBefore(node, next) {
  var scene = canvas.__scene__
    , i = scene.indexOf(next)
  reverseEach(scene.slice(i, scene.push('shit')),
              function (d, i) { scene[i] = scene[i - 1] })
}

function appendChild(el) {
  var self = new types[el.tagName.toLowerCase()]
  canvas.__scene__.push(self)

  self.attr = Object.create(attrDefaults)
  self.tagName = el.tagName
  self.parentNode = self.parentElement = this
  return self
}

function querySelector(query) {
  return this.querySelectorAll(query)[0]
}

function querySelectorAll(query) {
  return this.__scene__.filter(function (node) { return node.tagName.toLowerCase() === query })
}

function removeChild(el) {
  var i = this.__scene__.indexOf(el)
  this.__scene__.splice(i, 1)
}

var attrDefaults = {
  rotation: [0, 1]
, translate: [0, 0]
, scale: [1, 1]
, fill: 0
, stroke: 0
, 'stroke-width': 2
, cx: 0
, cy: 0
, x: 0
, y: 0
, opacity: 1
}

var e = {}
//keep track of what element is being hovered over
function event (type, listener) {
  if (! e[type]) {
    d3.select('canvas').on(type, function () {
      this.__scene__.filter(function () {
        //check what shape cursor is on top of
        //if the id is in e[type], dispatch listener
      })
    })
    e[type] = []
  }
  e[type].push(this.id)
};//render points
//render lines
//render linefills

function runLoop(elapsed) {
  each(programs, function (program, key) {
    gl.useProgram(program)
    program.time && gl.uniform1f(program.time, pathgl.time = elapsed / 1000)
    program.mouse && gl.uniform2fv(program.mouse, pathgl.mouse)
  })
    canvas.__scene__.forEach(function (node) { node.render() })
  drawCircles()
  return stopRendering && ! gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
}

var cacheCircles
function drawCircles() {
  var allCircles = canvas.__scene__
                   .filter(function (d) { return d instanceof types['circle'] })
                   .map(function (d) { return [d.attr.cx, d.attr.cy, d.attr.r] })
  var prog = programs.circle
  gl.useProgram(prog)
  allCircles = allCircles.reduce(function (buffer, circle, i) {
                 buffer[i * 2] = circle[0]
                 buffer[2 * i + 1] = circle[1]
                 //buffer[i * 3] = circle[2]
                 return buffer
               }, cacheCircles || (cacheCircles = new Float32Array(allCircles.length * 2)))
  window.ac = allCircles
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, allCircles, gl.DYNAMIC_DRAW)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(0);
  gl.drawArrays(gl.POINTS, 0, allCircles.length / 2)
}

function addToBuffer(datum) {
  return extend(datum.path = [], { coords: [], id: datum.id })
}

function applyTransforms(node) {
  gl.uniform2f(program.translate, node.attr.translate[0] + node.attr.cx + node.attr.x,
               node.attr.translate[1] + node.attr.cy + node.attr.y)
  gl.uniform2f(program.scale, node.attr.scale[0], node.attr.scale[1])
  gl.uniform2f(program.rotation, node.attr.rotation[0], node.attr.rotation[1])
  gl.uniform1f(program.opacity, node.attr.opacity)
}

function drawBuffer(buffer, type) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.vertexAttribPointer(program.vertexPosition, buffer.itemSize, gl.FLOAT, false, 0, 0)
  gl.drawArrays(type, 0, buffer.numItems)
}

function swapProgram(name) {
  gl.useProgram(program = programs[name])
  program.vertexPosition = gl.getAttribLocation(program, "aVertexPosition")
  gl.enableVertexAttribArray(program.vertexPosition)
}

function drawFill(node) {
  swapProgram(isId(node.attr.fill) ? node.attr.fill : '_identity')
  applyTransforms(node)
  setDrawColor(d3.rgb(node.attr.fill))
  drawBuffer(node.buffer, gl.TRIANGLE_FAN)
}

function drawStroke(node) {
  gl.lineWidth(node.attr['stroke-width'])
  swapProgram(isId(node.attr.stroke) ? node.attr.stroke : '_identity')
  applyTransforms(node)
  setDrawColor(d3.rgb(node.attr.stroke))
  if (node.path)
    for (var i = 0; i < node.path.length; i++)
      drawBuffer(node.path[i], gl.LINE_LOOP)
  //else console.log(node.id)
  //this should be impossible
}

function setDrawColor (c) {
  gl.uniform4f(program.rgb,
               c.r / 256,
               c.g / 256,
               c.b / 256,
               1.0)
}

//subData
function buildBuffer(points) {
  var buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW)
  buffer.itemSize = 3
  buffer.numItems = points.length / buffer.itemSize
  return buffer
}

function toBuffer (array) {
  return buildBuffer(flatten(array))
}
;pathgl.shaderParameters = {
  rgb: [0, 0, 0, 0]
, translate: [0, 0]
, time: [0]
, rotation: [0, 1]
, opacity: [1]
, resolution: [0, 0]
, scale: [1, 1]
, mouse: pathgl.mouse = [0, 0]
}

pathgl.fragment = [ "precision mediump float;"
                  , "uniform vec4 rgb;"
                  , "uniform float time;"
                  , "uniform float opacity;"
                  , "uniform vec2 resolution;"

                  , "void main(void) {"
                  , "  gl_FragColor = vec4(rgb.xyz, opacity);"
                  , "}"
                  ].join('\n')

pathgl.vertex = [ "precision mediump float;"
                , "attribute vec3 aVertexPosition;"
                , "uniform vec2 translate;"
                , "uniform vec2 resolution;"
                , "uniform vec2 rotation;"
                , "uniform vec2 scale;"

                , "void main(void) {"

                , "vec3 pos = aVertexPosition;"
                , "pos.y = resolution.y - pos.y;"

                , "vec3 scaled_position = pos * vec3(scale, 1.0);"

                , "vec2 rotated_position = vec2(scaled_position.x * rotation.y + scaled_position.y * rotation.x, "
                + "scaled_position.y * rotation.y - scaled_position.x * rotation.x);"

                , "vec2 position = vec2(rotated_position.x + translate.x, rotated_position.y - translate.y);"

                , "vec2 zeroToOne = position / resolution;"
                , "vec2 zeroToTwo = zeroToOne * 2.0;"
                , "vec2 clipSpace = zeroToTwo - 1.0;"

                , "gl_Position = vec4(clipSpace, 1, 1);"

                , "}"
                ].join('\n')
;function noop () {}

function extend (a, b) {
  if (arguments.length > 2) [].forEach.call(arguments, function (b) { extend(a, b) })
  else for (var k in b) a[k] = b[k]
  return a
}

function twoEach(list, fn, gl) {
  var l = list.length - 1, i = 0
  while(i < l) fn.call(gl, list[i++], list[i++])
}

function flatten(input) {
  return input.reduce(function (a, b) { return (b && b.map ? [].push.apply(a, b) : a.push(b)) && a },
                      [])
}

function isId(str) {
  return str[0] == '#' && isNaN(parseInt(str.slice(1), 16))
}

function each(obj, fn) {
  for (var key in obj) fn(obj[key], key, obj)
}

function hash(str) {
  return str.split("").reduce(function(a,b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
};  return init(canvas)
} }()