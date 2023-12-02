import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { BlockStack, IndexTable, EmptyState } from "@shopify/polaris";
import invariant from "tiny-invariant";
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
function truncate(str: string, { length = 25 } = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

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

const ProductsTable = ({ products }: any) => (
  <IndexTable
    resourceName={{
      singular: "Product",
      plural: "Productss",
    }}
    itemCount={products.length}
    headings={[{ title: "Name" }, { title: "Description" }]}
    selectable={false}
  >
    {products.map((product: any) => (
      <ProductTableRow key={product.id} product={product} />
    ))}
  </IndexTable>
);

const ProductTableRow = ({ product }: any) => (
  <IndexTable.Row id={product.id} position={product.id}>
    <IndexTable.Cell>
      <Link to={`product/${product.id}`}>{truncate(product.name)}</Link>
    </IndexTable.Cell>
    <IndexTable.Cell>{product.description}</IndexTable.Cell>
  </IndexTable.Row>
);

export default function ProductsPage() {
  const { products } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <BlockStack gap="300">
      {products.length === 0 ? (
        <EmptyCollectionState onAction={() => navigate("products/new")} />
      ) : (
        <ProductsTable products={products} />
      )}
    </BlockStack>
  );
}
