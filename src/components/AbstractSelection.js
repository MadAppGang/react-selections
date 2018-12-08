import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../styles/index.css';

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

  calculateArea(dimensions) {
    return dimensions.height * dimensions.width;
  }

  getMaxPossibleArea() {
    const { containerParameters } = this.props;
    return this.calculateArea(containerParameters.dimensions);
  }

  getPositionStyles() {
    const { dimensions, coordinates } = this.state.area;
    const area = this.calculateArea(dimensions);
    const maxPossibleArea = this.getMaxPossibleArea();
    const zIndex = maxPossibleArea - area;

    return Object.freeze({
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      left: `${coordinates.x}px`,
      top: `${coordinates.y}px`,
      zIndex,
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
    const styles = this.getStyles();
    const className = this.getClassName();

    const { focusable = true } = this.props;

    return (
      <div
        tabIndex={+focusable - 1}
        role="button"
        ref={el => this.selectionEl = el}
        className={className}
        style={styles}
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
  focusable: true,
};

export const abastractSelectionScheme = AbstractSelection.propTypes;

export default AbstractSelection;
