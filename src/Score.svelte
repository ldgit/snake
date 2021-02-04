<script>
import startScoring from './core/score';

const scoreStore = startScoring();

export let current = 0;
let displayed = current;
$: scoreStore.newScore(current);

scoreStore.subscribe(currentScore => (displayed = currentScore));
</script>

Score: <span>{displayed}</span>
