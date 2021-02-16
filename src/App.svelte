<script lang="ts">
import { onDestroy } from 'svelte';
import Field from './Field.svelte';
import Score from './Score.svelte';
import Settings from './Settings.svelte';
import startSnakeGame from './core/snake';
import GameOver from './GameOver.svelte';

let gameState;
let delay;
let snakeGame = startSnakeGame({});

$: snakeGame.subscribe(newState => (gameState = newState));
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

function restartGame() {
  snakeGame.destroy();
  snakeGame = startSnakeGame({});
}
</script>

<svelte:window on:keypress={handleKeypress} />
<main>
  <h1>Snake</h1>
  <div class="game">
    <span class="score">
      <Score current={gameState.score} />
    </span>
    <Field {gameState} />
  </div>
  <Settings bind:delay />
  <GameOver
    gameOver={gameState.gameOver}
    finalScore={gameState.score}
    onNewGameClick={restartGame} />
</main>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.game {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.score {
  font-size: 2rem;
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
