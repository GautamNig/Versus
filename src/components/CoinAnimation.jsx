// src/components/CoinAnimation.jsx
import React, { useEffect, useState } from 'react';

export const CoinAnimation = ({ shouldAnimate }) => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    if (shouldAnimate) {
      // Add a new coin to the animation
      const newCoin = {
        id: Date.now() + Math.random(),
        top: -10,
        left: Math.random() * 40 + 20, // Random position within 60px width
      };
      
      setCoins(prev => [...prev, newCoin]);

      // Remove the coin after animation completes
      setTimeout(() => {
        setCoins(prev => prev.filter(coin => coin.id !== newCoin.id));
      }, 1500);
    }
  }, [shouldAnimate]);

  return (
    <div style={{
      width: '140px',
      height: '140px',
      position: 'relative',
      background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
      borderRadius: '50%',
      border: '3px solid #D2691E',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)',
      overflow: 'hidden'
    }}>
      {/* Piggy Bank Body */}
      <div style={{
        position: 'absolute',
        top: '25%',
        width: '100%',
        textAlign: 'center',
        fontSize: '1.8rem',
        zIndex: 2
      }}>
        🐷
      </div>
      
      {/* Coin Slot */}
      <div style={{
        position: 'absolute',
        top: '12%',
        width: '25px',
        height: '5px',
        background: '#333',
        borderRadius: '3px'
      }}></div>
      
      {/* Falling Coins */}
      {coins.map(coin => (
        <div
          key={coin.id}
          style={{
            position: 'absolute',
            top: `${coin.top}px`,
            left: `${coin.left}px`,
            fontSize: '1rem',
            animation: 'coinFall 1.5s ease-in forwards',
            zIndex: 3
          }}
        >
          💰
        </div>
      ))}
      
      {/* Piggy Bank Label */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        color: 'white',
        fontSize: '0.5rem',
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
      }}>
        PIGGY BANK
      </div>
    </div>
  );
};