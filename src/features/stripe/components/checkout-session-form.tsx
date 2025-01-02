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
  const action = createCheckoutSession.bind(null, organizationId, priceId);

  return (
    <form action={action}>
      <Button type="submit">{children}</Button>
    </form>
  );
};

export { CheckoutSessionForm };
