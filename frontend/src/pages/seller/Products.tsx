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

  // 🔥 TAMBAHKAN INI
  product_image?: string;
  halal_certificate?: string;
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
  const [selectedId, setSelectedId] = useState<number>(0);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [halalCert, setHalalCert] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
    setSelectedId(0);
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
    setSelectedId(0);
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
      const formData = new FormData();

      formData.append("product_name", form.product_name);
      formData.append("description", form.description);
      formData.append("price", String(form.price));
      formData.append("stock", String(form.stock));
      formData.append("is_halal", String(form.is_halal));

      if (productImage) {
        formData.append("product_image", productImage);
      }

      if (halalCert) {
        formData.append("halal_certificate", halalCert);
      }

      if (isEdit && selectedId !== 0) {
        await updateProduct(selectedId, formData);
      } else {
        await createProduct(formData);
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

  const getImageUrl = (path: string) => {
    return `http://localhost:3000/${path.replace("\\", "/")}`;
  };

  const openPreview = (url: string) => {
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setIsPreviewOpen(false);
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
                <th className="p-4 text-left">Sertifikat Halal</th>
                <th className="p-4 text-left">Gambar</th>
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

                    <td className="p-4">
                      <button
                        onClick={() =>
                          openPreview(getImageUrl(p.halal_certificate!))
                        }
                        className="text-green-500 underline"
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
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                          />
                        </svg>
                      </button>
                    </td>

                    <td className="p-4">
                      {p.product_image && (
                        <img
                          src={getImageUrl(p.product_image || "")}
                          className="w-12 h-12 object-cover rounded cursor-pointer"
                          onClick={() =>
                            openPreview(getImageUrl(p.product_image || ""))
                          }
                        />
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 23 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDelete(p.id_product)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
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
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {isPreviewOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-[80%] max-h-[80%] relative">
              {/* CLOSE BUTTON */}
              <button
                onClick={closePreview}
                className="absolute top-2 right-2 text-red-500 text-xl"
              >
                ✕
              </button>

              {/* IMAGE / FILE */}
              {previewUrl?.endsWith(".pdf") ? (
                <iframe src={previewUrl} className="w-[600px] h-[500px]" />
              ) : (
                <img
                  src={previewUrl || ""}
                  className="max-w-[600px] max-h-[500px] object-contain"
                />
              )}
            </div>
          </div>
        )}

        {isEdit && selectedId !== 0 && (
          <div>
            <p className="text-sm mb-1">Preview Gambar:</p>
            <img
              src={getImageUrl(
                products.find((p) => p.id_product === selectedId)
                  ?.product_image || "",
              )}
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}

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

              <div className="space-y-2">
                <label>Gambar Produk</label>
                <input
                  type="file"
                  onChange={(e) => setProductImage(e.target.files?.[0] || null)}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="space-y-2">
                <label>Sertifikat Halal</label>
                <input
                  type="file"
                  onChange={(e) => setHalalCert(e.target.files?.[0] || null)}
                  className="w-full border p-2 rounded"
                />
              </div>

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
