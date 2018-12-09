import * as sides from '../utils/sides';
import ContainerAccessor from './container';
import SelectionAccessor from './selection';

const MIN_WIDTH = 10;

function Calculator(containerParams) {
  const container = ContainerAccessor(containerParams);

  const calculateRightResize = (event, selectionParams) => {
    const selection = SelectionAccessor(selectionParams);

    const innerX = selection.x() - container.paddingLeft();
    const boxRightBorder = innerX + selection.width();
    const xWithinContainer = event.clientX - container.offsetLeft();

    const tooCloseToLeft = xWithinContainer - innerX <= MIN_WIDTH;

    if (tooCloseToLeft) {
      return selectionParams;
    }

    let nextSelectionWidth = container.width() - innerX;

    if (xWithinContainer <= container.width()) {
      const oldBorderDifference = xWithinContainer - boxRightBorder;

      nextSelectionWidth = selection.width() + oldBorderDifference;
    }

    return Object.freeze({
      dimensions: {
        width: nextSelectionWidth,
        height: selection.height(),
      },
      coordniates: selectionParams.coordinates,
    });
  };

  const calculateLeftResize = (event, selectionParams) => {
    const selection = SelectionAccessor(selectionParams);

    const innerX = selection.x() - container.paddingLeft();
    const boxRightBorder = innerX + selection.width();
    const xWithinContainer = event.clientX - container.offsetLeft();

    const isTooCloseToRight = boxRightBorder - xWithinContainer <= MIN_WIDTH;

    if (isTooCloseToRight) {
      return selectionParams;
    }

    let nextX = 0;
    let nextSelectionWidth = boxRightBorder;

    if (xWithinContainer > 0) {
      const oldBorderDifference = xWithinContainer - innerX;

      nextX = innerX + oldBorderDifference;
      nextSelectionWidth = selection.width() - oldBorderDifference;
    }

    return Object.freeze({
      dimensions: {
        width: nextSelectionWidth,
        height: selection.height(),
      },
      coordinates: {
        x: nextX + container.paddingLeft(),
        y: selection.y(),
      },
    });
  };

  const forSide = (side) => {
    return {
      // [sides.TOP]: calculateTopSideResize,
      // [sides.BOTTOM]: calculateBottomSideResize,
      [sides.RIGHT]: calculateRightResize,
      [sides.LEFT]: calculateLeftResize,
      // [sides.BOTTOM_RIGHT]: calculateBottomRightSidesResize,
      // [sides.BOTTOM_LEFT]: calculateBottomLeftSidesResize,
      // [sides.TOP_RIGHT]: calculateTopRightSidesResize,
      // [sides.TOP_LEFT]: calculateTopLeftSidesResize,
    }[side];
  };

  return Object.freeze({
    forSide,
  });
}

export default Calculator;
