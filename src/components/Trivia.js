import { useState } from "react";
import styled from "styled-components";
import useSWR from "swr/immutable";
import { useTriviaMachine, STATE, ACTIONS } from "../state/triviaMachine";

const FETCHING_STATES = [STATE.easy, STATE.medium, STATE.hard];

const fetcher = async (url) => {
  const response = await fetch(url);
  const body = await response.json();
  if (!response.ok) throw body;
  return body.results;
};

export const Trivia = () => {
  const [state, send] = useTriviaMachine();
  const { data: questions, isValidating } = useSWR(
    FETCHING_STATES.includes(state.name)
      ? `https://opentdb.com/api.php?amount=20&category=18&difficulty=${state.name}`
      : null,
    {
      fetcher,
    }
  );
  const [response, setResponse] = useState(null);

  if (state.name === STATE.won) return <div>You win!</div>;
  if (state.name === STATE.lost) return <div>You lose :(</div>;
  if (isValidating || !questions) return <div>Loading...</div>;

  const decodeString = (string) => {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(
      `<!doctype html><body>${string}`,
      "text/html"
    ).body.textContent;
    return decodedString;
  };

  const questionCount = state.context.correct + state.context.incorrect;
  const currentQuestion = questions[questionCount];

  const possibleResponses = [
    ...currentQuestion.incorrect_answers,
    currentQuestion.correct_answer,
  ].sort((a, b) => a < b);

  const judgeResponse = (e) => {
    e.preventDefault();

    const correct = response === currentQuestion.correct_answer;
    alert(correct ? "Right!" : "Wrong!");
    send(ACTIONS.answer({ correct }));
  };

  const onSelectValue = (e) => {
    setResponse(e.target.value);
  };
  return (
    <Game>
      <Stats>
        <Stat fontColor="lightblue">
          Level: <span> {state.name}</span>
        </Stat>
        <div></div>
        <Stat fontColor="green">
          Won: <span> {state.context.correct}</span>
        </Stat>
        <div></div>
        <Stat fontColor="red">
          Lost: <span> {state.context.incorrect}</span>
        </Stat>
      </Stats>
      <GameState>
        <div>
          <Question>
            {currentQuestion && decodeString(currentQuestion.question)}
          </Question>

          {currentQuestion ? (
            <form onSubmit={judgeResponse}>
              <Answers>
                {possibleResponses.map((r, i) => (
                  <label>
                    <input
                      type="radio"
                      value={r}
                      onChange={onSelectValue}
                      checked={response === r}
                    />
                    {decodeString(r)}
                  </label>
                ))}
                <button type="submit">Submit</button>
              </Answers>
            </form>
          ) : (
            <p>Error! Question not found</p>
          )}
        </div>
      </GameState>
    </Game>
  );
};

const Game = styled.div`
  margin: 5rem;
`;
const GameState = styled.div``;
const Stats = styled.section`
  width: 100%;
  display: inline-grid;
  grid-template-columns: 2fr 1fr 2fr 1fr 2fr;
  margin-bottom: 2rem;
`;
const Stat = styled.div`
  display: flex;
  justify-content: space-around;
  color: ${(props) => props.fontColor};
`;
const Question = styled.div`
  margin: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
`;
const Answers = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  label {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  button {
    margin-top: 1rem;
    width: 200px;
  }
`;
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
