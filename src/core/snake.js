import seedrandom from 'seedrandom';

const WIDTH = 32;
const HEIGHT = 17;
const flattenedCoordinatesField = createFlattenedCoordinatesField();

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

  return field;
}

export function createRandomNumberGenerator(seed, { max, min = 0 }) {
  const rng = seedrandom(seed);
  return () => min + Math.floor(rng() * max);
}

function generateFoodCoordinates(seed, fieldWithSnake) {
  const freeCoordinates = flattenedCoordinatesField.filter(({ x, y }) => {
    return fieldWithSnake[x][y]?.type !== 'snake';
  });

  const random = createRandomNumberGenerator(seed, { max: freeCoordinates.length });
  return freeCoordinates[random()];
}

function createFlattenedCoordinatesField() {
  const emptyField = new Array(WIDTH).fill(null).map(() => new Array(HEIGHT).fill(null));
  const coordinatesField = emptyField.map((column, xIndex) => {
    return column.map((value, yIndex) => {
      return { x: xIndex, y: yIndex };
    });
  });
  return coordinatesField.flat();
}
