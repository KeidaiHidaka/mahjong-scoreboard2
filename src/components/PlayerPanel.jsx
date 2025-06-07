// src/components/PlayerPanel.jsx

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

  const panelClasses = [
    "panel",
    "panel--player",
    "player-panel",
    reversed ? "panel--reversed" : "",
    reached ? "panel--reached" : "",
    isDealer ? "panel--dealer" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={panelClasses}>
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
            className={`player-panel__name ${isDealer ? "player-panel__name--dealer" : ""}`}
            onClick={handleNameClick}
          >
            {name}
          </span>
        )}
        <span className="player-panel__score">{score} 点</span>
      </div>

      <div className="player-panel__buttons">
        {reached ? (
          <button className="btn btn--light" onClick={onRequestCancel}>リーチ取消</button>
        ) : (
          <button className="btn btn--light" onClick={onReach}>リーチ</button>
        )}
        <button className="btn btn--light" onClick={() => onWin("ron")}>ロン</button>
        <button className="btn btn--light" onClick={() => onWin("tsumo")}>ツモ</button>
      </div>
    </div>
  );
}

export default PlayerPanel;