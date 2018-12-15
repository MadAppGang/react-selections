import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSClassBuilder from 'css-class-combiner';
import { getSelectionOffsets } from '../utils/area';

export const SelectionContext = React.createContext('selection_container');

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
    const rootParameters = {
      offsets: getSelectionOffsets(this.root),
      dimensions: {
        height: this.root.clientHeight,
        width: this.root.clientWidth,
      },
    };

    this.setState({ rootParameters });
  }

  render() {
    const { rootParameters } = this.state;
    let style = {};

    const hasZeroDimension = Object
      .values(rootParameters.dimensions)
      .some(val => val === 0);

    if (!hasZeroDimension) {
      style = {
        width: `${rootParameters.dimensions.width}px`,
        height: `${rootParameters.dimensions.height}px`,
      };
    }

    const className = new CSSClassBuilder('mr-selection-container')
      .combine(this.props.className);

    return (
      <SelectionContext.Provider
        value={{ containerParameters: rootParameters }}
      >
        <div
          ref={el => this.root = el}
          className={className}
          style={style}
        >
          {this.props.children}
        </div>
      </SelectionContext.Provider>
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
