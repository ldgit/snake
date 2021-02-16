import { changeDirection } from './changeDirection';
import { snakeHead, snakeTail, snakeTrunk } from './squares';
import { WIDTH, HEIGHT, STARTING_ROW, createEmptyField } from './utils';
import { selectDirection } from './selectors';

describe('changeDirection', () => {
  it('can change from right-moving direction', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[STARTING_ROW][WIDTH - 6] = snakeTail();
    startingField[STARTING_ROW][WIDTH - 5] = snakeTrunk({ index: 3 });
    startingField[STARTING_ROW][WIDTH - 4] = snakeTrunk({ index: 2 });
    startingField[STARTING_ROW][WIDTH - 3] = snakeTrunk({ index: 1 });
    startingField[STARTING_ROW][WIDTH - 2] = snakeTrunk({ index: 0 });
    startingField[STARTING_ROW][WIDTH - 1] = snakeHead();
    const gameState = { field: startingField, direction: 'right', snakeSize: 6 };

    expect(selectDirection(changeDirection(gameState, 'up'))).toEqual('up');
    expect(selectDirection(changeDirection(gameState, 'down'))).toEqual('down');
    // Changing to same direction has no effect
    expect(selectDirection(changeDirection(gameState, 'right'))).toEqual('right');
    // Changing to opposite direction has no effect
    expect(selectDirection(changeDirection(gameState, 'left'))).toEqual('right');
  });

  it('can change from left-moving direction', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[STARTING_ROW][13] = snakeHead();
    startingField[STARTING_ROW][14] = snakeTrunk({ index: 0 });
    startingField[STARTING_ROW][15] = snakeTrunk({ index: 1 });
    startingField[STARTING_ROW][16] = snakeTrunk({ index: 2 });
    startingField[STARTING_ROW][17] = snakeTrunk({ index: 3 });
    startingField[STARTING_ROW][18] = snakeTail();
    const gameState = { field: startingField, direction: 'left', snakeSize: 6 };

    expect(selectDirection(changeDirection(gameState, 'up'))).toEqual('up');
    expect(selectDirection(changeDirection(gameState, 'down'))).toEqual('down');
    // Changing to same direction has no effect
    expect(selectDirection(changeDirection(gameState, 'left'))).toEqual('left');
    // Changing to opposite direction has no effect
    expect(selectDirection(changeDirection(gameState, 'right'))).toEqual('left');
  });

  it('can change from up-moving direction', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[4][15] = snakeHead();
    startingField[5][15] = snakeTrunk({ index: 0 });
    startingField[6][15] = snakeTrunk({ index: 1 });
    startingField[7][15] = snakeTrunk({ index: 2 });
    startingField[8][15] = snakeTrunk({ index: 3 });
    startingField[9][15] = snakeTail();
    const gameState = { field: startingField, direction: 'up', snakeSize: 6 };

    expect(selectDirection(changeDirection(gameState, 'right'))).toEqual('right');
    expect(selectDirection(changeDirection(gameState, 'left'))).toEqual('left');
    // Changing to same direction has no effect
    expect(selectDirection(changeDirection(gameState, 'up'))).toEqual('up');
    // Changing to opposite direction has no effect
    expect(selectDirection(changeDirection(gameState, 'down'))).toEqual('up');
  });

  it('can change from down-moving direction', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[4][15] = snakeTail();
    startingField[5][15] = snakeTrunk({ index: 3 });
    startingField[6][15] = snakeTrunk({ index: 2 });
    startingField[7][15] = snakeTrunk({ index: 1 });
    startingField[8][15] = snakeTrunk({ index: 0 });
    startingField[9][15] = snakeHead();
    const gameState = { field: startingField, direction: 'down', snakeSize: 6 };

    expect(selectDirection(changeDirection(gameState, 'right'))).toEqual('right');
    expect(selectDirection(changeDirection(gameState, 'left'))).toEqual('left');
    // Changing to same direction has no effect
    expect(selectDirection(changeDirection(gameState, 'down'))).toEqual('down');
    // Changing to opposite direction has no effect
    expect(selectDirection(changeDirection(gameState, 'up'))).toEqual('down');
  });
});
