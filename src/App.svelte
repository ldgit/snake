<script>
import { onDestroy } from 'svelte';
import gameStateStore from './gameStateStore';
import Field from './Field.svelte';
import Settings from './Settings.svelte';

let gameState;
let delay;
let commandQueue = [];

gameStateStore.subscribe(newGameState => (gameState = newGameState));
function handleKeypress(event) {
  const key = event.key.toLowerCase();
  if (key === 'w') {
    commandQueue.push('up');
  } else if (key === 's') {
    commandQueue.push('down');
  } else if (key === 'd') {
    commandQueue.push('right');
  } else if (key === 'a') {
    commandQueue.push('left');
  }
}

let intervalId = setInterval(() => {
  gameStateStore.changeDirection(commandQueue.shift());
  gameStateStore.moveSnake();
}, delay);

$: {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    gameStateStore.changeDirection(commandQueue.shift());
    gameStateStore.moveSnake();
  }, delay);
}

onDestroy(() => clearInterval(intervalId));
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
