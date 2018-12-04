### React Selection

A package that provides a tool to draw regions with cursor. The package provides a set of different implementation of region with a different functionality.

![Example](https://image.ibb.co/mfodSJ/ezgif_com_gif_maker.gif "Example")

With this package you are able to draw, scale and drag regions. If you want to add a custom functionality to regions, you can extend our `AbstractRegion`.

### Installation

```bash
npm install --save react-selections
```

### Usage

You need to specify an area in which the selections will be active. Selections can't be drawn out of the container. The package provides you with a container component, which you should use to render as a parent node to your selections (and other components as well).

```javascript
import { SelectionContainer, InteractiveSelection } from 'react-selections';
```

Or if you use CommonJS:

```javascript
const reactSelections = require('react-selections');
const { SelectionContainer, InteractiveSelection } = reactSelections;
```

You then simply wrap your area that you want to render selections above in the container:

```javascript
...
<SelectionContainer>
  <div>
    <InteractiveSelection
    area={{
      dimensions: { height: 150, width: 300 }, // pixels
    coordinates: { x: 100, y: 100 }, // pixels
      }}
  />
  </div>
</SelectionContainer>
...
```

As you see you can render anyting inside the container, it will recognize selections inside and pass them special props.