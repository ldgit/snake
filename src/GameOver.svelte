<script lang="ts">
import { scale } from 'svelte/transition';
import { quadIn } from 'svelte/easing';

export let gameOver: boolean;
export let finalScore: number;
export let onNewGameClick;
</script>

{#if gameOver}
  <div
    class="flex items-center justify-center flex-col opacity-90 bg-black fixed w-full h-full top-0 left-0 z-50"
    in:scale={{ duration: 1500, easing: quadIn, start: 0.3 }}
  >
    <h1 class="text-white my-5 text-3xl">Game over</h1>
    <p class="text-svelte-red uppercase text-7xl m-16">
      Final score: {finalScore}
    </p>
    <button
      class="relative border-none rounded-md w-44 h-14 bg-svelte-red text-white text-base font-bold uppercase px-2 py-4 hover:bg-svelte-red-dark"
      on:click={onNewGameClick}
    >
      New game
    </button>
  </div>
{/if}
