import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/auth";

export const buyerDashboard = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;

    // 🔹 ORDERS milik user login
    const orders = await prisma.order.findMany({
      where: {
        id_user: userId,
      },
      include: {
        orderDetails: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        order_date: "desc",
      },
    });

    // 🔹 CART milik user login
    const cart = await prisma.cart.findFirst({
      where: {
        id_user: userId,
      },
      include: {
        cartDetails: {
          include: {
            product: true,
          },
        },
      },
    });

    // 🔹 PRODUCT (rekomendasi global)
    const products = await prisma.product.findMany({
      take: 8,
      orderBy: {
        created_at: "desc",
      },
    });

    // 🔹 STATISTICS
    const totalOrders = orders.length;

    const cartCount = cart?.cartDetails?.length || 0;

    const totalSpent = orders.reduce((sum, order) => {
      return (
        sum +
        order.orderDetails.reduce((s, item) => s + Number(item.subtotal), 0)
      );
    }, 0);

    res.json({
      message: "Success",
      data: {
        stats: {
          totalOrders,
          cartCount,
          totalSpent,
        },
        orders,
        cart,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
    });
  }
};
