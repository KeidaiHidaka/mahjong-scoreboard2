// App.jsxのコード

import React, { useState } from "react";
import PlayerPanel from "./components/PlayerPanel";
import CenterInfo from "./components/CenterInfo";
import CancelModal from "./components/CancelModal";
import WinModal from "./components/WinModal";
import ResultModal from "./components/ResultModal";
import TenpaiModal from "./components/TenpaiModal";
import "./App.css";





function calculateScore({ han, fu, isDealer, isTsumo }) {
  

  
  const tsumoChildScoreTable = {
    1: {
      30: { child: 300, parent: 500 },
      40: { child: 400, parent: 700 },
      50: { child: 400, parent: 800 },
      60: { child: 500, parent: 1000 },
      70: { child: 600, parent: 1200 },
      80: { child: 700, parent: 1300 },
      90: { child: 800, parent: 1500 },
      100: { child: 800, parent: 1600 },
      110: { child: 900, parent: 1800 },
    },
    2: {
      20: { child: 400, parent: 700 },
      25: { child: 800, parent: 1600 },
      30: { child: 500, parent: 1000 },
      40: { child: 700, parent: 1300 },
      50: { child: 800, parent: 1600 },
      60: { child: 1000, parent: 2000 },
      70: { child: 1200, parent: 2300 },
      80: { child: 1300, parent: 2600 },
      90: { child: 1500, parent: 2900 },
      100: { child: 1600, parent: 3200 },
      110: { child: 1800, parent: 3600 },
    },
    3: {
      20: { child: 700, parent: 1300 },
      25: { child: 800, parent: 1600 },
      30: { child: 1000, parent: 2000 },
      40: { child: 1300, parent: 2600 },
      50: { child: 1600, parent: 3200 },
      60: { child: 2000, parent: 3900 },
      70: { child: 2000, parent: 4000 },
      80: { child: 2000, parent: 4000 },
      90: { child: 2000, parent: 4000 },
      100: { child: 2000, parent: 4000 },
      110: { child: 2000, parent: 4000 },
    },
    4: {
      20: { child: 1300, parent: 2600 },
      25: { child: 1600, parent: 3200 },
      30: { child: 2000, parent: 3900 },
      40: { child: 2000, parent: 4000 },
      50: { child: 2000, parent: 4000 },
      60: { child: 2000, parent: 4000 },
      70: { child: 2000, parent: 4000 },
      80: { child: 2000, parent: 4000 },
      90: { child: 2000, parent: 4000 },
      100: { child: 2000, parent: 4000 },
      110: { child: 2000, parent: 4000 },      
    },
    
  };
  const tsumoDealerScoreTable = {
    1: {
      30: { child: 500 },
      40: { child: 700 },
      50: { child: 800 },
      60: { child: 1000 },
      70: { child: 1200 },
      80: { child: 1300 },
      90: { child: 1500 },
      100: { child: 1600 },
      110: { child: 1800 }, // 違うかも？
    },
    2: {
      20: { child: 700 }, // 違うかも？
      25: { child: 800 }, // 違うかも？
      30: { child: 500 },
      40: { child: 1300 },
      50: { child: 1600 },
      60: { child: 2000 },
      70: { child: 2300 },
      80: { child: 2600 },
      90: { child: 2900 },
      100: { child: 3200 },
      110: { child: 3600 },
    },
    3: {
      20: { child: 1300 },
      25: { child: 1600 },
      30: { child: 2000 },
      40: { child: 2600 },
      50: { child: 3200 },
      60: { child: 3900 },
      70: { child: 4000 },
      80: { child: 4000 },
      90: { child: 4000 },
      100: { child: 4000 },
      110: { child: 4000 },
    },
    4: {
      20: { child: 2600 },
      25: { child: 3200 },
      30: { child: 3900 },
      40: { child: 4000 },
      50: { child: 4000 },
      60: { child: 4000 },
      70: { child: 4000 },
      80: { child: 4000 },
      90: { child: 4000 },
      100: { child: 4000 },
      110: { child: 4000 },    
    },
  };
  const ronChildScoreTable = {
    1: {
      30: 1000, 
      40: 1300, 
      50: 1600,
      60: 2000, 
      70: 2300, 
      80: 2600,
      90: 2900, 
      100: 3200, 
      110: 3600,
    },
    2: {
      25: 1600, 
      30: 2000, 
      40: 2600,
      50: 3200, 
      60: 3900, 
      70: 4500,
      80: 5200, 
      90: 5800, 
      100: 6400, 
      110: 7100,
    },
    3: {
      25: 3200,
      30: 3900, 
      40: 5200,
      50: 6400, 
      60: 7700, 
      70: 4500,
      80: 8000, 
      90: 8000, 
      100: 8000, 
      110: 8000,
    },
    4: {
      25: 6400, 
      30: 7700, 
      40: 8000,
      50: 8000, 
      60: 8000, 
      70: 8000,
      80: 8000, 
      90: 8000, 
      100: 8000, 
      110: 8000,
    },
  };
  const ronDealerScoreTable = {
    1: {
      30: 1500, 
      40: 2000, 
      50: 2400,
      60: 2900, 
      70: 3400, 
      80: 3900,
      90: 4400, 
      100: 4800, 
      110: 5300,
    },
    2: {
      25: 2400, 
      30: 2900, 
      40: 3900,
      50: 4800, 
      60: 5800, 
      70: 6800,
      80: 7700, 
      90: 8700, 
      100: 9600, 
      110: 10600,
    },
    3: {
      25: 4800, 
      30: 5800, 
      40: 7700,
      50: 9600, 
      60: 11600, 
      70: 12000,
      80: 12000, 
      90: 12000, 
      100: 12000, 
      110: 12000,
    },
    4: {
      25: 9600, 
      30: 11600, 
      40: 12000,
      50: 12000, 
      60: 12000, 
      70: 12000,
      80: 12000, 
      90: 12000, 
      100: 12000, 
      110: 12000,
    },
  };

  // 5翻以上
  const tsumoManganPlusChild = {
    5: { child: 2000, parent: 4000 },
    6: { child: 3000, parent: 6000 },
    7: { child: 3000, parent: 6000 },
    8: { child: 4000, parent: 8000 },
    9: { child: 4000, parent: 8000 },
    10: { child: 4000, parent: 8000 },
    11: { child: 6000, parent: 12000 },
    12: { child: 6000, parent: 12000 },
    13: { child: 8000, parent: 16000 },
  };
  const tsumoManganPlusDealer = {
    5: { child: 4000 },
    6: { child: 6000 },
    7: { child: 6000 },
    8: { child: 8000 },
    9: { child: 8000 },
    10: { child: 8000 },
    11: { child: 12000 },
    12: { child: 12000 },
    13: { child: 16000 },
  };
  const ronManganPlusChild = {
     5: 8000, 
     6: 12000, 
     7: 12000, 
     8: 16000, 
     9: 16000, 
     10: 16000, 
     11: 24000, 
     12: 24000, 
     13: 32000 
  };
  const ronManganPlusDealer = {
     5: 12000, 
     6: 18000, 
     7: 18000, 
     8: 24000, 
     9: 24000, 
     10: 24000, 
     11: 36000, 
     12: 36000, 
     13: 48000 
  };



  if (isTsumo) {//ツモ
    //ツモ
    if (isDealer) {
      // 親
      if (han >= 5) {// 5翻以上
        // 5翻以上
        const score = tsumoManganPlusDealer[han];
        return {
          type: 'ツモ（親）',
          payments: [
            { from: '他家1', to: '親', points: score.child },
            { from: '他家2', to: '親', points: score.child },
            { from: '他家3', to: '親', points: score.child },
          ],
          total: score.child * 3, 
          child: score.child,
        };
      } else {// 4翻以下
        // 4翻以下
        const score = tsumoDealerScoreTable[han]?.[fu];
        if (!score) return { error: '無効な符・翻の組み合わせ（親ツモ）' };
        return {
          type: 'ツモ（親）',
          payments: [
            { from: '他家1', to: '親', points: score.child },
            { from: '他家2', to: '親', points: score.child },
            { from: '他家3', to: '親', points: score.child },
          ],
          total: score.child * 3,
          child: score.child,
        };
      }
    } else {// 子
      // 子
      if (han >= 5) {// 5翻以上
        // 5翻以上
        const score = tsumoManganPlusChild[han];
        return {
          type: 'ツモ（子）',
          payments: [
            { from: '親', to: '子', points: score.parent },
            { from: '子1', to: '子', points: score.child },
            { from: '子2', to: '子', points: score.child },
          ],
          total: score.parent + (score.child * 2),
          parent: score.parent,
          child: score.child,
        };
      } else {// 4翻以下
        // 4翻以下
        const score = tsumoChildScoreTable[han]?.[fu];
        if (!score) return { error: '無効な符・翻の組み合わせ（子ツモ）' };
        return {
          type: 'ツモ（子）',
          payments: [
            { from: '親', to: '子', points: score.parent },
            { from: '子1', to: '子', points: score.child },
            { from: '子2', to: '子', points: score.child },
          ],
          total: score.parent + (score.child * 2),
          parent: score.parent,
          child: score.child,
        };
      }
    }
  } else { //ロン
    // ロン
    if (isDealer) {// 親
      // 親
      if (han >= 5) {//5翻以上
        //5翻以上
        const score = ronManganPlusDealer[han] || 48000;
        return {
          type: 'ロン（親）',
          payments: [{ from: '振り込み者', to: '親', points: score }],
          total: score,
        };
      } else {//4翻以下
        //4翻以下
        const score = ronDealerScoreTable[han]?.[fu];
        if (!score) return { error: '無効な符・翻の組み合わせ（親ロン）' };
        return {
          type: 'ロン（親）',
          payments: [{ from: '振り込み者', to: '親', points: score }],
          total: score,
        };
      }
    } else {// 子
      // 子
      if (han >= 5) {//5翻以上
        //5翻以上
        const total = ronManganPlusChild[han] || 32000;
        return {
          type: 'ロン（子）',
          payments: [{ from: '振り込み者', to: '子', points: total }],
          total,
          score: total,
        };
      } else {//4翻以下
        //4翻以下
        const score = ronChildScoreTable[han]?.[fu];
        if (!score) return { error: '無効な符・翻の組み合わせ（子ロン）' };
        return {
          type: 'ロン（子）',
          payments: [{ from: '振り込み者', to: '子', points: score }],
          total: score,
        };
      }
    }
  }
}








