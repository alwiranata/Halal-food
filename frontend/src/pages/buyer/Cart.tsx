import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  checkout,
  getCart,
  removeCartItem,
  updateCartQty,
} from "../../services/cart";

interface CartItem {
  id_cart_detail: number;
  qty: number;
  subtotal: number;
  product: {
    product_name: string;
    price: string;
    product_image?: string;
  };
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await getCart();
      setItems(data.cartDetails || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path?: string) => {
    if (!path) return "";
    return `http://localhost:3000/${path.replaceAll("\\", "/")}`;
  };

  const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

  const handleDelete = async (id: number) => {
    try {
      setItems((prev) => prev.filter((item) => item.id_cart_detail !== id));

      await removeCartItem(id);
    } catch (error) {
      console.error(error);
      loadCart();
    }
  };

  const handleQty = async (id: number, newQty: number) => {
    if (newQty < 1) return;

    try {
      // 1. UPDATE UI DULU (biar smooth)
      setItems((prev) =>
        prev.map((item) =>
          item.id_cart_detail === id
            ? {
                ...item,
                qty: newQty,
                subtotal: Number(item.product.price) * newQty,
              }
            : item,
        ),
      );

      // 2. UPDATE SERVER DI BACKGROUND
      await updateCartQty(id, newQty);
    } catch (error) {
      console.error(error);

      // rollback kalau gagal
      loadCart();
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout();
      alert("Checkout berhasil");
      loadCart(); // cart jadi kosong
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <p>Loading cart...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-800">Keranjang Saya</h1>

        {items.length === 0 ? (
          <div className="text-center text-gray-500">Cart masih kosong</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id_cart_detail}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <img
                    src={getImageUrl(item.product.product_image)}
                    className="w-14 h-14 object-cover rounded-lg"
                  />

                  <div>
                    <h2 className="font-semibold">
                      {item.product.product_name}
                    </h2>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleQty(item.id_cart_detail, item.qty - 1)
                        }
                        className="w-7 h-7 bg-gray-200 rounded"
                      >
                        -
                      </button>

                      <span className="w-6 text-center">{item.qty}</span>

                      <button
                        onClick={() =>
                          handleQty(item.id_cart_detail, item.qty + 1)
                        }
                        className="w-7 h-7 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    Rp {Number(item.subtotal).toLocaleString("id-ID")}
                  </p>

                  <button
                    onClick={() => handleDelete(item.id_cart_detail)}
                    className="text-red-500 text-xs mt-1 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}

            {/* TOTAL */}
            <div className="mt-6 bg-green-50 p-4 rounded-xl flex justify-between items-center">
              <h2 className="font-bold">Total</h2>
              <h2 className="font-bold text-green-700">
                Rp {total.toLocaleString("id-ID")}
              </h2>
            </div>

            {/* CHECKOUT */}
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-xl mt-4 hover:bg-green-700"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
