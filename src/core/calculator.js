import ContainerAccessor from './container';
import SelectionAccessor from './selection';
import { getClientY } from '../utils/events';
import * as sides from '../utils/sides';

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
      const travelDistance = xWithinContainer - boxRightBorder;

      nextSelectionWidth = selection.width() + travelDistance;
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
      const travelDistance = xWithinContainer - innerX;

      nextX = innerX + travelDistance;
      nextSelectionWidth = selection.width() - travelDistance;
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

  const calculateBottomResize = (event, selectionParams) => {
    const selection = SelectionAccessor(selectionParams);

    const innerY = selection.y() - container.paddingTop();
    const yWithinContainer = getClientY(event) - container.offsetTop();
    const boxBottomBorder = innerY + selection.height();

    let nextSelectionHeight;

    const tooCloseToTop = yWithinContainer - innerY <= 10;

    if (tooCloseToTop) {
      return selectionParams;
    }

    if (yWithinContainer > container.height()) {
      nextSelectionHeight = container.height() - innerY;
    } else {
      const travelDistance = yWithinContainer - boxBottomBorder;

      nextSelectionHeight = selection.height() + travelDistance;
    }

    return Object.freeze({
      coordinates: selectionParams.coordinates,
      dimensions: {
        height: nextSelectionHeight,
        width: selection.width(),
      },
    });
  };

  const forSide = (side) => {
    return {
      // [sides.TOP]: calculateTopResize,
      [sides.BOTTOM]: calculateBottomResize,
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
