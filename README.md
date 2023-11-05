# FocusGroup

`FocusGroup` is a basic building block for constructing accessible menus and interactive UI components that depend on focusable elements.

## Installation

```sh
yarn add @etheryte/focus-group
```

## Props

| Prop | Description | Default value |
|-|-|-|
|`onFocusOut`| Optional, function to be called when the user focus moves outside of the container. | `undefined`|

## Usage

```tsx
import { useState } from "react";
import { FocusGroup } from "@etheryte/focus-group";

const Example = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <FocusGroup onFocusOut={() => setIsMenuOpen(false)}>
      <button
        id="example-button"
        aria-haspopup="menu"
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

## Development

Run a development demo:

```sh
yarn start
```

Publish a new version:

```sh
npm login
npm publish --access public
```
