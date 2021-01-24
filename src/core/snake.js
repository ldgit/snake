import {
  createRandomNumberGenerator,
  createFlattenedCoordinatesField,
  WIDTH,
  HEIGHT,
  STARTING_ROW,
} from './utils';

const flattenedCoordinatesField = createFlattenedCoordinatesField(HEIGHT, WIDTH);

export function newGame(seed = Math.floor(Math.random() * 10000000)) {
  const field = new Array(HEIGHT).fill(null).map(() => new Array(WIDTH).fill(null));

  field[STARTING_ROW][13] = { type: 'snake', bodyPart: 'tail' };
  field[STARTING_ROW][14] = { type: 'snake', bodyPart: 'trunk' };
  field[STARTING_ROW][15] = { type: 'snake', bodyPart: 'trunk' };
  field[STARTING_ROW][16] = { type: 'snake', bodyPart: 'trunk' };
  field[STARTING_ROW][17] = { type: 'snake', bodyPart: 'trunk' };
  field[STARTING_ROW][18] = { type: 'snake', bodyPart: 'head' };

  const foodCoordinates = generateFoodCoordinates(seed, field);
  field[foodCoordinates.x][foodCoordinates.y] = { type: 'food' };

  return {
    field,
    direction: 'right',
  };
}

export function moveSnake(gameState) {
  // have direction in state, but outside field
  // first move snake element from tail
  // add new snake element to field in where head is (use main direction)
  // can't change direction to go back into snake body
  return gameState;
}

// eslint-disable-next-line no-unused-vars
export function changeDirection(gameState, newDirection) {}

/**
 * Pick food location at random, avoiding fields occupied by the snake.
 *
 * @param {number|string} seed
 * @param {any[][]} fieldWithSnake
 */
function generateFoodCoordinates(seed, fieldWithSnake) {
  // Selecting from an array of free coordinates ensures that each field has the same chance of containing food.
  const freeCoordinates = flattenedCoordinatesField.filter(({ x, y }) => {
    return fieldWithSnake[x][y]?.type !== 'snake';
  });

  const random = createRandomNumberGenerator(seed, { max: freeCoordinates.length });
  return freeCoordinates[random()];
}
