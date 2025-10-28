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

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">📚 Seller Dashboard</h1>

      <button
        onClick={() => router.push("/seller/add-book")}
        className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition"
      >
        ➕ Add New Book
      </button>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="bg-white shadow-md p-4 rounded-xl">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">by {book.author}</p>
              <p className="text-purple-700 font-medium mt-2">₹{book.price}</p>
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
