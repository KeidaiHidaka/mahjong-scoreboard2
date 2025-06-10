// src/components/ModalPenalty.jsx

import React, { useState } from "react";
import "./styles/modals.css";

function ModalPenalty({ visible, players, round, onConfirm, onCancel }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  if (!visible) return null;

  const handleSubmit = () => {
    if (selectedPlayer === null) {
      alert("チョンボ者を選択してください");
      return;
    }
    onConfirm(selectedPlayer);
    setSelectedPlayer(null);
  };

  const handleCancel = () => {
    setSelectedPlayer(null);
    onCancel();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal modal--medium modal-penalty">
        <button className="modal__close" onClick={handleCancel}>×</button>
        <div className="modal__header">
          <h2 className="modal__title">満貫罰符（チョンボ）</h2>
        </div>
        <div className="modal__content">
          <div className="penalty-info">
            <p>チョンボ者を選択してください</p>
            <p className="penalty-description">
              親のチョンボ：他家全員に4000点ずつ支払い<br/>
              子のチョンボ：親に4000点、他の子に2000点ずつ支払い
            </p>
          </div>
          <div className="penalty-players">
            {players.map((player, index) => (
              <label key={index} className="penalty-option">
                <input
                  type="radio"
                  name="chonbo-player"
                  value={index}
                  checked={selectedPlayer === index}
                  onChange={() => setSelectedPlayer(index)}
                />
                <span className="penalty-player-name">
                  {player.name}
                  {index === round.dealerIndex && <span className="dealer-mark">（親）</span>}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="modal__actions">
          <button className="btn btn--primary" onClick={handleSubmit}>
            確定
          </button>
          <button className="btn btn--secondary" onClick={handleCancel}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalPenalty;