import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        seller: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil produk",
    });
  }
};
