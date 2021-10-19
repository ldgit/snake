/**
 * @jest-environment jsdom
 */
import { render, fireEvent, act } from '@testing-library/svelte';

import App from './App.svelte';

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

describe('Snake app', () => {
  // Needs to run first or it does not fail for some reason :(
  it('should do a fast u-turn without error', async () => {
    const { container } = render(App);
    expect(container.querySelector('.snakeBox')).toBeInTheDocument();
    // Change direction back into itself
    await fireEvent.keyPress(container, { key: 'w' });
    await fireEvent.keyPress(container, { key: 'a' });
    await act(() => sleep(200));
    expect(container.querySelectorAll('.w-vh-medium').length).toBeGreaterThan(3);
    expect(container.querySelectorAll('.h-vh-medium').length).toBeGreaterThan(3);
  });

  it('should render and change direction without error', async () => {
    const { container } = render(App);
    expect(container.querySelector('.snakeBox')).toBeInTheDocument();

    await fireEvent.keyPress(container, { key: 'w' });
    await act(() => sleep(100));
    await fireEvent.keyPress(container, { key: 'a' });
    await act(() => sleep(100));

    expect(container.querySelectorAll('.w-vh-medium').length).toBeGreaterThan(3);
    expect(container.querySelectorAll('.h-vh-medium').length).toBeGreaterThan(3);
  });
});
