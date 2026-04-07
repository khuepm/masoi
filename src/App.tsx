import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Setup from './components/Setup';
import RoleReveal from './components/RoleReveal';
import GameBoard from './components/GameBoard';
import './App.css';

function GameApp() {
  const { state, startGame, confirmRole } = useGame();
  const { phase, players, humanPlayerId } = state;

  if (phase === 'setup') {
    return <Setup onStart={startGame} />;
  }

  if (phase === 'roleReveal') {
    const humanPlayer = players.find(p => p.id === humanPlayerId);
    if (!humanPlayer) return null;
    return <RoleReveal player={humanPlayer} onConfirm={confirmRole} />;
  }

  return <GameBoard />;
}

function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}

export default App;
