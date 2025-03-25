import { cloneElement, useActionState, useState } from "react";
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
import { createToastCallbacks } from "./form/callbacks/toast-callbacks";
import { withCallbacks } from "./form/callbacks/with-callbacks";
import { ActionState, EMPTY_ACTION_STATE } from "./form/utils/to-action-state";
import { Button } from "./ui/button";

type UseConfirmDialogArgs = {
  title?: string;
  description?: string;
  loadingMessage?: string;
  action: () => Promise<ActionState | undefined>;
  trigger: React.ReactElement | ((isLoading: boolean) => React.ReactElement);
  onSuccess?: (actionState: ActionState | undefined) => void;
};

const useConfirmDialog = ({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. Make sure you understand the consequences.",
  loadingMessage = "Loading ...",
  action,
  trigger,
  onSuccess,
}: UseConfirmDialogArgs) => {
  const [isOpen, setIsOpen] = useState(false);

  const [, formAction, isPending] = useActionState(
    withCallbacks(
      action,
      createToastCallbacks({
        loadingMessage,
        onSuccess,
      })
    ),
    EMPTY_ACTION_STATE
  );

  const dialogTrigger = cloneElement(
    typeof trigger === "function" ? trigger(isPending) : trigger,
    {
      onClick: () => setIsOpen((state) => !state),
    }
  );

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
