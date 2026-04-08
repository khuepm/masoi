import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Login.css';

const Login: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (isSignUp) {
      const { error: err } = await signUp(email, password);
      if (err) {
        setError(err);
      } else {
        setSuccessMessage(t.signUpSuccess);
        setIsSignUp(false);
      }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err);
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-wolf-icon">🐺</span>
          <h1>{t.appTitle}</h1>
          <p className="login-subtitle">{t.appSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>{isSignUp ? t.signUp : t.signIn}</h2>

          {error && <div className="login-error">{error}</div>}
          {successMessage && <div className="login-success">{successMessage}</div>}

          <div className="login-field">
            <label htmlFor="email">{t.email}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.enterEmail}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">{t.password}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t.enterPassword}
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? '...' : (isSignUp ? t.signUp : t.signIn)}
          </button>

          <p className="login-toggle">
            {isSignUp ? t.alreadyHaveAccount : t.dontHaveAccount}{' '}
            <button
              type="button"
              className="login-toggle-btn"
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccessMessage(null); }}
            >
              {isSignUp ? t.signIn : t.signUp}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
