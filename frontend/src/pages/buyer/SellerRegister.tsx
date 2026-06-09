import { useCallback, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { sellerRegister } from "../../services/sellerRegister";

type SellerForm = {
  ktp_number: string;
  store_name: string;
  address: string;
};

export default function SellerRegister() {
  const [form, setForm] = useState<SellerForm>({
    ktp_number: "",
    store_name: "",
    address: "",
  });

  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OPTIONAL: kalau mau auto cek user sudah seller atau belum
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // nanti bisa dipakai cek status seller
      // const data = await getSellerStatus()
    } catch (err) {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append("ktp_number", form.ktp_number);
      formData.append("store_name", form.store_name);
      formData.append("address", form.address);

      if (ktpFile) {
        formData.append("ktp_photo", ktpFile);
      }

      await sellerRegister(formData);

      alert("Register seller berhasil, menunggu verifikasi!");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal register seller");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
        <div className="w-full max-w-2xl">
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Register Seller
            </h1>
            <p className="text-gray-500 text-sm">
              Daftarkan toko kamu untuk mulai berjualan
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white shadow-sm rounded-2xl border p-6 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* KTP NUMBER */}
            <div>
              <label className="text-sm text-gray-600">Nomor KTP</label>
              <input
                name="ktp_number"
                value={form.ktp_number}
                onChange={handleChange}
                className="w-full mt-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nomor KTP"
              />
            </div>

            {/* STORE NAME */}
            <div>
              <label className="text-sm text-gray-600">Nama Toko</label>
              <input
                name="store_name"
                value={form.store_name}
                onChange={handleChange}
                className="w-full mt-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nama toko kamu"
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-sm text-gray-600">Alamat</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full mt-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Alamat toko"
              />
            </div>

            {/* KTP FILE */}
            <div>
              <label className="text-sm text-gray-600">Upload KTP</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setKtpFile(e.target.files?.[0] || null)}
                className="w-full mt-1 border rounded-xl p-3"
              />

              {/* PREVIEW */}
              {ktpFile && (
                <img
                  src={URL.createObjectURL(ktpFile)}
                  className="mt-3 h-40 object-cover rounded-xl border"
                />
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 rounded-xl text-white font-semibold transition
              bg-gradient-to-r from-green-500 to-emerald-600
              hover:from-green-600 hover:to-emerald-700
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Mengirim..." : "Daftar Seller"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
