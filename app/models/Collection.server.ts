import db from "../db.server";


export async function getCollections(shop: string) {
  const collections = await db.collection.findMany({
    where: { shop },
    orderBy: { id: "desc" },
  });

  if (collections.length === 0) return [];

  return collections;
}