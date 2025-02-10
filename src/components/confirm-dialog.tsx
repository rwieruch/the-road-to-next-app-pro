import {
  cloneElement,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useActionFeedback } from "./form/hooks/use-action-feedback";
import { ActionState, EMPTY_ACTION_STATE } from "./form/utils/to-action-state";
import { Button } from "./ui/button";

type UseConfirmDialogArgs = {
  title?: string;
  description?: string;
  action: () => Promise<ActionState>;
  trigger: React.ReactElement | ((isLoading: boolean) => React.ReactElement);
  onSuccess?: (actionState: ActionState) => void;
  onCleanup?: () => void;
};

const useConfirmDialog = ({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. Make sure you understand the consequences.",
  action,
  trigger,
  onSuccess,
  onCleanup,
}: UseConfirmDialogArgs) => {
  const [isOpen, setIsOpen] = useState(false);

  const [actionState, formAction, isPending] = useActionState(
    action,
    EMPTY_ACTION_STATE
  );

  const dialogTrigger = cloneElement(
    typeof trigger === "function" ? trigger(isPending) : trigger,
    {
      onClick: () => setIsOpen((state) => !state),
    }
  );

  const toastRef = useRef<string | number | null>(null);

  const runCleanupRef = useRef(false);

  useEffect(() => {
    if (isPending) {
      toastRef.current = toast.loading("Deleting ...");
      runCleanupRef.current = true;
    } else if (toastRef.current) {
      toast.dismiss(toastRef.current);
      runCleanupRef.current = false;
    }

    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    };
  }, [onCleanup, isPending]);

  // In the case when we never receive the latest actionState
  // e.g. when the componponent is unmounted
  // before the action is completed
  // due to revalidation
  // but should only run when there was an action
  // not on redirect or other cases
  useEffect(() => {
    return () => {
      if (runCleanupRef.current) {
        onCleanup?.();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useActionFeedback(actionState, {
    onSuccess: ({ actionState }) => {
      if (actionState.message) {
        toast.success(actionState.message);
      }

      onSuccess?.(actionState);
    },
    onError: ({ actionState }) => {
      if (actionState.message) {
        toast.error(actionState.message);
      }
    },
  });

  const dialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <form action={formAction}>
              <Button type="submit">Confirm</Button>
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [dialogTrigger, dialog] as const;
};

export { useConfirmDialog };
