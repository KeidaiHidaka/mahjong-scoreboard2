import React from "react";
import "./ResultModal.css";

function ResultModal({ visible, result, onClose }) {
  if (!visible || !result) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>和了結果</h2>
        <p>和了者: {result.winner}</p>
        <p>形式: {result.method}</p>
        <p>
          翻: {result.han}翻 / 符: {result.fu}符
        </p>
        <ul>
          {result.details.map((item, idx) => (
            <li key={idx}>
              {item.from} → {item.to}: {item.points}点
            </li>
          ))}
        </ul>
        {result.reachBonus > 0 && <p>リーチ棒: +{result.reachBonus}点</p>}
        <p>合計得点: +{result.totalGain}点</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default ResultModal;
