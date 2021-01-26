<script>
const speedMap = [
  { delay: 680, description: 'Dead snail on a slope' },
  { delay: 510, description: 'Snail' },
  { delay: 380, description: 'Snail running from a bird' },
  { delay: 300, description: 'Turtle depressed by the state of the world' },
  { delay: 230, description: 'Turtle' },
  { delay: 160, description: 'Turtle on a skateboard' },
  { delay: 80, description: 'Regular speed' },
  { delay: 50, description: 'Fast' },
  { delay: 30, description: 'Cheetah' },
  { delay: 20, description: 'Cheetah driving a Porsche' },
  { delay: 10, description: 'Bolt of Lighting' },
];

let speed = speedMap.findIndex(value => value.delay === 80);
export let delay = speedMap[speed].delay;
$: delay = speedMap[speed].delay;
</script>

<div class="controls">
  <div class="speedControl">
    <button on:click={() => (speed > 0 ? (speed -= 1) : null)}>&#xFF0D;</button>
    <input type="range" bind:value={speed} min="0" max={speedMap.length - 1} step="1" />
    <button on:click={() => (speed < speedMap.length - 1 ? (speed += 1) : null)}>&#xFF0B</button>
  </div>
  <span>{speedMap[speed].description}</span>
</div>

<style>
.controls {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.speedControl {
  display: flex;
}

.controls span {
  width: 400px;
}

input[type='range'] {
  -webkit-appearance: none;
  width: 15vw; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
}

/* Special styling for WebKit/Blink */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: 2px solid #000000;
  height: 16px;
  width: 16px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
  margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
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
