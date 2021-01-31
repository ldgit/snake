<script>
import { onDestroy } from 'svelte';
import Field from './Field.svelte';
import Settings from './Settings.svelte';
import startSnakeGame from './core/snake';

let gameState;
let delay;
const snakeGame = startSnakeGame({});

snakeGame.subscribe(newState => (gameState = newState));
$: snakeGame.changeDelayBetweenMoves(delay);

function handleKeypress(event) {
  const key = event.key.toLowerCase();
  if (key === 'w') {
    snakeGame.changeDirection('up');
  } else if (key === 's') {
    snakeGame.changeDirection('down');
  } else if (key === 'd') {
    snakeGame.changeDirection('right');
  } else if (key === 'a') {
    snakeGame.changeDirection('left');
  } else if (key === 'p') {
    snakeGame.togglePause();
  }
}

onDestroy(snakeGame.destroy);
</script>

<svelte:window on:keypress={handleKeypress} />
<main>
  <h1>Snake</h1>
  <Field {gameState} />
  <Settings bind:delay />
</main>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

h1 {
  color: #ff3e00;
  text-transform: uppercase;
  font-size: 8vh;
  font-weight: 100;
}

@media (min-width: 640px) {
  main {
    max-width: none;
  }
}
</style>
