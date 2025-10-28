"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  sellerName: string;
};

const BookDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        const bookId = Array.isArray(params.id) ? params.id[0] : params.id;

        if (!bookId) return;

        const res = await fetch(`/api/books/${bookId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch book:", res.status);
          return;
        }

        const data = await res.json();
        setBook(data.book);
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params.id]);

  if (loading)
    return <p className="p-10 text-center text-gray-600">Loading book details...</p>;
  if (!book)
    return <p className="p-10 text-center text-red-600">Book not found.</p>;

  return (
    <main className="min-h-screen p-10 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">{book.title}</h1>
        <p className="text-lg text-gray-700 mb-2">
          <strong>Author:</strong> {book.author}
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <strong>Price:</strong> ₹{book.price}
        </p>
        <p className="text-lg text-gray-700 mb-6">
          <strong>Seller:</strong> {book.sellerName}
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/cart")}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Go to Cart
          </button>

          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
};

export default BookDetailsPage;
