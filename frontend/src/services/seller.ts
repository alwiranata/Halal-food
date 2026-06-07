import axios from "axios";

const API = "http://localhost:3000/api/seller";

// =========================
// DASHBOARD
// =========================
export const getDashboardStats = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// =========================
// GET PRODUCTS
// =========================
export const getProducts = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// =========================
// CREATE PRODUCT (TAMBAHAN BARU)
// =========================
export const createProduct = async (data: FormData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API}/products`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// =========================
// UPDATE PRODUCT (TAMBAHAN BARU)
// =========================
export const updateProduct = async (id: number, data: FormData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API}/products/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// =========================
// DELETE PRODUCT
// =========================
export const deleteProduct = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${API}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getSellerOrders = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateOrderStatus = async (
  id: number,
  status: "ACCEPTED" | "CANCELLED"
) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    `${API}/orders/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};