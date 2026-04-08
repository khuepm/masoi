import React, { useState } from 'react';
import { useAuth, LLMConfig } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './UserSettings.css';

interface Props {
  onClose: () => void;
}

const LLM_PROVIDERS = [
  { key: 'googleApiKey' as const, label: 'Google Gemini', icon: '🔮', placeholder: 'AIza...' },
  { key: 'boongaiApiKey' as const, label: 'BoongAI', icon: '🤖', placeholder: 'bng-...' },
  { key: 'claudeApiKey' as const, label: 'Claude', icon: '🧠', placeholder: 'sk-ant-...' },
  { key: 'chatgptApiKey' as const, label: 'ChatGPT', icon: '💬', placeholder: 'sk-...' },
];

const UserSettings: React.FC<Props> = ({ onClose }) => {
  const { user, llmConfig, updateLLMConfig, signOut } = useAuth();
  const { t } = useLanguage();
  const [config, setConfig] = useState<LLMConfig>({ ...llmConfig });
  const [saved, setSaved] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const handleChange = (key: keyof LLMConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateLLMConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleShowKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="user-settings-overlay">
      <div className="user-settings-card">
        <div className="user-settings-header">
          <h2>👤 {t.userSettings}</h2>
          <button className="user-settings-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="user-settings-section">
          <h3>📧 {t.account}</h3>
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
          </div>
        </div>

        <div className="user-settings-section">
          <h3>🔗 {t.llmConnections}</h3>
          <p className="user-settings-description">{t.llmConnectionsDesc}</p>

          {LLM_PROVIDERS.map(({ key, label, icon, placeholder }) => (
            <div key={key} className="llm-field">
              <label className="llm-label">
                <span className="llm-icon">{icon}</span>
                {label}
                {config[key] && <span className="llm-connected">✓ {t.connected}</span>}
              </label>
              <div className="llm-input-wrapper">
                <input
                  type={showKeys[key] ? 'text' : 'password'}
                  value={config[key]}
                  onChange={e => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="llm-input"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="llm-toggle-visibility"
                  onClick={() => toggleShowKey(key)}
                  title={showKeys[key] ? t.hide : t.show}
                >
                  {showKeys[key] ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          ))}

          <button className="user-settings-save-btn" onClick={handleSave}>
            {saved ? `✓ ${t.saved}` : t.saveSettings}
          </button>
        </div>

        <div className="user-settings-footer">
          <button className="user-settings-back-btn" onClick={onClose}>
            ← {t.back}
          </button>
          <button className="user-settings-signout-btn" onClick={handleSignOut}>
            🚪 {t.signOutBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
