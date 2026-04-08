import React from 'react';
import { Player } from '../types/game';
import { ROLE_COLORS, ROLE_ICONS } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import './PlayerCard.css';

interface Props {
  player: Player;
  showRole?: boolean;
  isSelected?: boolean;
  isSelectable?: boolean;
  onClick?: () => void;
  highlight?: 'killed' | 'exiled' | 'protected' | 'investigated' | 'suspect';
}

const PlayerCard: React.FC<Props> = ({
  player,
  showRole = false,
  isSelected = false,
  isSelectable = false,
  onClick,
  highlight,
}) => {
  const { t } = useLanguage();
  const roleColor = showRole ? ROLE_COLORS[player.role] : '#888';
  const roleIcon = ROLE_ICONS[player.role];

  return (
    <div
      className={`player-card ${!player.isAlive ? 'dead' : ''} ${isSelected ? 'selected' : ''} ${isSelectable ? 'selectable' : ''} ${highlight ? `highlight-${highlight}` : ''}`}
      onClick={isSelectable ? onClick : undefined}
    >
      <div className="player-avatar">
        {player.avatar}
        {!player.isAlive && <span className="death-overlay">💀</span>}
        {highlight === 'protected' && <span className="status-badge">🛡️</span>}
        {highlight === 'investigated' && <span className="status-badge">🔍</span>}
      </div>
      <div className="player-info">
        <div className="player-name">
          {player.name}
          {player.isHuman && <span className="you-badge">{t.you}</span>}
        </div>
        {showRole && (
          <div className="player-role" style={{ color: roleColor }}>
            {roleIcon} {t[player.role]}
          </div>
        )}
        {!player.isAlive && <div className="player-status">{t.playerEliminated}</div>}
      </div>
      {isSelectable && (
        <div className="select-indicator">
          {isSelected ? '✓' : '→'}
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
