import type { Product } from "@prisma/client";
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

export async function createproduct(
  product: Pick<Product, "name" | "description" | "collectionId">
) {
  return db.product.create({ data: product });
}

export async function updateProduct(
  id: number,
  product: Pick<Product, "name" | "description">
) {
  return db.product.update({ data: product, where: { id } });
}

export async function deleteProduct(id: number) {
  return db.product.delete({ where: { id } });
}
