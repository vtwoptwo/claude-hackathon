import { useState } from 'react';

export function JoinScreen({ onJoin, connected }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onJoin(username.trim());
    }
  };

  return (
    <div className="join-screen">
      <h1>🍺 Turia's Beer Race 🍺</h1>
      <p className="subtitle">First to finish 10 beers wins!</p>

      <form onSubmit={handleSubmit} className="join-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          maxLength={20}
          autoFocus
        />
        <button type="submit" disabled={!connected || !username.trim()}>
          {connected ? '🍺 Join Game' : 'Connecting...'}
        </button>
      </form>

      <div className={`connection-status ${connected ? 'connected' : ''}`}>
        {connected ? 'Connected to server' : 'Connecting to server...'}
      </div>
    </div>
  );
}
