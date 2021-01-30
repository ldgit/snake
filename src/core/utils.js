import seedrandom from 'seedrandom';
import { emptySquare } from '../core/squares';

export const WIDTH = 32;
export const HEIGHT = 17;
export const STARTING_ROW = 8;

export function createRandomNumberGenerator(seed, { max, min = 0 }) {
  const rng = seedrandom(seed);
  return () => min + Math.floor(rng() * max);
}

export function createFlattenedCoordinatesField(width, height) {
  const emptyField = new Array(width).fill(null).map(() => new Array(height).fill(null));
  const coordinatesField = emptyField.map((column, xIndex) => {
    return column.map((value, yIndex) => {
      return { x: xIndex, y: yIndex };
    });
  });
  return coordinatesField.flat();
}

export function findCoordinatesForSquare(field, fn) {
  let coordinates;
  field.forEach((rowArray, row) => {
    rowArray.forEach((square, column) => (fn(square) ? (coordinates = { row, column }) : null));
  });

  return coordinates;
}

const oppositeDirections = [['left', 'right'].sort().join(','), ['up', 'down'].sort().join(',')];

export function areOpposite(direction1, direction2) {
  return oppositeDirections.indexOf([direction1, direction2].sort().join(',')) >= 0;
}

const flattenedCoordinatesField = createFlattenedCoordinatesField(HEIGHT, WIDTH);

/**
 * Pick food location at random, avoiding fields occupied by the snake.
 *
 * @param {number|string} seed
 * @param {any[][]} fieldWithSnake
 */
export function generateFoodCoordinates(seed, fieldWithSnake) {
  // Selecting from an array of free coordinates ensures that each field has the same chance of containing food.
  const freeCoordinates = flattenedCoordinatesField.filter(({ x, y }) => {
    return fieldWithSnake[x][y]?.type !== 'snake';
  });

  const random = createRandomNumberGenerator(seed, { max: freeCoordinates.length });
  return freeCoordinates[random()];
}

export function createEmptyField(width, height) {
  return new Array(height)
    .fill(null)
    .map(() => new Array(width).fill(null).map(() => emptySquare()));
}
