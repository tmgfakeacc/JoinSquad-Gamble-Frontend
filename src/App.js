import React, { useState } from 'react';
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
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    if (!isConnected) {
      setIsLoading(true);
      const newSocket = io('http://localhost:5000');

      newSocket.on('connect', () => {
        setIsConnected(true);
        setIsLoading(false);
      });

      newSocket.on('gameEvent', (data) => {
        let eventMessage = '';
        switch (data.type) {
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
          case 'layerChange':
            eventMessage = `Map Changed to ${data.data.map}`;
            break;
          default:
            eventMessage = `Unknown event: ${data.type}`;
        }
        setLiveEvents((prevEvents) => [...prevEvents, eventMessage]);
      });

      setSocket(newSocket);
    }
  };

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

        {!isConnected && (
          <button onClick={handleConnect} style={styles.connectButton} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect to Live Events'}
          </button>
        )}

        {isLoading && <div style={styles.loadingBar}></div>}

        <div style={styles.liveEventsSection}>
          <h2>Live Events</h2>
          {isConnected && liveEvents.length === 0 ? (
            <p>Waiting for events...</p>
          ) : (
            <ul>
              {liveEvents.map((event, index) => (
                <li key={index}>{event}</li>
              ))}
            </ul>
          )}
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
    justifyContent: 'space-around',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #ddd',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    fontSize: '16px',
  },
  logoutButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  connectButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  loadingBar: {
    height: '4px',
    backgroundColor: '#007bff',
    width: '0%',
    animation: 'loading 2s linear infinite',
    marginBottom: '20px',
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