// src/components/CelebrityCounter.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCelebrityCounter } from '../hooks/useCelebrityCounter';
import { useCounterIncrement } from '../hooks/useCounterIncrement';
import { useCooldown } from '../hooks/useCooldown';
import { FirstTimeModal } from './FirstTimeModal';
import { PollingStatus } from './PollingStatus';
import { WinnerCelebration } from './WinnerCelebration';
import './CelebrityCounter.css';

export const CelebrityCounter = () => {
  const { user, signOut } = useAuth();
  const { 
    celebrities, 
    counters, 
    activeCelebrity, 
    loading, 
    switchCounter,
    checkIfFirstTimeUser,
    handleFirstTimeSelection,
    hasUserSelected
  } = useCelebrityCounter();
  
  useCounterIncrement();
  
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [showWinnerCelebration, setShowWinnerCelebration] = useState(false);
  const [winner, setWinner] = useState(null);
  
  // Add cooldown hook
  const { cooldown, isOnCooldown, startCooldown } = useCooldown();

  useEffect(() => {
    if (!loading && checkIfFirstTimeUser()) {
      setShowFirstTimeModal(true);
    }
  }, [loading, checkIfFirstTimeUser]);

  const handleSwitchCounter = async () => {
    if (celebrities.length < 2 || isOnCooldown) return;

    const currentActive = activeCelebrity;
    const celebA = celebrities[0];
    const celebB = celebrities[1];
    
    const newActiveId = currentActive === celebA.id ? celebB.id : celebA.id;
    
    // Start cooldown before making the API call
    startCooldown();
    
    await switchCounter(newActiveId);
  };

  const handleModalSelection = async (celebrityId) => {
    await handleFirstTimeSelection(celebrityId);
    setShowFirstTimeModal(false);
  };

  const getButtonText = () => {
    if (!activeCelebrity) return 'Start Counter';
    
    if (isOnCooldown) {
      return `Cooldown: ${cooldown}s`;
    }
    
    const activeCeleb = celebrities.find(c => c.id === activeCelebrity);
    const otherCeleb = celebrities.find(c => c.id !== activeCelebrity);
    
    return `Switch to ${otherCeleb?.name || 'Other'}`;
  };

  const getActiveCelebrity = () => {
    return celebrities.find(c => c.id === activeCelebrity);
  };

  const isGameOver = () => {
    return Object.values(counters).some(counter => 
      counter && counter.current_value >= counter.max_value
    );
  };

  useEffect(() => {
    const gameOver = isGameOver();
    if (gameOver && !showWinnerCelebration) {
      const winningCelebrity = getActiveCelebrity();
      if (winningCelebrity) {
        setWinner(winningCelebrity);
        setShowWinnerCelebration(true);
      }
    }
  }, [counters, showWinnerCelebration, getActiveCelebrity]);

  if (loading) {
    return (
      <div className="celebrity-counter loading">
        <div className="loading-spinner">Loading celebrities...</div>
      </div>
    );
  }

  if (celebrities.length < 2) {
    return (
      <div className="celebrity-counter error">
        <h2>Setup Required</h2>
        <p>Please make sure you have at least 2 celebrities in the database.</p>
      </div>
    );
  }

  const celebA = celebrities[0];
  const celebB = celebrities[1];
  const counterA = counters[celebA.id];
  const counterB = counters[celebB.id];
  const gameOver = isGameOver();

  return (
    <div className="celebrity-counter">
      <header className="app-header">
        <h1>Celebrity Counter</h1>
        <div className="user-info">
          <span>Welcome, {user?.email}</span>
          <button onClick={signOut} className="sign-out-btn">Sign Out</button>
        </div>
      </header>

      <div className="counter-container">
        {/* Celebrity A */}
        <div className={`celebrity-side ${activeCelebrity === celebA.id ? 'active' : ''}`}>
          <div className="celebrity-image">
            <img src={celebA.image_url} alt={celebA.name} />
          </div>
          <div className="celebrity-info">
            <h2>{celebA.name}</h2>
            <div className="counter-display">
              <span className="counter-value">
                {counterA?.current_value || 0}
              </span>
              <span className="counter-max">/ {counterA?.max_value || 100}</span>
            </div>
            {activeCelebrity === celebA.id && (
              <div className="counting-indicator">Counting... 🟢</div>
            )}
            {gameOver && counterA?.current_value >= counterA?.max_value && (
              <div className="winner-badge">🏆 WINNER!</div>
            )}
          </div>
        </div>

        {/* Center Button */}
        <div className="center-controls">
          <button 
            onClick={handleSwitchCounter}
            disabled={gameOver || showFirstTimeModal || isOnCooldown}
            className={`switch-button ${gameOver ? 'game-over' : ''} ${isOnCooldown ? 'cooldown' : ''}`}
          >
            {gameOver ? 'Game Over!' : getButtonText()}
          </button>
          {isOnCooldown && (
            <div className="cooldown-message">
              Please wait {cooldown} seconds before switching again
            </div>
          )}
          {gameOver && (
            <div className="winner-message">
              {getActiveCelebrity()?.name} Wins! 🎉
            </div>
          )}
        </div>

        {/* Celebrity B */}
        <div className={`celebrity-side ${activeCelebrity === celebB.id ? 'active' : ''}`}>
          <div className="celebrity-image">
            <img src={celebB.image_url} alt={celebB.name} />
          </div>
          <div className="celebrity-info">
            <h2>{celebB.name}</h2>
            <div className="counter-display">
              <span className="counter-value">
                {counterB?.current_value || 0}
              </span>
              <span className="counter-max">/ {counterB?.max_value || 100}</span>
            </div>
            {activeCelebrity === celebB.id && (
              <div className="counting-indicator">Counting... 🟢</div>
            )}
            {gameOver && counterB?.current_value >= counterB?.max_value && (
              <div className="winner-badge">🏆 WINNER!</div>
            )}
          </div>
        </div>
      </div>

      <FirstTimeModal 
        isOpen={showFirstTimeModal}
        celebrities={celebrities}
        onSelect={handleModalSelection}
      />

      <WinnerCelebration 
        winner={winner}
        onComplete={() => setShowWinnerCelebration(false)}
      />

      <PollingStatus />
    </div>
  );
};