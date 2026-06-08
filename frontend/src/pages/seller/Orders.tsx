import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getSellerOrders, updateOrderStatus } from "../../services/seller";

interface Order {
  id_order: number;
  total_price: number;
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
    status: "PENDING" | "ACCEPTED" | "CANCELLED";

    product: {
      product_name: string;
      product_image?: string;
    };
  }[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getSellerOrders();
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, status: "ACCEPTED" | "CANCELLED") => {
    try {
      await updateOrderStatus(id, status);

      fetchOrders();

      setSelectedOrder(null);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
            Pending
          </span>
        );

      case "ACCEPTED":
        return (
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
            Accepted
          </span>
        );

      case "CANCELLED":
        return (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            Cancelled
          </span>
        );

      default:
        return null;
    }
  };

  const getImageUrl = (path?: string) => {
    if (!path) return "";

    return `http://localhost:3000/${path.replaceAll("\\", "/")}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Order Masuk</h1>

            <p className="text-gray-500">
              Kelola pesanan yang masuk ke toko Anda
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Pembeli</th>
                <th className="p-4 text-left">Tanggal</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-6">
                    Belum ada pesanan masuk
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  const sellerTotal = order.orderDetails.reduce(
                    (sum, item) => sum + Number(item.subtotal),
                    0,
                  );

                  const sellerStatus =
                    order.orderDetails[0]?.status || "PENDING";

                  return (
                    <tr key={order.id_order} className="border-t">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{order.user.name}</td>

                      <td className="p-4">
                        {new Date(order.order_date).toLocaleDateString("id-ID")}
                      </td>

                      <td className="p-4 font-semibold text-green-600">
                        Rp {sellerTotal.toLocaleString("id-ID")}
                      </td>

                      <td className="p-4">{getStatusBadge(sellerStatus)}</td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* POPUP DETAIL */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[900px] max-h-[90vh] overflow-auto p-6 relative">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-3 right-3 text-red-500 text-xl"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-5">
                Detail Order #{selectedOrder.id_order}
              </h2>

              {/* DATA PEMBELI */}
              <div className="border rounded-lg p-4 mb-5">
                <h3 className="font-semibold mb-3">Informasi Pembeli</h3>

                <p>
                  <b>Nama:</b> {selectedOrder.user.name}
                </p>

                <p>
                  <b>Email:</b> {selectedOrder.user.email}
                </p>

                <p>
                  <b>Alamat:</b> {selectedOrder.user.address || "-"}
                </p>

                <p>
                  <b>Telepon:</b> {selectedOrder.user.phone || "-"}
                </p>
              </div>

              {/* PRODUK */}
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Produk</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Subtotal</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedOrder.orderDetails.map((item) => (
                    <tr
                      key={item.id_order_detail}
                      className="border-t align-middle"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(item.product.product_image)}
                            className="w-14 h-14 object-cover rounded-lg border"
                          />

                          <span>{item.product.product_name}</span>
                        </div>
                      </td>

                      <td className="p-3 text-center">{item.qty}</td>

                      <td className="p-3 text-right">
                        Rp {Number(item.subtotal).toLocaleString("id-ID")}
                      </td>

                      <td className="p-3 text-center">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* TOTAL */}
              <div className="mt-5 text-right">
                <h3 className="font-bold text-lg text-green-600">
                  Total Rp{" "}
                  {selectedOrder.orderDetails
                    .reduce((sum, item) => sum + Number(item.subtotal), 0)
                    .toLocaleString("id-ID")}
                </h3>
              </div>

              {/* ACTION */}
              {selectedOrder.orderDetails[0]?.status === "PENDING" && (
                <div className="flex justify-end gap-3 mt-5">
                  <button
                    onClick={() =>
                      handleUpdate(selectedOrder.id_order, "CANCELLED")
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Cancel Order
                  </button>

                  <button
                    onClick={() =>
                      handleUpdate(selectedOrder.id_order, "ACCEPTED")
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Accept Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
