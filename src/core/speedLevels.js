// Order is important
export const speedMap = [
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

export function getDefaultSpeed() {
  return speedMap.findIndex(value => value.delay === 80);
}
