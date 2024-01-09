import { WIDTH, HEIGHT, findCoordinatesForSquare, generateFoodCoordinates } from './utils';
import { selectDirection, selectField, selectSnakeSize } from './selectors';
import { snakeHead, snakeTail, snakeTrunk, food, emptySquare } from './squares';
import type { GameState } from './types';

export function moveSnake(
  gameState: GameState,
  seed = Math.floor(Math.random() * 10000000),
): GameState {
  const field = selectField(gameState);
  const snakeSize = selectSnakeSize(gameState);
  const newHeadCoordinates = getNewHeadCoordinates(field, selectDirection(gameState));

  if (
    field[newHeadCoordinates.row][newHeadCoordinates.column]?.type === 'snake' &&
    field[newHeadCoordinates.row][newHeadCoordinates.column].bodyPart != 'tail'
  ) {
    return { ...gameState, gameOver: true };
  }

  let foodConsumedOnThisMove = false;
  const newField = field.map((row, rowIndex) => {
    return row.map((square, columnIndex) => {
      // Tail moves away unless food was consumed on previous move
      if (square?.type === 'snake' && square.bodyPart === 'tail') {
        if (newHeadCoordinates.row === rowIndex && newHeadCoordinates.column === columnIndex) {
          return { ...snakeHead(), id: square.id };
        }
        return gameState.foodConsumed ? square : { ...emptySquare(), id: square.id };
      }
      // Head becomes trunk
      if (square?.type === 'snake' && square.bodyPart === 'head') {
        return { ...snakeTrunk({ index: 0 }), id: square.id };
      }
      if (square?.type === 'snake' && square.bodyPart === 'trunk') {
        // Last trunk element is now a tail unless food was consumed on previous move
        if (square.index === snakeSize - 3 && !gameState.foodConsumed) {
          return { ...snakeTail(), id: square.id };
        }

        return { ...snakeTrunk({ index: square.index! + 1 }), id: square.id };
      }
      if (
        (square.type === 'empty' || square.type === 'food') &&
        columnIndex === newHeadCoordinates.column &&
        rowIndex === newHeadCoordinates.row
      ) {
        if (square) {
          foodConsumedOnThisMove = square.type === 'food';
        }
        return { ...snakeHead(), id: square.id };
      }

      return square;
    });
  });

  if (gameState.foodConsumed) {
    const foodCoordinates = generateFoodCoordinates(seed, newField);
    newField[foodCoordinates.x][foodCoordinates.y] = {
      ...food(),
      id: newField[foodCoordinates.x][foodCoordinates.y].id,
    };
  }

  return {
    ...gameState,
    foodConsumed: foodConsumedOnThisMove,
    field: newField,
    snakeSize: gameState.foodConsumed ? gameState.snakeSize + 1 : gameState.snakeSize,
    score: foodConsumedOnThisMove ? gameState.score + 5 : gameState.score,
  };
}

function getNewHeadCoordinates(field, direction) {
  const headCoordinates = findCoordinatesForSquare(
    field,
    square => square?.type === 'snake' && square.bodyPart === 'head',
  );

  let newHeadColumn = headCoordinates.column;
  if (direction === 'left') {
    newHeadColumn = headCoordinates.column - 1 < 0 ? WIDTH - 1 : headCoordinates.column - 1;
  } else if (direction === 'right') {
    newHeadColumn = headCoordinates.column + 1 === WIDTH ? 0 : headCoordinates.column + 1;
  }

  let newHeadRow = headCoordinates.row;
  if (direction === 'up') {
    newHeadRow = headCoordinates.row - 1 < 0 ? HEIGHT - 1 : headCoordinates.row - 1;
  } else if (direction === 'down') {
    newHeadRow = headCoordinates.row + 1 === HEIGHT ? 0 : headCoordinates.row + 1;
  }

  return { row: newHeadRow, column: newHeadColumn };
}
