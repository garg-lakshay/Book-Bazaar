"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "USER" | "SELLER";
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: { error?: string } = await res.json();

      if (!res.ok) throw new Error(data.error || "Registration failed");

      alert("✅ Registered successfully! Please login now.");
      router.push("/login");
    } catch (err) {
      // ✅ Typed error handling
      if (err instanceof Error) {
        setError(err.message);
        console.error("❌ Registration error:", err.message);
      } else {
        setError("An unexpected error occurred.");
        console.error("❌ Unknown error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            required
          />

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

          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value as "USER" | "SELLER",
              })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          >
            <option value="USER">User</option>
            <option value="SELLER">Seller</option>
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-purple-700 font-medium">
            Login
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
