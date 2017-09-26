const socketio = require('socket.io');

const defaultData = 'No Data Emitted';
const canvasSize = 300;
const movementInterval = 1;

let io;
const users = {};

const emitToAll = (eventName, data = defaultData) => io.sockets.emit('serverMsg', { eventName, data });

const randomInt0To255 = () => Math.floor(Math.random() * 255);

const randomColor = () => {
  const r = randomInt0To255();
  const g = randomInt0To255();
  const b = randomInt0To255();
  return (`rgb(${r},${g},${b})`);
};

const addUser = (socket) => {
  users[socket.id] = {
    position: { x: canvasSize / 2, y: canvasSize / 2 },
    color: randomColor(),
    socketid: socket.id,
  };
  emitToAll('renderUsers', users);
};

const removeUser = (socketid) => {
  delete users[socketid];
  emitToAll('renderUsers', users);
};

const socketHandlers = Object.freeze({
  moveUp: (socket) => {
    users[socket.id].position.y -= movementInterval;
    emitToAll('renderUsers', users);
  },
  moveDown: (socket) => {
    users[socket.id].position.y += movementInterval;
    emitToAll('renderUsers', users);
  },
  moveLeft: (socket) => {
    users[socket.id].position.x -= movementInterval;
    emitToAll('renderUsers', users);
  },
  moveRight: (socket) => {
    users[socket.id].position.x += movementInterval;
    emitToAll('renderUsers', users);
  },
});

const onDisconnect = (sock) => {
  const socket = sock;

  console.log(`Socket ${socket.id} has disconnected...`);
  removeUser(socket.id);
};

const onConnect = (sock) => {
  const socket = sock;

  console.log(`Socket ${socket.id} has connected...`);
  addUser(socket);
};

module.exports = Object.freeze({
  init: (server) => {
    io = socketio(server);
    io.sockets.on('connection', (socket) => {
      // Handle connection
      onConnect(socket);
      // Handle disconnection
      socket.on('disconnect', () => onDisconnect(socket));
      // Handle all other messages
      socket.on('clientMsg', (data) => {
        if (socketHandlers[data.eventName]) {
          return socketHandlers[data.eventName](socket, data.data);
        }
        return console.warn(`Missing event handler for ${data.eventName}!`);
      });
    });
  },
});
