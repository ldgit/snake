<script>
import { onDestroy } from 'svelte';
import gameStateStore from './gameStateStore';
import Field from './Field.svelte';

let gameState;
gameStateStore.subscribe(newGameState => (gameState = newGameState));
function handleKeypress(event) {
  const key = event.key.toLowerCase();
  if (key === 'w') {
    gameStateStore.changeDirection('up');
  } else if (key === 's') {
    gameStateStore.changeDirection('down');
  } else if (key === 'd') {
    gameStateStore.changeDirection('right');
  } else if (key === 'a') {
    gameStateStore.changeDirection('left');
  }
}

document.addEventListener('keypress', handleKeypress);
const intervalId = setInterval(gameStateStore.moveSnake, 50);

onDestroy(() => {
  document.removeEventListener('keypress', handleKeypress);
  clearInterval(intervalId);
});
</script>

<main>
  <h1>Snake</h1>
  <Field {gameState} />
</main>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 240px;
  margin: 0 auto;
  height: 100%;
}

h1 {
  color: #ff3e00;
  text-transform: uppercase;
  font-size: 4em;
  font-weight: 100;
}

@media (min-width: 640px) {
  main {
    max-width: none;
  }
}
</style>
