"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 🧩 Define a type for Book (no `any` now)
type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  description?: string;
};

export default function SellerDashboard() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [stripeAccountId, setStripeAccountId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "SELLER") {
      router.push("/dashboard"); // redirect buyers away
      return;
    }

    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/seller/books", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch books");

        const data = await res.json();
        setBooks(data.books || []);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, [router]);

  const handleStripeConnect = async () => {
    try {
      setIsConnecting(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to connect with Stripe");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No redirect URL received");
      }
    } catch (error) {
      console.error("Stripe connection error:", error);
      alert("Failed to initiate Stripe connection. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSaveStripeAccount = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/seller/stripe-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accountId: stripeAccountId }),
      });

      if (!res.ok) {
        throw new Error("Failed to save Stripe account");
      }

      alert("Stripe account ID saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save Stripe account ID");
    } finally {
      setIsSaving(false);
    }
  };

  // added logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">
        📚 Seller Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/seller/add-book")}
          className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition"
        >
          ➕ Add New Book
        </button>

        <button
          onClick={handleStripeConnect}
          disabled={isConnecting}
          className={`bg-blue-600 text-white px-6 py-2 rounded-lg transition ${
            isConnecting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isConnecting ? "Connecting..." : "Connect Stripe Account"}
        </button>

        {/* new Logout button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">💳 Stripe Account Setup</h2>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={stripeAccountId}
            onChange={(e) => setStripeAccountId(e.target.value)}
            placeholder="Enter your Stripe Account ID"
            className="border rounded-lg px-4 py-2 flex-grow"
          />
          <button
            onClick={handleSaveStripeAccount}
            disabled={isSaving || !stripeAccountId}
            className={`bg-green-600 text-white px-6 py-2 rounded-lg transition ${
              isSaving || !stripeAccountId
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save Account ID"}
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="bg-white shadow-md p-4 rounded-xl">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">by {book.author}</p>
              <p className="text-purple-700 font-medium mt-2">
                ₹{book.price}
              </p>
              <p className="text-sm text-gray-500 mt-1">Stock: {book.stock}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No books added yet.</p>
        )}
      </div>
    </main>
  );
}
