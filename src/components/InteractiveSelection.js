import React from 'react';
import PropTypes from 'prop-types';
import CSSClassBuilder from 'css-class-combiner';
import StyledSelection from './StyledSelection';
import {
  calculateTopSideResize,
  calculateBottomSideResize,
  calculateRightSideResize,
  calculateLeftSideResize,
  calculateBottomRightSidesResize,
  calculateBottomLeftSidesResize,
  calculateTopRightSidesResize,
  calculateTopLeftSidesResize,
  calculateDragSelection,
} from './calculations';
import { getClientY } from '../helpers';
import Cursors, { setCursor } from '../utils/cursors';
import * as sides from '../utils/sides';

const MIN_DIMENSION_SIZE_FOR_BIG_HANDLE = 40;
const BIG_HANDLE_SIZE = 10;
const SMALL_HANDLE_SIZE = 8;

const getHandleSize = (regionDimensions) => {
  const isRegionTooSmall = Object.values(regionDimensions)
    .some(d => d < MIN_DIMENSION_SIZE_FOR_BIG_HANDLE);

  if (isRegionTooSmall) {
    return SMALL_HANDLE_SIZE;
  }

  return BIG_HANDLE_SIZE;
};

class InteractiveSelection extends StyledSelection {
  constructor(props) {
    super(props);
    this.containerParameters = props.containerParameters;

    this.state = {
      isFocused: false,
      isHovered: false,
      area: props.area,
      draggableMode: false,
    };

    this.handlers = {
      [sides.TOP]: calculateTopSideResize,
      [sides.BOTTOM]: calculateBottomSideResize,
      [sides.RIGHT]: calculateRightSideResize,
      [sides.LEFT]: calculateLeftSideResize,
      [sides.BOTTOM_RIGHT]: calculateBottomRightSidesResize,
      [sides.BOTTOM_LEFT]: calculateBottomLeftSidesResize,
      [sides.TOP_RIGHT]: calculateTopRightSidesResize,
      [sides.TOP_LEFT]: calculateTopLeftSidesResize,
    };

    this.handleMouseDownOnSelection =
      this.handleMouseDownOnSelection.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.dragSelection = this.dragSelection.bind(this);
    this.resizeSelection = this.resizeSelection.bind(this);
  }

  componentDidMount() {
    this.selectionEl
      .addEventListener('mousedown', this.handleMouseDownOnSelection);

    if (this.props.createdByUser) {
      this.manuallyStartToResize();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { area, containerParameters } = nextProps;

    this.containerParameters = containerParameters;

    this.setState({ area });
  }

  componentWillUnmount() {
    this.selectionEl
      .removeEventListener('mousedown', this.handleMouseDownOnSelection);
  }

  setDefaultInnerOffset() {
    const { dimensions } = this.state.area;
    const innerOffsets = {
      left: dimensions.width / 2,
      top: dimensions.height / 2,
    };

    this.setState({ innerOffsets });
  }

  getSelectionOffsets() {
    let { left, top } = this.selectionEl.getBoundingClientRect();

    left += window.pageXOffset;
    top += window.pageYOffset;

    return {
      left, top,
    };
  }

  getInnerOffsets(event) {
    const { clientX } = event;
    const clientY = getClientY(event);

    const {
      top: selectionTopOffset,
      left: selectionLeftOffset,
    } = this.getSelectionOffsets();

    const innerOffsetLeft = clientX - selectionLeftOffset;
    const innerOffsetTop = clientY - selectionTopOffset;

    return {
      left: innerOffsetLeft,
      top: innerOffsetTop,
    };
  }

  handleMouseUp() {
    const { draggableMode } = this.state;

    if (draggableMode) {
      this.stopDragSelection();
    } else {
      this.stopResizeSelection();
    }

    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDownOnSelection(event) {
    event.stopPropagation();
    this.selectionEl.focus();
    const { target } = event;

    if (this.props.freeze) {
      return;
    }

    const isMouseDownOnSelection = target === this.selectionEl;

    if (isMouseDownOnSelection) {
      this.startDrag(event);
    } else {
      const resizeSide = target.dataset.side;
      this.startResize(resizeSide);
    }

    window.addEventListener('mouseup', this.handleMouseUp);
  }

  manuallyStartToResize() {
    this.startResize(sides.BOTTOM_RIGHT);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  dragSelection(event) {
    event.stopPropagation();
    const { area, innerOffsets } = this.state;
    const coordinates = calculateDragSelection(
      event,
      area,
      innerOffsets,
      this.containerParameters,
    );

    this.setState({ area: { ...area, coordinates } });
  }

  resizeSelection(event) {
    event.stopPropagation();
    const calculate = this.handlers[this.resizeSide];
    const area = calculate(
      event,
      this.state.area,
      this.containerParameters,
    );

    this.setState({ area });
  }

  stopDragSelection() {
    const { isSingle } = this.props;

    this.setState({ draggableMode: false });
    this.props.onUpdateSelection(this.state.area);

    setCursor(isSingle ? Cursors.GRAB : Cursors.DEFAULT);
    window.removeEventListener('mousemove', this.dragSelection);
  }

  stopResizeSelection() {
    window.removeEventListener('mousemove', this.resizeSelection);
    this.props.onUpdateSelection(this.state.area);
  }

  startResize(resizeSide) {
    this.resizeSide = resizeSide;
    window.addEventListener('mousemove', this.resizeSelection);
  }

  startDrag(event) {
    this.setState({
      draggableMode: true,
      innerOffsets: this.getInnerOffsets(event),
    });

    setCursor(Cursors.GRABBING);

    window.addEventListener('mousemove', this.dragSelection);
  }

  getClassName() {
    const { isHovered, isFocused, draggableMode } = this.state;
    const {
      className, hoverClassName, focusClassName, freeze,
    } = this.props;

    return new CSSClassBuilder('mr-selection')
      .combine('mr-interactive-selection')
      .combine(className)
      .combineIf(isHovered, hoverClassName)
      .combineIf(isFocused, focusClassName)
      .combineIf(freeze, 'mr-selection--transparent')
      .combineIf(draggableMode, 'mr-interactive-selection--drag');
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
  freeze: PropTypes.bool,
  createdByUser: PropTypes.bool,
  isSingle: PropTypes.bool,
  onUpdateSelection: PropTypes.func,
};

InteractiveSelection.defaultProps = {
  freeze: false,
  createdByUser: false,
  isSingle: false,
  onUpdateSelection: null,
};

export default InteractiveSelection;
