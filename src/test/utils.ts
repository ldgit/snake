import { newGame } from '../core/newGame';
import type { GameState, Square } from '../core/types';

/**
 * Assertion that ignores square id.
 */
export function expectSquare(
  actualSquare: Square,
): { toEqual(expectedSquare: Partial<Square>): void; toBeEmpty(): void } {
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

export function createState(partialState = {}): GameState {
  return {
    ...newGame(),
    snakeSize: 6,
    ...partialState,
  };
}
