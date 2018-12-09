import React from 'react';
import PropTypes from 'prop-types';
import CSSClassBuilder from 'css-class-combiner';
import AbstractSelection from './AbstractSelection';
import { getClientY } from '../utils/events';
import Cursors, { setCursor } from '../utils/cursors';
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
      area: props.area,
      draggableMode: false,
    };

    this.handleMouseDownOnSelection = this.handleMouseDownOnSelection.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.dragSelection = this.dragSelection.bind(this);
    this.resizeSelection = this.resizeSelection.bind(this);
  }

  componentDidMount() {
    this.selectionEl.addEventListener('mousedown', this.handleMouseDownOnSelection);

    if (this.props.createdByUser) {
      this.manuallyStartToResize();
    }
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

  getSelectionOffsets() {
    const { left, top } = this.selectionEl.getBoundingClientRect();

    return Object.freeze({
      left: left + window.pageXOffset,
      top: top + window.pageYOffset,
    });
  }

  getInnerOffsets(event) {
    const selectionOffsets = this.getSelectionOffsets();

    return Object.freeze({
      left: event.clientX - selectionOffsets.left,
      top: getClientY(event) - selectionOffsets.top,
    });
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

    if (this.props.frozen) {
      return;
    }

    if (target === this.selectionEl) {
      this.startDrag(event);
    } else {
      this.startResize(target.dataset.side);
    }

    window.addEventListener('mouseup', this.handleMouseUp);
  }

  manuallyStartToResize() {
    this.startResize(sides.BOTTOM_RIGHT);
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
    const { isSingle } = this.props;

    this.setState({ draggableMode: false });
    this.props.onAreaUpdate(this.state.area);

    setCursor(isSingle ? Cursors.GRAB : Cursors.DEFAULT);
    window.removeEventListener('mousemove', this.dragSelection);
  }

  stopResizeSelection() {
    window.removeEventListener('mousemove', this.resizeSelection);
    this.props.onAreaUpdate(this.state.area);
  }

  startResize(resizeSide) {
    this.resizeSide = resizeSide;
    window.addEventListener('mousemove', this.resizeSelection);
  }

  startDrag(event) {
    this.setState({ draggableMode: true });
    this.innerOffsets = this.getInnerOffsets(event);

    setCursor(Cursors.GRABBING);

    window.addEventListener('mousemove', this.dragSelection);
  }

  getClassName() {
    const { isHovered, isFocused, draggableMode } = this.state;
    const {
      className, hoverClassName, focusClassName, frozen,
    } = this.props;

    return new CSSClassBuilder('mr-selection')
      .combine('mr-interactive-selection')
      .combine(className)
      .combineIf(isHovered, hoverClassName)
      .combineIf(isFocused, focusClassName)
      .combineIf(frozen, 'mr-selection--transparent')
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
  frozen: PropTypes.bool,
  createdByUser: PropTypes.bool,
  isSingle: PropTypes.bool,
  onAreaUpdate: PropTypes.func,
};

InteractiveSelection.defaultProps = {
  frozen: false,
  createdByUser: false,
  isSingle: false,
  onAreaUpdate: null,
};

export default InteractiveSelection;
