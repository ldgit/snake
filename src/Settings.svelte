<script>
import Hoverable from './Hoverable.svelte';
import { fade } from 'svelte/transition';
import { speedMap, getDefaultSpeed } from './core/speedLevels';

let speed = getDefaultSpeed();
export let delay = speedMap[speed].delay;
$: delay = speedMap[speed].delay;
</script>

<Hoverable let:hovering class="controls">
  <span>{speedMap[speed].description}</span>
  {#if hovering}
    <div class="speedControl" transition:fade>
      <button on:click={() => (speed > 0 ? (speed -= 1) : null)}>&#xFF0D;</button>
      <input type="range" bind:value={speed} min="0" max={speedMap.length - 1} step="1" />
      <button on:click={() => (speed < speedMap.length - 1 ? (speed += 1) : null)}>&#xFF0B</button>
    </div>
  {/if}
</Hoverable>

<style>
/* https://sveltesociety.dev/recipes/component-recipes/passing-attributes-to-component-dom-element */
:global(.controls) {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 50px;
  min-width: 500px;
}

.speedControl {
  display: flex;
  margin-top: 4px;
}

/* BEGIN Apply styles that allow us to customize range input */
input[type='range'] {
  -webkit-appearance: none;
  width: 15vw; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
}

input[type='range']:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type='range']::-ms-track {
  width: 100%;
  cursor: pointer;

  /* Hides the slider so custom styles can be added */
  background: transparent;
  border-color: transparent;
  color: transparent;
}
/* END Apply styles that allow us to customize range input */

/* Special styling for WebKit/Blink */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: 2px solid #000000;
  height: 16px;
  width: 16px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}

/* All the same stuff for Firefox */
input[type='range']::-moz-range-thumb {
  border: 2px solid #000000;
  height: 16px;
  width: 16px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}

input[type='range']:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type='range']::-ms-track {
  width: 100%;
  cursor: pointer;

  /* Hides the slider so custom styles can be added */
  background: transparent;
  border-color: transparent;
  color: transparent;
}

button {
  border: 2px solid black;
  background-color: white;
  height: 24px;
  font-weight: bold;
  font-size: 14px;
}

button:hover {
  background-color: black;
  color: white;
}
</style>
