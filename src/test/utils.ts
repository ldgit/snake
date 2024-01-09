import { newGame } from '../core/newGame';
import type { GameState, Square } from '../core/types';
import { expect } from 'vitest';

/**
 * Assertion that ignores square id.
 */
export function expectSquare(actualSquare: Square): {
  toEqual(expectedSquare: Partial<Square>): void;
  toBeEmpty(): void;
} {
  return {
    /**
     * Note: squares with different `square.id` are still considered equal.
     */
    toEqual(expectedSquare) {
      expect(typeof actualSquare === 'object' && typeof expectedSquare === 'object').toBeTruthy();
      const actualSquareCopy = { ...actualSquare };
      const expectedSquareCopy = { ...expectedSquare };

      // We ignore square ids in "is equal" comparison.
      actualSquareCopy.id = '';
      expectedSquareCopy.id = '';
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
