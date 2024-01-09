import { get } from 'svelte/store';
import startScoring from './score';
import { describe, it, expect } from 'vitest';

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

describe('Score counter', () => {
  it('starting score is 0 by default', async () => {
    const scoreStore = startScoring();
    const score = await new Promise(resolve => scoreStore.subscribe(resolve));
    expect(score).toEqual(0);
  });

  it('can accept starting score', async () => {
    const scoreStore = startScoring(42);
    const score = await new Promise(resolve => scoreStore.subscribe(resolve));
    expect(score).toEqual(42);
  });

  it('should display current score', async () => {
    const scoreStore = startScoring(0, { countDelay: 100 });
    const startTime = Date.now();
    const counterReachedThree = new Promise(resolve => {
      scoreStore.subscribe(displayedScore => {
        if (displayedScore === 3) {
          resolve(displayedScore);
        }
      });
    });
    const counterReachedFive = new Promise(resolve => {
      scoreStore.subscribe(displayedScore => {
        if (displayedScore === 5) {
          resolve(displayedScore);
        }
      });
    });

    scoreStore.newScore(5);

    await counterReachedThree;
    expect(Date.now() - startTime).toBeLessThanOrEqual(350);
    expect(Date.now() - startTime).toBeGreaterThanOrEqual(299);
    await counterReachedFive;
    expect(Date.now() - startTime).toBeLessThanOrEqual(550);
    expect(Date.now() - startTime).toBeGreaterThanOrEqual(499);
  });

  it('should end up with correct score if multiple calls in quick succession', async () => {
    const scoreStore = startScoring(0, { countDelay: 10 });

    scoreStore.newScore(5);
    scoreStore.newScore(10);
    scoreStore.newScore(13);
    scoreStore.newScore(15);

    await sleep(100);
    const finalValue = await new Promise(resolve =>
      scoreStore.subscribe(displayedScore => {
        resolve(displayedScore);
      }),
    );
    expect(finalValue).toEqual(15);
  });

  it.each([50, 370])(
    'setting score to smaller number should set it to that number in one and a half seconds (starting score: %s)',
    async startingScore => {
      const startTime = Date.now();
      const scoreStore = startScoring(startingScore, { countDelay: 1000 });
      const counterReachedZero = new Promise(resolve => {
        scoreStore.subscribe(displayedScore => {
          if (displayedScore === 0) {
            resolve(displayedScore);
          }
        });
      });

      scoreStore.newScore(0);

      await counterReachedZero;
      expect(Date.now() - startTime).toBeLessThan(1600);
      expect(Date.now() - startTime).toBeGreaterThan(1400);
    },
  );

  it.each([400, 1000, 10000])(
    'if difference when decreasing the score is to large, just set it to zero immediately',
    async startingScore => {
      const startTime = Date.now();
      const scoreStore = startScoring(startingScore, { countDelay: 1000 });
      const counterReachedZero = new Promise(resolve => {
        scoreStore.subscribe(displayedScore => {
          if (displayedScore === 0) {
            resolve(displayedScore);
          }
        });
      });

      scoreStore.newScore(0);

      await counterReachedZero;
      expect(Date.now() - startTime).toBeLessThan(50);
    },
  );

  it('setting to same score does nothing', async () => {
    const scoreStore = startScoring(50, { countDelay: 5 });

    scoreStore.newScore(50);

    await sleep(50);
    expect(get({ subscribe: scoreStore.subscribe })).toEqual(50);
  });
});
