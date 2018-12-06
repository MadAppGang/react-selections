import { getClientY, getClientYWithGlobalOffset } from '../events';

describe('browser events', () => {
  describe('get client Y coordinate with global offset', () => {
    const padding = 20;
    const getY = getClientYWithGlobalOffset(padding);

    test('returns y coord from last touch event', () => {
      const event = {
        changedTouches: [{ clientY: 20 }],
      };

      const y = getY(event);

      expect(y).toBe(padding + event.changedTouches[0].clientY);
    });

    test('returns y coord directly from event', () => {
      const event = {
        clientY: padding,
      };

      const y = getY(event);

      expect(y).toBe(padding + event.clientY);
    });

    test('named export getClientY matches the result of the HOF', () => {
      expect(getClientY.toString()).toBe(getY.toString());
    });
  });
});
