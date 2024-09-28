import React, { useEffect, useMemo, useState } from "react";

const Questions = ({ quizData, setScore, setShowResult, retry }) => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState({});
	console.log(retry);

	useEffect(() => {
		if (retry) {
			setCurrentQuestionIndex(0);
			setSelectedAnswer({});
			setShowResult(false);
		}
	}, [retry]);

	const decodeHtmlEntities = (str) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(str, "text/html");
		return doc.documentElement.textContent;
	};

	const currentQuestion = useMemo(
		() => quizData[currentQuestionIndex],
		[currentQuestionIndex]
	);
	const allAnswers = useMemo(
		() =>
			[
				...currentQuestion.incorrect_answers,
				currentQuestion.correct_answer,
			].sort(),
		[currentQuestion]
	);

	const handleAnswerSelect = (answer) => {
		setSelectedAnswer((prev) => {
			return { ...prev, [currentQuestionIndex]: answer };
		});
	};

	const calculateResult = () => {
		quizData.forEach((question, index) => {
			if (selectedAnswer[index] === question.correct_answer) {
				setScore((prev) => prev + 1);
			}
		});
	};

	const handleSubmit = () => {
		if (currentQuestionIndex + 1 < quizData.length) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			calculateResult();
			setShowResult(true);
		}
	};
	const handlePrev = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		}
	};

	const submitText = useMemo(
		() => (currentQuestionIndex + 1 < quizData.length ? "Next" : "Submit"),
		[currentQuestionIndex]
	);

	return (
		<div>
			<p className="text-lg">
				{currentQuestionIndex + 1}/{quizData.length}
			</p>
			<h2 className="text-3xl mb-4">
				{decodeHtmlEntities(currentQuestion.question)}
			</h2>
			<ul className="space-y-2">
				{allAnswers.map((answer, index) => (
					<li key={index}>
						<label>
							<input
								type="radio"
								name="answer"
								value={answer}
								onChange={() => handleAnswerSelect(answer)}
								checked={selectedAnswer[currentQuestionIndex] === answer}
							/>
							{answer}
						</label>
					</li>
				))}
			</ul>
			<div className="flex justify-between">
				<button
					className="bg-yellow-500 p-2 rounded-md disabled:opacity-30"
					onClick={handlePrev}
					disabled={currentQuestionIndex < 1}
				>
					Prev
				</button>
				<button
					className={`  p-2 rounded-md disabled:opacity-30 ${
						submitText === "Next" ? "bg-green-500" : "bg-blue-600 text-white"
					}`}
					onClick={handleSubmit}
				>
					{submitText}
				</button>
			</div>
		</div>
	);
};

export default Questions;