// src/components/WinnerCelebration.jsx
import React, { useEffect, useState } from 'react';
import './WinnerCelebration.css';

export const WinnerCelebration = ({ winner, onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (winner) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 1000);
      }, 5000); // Show celebration for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [winner, onComplete]);

  if (!visible || !winner) return null;

  return (
    <div className="winner-celebration">
      <div className="celebration-content">
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        
        <h1 className="winner-title">🎉 WE HAVE A WINNER! 🎉</h1>
        <div className="winner-name">{winner.name} WINS!</div>
        <div className="trophy">🏆</div>
        <p className="celebration-message">Congratulations to all supporters!</p>
      </div>
    </div>
  );
};