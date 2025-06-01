//PlayerPanel.jsx

import React, { useState } from "react";

function PlayerPanel({
  name,
  score,
  reached,
  reversed,
  onReach,
  onRequestCancel,
  onWin,
  isDealer,
  onNameChange,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputName, setInputName] = useState(name);

  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleNameSubmit = () => {
    setIsEditing(false);
    if (inputName.trim() && onNameChange) {
      onNameChange(inputName.trim());
    }
  };

  return (
    <div className={`player-panel ${reversed ? "reversed" : ""}`}>
      <div className="player-info">
        {isEditing ? (
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleNameSubmit();
            }}
            autoFocus
          />
        ) : (
          <span
            className={`player-name ${isDealer ? "dealer" : ""}`}
            onClick={handleNameClick}
          >
            {name}
          </span>
        )}
        <span className="player-score">{score} 点</span>
      </div>

      <div className="button-row">
        {reached ? (
          <button onClick={onRequestCancel}>リーチ取消</button>
        ) : (
          <button onClick={onReach}>リーチ</button>
        )}
        <button onClick={onWin}>和了</button>
      </div>
    </div>
  );
}

export default PlayerPanel;
