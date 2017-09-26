// Disabling full file because linter is not required on client side
/* eslint-disable */
'use strict';

const squareSize = 50;
const defaultData = 'No Data Emitted';
const keys = {};
let connected = false;

const drawRect = (x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, squareSize, squareSize);
};

const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

const socketHandlers = Object.freeze({
  renderUsers: (data) => {
    clearCanvas();
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++){
      const user = data[keys[i]];
      drawRect(user.position.x, user.position.y, user.color);
    }
  },
});


const emitter = (eventName, data = defaultData) => socket.emit('clientMsg', { eventName, data });

window.onload = () => {
  window.canvas = document.querySelector('#canvas');
  window.ctx = canvas.getContext('2d');

  window.socket = io.connect();

  socket.on('connect', () => {
    console.log('Connected to server...');
    clearCanvas();
    connected = true;
  });
  
  socket.on('disconnect', () => connected = false);

  socket.on('serverMsg', (data) => {
    if (socketHandlers[data.eventName]) return socketHandlers[data.eventName](data.data);
    else console.warn(`Missing event handler for ${data.eventName}`);
  });

  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);
};

setInterval(() => {
  if (connected) {
    if (keys['ArrowUp']) emitter('moveUp');
    if (keys['ArrowDown']) emitter('moveDown');
    if (keys['ArrowLeft']) emitter('moveLeft');
    if (keys['ArrowRight']) emitter('moveRight');
  }
}, 1000 / 60);
