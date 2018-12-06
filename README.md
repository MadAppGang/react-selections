### React Selection
[![Build Status](https://travis-ci.org/MadAppGang/react-selections.svg?branch=master)](https://travis-ci.org/MadAppGang/react-selections)
[![Coverage Status](https://coveralls.io/repos/github/MadAppGang/react-selections/badge.svg?branch=master)](https://coveralls.io/github/MadAppGang/react-selections?branch=master)

This is a library that provides a set of tools to draw regions with mouse.

![Example](https://image.ibb.co/mfodSJ/ezgif_com_gif_maker.gif "Example")

### Installation

```bash
npm install --save react-selections
```

### Usage

You need to specify an area for the selections to be rendered inside of. Selections can't be drawn outside the container. The package provides a container component, which you should use to render as a parent node to your selections (and other components as well).

```javascript
import { SelectionContainer, InteractiveSelection } from 'react-selections';
```

You then simply wrap your area that you want to render selections above in the container:

```javascript
...
<SelectionContainer>
  <InteractiveSelection
    area={{
      dimensions: { height: 150, width: 300 }, // pixels
      coordinates: { x: 100, y: 100 }, // pixels
    }}
  />
  <AnyOtherComponent />
  ...
</SelectionContainer>
...
```

As you see you can render anything inside the container, it will recognize selections inside and pass them special props.

...