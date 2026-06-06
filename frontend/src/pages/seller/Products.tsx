import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../../services/seller";

/* =========================
   TYPE
========================= */
interface Product {
  id_product: number;
  product_name: string;
  price: number;
  stock: number;
  is_halal: boolean;
  description?: string;
}

/* =========================
   INITIAL FORM
========================= */
const initialForm = {
  product_name: "",
  description: "",
  price: 0,
  stock: 0,
  is_halal: true,
};

export default function Products() {
  /* =========================
     STATE
  ========================= */
  const [products, setProducts] = useState<Product[]>([]);

  const [form, setForm] = useState(initialForm);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  /* =========================
     FETCH
  ========================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     MODAL CONTROL
  ========================= */
  const openAddModal = () => {
    setIsEdit(false);
    setSelectedId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setIsEdit(true);
    setSelectedId(product.id_product);

    setForm({
      product_name: product.product_name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      is_halal: product.is_halal,
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(initialForm);
    setSelectedId(null);
    setIsEdit(false);
  };

  /* =========================
     HANDLE INPUT
  ========================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    try {
      console.log("SUBMIT CLICKED"); // 🔥
      console.log("FORM DATA:", form); // 🔥
      if (isEdit && selectedId) {
        await updateProduct(selectedId, form);
      } else {
        await createProduct(form);
      }

      closeModal();
      fetchProducts();
    } catch (error: any) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Yakin ingin hapus produk?");
    if (!confirm) return;

    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error: any) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <Layout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Produk Saya</h1>

          <button
            onClick={openAddModal}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            + Tambah Produk
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Produk</th>
                <th className="p-4 text-left">Harga</th>
                <th className="p-4 text-left">Stok</th>
                <th className="p-4 text-left">Halal</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-6">
                    Belum ada produk
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id_product} className="border-t">
                    <td className="p-4">{p.product_name}</td>
                    <td className="p-4">
                      Rp {Number(p.price).toLocaleString()}
                    </td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4">{p.is_halal ? "✅" : "❌"}</td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => openEditModal(p)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id_product)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* =========================
            MODAL (SIMPLE STYLE)
        ========================= */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-[500px] space-y-4 relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-red-500"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold">
                {isEdit ? "Edit Produk" : "Tambah Produk"}
              </h2>

              <input
                name="product_name"
                placeholder="Nama Produk"
                value={form.product_name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <textarea
                name="description"
                placeholder="Deskripsi"
                value={form.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="price"
                type="number"
                placeholder="Harga"
                value={form.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="stock"
                type="number"
                placeholder="Stok"
                value={form.stock}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_halal}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_halal: e.target.checked,
                    }))
                  }
                />
                <label>Halal</label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  {isEdit ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
