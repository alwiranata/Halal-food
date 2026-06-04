import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Success");

      navigate("/home");

      console.log(res);
    } catch (error: any) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            Login
          </button>
          <p className="text-center mt-4">
            Belum punya akun?
            <Link to="/register" className="text-green-600 ml-1">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
