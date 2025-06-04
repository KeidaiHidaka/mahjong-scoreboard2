// Result.jsx
import questions from '../../../questions'; // ← 同じディレクトリなので './questions'

function Result({ roundUpPoints, history, totalPoints }) {
    const last = history[history.length - 1];

    const isOverride = last?.override;
    const displayPoints = isOverride ? last.points : roundUpPoints;
    
    return (
        <div>
            <h2>結果：{displayPoints}符</h2>
            {!isOverride && <h4>※繰り上げ前の符数：{totalPoints}符</h4>}
            {isOverride && <h4 style={{ color: "red" }}>※例外処理で符計算上書き</h4>}

            <h3>📝 質問と回答：</h3>
            <ul>
                {history.map((h, i) => (
                    <li key={i}>
                        {questions[h.id]?.text} → <strong>{h.label}</strong>
                        {h.points > 0 && (
                            <span className="point-highlight">+{h.points}符</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Result;