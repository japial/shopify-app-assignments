import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Text, BlockStack, InlineGrid, Button } from "@shopify/polaris";
import invariant from "tiny-invariant";
import ProductsTable from "~/components/ProductsTable";
import { Features } from "~/config/constant";
import { getProducts } from "~/models/Product.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.id, "Could not find collection destination");
  const id = Number(params.id);
  const products = await getProducts(id);
  invariant(products, "Could not find product destination");

  return json({
    products,
  });
};

export default function ProductsPage() {
  const { products } = useLoaderData<typeof loader>();
  return (
    <BlockStack gap="300">
      <>
        <InlineGrid gap="300" columns={2}>
          <Text as="h2" variant="bodyMd">
            Product List
          </Text>
          <Link to={`/app/products/form`}>
            <Button>Create</Button>
          </Link>
        </InlineGrid>
        {products.length && (
          <ProductsTable products={products} feature={Features.product} />
        )}
      </>
    </BlockStack>
  );
}
