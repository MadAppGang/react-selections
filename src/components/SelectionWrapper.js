import React from 'react';

function SelectionWrapper(props) {
  const component = this.selection;

  if (!component) {
    return null;
  }

  return <this.selection {...props} />;
}

const bind = (func, ctx) => {
  const boundFunc = func.bind(ctx);

  boundFunc.originalFunc = func;

  return boundFunc;
};

export const asSelection = selection => bind(SelectionWrapper, { selection });

export default SelectionWrapper;
