import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Card, Layout, Page } from "@shopify/polaris";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export default function CollectionsPage() {
  return (
    <Page>
      <ui-title-bar title="Product Collections" />
      <Layout>
        <Layout.Section>
          <Card>
            <Outlet />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
