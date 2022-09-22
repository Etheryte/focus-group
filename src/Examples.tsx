import { Fragment, useState } from "react";

import { FocusGroup } from "./lib";

const Demo = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Fragment>
      <p>isMenuOpen: {isMenuOpen ? "true" : "false"}</p>
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
        <menu id="example-menu" aria-label="Example menu" hidden={!isMenuOpen}>
          <li>Menu item</li>
        </menu>
      </FocusGroup>
    </Fragment>
  );
};

export const Examples = () => {
  return (
    <Fragment>
      <h1>Debug</h1>
      <Demo />
    </Fragment>
  );
};
