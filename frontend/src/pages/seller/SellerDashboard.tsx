import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getDashboardStats } from "../../services/seller";

export default function SellerDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();

      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Seller</h1>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>

              <p className="text-gray-500">{user.email}</p>

              <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <h3 className="text-gray-500 text-sm">Total Produk</h3>

            <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <h3 className="text-gray-500 text-sm">Total Pesanan</h3>

            <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <h3 className="text-gray-500 text-sm">Pesanan Pending</h3>

            <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <h3 className="text-gray-500 text-sm">Total Pendapatan</h3>

            <p className="text-3xl font-bold mt-2">
              Rp {Number(stats.totalRevenue).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Informasi */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <h2 className="text-lg font-semibold mb-3">Informasi</h2>

          <p className="text-gray-600">
            Kelola produk halal, pantau pesanan pelanggan, dan update informasi
            toko melalui menu di sidebar.
          </p>
        </div>
      </div>
    </Layout>
  );
}
