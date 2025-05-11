import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ handleSearch }) => {
  const [term, setTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      handleSearch(term.trim());
      setTerm('');
    }
  };

  return (
    <div className="search-bar">
      <div className="search-form">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search for images..."
          className="search-input"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && term.trim()) {
              handleSearch(term.trim());
              setTerm('');
            }
          }}
        />
        <button
          onClick={() => {
            if (term.trim()) {
              handleSearch(term.trim());
              setTerm('');
            }
          }}
          className="search-button"
        >
          <Search size={18} />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
