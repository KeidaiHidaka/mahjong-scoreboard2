// components/TenpaiModal.jsx
import React, { useState, useEffect } from "react";
import "./TenpaiModal.css";

function TenpaiModal({ visible, players, onConfirm, onCancel }) {
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  useEffect(() => {
    if (visible) setSelectedIndexes([]); // 開いたときにリセット
  }, [visible]);

  const toggleIndex = (i) => {
    setSelectedIndexes((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>テンパイ者を選択</h2>
        {players.map((p, i) => (
          <label key={i}>
            <input
              type="checkbox"
              checked={selectedIndexes.includes(i)}
              onChange={() => toggleIndex(i)}
            />
            {p.name}
          </label>
        ))}
        <button onClick={() => onConfirm(selectedIndexes)}>確定</button>
        <button onClick={onCancel}>キャンセル</button>
      </div>
    </div>
  );
}

export default TenpaiModal;
