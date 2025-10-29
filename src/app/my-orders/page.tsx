"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  book: {
    title: string;
    author: string;
    price: number;
  };
  createdAt: string;
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) return <div className="p-10 text-center">Loading your orders...</div>;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
        📦 My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <li key={order.id} className="p-4 bg-white rounded-xl shadow-md">
              <h2 className="text-lg font-semibold">{order.book.title}</h2>
              <p className="text-gray-600">{order.book.author}</p>
              <p className="font-bold text-purple-600 mt-2">
                ₹{order.book.price}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Purchased on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="text-center mt-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}
