// src/components/CenterInfo.jsx

import React from "react";

function CenterInfo({ round, reachSticks = 0, onDraw, onHaipai, onOthers, className }) {
  const wind = round?.wind ?? "東";
  const number = round?.number ?? 1;

  return (
    <div className={`panel panel--center ${className || ''}`}>
      <div className="round-info">
        {wind}{number}局
      </div>
      <div className="reach-sticks">リーチ棒：{reachSticks}</div>
      <div className="center-buttons">
        <button className="btn btn--light mahjong-app__draw-button" onClick={onDraw}>流局</button>
        <button className="btn btn--primary mahjong-app__haipai-button" onClick={onHaipai}>配牌開始列</button>
        <button className="btn btn--secondary mahjong-app__others-button" onClick={onOthers}>その他</button>
      </div>
    </div>
  );
}

export default CenterInfo;