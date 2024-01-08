<script lang="ts">
import type { GameState, Square } from './core/types';

import { WIDTH, HEIGHT } from './core/utils';

export let gameState: GameState;

function getBodyPartClasses(bodyPart: 'head' | 'trunk' | 'tail'): string {
  if (bodyPart === 'head') {
    return 'w-vh-large h-vh-large';
  }
  if (bodyPart === 'trunk') {
    return 'w-vh-medium h-vh-medium';
  }
  // Tail
  return 'w-vh-xs h-vh-xs';
}

function getSquareClasses(square: Square): string {
  if (square?.type === 'snake') {
    return `bg-black dark:bg-green-300 ${getBodyPartClasses(square.bodyPart!)}`;
  }
  if (square?.type === 'food') {
    return 'rounded-full bg-svelte-red w-vh-small h-vh-small';
  }
  return '';
}
</script>

<div
  class="snakeBox grid place-items-center gap-vh-small p-vh-small border-4 border-solid border-black dark:border-gray-200"
  style="--width: {WIDTH}; --height: {HEIGHT};"
>
  {#each gameState.field as row}
    {#each row as square (square.id)}
      <div class="w-vh-large h-vh-large {getSquareClasses(square)}" />
    {/each}
  {/each}
</div>

<style>
.snakeBox {
  grid-template-columns: repeat(var(--width), 3.6vh);
  grid-template-rows: repeat(var(--height), 3.6vh);
}
</style>
