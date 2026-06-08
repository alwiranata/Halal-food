import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/auth";


export const getMyOrders = async (req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    where: {
      id_user: req.user!.id,
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

  return res.json({
    data: orders,
  });
};
