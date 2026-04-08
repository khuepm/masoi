import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider, useGame } from './context/GameContext';
import Login from './components/Login';
import Setup from './components/Setup';
import RoleReveal from './components/RoleReveal';
import GameBoard from './components/GameBoard';
import Settings from './components/Settings';
import UserSettings from './components/UserSettings';
import './App.css';

function GameApp() {
  const { state, startGame, confirmRole } = useGame();
  const { phase, players, humanPlayerId } = state;
  const [showSettings, setShowSettings] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);

  return (
    <>
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showUserSettings && <UserSettings onClose={() => setShowUserSettings(false)} />}

      {phase === 'setup' && (
        <Setup
          onStart={startGame}
          onOpenSettings={() => setShowSettings(true)}
          onOpenUserSettings={() => setShowUserSettings(true)}
        />
      )}

      {phase === 'roleReveal' && (() => {
        const humanPlayer = players.find(p => p.id === humanPlayerId);
        if (!humanPlayer) return null;
        return <RoleReveal player={humanPlayer} onConfirm={confirmRole} />;
      })()}

      {phase !== 'setup' && phase !== 'roleReveal' && (
        <GameBoard
          onOpenSettings={() => setShowSettings(true)}
          onOpenUserSettings={() => setShowUserSettings(true)}
        />
      )}
    </>
  );
}

function AuthenticatedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e0e0e0',
        fontSize: '1.2rem',
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
