import { Player, DebateEntry, VoteEntry, BidEntry, Round } from '../types/game';
import { shuffle } from './gameLogic';

// AI player names and pre-written messages
const WEREWOLF_DEBATE = [
  "I've been watching everyone carefully. {target} seems the most suspicious to me.",
  "Let's think logically about this. The behavior of {target} doesn't add up.",
  "I agree with the others — {target} has been deflecting every accusation.",
  "We need to focus on facts. {target} hasn't given us any good reasons to trust them.",
  "I'm not sure about {target}. Something feels off about their explanations.",
];

const VILLAGER_DEBATE = [
  "I think {target} is acting suspicious. Their arguments don't make sense.",
  "We should consider voting out {target} — they haven't contributed anything useful.",
  "Has anyone else noticed how quiet {target} has been? That's suspicious.",
  "I want to defend myself here. I'm just a villager trying to help us win.",
  "Based on what everyone said, {target} seems like the biggest threat right now.",
  "Let's be methodical. {target} keeps changing their story.",
];

const SEER_DEBATE = [
  "I have information that might help us. We should be careful about {target}.",
  "Trust me on this — {target} is not who they seem.",
  "I cannot reveal everything I know, but {target} is suspicious.",
  "Let's vote out {target}. I have a strong feeling about this.",
];

const DOCTOR_DEBATE = [
  "We need to protect our strongest players. I'm worried about {target}.",
  "Let's think carefully before voting. {target} seems most suspicious.",
  "I've been analyzing everyone's behavior. {target} is acting like a werewolf.",
  "The werewolves are clever, but {target}'s behavior gives them away.",
];

function getDebateMessage(player: Player, target: Player | null, round: number): string {
  let messages: string[];
  switch (player.role) {
    case 'Werewolf': messages = WEREWOLF_DEBATE; break;
    case 'Seer': messages = SEER_DEBATE; break;
    case 'Doctor': messages = DOCTOR_DEBATE; break;
    default: messages = VILLAGER_DEBATE;
  }
  const msg = messages[Math.floor(Math.random() * messages.length)];
  return msg.replace('{target}', target?.name ?? 'someone');
}

export function aiEliminate(werewolf: Player, alivePlayers: Player[]): number {
  const targets = alivePlayers.filter(
    p => p.id !== werewolf.id && p.role !== 'Werewolf'
  );
  if (targets.length === 0) return -1;
  const shuffled = shuffle(targets);
  // Prefer to eliminate Seer or Doctor if known (AI doesn't know roles, so random)
  return shuffled[0].id;
}

export function aiProtect(doctor: Player, alivePlayers: Player[], rounds: Round[]): number {
  // Protect self or most-voted player from last round
  const targets = alivePlayers;
  if (targets.length === 0) return -1;
  
  if (rounds.length > 0) {
    const lastRound = rounds[rounds.length - 1];
    const lastVotes = lastRound.votes;
    if (lastVotes.length > 0) {
      const voteCounts: Record<number, number> = {};
      for (const v of lastVotes) {
        voteCounts[v.targetId] = (voteCounts[v.targetId] || 0) + 1;
      }
      const mostVoted = Object.entries(voteCounts).sort((a, b) => b[1] - a[1])[0];
      const mostVotedId = Number(mostVoted[0]);
      if (alivePlayers.find(p => p.id === mostVotedId)) {
        return mostVotedId;
      }
    }
  }
  
  // Default: protect self
  return doctor.id;
}

export function aiInvestigate(seer: Player, alivePlayers: Player[], previouslyInvestigated: number[]): number {
  const targets = alivePlayers.filter(
    p => p.id !== seer.id && !previouslyInvestigated.includes(p.id)
  );
  if (targets.length === 0) {
    // Re-investigate someone
    const others = alivePlayers.filter(p => p.id !== seer.id);
    return others.length > 0 ? shuffle(others)[0].id : -1;
  }
  return shuffle(targets)[0].id;
}

