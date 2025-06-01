import React from "react";

function CenterInfo({ round, reachSticks = 0, onDraw }) {
  const wind = round?.wind ?? "東";
  const number = round?.number ?? 1;
  // console.log("CenterInfo表示:", round.wind, round.number);

  return (
    <div className="center-info">
      <div className="round">
        {wind}{number}局
      </div>
      <div className="reach-sticks">リーチ棒：{reachSticks}</div>
      <button className="draw-button" onClick={onDraw}>流局</button>
    </div>
  );
}

export default CenterInfo;
