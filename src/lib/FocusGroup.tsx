import * as React from "react";
import { useCallback, useEffect, useState, useRef } from "react";

type Props = {
  onFocusOut?: () => void;
  children?: React.ReactNode;
};

export const FocusGroup = (props: Props) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const childrenRef = useRef<ChildNode[]>([]);

  // Work around useCallback not having a cleanup, see https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const refCallback = useCallback((node: HTMLDivElement | null) => {
    if (node !== container) {
      setContainer(node);
    }
  }, []);

  useEffect(() => {
    if (!container) {
      childrenRef.current = [];
      return;
    }

    /**
     * We destroy the placeholder wrapping div so we don't mess with the DOM the end user gets
     * This means we have to cache the children and read them out whenever the node gets recreated
     */
    if (document.body.contains(container)) {
      const children = Array.from(container.childNodes);
      childrenRef.current = children;
      container.replaceWith(...children);
    }
    const children = childrenRef.current;

    // See https://stackoverflow.com/a/38317768/1470607
    let timerId: number | undefined = undefined;
    const onContainerFocusIn = () => {
      document.addEventListener("keydown", onEscape);
      window.clearTimeout(timerId);
    };
    const onContainerFocusOut = () => {
      document.removeEventListener("keydown", onEscape);
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => props.onFocusOut?.(), 0);
    };

    const onContainerTouchStart = (event: Event) => {
      event.stopPropagation();
      window.clearTimeout(timerId);
    };
    const onBodyTouchStart = () => {
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => props.onFocusOut?.(), 0);
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onContainerFocusOut();
      }
    };

    children.forEach((child) => {
      child.addEventListener("focusin", onContainerFocusIn);
      child.addEventListener("focusout", onContainerFocusOut);
      child.addEventListener("touchstart", onContainerTouchStart);
    });
    document.documentElement.addEventListener("touchstart", onBodyTouchStart);
    return () => {
      children.forEach((child) => {
        child.removeEventListener("focusin", onContainerFocusIn);
        child.removeEventListener("focusout", onContainerFocusOut);
        child.removeEventListener("touchstart", onContainerTouchStart);
      });
      document.documentElement.removeEventListener("touchstart", onBodyTouchStart);
    };
  }, [container, props.onFocusOut]);

  useEffect(() => {
    return () => {
      childrenRef.current = [];
    };
  }, []);

  return (
    <div ref={refCallback} tabIndex={-1} role="none">
      {props.children}
    </div>
  );
};
