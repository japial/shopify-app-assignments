import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, Layout, Page, Text, BlockStack } from "@shopify/polaris";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `query {
      shop {
        name
        id
      }
    }`
  );
  const responseJson = await response.json();
  return json({
    shop: responseJson.data.shop,
  });
};

export default function ShopPage() {
  const { shop } = useLoaderData<typeof loader>();
  return (
    <Page>
      <ui-title-bar title="Shop Page" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                Shop Name:{" "}
                <Text variant="headingLg" as="h5">
                  {shop.name}
                </Text>
              </Text>
              <Text as="p" variant="bodyMd">
                Shop ID:{" "}
                <Text variant="headingLg" as="h5">
                  {shop.id}
                </Text>
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
