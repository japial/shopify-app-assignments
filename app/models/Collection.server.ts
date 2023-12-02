import type { Collection } from "@prisma/client";
import db from "../db.server";

export async function getCollections(shop: string) {
  const collections = await db.collection.findMany({
    where: { shop },
    orderBy: { id: "desc" },
  });

  if (collections.length === 0) return [];

  return collections;
}

export async function findCollection(id: number) {
  const collection = await db.collection.findUnique({
    where: { id },
  });

  return collection;
}

export async function createCollection(
  collection: Pick<Collection, "name" | "description" | "shop">
) {
  return db.collection.create({ data: collection });
}

export async function updateCollection(
  id: number,
  collection: Pick<Collection, "name" | "description">
) {
  return db.collection.update({ data: collection, where: { id } });
}

export async function deleteCollection(id: number) {
  return db.collection.delete({ where: { id } });
}
