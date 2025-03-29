import React from 'react';

function Home({ isLoggedIn, setIsLoggedIn }) {
  return (
    <div>
      <h1>Welcome to the Gambling App</h1>
      {!isLoggedIn && (
        <p>Please <a href="/login">log in</a> or <a href="/register">register</a> to start betting.</p>
      )}
    </div>
  );
}

export default Home;