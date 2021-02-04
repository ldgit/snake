import { writable } from 'svelte/store';

export default function startScoring(startingScore = 0, options = { countDelay: 20 }) {
  const { subscribe, update } = writable(startingScore);
  let current = startingScore;

  return {
    subscribe,
    newScore(newScore) {
      for (let index = 1; index <= newScore - current; index++) {
        setTimeout(() => {
          update(previous => previous + 1);
        }, index * options.countDelay);
      }
      current = newScore;
    },
  };
}