export function aiBid(player: Player, round: number, debateTurn: number): BidEntry {
  // Higher bid if more turns remain, random variation
  const bids = [0, 1, 2, 3, 4];
  const weights = player.role === 'Werewolf' 
    ? [0.2, 0.3, 0.3, 0.15, 0.05] // Werewolves bid moderately
    : [0.1, 0.2, 0.35, 0.25, 0.1]; // Villagers eager to speak
  
  const rand = Math.random();
  let cumulative = 0;
  let bid = 1;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) {
      bid = bids[i];
      break;
    }
  }
  
  const reasonings = [
    'I need to share my thoughts.',
    'I have something important to say.',
    'I want to hear what others think first.',
    'This is urgent!',
    'I should stay quiet for now.',
  ];
  
  return {
    playerId: player.id,
    playerName: player.name,
    bid,
    reasoning: reasonings[Math.min(bid, reasonings.length - 1)],
  };
}

export function aiDebate(
  player: Player,
  alivePlayers: Player[],
  debateHistory: DebateEntry[],
  round: number
): DebateEntry {
  // Find the most accused player in debate history (not self)
  const accusationCount: Record<number, number> = {};
  for (const entry of debateHistory) {
    if (entry.playerId !== player.id) {
      for (const other of alivePlayers) {
        if (entry.message.includes(other.name) && other.id !== player.id) {
          accusationCount[other.id] = (accusationCount[other.id] || 0) + 1;
        }
      }
    }
  }

  let target: Player | null = null;
  const others = alivePlayers.filter(p => p.id !== player.id);
  if (Object.keys(accusationCount).length > 0) {
    const mostAccused = Object.entries(accusationCount)
      .sort((a, b) => b[1] - a[1])[0][0];
    target = alivePlayers.find(p => p.id === Number(mostAccused)) ?? null;
  }
  
  if (!target && others.length > 0) {
    target = shuffle(others)[0];
  }

  const message = getDebateMessage(player, target, round);
  return {
    playerId: player.id,
    playerName: player.name,
    message,
    reasoning: `Strategic thinking as ${player.role}`,
  };
}

export function aiVote(
  player: Player,
  alivePlayers: Player[],
  debateHistory: DebateEntry[],
  knownWerewolves: number[] = []
): VoteEntry {
  const candidates = alivePlayers.filter(p => p.id !== player.id);
  
  // If werewolf, try to vote out non-werewolves
  if (player.role === 'Werewolf' && knownWerewolves.length > 0) {
    const nonWolf = candidates.filter(p => !knownWerewolves.includes(p.id));
    if (nonWolf.length > 0) {
      const target = shuffle(nonWolf)[0];
      return {
        voterId: player.id,
        voterName: player.name,
        targetId: target.id,
        targetName: target.name,
        reasoning: 'This player seems suspicious based on the debate.',
      };
    }
  }

  // Count mentions in debate (as target of suspicion)
  const suspicionCount: Record<number, number> = {};
  for (const entry of debateHistory) {
    for (const candidate of candidates) {
      if (entry.message.includes(candidate.name)) {
        suspicionCount[candidate.id] = (suspicionCount[candidate.id] || 0) + 1;
      }
    }
  }

  let target: Player;
  if (Object.keys(suspicionCount).length > 0) {
    const mostSuspicious = Object.entries(suspicionCount)
      .sort((a, b) => b[1] - a[1])[0][0];
    target = candidates.find(p => p.id === Number(mostSuspicious)) ?? shuffle(candidates)[0];
  } else {
    target = shuffle(candidates)[0];
  }

  return {
    voterId: player.id,
    voterName: player.name,
    targetId: target.id,
    targetName: target.name,
    reasoning: `Based on their behavior during the debate, ${target.name} seems most suspicious.`,
  };
}

export function aiSummarize(player: Player, round: Round, alivePlayers: Player[]): string {
  const summaries = [
    `Round ${round.roundNumber} was intense. I'm watching ${alivePlayers.filter(p => p.id !== player.id)[0]?.name ?? 'everyone'} closely.`,
    `The debate revealed some suspicious patterns. I'll remember what was said today.`,
    `I need to be more careful. The werewolves are still hiding among us.`,
    `Key observation: several players were very eager to accuse others. That could be a deflection tactic.`,
  ];
  return summaries[Math.floor(Math.random() * summaries.length)];
}
