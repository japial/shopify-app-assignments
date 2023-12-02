import type { Collection, Product } from "@prisma/client";
import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  BlockStack,
  Button,
  Card,
  FormLayout,
  InlineError,
  InlineGrid,
  Layout,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import invariant from "tiny-invariant";
import { Actions } from "~/config/constant";
import { findCollection } from "~/models/Collection.server";
import {
  createproduct,
  findProduct,
  updateProduct,
} from "~/models/Product.server";
import { authenticate } from "~/shopify.server";

interface LoaderData {
  collection?: Collection;
  product?: Product;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  invariant(params.coid, "Could not find collection destination");
  const coId = Number(params.coid);
  const collection = await findCollection(coId);
  invariant(collection, "Could not find collection");

  let product: any = {};
  if (params.id !== Actions.create) {
    const id = Number(params.id);
    product = await findProduct(id);
    invariant(collection, "Could not find product");
  }

  return json<LoaderData>({
    product,
    collection,
  });
};

type ActionData =
  | {
      name: string | null;
      description: string | null;
    }
  | undefined;

export const action: ActionFunction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  await authenticate.admin(request);

  invariant(params.coid, "Could not find collection destination");
  const coId = Number(params.coid);
  const collection = await findCollection(coId);
  invariant(collection, "Could not find collection");

  const formData = await request.formData();

  const name = formData.get("name");
  const description = formData.get("description");
  const errors: ActionData = {
    name: name ? null : "Name is required",
    description: description ? null : "Description is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }
  invariant(typeof name === "string", "Name must be a string");
  invariant(typeof description === "string", "Description must be a string");

  if (params.id === Actions.create) {
    await createproduct({ name, description, collectionId: collection.id });
  } else {
    const id = Number(params.id);
    await updateProduct(id, { name, description });
  }

  return redirect(`/app/collections/${collection.id}`);
};

export default function SingleProductPage() {
  const { collection, product } = useLoaderData() as LoaderData;
  const errors: ActionData = useActionData() as ActionData;
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  return (
    <Page>
      <ui-title-bar title="Product" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <InlineGrid gap="300" columns={2}>
                <Text as="h2" variant="bodyMd">
                  Collection
                </Text>
                <Button url={`/app/collections/${collection?.id}`}>Back</Button>
              </InlineGrid>
              <Form method="post" key={product?.id ?? "create"}>
                <FormLayout>
                  {errors?.name ? (
                    <InlineError message="Name is required" fieldID="name" />
                  ) : null}
                  <TextField
                    name="name"
                    label="Name"
                    value={name}
                    onChange={useCallback(
                      (newValue: string) => setName(newValue),
                      [setName]
                    )}
                    autoComplete="off"
                  />
                  {errors?.description ? (
                    <InlineError
                      message="Description is required"
                      fieldID="description"
                    />
                  ) : null}
                  <TextField
                    name="description"
                    label="Description"
                    value={description}
                    onChange={useCallback(
                      (newValue: string) => setDescription(newValue),
                      [setDescription]
                    )}
                    autoComplete="off"
                  />
                  <Button submit={true} tone="success">
                    Save
                  </Button>
                </FormLayout>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
