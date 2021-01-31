import startSnakeGame from './snake';
import { selectDirection, selectField } from './selectors';
import { WIDTH, HEIGHT, STARTING_ROW } from './utils';

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

describe('snake game', () => {
  it('can start new game', async () => {
    const snakeGame = startSnakeGame({});

    const initialGameState = await stateAfterUpdates(snakeGame, 0);

    const field = selectField(initialGameState);
    // Total number of squares minus food and snake squares
    expect(field.flat().filter(({ type }) => type === 'empty')).toHaveLength(
      WIDTH * HEIGHT - 1 - 6,
    );
  });

  it.each([40, 120, 200])('updates game state whenever snake moves (delay: %s)', async delay => {
    const startTime = Date.now();
    const snakeGame = startSnakeGame({ delay });
    const stateUpdated = stateAfterUpdates(snakeGame, 1);

    const newState = await stateUpdated;
    expect(Date.now() - startTime).toBeGreaterThan(delay - 1);
    expect(
      selectField(newState)[STARTING_ROW].filter(({ type }) => type === 'snake').length,
    ).toBeGreaterThanOrEqual(6);
  });

  it('allows controlling snake direction', async () => {
    const snakeGame = startSnakeGame({ delay: 20 });
    const snakeGoesDown = new Promise(resolve =>
      snakeGame.subscribe(newState => {
        if (newState.direction === 'down') {
          resolve(newState);
        }
      }),
    );

    snakeGame.changeDirection('down');

    expect(selectDirection(await snakeGoesDown)).toEqual('down');
  });

  it('should queue change direction commands', async () => {
    const startingTime = Date.now();
    const snakeGame = startSnakeGame({ delay: 100 });
    const stateAfterFirstDirectionChange = stateAfterUpdates(snakeGame, 1);
    const snakeTurnsLeft = new Promise(resolve =>
      snakeGame.subscribe(newState => {
        if (newState.direction === 'left') {
          resolve(newState);
        }
      }),
    );

    snakeGame.changeDirection('down');
    snakeGame.changeDirection('left');

    expect(selectDirection(await stateAfterFirstDirectionChange)).toEqual('down');
    // First change in direction needs to happen after snake moves one more square, ie. after at least `delay` milliseconds
    expect(Date.now() - startingTime).toBeGreaterThan(100);
    expect(selectDirection(await snakeTurnsLeft)).toEqual('left');
    // Second change in direction needs to happen after snake moves one more square, ie. after at least 2 x `delay` milliseconds
    expect(Date.now() - startingTime).toBeGreaterThan(200);
  });

  it('can be sped up', async () => {
    const startTime = Date.now();
    const snakeGame = startSnakeGame({ delay: 1000 });
    const stateAfterTwoUpdates = stateAfterUpdates(snakeGame, 2);

    snakeGame.changeDelayBetweenMoves(50);

    await stateAfterTwoUpdates;
    expect(Date.now() - startTime).toBeLessThan(150);
  });

  it('clears out old setInterval callbacks', async () => {
    const spyLogger = jest.fn();
    const snakeGame = startSnakeGame({ delay: 150, logger: spyLogger });
    const newDelay = 20;

    snakeGame.changeDelayBetweenMoves(newDelay);

    await sleep(200);
    expect(spyLogger).toHaveBeenCalledWith(`Calling setInterval handler (delay: 20)`);
    expect(spyLogger).not.toHaveBeenCalledWith(`Calling setInterval handler (delay: 150)`);

    spyLogger.mockReset();
    snakeGame.changeDelayBetweenMoves(30);
    await sleep(100);
    expect(spyLogger).toHaveBeenCalledWith(`Calling setInterval handler (delay: 30)`);
    expect(spyLogger).not.toHaveBeenCalledWith(`Calling setInterval handler (delay: 20)`);
    expect(spyLogger).not.toHaveBeenCalledWith(`Calling setInterval handler (delay: 150)`);
  });

  it('can be paused and unpaused', async () => {
    const spyLogger = jest.fn();
    const snakeGame = startSnakeGame({ delay: 10, logger: spyLogger });
    await sleep(30);
    expect(spyLogger).toHaveBeenCalled();
    spyLogger.mockReset();

    snakeGame.togglePause();

    await sleep(30);
    expect(spyLogger).not.toHaveBeenCalled();
    spyLogger.mockReset();

    snakeGame.togglePause(); // end pause
    await sleep(25);
    expect(spyLogger).toHaveBeenCalledTimes(2);
  });

  it('will restore original speed if paused and then unpaused', async () => {
    const spyLogger = jest.fn();
    const snakeGame = startSnakeGame({ delay: 10, logger: spyLogger });
    await sleep(30);
    expect(spyLogger).toHaveBeenCalled();
    spyLogger.mockReset();

    snakeGame.changeDelayBetweenMoves(50);
    await sleep(60);
    expect(spyLogger).toHaveBeenCalledTimes(1);
    spyLogger.mockReset();

    snakeGame.togglePause();
    snakeGame.togglePause(); // end pause

    // We expect loggerTo be called exactly once because delay should be restored to 50 milliseconds
    await sleep(60);
    expect(spyLogger).toHaveBeenCalledTimes(1);
  });

  it('cleanup timers after game end', async () => {
    const spyLogger = jest.fn();
    const snakeGame = startSnakeGame({ delay: 4, logger: spyLogger });

    // Make the snake crash into itself
    snakeGame.changeDirection('down');
    snakeGame.changeDirection('left');
    snakeGame.changeDirection('up');

    await sleep(100);
    expect(spyLogger).toHaveBeenCalledTimes(3);
  });

  it('calling .destroy() cleans up timers', async () => {
    const spyLogger = jest.fn();
    const snakeGame = startSnakeGame({ delay: 4, logger: spyLogger });
    snakeGame.destroy();

    // await gameOver;
    await sleep(100);
    expect(spyLogger).toHaveBeenCalledTimes(0);
  });
});

function stateAfterUpdates(snakeGame, numberOfUpdates) {
  let stateUpdatesCount = 0;

  return new Promise(resolve => {
    snakeGame.subscribe(newState => {
      stateUpdatesCount += 1;
      if (stateUpdatesCount > numberOfUpdates) {
        resolve(newState);
      }
    });
  });
}
