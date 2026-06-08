import axios from "axios";

const API = "http://localhost:3000/api/order";

const getToken = () => localStorage.getItem("token");

export const getMyOrders = async () => {
  const res = await axios.get(`${API}/get`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data.data;
};
