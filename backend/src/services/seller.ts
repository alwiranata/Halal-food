import prisma from "../config/prisma";
import { CreateProductInput, UpdateProductInput } from "../validations/product";
import { OrderStatus } from "@prisma/client";

export const getSellerOrders = async (id_seller: number) => {
  return await prisma.order.findMany({
    where: {
      orderDetails: {
        some: {
          product: {
            id_seller,
          },
        },
      },
    },
    include: {
      user: {
        select: {
          id_user: true,
          name: true,
          email: true,
          address: true,
          phone: true,
        },
      },
      orderDetails: {
        where: {
          product: {
            id_seller,
          },
        },
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      order_date: "desc",
    },
  });
};

export const updateOrderStatus = async (
  id_order: number,
  id_seller: number,
  status: OrderStatus,
) => {
  const order = await prisma.order.findFirst({
    where: {
      id_order,
      orderDetails: {
        some: {
          product: {
            id_seller,
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // update status order detail milik seller
  await prisma.orderDetail.updateMany({
    where: {
      id_order,
      product: {
        id_seller,
      },
    },
    data: {
      status,
    },
  });

  // cek apakah masih ada order detail yang pending
  const pending = await prisma.orderDetail.count({
    where: {
      id_order,
      status: "PENDING",
    },
  });

  // jika tidak ada pending, order menjadi ACCEPTED
  if (pending === 0) {
    await prisma.order.update({
      where: {
        id_order,
      },
      data: {
        status: "ACCEPTED",
      },
    });
  }

  return {
    message: "Status updated",
  };
};

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
      status: "PENDING",
    },
  });

  const totalRevenue = await prisma.orderDetail.aggregate({
    _sum: {
      subtotal: true,
    },
    where: {
      product: {
        id_seller,
      },
      status: "ACCEPTED",
    },
  });

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.subtotal || 0,
  };
};
