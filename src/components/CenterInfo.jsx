// src/components/CenterInfo.jsx

import React from "react";

function CenterInfo({ round, reachSticks = 0, onDraw, className }) {
  const wind = round?.wind ?? "東";
  const number = round?.number ?? 1;

  return (
    <div className={`panel panel--center ${className || ''}`}>
      <div className="round-info">
        {wind}{number}局
      </div>
      <div className="reach-sticks">リーチ棒：{reachSticks}</div>
      <button className="btn btn--light mahjong-app__draw-button" onClick={onDraw}>流局</button>
    </div>
  );
}

export default CenterInfo;