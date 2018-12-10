import ContainerAccessor from '../container';

describe('container accessor', () => {
  let container;
  let containerParams;

  beforeEach(() => {
    containerParams = {
      offsets: {
        top: 11,
        left: 12,
      },
      dimensions: {
        height: 13,
        width: 14,
      },
      extraPadding: {
        top: 15,
        left: 16,
      },
    };

    container = ContainerAccessor(containerParams);
  });

  test('constructor is a function', () => {
    expect(ContainerAccessor).toBeInstanceOf(Function);
  });

  test('constructor returns an object', () => {
    expect(container).not.toBe(undefined);
  });

  test('returns offset left', () => {
    expect(container.offsetLeft()).toBe(containerParams.offsets.left);
  });

  test('returns offset right', () => {
    expect(container.offsetTop()).toBe(containerParams.offsets.top);
  });

  test('returns height', () => {
    expect(container.height()).toBe(containerParams.dimensions.height);
  });

  test('returns width', () => {
    expect(container.width()).toBe(containerParams.dimensions.width);
  });

  test('returns padding left', () => {
    expect(container.paddingLeft()).toBe(containerParams.extraPadding.left);
  });

  test('returns padding top', () => {
    expect(container.paddingTop()).toBe(containerParams.extraPadding.top);
  });

  test('returns 0 padding left by default', () => {
    expect(ContainerAccessor({}).paddingLeft()).toBe(0);
  });

  test('returns 0 padding top by default', () => {
    expect(ContainerAccessor({}).paddingTop()).toBe(0);
  });
});
