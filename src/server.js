const express = require('express');
const http = require('http');
const path = require('path');
const socket = require('./socket');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();
const server = http.createServer(app).listen(PORT, () => { console.dir(`Server listening at 127.0.0.1:${PORT}`); });

app.use('/', express.static(path.join(__dirname, './../client')));

// Initialize socket middleware using the main server
socket.init(server);
