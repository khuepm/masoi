import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { GameState, GamePhase, Player, Round, SetupConfig } from '../types/game';
import { assignRoles, checkWinner, getAlivePlayers, getMostVoted, shuffle } from '../utils/gameLogic';
import { PLAYER_NAMES, AVATARS, MAX_DEBATE_TURNS } from '../utils/constants';
import {
  aiEliminate, aiProtect, aiInvestigate,
  aiBid, aiDebate, aiVote, aiSummarize,
} from '../utils/aiLogic';

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: GameState = {
  phase: 'setup',
  players: [],
  rounds: [],
  currentRound: 0,
  winner: null,
  humanPlayerId: 0,
  pendingAction: null,
  gameLog: [],
  currentDebateTurn: 0,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'START_GAME'; config: SetupConfig }
  | { type: 'CONFIRM_ROLE' }
  | { type: 'NIGHT_ACTION'; targetId: number }
  | { type: 'ADVANCE_NIGHT' }
  | { type: 'START_DAY' }
  | { type: 'HUMAN_VOTE'; targetId: number }
  | { type: 'HUMAN_DEBATE'; message: string }
  | { type: 'ADVANCE_DEBATE' }
  | { type: 'START_VOTING' }
  | { type: 'END_ROUND' }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET' };

function createRound(roundNumber: number): Round {
  return {
    roundNumber,
    eliminatedId: null,
    protectedId: null,
    investigatedId: null,
    investigationResult: null,
    killedId: null,
    exiledId: null,
    debate: [],
    bids: [],
    votes: [],
    summaries: [],
    announcement: '',
  };
}

function log(state: GameState, msg: string): GameState {
  return { ...state, gameLog: [...state.gameLog, msg] };
}

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {

    case 'START_GAME': {
      const { config } = action;
      const names = [config.humanName, ...shuffle(PLAYER_NAMES.filter(n => n !== config.humanName)).slice(0, config.numPlayers - 1)];
      const players: Player[] = names.map((name, i) => ({
        id: i,
        name,
        role: 'Villager',
        isAlive: true,
        isHuman: i === 0,
        observations: [],
        bidRationale: '',
        avatar: AVATARS[i % AVATARS.length],
      }));
      const assigned = assignRoles(players, 0, config.humanRole);
      return {
        ...initialState,
        phase: 'roleReveal',
        players: assigned,
        humanPlayerId: 0,
        rounds: [createRound(0)],
        gameLog: ['Game started! Players have been assigned their roles.'],
      };
    }

    case 'CONFIRM_ROLE': {
      // Run night phase for AI players automatically, set up pending action for human
      return runNightPhase(state);
    }

    case 'NIGHT_ACTION': {
      return handleNightAction(state, action.targetId);
    }

    case 'ADVANCE_NIGHT': {
      return resolveNight(state);
    }

    case 'START_DAY': {
      return startDayPhase(state);
    }

    case 'ADVANCE_DEBATE': {
      return advanceDebate(state);
    }

    case 'HUMAN_DEBATE': {
      return handleHumanDebate(state, action.message);
    }

    case 'START_VOTING': {
      return startVoting(state);
    }

    case 'HUMAN_VOTE': {
      return handleHumanVote(state, action.targetId);
    }

    case 'END_ROUND': {
      return endRound(state);
    }

    case 'NEXT_ROUND': {
      return nextRound(state);
    }

    case 'RESET': {
      return initialState;
    }

    default:
      return state;
  }
}

// ─── Night Phase Logic ────────────────────────────────────────────────────────

