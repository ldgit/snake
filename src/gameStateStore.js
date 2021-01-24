import { writable } from 'svelte/store';
import { newGame } from './core/snake';

function createGameStateStore() {
  const { subscribe } = writable(newGame());

  return { subscribe };
}

export default createGameStateStore();
