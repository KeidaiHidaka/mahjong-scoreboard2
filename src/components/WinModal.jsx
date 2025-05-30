// WinModal.jsx
import React, { useState } from "react";
import "./WinModal.css"; // 追記: スタイルを分離して管理する場合

function WinModal({ visible, winnerIndex, players, onSubmit, onCancel }) {
  const [han, setHan] = useState(3);
  const [fu, setFu] = useState(40);
  const [method, setMethod] = useState("ron");
  const [loserIndex, setLoserIndex] = useState(null);

  if (!visible) return null;

  const handleConfirm = () => {
    onSubmit({ han, fu, method, loserIndex });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content win-modal">
        <h2>和了入力</h2>

        <div className="centered-field">
          <label>翻数</label>
          <select value={han} onChange={(e) => setHan(parseInt(e.target.value))}>
            {[...Array(14)].map((_, i) => (
              <option key={i} value={i + 1}>{i + 1} 翻</option>
            ))}
          </select>
        </div>

        <div className="centered-field">
          <label>符数</label>
          <select value={fu} onChange={(e) => setFu(parseInt(e.target.value))}>
            {[20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110].map((f) => (
              <option key={f} value={f}>{f} 符</option>
            ))}
          </select>
        </div>

        <div className="centered-field">
          <label>和了方法</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="ron">ロン</option>
            <option value="tsumo">ツモ</option>
          </select>
        </div>

        {method === "ron" && (
          <div className="centered-field">
            <label>放銃者</label>
            <select value={loserIndex ?? ""} onChange={(e) => setLoserIndex(parseInt(e.target.value))}>
              <option value="" disabled>選択してください</option>
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

        <div className="modal-buttons">
          <button onClick={handleConfirm}>確定</button>
          <button onClick={onCancel}>キャンセル</button>
        </div>
      </div>
    </div>
  );
}

export default WinModal;
