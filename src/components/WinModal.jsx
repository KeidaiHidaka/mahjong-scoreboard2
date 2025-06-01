import React, { useState, useEffect } from "react";
import "./WinModal.css";

const validFuList = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

function isValidHanFu(han, fu) {
  if (han >= 5) return true; // 満貫以上は常にOK
  if (!validFuList.includes(fu)) return false;

  const invalidCombinations = [
    [1, 25], [1, 50], [1, 60], [1, 70], [1, 80], [1, 90], [1, 100], [1, 110],
    [2, 25], [2, 50], [2, 60], [2, 70], [2, 80], [2, 90], [2, 100], [2, 110],
    [3, 25], [3, 70], [3, 80], [3, 90], [3, 100], [3, 110],
    [4, 25], [4, 70], [4, 80], [4, 90], [4, 100], [4, 110],
  ];

  return !invalidCombinations.some(([h, f]) => h === han && f === fu);
}

function WinModal({ visible, winnerIndex, players, onSubmit, onCancel }) {
  const [han, setHan] = useState(3);
  const [fu, setFu] = useState(40);
  const [method, setMethod] = useState("ron");
  const [loserIndex, setLoserIndex] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setHan(3);
      setFu(40);
      setMethod("ron");
      setLoserIndex(null);
      setError("");
    }
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
    setError(""); // エラーなしの場合はクリアしてから送信
    console.log("WinModal.jsxのhandleSubmitのloserIndex",loserIndex);
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
            max="13"
            value={han}
            onChange={(e) => setHan(Number(e.target.value))}
          />
        </div>
        <div>
          <label>符（満貫以上は不要）</label>
          <input
            type="number"
            min="20"
            step="5"
            value={fu}
            onChange={(e) => setFu(Number(e.target.value))}
            disabled={han >= 5}
          />
          {/* {han >= 5 && (
            <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "4px" }}>
              ※満貫以上のため符入力は不要です
            </div>
          )} */}
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
