import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { GameProvider, useGame } from './context/GameContext';
import Setup from './components/Setup';
import RoleReveal from './components/RoleReveal';
import GameBoard from './components/GameBoard';
import Settings from './components/Settings';
import './App.css';

function GameApp() {
  const { state, startGame, confirmRole } = useGame();
  const { phase, players, humanPlayerId } = state;
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}

      {phase === 'setup' && (
        <Setup onStart={startGame} onOpenSettings={() => setShowSettings(true)} />
      )}

      {phase === 'roleReveal' && (() => {
        const humanPlayer = players.find(p => p.id === humanPlayerId);
        if (!humanPlayer) return null;
        return <RoleReveal player={humanPlayer} onConfirm={confirmRole} />;
      })()}

      {phase !== 'setup' && phase !== 'roleReveal' && (
        <GameBoard onOpenSettings={() => setShowSettings(true)} />
      )}
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <GameProvider>
        <GameApp />
      </GameProvider>
    </LanguageProvider>
  );
}

export default App;
