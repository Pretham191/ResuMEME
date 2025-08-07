import React, { useState } from 'react';

function TextInput({ onSubmit, loading }) {
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length < 50) {
      alert('Please provide a more detailed resume (at least 50 characters)');
      return;
    }
    onSubmit(text.trim());
  };

  const getCharCountColor = () => {
    if (charCount < 50) return '#ff4444';
    if (charCount < 200) return '#ffaa00';
    return '#44ff44';
  };

  return (
    <div className="text-input-container">
      <form onSubmit={handleSubmit}>
        <div className="textarea-wrapper">
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Paste your resume text here... Don't hold back, we can handle the truth! 🔥

Example:
John Doe
Software Developer
Experience:
- Built awesome apps
- Coded all day
- Fixed bugs (sometimes created them too)

Education:
- Computer Science Degree
- Stack Overflow University (Honorary PhD)

Skills:
- JavaScript, React, Node.js
- Coffee consumption
- Googling error messages"
            className="resume-textarea"
            rows="15"
            disabled={loading}
          />
          
          <div className="textarea-footer">
            <div 
              className="char-counter"
              style={{ color: getCharCountColor() }}
            >
              {charCount} characters {charCount < 50 && '(minimum 50)'}
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || charCount < 50}
        >
          {loading ? (
            <>
              <span className="spinner">⏳</span>
              Roasting in progress...
            </>
          ) : (
            <>
              🔥 Roast My Resume
            </>
          )}
        </button>
      </form>

      <div className="text-input-tips">
        <h4>💡 Pro tips:</h4>
        <ul>
          <li>Include contact info, experience, education, and skills</li>
          <li>The more detail you provide, the more savage the roast 😈</li>
          <li>Copy-paste from Word/Google Docs works perfectly</li>
        </ul>
      </div>
    </div>
  );
}

export default TextInput;
            