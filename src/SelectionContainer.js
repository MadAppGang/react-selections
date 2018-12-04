import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import CSSClassBuilder from 'css-class-combiner';

import SelectionWrapper from './SelectionWrapper';
import { sortByArea } from './helpers';

class SelectionContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rootParameters: props.containerParameters,
    };

    this.setRootParameters = this.setRootParameters.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.setRootParameters);
    this.setRootParameters();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.containerParameters !== this.props.containerParameters) {
      this.setState({ rootParameters: nextProps.containerParameters });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setRootParameters);
  }

  setRootParameters() {
    let { left, top } = this.root.getBoundingClientRect();

    top += window.pageYOffset;
    left += window.pageXOffset;

    const height = this.root.clientHeight;
    const width = this.root.clientWidth;

    const rootParameters = {
      offsets: {
        left, top,
      },
      dimensions: {
        width, height,
      },
    };

    this.setState({ rootParameters });
  }

  render() {
    const { rootParameters } = this.state;
    const extraProps = { containerParameters: rootParameters };
    const style = {};

    const hasZeroDimension = Object
      .values(rootParameters.dimensions).some(val => val === 0);

    if (!hasZeroDimension) {
      style.width = `${rootParameters.dimensions.width}px`;
      style.height = `${rootParameters.dimensions.height}px`;
    }

    const children = Children.toArray(this.props.children);

    // find selections in children to insert props into them
    const selections = children
      .filter(child => child.type.originalFunc === SelectionWrapper)
      .sort((a, b) => sortByArea(a.props, b.props))
      .map((selection, index) =>
        cloneElement(selection, { ...extraProps, zIndex: index + 1 }));

    const restOfChildren = children
      .filter(c => c.type.originalFunc !== SelectionWrapper);

    const className = new CSSClassBuilder('mr-selection-container')
      .combine(this.props.className);

    return (
      <div
        ref={el => this.root = el}
        className={className}
        style={style}
      >
        {restOfChildren}
        {selections}
      </div>
    );
  }
}

SelectionContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node]
  ).isRequired,
  className: PropTypes.string,
  containerParameters: PropTypes.object,
};

SelectionContainer.defaultProps = {
  className: '',
  containerParameters: {
    dimensions: {
      width: 0,
      height: 0,
    },
    offsets: {
      left: 0,
      top: 0,
    },
  },
};

export default SelectionContainer;
