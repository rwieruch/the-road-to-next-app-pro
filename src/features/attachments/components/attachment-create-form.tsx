"use client";

import { AttachmentEntity } from "@prisma/client";
import { useActionState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { createAttachments } from "../actions/create-attachments";
import { ACCEPTED } from "../constants";

type AttachmentCreateFormProps = {
  entityId: string;
  entity: AttachmentEntity;
  buttons?: React.ReactNode;
  onSuccess?: () => void;
};

const AttachmentCreateForm = ({
  entityId,
  entity,
  buttons,
  onSuccess,
}: AttachmentCreateFormProps) => {
  const [actionState, action] = useActionState(
    createAttachments.bind(null, { entityId, entity }),
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState} onSuccess={onSuccess}>
      <Input
        name="files"
        id="files"
        type="file"
        multiple
        accept={ACCEPTED.join(",")}
      />
      <FieldError actionState={actionState} name="files" />

      {buttons || <SubmitButton label="Upload" />}
    </Form>
  );
};

export { AttachmentCreateForm };
