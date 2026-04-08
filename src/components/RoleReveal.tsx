import React from 'react';
import { Player } from '../types/game';
import { ROLE_COLORS, ROLE_ICONS } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import './RoleReveal.css';

interface Props {
  player: Player;
  onConfirm: () => void;
}

const RoleReveal: React.FC<Props> = ({ player, onConfirm }) => {
  const { t } = useLanguage();
  const color = ROLE_COLORS[player.role];
  const icon = ROLE_ICONS[player.role];

  const roleDescriptions: Record<string, string> = React.useMemo(() => ({
    Villager: t.villagerDesc,
    Werewolf: t.werewolfDesc,
    Seer: t.seerDesc,
    Doctor: t.doctorDesc,
  }), [t]);

  return (
    <div className="role-reveal-overlay">
      <div className="role-reveal-card">
        <p className="role-reveal-greeting">{t.welcomePlayer.replace('{name}', player.name)}</p>
        <p className="role-reveal-label">{t.yourSecretRole}</p>
        <div className="role-reveal-badge" style={{ borderColor: color, boxShadow: `0 0 40px ${color}40` }}>
          <span className="role-reveal-icon">{icon}</span>
          <h2 className="role-reveal-title" style={{ color }}>{t[player.role]}</h2>
        </div>
        <p className="role-reveal-description">{roleDescriptions[player.role]}</p>
        <p className="role-reveal-warning">{t.keepRoleSecret}</p>
        <button
          className="role-reveal-btn"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
          onClick={onConfirm}
        >
          {t.beginTheGame}
        </button>
      </div>
    </div>
  );
};

export default RoleReveal;
