import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { BlockStack, IndexTable, EmptyState } from "@shopify/polaris";
import { getCollections } from "~/models/Collection.server";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const collections = await getCollections(session.shop);

  return json({
    collections,
  });
};
function truncate(str: string, { length = 25 } = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

const EmptyCollectionState = ({ onAction }: any) => (
  <EmptyState
    heading="Create unique collection for your products"
    action={{
      content: "Create Collection",
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>Collections</p>
  </EmptyState>
);

const CollectionTable = ({ collections }: any) => (
  <IndexTable
    resourceName={{
      singular: "Collection",
      plural: "Collections",
    }}
    itemCount={collections.length}
    headings={[{ title: "Name" }, { title: "Description" }]}
    selectable={false}
  >
    {collections.map((collection: any) => (
      <CollectionTableRow key={collection.id} collection={collection} />
    ))}
  </IndexTable>
);

const CollectionTableRow = ({ collection }: any) => (
  <IndexTable.Row id={collection.id} position={collection.id}>
    <IndexTable.Cell>
      <Link to={`${collection.id}`}>{truncate(collection.name)}</Link>
    </IndexTable.Cell>
    <IndexTable.Cell>{collection.description}</IndexTable.Cell>
  </IndexTable.Row>
);

export default function CollectionsPage() {
  const { collections } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <BlockStack gap="300">
      {collections.length === 0 ? (
        <EmptyCollectionState onAction={() => navigate("collection/new")} />
      ) : (
        <CollectionTable collections={collections} />
      )}
    </BlockStack>
  );
}
