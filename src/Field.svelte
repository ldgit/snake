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
    {#each row as square (square.id)}
      <div class="square {getSquareClasses(square)}" />
    {/each}
  {/each}
</div>

<style>
.snakeBox {
  display: grid;
  grid-template-columns: repeat(var(--width), 3.6vh);
  grid-template-rows: repeat(var(--height), 3.6vh);
  place-items: center center;
  gap: 0.15vh 0.15vh;
  padding: 0.15vh;
  border: 3px solid black;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell,
    'Helvetica Neue', sans-serif;
}

.square {
  width: 3.4vh;
  height: 3.4vh;
}

.snake {
  background-color: black;
}

.head {
  width: 3.4vh;
  height: 3.4vh;
}

.trunk {
  width: 3.1vh;
  height: 3.1vh;
}

.tail {
  width: 2.5vh;
  height: 2.5vh;
}

.food {
  background-color: #ff3e00;
  border-radius: 50%;
  width: 3vh;
  height: 3vh;
}
</style>
