import React, { useState } from "react";
import PlayerPanel from "./components/PlayerPanel";
import CenterInfo from "./components/CenterInfo";
import CancelModal from "./components/CancelModal";
import WinModal from "./components/WinModal";
import ResultModal from "./components/ResultModal";
import TenpaiModal from "./components/TenpaiModal";
import "./App.css";

function calculateScore(han, fu, method, winnerIsDealer) {
  if (han >= 13) return { score: 32000, label: "数え役満" };
  if (han >= 11) return { score: 24000, label: "三倍満" };
  if (han >= 8) return { score: 16000, label: "倍満" };
  if (han >= 6) return { score: 12000, label: "跳満" };
  if (han >= 5 || (han === 4 && fu >= 40) || (han === 3 && fu >= 70))
    return { score: 8000, label: "満貫" };

  const base = fu * Math.pow(2, 2 + han);

  if (method === "ron") {
    const score = Math.ceil((base * 4) / 100) * 100;
    return { score };
  } else {
    if (winnerIsDealer) {
      const each = Math.ceil((base * 2) / 100) * 100;
      return { total: each * 3, each };
    } else {
      const child = Math.ceil(base / 100) * 100;
      const parent = Math.ceil((base * 2) / 100) * 100;
      return { total: child * 2 + parent, child, parent };
    }
  }
}

