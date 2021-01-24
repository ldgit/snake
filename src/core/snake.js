import { createRandomNumberGenerator, createFlattenedCoordinatesField } from './utils';

const WIDTH = 32;
const HEIGHT = 17;
const flattenedCoordinatesField = createFlattenedCoordinatesField(WIDTH, HEIGHT);

export default function newGame(seed = Math.floor(Math.random() * 10000000)) {
  const field = new Array(WIDTH).fill(null).map(() => new Array(HEIGHT).fill(null));

  field[13][9] = { type: 'snake', tail: true, head: false };
  field[14][9] = { type: 'snake', tail: false, head: false };
  field[15][9] = { type: 'snake', tail: false, head: false };
  field[16][9] = { type: 'snake', tail: false, head: false };
  field[17][9] = { type: 'snake', tail: false, head: false };
  field[18][9] = { type: 'snake', tail: false, head: true };

  const foodCoordinates = generateFoodCoordinates(seed, field);
  field[foodCoordinates.x][foodCoordinates.y] = { type: 'food' };

  return {
    field,
    direction: 'right',
  };
}

export function moveSnake(gameState) {}

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
