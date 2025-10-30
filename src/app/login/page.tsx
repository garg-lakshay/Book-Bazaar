"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("✅ Token saved:", data.token);
      } else {
        console.warn("⚠️ No token returned from backend");
      }

      if (data.user) {
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userId", data.user.id);
        console.log("✅ Role saved:", data.user.role);
      }

      // ✅ Redirect based on role (slight delay for localStorage to finish)
      if (data.user.role === "SELLER") {
        setTimeout(() => router.push("/seller/dashboard"), 200);
      } else if (data.user.role === "OWNER") {
        setTimeout(() => router.push("/owner/dashboard"), 200);
      } else {
        setTimeout(() => router.push("/dashboard"), 200);
      }

    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-purple-700 font-medium">
            Register
          </a>
        </p>

        <p className="text-center text-xs mt-8 text-gray-500">
          Made with <span className="animate-pulse text-red-500">❤️</span> by{" "}
          <span className="font-medium text-purple-700">Lakshay Garg</span>
        </p>
      </div>
    </main>
  );
}
