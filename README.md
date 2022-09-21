# FocusGroup

`FocusGroup` is a basic building block for constructing menus and interactive UI components that depend on user focusable elements, while keeping accessibility in mind.

## Installation

```sh
yarn add @rabasamblik/focus-group
```

## Props

| Prop | Description | Default value |
|-|-|-|
|`onFocusOut`| Optional, function to be called when the user focus moves outside of the container | `undefined`|
|`...rest`| Any props you can pass to a HTMLDivElement, such as `className` etc | `undefined`|

## Usage

```tsx
import { useState } from "react";

const Example = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <FocusGroup onFocusOut={() => setIsMenuOpen(false)}>
      <button
        id="example-button"
        aria-controls="example-menu"
        aria-expanded={isMenuOpen}
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        Open menu
      </button>
      <menu
        id="example-menu"
        aria-label="Example menu"
        hidden={!isMenuOpen}
      >
        <li>Menu item</li>
      </menu>
    </FocusGroup>
  );
};
```

## Demo

TODO: Add live examples.  
