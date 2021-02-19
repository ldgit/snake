import { v4 as uuidv4 } from 'uuid';
import type { Square } from './types';

export function snakeHead(): Square {
  return { type: 'snake', bodyPart: 'head', id: uuidv4() };
}

export function snakeTrunk({ index }: { index: number }): Square {
  return { type: 'snake', bodyPart: 'trunk', index, id: uuidv4() };
}

export function snakeTail(): Square {
  return { type: 'snake', bodyPart: 'tail', id: uuidv4() };
}

export function food(): Square {
  return { type: 'food', id: uuidv4() };
}

export function emptySquare(): Square {
  return { type: 'empty', id: uuidv4() };
}
