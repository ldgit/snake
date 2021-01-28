import {
  newGame,
  moveSnake,
  createEmptyField,
  snakeTail,
  snakeHead,
  snakeTrunk,
  changeDirection,
  food,
} from './snake';
import {
  createRandomNumberGenerator,
  WIDTH,
  HEIGHT,
  STARTING_ROW,
  findCoordinatesForSquare,
} from './utils';
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
      expect(gameState.foodConsumed).toStrictEqual(false);
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
    expect(gameState1.foodConsumed).toStrictEqual(false);

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
    expect(gameState2.foodConsumed).toStrictEqual(false);
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

  it('should eat food when it moves onto it and increase in size', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[STARTING_ROW][4] = snakeTail();
    startingField[STARTING_ROW][5] = snakeTrunk({ index: 3 });
    startingField[STARTING_ROW][6] = snakeTrunk({ index: 2 });
    startingField[STARTING_ROW][7] = snakeTrunk({ index: 1 });
    startingField[STARTING_ROW][8] = snakeTrunk({ index: 0 });
    startingField[STARTING_ROW][9] = snakeHead();
    startingField[STARTING_ROW][10] = food();
    const gameState = {
      field: startingField,
      direction: 'right',
      snakeSize: 6,
      foodConsumed: false,
    };

    const foodConsumedGameState = moveSnake(gameState);

    // Snake moves forward without growing and food is gone
    expect(selectField(foodConsumedGameState)[STARTING_ROW][5]).toEqual(snakeTail());
    expect(selectField(foodConsumedGameState)[STARTING_ROW][6]).toEqual(snakeTrunk({ index: 3 }));
    expect(selectField(foodConsumedGameState)[STARTING_ROW][7]).toEqual(snakeTrunk({ index: 2 }));
    expect(selectField(foodConsumedGameState)[STARTING_ROW][8]).toEqual(snakeTrunk({ index: 1 }));
    expect(selectField(foodConsumedGameState)[STARTING_ROW][9]).toEqual(snakeTrunk({ index: 0 }));
    expect(selectField(foodConsumedGameState)[STARTING_ROW][10]).toEqual(snakeHead());
    expect(selectSnakeSize(foodConsumedGameState)).toEqual(6);
    expect(
      findCoordinatesForSquare(
        selectField(foodConsumedGameState),
        square => square?.type === 'food',
      ),
    ).toBeFalsy();
    expect(foodConsumedGameState.foodConsumed).toStrictEqual(true);

    // Another food square must be created on next iteration, at another location
    const newFoodGameState = moveSnake(foodConsumedGameState);
    expect(newFoodGameState.foodConsumed).toStrictEqual(false);
    expect(
      findCoordinatesForSquare(selectField(newFoodGameState), square => square?.type === 'food'),
    ).toBeTruthy();
    // Snake increases in size
    expect(selectField(newFoodGameState)[STARTING_ROW][5]).toEqual(snakeTail());
    expect(selectField(newFoodGameState)[STARTING_ROW][6]).toEqual(snakeTrunk({ index: 4 }));
    expect(selectField(newFoodGameState)[STARTING_ROW][7]).toEqual(snakeTrunk({ index: 3 }));
    expect(selectField(newFoodGameState)[STARTING_ROW][8]).toEqual(snakeTrunk({ index: 2 }));
    expect(selectField(newFoodGameState)[STARTING_ROW][9]).toEqual(snakeTrunk({ index: 1 }));
    expect(selectField(newFoodGameState)[STARTING_ROW][10]).toEqual(snakeTrunk({ index: 0 }));
    expect(selectField(newFoodGameState)[STARTING_ROW][11]).toEqual(snakeHead());
    expect(selectSnakeSize(newFoodGameState)).toEqual(7);
  });

  it('should it crash into itself it will not be able to move anymore', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[STARTING_ROW][4] = snakeTail();
    startingField[STARTING_ROW][5] = snakeTrunk({ index: 3 });
    startingField[STARTING_ROW][6] = snakeTrunk({ index: 2 });
    startingField[STARTING_ROW][7] = snakeTrunk({ index: 1 });
    startingField[STARTING_ROW + 1][7] = snakeTrunk({ index: 0 });
    startingField[STARTING_ROW + 1][6] = snakeHead();
    const gameState = {
      field: startingField,
      direction: 'up',
      snakeSize: 6,
      foodConsumed: false,
      gameOver: false,
    };

    const endGameState = moveSnake(gameState);
    expect(selectField(endGameState)[STARTING_ROW][4]).toEqual(snakeTail());
    expect(selectField(endGameState)[STARTING_ROW][5]).toEqual(snakeTrunk({ index: 3 }));
    expect(selectField(endGameState)[STARTING_ROW][6]).toEqual(snakeTrunk({ index: 2 }));
    expect(selectField(endGameState)[STARTING_ROW][7]).toEqual(snakeTrunk({ index: 1 }));
    expect(selectField(endGameState)[STARTING_ROW + 1][7]).toEqual(snakeTrunk({ index: 0 }));
    expect(selectField(endGameState)[STARTING_ROW + 1][6]).toEqual(snakeHead());
    expect(endGameState.gameOver).toStrictEqual(true);
  });

  it('if head is going to hit the tail, tail should move out of the way', () => {
    const startingField = createEmptyField(WIDTH, HEIGHT);
    startingField[STARTING_ROW][4] = snakeTail();
    startingField[STARTING_ROW][5] = snakeTrunk({ index: 3 });
    startingField[STARTING_ROW][6] = snakeTrunk({ index: 2 });
    startingField[STARTING_ROW + 1][6] = snakeTrunk({ index: 1 });
    startingField[STARTING_ROW + 1][5] = snakeTrunk({ index: 0 });
    startingField[STARTING_ROW + 1][4] = snakeHead();
    const gameState = {
      field: startingField,
      direction: 'up',
      snakeSize: 6,
      foodConsumed: false,
      gameOver: false,
    };

    const newState = moveSnake(gameState);
    expect(selectField(newState)[STARTING_ROW][5]).toEqual(snakeTail());
    expect(selectField(newState)[STARTING_ROW][6]).toEqual(snakeTrunk({ index: 3 }));
    expect(selectField(newState)[STARTING_ROW + 1][6]).toEqual(snakeTrunk({ index: 2 }));
    expect(selectField(newState)[STARTING_ROW + 1][5]).toEqual(snakeTrunk({ index: 1 }));
    expect(selectField(newState)[STARTING_ROW + 1][4]).toEqual(snakeTrunk({ index: 0 }));
    expect(selectField(newState)[STARTING_ROW][4]).toEqual(snakeHead());
    expect(newState.gameOver).toStrictEqual(false);
  });

  it.todo('should handle two food in a row correctly');
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
