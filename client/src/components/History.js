import React, { useEffect, useState } from 'react';
import { Clock, X } from 'lucide-react';
import axios from 'axios';
import './History.css';

const History = ({ showHistory, setShowHistory, handleSearch }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('https://imageexplorer-2.onrender.com/api/history', { withCredentials: true })
      .then(res => setHistory(res.data))
      .catch(() => setHistory([]));
  }, []);

  return (
    <div className={`history-panel ${showHistory ? '' : 'closed'}`}>
      <div className="history-header">
        <h3 className="history-title">
          <Clock size={18} className="history-icon" />
          Search History
        </h3>
        <button 
          onClick={() => setShowHistory(false)}
          className="close-button"
        >
          <X size={18} />
        </button>
      </div>
      {history.length > 0 ? (
        <ul className="history-list">
          {history.map((h, index) => (
            <li key={index} className="history-item">
              <button 
                onClick={() => {
                  handleSearch(h.term);
                  setShowHistory(false);
                }}
                className="history-button2"
              >
                <div className="history-term">{h.term}</div>
                <div className="history-timestamp">
                  {new Date(h.timestamp).toLocaleString()}
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-history">No search history yet</p>
      )}
    </div>
  );
};

export default History;