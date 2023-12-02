import db from "../db.server";


export async function getProducts(collectionId: number) {
  const products = await db.product.findMany({
    where: { collectionId },
    orderBy: { id: "desc" },
  });

  if (products.length === 0) return [];

  return products;
}