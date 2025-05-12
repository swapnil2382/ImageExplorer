import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopSearchesBanner.css';

const TopSearchesBanner = ({ handleSearch }) => {
  const [top, setTop] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setTop([]);
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/top-searches`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTop(res.data))
      .catch((err) => {
        console.error('Failed to fetch top searches:', err);
        setTop([]);
      });
  }, []);

  return (
    <div className="top-searches">
      {top.length > 0 && (
        <div className="top-searches-list">
          {top.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSearch(search.term)}
              className="top-search-item"
            >
              {search.term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopSearchesBanner;