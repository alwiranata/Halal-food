import axios from "axios";

const API = "http://localhost:3000/api/profile";

const getToken = () => localStorage.getItem("token");

/* GET PROFILE */
export const getProfile = async () => {
  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data.data;
};

/* UPDATE PROFILE (FIXED) */
export const updateProfile = async (data: any) => {
  const token = getToken();

  console.log("TOKEN:", token); // 🔥 DEBUG

  const res = await axios.put(API, data, {
    headers: {
      Authorization: `Bearer ${token}`, // 🔥 WAJIB
    },
  });

  return res.data;
};
