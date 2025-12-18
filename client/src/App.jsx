import { useState } from 'react';
import { useSocket } from './hooks/useSocket';
import { JoinScreen } from './components/JoinScreen';
import { GameScreen } from './components/GameScreen';
import { PlayerList } from './components/PlayerList';
import { WinnerModal } from './components/WinnerModal';
import './App.css';

function App() {
  const {
    connected,
    playerId,
    gameState,
    winner,
    currentPlayer,
    join,
    pressSpace,
    resetGame
  } = useSocket();

  const [hasJoined, setHasJoined] = useState(false);

  const handleJoin = (username) => {
    join(username);
    setHasJoined(true);
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  if (!hasJoined) {
    return <JoinScreen onJoin={handleJoin} connected={connected} />;
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>🍺 Turia's Beer Race</h1>
        <span className="player-count">{gameState.players.length} player(s)</span>
      </header>

      <main className="game-main">
        <GameScreen
          currentPlayer={currentPlayer}
          onPressSpace={pressSpace}
          gameActive={gameState.gameActive}
        />
        <PlayerList
          players={gameState.players}
          currentPlayerId={playerId}
        />
      </main>

      <WinnerModal
        winner={winner}
        isCurrentPlayer={winner?.id === playerId}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}

export default App;
