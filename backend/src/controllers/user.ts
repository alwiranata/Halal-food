import { Response } from "express";
import prisma from "../config/prisma";
import fs from "fs";
import { AuthRequest } from "../middlewares/auth";

export const registerSeller = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // cek apakah sudah jadi seller
    const existingSeller = await prisma.seller.findUnique({
      where: { id_user: userId },
    });

    if (existingSeller) {
      return res.status(400).json({
        message: "User already registered as seller",
      });
    }

    const { ktp_number, store_name, address } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const ktp_photo = files?.ktp_photo?.[0]?.path;

    if (!ktp_photo) {
      return res.status(400).json({
        message: "KTP photo is required",
      });
    }

    // create seller
    const seller = await prisma.seller.create({
      data: {
        id_user: userId,
        ktp_number,
        ktp_photo,
        store_name,
        address,
        is_verified: "PENDING",
      },
    });

    // update role user jadi SELLER (optional tapi bagus)
    await prisma.user.update({
      where: { id_user: userId },
      data: {
        role: "SELLER",
      },
    });

    return res.status(201).json({
      message: "Seller registration submitted, waiting for verification",
      data: seller,
    });
  } catch (error) {
    return res.status(500).json({
      message: (error as Error).message,
    });
  }
};