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

    let nextSelectionWidth;

    if (xWithinContainer > container.width()) {
      nextSelectionWidth = container.width() - innerX;
    } else {
      const oldBorderDifference = xWithinContainer - boxRightBorder;

      nextSelectionWidth = selection.width() + oldBorderDifference;
    }

    const res = Object.freeze({
      dimensions: {
        width: nextSelectionWidth,
        height: selection.height(),
      },
      coordinates: {
        x: selection.x(),
        y: selection.y(),
      },
    });

    return res;
  };

  const forSide = (side) => {
    return {
      // [sides.TOP]: calculateTopSideResize,
      // [sides.BOTTOM]: calculateBottomSideResize,
      [sides.RIGHT]: calculateRightResize,
      // [sides.LEFT]: calculateLeftSideResize,
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
