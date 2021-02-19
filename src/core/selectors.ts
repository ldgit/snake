import type { Direction, Field, GameState } from './types';

export function selectField(gameState: GameState): Field {
  return gameState.field;
}

export function selectDirection(gameState: GameState): Direction {
  return gameState.direction;
}

export function selectSnakeSize(gameState: GameState): number {
  return gameState.snakeSize;
}
