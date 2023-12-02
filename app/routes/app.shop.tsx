import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Card,
  Layout,
  Page,
  BlockStack,
  ResourceItem,
  ResourceList,
  Text,
  Icon,
} from "@shopify/polaris";
import { StoreMajor } from "@shopify/polaris-icons";
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
              {shop && (
                <ResourceList
                  resourceName={{ singular: "shop", plural: "shops" }}
                  items={[
                    {
                      id: "100",
                      url: "#",
                      name: "Shop ID",
                      value: shop.id,
                    },
                    {
                      id: "200",
                      url: "#",
                      name: "Shop Name",
                      value: shop.name,
                    },
                  ]}
                  renderItem={(item) => {
                    const { id, url, name, value } = item;
                    const media = <Icon source={StoreMajor} tone="base" />;

                    return (
                      <ResourceItem
                        id={id}
                        url={url}
                        media={media}
                        accessibilityLabel={`View details for ${name}`}
                      >
                        <Text variant="bodyMd" as="h3">
                          {name}
                        </Text>
                        <Text variant="bodyMd" fontWeight="bold" as="h2">
                          {value}
                        </Text>
                      </ResourceItem>
                    );
                  }}
                />
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
