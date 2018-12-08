# React Selections
[![Build Status](https://travis-ci.org/MadAppGang/react-selections.svg?branch=master)](https://travis-ci.org/MadAppGang/react-selections)
[![Coverage Status](https://coveralls.io/repos/github/MadAppGang/react-selections/badge.svg?branch=master)](https://coveralls.io/github/MadAppGang/react-selections?branch=master)

This is a library that provides a set of tools for drawing regions with cursor.

![Example](https://image.ibb.co/mfodSJ/ezgif_com_gif_maker.gif "Example")

## Installation

```bash
npm install --save react-selections
```

## Usage

You need to specify an area for the selections to be rendered inside of. Selections can't be drawn outside the container. The package provides a container component, which you should use to render as a parent node to your selections (and other components as well).

```javascript
import { Selection, SelectionContainer } from 'react-selections';
```

You then simply wrap your area that you want to render selections above in the container:

```javascript

const selectionArea = {
  id: 1,
  dimensions: {
    height: 150,
    width: 300
  },
  coordinates: {
    x: 100,
    y: 100
  },
};

...
<SelectionContainer>
  <Selection
    area={selectionArea}
    className="my-selection"
  />
  ...
  <AnyOtherComponent />
  ...
</SelectionContainer>
...
```

As you see you can render anything inside the container, it will recognize selections inside and pass them special props.

### Interactive selections

If you need a selection to be draggable/resizable you need to specify it explicitly with an *interactive* boolean property.

```javascript
<Selection interactive area={area} />
```

Then you have to provide a handler that is going to handle area updates.

```javascript
...

constructor() {
  ...

  this.state = {
    selectionArea: { ... },
  };
}

...

handleSelectionAreaUpdate(selectionArea) {
  this.setState({ selectionArea });
}

render() {
  return (
    <SelectionContainer>
      ...
      <Selection
        interactive
        area={this.selectionArea}
        onAreaUpdate={this.handleSelectionAreaUpdate}
      />
    </SelectionContainer>
  );
}

...
```

...