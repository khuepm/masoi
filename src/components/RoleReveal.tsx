import React from 'react';
import { Player } from '../types/game';
import { ROLE_COLORS, ROLE_ICONS, ROLE_DESCRIPTIONS } from '../utils/constants';
import './RoleReveal.css';

interface Props {
  player: Player;
  onConfirm: () => void;
}

const RoleReveal: React.FC<Props> = ({ player, onConfirm }) => {
  const color = ROLE_COLORS[player.role];
  const icon = ROLE_ICONS[player.role];
  const description = ROLE_DESCRIPTIONS[player.role];

  return (
    <div className="role-reveal-overlay">
      <div className="role-reveal-card">
        <p className="role-reveal-greeting">Welcome, {player.name}!</p>
        <p className="role-reveal-label">Your secret role is...</p>
        <div className="role-reveal-badge" style={{ borderColor: color, boxShadow: `0 0 40px ${color}40` }}>
          <span className="role-reveal-icon">{icon}</span>
          <h2 className="role-reveal-title" style={{ color }}>{player.role}</h2>
        </div>
        <p className="role-reveal-description">{description}</p>
        <p className="role-reveal-warning">⚠️ Keep your role secret from others!</p>
        <button
          className="role-reveal-btn"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
          onClick={onConfirm}
        >
          Begin the Game
        </button>
      </div>
    </div>
  );
};

export default RoleReveal;
