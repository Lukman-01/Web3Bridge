import React from "react";

const Result = ({ score, quizLength, setShowResult, setRetry }) => {
	const handleRetry = () => {
		setShowResult(false);
		setRetry(true);
	};
	return (
		<div>
			<h2>Quiz Completed</h2>
			<p>
				Your score: {score} out of {quizLength}
			</p>

			<button
				className="bg-yellow-500 p-2 rounded-md disabled:opacity-30"
				onClick={handleRetry}
			>
				Retry
			</button>
		</div>
	);
};

export default Result;