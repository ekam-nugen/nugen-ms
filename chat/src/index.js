import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import { PORT as PRT } from './config/index.js';
import app from './app.js';
import { initializeSocket } from './socket/index.js';
// Import your Chatroom model
// import Chatroom from './models/Chatroom.js';

let PORT;
let server;

async function initialize() {
  PORT = normalizePort(PRT);
  app.set('port', PORT);

  server = http.createServer(app);
  server.listen(PORT);

  // Initialize socket.io
  initializeSocket(server);

  server.on('error', onError);
  server.on('listening', onListening);
  return server;
}

initialize().catch((error) => {
  console.error(`Error during initialization: ${error}`);
});

function onListening() {
  let addr = server.address();
  let bind = addr
    ? typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
    : '';
  console.log(`Server Listening on ${bind}`);
}

function normalizePort(val) {
  let port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  let bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}
