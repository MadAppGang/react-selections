import update from 'update-by-path';
import { calculateArea, sortByArea } from '../area';

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

  describe('sort by area', () => {
    test('is a function', () => expect(sortByArea).toBeInstanceOf(Function));

    test('returns 0 if one of arguments is missing', () => {
      const output = sortByArea();

      expect(output).toBe(0);
    });

    test('returns -1 if first argument is greater by area', () => {

      const output = sortByArea(
        update({}, 'area.dimensions', { height: 2, width: 2 }),
        update({}, 'area.dimensions', { height: 3, width: 1 }),
      );
      
      expect(output).toBe(-1);
    });

    test('returns 1 if first argument is less then by area', () => {

      const output = sortByArea(
        update({}, 'area.dimensions', { height: 3, width: 1 }),
        update({}, 'area.dimensions', { height: 2, width: 2 }),
      );
      
      expect(output).toBe(1);
    });

    test('returns 0 if first argument does not match the scheme', () => {

      const output = sortByArea(
        update({}, 'area.dimensions', { height: 3, width: 1 }),
        update({}, 'area.dimensions', {}),
      );
      
      expect(output).toBe(0);
    });
  });
});