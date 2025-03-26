import { useEffect, useRef } from "react";
import { ActionState } from "../utils/to-action-state";

type Callbacks<T, R = unknown> = {
  onLoad?: () => R;
  onSuccess?: (result: T, reference: R | undefined) => void;
  onError?: (result: T, reference: R | undefined) => void;
  onCleanup?: (reference: R | undefined) => void;
};

export const useCallbacks = <
  Args extends unknown[],
  T extends ActionState,
  R = unknown
>(
  fn: (...args: Args) => Promise<T>,
  callbacks: Callbacks<T, R>
): ((...args: Args) => Promise<T>) => {
  const cleanupRef = useRef<R | undefined>(undefined);

  // clean up for unmounting components
  // allows for example:
  // dismiss toast on unmount (e.g. loading toast)
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        callbacks.onCleanup?.(cleanupRef.current);
      }

      cleanupRef.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return async (...args: Args) => {
    const promise = fn(...args);

    const reference = callbacks.onLoad?.();

    cleanupRef.current = reference;

    const result = await promise;

    if (result?.status === "SUCCESS") {
      callbacks.onSuccess?.(result, reference);
    }

    if (result?.status === "ERROR") {
      callbacks.onError?.(result, reference);
    }

    return promise;
  };
};
