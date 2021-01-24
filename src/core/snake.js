import {
  createRandomNumberGenerator,
  createFlattenedCoordinatesField,
  WIDTH,
  HEIGHT,
  STARTING_ROW,
  findCoordinatesForSquare,
} from './utils';
import { selectField, selectSnakeSize } from './selectors';

const flattenedCoordinatesField = createFlattenedCoordinatesField(HEIGHT, WIDTH);

export function newGame(seed = Math.floor(Math.random() * 10000000)) {
  const field = new Array(HEIGHT).fill(null).map(() => new Array(WIDTH).fill(null));

  field[STARTING_ROW][13] = { type: 'snake', bodyPart: 'tail' };
  field[STARTING_ROW][14] = { type: 'snake', bodyPart: 'trunk', index: 3 };
  field[STARTING_ROW][15] = { type: 'snake', bodyPart: 'trunk', index: 2 };
  field[STARTING_ROW][16] = { type: 'snake', bodyPart: 'trunk', index: 1 };
  field[STARTING_ROW][17] = { type: 'snake', bodyPart: 'trunk', index: 0 };
  field[STARTING_ROW][18] = { type: 'snake', bodyPart: 'head' };

  const foodCoordinates = generateFoodCoordinates(seed, field);
  field[foodCoordinates.x][foodCoordinates.y] = { type: 'food' };

  return {
    field,
    direction: 'right',
    snakeSize: 6,
  };
}

export function moveSnake(gameState) {
  const field = selectField(gameState);
  const snakeSize = selectSnakeSize(gameState);

  const headCoordinates = findCoordinatesForSquare(
    field,
    square => square?.type === 'snake' && square.bodyPart === 'head',
  );

  return {
    ...gameState,
    // eslint-disable-next-line no-unused-vars
    field: field.map((row, rowIndex) => {
      return row.map((square, columnIndex) => {
        // Tail moves away
        if (square?.type === 'snake' && square.bodyPart === 'tail') {
          return null;
        }
        // Head becomes trunk
        if (square?.type === 'snake' && square.bodyPart === 'head') {
          return { type: 'snake', bodyPart: 'trunk', index: 0 };
        }
        if (square?.type === 'snake' && square.bodyPart === 'trunk') {
          // Last trunk element is now a tail
          if (square.index === snakeSize - 3) {
            return { type: 'snake', bodyPart: 'tail' };
          }

          return { type: 'snake', bodyPart: 'trunk', index: square.index + 1 };
        }
        if (
          square === null &&
          columnIndex === headCoordinates.column + 1 &&
          rowIndex === headCoordinates.row
        ) {
          return { type: 'snake', bodyPart: 'head' };
        }

        return square;
      });
    }),
  };

  // first move snake element from tail
  // add new snake element to field in where head is (use main direction)
  // can't change direction to go back into snake body
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
