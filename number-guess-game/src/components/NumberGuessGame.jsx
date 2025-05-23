
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { saveScore, getTopScores } from '../firebase/scoreService';

const NumberGuessGame = () => {
	const [target, setTarget] = useState(generateNumber('normal'));
	const [input, setInput] = useState('');
	const [message, setMessage] = useState('');
	const [history, setHistory] = useState([]);
	const [attemptsLeft, setAttemptsLeft] = useState(10);
	const [difficulty, setDifficulty] = useState('normal');
	const [gameOver, setGameOver] = useState(false);
	const [timeLeft, setTimeLeft] = useState(60);
	const [scores, setScores] = useState([]);

	function generateNumber(diff) {
		if (diff === 'easy') return Math.floor(Math.random() * 50) + 1;
		if (diff === 'hard') return Math.floor(Math.random() * 200) + 1;
		return Math.floor(Math.random() * 100) + 1;
	}

	useEffect(() => {
		if (gameOver) return;
		const timer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					clearInterval(timer);
					setMessage(`시간 초과! 정답은 ${target}이었습니다.`);
					setGameOver(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(timer);
	}, [gameOver]);

	useEffect(() => {
		if (gameOver && message.includes('정답')) {
			const timeTaken = 60 - timeLeft;
			const newScore = {
				attempts: 10 - attemptsLeft + 1,
				time: timeTaken,
				timestamp: Date.now()
			};
			saveScore(newScore);
			getTopScores().then(setScores);
		}
	}, [gameOver]);

	function handleGuess() {
		const guess = parseInt(input);
		if (isNaN(guess)) {
			setMessage('숫자를 입력하세요.');
			return;
		}
		const newHistory = [...history, guess];
		setHistory(newHistory);
		setAttemptsLeft(prev => prev - 1);

		if (guess === target) {
			setMessage(`정답입니다! 🎉 (${60 - timeLeft}초 소요)`);
			setGameOver(true);
		} else if (guess < target) {
			setMessage('너무 작아요.');
		} else {
			setMessage('너무 커요.');
		}

		if (attemptsLeft - 1 <= 0 && guess !== target) {
			setMessage(`게임 오버! 정답은 ${target}이었습니다.`);
			setGameOver(true);
		}
	}

	function resetGame(diff = difficulty) {
		const limit = diff === 'easy' ? 15 : diff === 'hard' ? 5 : 10;
		setTarget(generateNumber(diff));
		setInput('');
		setMessage('');
		setHistory([]);
		setAttemptsLeft(limit);
		setDifficulty(diff);
		setGameOver(false);
		setTimeLeft(60);
	}

	return (
		<div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
			<h1>🎯 숫자 맞추기 게임</h1>
			<div>
				<button onClick={() => resetGame('easy')}>쉬움</button>
				<button onClick={() => resetGame('normal')}>보통</button>
				<button onClick={() => resetGame('hard')}>어려움</button>
			</div>
			<p>남은 시간: {timeLeft}초</p>
			<p>남은 기회: {attemptsLeft}</p>
			<input
				type="number"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				disabled={gameOver}
				placeholder="숫자를 입력하세요"
			/>
			<button onClick={handleGuess} disabled={gameOver || !input}>확인</button>
			<p>{message}</p>
			<div>
				<h2>📜 추측 히스토리</h2>
				<p>{history.join(', ') || '아직 없음'}</p>
			</div>
			<div>
				<h2>🏆 점수 순위표</h2>
				<ol>
					{scores.map((score, idx) => (
						<li key={idx}>시도: {score.attempts}회 / 시간: {score.time}초</li>
					))}
				</ol>
			</div>
		</div>
	);
};

export default NumberGuessGame;
