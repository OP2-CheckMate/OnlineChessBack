export interface Player {
  id: number;
  name: string;
}

export interface Lobby {
  lobbyId: number;
  player1: Player;
  player2?: Player;
  recentMove?: Move;
  isGameOver: boolean;
}

export interface Move {
  from: string,
  to: string,
}

export interface OneMove {
  recentMove: Move;
  gameOver: boolean;
}