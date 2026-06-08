import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getMyOrders } from "../../services/order";

interface Order {
  id_order: number;
  total_price: string;
  status: string;
  order_date: string;

  orderDetails: {
    id_order_detail: number;
    qty: number;
    subtotal: string;
    status: string;

    product: {
      product_name: string;
      product_image?: string;
      price: string;
    };
  }[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Pending
          </span>
        );

      case "ACCEPTED":
        return (
          <span className="bg-green-500 text-white px-3 py-1 rounded-full  text-xs font-medium">
            Accepted
          </span>
        );

      case "CANCELLED":
        return (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Cancelled
          </span>
        );

      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  const getImageUrl = (path?: string) => {
    if (!path) return "";

    return `http://localhost:3000/${path.replace(/\\/g, "/")}`;
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
        <div>
          <h1 className="text-2xl font-bold">Pesanan Saya</h1>
          <p className="text-gray-500">
            Riwayat seluruh pesanan yang pernah dibuat
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Tanggal</th>
                <th className="p-4 text-left">Jumlah Produk</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-6">
                    Belum ada pesanan
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id_order} className="border-t">
                    <td className="p-4 font-medium">#{order.id_order}</td>

                    <td className="p-4">
                      {new Date(order.order_date).toLocaleDateString("id-ID")}
                    </td>

                    <td className="p-4">{order.orderDetails.length} Produk</td>

                    <td className="p-4 font-semibold text-green-600">
                      Rp {Number(order.total_price).toLocaleString("id-ID")}
                    </td>

                    <td className="p-4">{getStatusBadge(order.status)}</td>

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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL DETAIL */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white w-[900px] max-h-[90vh] overflow-auto rounded-xl p-6 relative">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-3 right-4 text-red-500 text-xl"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-5">
                Detail Order #{selectedOrder.id_order}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p>
                    <b>Tanggal :</b>{" "}
                    {new Date(selectedOrder.order_date).toLocaleString("id-ID")}
                  </p>

                  <p>
                    <b>Status :</b> {getStatusBadge(selectedOrder.status)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    Rp{" "}
                    {Number(selectedOrder.total_price).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Produk</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Harga</th>
                    <th className="p-3 text-right">Subtotal</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedOrder.orderDetails.map((item) => (
                    <tr key={item.id_order_detail} className="border-t">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(item.product.product_image)}
                            className="w-14 h-14 rounded object-cover border"
                          />

                          <span>{item.product.product_name}</span>
                        </div>
                      </td>

                      <td className="p-3 text-center">{item.qty}</td>

                      <td className="p-3 text-right">
                        Rp {Number(item.product.price).toLocaleString("id-ID")}
                      </td>

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
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
