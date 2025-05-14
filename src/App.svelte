<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import Field from './Field.svelte';
import Score from './Score.svelte';
import Settings from './Settings.svelte';
import startSnakeGame from './core/snake';
import GameOver from './GameOver.svelte';
import type { GameState } from './core/types';
import { updateAppearance } from './core/utils';
import GithubLink from './GithubLink.svelte';
import { getDefaultSpeed } from './core/speedLevels';
import { newGame } from './core/newGame';

let snakeGame = $state.raw(startSnakeGame({}));
let gameState: GameState = $state.raw(newGame());
let delay: number = $state(getDefaultSpeed());
let darkMode = $state(false);

$effect(() => {
  snakeGame.subscribe((newState: GameState) => {
    gameState = newState;
  });
  snakeGame.changeDelayBetweenMoves(delay);
});

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

onMount(() => updateAppearance(darkMode));
onDestroy(() => snakeGame.destroy);

function restartGame() {
  snakeGame.destroy();
  snakeGame = startSnakeGame({});
}
</script>

<svelte:window onkeypress={handleKeypress} />
<main class="flex flex-col items-center text-center text-gray-900 dark:text-gray-200">
  <GithubLink />
  <h1 class="uppercase text-7xl text-svelte-red font-thin my-12">Snake</h1>
  <div class="flex flex-col items-start">
    <div class="flex justify-between text-3xl w-full">
      <span><Score current={gameState.score} /></span>
      <button
        class="cursor-pointer"
        onclick={() => {
          darkMode = !darkMode;
          updateAppearance(darkMode);
        }}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
    <Field {gameState} />
  </div>
  <Settings bind:delay />
  <GameOver
    gameOver={gameState.gameOver}
    finalScore={gameState.score}
    onNewGameClick={restartGame}
  />
</main>
