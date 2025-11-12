// src/components/FirstTimeModal.jsx
import React from 'react';
import './FirstTimeModal.css';

export const FirstTimeModal = ({ isOpen, celebrities, onSelect }) => {
  const [selectedCelebrity, setSelectedCelebrity] = React.useState(null);

  const handleConfirmSelection = () => {
    if (selectedCelebrity) {
      onSelect(selectedCelebrity);
    }
  };

  const handleCelebrityClick = (celebrityId) => {
    setSelectedCelebrity(celebrityId);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome! 🎉</h2>
        <p>You're the first supporter! Choose which celebrity you want to start supporting:</p>
        
        <div className="selection-buttons">
          {celebrities.map(celebrity => (
            <button
              key={celebrity.id}
              onClick={() => handleCelebrityClick(celebrity.id)}
              className={`celebrity-select-btn ${selectedCelebrity === celebrity.id ? 'selected' : ''}`}
            >
              <img src={celebrity.image_url} alt={celebrity.name} />
              <span>{celebrity.name}</span>
            </button>
          ))}
        </div>
        
        <div className="modal-actions">
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedCelebrity}
            className="confirm-button"
          >
            Start Supporting {selectedCelebrity ? celebrities.find(c => c.id === selectedCelebrity)?.name : ''}
          </button>
        </div>
        
        <p className="modal-note">
          After your selection, the counter will start for your chosen celebrity and other users can switch between them!
        </p>
      </div>
    </div>
  );
};