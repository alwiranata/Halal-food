import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import SellerDashboard from "./pages/seller/SellerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SellerRequests from "./pages/admin/AdminSellerRequests";
import NotFoundPages from "./pages/404";
import Products from "./pages/seller/Products";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/buyer" element={<BuyerDashboard />} />
      <Route path="/seller" element={<SellerDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/sellers" element={<SellerRequests />} />
      <Route path="/seller/products" element={<Products />} />
      {/* Halaman 404 */}
      <Route path="*" element={<NotFoundPages />} />
    </Routes>
  );
}

export default App;
