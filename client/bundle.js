// Disabling full file because linter is not required on client side
/* eslint-disable */
'use strict';

var squareSize = 50;
var defaultData = 'No Data Emitted';
var keys = {};
var connected = false;

var drawRect = function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, squareSize, squareSize);
};

var clearCanvas = function clearCanvas() {
  return ctx.clearRect(0, 0, canvas.width, canvas.height);
};

var socketHandlers = Object.freeze({
  renderUsers: function renderUsers(data) {
    clearCanvas();
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
      var user = data[keys[i]];
      drawRect(user.position.x, user.position.y, user.color);
    }
  }
});

var emitter = function emitter(eventName) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultData;
  return socket.emit('clientMsg', { eventName: eventName, data: data });
};

window.onload = function () {
  window.canvas = document.querySelector('#canvas');
  window.ctx = canvas.getContext('2d');
  window.clearButton = document.querySelector('#clearCanvas');

  window.socket = io.connect();

  socket.on('connect', function () {
    console.log('Connected to server...');
    clearCanvas();
    connected = true;
  });

  socket.on('disconnect', function () {
    return connected = false;
  });

  socket.on('serverMsg', function (data) {
    if (socketHandlers[data.eventName]) return socketHandlers[data.eventName](data.data);else console.warn('Missing event handler for ' + data.eventName);
  });

  canvas.addEventListener('click', function (e) {
    return emitter('drawSquare', {
      x: e.offsetX - squareSize / 2,
      y: e.offsetY - squareSize / 2
    });
  });

  window.addEventListener('keydown', function (e) {
    return keys[e.key] = true;
  });
  window.addEventListener('keyup', function (e) {
    return keys[e.key] = false;
  });
};

setInterval(function () {
  if (connected) {
    if (keys['ArrowUp']) emitter('moveUp');
    if (keys['ArrowDown']) emitter('moveDown');
    if (keys['ArrowLeft']) emitter('moveLeft');
    if (keys['ArrowRight']) emitter('moveRight');
  }
}, 1000 / 60);
