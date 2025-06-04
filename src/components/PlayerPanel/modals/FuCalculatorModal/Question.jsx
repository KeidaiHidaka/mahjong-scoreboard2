function Question({ question, onAnswer}) {
  return (
    <div>
      <h2>{question.text}</h2>

      {/* 画像が指定されていれば表示 */}
      {question.image && (
        <div style={{ textAlign: "center" }}>
            <img
                src={question.image}
                alt="question related"
                style={{ maxWidth: "70%", height: "auto", marginBottom: "20px" }}
            />
        </div>
      )}


      {question.choices.map((choice, i) => (
        <div style={{ textAlign: "center",justifyContent: "center", }}>
            <button
                key={i}
                onClick={() => onAnswer(choice)}
                style={{ margin: "10px"}}
            >
            {choice.label}
            </button>
        </div>
      ))}
    </div>
  );
}

export default Question;
