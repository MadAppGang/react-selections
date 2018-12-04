### React Selection

This is a library that provides a tool to draw regions with mouse. The library provides a set of different regions that serve different purposes.

![Example](https://image.ibb.co/mfodSJ/ezgif_com_gif_maker.gif "Example")

### Installation

```bash
npm install --save react-selections
```

### Usage

You need to specify an area the selections will be active inside of. Selections can't be drawn outside the container. The package provides a container component, which you should use to render as a parent node to your selections (and other components as well).

```javascript
import { SelectionContainer, InteractiveSelection } from 'react-selections';
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

As you see you can render anything inside the container, it will recognize selections inside and pass them special props.

...