function App() {
  const [initialMethod, setInitialMethod] = useState("ron");
  const params = new URLSearchParams(window.location.search);

  const initialPlayers = [
    { name: params.get("player1") || "プレイヤー1", score: 25000, reached: false },
    { name: params.get("player2") || "プレイヤー2", score: 25000, reached: false },
    { name: params.get("player3") || "プレイヤー3", score: 25000, reached: false },
    { name: params.get("player4") || "プレイヤー4", score: 25000, reached: false },
  ];
  // const initialPlayers = [
  //   { name: "プレイヤー1", score: 25000, reached: false },
  //   { name: "プレイヤー2", score: 25000, reached: false },
  //   { name: "プレイヤー3", score: 25000, reached: false },
  //   { name: "プレイヤー4", score: 25000, reached: false },
  // ];
  const reachSound = new Audio(import.meta.env.BASE_URL + 'sounds/reach.wav');
  const ryuukyokuAudio = new Audio(import.meta.env.BASE_URL + 'sounds/ryuukyoku.wav');
  const ronAudio = new Audio(import.meta.env.BASE_URL + 'sounds/ron.wav');
  const tsumoAudio = new Audio(import.meta.env.BASE_URL + 'sounds/tsumo.wav');


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

  const handleNameChange = (index, newName) => {
    const updated = [...players];
    updated[index].name = newName;
    setPlayers(updated);
  };

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
    ryuukyokuAudio.play();
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
      method: "ryukyoku",
      han: 0,
      fu: 0,
      details,
      reachBonus: 0,
      totalGain: totalPenalty,
      dealerIndex: round.dealerIndex, // ← ★これを追加
    });

    setShowResultModal(true);
    resetReach();
    // setReachSticks(0);
    advanceRound(null, indexes);
  };

  const handleTenpaiCancel = () => {
    setShowTenpaiModal(false);
  };

  const handleWin = (index,mothod) => {
    if (mothod === "tsumo") {
      tsumoAudio.play();
    } else{
      ronAudio.play();
    }
    setInitialMethod(mothod);
    setWinnerIndex(index);
    setShowWinModal(true);
  };

  const handleWinSubmit = ({ han, fu, method, loserIndex }) => {
    const updatedPlayers = [...players];
    const winner = updatedPlayers[winnerIndex];
    const winnerIsDealer = winnerIndex === round.dealerIndex;

    const result = calculateScore({
      han,
      fu,
      isDealer: winnerIsDealer,
      isTsumo: method === "tsumo",
    });

    console.log("🧮 計算結果:", result);

    if (result.error) {
      alert(result.error);
      return;
    }

    let details = [];
    let gain = 0; //場のリーチ棒も加算するため

    if (method === "ron") {
      const loser = updatedPlayers[loserIndex];
      loser.score -= result.total;
      winner.score += result.total;
      gain += result.total;
      details.push({
        from: loser.name,
        to: winner.name,
        points: result.total,
      });
    } else {
      // tsumo（自摸）
      updatedPlayers.forEach((p, i) => {
        if (i === winnerIndex) return;
        const isDealer = i === round.dealerIndex;
        const pay = winnerIsDealer
          ? result.child
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

    // リーチ棒
    const reachBonus = reachSticks * 1000;
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
      dealerIndex: round.dealerIndex,
      label: result.type || null, // 表示ラベル（例：ロン（親））
    });

    setShowResultModal(true);
    advanceRound(winnerIndex, []);
  };


  const handleWinCancel = () => {
    setShowWinModal(false);
  };

  const handleReach = (index) => {
    if (players[index].reached || players[index].score < 1000) return;
    // const reachSound = new Audio();

    // const reachSound = new Audio(import.meta.env.BASE_URL + 'sounds/reach.mp3');
    reachSound.play();
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
          onWin={(method) => handleWin(1,method)}
          isDealer={round.dealerIndex === 1}          
          onNameChange={(newName) => handleNameChange(1, newName)} // 👈 追加
        />
        <PlayerPanel
          {...players[0]}
          reversed
          onReach={() => handleReach(0)}
          onRequestCancel={() => handleRequestCancel(0)}
          onWin={(method) => handleWin(0,method)}
          isDealer={round.dealerIndex === 0}
          onNameChange={(newName) => handleNameChange(0, newName)} // 👈 追加

        />
      </div>

      <CenterInfo round={round} reachSticks={reachSticks} onDraw={handleDraw} />

      <div className="bottom-half">
        <PlayerPanel
          {...players[2]}
          onReach={() => handleReach(2)}
          onRequestCancel={() => handleRequestCancel(2)}
          onWin={(method) => handleWin(2,method)}
          isDealer={round.dealerIndex === 2}
          onNameChange={(newName) => handleNameChange(2, newName)} // 👈 追加

        />
        <PlayerPanel
          {...players[3]}
          onReach={() => handleReach(3)}
          onRequestCancel={() => handleRequestCancel(3)}
          onWin={(method) => handleWin(3,method)}
          isDealer={round.dealerIndex === 3}
          onNameChange={(newName) => handleNameChange(3, newName)} // 👈 追加

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
        initialMethod={initialMethod}
      />

      <ResultModal
        visible={showResultModal}
        result={winResult}
        players={players.map((p, i) => ({
          ...p,
          isDealer: i === winResult?.dealerIndex, // ← winResultのdealerIndexを見る！
        }))}
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
