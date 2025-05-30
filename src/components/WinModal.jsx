import React, { useState, useEffect } from "react";
import "./WinModal.css";

function isValidHanFu(han, fu) {
  if (han >= 5) return true; // 満貫以上なら符不要
  if (fu === 25) return han >= 2; // 七対子：25符かつ2翻以上
  if (fu < 20 || fu > 110 || fu % 10 !== 0) return false;

  const maxFuByHan = {
    1: 70,
    2: 70,
    3: 70,
    4: 60,
  };

  return fu <= maxFuByHan[han];
}

function WinModal({ visible, winnerIndex, players, onSubmit, onCancel }) {
  const [han, setHan] = useState(1);
  const [fu, setFu] = useState(30);
  const [method, setMethod] = useState("ron");
  const [loserIndex, setLoserIndex] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setHan(1);
    setFu(30);
    setMethod("ron");
    setLoserIndex(null);
    setError("");
  }, [visible]);

  const handleSubmit = () => {
    if (!isValidHanFu(han, fu)) {
      setError("その翻数と符の組み合わせは無効です。");
      return;
    }
    if (method === "ron" && loserIndex === null) {
      setError("ロンの場合は放銃者を選択してください。");
      return;
    }
    onSubmit({ han, fu, method, loserIndex });
  };

  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>和了入力</h2>
        <div>
          <label>翻（1〜13+）</label>
          <input
            type="number"
            min="1"
            value={han}
            onChange={(e) => setHan(Number(e.target.value))}
          />
        </div>
        <div>
          <label>符（満貫以上は不要）</label>
          <input
            type="number"
            min="20"
            step="10"
            value={fu}
            onChange={(e) => setFu(Number(e.target.value))}
            disabled={han >= 5}
          />
        </div>
        <div>
          <label>和了方法</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="ron">ロン</option>
            <option value="tsumo">ツモ</option>
          </select>
        </div>
        {method === "ron" && (
          <div>
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
        {error && <p className="error">{error}</p>}
        <div className="modal-buttons">
          <button onClick={handleSubmit}>確定</button>
          <button onClick={onCancel}>キャンセル</button>
        </div>
      </div>
    </div>
  );
}

export default WinModal;
