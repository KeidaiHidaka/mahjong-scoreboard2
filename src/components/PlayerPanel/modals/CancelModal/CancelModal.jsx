// src/components/CancelModal.jsx
import React from "react";
import "./CancelModal.css";

function CancelModal({ visible, onConfirm, onCancel }) {
  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <p>リーチを取り消しますか？</p>
        <button onClick={onConfirm}>はい</button>
        <button onClick={onCancel}>キャンセル</button>
      </div>
    </div>
  );
}

export default CancelModal;
