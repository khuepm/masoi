import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { Player } from '../types/game';
import PlayerCard from './PlayerCard';
import GameLog from './GameLog';
import { ROLE_COLORS, ROLE_ICONS, MAX_DEBATE_TURNS } from '../utils/constants';
import { getAlivePlayers } from '../utils/gameLogic';
import './GameBoard.css';

interface Props {
  onOpenSettings: () => void;
}

const GameBoard: React.FC<Props> = ({ onOpenSettings }) => {
  const { t } = useLanguage();
  const {
    state,
    performNightAction,
    advanceNight,
    startDay,
    advanceDebate,
    humanDebate,
    humanVote,
    nextRoundAction,
    resetGame,
  } = useGame();

  const {
    players, rounds, currentRound, phase, pendingAction,
    humanPlayerId, winner, gameLog, currentDebateTurn,
  } = state;

  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [debateMessage, setDebateMessage] = useState('');
  const [showLog, setShowLog] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const humanPlayer = players.find(p => p.id === humanPlayerId)!;
  const alive = getAlivePlayers(players);
  const currentRoundData = rounds[currentRound];

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameLog]);

  const handleTargetSelect = (playerId: number) => {
    setSelectedTarget(prev => prev === playerId ? null : playerId);
  };

  const handleConfirmAction = () => {
    if (selectedTarget === null) return;
    performNightAction(selectedTarget);
    setSelectedTarget(null);
  };

  const handleHumanVote = () => {
    if (selectedTarget === null) return;
    humanVote(selectedTarget);
    setSelectedTarget(null);
  };

  const handleHumanDebate = () => {
    if (!debateMessage.trim()) return;
    humanDebate(debateMessage.trim());
    setDebateMessage('');
  };

  const getPhaseTitle = () => {
    switch (phase) {
      case 'night': return t.nightPhase;
      case 'nightResolution': return t.nightResolution;
      case 'day': return t.dayPhaseDebate;
      case 'voting': return t.dayPhaseVoting;
      case 'dayResolution': return t.dayResolution;
      case 'summary': return t.summaries;
      default: return '';
    }
  };

  const getHighlight = (player: Player): 'killed' | 'exiled' | 'protected' | 'investigated' | undefined => {
    if (!currentRoundData) return undefined;
    if (phase === 'nightResolution' || phase === 'day') {
      if (player.id === currentRoundData.killedId) return 'killed';
      if (player.id === currentRoundData.protectedId && humanPlayer.role === 'Doctor') return 'protected';
      if (player.id === currentRoundData.investigatedId && humanPlayer.role === 'Seer') return 'investigated';
    }
    if (phase === 'dayResolution') {
      if (player.id === currentRoundData.exiledId) return 'exiled';
    }
    return undefined;
  };

  const renderNightAction = () => {
    if (!pendingAction) return null;
    const { type, options } = pendingAction;

    const titles: Record<string, string> = {
      eliminate: t.chooseEliminate,
      protect: t.chooseProtect,
      investigate: t.chooseInvestigate,
    };

    return (
      <div className="action-panel">
        <h3>{titles[type]}</h3>
        <div className="action-targets">
          {options.map(id => {
            const p = players.find(pl => pl.id === id)!;
            return (
              <PlayerCard
                key={id}
                player={p}
                isSelectable
                isSelected={selectedTarget === id}
                onClick={() => handleTargetSelect(id)}
              />
            );
          })}
        </div>
        <button
          className="action-btn"
          disabled={selectedTarget === null}
          onClick={handleConfirmAction}
        >
          {t.confirm}
        </button>
      </div>
    );
  };

  const renderVoteAction = () => {
    if (!pendingAction || pendingAction.type !== 'vote') return null;

    return (
      <div className="action-panel vote-panel">
        <h3>{t.voteToExile}</h3>
        <p className="vote-hint">{t.voteHint}</p>
        <div className="action-targets">
          {pendingAction.options.map(id => {
            const p = players.find(pl => pl.id === id)!;
            return (
              <PlayerCard
                key={id}
                player={p}
                isSelectable
                isSelected={selectedTarget === id}
                onClick={() => handleTargetSelect(id)}
              />
            );
          })}
        </div>
        <button
          className="action-btn"
          disabled={selectedTarget === null}
          onClick={handleHumanVote}
        >
          {t.castVote}
        </button>
      </div>
    );
  };

  const renderDebateAction = () => {
    if (!pendingAction || pendingAction.type !== 'debate') return null;

    return (
      <div className="action-panel debate-panel">
        <h3>{t.yourTurnToSpeak.replace('{current}', String(currentDebateTurn)).replace('{max}', String(MAX_DEBATE_TURNS))}</h3>
        <textarea
          className="debate-input"
          placeholder={t.whatToSay}
          value={debateMessage}
          onChange={e => setDebateMessage(e.target.value)}
          rows={3}
          maxLength={300}
        />
        <div className="debate-actions">
          <span className="char-count">{debateMessage.length}/300</span>
          <button
            className="action-btn"
            disabled={!debateMessage.trim()}
            onClick={handleHumanDebate}
          >
            {t.speak}
          </button>
        </div>
      </div>
    );
  };

  const renderPhaseControls = () => {
    if (pendingAction) return null;

    if (phase === 'night') {
      return (
        <div className="phase-control">
          <p>{t.villageSleeps}</p>
          <button className="action-btn secondary" onClick={advanceNight}>
            {t.skipToMorning}
          </button>
        </div>
      );
    }

    if (phase === 'nightResolution') {
      return (
        <div className="phase-control">
          <div className="announcement-box">
            {currentRoundData?.announcement}
          </div>
          <button className="action-btn" onClick={startDay}>
            {t.startDayPhase}
          </button>
        </div>
      );
    }

    if (phase === 'day') {
      return (
        <div className="phase-control">
          <p>
            {t.debateTurn.replace('{current}', String(currentDebateTurn)).replace('{max}', String(MAX_DEBATE_TURNS))}
            {currentDebateTurn >= MAX_DEBATE_TURNS ? t.timeToVote : ''}
          </p>
          <button
            className="action-btn"
            onClick={advanceDebate}
          >
            {currentDebateTurn >= MAX_DEBATE_TURNS ? t.proceedToVoting : t.nextDebateTurn}
          </button>
        </div>
      );
    }

    if (phase === 'voting') {
      return (
        <div className="phase-control">
          <p>{t.aiVotedYourTurn}</p>
        </div>
      );
    }

    if (phase === 'dayResolution') {
      return (
        <div className="phase-control">
          <div className="announcement-box">
            {currentRoundData?.announcement}
          </div>
          <button className="action-btn" onClick={nextRoundAction}>
            {t.beginNextRound}
          </button>
        </div>
      );
    }

    return null;
  };

  if (phase === 'ended') {
    const isHumanWinner = (winner === 'Villagers' && humanPlayer.role !== 'Werewolf') ||
      (winner === 'Werewolves' && humanPlayer.role === 'Werewolf');

    return (
      <div className="game-ended">
        <div className="ended-card">
          <div className="ended-icon">{winner === 'Villagers' ? '🏘️' : '🐺'}</div>
          <h1 className="ended-title" style={{ color: winner === 'Villagers' ? '#4caf50' : '#f44336' }}>
            {winner === 'Villagers' ? t.villagersWin : t.werewolvesWin}
          </h1>
          <p className="ended-result">
            {isHumanWinner ? t.congratulations : t.teamLost}
          </p>
          <div className="ended-roles">
            <h3>{t.finalRoles}</h3>
            {players.map(p => (
              <div key={p.id} className="ended-role-entry">
                <span>{p.avatar} {p.name}</span>
                <span style={{ color: ROLE_COLORS[p.role] }}>
                  {ROLE_ICONS[p.role]} {t[p.role]}
                </span>
                {!p.isAlive && <span className="ended-dead">💀 {t.eliminated}</span>}
              </div>
            ))}
          </div>
          <div className="ended-buttons">
            <button className="action-btn" onClick={resetGame}>
              {t.playAgain}
            </button>
          </div>
        </div>
        {/* Full game log in ended state */}
        <div className="ended-log">
          <h3>{t.gameHistory}</h3>
          <GameLog rounds={rounds} players={players} humanPlayerId={humanPlayerId} showRoles={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="game-board">
      {/* Header */}
      <div className="board-header">
        <div className="header-left">
          <span className="wolf-logo">🐺</span>
          <span className="game-title">{t.appTitle}</span>
          <span className="round-badge">{t.round.replace('{num}', String(currentRound))}</span>
        </div>
        <div className="header-right">
          <div className="your-role-badge" style={{ borderColor: ROLE_COLORS[humanPlayer?.role] }}>
            {humanPlayer && (
              <>
                <span>{ROLE_ICONS[humanPlayer.role]}</span>
                <span style={{ color: ROLE_COLORS[humanPlayer.role] }}>{t[humanPlayer.role]}</span>
              </>
            )}
          </div>
          <button className="icon-btn" onClick={() => setShowLog(!showLog)} title={t.gameLog}>
            📜
          </button>
          <button className="icon-btn" onClick={() => setShowRoles(!showRoles)} title={t.showRolesDebug}>
            🔍
          </button>
          <button className="icon-btn" onClick={onOpenSettings} title={t.settings}>
            ⚙️
          </button>
          <button className="icon-btn danger" onClick={resetGame} title={t.quit}>
            ✕
          </button>
        </div>
      </div>

      <div className="board-main">
        {/* Left: Players */}
        <div className="board-players">
          <div className="section-title">
            {t.playersAlive.replace('{count}', String(alive.length))}
          </div>
          <div className="players-list">
            {players.map(p => (
              <PlayerCard
                key={p.id}
                player={p}
                showRole={showRoles || p.id === humanPlayerId}
                highlight={getHighlight(p)}
              />
            ))}
          </div>
        </div>

        {/* Center: Game Action Area */}
        <div className="board-center">
          <div className="phase-indicator">
            <h2>{getPhaseTitle()}</h2>
          </div>

          {/* Night action for human */}
          {(phase === 'night') && renderNightAction()}

          {/* Debate action for human */}
          {(phase === 'day') && renderDebateAction()}

          {/* Voting action for human */}
          {(phase === 'voting') && renderVoteAction()}

          {/* Phase controls */}
          {renderPhaseControls()}

          {/* Recent game log entries */}
          <div className="recent-log">
            {gameLog.slice(-5).map((entry, i) => (
              <div key={i} className="recent-log-entry">{entry}</div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* Right: Full Log (toggleable) */}
        {showLog && (
          <div className="board-log">
            <div className="section-title">
              {t.gameLog}
              <button className="close-log-btn" onClick={() => setShowLog(false)}>✕</button>
            </div>
            <div className="log-scroll">
              <GameLog
                rounds={rounds.slice(0, currentRound + 1)}
                players={players}
                humanPlayerId={humanPlayerId}
                showRoles={showRoles}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
