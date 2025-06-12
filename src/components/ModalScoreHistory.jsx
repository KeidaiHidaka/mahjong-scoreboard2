// src/components/ModalScoreHistory.jsx

import React from "react";
import "./styles/modals.css";

function ModalScoreHistory({ visible, history, onClose, onCsvExport }) {
  if (!visible) return null;

  const handleCsvDownload = () => {
    if (history.length === 0) {
      alert("履歴がありません");
      return;
    }

    // プレイヤー名を取得（最新の履歴から）
    const latestHistory = history[history.length - 1];
    const playerNames = latestHistory.scoreChanges ? 
      latestHistory.scoreChanges.map(s => s.name) : 
      ['プレイヤー1', 'プレイヤー2', 'プレイヤー3', 'プレイヤー4'];

    // CSVヘッダー
    let csvContent = `日付時刻,場風局数,アガリ方,和了者,放銃者,親,${playerNames.join(',')}\n`;
    
    // 各履歴項目をCSV行に変換
    history.forEach((item) => {
      // 日付時刻
      const now = new Date();
      const dateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${item.timestamp}`;
      
      // 場風局数
      const roundInfo = `${item.wind}${item.number}`;
      
      // アガリ方、和了者、放銃者を判定
      let winType = "", winner = "", loser = "";
      
      if (item.type.includes("ツモ")) {
        winType = "ツモ";
        const match = item.type.match(/^(.+?)\s/);
        winner = match ? match[1] : "";
      } else if (item.type.includes("ロン")) {
        winType = "ロン";
        const match = item.type.match(/^(.+?)\s/);
        winner = match ? match[1] : "";
        // 放銃者は詳細から取得
        if (item.details && item.details.length > 0) {
          loser = item.details[0].from;
        }
      } else if (item.type.includes("流局")) {
        winType = "流局";
      } else if (item.type.includes("チョンボ")) {
        winType = "罰符";
        const match = item.type.match(/チョンボ（(.+?)）/);
        loser = match ? match[1] : "";
      }
      
      // 親を判定（履歴に親情報がない場合は空文字）
      const dealer = item.dealerName || "";
      
      // 各プレイヤーの点数変動
      const scoreChanges = new Array(4).fill(0);
      if (item.scoreChanges) {
        item.scoreChanges.forEach((change, index) => {
          if (index < 4) {
            scoreChanges[index] = change.change > 0 ? `+${change.change}` : change.change.toString();
          }
        });
      }
      
      // CSVエスケープ処理
      const escapeCsv = (field) => {
        const str = String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };
      
      csvContent += `${escapeCsv(dateTime)},${escapeCsv(roundInfo)},${escapeCsv(winType)},${escapeCsv(winner)},${escapeCsv(loser)},${escapeCsv(dealer)},${scoreChanges.map(s => escapeCsv(s)).join(',')}\n`;
    });

    const filename = `mahjong_score_history_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
    onCsvExport(csvContent, filename);
  };

  const formatScoreChange = (change) => {
    if (change > 0) return `+${change}`;
    if (change < 0) return `${change}`;
    return "±0";
  };

  return (
    <div className="modal-backdrop">
      <div className="modal modal--large modal-score-history">
        <button className="modal__close" onClick={onClose}>×</button>
        <div className="modal__header">
          <h2 className="modal__title">点数移動履歴</h2>
        </div>
        <div className="modal__content">
          {history.length === 0 ? (
            <div className="history-empty">
              <p>まだ履歴がありません</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <div key={index} className="history-item">
                  <div className="history-item__header">
                    <span className="history-round">{item.wind}{item.number}局</span>
                    <span className="history-type">{item.type}</span>
                    <span className="history-time">{item.timestamp}</span>
                  </div>
                  
                  {item.details && item.details.length > 0 && (
                    <div className="history-details">
                      <h4>移動詳細:</h4>
                      <ul>
                        {item.details.map((detail, detailIndex) => (
                          <li key={detailIndex}>
                            {detail.from} → {detail.to}: {detail.points}点
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.scoreChanges && item.scoreChanges.length > 0 && (
                    <div className="history-score-changes">
                      <h4>点数変動:</h4>
                      <div className="score-changes-grid">
                        {item.scoreChanges.map((change, changeIndex) => (
                          <div key={changeIndex} className={`score-change ${change.change > 0 ? 'positive' : change.change < 0 ? 'negative' : 'neutral'}`}>
                            <span className="player-name">{change.name}</span>
                            <span className="score-change-value">{formatScoreChange(change.change)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {item.reachBonus > 0 && (
                    <div className="history-reach-bonus">
                      <p>リーチ棒ボーナス: +{item.reachBonus}点</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal__actions">
          <button 
            className="btn btn--primary" 
            onClick={handleCsvDownload}
            disabled={history.length === 0}
          >
            CSV出力
          </button>
          <button className="btn btn--secondary" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalScoreHistory;