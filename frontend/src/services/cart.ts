import axios from "axios";

const API = "http://localhost:3000/api/cart";

const getToken = () => localStorage.getItem("token");

export const addToCart = async (product_id: number, qty: number) => {
  const res = await axios.post(
    `${API}/add`,
    {
      product_id,
      qty,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return res.data;
};

export const getCart = async () => {
  const res = await axios.get(`${API}/get`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data.data;
};

export const removeCartItem = async (id: number) => {
  const res = await axios.delete(`${API}/remove/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

export const updateCartQty = async (id: number, qty: number) => {
  const res = await axios.patch(
    `${API}/update/${id}`,
    { qty },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return res.data;
};

export const checkout = async () => {
  const res = await axios.post(
    `${API}/checkout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return res.data;
};
