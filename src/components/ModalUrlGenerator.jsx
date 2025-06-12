// src/components/ModalUrlGenerator.jsx

import React, { useState } from "react";
import "./styles/modals.css";

function ModalUrlGenerator({ visible, players, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  // URLを生成する関数
  const generateUrl = () => {
    const baseUrl = "https://keidaihidaka.github.io/mahjong-scoreboard2/";
    const params = new URLSearchParams();
    
    players.forEach((player, index) => {
      params.append(`player${index + 1}`, player.name);
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  // クリップボードにコピーする関数
  const copyToClipboard = async () => {
    try {
      const url = generateUrl();
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒後にリセット
    } catch (err) {
      console.error('コピーに失敗しました:', err);
      // フォールバック: 手動選択
      const textArea = document.createElement('textarea');
      textArea.value = generateUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal modal--large">
        <button className="modal__close" onClick={handleClose}>×</button>
        <div className="modal__header">
          <h2 className="modal__title">URL生成</h2>
        </div>
        <div className="modal__content">
          <div className="url-generator">
            <p className="url-generator__description">
              現在のプレイヤー名が設定されたURLです。このURLを共有することで、同じプレイヤー名で新しいゲームを開始できます。
            </p>
            
            <div className="url-generator__players">
              <h3>現在のプレイヤー:</h3>
              <ul className="url-generator__player-list">
                {players.map((player, index) => (
                  <li key={index} className="url-generator__player-item">
                    プレイヤー{index + 1}: {player.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="url-generator__url-section">
              <label className="url-generator__label">生成されたURL:</label>
              <div className="url-generator__url-container">
                <textarea
                  className="url-generator__url-text"
                  value={generateUrl()}
                  readOnly
                  rows={3}
                />
                <button 
                  className={`btn ${copied ? 'btn--success' : 'btn--primary'} url-generator__copy-btn`}
                  onClick={copyToClipboard}
                >
                  {copied ? '✓ コピー済み' : 'URLをコピー'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal__actions">
          <button className="btn btn--secondary" onClick={handleClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalUrlGenerator;