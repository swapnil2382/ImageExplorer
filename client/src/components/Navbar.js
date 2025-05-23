import React from 'react';
import { Search, User, LogOut, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, showHistory, setShowHistory }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`);
      localStorage.removeItem('token');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Search size={24} />
          <span className="navbar-title">ImageExplorer</span>
        </div>

        {user ? (
          <div className="navbar-user">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="history-button"
            >
              <Clock size={16} />
              <span>History</span>
            </button>

            <div className="user-info">
              <User size={16} />
              <span>{user.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="logout-button"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <a
            href={`${process.env.REACT_APP_API_URL}/auth/google`}
            className="login-button"
          >
            Login with Google
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;