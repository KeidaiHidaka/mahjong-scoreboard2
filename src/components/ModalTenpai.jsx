// src/components/ModalTenpai.jsx

import React, { useState, useEffect } from "react";
import "./styles/modals.css";
import "./styles/ModalTenpai.css";

function ModalTenpai({ visible, players, onConfirm, onCancel }) {
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
      <div className="modal modal--small tenpai-modal">
        <h2 className="tenpai-modal__title">テンパイ者を選択</h2>
        <div className="tenpai-modal__options">
          {players.map((p, i) => (
            <label key={i} className="tenpai-modal__option">
              <input
                type="checkbox"
                checked={selectedIndexes.includes(i)}
                onChange={() => toggleIndex(i)}
              />
              {p.name}
            </label>
          ))}
        </div>
        <div className="tenpai-modal__actions">
          <button className="btn btn--primary" onClick={() => onConfirm(selectedIndexes)}>確定</button>
          <button className="btn btn--secondary" onClick={onCancel}>キャンセル</button>
        </div>
      </div>
    </div>
  );
}

export default ModalTenpai;