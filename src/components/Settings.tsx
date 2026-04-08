import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language, languages } from '../i18n';
import './Settings.css';

interface Props {
  onClose: () => void;
}

const Settings: React.FC<Props> = ({ onClose }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="settings-overlay">
      <div className="settings-card">
        <div className="settings-header">
          <h2>⚙️ {t.settings}</h2>
          <button className="settings-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-section">
          <h3>🌐 {t.language}</h3>
          <div className="language-selector">
            {(Object.entries(languages) as [Language, { name: string; flag: string }][]).map(
              ([code, { name, flag }]) => (
                <button
                  key={code}
                  className={`language-btn ${language === code ? 'active' : ''}`}
                  onClick={() => setLanguage(code)}
                >
                  <span className="language-flag">{flag}</span>
                  <span className="language-name">{name}</span>
                </button>
              )
            )}
          </div>
        </div>

        <div className="settings-section">
          <h3>ℹ️ {t.about}</h3>
          <p className="settings-about">{t.aboutDescription}</p>
          <p className="settings-version">{t.version}: 0.1.0</p>
        </div>

        <div className="settings-footer">
          <button className="settings-back-btn" onClick={onClose}>
            ← {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
