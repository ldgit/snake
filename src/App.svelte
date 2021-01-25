<script>
import { onDestroy } from 'svelte';
import gameStateStore from './gameStateStore';
import Field from './Field.svelte';

let gameState;
let speed = 7;
const speedMap = [
  { delay: 500, description: 'Dead snail on a slope' },
  { delay: 400, description: 'Snail' },
  { delay: 350, description: 'Snail running from a bird' },
  { delay: 300, description: 'Lethargic turtle' },
  { delay: 250, description: 'Turtle' },
  { delay: 200, description: 'Turtle on a skateboard' },
  { delay: 130, description: 'Regular' },
  { delay: 100, description: 'Fast' },
  { delay: 70, description: 'Cheetah' },
  { delay: 50, description: 'Cheetah driving a Porsche' },
  { delay: 10, description: 'Bolt of Lighting' },
];

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
let intervalId = setInterval(gameStateStore.moveSnake, speedMap[speed].delay);

$: {
  clearInterval(intervalId);
  intervalId = setInterval(gameStateStore.moveSnake, speedMap[speed].delay);
}

onDestroy(() => {
  document.removeEventListener('keypress', handleKeypress);
  clearInterval(intervalId);
});
</script>

<main>
  <h1>Snake</h1>
  <Field {gameState} />
  <div class="controls">
    <span>Speed: {speedMap[speed].description}</span>
    <input type="range" bind:value={speed} min="0" max={speedMap.length - 1} step="1" />
  </div>
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

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.controls span {
  width: 300px;
}
</style>
