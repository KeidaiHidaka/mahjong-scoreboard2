// src/components/ModalFuCalculator.jsx

import { useState, useEffect } from 'react';
import questions from './questions';
import Question from './Question';
import Result from './Result';
import "./styles/modals.css";

function ModalFuCalculator({ visible, onCalculated, onCancel }) {
  const [currentId, setCurrentId] = useState("Q1");
  const [totalPoints, setTotalPoints] = useState(0);
  const [isChiitoitsu, setIsChiitoitsu] = useState(false);
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [tempState, setTempState] = useState({});
  const [history, setHistory] = useState([]);

  // モーダルが開かれるたびにリセット
  useEffect(() => {
    if (visible) {
      setCurrentId("Q1");
      setTotalPoints(0);
      setIsChiitoitsu(false);
      setIsOverrideMode(false);
      setTempState({});
      setHistory([]);
    }
  }, [visible]);

  const handleAnswer = ({ next, label, points = 0, override = false, pointsByPon, isPon, pointsByAnkan, isAnkan }) => {
    // ポン・カンの状態を保持
    if (isPon !== undefined) {
      setTempState(prev => ({ ...prev, isPon }));
    }
    if (isAnkan !== undefined) {
      setTempState(prev => ({ ...prev, isAnkan }));
    }

    if (label.includes("チートイツ") || points === 25) {
      setIsChiitoitsu(true);
    }

    let addedPoints = points;
    let detail = "";

    // 刻子処理
    if (pointsByPon && tempState.isPon !== undefined) {
      addedPoints = pointsByPon[tempState.isPon];
      detail = `${label}: +${addedPoints}符`;
    }

    if (pointsByAnkan && tempState.isAnkan !== undefined) {
      addedPoints = pointsByAnkan[tempState.isAnkan];
      detail = `${label}: +${addedPoints}符`;
    }

    if (override) {
      setIsOverrideMode(true);
      setHistory(prev => [...prev, { id: currentId, label, points, override }]);
      setCurrentId(next);
      return;
    }

    setIsOverrideMode(false);

    if (addedPoints > 0) {
      setTotalPoints(prev => prev + addedPoints);
    }

    setHistory(prev => [...prev, { id: currentId, label, points: addedPoints, override }]);
    setCurrentId(next);
  };

  const handleBack = () => {
    if (history.length === 0) return;

    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentId(prev.id);

    if (prev.points === 25) setIsChiitoitsu(false);

    if (!prev.override && prev.points > 0) {
      setTotalPoints(prevTotal => prevTotal - prev.points);
    }

    setIsOverrideMode(false);
  };

  const handleConfirm = (calculatedFu) => {
    onCalculated(calculatedFu);
  };

  const handleModalCancel = () => {
    onCancel();
  };

  // 画像パスを修正する関数
  const fixImagePath = (imagePath) => {
    if (!imagePath) return '';
    // 相対パスを絶対パスに変換
    if (imagePath.startsWith('./')) {
      return imagePath.replace('./', '/');
    }
    // すでに正しい形式の場合はそのまま返す
    if (imagePath.startsWith('/') || imagePath.startsWith('http')) {
      return imagePath;
    }
    // その他の場合は先頭に / を追加
    return `/${imagePath}`;
  };

  if (!visible) return null;

  const roundUpPoints = isOverrideMode
    ? totalPoints
    : isChiitoitsu
      ? totalPoints
      : Math.ceil(totalPoints / 10) * 10;

  return (
    <div className="modal-backdrop">
      <div className="modal modal--large fu-calculator-modal">
        <div className="modal__header">
          <h2>符計算</h2>
          
        </div>
        
        <div className="modal__content">
          {currentId === "RESULT" ? (
            <div className="fu-calculator__result">
              <Result
                roundUpPoints={roundUpPoints}
                history={history}
                totalPoints={totalPoints}
              />
              <div className="fu-calculator__actions">
                <button onClick={handleBack} className="btn btn--secondary">← 戻る</button>
                <button 
                  onClick={() => handleConfirm(roundUpPoints)} 
                  className="btn btn--success"
                >
                  この符で確定 ({roundUpPoints}符)
                </button>
              </div>
            </div>
          ) : (
            <div className="fu-calculator__question">
              <Question
                question={questions[currentId]}
                onAnswer={handleAnswer}
                fixImagePath={fixImagePath}
              />
              
              <div className="fu-calculator__navigation">
                <button onClick={handleBack} className="btn btn--secondary">← 戻る</button>
              </div>

              {history.length > 0 && (
                <div className="fu-calculator__history">
                  <h3>📝 選択履歴：</h3>
                  <ul>
                    {history.map((h, i) => (
                      <li key={i}>
                        {questions[h.id].text} → <strong>{h.label}</strong>
                        {h.points > 0 && (
                          <span className="point-highlight">+{h.points}符</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal__footer">
          <button onClick={handleModalCancel} className="btn btn--secondary">
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalFuCalculator;