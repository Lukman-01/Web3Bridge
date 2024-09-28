import React, { useEffect, useState } from "react";
import Result from "./Result";
import Questions from "./Questions";
import axios from "axios";

const Quiz = () => {
	const [quizData, setQuizData] = useState([]);
	const [score, setScore] = useState(0);
	const [showResult, setShowResult] = useState(false);
	const [retry, setRetry] = useState(false);
	console.log(retry);
	useEffect(() => {
		const getQuiz = async () => {
			const res = await axios.get(
				"https://opentdb.com/api.php?amount=10&type=multiple"
			);
			console.log(res.data);
			setQuizData(res.data.results);
		};
		getQuiz();
	}, []);

	if (quizData.length === 0) {
		return (
			<div className="flex min-h-screen justify-center text-white items-center text-4xl">
				Loading...
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="max-w-lg bg-gray-200 p-8 rounded-xl">
				{showResult ? (
					<h1 className="text-5xl text-center font-bold mb-4">Your Result</h1>
				) : (
					<h1 className="text-5xl text-center font-bold mb-4">Quiz App</h1>
				)}
				{showResult ? (
					<Result
						score={score}
						setShowResult={setShowResult}
						quizLength={quizData.length}
						setRetry={setRetry}
					/>
				) : (
					<Questions
						quizData={quizData}
						setScore={setScore}
						setShowResult={setShowResult}
						retry={retry}
					/>
				)}
			</div>
		</div>
	);
};

export default Quiz;