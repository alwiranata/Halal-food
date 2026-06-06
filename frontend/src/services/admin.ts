import axios from "axios";

const API = "http://localhost:3000/api/admin";

export const getDashboardStats = async () => {
  const response = await axios.get(`${API}/dashboard`);

  return response.data;
};

export const getPendingSellers = async () => {
  const response = await axios.get(`${API}/sellers`);

  return response.data;
};

export const approveSeller = async (id: number) => {
  const response = await axios.patch(`${API}/seller/${id}/approve`);

  return response.data;
};

export const rejectSeller = async (id: number) => {
  const response = await axios.patch(`${API}/seller/${id}/reject`);

  return response.data;
};
