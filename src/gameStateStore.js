import { writable } from 'svelte/store';
import { newGame } from './core/newGame';
import { changeDirection } from './core/changeDirection';
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
