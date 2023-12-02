import db from "../db.server";

export async function getProducts(collectionId: number) {
  const products = await db.product.findMany({
    where: { collectionId },
    orderBy: { id: "desc" },
  });

  if (products.length === 0) return [];

  return products;
}

export async function findProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
  });

  return product;
}
