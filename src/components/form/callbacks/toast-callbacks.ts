import { toast } from "sonner";
import { ActionState } from "../utils/to-action-state";

type Reference = string | number | undefined;

type CreateToastCallbacksOptions = {
  loadingMessage?: string;
  onSuccess?: (actionState: ActionState) => void;
  onError?: (actionState: ActionState) => void;
};

export const createToastCallbacks = (options: CreateToastCallbacksOptions) => {
  return {
    onLoad: () => {
      return toast.loading(options.loadingMessage || "Loading ...");
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
  };
};
