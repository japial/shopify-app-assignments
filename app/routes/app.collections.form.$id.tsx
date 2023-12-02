import type { Collection } from "@prisma/client";
import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  Text,
  BlockStack,
  InlineGrid,
  Button,
  FormLayout,
  TextField,
  InlineError,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import invariant from "tiny-invariant";
import { Actions } from "~/config/constant";
import {
  createCollection,
  findCollection,
  updateCollection,
} from "~/models/Collection.server";
import { authenticate } from "~/shopify.server";

interface LoaderData {
  collection?: Collection;
}
export const loader = async ({ params }: LoaderFunctionArgs) => {
  let collection: any = {};
  if (params.id !== Actions.create) {
    const id = Number(params.id);
    collection = await findCollection(id);
    invariant(collection, "Could not find collection destination");
  }

  return json<LoaderData>({
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
  const { session } = await authenticate.admin(request);

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
    await createCollection({ name, description, shop: session.shop });
  } else {
    const id = Number(params.id);
    await updateCollection(id, { name, description });
  }

  return redirect("/app/collections");
};

export default function CollectionFormPage() {
  const { collection } = useLoaderData() as LoaderData;
  const errors: ActionData = useActionData() as ActionData;
  const [name, setName] = useState(collection?.name || "");
  const [description, setDescription] = useState(collection?.description || "");

  return (
    <BlockStack gap="300">
      <InlineGrid gap="300" columns={2}>
        <Text as="h2" variant="bodyMd">
          Collection
        </Text>
        <Button url={`/app/collections`}>Back</Button>
      </InlineGrid>
      <Form method="post" key={collection?.id ?? "create"}>
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
  );
}
