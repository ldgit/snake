import {
  newGame,
  moveSnake,
  createEmptyField,
  snakeTail,
  snakeHead,
  snakeTrunk,
  changeDirection,
} from './snake';
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
      // Note: Snake body part helpers not used on purpose, to test them
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
    // Note: Snake body part helpers not used on purpose, to test them
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
    // Total number of squares minus food and snake squares
    expect(field.flat().filter(value => value === null)).toHaveLength(WIDTH * HEIGHT - 1 - 6);
  });

  it('should come out the other end if it hits the right wall', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[STARTING_ROW][WIDTH - 6] = snakeTail();
    startingField[STARTING_ROW][WIDTH - 5] = snakeTrunk({ index: 3 });
    startingField[STARTING_ROW][WIDTH - 4] = snakeTrunk({ index: 2 });
    startingField[STARTING_ROW][WIDTH - 3] = snakeTrunk({ index: 1 });
    startingField[STARTING_ROW][WIDTH - 2] = snakeTrunk({ index: 0 });
    startingField[STARTING_ROW][WIDTH - 1] = snakeHead();
    const gameState = { field: startingField, direction: 'right', snakeSize: 6 };

    const newGameState = moveSnake(gameState);

    const field = selectField(newGameState);
    expect(field[STARTING_ROW][0]).toEqual(snakeHead());
  });

  it('should be able to move left', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[STARTING_ROW][13] = snakeHead();
    startingField[STARTING_ROW][14] = snakeTrunk({ index: 0 });
    startingField[STARTING_ROW][15] = snakeTrunk({ index: 1 });
    startingField[STARTING_ROW][16] = snakeTrunk({ index: 2 });
    startingField[STARTING_ROW][17] = snakeTrunk({ index: 3 });
    startingField[STARTING_ROW][18] = snakeTail();
    const gameState = { field: startingField, direction: 'left', snakeSize: 6 };

    const newGameState = moveSnake(gameState);

    const field = selectField(newGameState);
    expect(field[STARTING_ROW][12]).toEqual(snakeHead());
    expect(field[STARTING_ROW][13]).toEqual(snakeTrunk({ index: 0 }));
    expect(field[STARTING_ROW][14]).toEqual(snakeTrunk({ index: 1 }));
    expect(field[STARTING_ROW][15]).toEqual(snakeTrunk({ index: 2 }));
    expect(field[STARTING_ROW][16]).toEqual(snakeTrunk({ index: 3 }));
    expect(field[STARTING_ROW][17]).toEqual(snakeTail());
    // Should not modify other squares
    expect(field.flat().filter(value => value === null)).toHaveLength(WIDTH * HEIGHT - 6);
  });

  it('should come out the other end if it hits the left wall', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[STARTING_ROW][0] = snakeHead();
    startingField[STARTING_ROW][1] = snakeTrunk({ index: 0 });
    startingField[STARTING_ROW][2] = snakeTrunk({ index: 1 });
    startingField[STARTING_ROW][3] = snakeTrunk({ index: 2 });
    startingField[STARTING_ROW][4] = snakeTrunk({ index: 3 });
    startingField[STARTING_ROW][5] = snakeTail();
    const gameState = { field: startingField, direction: 'left', snakeSize: 6 };

    const newGameState = moveSnake(gameState);

    const field = selectField(newGameState);
    expect(field[STARTING_ROW][WIDTH - 1]).toEqual(snakeHead());
  });

  it('should be able to move up', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[4][15] = snakeHead();
    startingField[5][15] = snakeTrunk({ index: 0 });
    startingField[6][15] = snakeTrunk({ index: 1 });
    startingField[7][15] = snakeTrunk({ index: 2 });
    startingField[8][15] = snakeTrunk({ index: 3 });
    startingField[9][15] = snakeTail();
    const gameState = { field: startingField, direction: 'up', snakeSize: 6 };

    const newGameState = moveSnake(gameState);

    const field = selectField(newGameState);
    expect(field[3][15]).toEqual(snakeHead());
    expect(field[4][15]).toEqual(snakeTrunk({ index: 0 }));
    expect(field[5][15]).toEqual(snakeTrunk({ index: 1 }));
    expect(field[6][15]).toEqual(snakeTrunk({ index: 2 }));
    expect(field[7][15]).toEqual(snakeTrunk({ index: 3 }));
    expect(field[8][15]).toEqual(snakeTail());
    // Should not modify other squares
    expect(field.flat().filter(value => value === null)).toHaveLength(WIDTH * HEIGHT - 6);
  });

  it('should come out the other end if it hits the top wall', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[0][15] = snakeHead();
    startingField[1][15] = snakeTrunk({ index: 0 });
    startingField[2][15] = snakeTrunk({ index: 1 });
    startingField[3][15] = snakeTrunk({ index: 2 });
    startingField[4][15] = snakeTrunk({ index: 3 });
    startingField[5][15] = snakeTail();
    const gameState = { field: startingField, direction: 'up', snakeSize: 6 };

    const newGameState = moveSnake(gameState);

    const field = selectField(newGameState);
    expect(field[HEIGHT - 1][15]).toEqual(snakeHead());
  });

  it('should be able to move down', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[4][15] = snakeTail();
    startingField[5][15] = snakeTrunk({ index: 3 });
    startingField[6][15] = snakeTrunk({ index: 2 });
    startingField[7][15] = snakeTrunk({ index: 1 });
    startingField[8][15] = snakeTrunk({ index: 0 });
    startingField[9][15] = snakeHead();
    const gameState = { field: startingField, direction: 'down', snakeSize: 6 };

    const newGameState = moveSnake(gameState);

    const field = selectField(newGameState);
    expect(field[5][15]).toEqual(snakeTail());
    expect(field[6][15]).toEqual(snakeTrunk({ index: 3 }));
    expect(field[7][15]).toEqual(snakeTrunk({ index: 2 }));
    expect(field[8][15]).toEqual(snakeTrunk({ index: 1 }));
    expect(field[9][15]).toEqual(snakeTrunk({ index: 0 }));
    expect(field[10][15]).toEqual(snakeHead());
    // Should not modify other squares
    expect(field.flat().filter(value => value === null)).toHaveLength(WIDTH * HEIGHT - 6);
  });

  it('should come out the other end if it hits the bottom wall', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[HEIGHT - 6][15] = snakeTail();
    startingField[HEIGHT - 5][15] = snakeTrunk({ index: 3 });
    startingField[HEIGHT - 4][15] = snakeTrunk({ index: 2 });
    startingField[HEIGHT - 3][15] = snakeTrunk({ index: 1 });
    startingField[HEIGHT - 2][15] = snakeTrunk({ index: 0 });
    startingField[HEIGHT - 1][15] = snakeHead();
    const gameState = { field: startingField, direction: 'down', snakeSize: 6 };

    const newGameState = moveSnake(gameState);

    const field = selectField(newGameState);
    expect(field[0][15]).toEqual(snakeHead());
  });

  it.todo('should move correctly if bent');

  it.todo('can crash into itself');

  it.todo('should eat food when it moves onto it and increase in size');
  it.todo('should create new food when current one eaten and increase in size');
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
