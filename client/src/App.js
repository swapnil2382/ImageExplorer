import React, { useEffect, useState } from 'react';
import { Search, User, X } from 'lucide-react';
import axios from 'axios';
import Navbar from './components/Navbar';
import TopSearchesBanner from './components/TopSearchesBanner';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import History from './components/History';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch user data
    axios.get('https://imageexplorer-2.onrender.com/auth/user', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleSearch = async (term) => {
    if (!term.trim()) return;
    setSearchTerm(term);
    setIsLoading(true);
    try {
      const response = await axios.post('https://imageexplorer-2.onrender.com/api/search', 
        { term },
        { withCredentials: true }
      );
      setImages(response.data);
      setSelectedImages([]);
    } catch (err) {
      console.error('Search failed:', err);
      alert('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (url) => {
    setSelectedImages(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const clearSelected = () => {
    setSelectedImages([]);
  };

  return (
    <div className="app-container">
      <Navbar user={user} showHistory={showHistory} setShowHistory={setShowHistory} />
      <TopSearchesBanner handleSearch={handleSearch} />
      
      {user ? (
        <>
          <SearchBar handleSearch={handleSearch} />
          
          {(searchTerm || selectedImages.length > 0) && (
            <div className="results-bar">
              {searchTerm && (
                <div className="results-info">
                  <span className="font-medium">{images.length}</span> results for "<span className="font-medium">{searchTerm}</span>"
                </div>
              )}
              {selectedImages.length > 0 && (
                <div className="selection-controls">
                  <span className="selection-count">
                    <span className="font-medium">{selectedImages.length}</span> selected
                  </span>
                  <button 
                    onClick={clearSelected}
                    className="clear-selection"
                  >
                    <X size={14} className="clear-icon" />
                    Clear selection
                  </button>
                </div>
              )}
            </div>
          )}
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            images.length > 0 ? (
              <ImageGrid 
                images={images} 
                selectedImages={selectedImages}
                toggleSelect={toggleSelect}
              />
            ) : searchTerm ? (
              <div className="no-results">
                <p className="no-results-title">No images found for "{searchTerm}"</p>
                <p className="no-results-suggestion">Try different keywords or explore trending searches</p>
              </div>
            ) : (
              <div className="start-search">
                <Search size={48} className="start-search-icon" />
                <p className="start-search-text">Search for images to get started</p>
              </div>
            )
          )}
          
          <History showHistory={showHistory} setShowHistory={setShowHistory} handleSearch={handleSearch} />
        </>
      ) : (
        <div className="welcome-container">
          <div className="welcome-card">
            <Search size={64} className="welcome-icon" />
            <h2 className="welcome-title">Welcome to ImageExplorer</h2>
            <p className="welcome-text">
              Discover and collect beautiful images from around the web.
              Please log in to start your visual journey.
            </p>
            <a 
              href="https://imageexplorer-2.onrender.com/auth/google"
              className="login-button"
            >
              <User size={18} className="login-icon" />
              Login with Google
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;