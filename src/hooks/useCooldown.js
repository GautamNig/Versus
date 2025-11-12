// src/hooks/useCooldown.js
import { useState, useEffect } from 'react';
import { appConfig } from '../config/appConfig';

export const useCooldown = (initialCooldown = appConfig.switchCooldown) => {
  const [cooldown, setCooldown] = useState(0);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  useEffect(() => {
    let intervalId;

    if (cooldown > 0) {
      setIsOnCooldown(true);
      intervalId = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            setIsOnCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setIsOnCooldown(false);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [cooldown]);

  const startCooldown = (customCooldown = initialCooldown) => {
    setCooldown(customCooldown);
    setIsOnCooldown(true);
  };

  const resetCooldown = () => {
    setCooldown(0);
    setIsOnCooldown(false);
  };

  return {
    cooldown,
    isOnCooldown,
    startCooldown,
    resetCooldown
  };
};