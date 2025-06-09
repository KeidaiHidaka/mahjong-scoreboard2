// src/components/ModalResult.jsx

import React from "react";
import "./styles/modals.css";
import "./styles/ModalResult.css";

function ModalResult({ visible, result, players, onClose }) {
  if (!visible || !result) return null;

  const dealerName = players.find((p) => p.isDealer)?.name ?? "不明";

  return (
    <div className="modal-backdrop">
      <div className="modal modal--small">
        <h2>{
          result.method === "ryukyoku"
                ? "流局結果"
                : "和了結果"
        }</h2>
        
        <p>和了者: {result.winner}</p>
        <p>親: {dealerName}</p>
        <p>形式: {
          result.method === "ron"
            ? "ロン"
            : result.method === "tsumo"
              ? "ツモ"
              : result.method === "ryukyoku"
                ? "流局"
                : ""
        }</p>
        {result.han >= 5 ? (
          <p>
            {result.han}翻
            {/* {result.label ? `（${result.label}）` : ""} */}
          </p>
        ) : (
          <p>{result.han}翻 {result.fu}符</p>
        )}

        <ul>
          {result.details.map((item, idx) => (
            <li key={idx}>
              {item.from} → {item.to}:{" "}
              {item.from === "ノーテン" && item.points === 3000
                ? "1000点"
                : `${item.points}点`}
            </li>
          ))}
        </ul>
        {result.reachBonus > 0 && <p>リーチ棒: +{result.reachBonus}点</p>}
        <p>合計得点: +{result.totalGain}点</p>
        <button className="btn btn--primary" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default ModalResult;