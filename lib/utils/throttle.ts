import { useCallback, useEffect, useRef } from "react";

export function useThrottle(
  callback: (min: number, max: number) => void,
  delay: number,
) {
  const lastRunTime = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (min: number, max: number) => {
      const now = Date.now();
      const remaining = delay - (now - lastRunTime.current);

      if (remaining <= 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        lastRunTime.current = now;
        callbackRef.current(min, max);
        return;
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        lastRunTime.current = Date.now();
        timeoutRef.current = null;
        callbackRef.current(min, max);
      }, remaining);
    },
    [delay],
  );
}
