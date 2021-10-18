<script lang="ts">
import Hoverable from './Hoverable.svelte';
import { speedMap, getDefaultSpeed } from './core/speedLevels';

let speed = getDefaultSpeed();
export let delay = speedMap[speed].delay;
$: delay = speedMap[speed].delay;
</script>

<Hoverable let:hovering class="mt-3 flex flex-col items-center justify-start h-12">
  <span>{speedMap[speed].description}</span>
  <div class="flex mt-1">
    <input
      class="w-56 mx-2 {hovering ? 'opacity-100' : 'opacity-0'} transition duration-500 ease-in-out"
      type="range"
      disabled={!hovering || undefined}
      bind:value={speed}
      min="0"
      max={speedMap.length - 1}
      step="1" />
  </div>
</Hoverable>
