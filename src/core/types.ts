export interface Square {
  id: string;
  bodyPart?: 'head' | 'trunk' | 'tail';
  index?: number;
  type: 'empty' | 'snake' | 'food';
}

export type Field = Array<Array<Square>>;

export type Direction = 'left' | 'right' | 'up' | 'down';

export interface GameState {
  field: Field;
  direction: Direction;
  snakeSize: number;
  foodConsumed: boolean;
  gameOver: boolean;
  score: number;
}
