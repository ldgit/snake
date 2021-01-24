import newGame, { createRandomNumberGenerator } from './snake';

// Deliberate, generates [15][9] (snake head position, forbidden) on first try
const TEST_SEED = 5385008;

describe('newGame', () => {
  it('should return a field 31x18 in size', () => {
    const gameState = newGame(TEST_SEED);
    expect(gameState).toHaveLength(32);
    gameState.forEach(gameRow => {
      expect(gameRow).toHaveLength(17);
    });
  });

  it('should set the snake in starting position: length of 6, horizontal facing right, and place the food', () => {
    for (let index = 0; index < 1000; index++) {
      const gameState = newGame();
      expect(gameState[13][9]).toEqual({ type: 'snake', tail: true, head: false });
      expect(gameState[14][9]).toEqual({ type: 'snake', tail: false, head: false });
      expect(gameState[15][9]).toEqual({ type: 'snake', tail: false, head: false });
      expect(gameState[16][9]).toEqual({ type: 'snake', tail: false, head: false });
      expect(gameState[17][9]).toEqual({ type: 'snake', tail: false, head: false });
      expect(gameState[18][9]).toEqual({ type: 'snake', tail: false, head: true });
      // There should be only one food placed on the field
      expect(gameState.flat().filter(value => value?.type === 'food')).toHaveLength(1);
    }
  });

  it.each([
    [1234, { x: 10, y: 7 }],
    [TEST_SEED, { x: 19, y: 12 }],
  ])(
    'should pick a random spot in the field for snake food (seed: %s, coord: %s)',
    (seed, { x, y }) => {
      const gameState = newGame(seed);
      expect(gameState[x][y]).toEqual({ type: 'food' });
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
