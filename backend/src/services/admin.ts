import prisma from "../config/prisma";
import { SellerStatus } from "@prisma/client";

export const getDashboardStats = async () => {
  const totalUser = await prisma.user.count();

  const totalSeller = await prisma.seller.count({
    where: {
      is_verified: SellerStatus.APPROVED,
    },
  });

  const pendingSeller = await prisma.seller.count({
    where: {
      is_verified: SellerStatus.PENDING,
    },
  });
  return {
    totalUser,
    totalSeller,
    pendingSeller,
  };
};

export const getPendingSellers = async () => {
  return await prisma.seller.findMany({
    where: {
      is_verified: "PENDING",
    },
    include: {
      user: {
        select: {
          id_user: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const approveSeller = async (id_seller: number) => {
  const seller = await prisma.seller.update({
    where: {
      id_seller,
    },
    data: {
      is_verified: "APPROVED",
    },
  });

  await prisma.user.update({
    where: {
      id_user: seller.id_user,
    },
    data: {
      role: "SELLER",
    },
  });

  return seller;
};

export const rejectSeller = async (id_seller: number) => {
  return await prisma.seller.update({
    where: {
      id_seller,
    },
    data: {
      is_verified: "REJECTED",
    },
  });
};
