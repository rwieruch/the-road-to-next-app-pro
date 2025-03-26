import { toast } from "sonner";
import { ActionState } from "../utils/to-action-state";

type Reference = string | number | undefined;

type CreateToastCallbacksOptions = {
  loading?: string;
  onSuccess?: (actionState: ActionState) => void;
  onError?: (actionState: ActionState) => void;
  onCleanup?: (reference: Reference) => void;
};

export const createToastCallbacks = (options: CreateToastCallbacksOptions) => {
  return {
    onLoad: () => {
      return toast.loading(options.loading || "Loading ...");
    },
    onSuccess: (result: ActionState, reference: Reference) => {
      if (result?.message) {
        toast.success(result?.message, {
          id: reference,
        });
      }

      if (options.onSuccess) {
        options.onSuccess(result);
      }
    },
    onError: (result: ActionState, reference: Reference) => {
      if (result?.message) {
        toast.error(result?.message, {
          id: reference,
        });
      }

      if (options.onError) {
        options.onError(result);
      }
    },
    onCleanup: (reference: Reference) => {
      if (reference) {
        toast.dismiss(reference);
      }

      if (options.onCleanup) {
        options.onCleanup(reference);
      }
    },
  };
};
