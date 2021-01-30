import { writable } from 'svelte/store';
import { changeDirection, newGame } from './core/snake';
import { moveSnake } from './core/moveSnake';

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
