import { newGame, moveSnake } from './snake';
import { createRandomNumberGenerator, WIDTH, HEIGHT, STARTING_ROW } from './utils';
import { selectDirection, selectField, selectSnakeSize } from './selectors';

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
      expect(field[STARTING_ROW][13]).toEqual({ type: 'snake', bodyPart: 'tail' });
      expect(field[STARTING_ROW][14]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 3 });
      expect(field[STARTING_ROW][15]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 2 });
      expect(field[STARTING_ROW][16]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 1 });
      expect(field[STARTING_ROW][17]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 0 });
      expect(field[STARTING_ROW][18]).toEqual({ type: 'snake', bodyPart: 'head' });
      expect(selectDirection(gameState)).toEqual('right');
      expect(selectSnakeSize(gameState)).toEqual(6);
      // There should be only one food placed on the field
      expect(field.flat().filter(value => value?.type === 'food')).toHaveLength(1);
    }
  });

  it.each([
    [1234, { row: 5, column: 17 }],
    [5385008, { row: 10, column: 15 }],
  ])(
    'should pick a random spot in the field for snake food (seed: %s, coordinates: %s)',
    (seed, { row, column }) => {
      const gameState = newGame(seed);
      expect(selectField(gameState)[row][column]).toEqual({ type: 'food' });
    },
  );
});

describe('moveSnake', () => {
  it('should move snake by one square in current direction', () => {
    const initialGameState = newGame(1234);

    const gameState1 = moveSnake(initialGameState);
    expect(selectSnakeSize(gameState1)).toEqual(6);
    const field1 = selectField(gameState1);
    expect(field1[STARTING_ROW][13]).toBeNull();
    // Original head is now a trunk
    expect(field1[STARTING_ROW][18]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 0 });
    expect(field1[STARTING_ROW][17]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 1 });
    expect(field1[STARTING_ROW][16]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 2 });
    expect(field1[STARTING_ROW][15]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 3 });
    // Last snake trunk element is now a tail
    expect(field1[STARTING_ROW][14]).toEqual({ type: 'snake', bodyPart: 'tail' });
    // Head moves forward
    expect(field1[STARTING_ROW][19]).toEqual({ type: 'snake', bodyPart: 'head' });
    expect(selectDirection(gameState1)).toEqual('right');
    // Food is not moved
    expect(field1[5][17]).toEqual({ type: 'food' });

    const gameState2 = moveSnake(gameState1);
    const field2 = selectField(gameState2);
    expect(field2[STARTING_ROW][13]).toBeNull();
    expect(field2[STARTING_ROW][14]).toBeNull();
    // Original head is now a trunk
    expect(field2[STARTING_ROW][19]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 0 });
    expect(field2[STARTING_ROW][15]).toEqual({ type: 'snake', bodyPart: 'tail' });
    expect(field2[STARTING_ROW][16]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 3 });
    expect(field2[STARTING_ROW][17]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 2 });
    expect(field2[STARTING_ROW][18]).toEqual({ type: 'snake', bodyPart: 'trunk', index: 1 });
    expect(field2[STARTING_ROW][20]).toEqual({ type: 'snake', bodyPart: 'head' });
    expect(selectDirection(gameState2)).toEqual('right');
    // Food is not moved
    expect(selectField(gameState2)[5][17]).toEqual({ type: 'food' });
  });

  it('should not modify other squares', () => {
    const initialGameState = newGame(1234);
    const gameState = moveSnake(initialGameState);
    const field = selectField(gameState);
    expect(field.flat().filter(value => value === null)).toHaveLength(WIDTH * HEIGHT - 1 - 6);
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
