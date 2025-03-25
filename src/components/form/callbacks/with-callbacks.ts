import { ActionState } from "../utils/to-action-state";

type Callbacks<T, R = unknown> = {
  onLoad?: () => R;
  onSuccess?: (result: T, reference: R | undefined) => void;
  onError?: (result: T, reference: R | undefined) => void;
};

export const withCallbacks = <
  Args extends unknown[],
  T extends ActionState,
  R = unknown
>(
  fn: (...args: Args) => Promise<T>,
  callbacks: Callbacks<T, R>
): ((...args: Args) => Promise<T>) => {
  return async (...args: Args) => {
    const promise = fn(...args);

    const reference = callbacks.onLoad?.();

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
