import { useEffect, useRef, RefObject } from "react";

// used to scale changed elements as gains and losses on refresh

export function useRefreshEffect<T extends HTMLElement>(
  value: any,
  duration: number = 300
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add("scale-110");
      setTimeout(() => {
        ref.current?.classList.remove("scale-110");
      }, duration);
    }
  }, [value, duration]);

  return ref;
}
