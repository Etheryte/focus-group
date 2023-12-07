import React, { useState } from "react";

import { FocusGroup } from "./lib";

const Demo = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [invalidator, setInvalidator] = useState(0);

  return (
    <div key={invalidator}>
      <button onClick={() => setInvalidator(invalidator + 1)}>invalidate: {invalidator}</button>
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
          <li>
            <button onClick={() => console.log("click")}>Menu item</button>
          </li>
        </menu>
      </FocusGroup>
    </div>
  );
};

const NestedDemo = () => {
  const [isOuterOpen, setIsOuterOpen] = useState(false);
  const [isInnerOpen, setIsInnerOpen] = useState(false);

  return (
    <FocusGroup onFocusOut={() => setIsOuterOpen(false)}>
      <button onClick={() => setIsOuterOpen(!isOuterOpen)}>toggle outer: {isOuterOpen ? "true" : "false"}</button>
      {isOuterOpen ? (
        <div>
          outer content
          <FocusGroup onFocusOut={() => setIsInnerOpen(false)}>
            <button onClick={() => setIsInnerOpen(!isInnerOpen)}>toggle inner: {isInnerOpen ? "true" : "false"}</button>
            {isInnerOpen ? <div>inner content</div> : null}
          </FocusGroup>
        </div>
      ) : null}
    </FocusGroup>
  );
};

export const Examples = () => {
  const [invalidator, setInvalidator] = useState(0);
  const [isRendered, setIsRendered] = useState(true);

  return (
    <React.Fragment>
      <h1>Debug</h1>
      <button onClick={() => setInvalidator(invalidator + 1)}>outer invalidate: {invalidator}</button>
      <button onClick={() => setIsRendered(!isRendered)}>is rendered: {isRendered ? "true" : "false"}</button>
      {isRendered ? <Demo /> : null}
      <div style={{ height: "30px" }} />
      {isRendered ? <NestedDemo /> : null}
      <div>content after</div>
    </React.Fragment>
  );
};
