import { useEffect, useState } from "react";
import {
  createMachine,
  guard,
  reduce,
  state,
  state as final,
  transition,
} from "robot3";
import { createUseMachine } from "robot-hooks";

const useMachine = createUseMachine(useEffect, useState);

export const STATE = {
  easy: "easy",
  medium: "medium",
  hard: "hard",
  won: "won",
  lost: "lost",
};

export const ACTION_TYPES = {
  answer: "answer",
};

export const ACTIONS = {
  answer: ({ correct }) => ({
    type: ACTION_TYPES.answer,
    payload: { correct },
  }),
};

const createInitialContext = ({ correct = 0, incorrect = 0 } = {}) => ({
  correct,
  incorrect,
});

const isThirdCorrectAnswer = (ctx, { payload }) =>
  ctx.correct + (payload.correct ? 1 : 0) >= 3;

const isThirdWrongAnswer = (ctx, { payload }) =>
  ctx.incorrect + (payload.correct ? 0 : 1) >= 3;

const saveAnswerReducer = (ctx, { payload }) =>
  payload.correct
    ? { ...ctx, correct: ctx.correct + 1 }
    : { ...ctx, incorrect: ctx.incorrect + 1 };

const changeLevelReducer = () => ({
  correct: 0,
  incorrect: 0,
});

const levelUpTransition = (to) =>
  transition(
    ACTION_TYPES.answer,
    to,
    guard(isThirdCorrectAnswer),
    reduce(changeLevelReducer)
  );

const levelDownTransition = (to) =>
  transition(
    ACTION_TYPES.answer,
    to,
    guard(isThirdWrongAnswer),
    reduce(changeLevelReducer)
  );

const saveAnswerTransition = (to) =>
  transition(ACTION_TYPES.answer, to, reduce(saveAnswerReducer));

const triviaMachine = createMachine(
  STATE.easy,
  {
    [STATE.easy]: state(
      levelUpTransition(STATE.medium),
      levelDownTransition(STATE.lost),
      saveAnswerTransition(STATE.easy)
    ),
    [STATE.medium]: state(
      levelUpTransition(STATE.hard),
      levelDownTransition(STATE.easy),
      saveAnswerTransition(STATE.medium)
    ),
    [STATE.hard]: state(
      levelUpTransition(STATE.won),
      levelDownTransition(STATE.medium),
      saveAnswerTransition(STATE.hard)
    ),
    [STATE.lost]: final(),
    [STATE.won]: final(),
  },
  createInitialContext
);

export const useTriviaMachine = () => useMachine(triviaMachine);
