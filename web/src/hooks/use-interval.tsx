import React from "react";

export function useInterval(callback: any, delay: number) {
  const savedCallback: any = React.useRef();
  let cleanupFn;

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      cleanupFn = () => clearInterval(id);
      return cleanupFn;
    }
  }, [delay]);

  return cleanupFn;
}
