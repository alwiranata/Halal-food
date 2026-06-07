import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getProducts } from "../../services/buyer";

interface Product {
  id_product: number;
  product_name: string;
  description: string;
  price: string;
  stock: number;
  is_halal: boolean;
  product_image?: string;
  halal_certificate?: string;
  seller: {
    store_name: string;
  };
}

export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterHalal, setFilterHalal] = useState("all");
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path?: string) => {
    if (!path) return "";

    return `http://localhost:3000/${path.replaceAll("\\", "/")}`;
  };

  const filteredProducts = products.filter((p) => {
    if (filterHalal === "halal") return p.is_halal;
    if (filterHalal === "non-halal") return !p.is_halal;
    return true;
  });

  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 -m-6 p-6">
        {/* HEADER */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Halal Food</h1>

              <p className="text-sm text-slate-500">
                Produk dari seller terpercaya
              </p>
            </div>

            <div className="w-full md:w-72">
              <select
                value={filterHalal}
                onChange={(e) => setFilterHalal(e.target.value)}
                className="
      w-full
      px-4
      py-2.5
      rounded-xl
      border
      border-slate-200
      bg-white
      text-slate-700
      focus:outline-none
      focus:ring-2
      focus:ring-green-500
      cursor-pointer
    "
              >
                <option value="all">✨ Semua Produk</option>
                <option value="halal">🌿 Produk Halal</option>
                <option value="non-halal">❗ Produk Non Halal</option>
              </select>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-600">
              Belum ada produk
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id_product}
                className="
        bg-white
        rounded-2xl
        overflow-hidden
        border
        border-slate-200
        hover:border-green-500
        hover:shadow-lg
        transition-all
        duration-300
        flex
        flex-col
      "
              >
                {/* IMAGE */}
                <div className="relative h-32 bg-slate-100">
                  {p.product_image ? (
                    <img
                      src={getImageUrl(p.product_image)}
                      alt={p.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Image
                    </div>
                  )}

                  <div className="absolute top-2 left-2">
                    {p.is_halal ? (
                      <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded-full">
                        Halal
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">
                        Non Halal
                      </span>
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-3 flex flex-col flex-1">
                  {/* NAMA */}
                  <h2 className="font-semibold text-sm text-slate-800 line-clamp-2 h-10">
                    {p.product_name}
                  </h2>

                  {/* TOKO */}
                  <p className="text-[11px] text-slate-500 mt-1 truncate">
                    🏪 {p.seller.store_name}
                  </p>

                  {/* HARGA */}
                  <div className="mt-2">
                    <h3 className="text-base font-bold text-green-600">
                      Rp {Number(p.price).toLocaleString("id-ID")}
                    </h3>
                  </div>

                  {/* STOCK + CERTIFICATE */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-slate-500">
                      Stok {p.stock}
                    </span>

                    {p.is_halal && p.halal_certificate && (
                      <a
                        href={getImageUrl(p.halal_certificate)}
                        target="_blank"
                        rel="noreferrer"
                        className="
                text-[11px]
                text-green-600
                font-medium
                hover:underline
              "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                            clipRule="evenodd"
                          />
                          <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                        </svg>
                      </a>
                    )}
                  </div>

                  {/* BUTTON */}
                  <button
                    className="
            mt-3
            w-full
            bg-green-600
            hover:bg-green-700
            text-white
            text-xs
            font-medium
            py-2
            rounded-xl
            transition
            flex flex-row items-center justify-center gap-1
          "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                    </svg>
                    Checkout
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
