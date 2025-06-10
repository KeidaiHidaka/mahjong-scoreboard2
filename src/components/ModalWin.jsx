// src/components/ModalWin.jsx

import React, { useState, useEffect } from "react";
import ModalFuCalculator from "./ModalFuCalculator";
import "./styles/modals.css";

const validFuList = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

function isValidHanFu(han, fu) {
  if (han >= 5) return true; // 満貫以上は常にOK
  if (!validFuList.includes(fu)) return false;

  const invalidCombinations = [
    [1, 20], [1, 25], 
  ];

  return !invalidCombinations.some(([h, f]) => h === han && f === fu);
}

function ModalWin({ visible, winnerIndex, players, onSubmit, onCancel, initialMethod = "ron"}) {
  const [han, setHan] = useState(3);
  const [fu, setFu] = useState(30);
  const [method, setMethod] = useState(initialMethod);
  const [loserIndex, setLoserIndex] = useState(null);
  const [error, setError] = useState("");
  
  // 符計算モーダルの状態を追加
  const [showFuCalculator, setShowFuCalculator] = useState(false);

  useEffect(() => {
    if (visible) {
      setHan(3);
      setFu(30);
      setMethod(initialMethod);
      setLoserIndex(null);
      setError("");
      setShowFuCalculator(false);
    }
  }, [visible, initialMethod]);

  const handleSubmit = () => {
    if (!isValidHanFu(han, fu)) {
      setError("その翻数と符の組み合わせは無効です。");
      return;
    }
    if (method === "ron" && loserIndex === null) {
      setError("ロンの場合は放銃者を選択してください。");
      return;
    }
    setError(""); // エラーなしの場合はクリアしてから送信
    onSubmit({ han, fu, method, loserIndex });
  };

  // 符計算モーダルから符が確定された時の処理
  const handleFuCalculated = (calculatedFu) => {
    setFu(calculatedFu);
    setShowFuCalculator(false);
    setError(""); // エラーをクリア
  };

  // 符計算モーダルがキャンセルされた時の処理
  const handleFuCalculatorCancel = () => {
    setShowFuCalculator(false);
  };

  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal modal--medium win-modal">
        <div className="modal__header">
          <h2>和了入力</h2>
        </div>
        
        <div className="modal__content">
          <div className="form-group">
            <label>翻（1〜13+）</label>
            <select value={han} onChange={(e) => setHan(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
              <option value={13}>13+</option>
            </select>
          </div>
          
          <div className="form-group">
            <p></p>
            <label>符（満貫以上は不要）</label>
              <select
                value={fu}
                onChange={(e) => setFu(Number(e.target.value))}
                disabled={han >= 5}
              >
                {[20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
              <div >
              {han < 5 && (
                <button 
                  type="button"
                  onClick={() => setShowFuCalculator(true)}
                  className="btn btn--light"
                  disabled={han >= 5}
                >
                  符計算
                </button>
              )}
              </div>
          </div>
          
          <div className="form-group">
            <p></p>
            <label>和了方法</label>
            <div className="win-modal__method-options">
              <label>
                <input
                  type="radio"
                  value="ron"
                  checked={method === "ron"}
                  onChange={(e) => setMethod(e.target.value)}
                />
                ロン
              </label>
              <label>
                <input
                  type="radio"
                  value="tsumo"
                  checked={method === "tsumo"}
                  onChange={(e) => setMethod(e.target.value)}
                />
                ツモ
              </label>
            </div>
          </div>
          
          {method === "ron" && (
            <div className="form-group">
              <label>放銃者</label>
              <select
                value={loserIndex ?? ""}
                onChange={(e) => setLoserIndex(Number(e.target.value))}
              >
                <option value="" disabled>
                  選択してください
                </option>
                {players.map((p, i) =>
                  i !== winnerIndex ? (
                    <option key={i} value={i}>
                      {p.name}
                    </option>
                  ) : null
                )}
              </select>
            </div>
          )}
          
          {error && <p className="error-message">{error}</p>}
        </div>
        
        <div className="modal__footer">
          <div className="win-modal__actions">
            <button className="btn btn--primary" onClick={handleSubmit}>確定</button>
            <button className="btn btn--secondary" onClick={onCancel}>キャンセル</button>
          </div>
        </div>
      </div>

      {/* 符計算モーダル */}
      <ModalFuCalculator
        visible={showFuCalculator}
        onCalculated={handleFuCalculated}
        onCancel={handleFuCalculatorCancel}
      />
    </div>
  );
}

export default ModalWin;