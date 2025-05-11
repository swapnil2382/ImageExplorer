import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopSearchesBanner.css';

const TopSearchesBanner = ({ handleSearch }) => {
  const [top, setTop] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/top-searches', { withCredentials: true })
      .then(res => setTop(res.data))
      .catch(err => {
        console.error('Failed to fetch top searches:', err);
        setTop([]);
      });
  }, []);

  return (
    <div className="top-searches">
      
    </div>
  );
};

export default TopSearchesBanner;
