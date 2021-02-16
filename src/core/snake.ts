import { writable } from 'svelte/store';
import { changeDirection } from './changeDirection';
import { moveSnake } from './moveSnake';
import { newGame } from './newGame';
import { getDefaultSpeed, speedMap } from './speedLevels';

const defaultDelay = speedMap[getDefaultSpeed()].delay;

interface snakeGameOptions {
  delay?: number;
  logger?: (message) => void
}

export default function startSnakeGame({ delay = defaultDelay, logger = () => {} }: snakeGameOptions) {
  const { subscribe, update } = writable(newGame());
  const commandQueue = [];
  let lastDelay = delay;
  let paused = false;

  function startTimer(delay) {
    return setInterval(() => {
      logger(`Calling setInterval handler (delay: ${delay})`);
      actuallyChangeDirection(update, commandQueue.shift());
      update(previous => {
        const newState = moveSnake(previous);
        if (newState.gameOver) {
          clearInterval(previousIntervalId);
        }

        return newState;
      });
    }, delay);
  }

  let previousIntervalId = startTimer(delay);

  function changeDelayBetweenMoves(newDelay) {
    lastDelay = newDelay;
    clearInterval(previousIntervalId);
    previousIntervalId = startTimer(newDelay);
  }

  return {
    subscribe,
    changeDirection(direction) {
      commandQueue.push(direction);
    },
    changeDelayBetweenMoves,
    togglePause() {
      if (paused) {
        changeDelayBetweenMoves(lastDelay);
        paused = false;
      } else {
        paused = true;
        clearInterval(previousIntervalId);
      }
    },
    destroy() {
      clearInterval(previousIntervalId);
    },
  };
}

function actuallyChangeDirection(update, newDirection) {
  if (newDirection) {
    update(previous => changeDirection(previous, newDirection));
  }
}
