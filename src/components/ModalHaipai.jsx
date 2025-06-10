// src/components/ModalHaipai.jsx

import React, { useState, useEffect } from "react";
import "./styles/modals.css";

function ModalHaipai({ visible, onClose, generateStart }) {
  const [haipaiStart, setHaipaiStart] = useState("");

  useEffect(() => {
    if (visible) {
      setHaipaiStart(generateStart());
    }
  }, [visible, generateStart]);

  const handleRegenerate = () => {
    setHaipaiStart(generateStart());
  };

  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal modal--haipai">
        <div className="modal__header">
          <h2 className="modal__title">配牌開始列</h2>
        </div>
        
        <div className="modal__body">
          <div className="haipai-result">
            <div className="haipai-result__text">
              {haipaiStart}
            </div>
          </div>
          
          <div className="modal__actions">
            <button 
              className="btn btn--secondary" 
              onClick={handleRegenerate}
            >
              再抽選
            </button>
            <button 
              className="btn btn--primary" 
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalHaipai;