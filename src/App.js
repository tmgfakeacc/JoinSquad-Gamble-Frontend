import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Login from './pages/Login';
import Betting from './pages/Betting';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('gameEvent', (data) => {
      setEvents((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        {isLoggedIn && (
          <nav style={styles.nav}>
            <Link to="/betting" style={styles.link}>Betting</Link>
            <Link to="/leaderboard" style={styles.link}>Leaderboard</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </nav>
        )}
        <div>
          <h3>Live Events</h3>
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                {event.type}: {JSON.stringify(event.data)}
              </li>
            ))}
          </ul>
        </div>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/betting" /> : <Login onLogin={handleLogin} />}
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
    cursor: 'pointer',
  },
};

export default App;