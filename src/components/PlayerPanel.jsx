import React from "react";

function PlayerPanel({
  name,
  score,
  reversed,
  reached,
  onReach,
  onRequestCancel,
  onWin,
  isDealer, // ← ここで受け取る
}) {
  const handleReachClick = () => {
    if (reached) {
      onRequestCancel && onRequestCancel();
    } else {
      onReach && onReach();
    }
  };

  return (
    <div className={`player-panel ${reversed ? "reversed" : ""}`}>
      <div
        className="player-name"
        style={{ color: isDealer ? "red" : "black" }}
      >
        {name}
      </div>
      <div className="player-score">{score} 点</div>
      <div className="player-buttons">
        <button onClick={handleReachClick}>
          {reached ? "リーチ済み" : "リーチ"}
        </button>
        <button onClick={onWin}>和了</button>
      </div>
    </div>
  );
}

export default PlayerPanel;
