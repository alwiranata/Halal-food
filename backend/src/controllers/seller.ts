import { Response } from "express";
import prisma from "../config/prisma";
import * as sellerService from "../services/seller";
import { AuthRequest } from "../middlewares/auth";
import {
  createProductValidation,
  updateProductValidation,
} from "../validations/product";

export const dashboardStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const seller = await prisma.seller.findUnique({
      where: {
        id_user: req.user!.id,
      },
    });

    if (!seller) {
      res.status(404).json({
        message: "Seller not found",
      });
      return;
    }

    const result = await sellerService.getDashboardStats(seller.id_seller);

    res.status(200).json({
      message: "Success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
    });
  }
};

export const createProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const seller = await prisma.seller.findUnique({
      where: {
        id_user: req.user!.id,
      },
    });

    if (!seller) {
      res.status(404).json({
        message: "Seller not found",
      });
      return;
    }

    const validatedData = createProductValidation.parse(req.body);

    const result = await sellerService.createProduct({
      ...validatedData,
      id_seller: seller.id_seller,
    });

    res.status(201).json({
      message: "Product created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const getProducts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const seller = await prisma.seller.findUnique({
      where: {
        id_user: req.user!.id,
      },
    });

    if (!seller) {
      res.status(404).json({
        message: "Seller not found",
      });
      return;
    }

    const result = await sellerService.getProducts(seller.id_seller);

    res.status(200).json({
      message: "Success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const getProductById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const seller = await prisma.seller.findUnique({
      where: {
        id_user: req.user!.id,
      },
    });

    if (!seller) {
      res.status(404).json({
        message: "Seller not found",
      });
      return;
    }

    const id_product = Number(req.params.id);

    const result = await sellerService.getProductById(
      id_product,
      seller.id_seller,
    );

    res.status(200).json({
      message: "Success",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      message: (error as Error).message,
    });
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const seller = await prisma.seller.findUnique({
      where: {
        id_user: req.user!.id,
      },
    });

    if (!seller) {
      res.status(404).json({
        message: "Seller not found",
      });
      return;
    }

    const validatedData = updateProductValidation.parse(req.body);

    const id_product = Number(req.params.id);

    const result = await sellerService.updateProduct(
      id_product,
      seller.id_seller,
      validatedData,
    );

    res.status(200).json({
      message: "Product updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const seller = await prisma.seller.findUnique({
      where: {
        id_user: req.user!.id,
      },
    });

    if (!seller) {
      res.status(404).json({
        message: "Seller not found",
      });
      return;
    }

    const id_product = Number(req.params.id);

    await sellerService.deleteProduct(id_product, seller.id_seller);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};
