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
    const parentElement = container?.parentElement;
    if (!container || !parentElement) {
      childrenRef.current = [];
      return;
    }

    /**
     * We lift the children out of the placeholder wrapping div so we don't mess with the DOM the end user gets.
     * This means we have to cache the children and read them out whenever the node gets recreated.
     */
    if (container.childNodes.length) {
      const children = Array.from(container.childNodes);
      childrenRef.current = [...childrenRef.current, ...children];

      children.forEach((child) => {
        if ((child as any)?.getAttribute("data-focus-group")) {
          return;
        }
        child.remove();
        parentElement.insertBefore(child, container);
      });

      container.removeChild = <T extends Node>(target: T) => {
        if (target.parentNode === container) {
          return container.removeChild(target);
        }
        return target.parentNode?.removeChild(target) ?? target;
      };

      // NB! This node can't be removed or React will flip the table
      container.style.display = "none";
    }
    const children = childrenRef.current;

    // See https://stackoverflow.com/a/38317768/1470607
    let timerId: number | undefined = undefined;

    const onChildFocusIn = () => {
      document.addEventListener("keydown", onEscape);
      window.clearTimeout(timerId);
    };

    const onChildFocusOut = () => {
      document.removeEventListener("keydown", onEscape);
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => props.onFocusOut?.(), 0);
    };

    const onChildTouchStart = (event: Event) => {
      event.stopPropagation();
      window.clearTimeout(timerId);
    };

    const onBodyTouchStart = () => {
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => props.onFocusOut?.(), 0);
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onChildFocusOut();
      }
    };

    children.forEach((child) => {
      child.addEventListener("focusin", onChildFocusIn);
      child.addEventListener("focusout", onChildFocusOut);
      child.addEventListener("touchstart", onChildTouchStart);
    });
    document.documentElement.addEventListener("touchstart", onBodyTouchStart);

    return () => {
      children.forEach((child) => {
        child.removeEventListener("focusin", onChildFocusIn);
        child.removeEventListener("focusout", onChildFocusOut);
        child.removeEventListener("touchstart", onChildTouchStart);
      });
      document.documentElement.removeEventListener("touchstart", onBodyTouchStart);
    };
  }, [container, props.onFocusOut]);

  useEffect(() => {
    return () => {
      childrenRef.current.forEach((child) => {
        child.remove();
      });
      childrenRef.current = [];
    };
  }, []);

  return (
    <div data-focus-group ref={refCallback} tabIndex={-1} role="none">
      {props.children}
    </div>
  );
};
