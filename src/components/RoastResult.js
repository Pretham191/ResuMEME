import React, { useState } from 'react';

function RoastResult({ result }) {
  const [copySuccess, setCopySuccess] = useState('');

  if (!result || !result.result) {
    return <div>No roast available</div>;
  }

  const { result: roastData, input_type, filename, character_count } = result;

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50'; // Green
    if (score >= 60) return '#ff9800'; // Orange
    if (score >= 40) return '#ff5722'; // Red-Orange
    return '#f44336'; // Red
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🏆';
    if (score >= 80) return '👏';
    if (score >= 70) return '👍';
    if (score >= 60) return '😐';
    if (score >= 40) return '😬';
    return '💀';
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roastData.roast);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Copy failed');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const shareRoast = async () => {
    const shareText = `I got my resume roasted! 🔥\n\nMode: ${roastData.mode}\nScore: ${roastData.score}/100 ${getScoreEmoji(roastData.score)}\n\nTry it yourself at [your-app-url]`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Resume Roaster Results',
          text: shareText
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(shareText);
      alert('Share text copied to clipboard!');
    }
  };

  return (
    <div className="roast-result-container">
      {/* Header with score */}
      <div className="result-header">
        <div className="score-circle" style={{ borderColor: getScoreColor(roastData.score) }}>
          <span className="score-number" style={{ color: getScoreColor(roastData.score) }}>
            {roastData.score}
          </span>
          <span className="score-emoji">{getScoreEmoji(roastData.score)}</span>
          <span className="score-label">/ 100</span>
        </div>
        
        <div className="result-meta">
          <h2>Your Resume Got Roasted! 🔥</h2>
          <div className="meta-info">
            <span className="mode-badge">{roastData.mode}</span>
            {input_type === 'pdf' && filename && (
              <span className="file-badge">📄 {filename}</span>
            )}
            <span className="char-badge">{character_count} chars</span>
          </div>
        </div>
      </div>

      {/* Main roast content */}
      <div className="roast-content">
        <div className="roast-text">
          {roastData.roast.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="result-actions">
        <button className="action-btn copy-btn" onClick={copyToClipboard}>
          📋 {copySuccess || 'Copy Roast'}
        </button>
        
        <button className="action-btn share-btn" onClick={shareRoast}>
          🚀 Share Results
        </button>
        
        <button 
          className="action-btn download-btn" 
          onClick={() => {
            const element = document.createElement('a');
            const file = new Blob([roastData.roast], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = 'resume-roast.txt';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
        >
          💾 Download
        </button>
      </div>

      {/* Improvement suggestions */}
      <div className="improvement-section">
        <h3>🎯 Ready to improve?</h3>
        <div className="improvement-tips">
          <div className="tip">
            <span className="tip-icon">🔄</span>
            <span>Try a different roasting mode for more perspectives</span>
          </div>
          <div className="tip">
            <span className="tip-icon">✏️</span>
            <span>Update your resume and get roasted again</span>
          </div>
          <div className="tip">
            <span className="tip-icon">🎯</span>
            <span>Focus on the biggest issues mentioned above</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoastResult;