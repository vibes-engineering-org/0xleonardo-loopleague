export type NodeColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export interface GameNode {
  id: string;
  x: number;
  y: number;
  color: NodeColor;
  connected: boolean;
  connections: string[];
}

export interface GameState {
  nodes: GameNode[];
  score: number;
  timeLeft: number;
  gameStatus: 'waiting' | 'playing' | 'finished';
  currentPath: string[];
  validLoops: string[][];
  combo: number;
  seed: string;
}

export interface League {
  id: string;
  name: string;
  seed: string;
  createdBy: string;
  players: LeaguePlayer[];
  endTime: number;
  maxPlayers?: number;
}

export interface LeaguePlayer {
  id: string;
  username: string;
  score: number;
  completedAt: number;
}

export interface GameTheme {
  id: string;
  name: string;
  colors: Record<NodeColor, string>;
  background: string;
  accent: string;
  price?: number;
}

export interface PlayerProfile {
  id: string;
  username: string;
  totalScore: number;
  gamesPlayed: number;
  bestScore: number;
  currentTheme: string;
  isPro: boolean;
  ownedThemes: string[];
}