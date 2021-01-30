// Order is important
export const speedMap = [
  { delay: 300000, description: '"Need to make some coffee" speed' }, // cca. 5 minutes between moves
  { delay: 700, description: 'Dead snail on a slope' },
  { delay: 540, description: 'Snail' },
  { delay: 400, description: 'Sloth' },
  { delay: 320, description: 'Snail running from a bird' },
  { delay: 230, description: 'Turtle' },
  { delay: 160, description: 'Turtle on a skateboard' },
  { delay: 80, description: 'Regular speed' },
  { delay: 50, description: 'Fast' },
  { delay: 30, description: 'Cheetah' },
  { delay: 20, description: 'Cheetah driving a Porsche' },
  { delay: 10, description: 'M-497 Black Beetle' },
  { delay: 4, description: 'Warp 11' }, // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval#delay_restrictions
];

export function getDefaultSpeed() {
  return speedMap.findIndex(value => value.delay === 80);
}
