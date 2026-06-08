import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getBuyerDashboard } from "../../services/buyer";

export default function BuyerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getBuyerDashboard();
      setData(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 space-y-4 animate-pulse">
          <div className="h-6 w-40 bg-gray-200 rounded"></div>
          <div className="h-4 w-60 bg-gray-200 rounded"></div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="h-24 bg-gray-200 rounded-xl"></div>
            <div className="h-24 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </Layout>
    );
  }
  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold inline-block";

    switch (status) {
      case "PENDING":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            Pending
          </span>
        );

      case "ACCEPTED":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            Accepted
          </span>
        );

      case "CANCELLED":
        return (
          <span className={`${base} bg-red-100 text-red-700`}>Cancelled</span>
        );

      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>
        );
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            👋 Welcome, {user?.name || "User"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Ringkasan aktivitas belanja kamu
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Pesanan</p>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">
              {data?.orders?.length || 0}
            </h1>
          </div>

          <div className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Status Akun</p>
            <h1 className="text-2xl font-bold text-green-600 mt-2">Aktif</h1>
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Pesanan Terbaru</h2>
          </div>

          {data?.orders?.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada pesanan</p>
          ) : (
            <div className="space-y-3">
              {data?.orders?.slice(0, 5).map((order: any) => (
                <div
                  key={order.id_order}
                  className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">Order #{order.id_order}</p>
                    <div className="mt-1">
                      {getStatusBadge(order.status)}
                    </div>{" "}
                  </div>

                  <span className="text-green-600 font-semibold">
                    Rp {order.total_price}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
