import { newGame } from '../core/newGame';

/**
 * Assertion that ignores square id.
 */
export function expectSquare(actualSquare) {
  return {
    toEqual(expectedSquare) {
      expect(typeof actualSquare === 'object' && typeof expectedSquare === 'object').toBeTruthy();
      const actualSquareCopy = { ...actualSquare };
      const expectedSquareCopy = { ...expectedSquare };
      delete actualSquareCopy.id;
      delete expectedSquareCopy.id;
      expect(actualSquareCopy).toEqual(expectedSquareCopy);
    },
    toBeEmpty() {
      expect(actualSquare.type).toEqual('empty');
    },
  };
}

export function createState(partialState = {}) {
  return {
    ...newGame(),
    snakeSize: 6,
    ...partialState,
  };
}
