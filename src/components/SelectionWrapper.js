import React, { Component } from 'react';
import { SelectionContext } from './SelectionContainer';

const withContainer = (Selection) => {
  class WrappedSelection extends Component {
    render() {
      return (
        <Selection {...this.props} {...this.context} />
      );
    }
  }

  WrappedSelection.contextType = SelectionContext;

  return WrappedSelection;
};

export { withContainer }
