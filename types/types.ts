export interface Player{
    id: number;
    name: string;
}

export interface Lobby {
    lobbyId: number;
    player1: Player;
    player2?: Player;
}