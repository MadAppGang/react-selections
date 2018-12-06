import { setCursor, createSetCursor, GRAB } from '../cursors';

describe('cursor utils', () => {
  describe('create set cursor HOF', () => {
    test('is a function', () => {
      expect(createSetCursor).toBeInstanceOf(Function);
    });

    test('returns a function', () => {
      expect(createSetCursor()).toBeInstanceOf(Function);
    });
  });

  describe('setCursor', () => {
    let document;
    let set;
    
    beforeEach(() => {
      document = {
        body: {
          className: '',
        },
      };
      set = createSetCursor(document.body);
    });

    test('sets given value to document`s className property', () => {
      set(GRAB);
      expect(document.body.className).toBe(GRAB);
    });

    test('setCursor export matches the one returned from createSetCursor', () => {
      expect(set.toString()).toBe(setCursor.toString());
    });
  });
});
