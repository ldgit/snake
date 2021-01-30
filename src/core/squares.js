import { v4 as uuidv4 } from 'uuid';

export function snakeHead() {
  return { type: 'snake', bodyPart: 'head', id: uuidv4() };
}

export function snakeTrunk({ index }) {
  return { type: 'snake', bodyPart: 'trunk', index, id: uuidv4() };
}

export function snakeTail() {
  return { type: 'snake', bodyPart: 'tail', id: uuidv4() };
}

export function food() {
  return { type: 'food', id: uuidv4() };
}

export function emptySquare() {
  return { type: 'empty', id: uuidv4() };
}
