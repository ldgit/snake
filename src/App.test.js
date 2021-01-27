import { render } from '@testing-library/svelte';

import App from './App.svelte';

test('should render without error', () => {
  const { container } = render(App);
  expect(container.querySelector('.snakeBox')).toBeInTheDocument();
});
