import React from 'react';
import { Round, Player } from '../types/game';
import { ROLE_COLORS, ROLE_ICONS } from '../utils/constants';
import BidBar from './BidBar';
import './GameLog.css';

interface Props {
  rounds: Round[];
  players: Player[];
  humanPlayerId: number;
  showRoles: boolean;
}

const GameLog: React.FC<Props> = ({ rounds, players, humanPlayerId, showRoles }) => {
  const getPlayer = (id: number | null) => id !== null ? players.find(p => p.id === id) : null;

  return (
    <div className="game-log">
      {rounds.map((round, ri) => (
        <div key={ri} className="log-round">
          {/* Night Header */}
          <div className="log-phase-header night-header">
            <span>🌙 Round {round.roundNumber} — Night</span>
          </div>

          {/* Night Actions */}
          <div className="log-night-actions">
            {round.killedId !== null ? (
              <div className="log-event killed">
                💀 {getPlayer(round.killedId)?.name} was eliminated by the Werewolves
              </div>
            ) : round.eliminatedId !== null ? (
              <div className="log-event saved">
                🛡️ The Doctor saved the Werewolves' target — no one was eliminated!
              </div>
            ) : null}

            {/* Show investigate result only to human seer */}
            {(() => {
              const humanPlayer = players.find(p => p.id === humanPlayerId);
              if (humanPlayer?.role === 'Seer' && round.investigatedId !== null) {
                const investigated = getPlayer(round.investigatedId);
                return (
                  <div className="log-event investigated">
                    🔮 You investigated {investigated?.name} → They are a{' '}
                    <span style={{ color: ROLE_COLORS[round.investigationResult!], fontWeight: 700 }}>
                      {ROLE_ICONS[round.investigationResult!]} {round.investigationResult}
                    </span>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* Day Header */}
          <div className="log-phase-header day-header">
            <span>☀️ Round {round.roundNumber} — Day</span>
          </div>

          {/* Debate */}
          {round.debate.length > 0 && (
            <div className="log-debate">
              {round.bids.map((bidSet, bi) => (
                <BidBar key={bi} bids={bidSet} />
              ))}
              {round.debate.map((entry, di) => {
                const speaker = players.find(p => p.id === entry.playerId);
                const isHuman = entry.playerId === humanPlayerId;
                return (
                  <div key={di} className={`log-debate-entry ${isHuman ? 'human-speaker' : ''}`}>
                    <div className="debate-avatar">{speaker?.avatar}</div>
                    <div className="debate-bubble">
                      <span className="debate-speaker">
                        {entry.playerName}
                        {isHuman && <span className="you-tag">YOU</span>}
                        {showRoles && speaker && (
                          <span style={{ color: ROLE_COLORS[speaker.role] }}>
                            {' '}({speaker.role})
                          </span>
                        )}
                      </span>
                      <span className="debate-text">{entry.message}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Votes */}
          {round.votes.length > 0 && (
            <div className="log-votes">
              <div className="log-section-title">🗳️ Votes</div>
              {round.votes.map((vote, vi) => (
                <div key={vi} className="log-vote-entry">
                  <span className="vote-player">{vote.voterName}</span>
                  <span className="vote-arrow">→</span>
                  <span className="vote-target">{vote.targetName}</span>
                </div>
              ))}
            </div>
          )}

          {/* Exile result */}
          {round.exiledId !== null && (
            <div className="log-event exiled">
              ⛔ {getPlayer(round.exiledId)?.name} was exiled by the village!
              {showRoles && (
                <span style={{ color: ROLE_COLORS[getPlayer(round.exiledId)?.role ?? 'Villager'] }}>
                  {' '}({getPlayer(round.exiledId)?.role})
                </span>
              )}
            </div>
          )}
          {round.exiledId === null && round.votes.length > 0 && (
            <div className="log-event no-exile">
              🤷 No majority reached — no one was exiled.
            </div>
          )}

          {/* Summaries */}
          {round.summaries.length > 0 && (
            <div className="log-summaries">
              <div className="log-section-title">📝 End-of-Round Summaries</div>
              {round.summaries.map((s, si) => (
                <div key={si} className="log-summary-entry">
                  <span className="summary-player">{s.playerName}:</span>
                  <span className="summary-text">{s.summary}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GameLog;
