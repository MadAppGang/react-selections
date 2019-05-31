import React from 'react';
import PropTypes from 'prop-types';
import CSSClassBuilder from 'css-class-combiner';
import AbstractSelection from './AbstractSelection';
import { getClientY } from '../utils/events';
import Cursors, { setCursor } from '../utils/cursors';
import { getSelectionOffsets } from '../utils/area';
import ResizeCalculator from '../core/resize';
import DragCalculator from '../core/drag';
import * as sides from '../utils/sides';

const MIN_DIMENSION_SIZE_FOR_BIG_HANDLE = 40;
const BIG_HANDLE_SIZE = 8;
const SMALL_HANDLE_SIZE = 5;

const getHandleSize = (dimensions) => {
  const isTooSmall = Object.values(dimensions)
    .some(d => d < MIN_DIMENSION_SIZE_FOR_BIG_HANDLE);

  return isTooSmall ? SMALL_HANDLE_SIZE : BIG_HANDLE_SIZE;
};

class InteractiveSelection extends AbstractSelection {
  constructor(props) {
    super(props);

    this.containerParameters = props.containerParameters;
    this.innerOffsets = {};
    this.selectionEl = null;

    this.state = {
      isFocused: false,
      isHovered: false,
      isDragging: false,
      area: props.area,
    };

    this.handleMouseDownOnSelection = this.handleMouseDownOnSelection.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.dragSelection = this.dragSelection.bind(this);
    this.resizeSelection = this.resizeSelection.bind(this);

    this.resizeCalculator = null;
    this.dragCalculator = null;
  }

  componentDidMount() {
    this.selectionEl.addEventListener('mousedown', this.handleMouseDownOnSelection);
  }

  componentWillReceiveProps(nextProps) {
    const { area, containerParameters } = nextProps;

    this.resizeCalculator = ResizeCalculator(containerParameters);
    this.dragCalculator = DragCalculator(containerParameters);
    this.containerParameters = containerParameters;

    this.setState({ area });
  }

  componentWillUnmount() {
    this.selectionEl
      .removeEventListener('mousedown', this.handleMouseDownOnSelection);
  }

  getInnerOffsets(event) {
    const selectionOffsets = getSelectionOffsets(this.selectionEl);

    return Object.freeze({
      left: event.clientX - selectionOffsets.left,
      top: getClientY(event) - selectionOffsets.top,
    });
  }

  handleMouseUp() {
    const { isDragging } = this.state;

    if (isDragging) {
      this.stopDragSelection();
    } else {
      this.stopResizeSelection();
    }

    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDownOnSelection(event) {
    event.stopPropagation();

    if (this.props.frozen) {
      return;
    }

    this.selectionEl.focus();

    if (event.target === this.selectionEl) {
      this.startDrag(event);
    } else {
      this.startResize(event.target.dataset.side);
    }

    window.addEventListener('mouseup', this.handleMouseUp);
  }

  dragSelection(event) {
    event.stopPropagation();

    this.setState(state => ({
      area: this.dragCalculator.calculate(event, state.area, this.innerOffsets),
    }));
  }

  resizeSelection(event) {
    event.stopPropagation();

    const calculate = this.resizeCalculator.forSide(this.resizeSide)
    const area = calculate(event, this.state.area);

    this.setState({
      area: {
        ...this.state.area,
        ...area,
      },
    });
  }

  stopDragSelection() {
    const {onAreaUpdate} = this.props;
    this.setState({ isDragging: false });
    if (onAreaUpdate) {
      onAreaUpdate(this.state.area);
    }

    setCursor(Cursors.DEFAULT);
    window.removeEventListener('mousemove', this.dragSelection);
  }

  stopResizeSelection() {
    const {onAreaUpdate} = this.props;
    window.removeEventListener('mousemove', this.resizeSelection);
    if (onAreaUpdate) {
      onAreaUpdate(this.state.area);
    }
  }

  startResize(resizeSide) {
    this.resizeSide = resizeSide;

    window.addEventListener('mousemove', this.resizeSelection);
  }

  startDrag(event) {
    setCursor(Cursors.GRABBING);
    this.setState({ isDragging: true });

    this.innerOffsets = this.getInnerOffsets(event);

    window.addEventListener('mousemove', this.dragSelection);
  }

  getClassName() {
    const { isHovered, isFocused, isDragging } = this.state;
    const {
      className, hoverClassName, focusClassName, frozen,
    } = this.props;

    return new CSSClassBuilder('mr-selection')
      .combine('mr-interactive-selection')
      .combine(className)
      .combineIf(isHovered, hoverClassName)
      .combineIf(isFocused, focusClassName)
      .combineIf(isDragging, 'mr-interactive-selection--drag')
      .combineIf(frozen, 'mr-selection--transparent');
  }

  getStyles() {
    return {
      ...this.props.style,
      ...this.getPositionStyles(),
      '--handle-size': `${getHandleSize(this.state.area.dimensions)}px`,
    };
  }

  render() {
    const styles = this.getStyles();
    const className = this.getClassName();

    return (
      <div
        tabIndex={0}
        role="button"
        ref={el => this.selectionEl = el}
        className={className}
        style={styles}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onDragStart={e => e.preventDefault()}
      >
        <div
          className="mr-selection__handle mr-selection__handle--top-left"
          data-side={sides.TOP_LEFT}
        />
        <div
          className="mr-selection__handle mr-selection__handle--top-center"
          data-side={sides.TOP}
        />
        <div
          className="mr-selection__handle mr-selection__handle--top-right"
          data-side={sides.TOP_RIGHT}
        />
        <div
          className="mr-selection__handle mr-selection__handle--right-center"
          data-side={sides.RIGHT}
        />
        <div
          className="mr-selection__handle mr-selection__handle--bottom-right"
          data-side={sides.BOTTOM_RIGHT}
        />
        <div
          className="mr-selection__handle mr-selection__handle--bottom-center"
          data-side={sides.BOTTOM}
        />
        <div
          className="mr-selection__handle mr-selection__handle--bottom-left"
          data-side={sides.BOTTOM_LEFT}
        />
        <div
          className="mr-selection__handle mr-selection__handle--left-center"
          data-side={sides.LEFT}
        />
      </div>
    );
  }
}

InteractiveSelection.propTypes = {
  frozen: PropTypes.bool,
  onAreaUpdate: PropTypes.func,
};

InteractiveSelection.defaultProps = {
  frozen: false,
  onAreaUpdate: null,
};

export default InteractiveSelection;
