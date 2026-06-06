import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getDashboardStats } from "../../services/admin";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState({
    totalUser: 0,
    totalSeller: 0,
    pendingSeller: 0,
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
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h2>

              <p className="text-gray-500">{user.email}</p>

              <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <h3 className="text-gray-500 text-sm">Total User</h3>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stats.totalUser}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <h3 className="text-gray-500 text-sm">Total Seller</h3>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stats.totalSeller}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <h3 className="text-gray-500 text-sm">Pending Seller</h3>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stats.pendingSeller}
            </p>
          </div>
        </div>

        {/* Informasi */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Informasi
          </h2>

          <p className="text-gray-600">
            Gunakan menu di sidebar untuk mengelola pengajuan seller,
            memverifikasi data pengguna, dan memantau aktivitas sistem.
          </p>
        </div>
      </div>
    </Layout>
  );
}
