/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

export const Trivia = () => {

	const [questions, setQuestions] = useState([])
	const [questionCount, setQuestionCount] = useState(0)
	const [correctCount, setCorrectCount] = useState(0)
	const [wrongCount, setWrongCount] = useState(0)


	const fetchQuestions = async () => {
		const url = `https://opentdb.com/api.php?amount=20&category=18&difficulty=easy`
		const res = await fetch(url)
		const questions = await res.json()
		setQuestions(questions.results)
	};

	useEffect(() => {
		fetchQuestions()
	}, [])

	const decodeString = (string) => {
		const parser = new DOMParser();
		const decodedString = parser.parseFromString(`<!doctype html><body>${string}`, 'text/html').body.textContent;
		return decodedString
	}

	const [response, setResponse] = useState(null);
	const currentQuestion = questions[questionCount]

	const possibleResponses = currentQuestion && 
		[...currentQuestion?.incorrect_answers, currentQuestion?.correct_answer]
		.sort((a, b) => a < b)

	const judgeResponse = e => {
		e.preventDefault()
		if (response === currentQuestion?.correct_answer) {
			alert("Right!")
			setCorrectCount(correctCount => correctCount + 1)
		} else {
			alert("Wrong!")
			setWrongCount(wrongCount => wrongCount + 1)
		}
		setQuestionCount(questionCount => questionCount + 1)
	}

	const onSelectValue = e => {
		setResponse(e.target.value)
	}
	return (
		<Game>	
			<Stats>
				<h5>Level: Easy</h5>
				<h5>Won: { correctCount}</h5>
				<h5>Lost: { wrongCount}</h5>
			</Stats>
			<GameState>
				<div>
					{ currentQuestion && decodeString(currentQuestion?.question) }

					{ currentQuestion ? 
					<form onSubmit={ judgeResponse }>
						<Answers>
							{possibleResponses?.map((r, i) => (
								<label>
									<input 
										type='radio' 
										value={r} 
										onChange={ onSelectValue } 
										checked={response === r}
									/>
									{decodeString(r)}
								</label>
							))}		
						</Answers>		
						<button type='submit'>Submit</button>
					</form>
					:
					null
					}
				</div>
			</GameState>

		</Game>
	)
};

const Game = styled.div `
	margin: 5rem;
`
const GameState = styled.div `

`
const Stats = styled.section `
	width: 100%;
	display: inline-grid;
	grid-template-columns: 1fr 1fr 1fr;
`
const Answers = styled.div `
	display: flex;
	flex-direction: column;
`
// {
// 	"category": "Science: Computers",
// 	"type": "multiple",
// 	"difficulty": "easy",
// 	"question": "What does CPU stand for?",
// 	"correct_answer": "Central Processing Unit",
// 	"incorrect_answers": [
// 		"Central Process Unit",
// 		"Computer Personal Unit",
// 		"Central Processor Unit"
// 	]
// },