import React, { useState } from 'react';
import { SetupConfig, Role } from '../types/game';
import { ROLE_ICONS, ROLE_DESCRIPTIONS } from '../utils/constants';
import './Setup.css';

interface Props {
  onStart: (config: SetupConfig) => void;
}

const Setup: React.FC<Props> = ({ onStart }) => {
  const [numPlayers, setNumPlayers] = useState(7);
  const [humanName, setHumanName] = useState('');
  const [humanRole, setHumanRole] = useState<Role | 'random'>('random');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanName.trim()) return;
    onStart({ numPlayers, humanName: humanName.trim(), humanRole });
  };

  const roles: Array<Role | 'random'> = ['random', 'Villager', 'Werewolf', 'Seer', 'Doctor'];

  return (
    <div className="setup-container">
      <div className="setup-card">
        <div className="setup-header">
          <span className="setup-wolf-icon">🐺</span>
          <h1>Werewolf Arena</h1>
          <p className="setup-subtitle">The Social Deduction Game</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-group">
            <label htmlFor="humanName">Your Name</label>
            <input
              id="humanName"
              type="text"
              value={humanName}
              onChange={e => setHumanName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="numPlayers">Number of Players</label>
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
              {numPlayers} players: {numPlayers <= 6 ? '1 Werewolf' : '2 Werewolves'}, 1 Seer, 1 Doctor,{' '}
              {numPlayers - (numPlayers <= 6 ? 1 : 2) - 2} Villager{numPlayers - (numPlayers <= 6 ? 1 : 2) - 2 !== 1 ? 's' : ''}
            </p>
            <p className="player-count-info" style={{marginTop: 4, color: 'rgba(255,255,255,0.35)'}}>
              You + {numPlayers - 1} AI opponents
            </p>
          </div>

          <div className="form-group">
            <label>Your Role</label>
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
                  <span className="role-label">{role === 'random' ? 'Random' : role}</span>
                </button>
              ))}
            </div>
            {humanRole !== 'random' && (
              <p className="role-description">{ROLE_DESCRIPTIONS[humanRole]}</p>
            )}
          </div>

          <button type="submit" className="start-btn" disabled={!humanName.trim()}>
            Start Game
          </button>
        </form>

        <div className="rules-section">
          <h3>How to Play</h3>
          <ul>
            <li>🌙 <strong>Night:</strong> Werewolves eliminate, Doctor protects, Seer investigates</li>
            <li>☀️ <strong>Day:</strong> Players debate and vote to exile a suspect</li>
            <li>🏘️ <strong>Villagers win</strong> by exiling all Werewolves</li>
            <li>🐺 <strong>Werewolves win</strong> when they equal or outnumber Villagers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Setup;
