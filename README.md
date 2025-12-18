# Turia's Beer Race

<video controls playsinline muted style="max-width: 100%; height: auto; border-radius: 12px;">
	<source src="live-demovideo.mov" type="video/quicktime" />
</video>

## What This Is
- **Fast party game**: Race to finish your beers first.
- **Real-time multiplayer**: Everyone sees live scores via WebSockets.
- **Simple controls**: Press SPACE to drink; first to zero wins.

## How It Works
- **Join**: Enter a name and join the lobby.
- **Start state**: Each player begins at 100 points (10 beers × 10 points).
- **Drink action**: Press SPACE (or click the Drink button) to decrement your score by 10 points (one beer).
- **Win condition**: When your score hits 0, you win. A winner modal appears for all players.
- **Play again**: Click "Play Again" to reset all players back to 100 and continue.

## On-Screen UI
- **Your Beers**: A large row showing your remaining beers (animated on drink).
- **Players Grid**: All players listed, sorted by lowest score first; your card is highlighted.
- **Winner Modal**: Pops when someone reaches 0; includes a reset button.

## Realtime Events (Socket.IO)
- `join(name)`: Client → Server; add player with starting score.
- `joined({ playerId })`: Server → Client; confirms join and gives your id.
- `game-state({ players, winner, gameActive })`: Server → All; broadcast full state on any change.
- `press-space`: Client → Server; decrement current player's score by 10.
- `player-won({ winner })`: Server → All; announces the winner once they hit 0.
- `reset-game`: Client → Server; resets all players to 100 and resumes play.

## Run Locally
The client is served by the server, so build the client first.

### Prereqs
- Node.js 18+ recommended

### Steps
```bash
# From repo root

# 1) Install and build client
cd client
npm install
npm run build

# 2) Install and start server
cd ../server
npm install
npm run start

# App will be served at
# http://localhost:3001
```

### Dev Tips
- The client hook uses `window.location.origin` for the Socket.IO URL, so the **React app and server must share the same origin**. Serving `client/dist` from the server (as above) ensures this.
- For server-only hot reload, use: `npm run dev` in `server/`.
- After client code changes, rerun `npm run build` in `client/` to update the served assets.

## Project Structure
- `server/`: Express + Socket.IO server; serves `client/dist` and manages game state.
- `client/`: React + Vite app; UI and client-side Socket.IO.
	- `src/components/`: `JoinScreen`, `GameScreen`, `PlayerList`, `WinnerModal`, `BeerRow`.
	- `src/hooks/useSocket.js`: Socket wiring and client actions.

## Rules Recap
- Start at 100 points.
- Each drink reduces 10 points.
- First to 0 wins.
- Reset to play again.

## Add the Demo Video
Place your demo file at the repo root as `live-gamedemo.mp4` (or `live-gamedemo.webm`). The embed at the top will render it automatically.
