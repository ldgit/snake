<script>
import { WIDTH, HEIGHT } from './core/utils';

export let gameState;

function getSquareClasses(square) {
  if (square?.type === 'snake') {
    return `snake ${square.bodyPart}`;
  }

  if (square?.type === 'food') {
    return 'food';
  }

  return '';
}
</script>

<div class="snakeBox" style="--width: {WIDTH}; --height: {HEIGHT};">
  {#each gameState.field as row}
    {#each row as square}
      <div class="square {getSquareClasses(square)}" />
    {/each}
  {/each}
</div>

<style>
.snakeBox {
  display: grid;
  grid-template-columns: repeat(var(--width), 1fr);
  grid-template-rows: repeat(var(--height), 1fr);
  place-items: center center;
  gap: 3px 3px;
  padding: 3px;
  flex-grow: 5;
  border: 3px solid black;
  max-width: 1200px;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell,
    'Helvetica Neue', sans-serif;
}

.square {
  font-size: 8px;
  background-color: white;
}

.snake {
  background-color: black;
}

.head {
  width: 100%;
  height: 100%;
}

.trunk {
  width: 90%;
  height: 90%;
}

.tail {
  width: 70%;
  height: 70%;
}

.food {
  background-color: #ff3e00;
  border-radius: 50%;
  width: 80%;
  height: 80%;
}
</style>
