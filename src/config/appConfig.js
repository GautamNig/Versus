// src/config/appConfig.js
export const appConfig = {
  // Polling interval in milliseconds
  pollingInterval: 500,
  
  // Counter settings
  counter: {
    incrementInterval: 1000, // 1 second
    maxValue: 100,
    startValue: 0
  },
  
  // Celebrity settings
  celebrities: {
    defaultImageA: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    defaultImageB: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop'
  },
  
  // UI settings
  ui: {
    showPollingStatus: true,
    enableSounds: false,
    animationDuration: 300
  }
};