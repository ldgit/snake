<script type="text/typescript">
import { scale } from 'svelte/transition';
import { quadIn } from 'svelte/easing';

export let gameOver;
export let finalScore;
export let onNewGameClick;
</script>

{#if gameOver}
  <div class="overlay" in:scale={{ duration: 1500, easing: quadIn, start: 0.3 }}>
    <h1>Game over</h1>
    <p>
      Final score: {finalScore}
    </p>
    <button on:click={onNewGameClick}> New game </button>
  </div>
{/if}

<style>
.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: 0.9;
  background-color: black;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 1000;
}

h1 {
  color: white;
}

p {
  color: #ff3e00;
  text-transform: uppercase;
  font-size: 6vh;
}

button {
  position: relative;
  border-style: none;
  border-radius: 0.4rem;
  width: 180px;
  height: 3.5rem;
  background-color: #ff3e00;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 8px 22px;
  text-transform: uppercase;
}

button:hover {
  background-color: #ff4000c5;
  cursor: pointer;
}

button:active {
  background-color: #ff3e00;
  cursor: pointer;
}
</style>
