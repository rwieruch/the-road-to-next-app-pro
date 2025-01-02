import { LucideCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { stripe } from "@/lib/stripe";
import { toCurrencyFromCent } from "@/utils/currency";

type PricesProps = {
  organizationId: string | null | undefined;
  productId: string;
};

const Prices = async ({ organizationId, productId }: PricesProps) => {
  const prices = await stripe.prices.list({
    active: true,
    product: productId,
  });

  return (
    <div className="flex gap-x-2">
      {prices.data.map((price) => (
        <button key={price.id}>
          <span className="font-bold text-lg">
            {toCurrencyFromCent(price.unit_amount || 0, price.currency)}
          </span>
          &nbsp;/&nbsp;<span>{price.recurring?.interval}</span>
        </button>
      ))}
    </div>
  );
};

type ProductsProps = {
  organizationId: string | null | undefined;
};

const Products = async ({ organizationId }: ProductsProps) => {
  const products = await stripe.products.list({
    active: true,
  });

  return (
    <div className="flex-1 flex justify-center items-center gap-x-4">
      {products.data.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {product.marketing_features.map((feature) => (
              <div key={feature.name} className="flex gap-x-2">
                <LucideCheck /> {feature.name}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Prices organizationId={organizationId} productId={product.id} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export { Products };
