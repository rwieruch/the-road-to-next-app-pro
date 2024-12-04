"use client";

import { BanIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { togglePermission } from "../actions/toggle-permission";

type PermissionToggleDropdownProps = {
  userId: string;
  organizationId: string;
  permissionKey: "canDeleteTicket";
  permissionValue: boolean;
};

const PermissionToggleDropdown = ({
  userId,
  organizationId,
  permissionKey,
  permissionValue,
}: PermissionToggleDropdownProps) => {
  const [actionState, action] = useActionState(
    togglePermission.bind(null, {
      userId,
      organizationId,
      permissionKey,
    }),
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <SubmitButton
        icon={permissionValue ? <CheckIcon /> : <BanIcon />}
        size="icon"
        variant={permissionValue ? "secondary" : "outline"}
      />
    </Form>
  );
};

export { PermissionToggleDropdown };
