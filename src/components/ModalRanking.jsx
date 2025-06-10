// src/components/ModalRanking.jsx

import React from "react";
import "./styles/modals.css";

function ModalRanking({ visible, players, onClose }) {
  if (!visible) return null;

  // 順位計算 - 点数の高い順にソート
  const rankedPlayers = [...players]
    .map((player, index) => ({ ...player, originalIndex: index }))
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      ...player,
      ranking: index + 1
    }));

  return (
    <div className="modal-backdrop">
      <div className="modal modal--medium modal-ranking">
        <button className="modal__close" onClick={onClose}>×</button>
        <div className="modal__header">
          <h2 className="modal__title">現在の順位</h2>
        </div>
        <div className="modal__content">
          <div className="ranking-list">
            {rankedPlayers.map((player) => (
              <div key={player.originalIndex} className="ranking-item">
                <div className="ranking-item__position">{player.ranking}位</div>
                <div className="ranking-item__name">{player.name}</div>
                <div className="ranking-item__score">{player.score.toLocaleString()}点</div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal__actions">
          <button className="btn btn--primary" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalRanking;