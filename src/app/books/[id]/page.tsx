"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  sellerName: string;
};

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setBook(data.book);
      } else {
        console.error("Failed to fetch book");
      }
      setLoading(false);
    };
    if (id) fetchBook();
  }, [id]);

  const handleBuy = async () => {
    try {
      // const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
      // const amount = Math.round(Number(totalPrice) * 100);
      const price = Math.round(Number(book?.price) * 100);


      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: book?.title, amount: price }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert("Failed to start checkout");
      }
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <main className="min-h-screen p-10 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">{book.title}</h1>
        <p className="text-lg text-gray-700 mb-2"><strong>Author:</strong> {book.author}</p>
        <p className="text-lg text-gray-700 mb-2"><strong>Price:</strong> ₹{book.price}</p>
        <p className="text-lg text-gray-700 mb-6"><strong>Seller:</strong> {book.sellerName}</p>

        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Go Back
          </button>

          <button
            onClick={handleBuy}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Buy Now 💳
          </button>
        </div>
      </div>
    </main>
  );
}
