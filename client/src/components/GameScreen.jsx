import { useEffect, useCallback } from 'react';
import { BeerRow } from './BeerRow';

export function GameScreen({ currentPlayer, onPressSpace, gameActive }) {
  const canPress = gameActive && currentPlayer && currentPlayer.score > 0;

  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space' && canPress) {
      e.preventDefault();
      onPressSpace();
    }
  }, [canPress, onPressSpace]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentPlayer) {
    return <div className="game-screen">Loading...</div>;
  }

  return (
    <div className="game-screen">
      <div className="your-beers">
        <div className="your-beers-label">Your Beers</div>
        <BeerRow score={currentPlayer.score} size="large" />
        <div className="score-text">{currentPlayer.score} points</div>
      </div>

      <div className="instructions">
        {gameActive ? (
          currentPlayer.score > 0 ? (
            <>
              <span className="key">SPACE</span>
              <span>to drink a beer!</span>
            </>
          ) : (
            <span>All done! Waiting for others...</span>
          )
        ) : (
          <span>Game Over!</span>
        )}
      </div>

      <button
        className="space-button"
        onClick={onPressSpace}
        disabled={!canPress}
      >
        🍺 Drink!
      </button>
    </div>
  );
}
