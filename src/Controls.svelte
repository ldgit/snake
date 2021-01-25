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
    <button on:click={() => (speed > 0 ? (speed -= 1) : null)}>-</button>
    <input type="range" bind:value={speed} min="0" max={speedMap.length - 1} step="1" />
    <button on:click={() => (speed < speedMap.length - 1 ? (speed += 1) : null)}>+</button>
  </div>
  <span>{speedMap[speed].description}</span>
</div>

<style>
.controls {
  margin-top: 4px;
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
</style>
