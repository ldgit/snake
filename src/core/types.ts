export interface Square {
  id: string;
  bodyPart?: 'head' | 'trunk' | 'tail';
  /**
   * Indicates the place of the square inside snake's trunk. Undefined if not a 'trunk' `bodyPart`.
   */
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
