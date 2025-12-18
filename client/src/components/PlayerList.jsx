import { BeerRow } from './BeerRow';

export function PlayerList({ players, currentPlayerId }) {
  const sortedPlayers = [...players].sort((a, b) => a.score - b.score);

  return (
    <div className="player-list">
      <h2>Players</h2>
      {players.length === 0 ? (
        <p className="no-players">Waiting for players...</p>
      ) : (
        <div className="players-grid">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`player-card ${player.id === currentPlayerId ? 'current' : ''} ${player.score === 0 ? 'finished' : ''}`}
            >
              <div className="player-header">
                <span className="player-rank">#{index + 1}</span>
                <span className="player-name">
                  {player.name}
                  {player.id === currentPlayerId && <span className="you-badge">YOU</span>}
                </span>
              </div>
              <BeerRow score={player.score} size="small" />
              {player.score === 0 && (
                <div className="finished-badge">DONE!</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
