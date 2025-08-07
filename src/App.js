import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import TextInput from './components/TextInput';
import ModeSelector from './components/ModeSelector';
import RoastResult from './components/RoastResult';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState('smart-critic');
  const [inputType, setInputType] = useState('text'); // 'text' or 'file'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch available modes on component mount
  useEffect(() => {
    fetchModes();
  }, []);

  const fetchModes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/roast/modes`);
      setModes(response.data.modes);
    } catch (err) {
      console.error('Failed to fetch modes:', err);
      setError('Failed to load roasting modes');
    }
  };

  const handleTextSubmit = async (text) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE}/roast/text`, {
        text,
        mode: selectedMode
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to roast resume');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('mode', selectedMode);

    try {
      const response = await axios.post(`${API_BASE}/roast/pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to roast resume');
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            🔥 Resume Roaster
          </h1>
          <p className="app-subtitle">
            Get brutally honest feedback on your resume. Choose your pain level below.
          </p>
        </div>
      </header>

      <main className="app-main">
        {!result ? (
          <div className="input-section">
            {/* Mode Selector */}
            <ModeSelector 
              modes={modes}
              selectedMode={selectedMode}
              onModeChange={setSelectedMode}
            />

            {/* Input Type Toggle */}
            <div className="input-toggle">
              <button
                className={`toggle-btn ${inputType === 'text' ? 'active' : ''}`}
                onClick={() => setInputType('text')}
              >
                📝 Paste Text
              </button>
              <button
                className={`toggle-btn ${inputType === 'file' ? 'active' : ''}`}
                onClick={() => setInputType('file')}
              >
                📄 Upload PDF
              </button>
            </div>

            {/* Input Components */}
            {inputType === 'text' ? (
              <TextInput onSubmit={handleTextSubmit} loading={loading} />
            ) : (
              <FileUpload onUpload={handleFileUpload} loading={loading} />
            )}

            {/* Error Display */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Loading Spinner */}
            {loading && <LoadingSpinner />}
          </div>
        ) : (
          <div className="result-section">
            <RoastResult result={result} />
            <button className="reset-btn" onClick={resetApp}>
              🔄 Roast Another Resume
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with 🔥 and powered by Groq AI</p>
        <p className="disclaimer">
          * This is for entertainment and educational purposes. Please take feedback constructively!
        </p>
      </footer>
    </div>
  );
}

export default App;