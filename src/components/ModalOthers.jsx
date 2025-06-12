// src/components/ModalOthers.jsx

import React from "react";
import "./styles/modals.css";

function ModalOthers({ visible, onClose, onRanking, onPenalty, onExport, onScoreHistory, onConfirm, onCancel, onDraw, onUndo }) {
  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal modal--medium modal-others">
        <button className="modal__close" onClick={onClose}>×</button>
        <div className="modal__header">
          <h2 className="modal__title">その他</h2>
        </div>
        <div className="modal__content">
          <div className="others-buttons">
            <button className="btn btn--light mahjong-app__draw-button" onClick={onDraw}>流局</button>
            <button className="btn btn--warning undo-button" onClick={onUndo}>
              ← 1つ戻る
            </button>
            <button className="btn btn--primary others-button" onClick={onRanking}>
              現在の順位
            </button>
            <button className="btn btn--primary others-button" onClick={onScoreHistory}>
              点数移動履歴
            </button>
            <button className="btn btn--primary others-button" onClick={onPenalty}>
              満貫罰符
            </button>
            <button className="btn btn--primary others-button" onClick={onExport}>
              試合結果出力
            </button>
          </div>
        </div>
        <div className="modal__actions">
          <button className="btn btn--secondary" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalOthers;