import ContainerAccessor from './container';
import SelectionAccessor from './selection';
import { getClientY } from '../utils/events';

function DragCalculator(containerParams) {
  const container = ContainerAccessor(containerParams);

  const calculate = (event, selectionParams, innerOffsets) => {
    const selection = SelectionAccessor(selectionParams);

    let x = event.clientX - container.offsetLeft() - innerOffsets.left;
    let y = getClientY(event) - container.offsetTop() - innerOffsets.top;

    y = y < 0 ? 0 : y;
    x = x < 0 ? 0 : x;

    const isBeyondContainerWidth = (x + selection.width()) > container.width();
    const isBeyondContainerHeight = (y + selection.height()) > container.height;

    if (isBeyondContainerWidth) {
      x = container.width() - selection.width();
    }

    if (isBeyondContainerHeight) {
      y = container.height() - selection.height();
    }

    return Object.freeze({
      ...selectionParams,
      coordinates: {
        x: x + container.paddingLeft(),
        y: y + container.paddingTop(),
      },
    });
  };

  return Object.freeze({ calculate });
}

export default DragCalculator;
