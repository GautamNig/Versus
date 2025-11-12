// src/components/PiggyBankFixed.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Rive } from '@rive-app/canvas';

export const PiggyBankFixed = ({ 
  shouldAnimate = false,
  onAnimationComplete 
}) => {
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let riveInstance;

    const loadRive = async () => {
      try {
        console.log('🔄 Loading Rive animation...');
        
        riveInstance = new Rive({
          src: '../assets/11117-21288-piggy-bank.riv',
          canvas: canvasRef.current,
          stateMachines: 'State Machine 1',
          autoplay: true,
          onLoad: () => {
            console.log('✅ Rive animation loaded successfully!');
            setIsLoaded(true);
            setError(null);
            riveRef.current = riveInstance;
          },
          onLoadError: (err) => {
            console.error('❌ Rive load error:', err);
            setError(err.message);
          },
        });
      } catch (err) {
        console.error('❌ Error initializing Rive:', err);
        setError(err.message);
      }
    };

    if (canvasRef.current) {
      loadRive();
    }

    return () => {
      if (riveInstance) {
        console.log('🧹 Cleaning up Rive instance');
        riveInstance.stop();
        riveInstance.cleanup();
      }
    };
  }, []);

  // Trigger animation
  useEffect(() => {
    if (shouldAnimate && riveRef.current && isLoaded) {
      console.log('🎯 Firing click event on Rive animation');
      
      try {
        const inputs = riveRef.current.stateMachineInputs('State Machine 1');
        console.log('Available inputs:', inputs);
        
        const clickInput = inputs?.find(input => input.name === 'click');
        if (clickInput) {
          clickInput.fire();
          console.log('✅ Click event fired successfully');
        } else {
          console.warn('⚠️ Click input not found in state machine');
        }

        if (onAnimationComplete) {
          setTimeout(() => {
            onAnimationComplete();
          }, 2000);
        }
      } catch (err) {
        console.error('❌ Error triggering animation:', err);
      }
    }
  }, [shouldAnimate, isLoaded, onAnimationComplete]);

  if (error) {
    return (
      <div style={{ 
        width: '200px', 
        height: '200px', 
        background: 'rgba(255,0,0,0.1)',
        border: '2px dashed red',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        borderRadius: '10px',
        padding: '10px',
        textAlign: 'center'
      }}>
        <div>❌ Rive Error</div>
        <div style={{ fontSize: '12px', marginTop: '5px' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100px', 
      height: '100px',
      background: isLoaded ? 'transparent' : 'rgba(255,255,255,0.05)',
      border: isLoaded ? 'none' : '2px dashed #666',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <canvas
        ref={canvasRef}
        style={{ 
          width: '100%', 
          height: '100%',
          display: isLoaded ? 'block' : 'none'
        }}
      />
      
      {!isLoaded && !error && (
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div>Loading Piggy Bank...</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>Using Canvas</div>
        </div>
      )}
      
      {isLoaded && (
        <div style={{
          position: 'absolute',
          bottom: '5px',
          right: '5px',
          background: 'rgba(0,0,0,0.7)',
          color: 'lime',
          fontSize: '10px',
          padding: '2px 5px',
          borderRadius: '3px'
        }}>
          ✅ Loaded
        </div>
      )}
    </div>
  );
};