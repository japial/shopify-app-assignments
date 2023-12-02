import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Text, BlockStack, EmptyState } from "@shopify/polaris";
import invariant from "tiny-invariant";
import ProductsTable from "~/components/ProductsTable";
import { Features } from "~/config/constant";
import { getProducts } from "~/models/Product.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.id, "Could not find collection destination");
  const id = Number(params.id);
  const products = await getProducts(id);
  invariant(products, "Could not find collection destination");

  return json({
    products,
  });
};

const EmptyCollectionState = ({ onAction }: any) => (
  <EmptyState
    heading="Create products"
    action={{
      content: "Create Products",
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>Products</p>
  </EmptyState>
);

export default function ProductsPage() {
  const { products } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <BlockStack gap="300">
      <>
        <Text as="h2" variant="bodyMd">
          Product List
        </Text>
        {products.length === 0 ? (
          <EmptyCollectionState onAction={() => navigate("products/new")} />
        ) : (
          <ProductsTable products={products} feature={Features.product} />
        )}
      </>
    </BlockStack>
  );
}
