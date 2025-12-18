export function WinnerModal({ winner, isCurrentPlayer, onPlayAgain }) {
  if (!winner) return null;

  return (
    <div className="winner-modal-overlay">
      <div className="winner-modal">
        <h2>{isCurrentPlayer ? '🏆 You Win! 🏆' : '🍺 Game Over!'}</h2>
        <div className="winner-name">
          {isCurrentPlayer ? (
            <span>You finished all your beers first!</span>
          ) : (
            <span><strong>{winner.name}</strong> finished first!</span>
          )}
        </div>
        <button onClick={onPlayAgain} className="play-again-btn">
          🍺 Play Again
        </button>
      </div>
    </div>
  );
}
