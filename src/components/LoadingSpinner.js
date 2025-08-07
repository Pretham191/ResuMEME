import React, { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
  "🔥 Preheating the roaster...",
  "👀 Reading your resume...",
  "🤔 Thinking of savage comebacks...",
  "📝 Crafting the perfect roast...",
  "🌶️ Adding extra spice...",
  "💀 Preparing devastating critique...",
  "🎯 Targeting weak spots...",
  "🔍 Finding hidden resume sins...",
  "🚀 Almost ready to destroy...",
  "⚡ Finalizing the burn..."
];

function LoadingSpinner() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through messages every 2 seconds
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    // Simulate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95; // Stop at 95% to avoid completing before actual response
        return prev + Math.random() * 10;
      });
    }, 300);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring">
          <div className="spinner-flame">🔥</div>
        </div>
        
        <div className="loading-content">
          <h3 className="loading-message">
            {LOADING_MESSAGES[messageIndex]}
          </h3>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="loading-subtext">
            This might take 10-30 seconds... good roasts take time! ⏰
          </p>
        </div>
      </div>
      
      <div className="loading-animation">
        <div className="flame-particle"></div>
        <div className="flame-particle"></div>
        <div className="flame-particle"></div>
        <div className="flame-particle"></div>
        <div className="flame-particle"></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;