function App() {
  const initialPlayers = [
    { name: "東", score: 25000, reached: false },
    { name: "南", score: 25000, reached: false },
    { name: "西", score: 25000, reached: false },
    { name: "北", score: 25000, reached: false },
  ];

  const [players, setPlayers] = useState(initialPlayers);
  const [reachSticks, setReachSticks] = useState(0);
  const [cancelIndex, setCancelIndex] = useState(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [winResult, setWinResult] = useState(null);
  const [round, setRound] = useState({ wind: "東", number: 1, dealerIndex: 0 });
  const [showTenpaiModal, setShowTenpaiModal] = useState(false);
  const [tenpaiIndexes, setTenpaiIndexes] = useState([]);

  const winds = ["東", "南", "西", "北"];

  const advanceRound = (winnerIndex = null, tenpaiIndexes = []) => {
    setRound((prev) => {
      let dealerIndex = prev.dealerIndex;
      let nextDealerIndex = dealerIndex;
      let nextNumber = prev.number;
      let nextWind = prev.wind;

      if (winnerIndex !== null) {
        const dealerWon = winnerIndex === dealerIndex;
        if (!dealerWon) {
          nextDealerIndex = (dealerIndex + 1) % 4;
          nextNumber++;
        }
      } else {
        if (tenpaiIndexes.length === 0) {
          // 全員ノーテン → 親継続
        } else if (tenpaiIndexes.length === 4) {
          // 全員テンパイ → 親交代
          nextDealerIndex = (dealerIndex + 1) % 4;
          nextNumber++;
        } else {
          if (!tenpaiIndexes.includes(dealerIndex)) {
            nextDealerIndex = (dealerIndex + 1) % 4;
            nextNumber++;
          }
        }
      }

      if (nextNumber > 4) {
        const nextWindIndex = winds.indexOf(prev.wind) + 1;
        if (nextWindIndex < winds.length) {
          nextWind = winds[nextWindIndex];
          nextNumber = 1;
        } else {
          nextWind = "終了";
          nextNumber = 0;
        }
      }

      return {
        dealerIndex: nextDealerIndex,
        wind: nextWind,
        number: nextNumber,
      };
    });
  };

  const resetReach = () => {
    const reset = players.map((p) => ({ ...p, reached: false }));
    setPlayers(reset);
  };

  const handleDraw = () => {
    const audio = new Audio("/sounds/ryuukyoku.wav");
    audio.play();
    setShowTenpaiModal(true);
  };

  const handleTenpaiConfirm = (indexes) => {
    setShowTenpaiModal(false);
    setTenpaiIndexes(indexes);

    const updated = [...players];
    const tenpai = indexes;
    const noten = players.map((_, i) => i).filter((i) => !tenpai.includes(i));

    let details = [];
    let totalPenalty = 0;

    if (tenpai.length > 0 && noten.length > 0) {
      totalPenalty = 3000;
      const eachPenalty = Math.floor(totalPenalty / noten.length);
      const eachReward = Math.floor(totalPenalty / tenpai.length);

      noten.forEach((i) => (updated[i].score -= eachPenalty));
      tenpai.forEach((i) => (updated[i].score += eachReward));

      details = tenpai.map((i) => ({
        from: "ノーテン",
        to: players[i].name,
        points: eachReward,
      }));
    }

    setPlayers(updated);
    setWinResult({
      winner: "流局",
      method: "流局",
      han: 0,
      fu: 0,
      details,
      reachBonus: 0,
      totalGain: totalPenalty,
    });

    setShowResultModal(true);
    resetReach();
    setReachSticks(0);
    advanceRound(null, indexes);
  };

  const handleTenpaiCancel = () => {
    setShowTenpaiModal(false);
  };

  const handleWin = (index) => {
    setWinnerIndex(index);
    setShowWinModal(true);
  };

  const handleWinSubmit = ({ han, fu, method, loserIndex }) => {
    const updatedPlayers = [...players];
    const winner = updatedPlayers[winnerIndex];
    const winnerIsDealer = winnerIndex === round.dealerIndex;

    const result = calculateScore(han, fu, method, winnerIsDealer);
    let details = [];
    let gain = 0;

    if (method === "ron") {
      const loser = updatedPlayers[loserIndex];
      loser.score -= result.score;
      winner.score += result.score;
      gain += result.score;
      details.push({
        from: loser.name,
        to: winner.name,
        points: result.score,
      });
    } else {
      updatedPlayers.forEach((p, i) => {
        if (i === winnerIndex) return;
        const isDealer = i === round.dealerIndex;
        const pay = winnerIsDealer
          ? result.each
          : isDealer
          ? result.parent
          : result.child;
        p.score -= pay;
        winner.score += pay;
        gain += pay;
        details.push({
          from: p.name,
          to: winner.name,
          points: pay,
        });
      });
    }

    let reachBonus = reachSticks * 1000;
    if (reachSticks > 0) {
      winner.score += reachBonus;
      gain += reachBonus;
    }

    const resetPlayers = updatedPlayers.map((p) => ({ ...p, reached: false }));
    setPlayers(resetPlayers);
    setReachSticks(0);
    setShowWinModal(false);

    setWinResult({
      winner: winner.name,
      han,
      fu,
      method,
      details,
      reachBonus,
      totalGain: gain,
    });

    setShowResultModal(true);
    advanceRound(winnerIndex, []);
  };

  const handleWinCancel = () => {
    setShowWinModal(false);
  };

  const handleReach = (index) => {
    if (players[index].reached || players[index].score < 1000) return;
    const audio = new Audio("/sounds/reach.mp3");
    audio.play();
    const updated = [...players];
    updated[index].score -= 1000;
    updated[index].reached = true;
    setPlayers(updated);
    setReachSticks(reachSticks + 1);
  };

  const handleRequestCancel = (index) => {
    setCancelIndex(index);
  };

  const handleConfirmCancel = () => {
    const updated = [...players];
    const index = cancelIndex;
    if (updated[index].reached) {
      updated[index].score += 1000;
      updated[index].reached = false;
      setPlayers(updated);
      setReachSticks((r) => Math.max(0, r - 1));
    }
    setCancelIndex(null);
  };

  const handleCancelModal = () => {
    setCancelIndex(null);
  };

  return (
    <div className="container">
      <div className="top-half">
        <PlayerPanel
          {...players[1]}
          reversed
          onReach={() => handleReach(1)}
          onRequestCancel={() => handleRequestCancel(1)}
          onWin={() => handleWin(1)}
          isDealer={round.dealerIndex === 1}
        />
        <PlayerPanel
          {...players[0]}
          reversed
          onReach={() => handleReach(0)}
          onRequestCancel={() => handleRequestCancel(0)}
          onWin={() => handleWin(0)}
          isDealer={round.dealerIndex === 0}
        />
      </div>

      <CenterInfo round={round} reachSticks={reachSticks} onDraw={handleDraw} />

      <div className="bottom-half">
        <PlayerPanel
          {...players[2]}
          onReach={() => handleReach(2)}
          onRequestCancel={() => handleRequestCancel(2)}
          onWin={() => handleWin(2)}
          isDealer={round.dealerIndex === 2}
        />
        <PlayerPanel
          {...players[3]}
          onReach={() => handleReach(3)}
          onRequestCancel={() => handleRequestCancel(3)}
          onWin={() => handleWin(3)}
          isDealer={round.dealerIndex === 3}
        />
      </div>

      <CancelModal
        visible={cancelIndex !== null}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelModal}
      />

      <WinModal
        visible={showWinModal}
        winnerIndex={winnerIndex}
        players={players}
        onSubmit={handleWinSubmit}
        onCancel={handleWinCancel}
      />

      <ResultModal
        visible={showResultModal}
        result={winResult}
        onClose={() => setShowResultModal(false)}
      />

      <TenpaiModal
        visible={showTenpaiModal}
        players={players}
        onConfirm={handleTenpaiConfirm}
        onCancel={handleTenpaiCancel}
      />
    </div>
  );
}

export default App;
