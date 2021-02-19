import { writable } from 'svelte/store';

interface ScoreStore {
  subscribe(subscriber): () => void;
  newScore(newScore: number): void;
}

export default function startScoring(startingScore = 0, options = { countDelay: 20 }): ScoreStore {
  const { subscribe, update } = writable(startingScore);
  let current = startingScore;

  return {
    subscribe,
    newScore(newScore) {
      if (newScore < current) {
        const difference = current - newScore;
        const step = 1500 / difference;
        if (step < 4) {
          update(() => newScore);
        } else {
          for (let index = current; index > newScore; index--) {
            setTimeout(() => update(previous => previous - 1), index * step);
          }
        }
      } else {
        for (let index = 1; index <= newScore - current; index++) {
          setTimeout(() => update(previous => previous + 1), index * options.countDelay);
        }
      }
      current = newScore;
    },
  };
}
