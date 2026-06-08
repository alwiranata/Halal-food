import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/auth";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id_user: req.user!.id,
      },
      select: {
        id_user: true,
        name: true,
        email: true,
        phone: true,
        address: true,
      },
    });

    res.json({
      message: "Success",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      message: (err as Error).message,
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, password, phone, address } = req.body;

    const dataToUpdate: any = {
      name,
      phone,
      address,
    };

    // kalau password diisi → hash dulu
    if (password) {
      const bcrypt = require("bcrypt");
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: {
        id_user: req.user!.id,
      },
      data: dataToUpdate,
      select: {
        id_user: true,
        name: true,
        email: true,
        phone: true,
        address: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      message: (err as Error).message,
    });
  }
};
