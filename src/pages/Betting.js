import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

function Betting() {
  const [currentMap, setCurrentMap] = useState('');
  const [teams, setTeams] = useState({ team1: '', team2: '' });

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('gameEvent', (data) => {
      if (data.type === 'layerChange') {
        setCurrentMap(data.data.map);
        setTeams({ team1: data.data.team1, team2: data.data.team2 });
        console.log('Received gameEvent:', data); // Add this line
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={styles.container}>
      <h2>Betting</h2>
      <div style={styles.teamsSection}>
        <h3>Current Round</h3>
        <p><strong>Map:</strong> {currentMap}</p>
        <p><strong>Teams:</strong> {teams.team1} vs {teams.team2}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  teamsSection: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
};

export default Betting;