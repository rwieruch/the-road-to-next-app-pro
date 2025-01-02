"use client";

import { useActionState } from "react";
import { Form } from "@/components/form/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { createCustomerPortal } from "../actions/create-customer-portal";

type CustomerPortalFormProps = {
  organizationId: string | null | undefined;
  children: React.ReactNode;
};

const CustomerPortalForm = ({
  organizationId,
  children,
}: CustomerPortalFormProps) => {
  const [actionState, action] = useActionState(
    createCustomerPortal.bind(null, organizationId),
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <Button type="submit">{children}</Button>
    </Form>
  );
};

export { CustomerPortalForm };
