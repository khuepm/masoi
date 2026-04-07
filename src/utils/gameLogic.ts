import { Player, Role, Team } from '../types/game';

export function getRoleCount(numPlayers: number): { werewolves: number; seer: number; doctor: number; villagers: number } {
  const werewolves = numPlayers <= 6 ? 1 : 2;
  const seer = 1;
  const doctor = 1;
  const villagers = numPlayers - werewolves - seer - doctor;
  return { werewolves, seer, doctor, villagers };
}

export function assignRoles(players: Player[], humanPlayerId: number, preferredRole: Role | 'random'): Player[] {
  const numPlayers = players.length;
  const counts = getRoleCount(numPlayers);

  let roles: Role[] = [
    ...Array(counts.werewolves).fill('Werewolf' as Role),
    'Seer' as Role,
    'Doctor' as Role,
    ...Array(counts.villagers).fill('Villager' as Role),
  ];

  // Shuffle roles
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  // If human has a preferred role, swap it in
  if (preferredRole !== 'random') {
    const humanIdx = players.findIndex(p => p.id === humanPlayerId);
    const preferredIdx = roles.indexOf(preferredRole);
    if (preferredIdx !== -1 && humanIdx !== -1) {
      [roles[humanIdx], roles[preferredIdx]] = [roles[preferredIdx], roles[humanIdx]];
    }
  }

  return players.map((p, i) => ({ ...p, role: roles[i] }));
}

export function checkWinner(players: Player[]): Team | null {
  const alive = players.filter(p => p.isAlive);
  const aliveWolves = alive.filter(p => p.role === 'Werewolf');
  const aliveVillagers = alive.filter(p => p.role !== 'Werewolf');

  if (aliveWolves.length === 0) return 'Villagers';
  if (aliveWolves.length >= aliveVillagers.length) return 'Werewolves';
  return null;
}

export function getAlivePlayers(players: Player[]): Player[] {
  return players.filter(p => p.isAlive);
}

export function getMostVoted(votes: { targetId: number }[]): number | null {
  if (votes.length === 0) return null;
  const counts: Record<number, number> = {};
  for (const v of votes) {
    counts[v.targetId] = (counts[v.targetId] || 0) + 1;
  }
  const maxVotes = Math.max(...Object.values(counts));
  const tiedCandidates = Object.keys(counts).filter(id => counts[Number(id)] === maxVotes);
  // Majority required
  if (maxVotes > votes.length / 2) {
    const candidates = tiedCandidates.map(Number);
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  return null;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
