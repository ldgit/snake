import { areOpposite } from './utils';
import { selectDirection } from './selectors';

export function changeDirection(gameState, newDirection) {
  const oldDirection = selectDirection(gameState);

  return {
    ...gameState,
    direction: areOpposite(oldDirection, newDirection) ? oldDirection : newDirection,
  };
}
