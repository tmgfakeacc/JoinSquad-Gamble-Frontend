import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Betting from './pages/Betting';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('gameEvent', (data) => {
      let eventMessage = '';
      switch (data.type) {
        case 'layerChange':
          eventMessage = `Map changed to ${data.data.map}`;
          break;
        case 'playerJoin':
          eventMessage = `Player Joined: ${data.data.playerName}`;
          break;
        case 'playerLeave':
          eventMessage = `Player Left: ${data.data.playerName}`;
          break;
        case 'playerDied':
          eventMessage = `Player Died: ${data.data.playerName}`;
          break;
        case 'playerRevived':
          eventMessage = `Player Revived: ${data.data.playerName}`;
          break;
        default:
          eventMessage = `Unknown event: ${data.type}`;
      }
      setLiveEvents((prevEvents) => [...prevEvents, eventMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          <Link to="/betting" style={styles.link}>
            Betting
          </Link>
          <Link to="/leaderboard" style={styles.link}>
            Leaderboard
          </Link>
          <Link to="/profile" style={styles.link}>
            Profile
          </Link>
          {isLoggedIn && (
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          )}
        </nav>

        <div style={styles.liveEventsSection}>
          <h2>Live Events</h2>
          <ul>
            {liveEvents.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        </div>

        <Routes>
          <Route
            path="/"
            element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to="/" /> : <Register setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/betting"
            element={isLoggedIn ? <Betting /> : <Navigate to="/" />}
          />
          <Route
            path="/leaderboard"
            element={isLoggedIn ? <Leaderboard /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #ddd',
  },
  link: {
    margin: '0 15px',
    textDecoration: 'none',
    color: '#007bff',
    fontSize: '18px',
  },
  logoutButton: {
    margin: '0 15px',
    background: 'none',
    border: 'none',
    color: '#007bff',
    fontSize: '18px',
  },
  liveEventsSection: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
};

export default App;