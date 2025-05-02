
export interface Player {
  name: string;
  elo: number;
  school: string;
  score?: number;
  opponents?: string[];
  id?: string;
}

export interface Pairing {
  white: Player;
  black: Player;
  result?: "1-0" | "0-1" | "1/2-1/2" | null;
}

export interface Round {
  number: number;
  pairings: Pairing[];
  type: "elo" | "score";
}

export interface Tournament {
  name: string;
  rounds: Round[];
  players: Player[];
  currentRound: number;
}
