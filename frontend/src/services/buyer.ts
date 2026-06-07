import axios from "axios";

const API = "http://localhost:3000/api/product";

export const getProducts = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};