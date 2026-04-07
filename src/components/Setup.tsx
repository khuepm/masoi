import React, { useState } from 'react';
import { SetupConfig, Role } from '../types/game';
import { ROLE_ICONS } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import './Setup.css';

interface Props {
  onStart: (config: SetupConfig) => void;
  onOpenSettings: () => void;
}

const Setup: React.FC<Props> = ({ onStart, onOpenSettings }) => {
  const { t } = useLanguage();
  const [numPlayers, setNumPlayers] = useState(7);
  const [humanName, setHumanName] = useState('');
  const [humanRole, setHumanRole] = useState<Role | 'random'>('random');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanName.trim()) return;
    onStart({ numPlayers, humanName: humanName.trim(), humanRole });
  };

  const roles: Array<Role | 'random'> = ['random', 'Villager', 'Werewolf', 'Seer', 'Doctor'];

  const roleDescriptions: Record<Role, string> = {
    Villager: t.villagerDesc,
    Werewolf: t.werewolfDesc,
    Seer: t.seerDesc,
    Doctor: t.doctorDesc,
  };

  const getRoleName = (role: Role | 'random'): string => {
    if (role === 'random') return t.random;
    return t[role];
  };

  const wolvesCount = numPlayers <= 6 ? 1 : 2;
  const villagersNum = numPlayers - wolvesCount - 2;

  return (
    <div className="setup-container">
      <div className="setup-card">
        <div className="setup-header">
          <span className="setup-wolf-icon">🐺</span>
          <h1>{t.appTitle}</h1>
          <p className="setup-subtitle">{t.appSubtitle}</p>
          <button className="settings-icon-btn" onClick={onOpenSettings} title={t.settings}>⚙️</button>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-group">
            <label htmlFor="humanName">{t.yourName}</label>
            <input
              id="humanName"
              type="text"
              value={humanName}
              onChange={e => setHumanName(e.target.value)}
              placeholder={t.enterYourName}
              maxLength={20}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="numPlayers">{t.numberOfPlayers}</label>
            <div className="player-count-selector">
              {[6, 7, 8, 9, 10].map(n => (
                <button
                  key={n}
                  type="button"
                  className={`count-btn ${numPlayers === n ? 'active' : ''}`}
                  onClick={() => setNumPlayers(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="player-count-info">
              {t.playersInfo
                .replace('{count}', String(numPlayers))
                .replace('{wolves}', wolvesCount === 1 ? t.oneWerewolf : t.twoWerewolves)
                .replace('{villagers}', villagersNum === 1
                  ? t.villagerCount.replace('{count}', String(villagersNum))
                  : t.villagersCount.replace('{count}', String(villagersNum))
                )}
            </p>
            <p className="player-count-info" style={{marginTop: 4, color: 'rgba(255,255,255,0.35)'}}>
              {t.youPlusAI.replace('{count}', String(numPlayers - 1))}
            </p>
          </div>

          <div className="form-group">
            <label>{t.yourRole}</label>
            <div className="role-selector">
              {roles.map(role => (
                <button
                  key={role}
                  type="button"
                  className={`role-btn ${humanRole === role ? 'active' : ''} role-${role}`}
                  onClick={() => setHumanRole(role)}
                >
                  <span className="role-icon">
                    {role === 'random' ? '🎲' : ROLE_ICONS[role]}
                  </span>
                  <span className="role-label">{getRoleName(role)}</span>
                </button>
              ))}
            </div>
            {humanRole !== 'random' && (
              <p className="role-description">{roleDescriptions[humanRole]}</p>
            )}
          </div>

          <button type="submit" className="start-btn" disabled={!humanName.trim()}>
            {t.startGame}
          </button>
        </form>

        <div className="rules-section">
          <h3>{t.howToPlay}</h3>
          <ul>
            <li>🌙 <strong>{t.ruleNight}</strong></li>
            <li>☀️ <strong>{t.ruleDay}</strong></li>
            <li>🏘️ <strong>{t.ruleVillagerWin}</strong></li>
            <li>🐺 <strong>{t.ruleWerewolfWin}</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Setup;