function runNightPhase(state: GameState): GameState {
  let s = { ...state, phase: 'night' as GamePhase };
  const round = { ...s.rounds[s.currentRound] };
  const alive = getAlivePlayers(s.players);

  // AI Werewolves eliminate
  const wolves = alive.filter(p => p.role === 'Werewolf');
  const humanPlayer = s.players.find(p => p.id === s.humanPlayerId)!;

  // If human is werewolf, ask them to pick
  if (humanPlayer.role === 'Werewolf' && humanPlayer.isAlive) {
    const options = alive.filter(p => p.id !== humanPlayer.id && p.role !== 'Werewolf').map(p => p.id);
    const rounds = [...s.rounds];
    rounds[s.currentRound] = round;
    return {
      ...s,
      rounds,
      pendingAction: { type: 'eliminate', playerId: humanPlayer.id, options },
    };
  }

  // AI wolf picks
  const aiWolf = wolves.find(p => !p.isHuman);
  if (aiWolf) {
    round.eliminatedId = aiEliminate(aiWolf, alive);
  }

  // AI Doctor protects
  const doctor = alive.find(p => p.role === 'Doctor');
  if (doctor && !doctor.isHuman) {
    round.protectedId = aiProtect(doctor, alive, s.rounds.slice(0, s.currentRound));
  } else if (doctor && doctor.isHuman) {
    const options = alive.map(p => p.id);
    const rounds = [...s.rounds];
    rounds[s.currentRound] = round;
    return {
      ...s,
      rounds,
      pendingAction: { type: 'protect', playerId: doctor.id, options },
    };
  }

  // AI Seer investigates
  const seer = alive.find(p => p.role === 'Seer');
  if (seer && !seer.isHuman) {
    const investigated = s.rounds.slice(0, s.currentRound).map(r => r.investigatedId).filter(Boolean) as number[];
    const targetId = aiInvestigate(seer, alive, investigated);
    round.investigatedId = targetId;
    const targetPlayer = s.players.find(p => p.id === targetId);
    if (targetPlayer) {
      round.investigationResult = targetPlayer.role;
    }
  } else if (seer && seer.isHuman) {
    const options = alive.filter(p => p.id !== seer.id).map(p => p.id);
    const rounds = [...s.rounds];
    rounds[s.currentRound] = round;
    return {
      ...s,
      rounds,
      pendingAction: { type: 'investigate', playerId: seer.id, options },
    };
  }

  const rounds = [...s.rounds];
  rounds[s.currentRound] = round;
  return resolveNight({ ...s, rounds });
}

function handleNightAction(state: GameState, targetId: number): GameState {
  const { pendingAction } = state;
  if (!pendingAction) return state;

  const round = { ...state.rounds[state.currentRound] };
  let newState = state;

  if (pendingAction.type === 'eliminate') {
    round.eliminatedId = targetId;
    // Now run doctor/seer AI
    const alive = getAlivePlayers(state.players);
    const doctor = alive.find(p => p.role === 'Doctor');
    if (doctor && !doctor.isHuman) {
      round.protectedId = aiProtect(doctor, alive, state.rounds.slice(0, state.currentRound));
    }
    const seer = alive.find(p => p.role === 'Seer');
    if (seer && !seer.isHuman) {
      const investigated = state.rounds.slice(0, state.currentRound).map(r => r.investigatedId).filter(Boolean) as number[];
      const seerTargetId = aiInvestigate(seer, alive, investigated);
      round.investigatedId = seerTargetId;
      const seerTarget = state.players.find(p => p.id === seerTargetId);
      if (seerTarget) round.investigationResult = seerTarget.role;
    }
    const rounds = [...state.rounds];
    rounds[state.currentRound] = round;
    newState = { ...state, rounds, pendingAction: null };
    return resolveNight(newState);
  }

  if (pendingAction.type === 'protect') {
    round.protectedId = targetId;
    const alive = getAlivePlayers(state.players);
    const seer = alive.find(p => p.role === 'Seer');
    if (seer && !seer.isHuman) {
      const investigated = state.rounds.slice(0, state.currentRound).map(r => r.investigatedId).filter(Boolean) as number[];
      const seerTargetId = aiInvestigate(seer, alive, investigated);
      round.investigatedId = seerTargetId;
      const seerTarget = state.players.find(p => p.id === seerTargetId);
      if (seerTarget) round.investigationResult = seerTarget.role;
    }
    const rounds = [...state.rounds];
    rounds[state.currentRound] = round;
    newState = { ...state, rounds, pendingAction: null };
    return resolveNight(newState);
  }

  if (pendingAction.type === 'investigate') {
    round.investigatedId = targetId;
    const target = state.players.find(p => p.id === targetId);
    if (target) round.investigationResult = target.role;
    const rounds = [...state.rounds];
    rounds[state.currentRound] = round;
    newState = { ...state, rounds, pendingAction: null };
    return resolveNight(newState);
  }

  return newState;
}

