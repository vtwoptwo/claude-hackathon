import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import GameManager from './game/GameManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

// Serve the built React app
app.use(express.static(join(__dirname, '../client/dist')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const gameManager = new GameManager();

function broadcastGameState() {
  io.emit('game-state', gameManager.getGameState());
}

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join', (name) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      socket.emit('error', { message: 'Invalid name' });
      return;
    }

    const player = gameManager.addPlayer(socket.id, name.trim());
    console.log(`Player joined: ${player.name} (${socket.id})`);

    socket.emit('joined', { playerId: socket.id });
    broadcastGameState();
  });

  socket.on('press-space', () => {
    const result = gameManager.decrementScore(socket.id);

    if (result.success) {
      broadcastGameState();

      if (result.winner) {
        console.log(`Winner: ${result.winner.name}`);
        io.emit('player-won', {
          winner: {
            id: result.winner.id,
            name: result.winner.name
          }
        });
      }
    }
  });

  socket.on('reset-game', () => {
    console.log('Game reset requested');
    gameManager.resetGame();
    broadcastGameState();
  });

  socket.on('disconnect', () => {
    const player = gameManager.getPlayer(socket.id);
    if (player) {
      console.log(`Player disconnected: ${player.name} (${socket.id})`);
      gameManager.removePlayer(socket.id);
      broadcastGameState();
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', players: gameManager.getPlayerCount() });
});

// Serve React app for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
