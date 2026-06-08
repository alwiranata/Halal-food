import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getSellerOrders, updateOrderStatus } from "../../services/seller";

interface Order {
  id_order: number;
  total_price: number;
  status: "PENDING" | "ACCEPTED" | "CANCELLED";
  order_date: string;

  user: {
    name: string;
    email: string;
    address?: string;
    phone?: string;
  };

  orderDetails: {
    id_order_detail: number;
    qty: number;
    subtotal: number;

    product: {
      product_name: string;
      product_image?: string;
    };
  }[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await getSellerOrders();
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdate = async (id: number, status: "ACCEPTED" | "CANCELLED") => {
    try {
      const res = await updateOrderStatus(id, status);
      console.log(res);

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
            Pending
          </span>
        );

      case "ACCEPTED":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Accepted
          </span>
        );

      case "CANCELLED":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            Cancelled
          </span>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Orders Masuk</h1>
          <p className="text-gray-500">
            Kelola pesanan yang masuk ke toko Anda
          </p>
        </div>

        {/* EMPTY */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow border p-10 text-center">
            <p className="text-gray-500">Belum ada pesanan masuk</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const sellerTotal = order.orderDetails.reduce(
                (sum, item) => sum + Number(item.subtotal),
                0,
              );

              return (
                <div
                  key={order.id_order}
                  className="bg-white border rounded-xl shadow-sm overflow-hidden"
                >
                  {/* HEADER CARD */}
                  <div className="p-5 border-b bg-gray-50 flex flex-col md:flex-row md:justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-lg">
                        Order #{order.id_order}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {new Date(order.order_date).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      {getStatusBadge(order.status)}

                      <p className="mt-2 font-semibold">
                        Total:
                        <span className="text-green-600 ml-1">
                          Rp {sellerTotal.toLocaleString("id-ID")}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* BUYER */}
                  <div className="p-5 border-b">
                    <h3 className="font-semibold mb-2">Informasi Pembeli</h3>

                    <p>
                      <span className="font-medium">Nama:</span>{" "}
                      {order.user.name}
                    </p>

                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {order.user.email}
                    </p>

                    <p>
                      <span className="font-medium">Alamat:</span>{" "}
                      {order.user.address || ""}
                    </p>

                    <p>
                      <span className="font-medium">Telepon:</span>{" "}
                      {order.user.phone || ""}
                    </p>
                  </div>

                  {/* PRODUCT LIST */}
                  <div className="p-5">
                    <h3 className="font-semibold mb-3">Produk Dipesan</h3>

                    <div className="space-y-3">
                      {order.orderDetails.map((item) => (
                        <div
                          key={item.id_order_detail}
                          className="flex items-center gap-4 border rounded-lg p-3"
                        >
                          <img
                            src={`http://localhost:3000/${item.product.product_image?.replace(
                              /\\/g,
                              "/",
                            )}`}
                            alt={item.product.product_name}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />

                          <div className="flex-1">
                            <h4 className="font-semibold">
                              {item.product.product_name}
                            </h4>

                            <p className="text-gray-500">Qty: {item.qty}</p>

                            <p className="font-medium text-green-600">
                              Rp {Number(item.subtotal).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACTION */}
                  {order.status === "PENDING" && (
                    <div className="p-5 border-t flex justify-end gap-3">
                      <button
                        onClick={() =>
                          handleUpdate(order.id_order, "CANCELLED")
                        }
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        Cancel Order
                      </button>

                      <button
                        onClick={() => handleUpdate(order.id_order, "ACCEPTED")}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                      >
                        Accept Order
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
