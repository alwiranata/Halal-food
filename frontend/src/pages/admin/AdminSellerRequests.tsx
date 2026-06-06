import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  getPendingSellers,
  approveSeller,
  rejectSeller,
} from "../../services/admin";

export default function SellerRequests() {
  const [sellers, setSellers] = useState([]);
  const [selectedKtp, setSelectedKtp] = useState("");

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const res = await getPendingSellers();

      setSellers(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveSeller(id);

      alert("Seller berhasil diapprove");

      fetchSellers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectSeller(id);

      alert("Seller berhasil direject");

      fetchSellers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      {selectedKtp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 relative">
            <button
              onClick={() => setSelectedKtp("")}
              className="absolute top-4 right-4 text-red-500 text-2xl font-bold hover:text-red-700"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">Foto KTP</h2>

            <img
              src={`http://localhost:3000/uploads/${selectedKtp}`}
              alt="KTP"
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg border"
            />
          </div>
        </div>
      )}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Pengajuan Seller</h1>

        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3 text-left">Nama</th>

                <th className="p-3 text-left">Email</th>

                <th className="p-3 text-left">NIK</th>

                <th className="p-3 text-center">KTP</th>

                <th className="p-3 text-left">Toko</th>

                <th className="p-3 text-left">Status</th>

                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {sellers.length > 0 ? (
                sellers.map((seller: any) => (
                  <tr key={seller.id_seller} className="border-b">
                    <td className="p-3">{seller.user.name}</td>

                    <td className="p-3">{seller.user.email}</td>

                    <td className="p-3">{seller.ktp_number}</td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedKtp(seller.ktp_photo)}
                        className="bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </button>
                    </td>

                    <td className="p-3">{seller.store_name}</td>

                    <td className="p-3">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        {seller.is_verified}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(seller.id_seller)}
                          className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                        >
                          Terima
                        </button>

                        <button
                          onClick={() => handleReject(seller.id_seller)}
                          className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                        >
                          Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-5">
                    Tidak ada pengajuan seller
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
