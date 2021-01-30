import { newGame, createEmptyField, changeDirection } from './snake';
import { snakeHead, snakeTail, snakeTrunk } from './squares';
import { createRandomNumberGenerator, WIDTH, HEIGHT, STARTING_ROW } from './utils';
import { selectDirection, selectField, selectSnakeSize } from './selectors';
import { expectSquare } from '../test/utils';

describe('newGame', () => {
  it('should return a field 31x18 in size', () => {
    const gameState = newGame();
    const field = selectField(gameState);
    expect(field).toHaveLength(HEIGHT);
    field.forEach(gameRow => expect(gameRow).toHaveLength(WIDTH));
  });

  it('should set the snake in starting position: length of 6, horizontal facing right, and place the food', () => {
    for (let index = 0; index < 1000; index++) {
      const gameState = newGame();
      const field = selectField(gameState);
      // Note: Snake body part helpers not used on purpose, to test them
      expectSquare(field[STARTING_ROW][13]).toEqual({ type: 'snake', bodyPart: 'tail' });
      expectSquare(field[STARTING_ROW][14]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 3 });
      expectSquare(field[STARTING_ROW][15]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 2 });
      expectSquare(field[STARTING_ROW][16]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 1 });
      expectSquare(field[STARTING_ROW][17]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 0 });
      expectSquare(field[STARTING_ROW][18]).toEqual({ type: 'snake', bodyPart: 'head' });
      expect(selectDirection(gameState)).toEqual('right');
      expect(selectSnakeSize(gameState)).toEqual(6);
      // There should be only one food placed on the field
      expect(field.flat().filter(value => value?.type === 'food')).toHaveLength(1);
    }
  });

  it('should assign an unique id to each square', () => {
    const field = selectField(newGame());
    expect(field.flat().filter(value => value?.id)).toHaveLength(WIDTH * HEIGHT);
  });

  it.each([
    [1234, { row: 5, column: 17 }],
    [5385008, { row: 10, column: 15 }],
  ])(
    'should pick a random spot in the field for snake food (seed: %s, coordinates: %s)',
    (seed, { row, column }) => {
      const gameState = newGame(seed);
      expectSquare(selectField(gameState)[row][column]).toEqual({ type: 'food' });
      expect(gameState.foodConsumed).toStrictEqual(false);
    },
  );
});

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

// eslint-disable-next-line no-unused-vars
function findSeed() {
  let x;
  let y;
  let seed;
  do {
    seed = Math.floor(Math.random() * 10000000);
    const a = createRandomNumberGenerator(seed, { min: 0, max: 30 });
    const b = createRandomNumberGenerator(seed, { min: 0, max: 15 });
    x = a();
    y = b();
  } while ([13, 14, 15, 16, 17, 18, 19].indexOf(x) < 0 || y !== 9);
  console.log(`Found seed ${seed}, coords: (${x}, ${y})`);
}
