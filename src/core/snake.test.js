import { newGame, moveSnake } from './snake';
import { createRandomNumberGenerator, WIDTH, HEIGHT, STARTING_ROW } from './utils';

function selectField(gameState) {
  return gameState.field;
}

function selectDirection(gameState) {
  return gameState.direction;
}

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
      expect(field[STARTING_ROW][14]).toEqual({ type: 'snake', bodyPart: 'trunk' });
      expect(field[STARTING_ROW][15]).toEqual({ type: 'snake', bodyPart: 'trunk' });
      expect(field[STARTING_ROW][16]).toEqual({ type: 'snake', bodyPart: 'trunk' });
      expect(field[STARTING_ROW][17]).toEqual({ type: 'snake', bodyPart: 'trunk' });
      expect(field[STARTING_ROW][18]).toEqual({ type: 'snake', bodyPart: 'head' });
      expect(selectDirection(gameState)).toEqual('right');
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
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should move snake by one square in current direction', () => {
    const initialGameState = newGame(1234);
    
    const newGameState = moveSnake(initialGameState);

    const field = selectField(newGameState);
    expect(field[STARTING_ROW][14]).toEqual({ type: 'snake', bodyPart: 'tail' });
    expect(field[STARTING_ROW][15]).toEqual({ type: 'snake', bodyPart: 'trunk' });
    expect(field[STARTING_ROW][16]).toEqual({ type: 'snake', bodyPart: 'trunk' });
    expect(field[STARTING_ROW][17]).toEqual({ type: 'snake', bodyPart: 'trunk' });
    expect(field[STARTING_ROW][18]).toEqual({ type: 'snake', bodyPart: 'trunk' });
    expect(field[STARTING_ROW][19]).toEqual({ type: 'snake', bodyPart: 'head' });
    expect(selectDirection(newGameState)).toEqual('right');
    // Food is not moved
    expect(selectField(newGameState)[10][7]).toEqual({ type: 'food' });
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
