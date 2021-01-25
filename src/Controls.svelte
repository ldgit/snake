<script>
const speedMap = [
  { delay: 500, description: 'Dead snail on a slope' },
  { delay: 400, description: 'Snail' },
  { delay: 350, description: 'Snail running from a bird' },
  { delay: 250, description: 'Turtle depressed by the state of the world' },
  { delay: 300, description: 'Turtle' },
  { delay: 200, description: 'Turtle on a skateboard' },
  { delay: 130, description: 'Regular speed' },
  { delay: 100, description: 'Fast' },
  { delay: 60, description: 'Cheetah' },
  { delay: 30, description: 'Cheetah driving a Porsche' },
  { delay: 10, description: 'Bolt of Lighting' },
];

let speed = speedMap.findIndex(value => value.delay === 130);
export let delay = speedMap[speed].delay;
$: delay = speedMap[speed].delay;
console.log(speed);
</script>

<div class="controls">
  <input type="range" bind:value={speed} min="0" max={speedMap.length - 1} step="1" />
  <span>{speedMap[speed].description}</span>
</div>

<style>
.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.controls span {
  width: 400px;
}
</style>