function resolveNight(state: GameState): GameState {
  const round = { ...state.rounds[state.currentRound] };
  
  // Determine kill
  if (round.eliminatedId !== null && round.eliminatedId !== round.protectedId) {
    round.killedId = round.eliminatedId;
  } else {
    round.killedId = null;
  }

  let announcement = '';
  let newPlayers = state.players.map(p => ({ ...p }));

  if (round.killedId !== null) {
    newPlayers = newPlayers.map(p =>
      p.id === round.killedId ? { ...p, isAlive: false } : p
    );
    const killed = state.players.find(p => p.id === round.killedId);
    announcement = `🌙 Night passes... ${killed?.name} was eliminated by the Werewolves.`;
  } else {
    announcement = '🌙 Night passes... No one was eliminated! (The Doctor saved the Werewolves\' target.)';
  }

  round.announcement = announcement;
  const rounds = [...state.rounds];
  rounds[state.currentRound] = round;

  let newState: GameState = {
    ...state,
    players: newPlayers,
    rounds,
    phase: 'nightResolution',
    pendingAction: null,
  };

  // Check for winner
  const winner = checkWinner(newPlayers);
  if (winner) {
    return { ...newState, winner, phase: 'ended' };
  }

  return log(newState, announcement);
}

// ─── Day Phase Logic ──────────────────────────────────────────────────────────

function startDayPhase(state: GameState): GameState {
  return { ...state, phase: 'day', currentDebateTurn: 0 };
}

function advanceDebate(state: GameState): GameState {
  const round = state.rounds[state.currentRound];
  const alive = getAlivePlayers(state.players);
  const humanPlayer = alive.find(p => p.id === state.humanPlayerId);

  if (state.currentDebateTurn >= MAX_DEBATE_TURNS) {
    return startVoting(state);
  }

  // Run bidding for all players
  const bids = alive.map(p => aiBid(p, state.currentRound, state.currentDebateTurn));

  // Guarantee the human speaks on debate turns 3 and 7 (user-facing, 1-indexed)
  // currentDebateTurn is 0-indexed, so values 2 and 6 correspond to turns 3 and 7
  const humanHasSpoken = round.debate.some(d => d.playerId === state.humanPlayerId);
  const GUARANTEED_DEBATE_TURNS = [2, 6]; // 0-indexed: turns 3 and 7 in user-facing numbering
  if (humanPlayer && GUARANTEED_DEBATE_TURNS.includes(state.currentDebateTurn) && !humanHasSpoken) {
    const humanBidIdx = bids.findIndex(b => b.playerId === state.humanPlayerId);
    if (humanBidIdx !== -1) {
      bids[humanBidIdx] = { ...bids[humanBidIdx], bid: 5, reasoning: 'Guaranteed turn to speak' };
    }
  }

  // Determine next speaker (highest bid, exclude last speaker)
  const lastSpeaker = round.debate.length > 0
    ? round.debate[round.debate.length - 1].playerId
    : -1;
  
  const eligibleBids = bids.filter(b => b.playerId !== lastSpeaker);
  const maxBid = Math.max(...eligibleBids.map(b => b.bid));
  const topBidders = eligibleBids.filter(b => b.bid === maxBid);
  const nextSpeaker = shuffle(topBidders)[0];
  const speaker = alive.find(p => p.id === nextSpeaker.playerId)!;

  // Update bids in round
  const updatedRound = {
    ...round,
    bids: [...round.bids, bids],
  };
  const rounds = [...state.rounds];
  rounds[state.currentRound] = updatedRound;

  // If speaker is human, prompt for input
  if (speaker.isHuman) {
    return {
      ...state,
      rounds,
      currentDebateTurn: state.currentDebateTurn + 1,
      pendingAction: {
        type: 'debate',
        playerId: speaker.id,
        options: [],
      },
    };
  }

  // AI speaks
  const debateEntry = aiDebate(speaker, alive, round.debate, state.currentRound);
  const newDebate = [...updatedRound.debate, debateEntry];
  rounds[state.currentRound] = { ...updatedRound, debate: newDebate };

  const newState = log(
    { ...state, rounds, currentDebateTurn: state.currentDebateTurn + 1 },
    `💬 ${speaker.name}: "${debateEntry.message}"`
  );

  // After adding debate entry, check if we should vote (every 2 turns or at end)
  if (newState.currentDebateTurn >= MAX_DEBATE_TURNS) {
    return startVoting(newState);
  }

  return newState;
}

