// src/App.jsx


// ========================================
// App.jsx - メインアプリケーション
// ========================================

import { useState, useEffect } from 'react'
import PlayerPanel from './components/PlayerPanel'
import CenterInfo from './components/CenterInfo'
import ModalWin from './components/ModalWin'
import ModalTenpai from './components/ModalTenpai'
import ModalResult from './components/ModalResult'
import ModalCancel from './components/ModalCancel'
import scoreTable  from './scoreTable'


import './App.css'







function calculateScore({ han, fu, isDealer, isTsumo }) {
  
  if (isTsumo) {//ツモ
    //ツモ
    if (isDealer) {
      // 親
      if (han >= 5) {// 5翻以上
        // 5翻以上
        const score = scoreTable.tsumoManganPlusDealer[han];
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
        const score = scoreTable.tsumoDealerScoreTable[han]?.[fu];
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
        const score = scoreTable.tsumoManganPlusChild[han];
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
        const score = scoreTable.tsumoChildScoreTable[han]?.[fu];
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
        const score = scoreTable.ronManganPlusDealer[han] || 48000;
        return {
          type: 'ロン（親）',
          payments: [{ from: '振り込み者', to: '親', points: score }],
          total: score,
        };
      } else {//4翻以下
        //4翻以下
        const score = scoreTable.ronDealerScoreTable[han]?.[fu];
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
        const total = scoreTable.ronManganPlusChild[han] || 32000;
        return {
          type: 'ロン（子）',
          payments: [{ from: '振り込み者', to: '子', points: total }],
          total,
          score: total,
        };
      } else {//4翻以下
        //4翻以下
        const score = scoreTable.ronChildScoreTable[han]?.[fu];
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
  const reachSound = new Audio(import.meta.env.BASE_URL + 'sounds/reach.wav');
  const ryuukyokuAudio = new Audio(import.meta.env.BASE_URL + 'sounds/ryuukyoku.wav');
  const ronAudio = new Audio(import.meta.env.BASE_URL + 'sounds/ron.wav');
  const tsumoAudio = new Audio(import.meta.env.BASE_URL + 'sounds/tsumo.wav');

  const dealerIndexParam = parseInt(params.get("dealerIndex"), 10);

  const [players, setPlayers] = useState(initialPlayers);
  const [reachSticks, setReachSticks] = useState(0);
  const [cancelIndex, setCancelIndex] = useState(null);
  const [showModalWin, setShowModalWin] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [showModalResult, setShowModalResult] = useState(false);
  const [winResult, setWinResult] = useState(null);
  const [round, setRound] = useState({
    wind: "東",
    number: 1,
    dealerIndex: isNaN(dealerIndexParam) ? 0 : dealerIndexParam,
  });
  const [showModalTenpai, setShowModalTenpai] = useState(false);
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
    setShowModalTenpai(true);
  };

  const handleTenpaiConfirm = (indexes) => {
    setShowModalTenpai(false);
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

    setShowModalResult(true);
    resetReach();
    // setReachSticks(0);
    advanceRound(null, indexes);
  };

  const handleTenpaiCancel = () => {
    setShowModalTenpai(false);
  };

  const handleWin = (index,mothod) => {
    if (mothod === "tsumo") {
      tsumoAudio.play();
    } else{
      ronAudio.play();
    }
    setInitialMethod(mothod);
    setWinnerIndex(index);
    setShowModalWin(true);
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
    setShowModalWin(false);

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

    setShowModalResult(true);
    advanceRound(winnerIndex, []);
  };


  const handleWinCancel = () => {
    setShowModalWin(false);
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

  const handleModalCancel = () => {
    setCancelIndex(null);
  };

  return (
    <div className="mahjong-app">
      {/* 上側プレイヤー（逆さま） */}
      <div className="mahjong-app__top-half">
        <PlayerPanel
          {...players[2]}
          className="player-panel panel--reversed player-panel--top"
          reversed
          onReach={() => handleReach(2)}
          onRequestCancel={() => handleRequestCancel(2)}
          onWin={(method) => handleWin(2, method)}
          isDealer={round.dealerIndex === 2}          
          onNameChange={(newName) => handleNameChange(2, newName)}
        />
      </div>

      {/* 左側プレイヤー（左向き） */}
      <PlayerPanel
        {...players[3]}
        className="player-panel player-panel--left"
        onReach={() => handleReach(3)}
        onRequestCancel={() => handleRequestCancel(3)}
        onWin={(method) => handleWin(3, method)}
        isDealer={round.dealerIndex === 3}
        onNameChange={(newName) => handleNameChange(3, newName)}
      />

      {/* センター情報 */}
      <CenterInfo 
        round={round} 
        reachSticks={reachSticks} 
        onDraw={handleDraw} 
        className="center-info" 
      />

      {/* 右側プレイヤー（右向き） */}
      <PlayerPanel
        {...players[1]}
        className="player-panel player-panel--right"
        onReach={() => handleReach(1)}
        onRequestCancel={() => handleRequestCancel(1)}
        onWin={(method) => handleWin(1, method)}
        isDealer={round.dealerIndex === 1}
        onNameChange={(newName) => handleNameChange(1, newName)}
      />

      {/* 下側プレイヤー（通常） */}
      <div className="mahjong-app__bottom-half">
        <PlayerPanel
          {...players[0]}
          className="player-panel player-panel--bottom"
          onReach={() => handleReach(0)}
          onRequestCancel={() => handleRequestCancel(0)}
          onWin={(method) => handleWin(0, method)}
          isDealer={round.dealerIndex === 0}
          onNameChange={(newName) => handleNameChange(0, newName)}
        />
      </div>

      {/* モーダル類はそのまま */}
      <ModalCancel
        visible={cancelIndex !== null}
        onConfirm={handleConfirmCancel}
        onCancel={handleModalCancel}
      />

      <ModalWin
        visible={showModalWin}
        winnerIndex={winnerIndex}
        players={players}
        onSubmit={handleWinSubmit}
        onCancel={handleWinCancel}
        initialMethod={initialMethod}
      />

      <ModalResult
        visible={showModalResult}
        result={winResult}
        players={players.map((p, i) => ({
          ...p,
          isDealer: i === winResult?.dealerIndex,
        }))}
        onClose={() => setShowModalResult(false)}
      />

      <ModalTenpai
        visible={showModalTenpai}
        players={players}
        onConfirm={handleTenpaiConfirm}
        onCancel={handleTenpaiCancel}
      />
    </div>
  );
}

export default App;