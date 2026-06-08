import { useCallback, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getProfile, updateProfile } from "../services/profile";

type ProfileForm = {
  name: string;
  phone: string;
  address: string;
  password: string;
};

export default function Profile() {
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    phone: "",
    address: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProfile();

      setForm({
        name: data.name ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        password: "",
      });
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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

      await updateProfile(form);

      alert("Profile berhasil diupdate!");
      await loadProfile();
    } catch (err) {
      console.error(err);
      setError("Gagal mengupdate profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-gray-500">
            Loading profile...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <p className="text-gray-500 text-sm">
              Kelola informasi akun kamu
            </p>
          </div>

          {/* Card */}
          <div className="bg-white shadow-sm rounded-2xl border p-6 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Your name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full mt-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-sm text-gray-600">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full mt-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                placeholder="Your address"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600">
                New Password (optional)
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full mt-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 rounded-xl text-white font-semibold transition
              bg-gradient-to-r from-green-500 to-emerald-600
              hover:from-green-600 hover:to-emerald-700
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}