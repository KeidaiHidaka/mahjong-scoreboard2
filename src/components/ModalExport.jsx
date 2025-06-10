// src/components/ModalExport.jsx

import React from "react";

function ModalExport({ visible, players, round, onClose, onExport }) {
  if (!visible) return null;

  const currentDate = new Date();
  const dateStr = currentDate.getFullYear() + '-' + 
    String(currentDate.getMonth() + 1).padStart(2, '0') + '-' + 
    String(currentDate.getDate()).padStart(2, '0');
  const timeStr = String(currentDate.getHours()).padStart(2, '0') + ':' + 
    String(currentDate.getMinutes()).padStart(2, '0');

  const csvData = [
    ['日付', '時刻', '風', '局', 'プレイヤー1名', 'プレイヤー1持ち点', 'プレイヤー2名', 'プレイヤー2持ち点', 'プレイヤー3名', 'プレイヤー3持ち点', 'プレイヤー4名', 'プレイヤー4持ち点'],
    [dateStr, timeStr, round.wind, round.number, ...players.flatMap(p => [p.name, p.score])]
  ];

  const csvContent = csvData.map(row => row.join(',')).join('\n');

  const handleExport = () => {
    onExport(csvContent, `麻雀結果_${dateStr}_${timeStr.replace(':', '')}.csv`);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal modal--large modal-export">
        <button className="modal__close" onClick={onClose}>×</button>
        <div className="modal__header">
          <h2 className="modal__title">試合結果出力</h2>
        </div>
        <div className="modal__content">
          <div className="export-preview">
            <h3>出力データプレビュー</h3>
            <div className="csv-preview">
              <table className="export-table">
                <thead>
                  <tr>
                    <th>日付</th>
                    <th>時刻</th>
                    <th>風</th>
                    <th>局</th>
                    <th>プレイヤー1名</th>
                    <th>プレイヤー1持ち点</th>
                    <th>プレイヤー2名</th>
                    <th>プレイヤー2持ち点</th>
                    <th>プレイヤー3名</th>
                    <th>プレイヤー3持ち点</th>
                    <th>プレイヤー4名</th>
                    <th>プレイヤー4持ち点</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{dateStr}</td>
                    <td>{timeStr}</td>
                    <td>{round.wind}</td>
                    <td>{round.number}</td>
                    {players.map((player, index) => (
                      <React.Fragment key={index}>
                        <td>{player.name}</td>
                        <td>{player.score.toLocaleString()}</td>
                      </React.Fragment>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="modal__actions">
          <button className="btn btn--primary" onClick={handleExport}>
            CSVダウンロード
          </button>
          <button className="btn btn--secondary" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalExport;