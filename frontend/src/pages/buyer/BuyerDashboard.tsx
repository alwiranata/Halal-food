import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getBuyerDashboard } from "../../services/buyer";
import { useNavigate } from "react-router-dom";

export default function BuyerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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
        <div className="p-6">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard Buyer</h1>
          <p className="text-gray-500">Ringkasan aktivitas kamu</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow border">
            <p>Total Pesanan</p>
            <h1 className="text-2xl font-bold">{data?.orders?.length || 0}</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
}
