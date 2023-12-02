import { Link } from "@remix-run/react";
import { Button, ButtonGroup, IndexTable } from "@shopify/polaris";
import { Features } from "~/config/constant";
type ProductsTablePropsType = {
  products: any[];
  coId?: number | undefined;
  feature: string;
};
function truncate(str: string, { length = 25 } = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

const ProductTableRow = ({ product, coId, feature }: any) => (
  <IndexTable.Row id={product.id} position={product.id}>
    <IndexTable.Cell>{truncate(product.name)}</IndexTable.Cell>
    <IndexTable.Cell>{product.description}</IndexTable.Cell>
    <IndexTable.Cell>
      <ButtonGroup>
        {feature === Features.collection && (
          <Link to={`${product.id}`}>
            <Button>Products</Button>
          </Link>
        )}
        <Link
          to={
            feature === Features.collection
              ? `form/${product.id}`
              : `/app/product/${coId}/${product.id}`
          }
        >
          <Button>Edit</Button>
        </Link>
      </ButtonGroup>
    </IndexTable.Cell>
  </IndexTable.Row>
);

const ProductsTable = ({ products, coId, feature }: ProductsTablePropsType) => (
  <IndexTable
    resourceName={{
      singular: "Product",
      plural: "Products",
    }}
    itemCount={products.length}
    headings={[
      { title: "Name" },
      { title: "Description" },
      { title: "Action" },
    ]}
    selectable={false}
  >
    {products.map((product: any) => (
      <ProductTableRow
        key={product.id}
        coId={coId}
        product={product}
        feature={feature}
      />
    ))}
  </IndexTable>
);

export default ProductsTable;
