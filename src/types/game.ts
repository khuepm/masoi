export type Role = 'Villager' | 'Werewolf' | 'Seer' | 'Doctor';
export type Team = 'Villagers' | 'Werewolves';
export type GamePhase =
  | 'setup'
  | 'roleReveal'
  | 'night'
  | 'nightResolution'
  | 'day'
  | 'voting'
  | 'dayResolution'
  | 'summary'
  | 'ended';

export interface Player {
  id: number;
  name: string;
  role: Role;
  isAlive: boolean;
  isHuman: boolean;
  observations: string[];
  bidRationale: string;
  avatar: string;
}

export interface DebateEntry {
  playerId: number;
  playerName: string;
  message: string;
  reasoning?: string;
}

export interface BidEntry {
  playerId: number;
  playerName: string;
  bid: number;
  reasoning: string;
}

export interface VoteEntry {
  voterId: number;
  voterName: string;
  targetId: number;
  targetName: string;
  reasoning: string;
}

export interface Round {
  roundNumber: number;
  eliminatedId: number | null;
  protectedId: number | null;
  investigatedId: number | null;
  investigationResult: Role | null;
  killedId: number | null;
  exiledId: number | null;
  debate: DebateEntry[];
  bids: BidEntry[][];
  votes: VoteEntry[];
  summaries: { playerId: number; playerName: string; summary: string }[];
  announcement: string;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  rounds: Round[];
  currentRound: number;
  winner: Team | null;
  humanPlayerId: number;
  pendingAction: PendingAction | null;
  gameLog: string[];
  currentDebateTurn: number;
}

export interface PendingAction {
  type: 'eliminate' | 'protect' | 'investigate' | 'vote' | 'debate' | 'bid';
  playerId: number;
  options: number[];
}

export interface SetupConfig {
  numPlayers: number;
  humanName: string;
  humanRole: Role | 'random';
}
