import prisma from "../config/prisma";
import { CreateProductInput, UpdateProductInput } from "../validations/product";

export const createProduct = async (
  data: CreateProductInput & {
    id_seller: number;
  },
) => {
  return await prisma.product.create({
    data: {
      ...data,
      is_halal: data.is_halal ?? false,
    },
  });
};

export const getProducts = async (id_seller: number) => {
  return await prisma.product.findMany({
    where: {
      id_seller,
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const getProductById = async (id_product: number, id_seller: number) => {
  const product = await prisma.product.findFirst({
    where: {
      id_product,
      id_seller,
    },
    
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const updateProduct = async (
  id_product: number,
  id_seller: number,
  data: UpdateProductInput,
) => {
  const product = await prisma.product.findFirst({
    where: {
      id_product,
      id_seller,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const updateData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined),
  );

  return await prisma.product.update({
    where: {
      id_product,
    },
    data: updateData,
  });
};

export const deleteProduct = async (id_product: number, id_seller: number) => {
  const product = await prisma.product.findFirst({
    where: {
      id_product,
      id_seller,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return await prisma.product.delete({
    where: {
      id_product,
    },
  });
};

export const getDashboardStats = async (id_seller: number) => {
  const totalProducts = await prisma.product.count({
    where: {
      id_seller,
    },
  });

  const totalOrders = await prisma.orderDetail.count({
    where: {
      product: {
        id_seller,
      },
    },
  });

  const pendingOrders = await prisma.orderDetail.count({
    where: {
      product: {
        id_seller,
      },
      order: {
        status: "PENDING",
      },
    },
  });

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
  };
};
