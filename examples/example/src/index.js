import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Selection, SelectionContainer } from '../../../src';
import './index.css';

class Root extends Component {
  constructor() {
    super();

    this.state = {
      selections: [
        {
          id: 2,
          dimensions: {
            height: 145,
            width: 180,
          },
          coordinates: {
            x: 126,
            y: 34,
          },
        },
        {
          id: 1,
          dimensions: {
            height: 214,
            width: 311,
          },
          coordinates: {
            x: 226,
            y: 56,
          },
        },
      ],
    };

    this.renderSelection = this.renderSelection.bind(this);
    this.updateSelection = this.updateSelection.bind(this);
  }

  updateSelection(selection) {
    const nextSelections = this.state.selections.map((s) => {
      if (s.id === selection.id) {
        return selection;
      }

      return s;
    });

    this.setState({
      selections: nextSelections,
    });
  }

  renderSelection(selection) {
    return (
      <Selection
        key={selection.id}
        interactive
        style={{
          '--bg-color': 'rgba(255, 255, 255, .9)',
          '--border-color': '#000',
          '--handle-color': '#3d3d3d',
        }}
        area={selection}
        onAreaUpdate={this.updateSelection}
      />
    );
  }

  render() {
    return (
      <SelectionContainer>
        {this.state.selections.map(this.renderSelection)}
      </SelectionContainer>
    );
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('root'),
);
