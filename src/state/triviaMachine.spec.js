import { renderHook } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";
import { ACTIONS, STATE, useTriviaMachine } from "./triviaMachine";

const renderTriviaMachine = () => {
  const { result } = renderHook(() => useTriviaMachine());

  return {
    send(action) {
      act(() => {
        result.current[1](action);
      });
    },
    state: {
      get name() {
        return result.current[0].name;
      },
      get context() {
        return result.current[0].context;
      },
    },
  };
};

describe("useTriviaMachine", () => {
  it("should lose after 3 wrong answers", () => {
    const { send, state } = renderTriviaMachine();

    send(ACTIONS.answer({ correct: false }));
    send(ACTIONS.answer({ correct: false }));
    send(ACTIONS.answer({ correct: false }));

    expect(state).toEqual({
      name: STATE.lost,
      context: {
        correct: 0,
        incorrect: 0,
      },
    });
  });

  it("should advance to medium after 3 correct answers", () => {
    const { send, state } = renderTriviaMachine();

    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));

    expect(state).toEqual({
      name: STATE.medium,
      context: {
        correct: 0,
        incorrect: 0,
      },
    });
  });

  it("should drop to easy after 3 correct answers & 3 incorrect answers", () => {
    const { send, state } = renderTriviaMachine();

    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));

    send(ACTIONS.answer({ correct: false }));
    send(ACTIONS.answer({ correct: false }));
    send(ACTIONS.answer({ correct: false }));

    expect(state).toEqual({
      name: STATE.easy,
      context: {
        correct: 0,
        incorrect: 0,
      },
    });
  });

  it("should advance to hard after 6 correct answers", () => {
    const { send, state } = renderTriviaMachine();

    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));

    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));

    expect(state).toEqual({
      name: STATE.hard,
      context: {
        correct: 0,
        incorrect: 0,
      },
    });
  });

  it("should drop to medium after 6 correct answers & 3 wrong answers", () => {
    const { send, state } = renderTriviaMachine();

    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));

    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));

    send(ACTIONS.answer({ correct: false }));
    send(ACTIONS.answer({ correct: false }));
    send(ACTIONS.answer({ correct: false }));

    expect(state).toEqual({
      name: STATE.medium,
      context: {
        correct: 0,
        incorrect: 0,
      },
    });
  });

  it("should win after 9 correct answers", () => {
    const { send, state } = renderTriviaMachine();

    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));

    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));

    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));
    send(ACTIONS.answer({ correct: true }));

    expect(state).toEqual({
      name: STATE.won,
      context: {
        correct: 0,
        incorrect: 0,
      },
    });
  });
});
