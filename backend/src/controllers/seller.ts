import { Response } from "express";
import prisma from "../config/prisma";
import * as sellerService from "../services/seller";
import { AuthRequest } from "../middlewares/auth";
import {
  createProductValidation,
  updateProductValidation,
} from "../validations/product";
import fs from "fs";

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
      res.status(404).json({ message: "Seller not found" });
      return;
    }

    const raw = req.body;

    const parsedBody = {
      product_name: raw.product_name,
      description: raw.description,
      price: Number(raw.price),
      stock: Number(raw.stock),
      is_halal: raw.is_halal === "true",
    };

    const validatedData = createProductValidation.parse(parsedBody);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const product_image = files?.product_image?.[0]?.path || null;
    const halal_certificate = files?.halal_certificate?.[0]?.path || null;

    const result = await prisma.product.create({
      data: {
        ...validatedData,
        id_seller: seller.id_seller,
        product_image,
        halal_certificate,
        is_halal: req.body.is_halal === "true" || req.body.is_halal === true,
      },
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
      where: { id_user: req.user!.id },
    });

    if (!seller) {
      res.status(404).json({ message: "Seller not found" });
      return;
    }

    const id_product = Number(req.params.id);

    const existingProduct = await prisma.product.findUnique({
      where: { id_product },
    });

    if (!existingProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const raw = req.body;

    const parsedBody = {
      product_name: raw.product_name,
      description: raw.description,
      price: raw.price ? Number(raw.price) : undefined,
      stock: raw.stock ? Number(raw.stock) : undefined,
      is_halal:
        raw.is_halal === "true"
          ? true
          : raw.is_halal === "false"
            ? false
            : undefined,
    };

    const validatedData = updateProductValidation.parse(parsedBody);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const product_image = files?.product_image?.[0]?.path;
    const halal_certificate = files?.halal_certificate?.[0]?.path;

    // 🔥 HAPUS FILE LAMA JIKA ADA FILE BARU
    if (product_image && existingProduct.product_image) {
      fs.unlinkSync(existingProduct.product_image);
    }

    if (halal_certificate && existingProduct.halal_certificate) {
      fs.unlinkSync(existingProduct.halal_certificate);
    }

    const updateData = {
      ...(validatedData.product_name !== undefined && {
        product_name: validatedData.product_name,
      }),
      ...(validatedData.description !== undefined && {
        description: validatedData.description,
      }),
      ...(validatedData.price !== undefined && {
        price: validatedData.price,
      }),
      ...(validatedData.stock !== undefined && {
        stock: validatedData.stock,
      }),
      ...(validatedData.is_halal !== undefined && {
        is_halal: validatedData.is_halal,
      }),
      ...(product_image && { product_image }),
      ...(halal_certificate && { halal_certificate }),
    };

    const result = await prisma.product.update({
      where: { id_product },
      data: updateData,
    });

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
      where: { id_user: req.user!.id },
    });

    if (!seller) {
      res.status(404).json({ message: "Seller not found" });
      return;
    }

    const id_product = Number(req.params.id);

    const product = await prisma.product.findFirst({
      where: {
        id_product,
        id_seller: seller.id_seller,
      },
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // 🧨 HAPUS FILE IMAGE
    if (product.product_image && fs.existsSync(product.product_image)) {
      fs.unlinkSync(product.product_image);
    }

    // 🧨 HAPUS FILE SERTIFIKAT
    if (product.halal_certificate && fs.existsSync(product.halal_certificate)) {
      fs.unlinkSync(product.halal_certificate);
    }

    await prisma.product.delete({
      where: { id_product },
    });

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const getSellerOrders = async (req: AuthRequest, res: Response) => {
  try {
    const seller = await prisma.seller.findUnique({
      where: { id_user: req.user!.id },
    });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const result = await sellerService.getSellerOrders(seller.id_seller);

    res.json({
      message: "Success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const seller = await prisma.seller.findUnique({
      where: { id_user: req.user!.id },
    });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const id_order = Number(req.params.id);
    const { status } = req.body;

    const result = await sellerService.updateOrderStatus(
      id_order,
      seller.id_seller,
      status,
    );

    res.json({
      message: "Order status updated",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};
