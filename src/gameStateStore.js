import { writable } from 'svelte/store';
import { changeDirection, moveSnake, newGame } from './core/snake';

function createGameStateStore() {
  const { subscribe, update } = writable(newGame());

  return {
    subscribe,
    moveSnake: () => update(previousGameState => moveSnake(previousGameState)),
    changeDirection: direction => {
      if (!direction) {
        return;
      }
      update(previousGameState => changeDirection(previousGameState, direction));
    },
  };
}

export default createGameStateStore();
