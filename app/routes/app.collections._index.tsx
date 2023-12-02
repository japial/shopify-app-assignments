import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { BlockStack, Button, InlineGrid, Text } from "@shopify/polaris";
import ProductsTable from "~/components/ProductsTable";
import { Actions, Features } from "~/config/constant";
import { getCollections } from "~/models/Collection.server";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const collections = await getCollections(session.shop);

  return json({
    collections,
  });
};

export default function CollectionsPage() {
  const { collections } = useLoaderData<typeof loader>();
  return (
    <BlockStack gap="600">
      <InlineGrid gap="300" columns={2}>
        <Text as="h2" variant="bodyMd">
          Collection List
        </Text>
        <Button url={`/app/collections/form/${Actions.create}`}>Create</Button>
      </InlineGrid>

      {collections.length && (
        <ProductsTable products={collections} feature={Features.collection} />
      )}
    </BlockStack>
  );
}
