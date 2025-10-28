"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartBook = {
  id: string;
  title: string;
  author: string;
  price: number;
  sellerName: string;
};

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartBook[]>([]);
  const router = useRouter();

  // 🟢 Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // 🟣 Remove book from cart
  const removeFromCart = (bookId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== bookId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="min-h-screen p-10 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">🛒 Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">
            Your cart is empty.{" "}
            <button
              onClick={() => router.push("/dashboard")}
              className="text-purple-600 underline hover:text-purple-800"
            >
              Browse books
            </button>
          </p>
        ) : (
          <>
            <ul className="space-y-4">
              {cartItems.map((book) => (
                <li
                  key={book.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-purple-700">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <p className="text-sm text-gray-500">
                      Seller: {book.sellerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-purple-700 mb-2">
                      ₹{book.price}
                    </p>
                    <button
                      onClick={() => removeFromCart(book.id)}
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-between items-center">
              <p className="text-xl font-semibold text-purple-700">
                Total: ₹{totalPrice}
              </p>
              <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default CartPage;
