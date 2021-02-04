import { WIDTH, HEIGHT, STARTING_ROW, createEmptyField, generateFoodCoordinates } from './utils';
import { snakeHead, snakeTail, snakeTrunk, food } from './squares';

export function newGame(seed = Math.floor(Math.random() * 10000000)) {
  const field = createEmptyField(WIDTH, HEIGHT);
  field[STARTING_ROW][13] = snakeTail();
  field[STARTING_ROW][14] = snakeTrunk({ index: 3 });
  field[STARTING_ROW][15] = snakeTrunk({ index: 2 });
  field[STARTING_ROW][16] = snakeTrunk({ index: 1 });
  field[STARTING_ROW][17] = snakeTrunk({ index: 0 });
  field[STARTING_ROW][18] = snakeHead();

  const foodCoordinates = generateFoodCoordinates(seed, field);
  field[foodCoordinates.x][foodCoordinates.y] = food();

  return {
    field,
    direction: 'right',
    snakeSize: 6,
    foodConsumed: false,
    gameOver: false,
    score: 0,
  };
}
