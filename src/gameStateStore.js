import { writable } from 'svelte/store';
import { moveSnake, newGame } from './core/snake';

function createGameStateStore() {
  const { subscribe, update } = writable(newGame());

  return {
    subscribe,
    moveSnake: () => update(previousGameState => moveSnake(previousGameState)),
  };
}

export default createGameStateStore();
