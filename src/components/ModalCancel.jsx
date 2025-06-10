// src/components/CancelModal.jsx

import React from "react";

import "./styles/modals.css";

function ModalCancel({ visible, onConfirm, onCancel }) {
  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <p>リーチを取り消しますか？</p>
        <button className="btn btn--primary" onClick={onConfirm}>はい</button>
        <button className="btn btn--secondary" onClick={onCancel}>キャンセル</button>
      </div>
    </div>
  );
}

export default ModalCancel;