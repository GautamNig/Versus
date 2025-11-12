// src/components/RiveAnimation.jsx
import React, { useEffect, useRef } from 'react';

export const RiveAnimation = ({ 
  src, 
  artboard, 
  stateMachine, 
  autoplay = true,
  onLoad 
}) => {
  const canvasRef = useRef(null);
  const riveInstanceRef = useRef(null);

  useEffect(() => {
    // This is a placeholder for Rive animation integration
    // We'll replace this with actual Rive SDK integration
    console.log('Rive animation would load:', { src, artboard, stateMachine });
    
    if (onLoad) {
      onLoad();
    }

    // Cleanup function
    return () => {
      if (riveInstanceRef.current) {
        // Clean up Rive instance
        console.log('Cleaning up Rive animation');
      }
    };
  }, [src, artboard, stateMachine, autoplay, onLoad]);

  return (
    <div className="rive-animation">
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%' }}
      />
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        color: '#666',
        fontSize: '14px'
      }}>
        Rive Animation Ready
      </div>
    </div>
  );
};