function handleHumanDebate(state: GameState, message: string): GameState {
  if (!state.pendingAction || state.pendingAction.type !== 'debate') return state;

  const humanPlayer = state.players.find(p => p.id === state.humanPlayerId)!;
  const debateEntry = {
    playerId: humanPlayer.id,
    playerName: humanPlayer.name,
    message,
  };

  const round = state.rounds[state.currentRound];
  const newDebate = [...round.debate, debateEntry];
  const rounds = [...state.rounds];
  rounds[state.currentRound] = { ...round, debate: newDebate };

  let newState = log(
    { ...state, rounds, pendingAction: null },
    `💬 ${humanPlayer.name} (You): "${message}"`
  );

  if (newState.currentDebateTurn >= MAX_DEBATE_TURNS) {
    return startVoting(newState);
  }
  return newState;
}

function startVoting(state: GameState): GameState {
  const alive = getAlivePlayers(state.players);
  const humanPlayer = state.players.find(p => p.id === state.humanPlayerId)!;

  // Run AI votes
  const round = state.rounds[state.currentRound];
  const wolves = state.players.filter(p => p.role === 'Werewolf').map(p => p.id);
  
  const aiVotes = alive
    .filter(p => !p.isHuman && p.id !== humanPlayer.id)
    .map(p => aiVote(p, alive, round.debate, p.role === 'Werewolf' ? wolves.filter(id => id !== p.id) : []));

  const updatedRound = { ...round, votes: [...round.votes, ...aiVotes] };
  const rounds = [...state.rounds];
  rounds[state.currentRound] = updatedRound;

  if (humanPlayer.isAlive) {
    const options = alive.filter(p => p.id !== humanPlayer.id).map(p => p.id);
    return {
      ...state,
      rounds,
      phase: 'voting',
      pendingAction: { type: 'vote', playerId: humanPlayer.id, options },
    };
  }

  return resolveVote({ ...state, rounds, phase: 'voting' });
}

function handleHumanVote(state: GameState, targetId: number): GameState {
  if (!state.pendingAction || state.pendingAction.type !== 'vote') return state;

  const humanPlayer = state.players.find(p => p.id === state.humanPlayerId)!;
  const target = state.players.find(p => p.id === targetId)!;
  const voteEntry = {
    voterId: humanPlayer.id,
    voterName: humanPlayer.name,
    targetId,
    targetName: target.name,
    reasoning: 'Human player voted.',
  };

  const round = state.rounds[state.currentRound];
  const updatedRound = { ...round, votes: [...round.votes, voteEntry] };
  const rounds = [...state.rounds];
  rounds[state.currentRound] = updatedRound;

  return resolveVote({ ...state, rounds, pendingAction: null });
}

