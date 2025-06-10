// src/components/ModalResult.jsx

import React from "react";
import "./styles/modals.css";

function ModalResult({ visible, result, players, onClose }) {
  if (!visible || !result) return null;

  const dealerName = players.find((p) => p.isDealer)?.name ?? "不明";

  return (
    <div className="modal-backdrop">
      <div className="modal modal--medium modal-result">
        <div className="modal-result__info">
          <h2>{
            result.method === "ryukyoku"
                  ? "流局結果"
                  : "和了結果"
          }</h2>
          
          <span>
            <span className="modal-result__info-label">和了者：</span>
            <span className="modal-result__info-value">{result.winner}</span>
          </span>
          <p></p>
          <span>
            <span className="modal-result__info-label">親：</span>
            <span className="modal-result__info-value">{dealerName}</span>
          </span>
          <p></p>
          <span>
            <span className="modal-result__info-label">形式：</span>
            <span className="modal-result__info-value">{
              result.method === "ron"
                ? "ロン"
                : result.method === "tsumo"
                  ? "ツモ"
                  : result.method === "ryukyoku"
                    ? "流局"
                    : ""
            }</span>
          </span>
        </div>

        <div className="modal-result__score">
          {result.han >= 5 ? (
            <div>{result.han}翻</div>
          ) : (
            <div>{result.han}翻 {result.fu}符</div>
          )}
        </div>

        <div className="modal-result__details">
          <h3>点数移動</h3>
          <ul>
            {result.details.map((item, idx) => (
              <li key={idx}>
                <span className="modal-result__transfer">
                  {item.from} → {item.to}
                </span>
                <span className={`modal-result__points ${item.points > 0 ? 'modal-result__points--positive' : 'modal-result__points--negative'}`}>
                  {item.from === "ノーテン" && item.points === 3000
                    ? "1000点"
                    : `${item.points > 0 ? '+' : ''}${item.points}点`}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {result.reachBonus > 0 && (
          <div className="modal-result__reach-bonus">
            リーチ棒: +{result.reachBonus}点
          </div>
        )}

        <div className="modal-result__total">
          合計得点: +{result.totalGain}点
        </div>

        <div className="modal-result__actions">
          <button className="btn btn--primary" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}

export default ModalResult;