import React from 'react';
import InteractiveSelection from './InteractiveSelection';
import StyledSelection from './StyledSelection';
import { asSelection } from './SelectionWrapper';

const SelectionFacade = (props) => {
  if (props.interactive) {
    return (
      <InteractiveSelection {...props} />
    );
  }

  return (
    <StyledSelection {...props} />
  );
}

export default asSelection(SelectionFacade);
