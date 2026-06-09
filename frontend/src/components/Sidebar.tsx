import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  const menuClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-white text-green-700 p-3 rounded-lg font-semibold"
      : "p-3 rounded-lg hover:bg-green-600 transition";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="w-64 min-h-screen bg-green-700 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-green-500">
        <h1 className="text-2xl font-bold">Halal Food</h1>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {role === "ADMIN" && (
          <>
            <NavLink to="/admin" end className={menuClass}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/sellers" className={menuClass}>
              Pengajuan Seller
            </NavLink>
          </>
        )}

        {role === "SELLER" && (
          <>
            <NavLink to="/seller" end className={menuClass}>
              Dashboard
            </NavLink>

            <NavLink to="/seller/products" className={menuClass}>
              Produk Saya
            </NavLink>

            <NavLink to="/seller/orders" className={menuClass}>
              Pesanan
            </NavLink>
          </>
        )}

        {role === "BUYER" && (
          <>
            <NavLink to="/buyer" end className={menuClass}>
              Dashboard
            </NavLink>

            <NavLink to="/buyer/products" className={menuClass}>
              Produk
            </NavLink>

            <NavLink to="/buyer/cart" className={menuClass}>
              Keranjang
            </NavLink>

            <NavLink to="/buyer/orders" className={menuClass}>
              Pesanan
            </NavLink>

            <NavLink to="/buyer/registerSeller" className={menuClass}>
              Daftar Seller
            </NavLink>
          </>
        )}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-green-500">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
