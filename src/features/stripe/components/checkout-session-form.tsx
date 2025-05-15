"use client";

import { useActionState } from "react";
import { Form } from "@/components/form/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "../actions/create-checkout-session";

type CheckoutSessionFormProps = {
  organizationId: string | null | undefined;
  priceId: string;
  children: React.ReactNode;
};

const CheckoutSessionForm = ({
  organizationId,
  priceId,
  children,
}: CheckoutSessionFormProps) => {
  const [actionState, action] = useActionState(
    createCheckoutSession.bind(null, organizationId, priceId),
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <Button type="submit">{children}</Button>
    </Form>
  );
};

export { CheckoutSessionForm };
