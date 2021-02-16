export interface Square {
  id: string;
  bodyPart?: 'head' | 'trunk' | 'tail';
  index?: number;
  type: 'empty' | 'snake' | 'food';
}

export interface GameState {
  field: Array<Array<Square>>;
  direction: 'left' | 'right' | 'up' | 'down';
  snakeSize: number;
  foodConsumed: boolean;
  gameOver: boolean;
  score: number;
}
