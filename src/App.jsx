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
import ModalHaipai from './components/ModalHaipai'
import ModalOthers from './components/ModalOthers'
import ModalRanking from './components/ModalRanking'
import ModalPenalty from './components/ModalPenalty'
import ModalExport from './components/ModalExport'
import ModalScoreHistory from './components/ModalScoreHistory'
import ModalUrlGenerator from './components/ModalUrlGenerator'

import scoreTable  from './scoreTable'

import './App.css'

const winds = ["東", "南", "西", "北"];

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

// 配牌開始列を計算する関数を追加（calculateScore関数の後に）
const generateHaipaiStart = () => {
  // const winds = ["東", "南", "西", "北"];
  const randomWind = winds[Math.floor(Math.random() * winds.length)];
  const randomColumn = Math.floor(Math.random() * 11) + 2; // 2-12の範囲
  return `${randomWind}家の右から${randomColumn}列`;
};


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
    dealerIndex: isNaN(dealerIndexParam) ? Math.floor(Math.random() * 4) : dealerIndexParam,
  });
  const [showModalTenpai, setShowModalTenpai] = useState(false);
  const [tenpaiIndexes, setTenpaiIndexes] = useState([]);

  
  const [showModalHaipai, setShowModalHaipai] = useState(false);
  const [showModalOthers, setShowModalOthers] = useState(false);
  const [showModalRanking, setShowModalRanking] = useState(false);
  const [showModalPenalty, setShowModalPenalty] = useState(false);
  const [showModalExport, setShowModalExport] = useState(false);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [showModalScoreHistory, setShowModalScoreHistory] = useState(false);
  const [showModalUndoConfirm, setShowModalUndoConfirm] = useState(false);
  const [undoPreview, setUndoPreview] = useState(null);
  const [showModalUrlGenerate, setShowModalUrlGenerate] = useState(false);

  //handle集


    // URL生成関連のハンドラー（他のハンドラーと一緒に追加）
  
    // URL生成モーダルを開く
    const handleUrlGenerate = () => {
      setShowModalOthers(false);
      setShowModalUrlGenerate(true);
    };

    // URL生成モーダルを閉じる
    const handleUrlGenerateClose = () => {
      setShowModalUrlGenerate(false);
    };
    
    // 配牌開始列ボタンのハンドラーを追加
    const handleHaipai = () => {
      setShowModalHaipai(true);
    };

    const handleHaipaiClose = () => {
      setShowModalHaipai(false);
    };

    // その他ボタンのハンドラー
    const handleOthers = () => {
      setShowModalOthers(true);
    };

    const handleOthersClose = () => {
      setShowModalOthers(false);
    };

    // 2. handleUndoRequest - 1つ戻るボタンが押された時（handleOthers関数の後に追加）
    const handleUndoRequest = () => {
      if (scoreHistory.length === 0) {
        alert('戻る履歴がありません');
        return;
      }
      
      const lastHistory = scoreHistory[scoreHistory.length - 1];
      
      // 現在リーチしている人をチェック
      const currentReachPlayers = players
        .map((player, index) => ({ ...player, index }))
        .filter(player => player.reached);
      
      console.log("現在リーチしているプレイヤー:", currentReachPlayers);
      
      // プレビューに現在のリーチ情報も含める
      const enhancedPreview = {
        ...lastHistory,
        currentReachPlayers: currentReachPlayers.map(p => p.name),
        currentReachCount: currentReachPlayers.length
      };
      
      setUndoPreview(enhancedPreview);
      setShowModalUndoConfirm(true);
    };

    // 3. handleUndoConfirm - 戻ることを確認した時
    const handleUndoConfirm = () => {
      if (scoreHistory.length === 0) return;
      
      const lastHistory = scoreHistory[scoreHistory.length - 1];
      const updatedPlayers = [...players];
      
      // 履歴データの整合性チェック
      if (!lastHistory || !lastHistory.reachStates || !Array.isArray(lastHistory.reachStates) || 
          !lastHistory.scoreChanges || !Array.isArray(lastHistory.scoreChanges)) {
        alert('履歴データが不完全で復元できません');
        setShowModalUndoConfirm(false);
        setUndoPreview(null);
        return;
      }
      
      // 現在リーチしている人の情報を保存
      const currentReachPlayers = players
        .map((player, index) => ({ ...player, index }))
        .filter(player => player.reached);
      
      console.log("戻る前の現在リーチプレイヤー:", currentReachPlayers);
      console.log("復元するリーチ状態:", lastHistory.reachStates);
      
      // まず点数変動を逆算して復元
      lastHistory.scoreChanges.forEach((change, index) => {
        if (change && typeof change.change === 'number') {
          updatedPlayers[index].score -= change.change;
        }
      });
      
      // 現在リーチしている全ての人をまず解除し、1000点を戻す
      // これにより、履歴後に行われたリーチを全て取り消す
      currentReachPlayers.forEach(({ index }) => {
        updatedPlayers[index].score += 1000;
        updatedPlayers[index].reached = false;
        console.log(`${updatedPlayers[index].name}のリーチを解除し、1000点を復元`);
      });
      
      // 次に、履歴時点でリーチしていた人を復元
      // この時点で既にすべてのリーチは解除されているので、単純に設定するだけ
      lastHistory.reachStates.forEach((wasReached, index) => {
        if (wasReached && index < updatedPlayers.length) {
          updatedPlayers[index].reached = true;
          // 履歴時点でリーチしていた場合は1000点を差し引く必要はない
          // （元の点数復元で既に処理済み）
        }
      });
      
      // リーチ棒の復元（履歴に保存された値、または0）
      setReachSticks(lastHistory.currentReachSticks || 0);
      
      // 局情報の復元
      if (lastHistory.roundInfo) {
        setRound(lastHistory.roundInfo);
      }
      
      // 履歴から最後の項目を削除
      setScoreHistory(prev => prev.slice(0, -1));
      
      // プレイヤー状態を更新
      setPlayers(updatedPlayers);
      
      // モーダルを閉じる
      setShowModalUndoConfirm(false);
      setShowModalOthers(false);
      setUndoPreview(null);
    };

    // 4. handleUndoCancel - 戻ることをキャンセルした時
    const handleUndoCancel = () => {
      setShowModalUndoConfirm(false);
      setUndoPreview(null);
    };

    // 順位モーダルのハンドラー
    const handleRanking = () => {
      setShowModalOthers(false);
      setShowModalRanking(true);
    };

    const handleRankingClose = () => {
      setShowModalRanking(false);
    };

    // 罰符モーダルのハンドラー
    const handlePenalty = () => {
      setShowModalOthers(false);
      setShowModalPenalty(true);
    };

    const handlePenaltyConfirm = (chonboPlayerIndex) => {
      const originalScores = players.map(p => p.score); // 履歴用に元の点数を保存
      const updatedPlayers = [...players];
      const chonboPlayer = updatedPlayers[chonboPlayerIndex];
      const isChonboDealer = chonboPlayerIndex === round.dealerIndex;

      let details = [];
      let totalPenalty = 0;

      if (isChonboDealer) {
        // 親のチョンボ：他家全員に4000点ずつ支払い
        updatedPlayers.forEach((player, index) => {
          if (index !== chonboPlayerIndex) {
            player.score += 4000;
            chonboPlayer.score -= 4000;
            totalPenalty += 4000;
            details.push({
              from: chonboPlayer.name,
              to: player.name,
              points: 4000,
            });
          }
        });
      } else {
        // 子のチョンボ：親に4000点、他の子に2000点ずつ支払い
        updatedPlayers.forEach((player, index) => {
          if (index !== chonboPlayerIndex) {
            const penalty = index === round.dealerIndex ? 4000 : 2000;
            player.score += penalty;
            chonboPlayer.score -= penalty;
            totalPenalty += penalty;
            details.push({
              from: chonboPlayer.name,
              to: player.name,
              points: penalty,
            });
          }
        });
      }

      // 点数変動を計算
      const scoreChanges = updatedPlayers.map((player, index) => ({
        name: player.name,
        change: player.score - originalScores[index]
      }));

      setPlayers(updatedPlayers);
      setShowModalPenalty(false);

      // 履歴に追加
      addToHistory(`チョンボ（${chonboPlayer.name}）`, details, 0, scoreChanges, players[round.dealerIndex].name);

      // 結果表示
      setWinResult({
        winner: "チョンボ",
        method: "penalty",
        han: 0,
        fu: 0,
        details,
        reachBonus: 0,
        totalGain: totalPenalty,
        dealerIndex: round.dealerIndex,
        chonboPlayer: chonboPlayer.name,
      });

      setShowModalResult(true);
    };

    const handlePenaltyCancel = () => {
      setShowModalPenalty(false);
    };

    // エクスポートモーダルのハンドラー
    const handleExport = () => {
      setShowModalOthers(false);
      setShowModalExport(true);
    };

    const handleExportClose = () => {
      setShowModalExport(false);
    };

    const handleCsvExport = (csvContent, filename) => {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setShowModalExport(false);
    };

    // 自風を計算する関数
    const getPlayerWind = (playerIndex) => {
      // 親（dealerIndex）が東風、そこから時計回りに南・西・北
      const windIndex = (playerIndex - round.dealerIndex + 4) % 4;
      return winds[windIndex];
    };

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
      setShowModalOthers(false);
      setShowModalTenpai(true);
      
    };

    // 6. handleTenpaiConfirm の更新（既存の関数を置き換え）
    const handleTenpaiConfirm = (indexes) => {
      setShowModalTenpai(false);
      setTenpaiIndexes(indexes);

      const originalScores = players.map(p => p.score); // 履歴用に元の点数を保存
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

      // 点数変動を計算
      const scoreChanges = updated.map((player, index) => ({
        name: player.name,
        change: player.score - originalScores[index]
      }));

      setPlayers(updated);

      // 履歴に追加
      const tenpaiNames = tenpai.map(i => players[i].name).join(', ');
      const historyType = tenpai.length === 0 ? "流局（全員ノーテン）" : 
                        tenpai.length === 4 ? "流局（全員テンパイ）" : 
                        `流局（テンパイ: ${tenpaiNames}）`;
      addToHistory(historyType, details, 0, scoreChanges, players[round.dealerIndex].name);

      setWinResult({
        winner: "流局",
        method: "ryukyoku",
        han: 0,
        fu: 0,
        details,
        reachBonus: 0,
        totalGain: totalPenalty,
        dealerIndex: round.dealerIndex,
      });

      setShowModalResult(true);
      resetReach();
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

    // 7. handleWinSubmit の更新（既存の関数を置き換え）

    const handleWinSubmit = ({ han, fu, method, loserIndex }) => {
      const originalScores = players.map(p => p.score);
      const originalRound = { ...round }; // 現在の局情報を保存
      const originalReachStates = players.map(p => p.reached);
      const originalReachSticks = reachSticks;
      
      const updatedPlayers = [...players];
      const winner = updatedPlayers[winnerIndex];
      const winnerIsDealer = winnerIndex === round.dealerIndex;

      const result = calculateScore({
        han,
        fu,
        isDealer: winnerIsDealer,
        isTsumo: method === "tsumo",
      });

      if (result.error) {
        alert(result.error);
        return;
      }

      let details = [];
      let gain = 0;
      let reachBonus = 0; // reachBonusを定義

      if (method === "tsumo") {
        // ツモの場合
        if (winnerIsDealer) {
          // 親ツモ
          const childPay = result.child;
          updatedPlayers.forEach((player, index) => {
            if (index !== winnerIndex) {
              player.score -= childPay;
              details.push({
                from: player.name,
                to: winner.name,
                points: childPay,
              });
            }
          });
          gain = childPay * 3;
        } else {
          // 子ツモ
          const parentPay = result.parent;
          const childPay = result.child;
          updatedPlayers.forEach((player, index) => {
            if (index !== winnerIndex) {
              const payment = index === round.dealerIndex ? parentPay : childPay;
              player.score -= payment;
              details.push({
                from: player.name,
                to: winner.name,
                points: payment,
              });
            }
          });
          gain = parentPay + (childPay * 2);
        }
      } else {
        // ロンの場合
        const loser = updatedPlayers[loserIndex];
        const payment = result.total;
        loser.score -= payment;
        gain = payment;
        details.push({
          from: loser.name,
          to: winner.name,
          points: payment,
        });
      }

      // リーチボーナスの計算
      if (reachSticks > 0) {
        reachBonus = reachSticks * 1000;
        gain += reachBonus;
      }

      // 勝者に得点を加算
      winner.score += gain;

      // 点数変動を計算
      const scoreChanges = updatedPlayers.map((player, index) => ({
        name: player.name,
        change: player.score - originalScores[index]
      }));

      const resetPlayers = updatedPlayers.map((p) => ({ ...p, reached: false }));
      setPlayers(resetPlayers);
      setReachSticks(0);
      setShowModalWin(false);

      // 履歴に追加（advanceRoundより前）
      const historyType = `${winner.name} ${method === "tsumo" ? "ツモ" : "ロン"} ${han}翻${fu}符`;
      const historyItem = {
        wind: originalRound.wind,
        number: originalRound.number,
        type: historyType,
        details,
        reachBonus: reachBonus,
        scoreChanges,
        dealerName: players[originalRound.dealerIndex].name,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        roundInfo: originalRound, // 元の局情報
        reachStates: originalReachStates,
        currentReachSticks: originalReachSticks
      };
      setScoreHistory(prev => [...prev, historyItem]);

      setWinResult({
        winner: winner.name,
        han,
        fu,
        method,
        details,
        reachBonus,
        totalGain: gain,
        dealerIndex: round.dealerIndex,
        label: result.type || null,
      });

      setShowModalResult(true);
      advanceRound(winnerIndex, []); // これを最後に実行
    };
      

    const handleWinCancel = () => {
      setShowModalWin(false);
    };

    const handleReach = (index) => {
      if (players[index].reached || players[index].score < 1000) return;
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

    // 3. 履歴に項目を追加する関数（他のハンドラー関数と一緒に追加）
    const addToHistory = (type, details, reachBonus = 0, scoreChanges = [], dealerName = "") => {
      const timestamp = new Date().toLocaleTimeString('ja-JP', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const historyItem = {
        wind: round.wind,
        number: round.number,
        type,
        details,
        reachBonus,
        scoreChanges,
        dealerName,
        timestamp,
        // 局情報を保存（undo用）
        roundInfo: {
          wind: round.wind,
          number: round.number,
          dealerIndex: round.dealerIndex
        },
        // リーチ状態も保存
        reachStates: players.map(p => p.reached),
        currentReachSticks: reachSticks
      };
      
      setScoreHistory(prev => [...prev, historyItem]);
    };

  // 4. 点数移動履歴モーダルのハンドラー（他のモーダルハンドラーと一緒に追加）
    const handleScoreHistory = () => {
      setShowModalOthers(false);
      setShowModalScoreHistory(true);
    };

    const handleScoreHistoryClose = () => {
      setShowModalScoreHistory(false);
    };

    const handleScoreHistoryCsvExport = (csvContent, filename) => {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setShowModalScoreHistory(false);
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
              wind={getPlayerWind(2)}
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
            wind={getPlayerWind(3)}
          />

          {/* センター情報 */}
          <CenterInfo 
            round={round} 
            reachSticks={reachSticks} 
            onHaipai={handleHaipai}
            onOthers={handleOthers}
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
            wind={getPlayerWind(1)}
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
              wind={getPlayerWind(0)}
            />
          </div>

          {/* モーダル類 */}
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

          <ModalHaipai
            visible={showModalHaipai}
            onClose={handleHaipaiClose}
            generateStart={generateHaipaiStart}
          />

          <ModalOthers
            visible={showModalOthers}
            onClose={handleOthersClose}
            onRanking={handleRanking}
            onPenalty={handlePenalty}
            onExport={handleExport}
            onScoreHistory={handleScoreHistory}
            onConfirm={handleTenpaiConfirm}
            onCancel={handleTenpaiCancel}
            onDraw={handleDraw}
            onUndo={handleUndoRequest}
            onUrlGenerate={handleUrlGenerate}
          />

          <ModalRanking
            visible={showModalRanking}
            players={players}
            onClose={handleRankingClose}
          />

          <ModalPenalty
            visible={showModalPenalty}
            players={players}
            round={round}
            onConfirm={handlePenaltyConfirm}
            onCancel={handlePenaltyCancel}
          />

          <ModalExport
            visible={showModalExport}
            players={players}
            round={round}
            onClose={handleExportClose}
            onExport={handleCsvExport}
          />

          <ModalScoreHistory
            visible={showModalScoreHistory}
            history={scoreHistory}
            onClose={handleScoreHistoryClose}
            onCsvExport={handleScoreHistoryCsvExport}
          />

          <ModalUrlGenerator
            visible={showModalUrlGenerate}
            players={players}
            onClose={handleUrlGenerateClose}
          />

          {showModalUndoConfirm && (
            <div className="modal-backdrop">
              <div className="modal modal--medium">
                <div className="modal__header">
                  <h2 className="modal__title">1つ戻る確認</h2>
                </div>
                <div className="modal__content">
                  <p>本当に1つ戻しますか？</p>
                  {undoPreview && (
                    <div className="undo-preview">
                      <h3>削除される履歴:</h3>
                      <div className="undo-preview__item">
                        <div className="undo-preview__header">
                          <span className="undo-preview__round">{undoPreview.wind}{undoPreview.number}局</span>
                          <span className="undo-preview__time">{undoPreview.timestamp}</span>
                        </div>
                        <div className="undo-preview__type">{undoPreview.type}</div>
                        <div className="undo-preview__changes">
                          {undoPreview.scoreChanges.map((change, index) => {
                            const changeClass = change.change > 0 ? 'undo-preview__change--positive' : 
                                              change.change < 0 ? 'undo-preview__change--negative' : 
                                              'undo-preview__change--neutral';
                            return (
                              <div key={index} className={`undo-preview__change ${changeClass}`}>
                                {change.name}: {change.change > 0 ? '+' : ''}{change.change}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal__actions">
                  <button className="btn btn--danger" onClick={handleUndoConfirm}>
                    はい
                  </button>
                  <button className="btn btn--secondary" onClick={handleUndoCancel}>
                    いいえ
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
    );
}

export default App;