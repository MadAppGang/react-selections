import {
  calculateArea,
  getSelectionOffsetsFrom,
  getSelectionOffsets,
} from '../area';

describe('area utils', () => {
  describe('calculate area', () => {
    test('is a function', () => {
      expect(calculateArea).toBeInstanceOf(Function);
    });

    test('returns null if parameters argument is missing', () => {
      expect(calculateArea()).toBe(null);
    });

    test('returns null if parameters argument is not an object', () => {
      expect(calculateArea(15)).toBe(null);
    });

    test('calucates area properly', () => {
      const params = {
        height: 2,
        width: 2,
      };
      const area = calculateArea(params);
      const expectedResult = 4;

      expect(area).toEqual(expectedResult);
    });

    test('returns null if one of parameters is messing', () => {
      const params = {
        height: 2,
        // missing width,
      };
      const area = calculateArea(params);
      const expectedResult = null;

      expect(area).toEqual(expectedResult);
    });
  });
});
