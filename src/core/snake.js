import {
  createRandomNumberGenerator,
  createFlattenedCoordinatesField,
  WIDTH,
  HEIGHT,
  STARTING_ROW,
  findCoordinatesForSquare,
} from './utils';
import { selectDirection, selectField, selectSnakeSize } from './selectors';

const flattenedCoordinatesField = createFlattenedCoordinatesField(HEIGHT, WIDTH);

export function newGame(seed = Math.floor(Math.random() * 10000000)) {
  const field = createEmptyField(WIDTH, HEIGHT);
  field[STARTING_ROW][13] = snakeTail();
  field[STARTING_ROW][14] = snakeTrunk({ index: 3 });
  field[STARTING_ROW][15] = snakeTrunk({ index: 2 });
  field[STARTING_ROW][16] = snakeTrunk({ index: 1 });
  field[STARTING_ROW][17] = snakeTrunk({ index: 0 });
  field[STARTING_ROW][18] = snakeHead();

  const foodCoordinates = generateFoodCoordinates(seed, field);
  field[foodCoordinates.x][foodCoordinates.y] = { type: 'food' };

  return {
    field,
    direction: 'right',
    snakeSize: 6,
  };
}

function getNewHeadCoordinates(field, direction) {
  const headCoordinates = findCoordinatesForSquare(
    field,
    square => square?.type === 'snake' && square.bodyPart === 'head',
  );

  let newHeadColumn = headCoordinates.column;
  if (direction === 'left') {
    newHeadColumn = headCoordinates.column - 1 < 0 ? WIDTH - 1 : headCoordinates.column - 1;
  } else if (direction === 'right') {
    newHeadColumn = headCoordinates.column + 1 === WIDTH ? 0 : headCoordinates.column + 1;
  }

  let newHeadRow = headCoordinates.row;
  if (direction === 'up') {
    newHeadRow = headCoordinates.row - 1 < 0 ? HEIGHT - 1 : headCoordinates.row - 1;
  } else if (direction === 'down') {
    newHeadRow = headCoordinates.row + 1 === HEIGHT ? 0 : headCoordinates.row + 1;
  }

  return { row: newHeadRow, column: newHeadColumn };
}

export function moveSnake(gameState) {
  const field = selectField(gameState);
  const snakeSize = selectSnakeSize(gameState);

  const newHeadCoordinates = getNewHeadCoordinates(field, selectDirection(gameState));

  return {
    ...gameState,
    field: field.map((row, rowIndex) => {
      return row.map((square, columnIndex) => {
        // Tail moves away
        if (square?.type === 'snake' && square.bodyPart === 'tail') {
          return null;
        }
        // Head becomes trunk
        if (square?.type === 'snake' && square.bodyPart === 'head') {
          return snakeTrunk({ index: 0 });
        }
        if (square?.type === 'snake' && square.bodyPart === 'trunk') {
          // Last trunk element is now a tail
          if (square.index === snakeSize - 3) {
            return snakeTail();
          }

          return snakeTrunk({ index: square.index + 1 });
        }
        if (
          square === null &&
          columnIndex === newHeadCoordinates.column &&
          rowIndex === newHeadCoordinates.row
        ) {
          return snakeHead();
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

export function createEmptyField(width, height) {
  return new Array(height).fill(null).map(() => new Array(width).fill(null));
}

export function snakeHead() {
  return { type: 'snake', bodyPart: 'head' };
}

export function snakeTrunk({ index }) {
  return { type: 'snake', bodyPart: 'trunk', index };
}

export function snakeTail() {
  return { type: 'snake', bodyPart: 'tail' };
}

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