function resolveVote(state: GameState): GameState {
  const round = state.rounds[state.currentRound];
  const exiledId = getMostVoted(round.votes);

  let announcement = '';
  let newPlayers = state.players.map(p => ({ ...p }));

  if (exiledId !== null) {
    const exiled = state.players.find(p => p.id === exiledId)!;
    newPlayers = newPlayers.map(p =>
      p.id === exiledId ? { ...p, isAlive: false } : p
    );
    announcement = `🗳️ The village voted to exile ${exiled.name}! They were a ${exiled.role}.`;
  } else {
    announcement = '🗳️ No majority reached. No one was exiled today.';
  }

  const updatedRound = { ...round, exiledId, announcement: round.announcement + ' ' + announcement };
  const rounds = [...state.rounds];
  rounds[state.currentRound] = updatedRound;

  // Run summaries
  const alive = newPlayers.filter(p => p.isAlive);
  const summaries = alive.map(p => ({
    playerId: p.id,
    playerName: p.name,
    summary: aiSummarize(p, updatedRound, alive),
  }));
  rounds[state.currentRound] = { ...updatedRound, summaries };

  let newState: GameState = {
    ...state,
    players: newPlayers,
    rounds,
    phase: 'dayResolution',
    pendingAction: null,
  };

  newState = log(newState, announcement);

  // Check for winner
  const winner = checkWinner(newPlayers);
  if (winner) {
    return { ...newState, winner, phase: 'ended' };
  }

  return newState;
}

function endRound(state: GameState): GameState {
  const winner = checkWinner(state.players);
  if (winner) return { ...state, winner, phase: 'ended' };
  return state;
}

function nextRound(state: GameState): GameState {
  const nextRoundNum = state.currentRound + 1;
  return {
    ...state,
    phase: 'night',
    currentRound: nextRoundNum,
    currentDebateTurn: 0,
    rounds: [...state.rounds, createRound(nextRoundNum)],
    pendingAction: null,
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface GameContextType {
  state: GameState;
  startGame: (config: SetupConfig) => void;
  confirmRole: () => void;
  performNightAction: (targetId: number) => void;
  advanceNight: () => void;
  startDay: () => void;
  advanceDebate: () => void;
  humanDebate: (message: string) => void;
  humanVote: (targetId: number) => void;
  endRoundAction: () => void;
  nextRoundAction: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback((config: SetupConfig) => dispatch({ type: 'START_GAME', config }), []);
  const confirmRole = useCallback(() => dispatch({ type: 'CONFIRM_ROLE' }), []);
  const performNightAction = useCallback((targetId: number) => dispatch({ type: 'NIGHT_ACTION', targetId }), []);
  const advanceNight = useCallback(() => dispatch({ type: 'ADVANCE_NIGHT' }), []);
  const startDay = useCallback(() => dispatch({ type: 'START_DAY' }), []);
  const advanceDebateAction = useCallback(() => dispatch({ type: 'ADVANCE_DEBATE' }), []);
  const humanDebate = useCallback((message: string) => dispatch({ type: 'HUMAN_DEBATE', message }), []);
  const humanVote = useCallback((targetId: number) => dispatch({ type: 'HUMAN_VOTE', targetId }), []);
  const endRoundAction = useCallback(() => dispatch({ type: 'END_ROUND' }), []);
  const nextRoundAction = useCallback(() => dispatch({ type: 'NEXT_ROUND' }), []);
  const resetGame = useCallback(() => dispatch({ type: 'RESET' }), []);

  return (
    <GameContext.Provider value={{
      state,
      startGame,
      confirmRole,
      performNightAction,
      advanceNight,
      startDay,
      advanceDebate: advanceDebateAction,
      humanDebate,
      humanVote,
      endRoundAction,
      nextRoundAction,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
