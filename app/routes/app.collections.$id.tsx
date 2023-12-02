import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Text, BlockStack, InlineGrid, Button } from "@shopify/polaris";
import invariant from "tiny-invariant";
import ProductsTable from "~/components/ProductsTable";
import { Actions, Features } from "~/config/constant";
import { findCollection } from "~/models/Collection.server";
import { getProducts } from "~/models/Product.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.id, "Could not find collection destination");
  const coId = Number(params.id);
  const collection = await findCollection(coId);
  invariant(collection, "Could not find collection");

  const products = await getProducts(coId);
  invariant(products, "Could not find products");

  return json({
    products,
    collection,
  });
};

export default function ProductsPage() {
  const { products, collection } = useLoaderData<typeof loader>();
  return (
    <BlockStack gap="300">
      <>
        <InlineGrid gap="300" columns={3}>
          <Text as="h2" variant="bodyMd">
            Product List of <strong>{collection.name}</strong>
          </Text>
          <Button
            tone="success"
            url={`/app/product/${collection.id}/${Actions.create}`}
          >
            Create
          </Button>
          <Button url="/app/collections">Back</Button>
        </InlineGrid>
        {products.length && (
          <ProductsTable
            products={products}
            coId={collection.id}
            feature={Features.product}
          />
        )}
      </>
    </BlockStack>
  );
}
