// src/components/Question.jsx

import React from "react";

function Question({ question, onAnswer, fixImagePath }) {
  return (
    <div className="fu-calculator__question">
      <h2>{question.text}</h2>

      {/* 画像が指定されていれば表示 */}
      {question.image && (
        <div className="fu-calculator__image-container">
          <img
            src={fixImagePath ? fixImagePath(question.image) : question.image}
            alt="question related"
            className="fu-calculator__image"
          />
        </div>
      )}

      <div className="fu-calculator__options">
        {question.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => onAnswer(choice)}
            className="btn btn--light"
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;