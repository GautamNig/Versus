// src/hooks/useCounterAnimation.js
import { useEffect, useRef, useState } from 'react';

export const useCounterAnimation = (counterValue, celebrityId) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const prevCounterRef = useRef(counterValue);

  useEffect(() => {
    // Check if counter increased
    if (counterValue > prevCounterRef.current) {
      console.log(`Counter increased for ${celebrityId}: ${prevCounterRef.current} -> ${counterValue}`);
      setShouldAnimate(true);
      
      // Reset animation flag after a short delay
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
    
    // Update previous counter value
    prevCounterRef.current = counterValue;
  }, [counterValue, celebrityId]);

  const handleAnimationComplete = () => {
    setShouldAnimate(false);
  };

  return {
    shouldAnimate,
    handleAnimationComplete
  };
};