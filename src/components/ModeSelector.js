import React from 'react';

const MODE_DESCRIPTIONS = {
  'smart-critic': {
    description: 'Professional but direct feedback from an experienced career advisor',
    intensity: '🌶️',
    color: '#4285f4'
  },
  'sarcastic-mentor': {
    description: 'Witty roasts with genuine advice - like a brutally honest friend',
    intensity: '🌶️🌶️',
    color: '#ff9800'
  },
  'ruthless-hr': {
    description: 'No mercy from an overworked HR manager who\'s seen it all',
    intensity: '🌶️🌶️🌶️',
    color: '#f44336'
  },
  'meme-lord': {
    description: 'Internet culture meets resume review - prepare for viral-worthy roasts',
    intensity: '🌶️🌶️🌶️🌶️',
    color: '#9c27b0'
  }
};

function ModeSelector({ modes, selectedMode, onModeChange }) {
  if (modes.length === 0) {
    return (
      <div className="mode-selector-loading">
        <span>Loading roasting modes... 🔥</span>
      </div>
    );
  }

  return (
    <div className="mode-selector-container">
      <h2 className="mode-selector-title">Choose Your Roasting Style</h2>
      <p className="mode-selector-subtitle">
        How much truth can you handle? 🔥
      </p>

      <div className="mode-grid">
        {modes.map((mode) => {
          const modeData = MODE_DESCRIPTIONS[mode.id] || {};
          const isSelected = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              className={`mode-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onModeChange(mode.id)}
              style={{
                borderColor: isSelected ? modeData.color : 'transparent'
              }}
            >
              <div className="mode-header">
                <h3 className="mode-name">{mode.name}</h3>
                <div className="mode-intensity">
                  {modeData.intensity || '🌶️'}
                </div>
              </div>
              
              <p className="mode-description">
                {modeData.description || 'Professional resume feedback'}
              </p>
              
              {isSelected && (
                <div className="selected-indicator">
                  <span>✓ Selected</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="roasting-intensity-guide">
        <h4>🌶️ Roasting Intensity Guide:</h4>
        <div className="intensity-levels">
          <span>🌶️ Gentle</span>
          <span>🌶️🌶️ Moderate</span>
          <span>🌶️🌶️🌶️ Spicy</span>
          <span>🌶️🌶️🌶️🌶️ Nuclear</span>
        </div>
      </div>
    </div>
  );
}

export default ModeSelector;