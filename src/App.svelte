<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import Field from './Field.svelte';
import Score from './Score.svelte';
import Settings from './Settings.svelte';
import startSnakeGame from './core/snake';
import GameOver from './GameOver.svelte';
import type { GameState } from './core/types';

let gameState: GameState;
let delay: number;
let snakeGame = startSnakeGame({});
let darkMode = false;

$: snakeGame.subscribe((newState: GameState) => (gameState = newState));
$: snakeGame.changeDelayBetweenMoves(delay);

function updateAppearence(): void {
  if (darkMode) {
    window.document.documentElement.classList.add('dark');
  } else {
    window.document.documentElement.classList.remove('dark');
  }
}

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

onMount(updateAppearence);
onDestroy(snakeGame.destroy);

function restartGame() {
  snakeGame.destroy();
  snakeGame = startSnakeGame({});
}
</script>

<svelte:window on:keypress={handleKeypress} />
<main class="flex flex-col items-center text-center">
  <h1 class="uppercase text-7xl text-svelte-red font-thin my-12">Snake</h1>
  <div class="flex flex-col items-start">
    <div class="flex justify-between text-3xl w-full">
      <span><Score current={gameState.score} /></span>
      <button
        on:click={() => {
          darkMode = !darkMode;
          updateAppearence();
        }}>{darkMode ? '☀️' : '🌙'}</button>
    </div>
    <Field {gameState} />
  </div>
  <Settings bind:delay />
  <GameOver
    gameOver={gameState.gameOver}
    finalScore={gameState.score}
    onNewGameClick={restartGame} />
</main>

<style lang="postcss" global>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
