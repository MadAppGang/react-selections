import SelectionAccessor from '../selection';

describe('selection accessor', () => {
  let selection;
  let selectionParams;

  beforeEach(() => {
    selectionParams = {
      coordinates: {
        x: 1,
        y: 2,
      },
      dimensions: {
        height: 3,
        width: 4,
      },
    };
    selection = SelectionAccessor(selectionParams);
  });

  test('constructor is a function', () => {
    expect(SelectionAccessor).toBeInstanceOf(Function);
  });

  test('constructor returns an object', () => {
    expect(selection).toBeInstanceOf(Object);
  });

  test('returns x coordinate', () => {
    expect(selection.x()).toBe(selectionParams.coordinates.x);
  });

  test('returns y coordinate', () => {
    expect(selection.y()).toBe(selectionParams.coordinates.y);
  });

  test('returns height', () => {
    expect(selection.height()).toBe(selectionParams.dimensions.height);
  });

  test('returns width', () => {
    expect(selection.width()).toBe(selectionParams.dimensions.width);
  });
});
