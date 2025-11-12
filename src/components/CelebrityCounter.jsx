// src/components/CelebrityCounter.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCelebrityCounter } from '../hooks/useCelebrityCounter';
import { useCounterIncrement } from '../hooks/useCounterIncrement';
import { useCooldown } from '../hooks/useCooldown';
import { useCounterAnimation } from '../hooks/useCounterAnimation';
import { FirstTimeModal } from './FirstTimeModal';
import { PiggyBankFixed } from './PiggyBankFixed';
import { CoinAnimation } from './CoinAnimation';
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
  const [useFallbackAnimation, setUseFallbackAnimation] = useState(false);
  
  const { cooldown, isOnCooldown, startCooldown } = useCooldown();

  useEffect(() => {
    if (!loading && checkIfFirstTimeUser()) {
      setShowFirstTimeModal(true);
    }
  }, [loading, checkIfFirstTimeUser]);

  // Get celebrity data
  const celebA = celebrities[0];
  const celebB = celebrities[1];
  const counterA = counters[celebA?.id];
  const counterB = counters[celebB?.id];

  // Set up animations for both celebrities
  const { shouldAnimate: shouldAnimateA, handleAnimationComplete: handleAnimationCompleteA } = 
    useCounterAnimation(counterA?.current_value || 0, 'celebrityA');
  
  const { shouldAnimate: shouldAnimateB, handleAnimationComplete: handleAnimationCompleteB } = 
    useCounterAnimation(counterB?.current_value || 0, 'celebrityB');

  const handleSwitchCounter = async () => {
    if (celebrities.length < 2 || isOnCooldown) return;

    const currentActive = activeCelebrity;
    const celebA = celebrities[0];
    const celebB = celebrities[1];
    
    const newActiveId = currentActive === celebA.id ? celebB.id : celebA.id;
    
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
      return `${cooldown}s`;
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

  // Switch to fallback after 5 seconds if Rive doesn't load
  useEffect(() => {
    const timer = setTimeout(() => {
      setUseFallbackAnimation(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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

  const gameOver = isGameOver();

  return (
    <div className="celebrity-counter">
      <header className="app-header">
        <h1>Celebrity Counter</h1>
        <div className="user-info">
          <span className="user-email">{user?.email}</span>
          <button onClick={signOut} className="sign-out-btn">Sign Out</button>
        </div>
      </header>

      <div className="counter-container-two-column">
        {/* Left Column - Celebrity A */}
        <div className={`celebrity-column left-column ${activeCelebrity === celebA.id ? 'active' : ''}`}>
          <div className="celebrity-content-column">
<div className={`celebrity-image-large ${activeCelebrity === celebA.id ? 'active-glow' : ''}`}>
  <img src={celebA.image_url} alt={celebA.name} />
  {activeCelebrity === celebA.id && (
    <div className="counting-badge">LIVE</div>
  )}
</div>
            
            <div className="celebrity-info-column">
              <h2 className="celebrity-name-large">{celebA.name}</h2>
              
              <div className="counter-display-column">
                <span className="counter-value-large">
                  {counterA?.current_value || 0}
                </span>
                <span className="counter-max-medium">/ {counterA?.max_value || 100}</span>
              </div>
              
              {/* Animation */}
              <div className="animation-medium">
                {useFallbackAnimation ? (
                  <CoinAnimation shouldAnimate={shouldAnimateA} />
                ) : (
                  <PiggyBankFixed 
                    shouldAnimate={shouldAnimateA}
                    onAnimationComplete={handleAnimationCompleteA}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Celebrity B */}
        <div className={`celebrity-column right-column ${activeCelebrity === celebB.id ? 'active' : ''}`}>
          <div className="celebrity-content-column">
    <div className={`celebrity-image-large ${activeCelebrity === celebB.id ? 'active-glow' : ''}`}>
  <img src={celebB.image_url} alt={celebB.name} />
  {activeCelebrity === celebB.id && (
    <div className="counting-badge">LIVE</div>
  )}
</div>
            
            <div className="celebrity-info-column">
              <h2 className="celebrity-name-large">{celebB.name}</h2>
              
              <div className="counter-display-column">
                <span className="counter-value-large">
                  {counterB?.current_value || 0}
                </span>
                <span className="counter-max-medium">/ {counterB?.max_value || 100}</span>
              </div>
              
              {/* Animation */}
              <div className="animation-medium">
                {useFallbackAnimation ? (
                  <CoinAnimation shouldAnimate={shouldAnimateB} />
                ) : (
                  <PiggyBankFixed 
                    shouldAnimate={shouldAnimateB}
                    onAnimationComplete={handleAnimationCompleteB}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Controls Overlay */}
      <div className="center-controls-overlay">
        <button 
          onClick={handleSwitchCounter}
          disabled={gameOver || showFirstTimeModal || isOnCooldown}
          className={`switch-button-center ${gameOver ? 'game-over' : ''} ${isOnCooldown ? 'cooldown' : ''}`}
        >
          {gameOver ? 'Game Over!' : getButtonText()}
        </button>
        
        {isOnCooldown && (
          <div className="cooldown-message-center">
            Wait {cooldown}s before switching
          </div>
        )}
        
        {gameOver && (
          <div className="winner-message-center">
            🎉 {getActiveCelebrity()?.name} Wins! 🎉
          </div>
        )}
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

    </div>
  );
};