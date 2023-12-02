import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  BlockStack,
  Button,
  EmptyState,
  InlineGrid,
  Text,
} from "@shopify/polaris";
import ProductsTable from "~/components/ProductsTable";
import { Features } from "~/config/constant";
import { getCollections } from "~/models/Collection.server";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const collections = await getCollections(session.shop);

  return json({
    collections,
  });
};

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

export default function CollectionsPage() {
  const { collections } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <BlockStack gap="600">
      <InlineGrid gap="300" columns={2}>
        <Text as="h2" variant="bodyMd">
          Collection List
        </Text>
        <Button tone="success">Create</Button>
      </InlineGrid>

      {collections.length === 0 ? (
        <EmptyCollectionState
          onAction={() => navigate("form/collection/create")}
        />
      ) : (
        <ProductsTable products={collections} feature={Features.collection} />
      )}
    </BlockStack>
  );
}
