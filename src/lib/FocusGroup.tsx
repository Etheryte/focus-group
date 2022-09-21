import * as React from "react";
import { useCallback, useEffect, useState } from "react";

type Props = {
  onFocusOut?: () => void;
} & React.SelectHTMLAttributes<HTMLDivElement>;

export const FocusGroup = ({ onFocusOut, ...rest }: Props) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  // Work around useCallback not having a cleanup, see https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const refCallback = useCallback((node: HTMLDivElement | null) => {
    if (node !== container) {
      setContainer(node);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!container) {
      return;
    }

    // See https://stackoverflow.com/a/38317768/1470607
    let timerId: number | undefined = undefined;
    const onContainerFocusIn = () => {
      document.addEventListener("keydown", onEscape);
      window.clearTimeout(timerId);
    };
    const onContainerFocusOut = () => {
      document.removeEventListener("keydown", onEscape);
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => onFocusOut?.(), 0);
    };

    const onContainerTouchStart = (event: TouchEvent) => {
      event.stopPropagation();
      window.clearTimeout(timerId);
    };
    const onBodyTouchStart = () => {
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => onFocusOut?.(), 0);
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onContainerFocusOut();
      }
    };

    container.addEventListener("focusin", onContainerFocusIn);
    container.addEventListener("focusout", onContainerFocusOut);
    container.addEventListener("touchstart", onContainerTouchStart);
    document.documentElement.addEventListener("touchstart", onBodyTouchStart);
    return () => {
      container.removeEventListener("focusin", onContainerFocusIn);
      container.removeEventListener("focusout", onContainerFocusOut);
      container.removeEventListener("touchstart", onContainerTouchStart);
      document.documentElement.removeEventListener("touchstart", onBodyTouchStart);
    };
  }, [container, onFocusOut]);

  return <div {...rest} ref={refCallback} tabIndex={-1} />;
};
