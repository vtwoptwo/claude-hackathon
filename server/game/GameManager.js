const STARTING_SCORE = 100;
const SCORE_DECREMENT = 10;

class GameManager {
  constructor() {
    this.players = new Map();
    this.winner = null;
    this.gameActive = true;
  }

  addPlayer(socketId, name) {
    const player = {
      id: socketId,
      name: name,
      score: STARTING_SCORE,
      connected: true
    };
    this.players.set(socketId, player);
    return player;
  }

  removePlayer(socketId) {
    this.players.delete(socketId);
  }

  getPlayer(socketId) {
    return this.players.get(socketId);
  }

  decrementScore(socketId) {
    if (!this.gameActive || this.winner) {
      return { success: false, reason: 'game_over' };
    }

    const player = this.players.get(socketId);
    if (!player) {
      return { success: false, reason: 'player_not_found' };
    }

    if (player.score <= 0) {
      return { success: false, reason: 'already_zero' };
    }

    player.score = Math.max(0, player.score - SCORE_DECREMENT);

    if (player.score === 0) {
      this.winner = player;
      this.gameActive = false;
      return { success: true, winner: player };
    }

    return { success: true };
  }

  getGameState() {
    const playersArray = Array.from(this.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      score: p.score
    }));

    return {
      players: playersArray,
      winner: this.winner ? {
        id: this.winner.id,
        name: this.winner.name
      } : null,
      gameActive: this.gameActive
    };
  }

  resetGame() {
    this.winner = null;
    this.gameActive = true;

    for (const player of this.players.values()) {
      player.score = STARTING_SCORE;
    }
  }

  getPlayerCount() {
    return this.players.size;
  }
}

export default GameManager;
