import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/auth";

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const { product_id, qty } = req.body;

    // default qty = 1 kalau tidak dikirim
    const quantity = qty ? Number(qty) : 1;

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Qty minimal 1",
      });
    }

    // =========================
    // CEK PRODUCT
    // =========================
    const product = await prisma.product.findUnique({
      where: {
        id_product: product_id,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }

    // =========================
    // CEK / CREATE CART (1 USER = 1 CART)
    // =========================
    let cart = await prisma.cart.findUnique({
      where: {
        id_user: userId,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          id_user: userId,
        },
      });
    }

    // =========================
    // CEK ITEM DI CART
    // =========================
    const item = await prisma.cartDetail.findFirst({
      where: {
        id_cart: cart.id_cart,
        id_product: product_id,
      },
    });

    const price = Number(product.price);

    // =========================
    // JIKA SUDAH ADA → UPDATE QTY
    // =========================
    if (item) {
      const newQty = item.qty + quantity;

      // OPTIONAL: cek stock
      if (newQty > product.stock) {
        return res.status(400).json({
          message: "Stock tidak cukup",
        });
      }

      const updated = await prisma.cartDetail.update({
        where: {
          id_cart_detail: item.id_cart_detail,
        },
        data: {
          qty: newQty,
          subtotal: price * newQty,
        },
      });

      return res.status(200).json({
        message: "Cart updated",
        data: updated,
      });
    }

    // =========================
    // JIKA BELUM ADA → CREATE
    // =========================

    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Stock tidak cukup",
      });
    }

    const cartItem = await prisma.cartDetail.create({
      data: {
        id_cart: cart.id_cart,
        id_product: product_id,
        qty: quantity,
        subtotal: price * quantity,
      },
    });

    return res.status(201).json({
      message: "Added to cart",
      data: cartItem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const cart = await prisma.cart.findUnique({
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

    if (!cart) {
      return res.json({
        message: "Cart kosong",
        data: [],
      });
    }

    return res.json({
      message: "Success",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // id_cart_detail

    await prisma.cartDetail.delete({
      where: {
        id_cart_detail: Number(id),
      },
    });

    return res.json({
      message: "Item dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const updateCartQty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // id_cart_detail
    const { qty } = req.body;

    const quantity = Number(qty);

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Qty minimal 1",
      });
    }

    const item = await prisma.cartDetail.findUnique({
      where: {
        id_cart_detail: Number(id),
      },
      include: {
        product: true,
      },
    });

    if (!item) {
      return res.status(404).json({
        message: "Item tidak ditemukan",
      });
    }

    // cek stock
    if (quantity > item.product.stock) {
      return res.status(400).json({
        message: "Stock tidak cukup",
      });
    }

    const updated = await prisma.cartDetail.update({
      where: {
        id_cart_detail: Number(id),
      },
      data: {
        qty: quantity,
        subtotal: Number(item.product.price) * quantity,
      },
    });

    return res.json({
      message: "Qty updated",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const checkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // 1. ambil cart
    const cart = await prisma.cart.findUnique({
      where: { id_user: userId },
      include: {
        cartDetails: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.cartDetails.length === 0) {
      return res.status(400).json({
        message: "Cart kosong",
      });
    }

    // 2. hitung total
    const total = cart.cartDetails.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0,
    );

    // 3. buat order
    const order = await prisma.order.create({
      data: {
        id_user: userId,
        total_price: total,
        status: "PENDING",
      },
    });

    // 4. buat order detail
    for (const item of cart.cartDetails) {
      await prisma.orderDetail.create({
        data: {
          id_order: order.id_order,
          id_product: item.id_product,
          qty: item.qty,
          price: item.product.price,
          subtotal: item.subtotal,
        },
      });
    }

    // 5. clear cart
    await prisma.cartDetail.deleteMany({
      where: { id_cart: cart.id_cart },
    });

    return res.json({
      message: "Checkout berhasil",
      data: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
