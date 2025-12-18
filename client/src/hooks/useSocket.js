import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

// Use current host for socket connection (works with ngrok)
const SERVER_URL = window.location.origin;

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [gameState, setGameState] = useState({
    players: [],
    winner: null,
    gameActive: true
  });
  const [winner, setWinner] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: true
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    newSocket.on('joined', (data) => {
      setPlayerId(data.playerId);
    });

    newSocket.on('game-state', (state) => {
      setGameState(state);
    });

    newSocket.on('player-won', (data) => {
      setWinner(data.winner);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const join = useCallback((name) => {
    if (socketRef.current && name) {
      socketRef.current.emit('join', name);
    }
  }, []);

  const pressSpace = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('press-space');
    }
  }, []);

  const resetGame = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('reset-game');
      setWinner(null);
    }
  }, []);

  const currentPlayer = gameState.players.find(p => p.id === playerId);

  return {
    connected,
    playerId,
    gameState,
    winner,
    currentPlayer,
    join,
    pressSpace,
    resetGame
  };
}
