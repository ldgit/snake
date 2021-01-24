import newGame from './snake';
import { createRandomNumberGenerator } from './utils';

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
    expect(field).toHaveLength(32);
    field.forEach(gameRow => expect(gameRow).toHaveLength(17));
  });

  it('should set the snake in starting position: length of 6, horizontal facing right, and place the food', () => {
    for (let index = 0; index < 1000; index++) {
      const gameState = newGame();
      const field = selectField(gameState);
      expect(field[13][9]).toEqual({ type: 'snake', tail: true, head: false });
      expect(field[14][9]).toEqual({ type: 'snake', tail: false, head: false });
      expect(field[15][9]).toEqual({ type: 'snake', tail: false, head: false });
      expect(field[16][9]).toEqual({ type: 'snake', tail: false, head: false });
      expect(field[17][9]).toEqual({ type: 'snake', tail: false, head: false });
      expect(field[18][9]).toEqual({ type: 'snake', tail: false, head: true });
      expect(selectDirection(gameState)).toEqual('right');
      // There should be only one food placed on the field
      expect(field.flat().filter(value => value?.type === 'food')).toHaveLength(1);
    }
  });

  it.each([
    [1234, { x: 10, y: 7 }],
    [5385008, { x: 19, y: 12 }],
  ])(
    'should pick a random spot in the field for snake food (seed: %s, coordinates: %s)',
    (seed, { x, y }) => {
      const gameState = newGame(seed);
      expect(selectField(gameState)[x][y]).toEqual({ type: 'food' });
    },
  );
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
