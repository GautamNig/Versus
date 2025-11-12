// src/App.jsx
import React from 'react';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { CelebrityCounter } from './components/CelebrityCounter';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <CelebrityCounter />;
}

export default App;