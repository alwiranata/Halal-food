import axios from "axios";

const API = "http://localhost:3000/api/sellers";

export const sellerRegister = async (formData: FormData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API}/register`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};