import axios from "axios";

const API = "http://localhost:3000/api";

const getToken = () => localStorage.getItem("token");

export const getProducts = async () => {
  const response = await axios.get(`${API}/product`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const getBuyerDashboard = async () => {
  const response = await axios.get(`${API}/buyer/dashboard`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data.data;
};
