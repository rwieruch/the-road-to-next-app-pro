"use client";

import { useActionState } from "react";
import { createToastCallbacks } from "@/components/form/callbacks/toast-callbacks";
import { useCallbacks } from "@/components/form/callbacks/use-callbacks";
import { FieldError } from "@/components/form/field-error";
import { SubmitButton } from "@/components/form/submit-button";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ACCEPTED } from "@/features/attachments/constants";
import { createComment } from "../actions/create-comment";
import { CommentWithMetadata } from "../types";

type CommentCreateFormProps = {
  ticketId: string;
  onCreateComment?: (comment: CommentWithMetadata | undefined) => void;
};

const CommentCreateForm = ({
  ticketId,
  onCreateComment,
}: CommentCreateFormProps) => {
  const handleSuccess = (
    actionState: ActionState<CommentWithMetadata | undefined>
  ) => {
    onCreateComment?.(actionState?.data);
  };

  const [actionState, action] = useActionState(
    useCallbacks(
      createComment.bind(null, ticketId),
      createToastCallbacks({
        loading: "Creating comment...",
        onSuccess: handleSuccess,
      })
    ),
    EMPTY_ACTION_STATE
  );

  return (
    <form action={action} className="flex flex-col gap-y-2">
      <Textarea name="content" placeholder="What's on your mind ..." />
      <FieldError actionState={actionState} name="content" />

      <Input
        name="files"
        id="files"
        type="file"
        multiple
        accept={ACCEPTED.join(",")}
      />
      <FieldError actionState={actionState} name="files" />

      <SubmitButton label="Comment" />
    </form>
  );
};

export { CommentCreateForm };
