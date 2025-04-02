import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Betting() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [predictedWinner, setPredictedWinner] = useState('');
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/matches');
        setMatches(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/bets', {
        userId: 1, // Replace with actual user ID
        matchId: selectedMatch,
        amount,
        predictedWinner,
      });
      setMessage(`Bet placed successfully! Bet ID: ${response.data.betId}`);
    } catch (err) {
      setMessage('Failed to place bet. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Place a Bet</h1>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label>Select Match:</label>
          <select value={selectedMatch} onChange={(e) => setSelectedMatch(e.target.value)} required>
            <option value="">Select a match</option>
            {matches.map((match) => (
              <option key={match.id} value={match.id}>
                {match.team1} vs {match.team2} on {match.map}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label>Predicted Winner:</label>
          <select value={predictedWinner} onChange={(e) => setPredictedWinner(e.target.value)} required>
            <option value="">Select a team</option>
            {selectedMatch && (
              <>
                <option value={matches.find((m) => m.id === selectedMatch).team1}>
                  {matches.find((m) => m.id === selectedMatch).team1}
                </option>
                <option value={matches.find((m) => m.id === selectedMatch).team2}>
                  {matches.find((m) => m.id === selectedMatch).team2}
                </option>
              </>
            )}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={styles.submitButton}>Place Bet</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Betting;