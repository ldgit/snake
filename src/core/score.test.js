import startScoring from './score';

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
    expect(Date.now() - startTime).toBeLessThan(350);
    expect(Date.now() - startTime).toBeGreaterThan(299);
    await counterReachedFive;
    expect(Date.now() - startTime).toBeLessThan(550);
    expect(Date.now() - startTime).toBeGreaterThan(499);
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
});
