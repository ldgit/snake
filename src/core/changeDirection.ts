import { areOpposite } from './utils';
import { selectDirection } from './selectors';
import type { Direction, GameState } from './types';

export function changeDirection(gameState: GameState, newDirection: Direction): GameState {
  const oldDirection = selectDirection(gameState);

  return {
    ...gameState,
    direction: areOpposite(oldDirection, newDirection) ? oldDirection : newDirection,
  };
}
