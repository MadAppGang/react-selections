import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { calculateArea } from '../utils/area';
import '../styles/index.css';

const px = value => `${value}px`;

class AbstractSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      isHovered: false,
      area: props.area,
    };

    this.getPositionStyles = this.getPositionStyles.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.setState = this.setState.bind(this);

    this.className = 'mr-selection';
  }

  getStyles() {
    return this.getPositionStyles();
  }

  getMaxPossibleArea() {
    const { containerParameters } = this.props;
    return calculateArea(containerParameters.dimensions);
  }

  getZIndex(dimensions) {
    const area = calculateArea(dimensions);
    const maxPossibleArea = this.getMaxPossibleArea();

    return maxPossibleArea - area;
  };

  getPositionStyles() {
    const { dimensions, coordinates } = this.state.area;

    return Object.freeze({
      width: px(dimensions.width),
      height: px(dimensions.height),
      left: px(coordinates.x),
      top: px(coordinates.y),
      zIndex: this.getZIndex(dimensions),
    });
  }

  getClassName() {
    return this.className;
  }

  handleFocus() {
    this.setState({ isFocused: true });

    if (this.props.onFocus) {
      this.props.onFocus(this.selectionEl);
    }
  }

  handleBlur() {
    this.setState({ isFocused: false });

    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  handleMouseOver() {
    this.setState({ isHovered: true });
  }

  handleMouseOut() {
    this.setState({ isHovered: false });
  }

  render() {
    const { focusable = true } = this.props;

    return (
      <div
        tabIndex={+focusable - 1}
        role="button"
        ref={el => this.selectionEl = el}
        className={this.getClassName()}
        style={this.getStyle()}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onClick={this.props.onClick}
      />
    );
  }
}

AbstractSelection.propTypes = {
  area: PropTypes.shape({
    dimensions: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),
    coordinates: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  }).isRequired,
  zIndex: PropTypes.number.isRequired,
  focusable: PropTypes.bool,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

AbstractSelection.defaultProps = {
  onClick: null,
  onFocus: null,
  onBlur: null,
};

export default AbstractSelection;
