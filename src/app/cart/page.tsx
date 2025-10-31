// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type CartItem = {
//   id: string;
//   title: string;
//   author: string;
//   price: number;
//   sellerName: string;
//   quantity: number;
//   totalPrice: number;
// };

// const CartPage: React.FC = () => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // 🟢 Load cart from localStorage
//   useEffect(() => {
//     const savedCart = localStorage.getItem("cart");
//     if (savedCart) setCartItems(JSON.parse(savedCart));
//   }, []);

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   console.log("🪙 Token fetched from localStorage:", token);

//   // Updated removeFromCart: increment server stock by item's quantity before removing locally
//   const removeFromCart = async (bookId: string) => {
//     const item = cartItems.find((c) => c.id === bookId);
//     if (!item) return;

//     try {
//       // Return exact quantity back to stock
//       const res = await fetch(`/api/books/${bookId}/increment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ amount: item.quantity }), // Return exact quantity
//       });

//       if (!res.ok) throw new Error("Failed to update stock");

//       // Remove from cart only after successful stock update
//       const updatedCart = cartItems.filter((i) => i.id !== bookId);
//       setCartItems(updatedCart);
//       localStorage.setItem("cart", JSON.stringify(updatedCart));
//     } catch (err) {
//       console.error("Failed to remove from cart:", err);
//       alert("Failed to remove item. Please try again.");
//     }
//   };

//   const updateQuantity = async (bookId: string, change: number) => {
//     const item = cartItems.find((c) => c.id === bookId);
//     if (!item) return;

//     const newQuantity = Math.max(1, item.quantity + change);
//     if (newQuantity === item.quantity) return; // No change needed

//     try {
//       // Calculate actual change in quantity
//       const quantityDifference = item.quantity - newQuantity;

//       if (quantityDifference > 0) {
//         // We're decreasing quantity, so increment stock
//         const res = await fetch(`/api/books/${bookId}/increment`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ amount: quantityDifference }),
//         });
//         if (!res.ok) throw new Error("Failed to update stock");
//       }

//       // Update cart
//       const updatedCart = cartItems.map((it) => {
//         if (it.id === bookId) {
//           return {
//             ...it,
//             quantity: newQuantity,
//             totalPrice: newQuantity * it.price,
//           };
//         }
//         return it;
//       });
//       setCartItems(updatedCart);
//       localStorage.setItem("cart", JSON.stringify(updatedCart));
//     } catch (err) {
//       console.error("Update quantity failed:", err);
//       alert(err instanceof Error ? err.message : "Failed to update quantity");
//     }
//   };

//   // 🟠 Proceed to Stripe Checkout (with redirect)
//   const handleCheckout = async () => {
//     if (cartItems.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     setLoading(true);
//     try {
//       // const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
//       const amount = Math.round(Number(totalPrice) * 100);

//       const res = await fetch("/api/payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           amount,
//           currency: "inr",
//           productName:
//             cartItems.length === 1
//               ? cartItems[0].title
//               : `${cartItems.length} books purchase`,
//           bookIds: cartItems.map((item) => item.id), // Add book IDs to request
//         }),
//       });

//       const data = await res.json();
//       console.log("Debug - Payment Response:", data); // Add this debug log

//       if (!res.ok) {
//         throw new Error(data.error || `Payment failed with status: ${res.status}`);
//       }

//       if (data.url) {
//         window.location.href = data.url;
//       } else {
//         throw new Error("Payment URL not received from server");
//       }
//     } catch (error) {
//       console.error("Checkout error:", error);
//       if (error instanceof Error) {
//         alert(error.message);
//       } else {
//         alert("Payment initialization failed. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

//   return (
//     <main className="min-h-screen p-10 bg-gray-100">
//       <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-purple-700">🛒 Your Cart</h1>

//           {/* 🔙 Go Back Button */}
//           <button
//             onClick={() => router.push("/dashboard")}
//             className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition"
//           >
//             ← Go Back
//           </button>
//         </div>

//         {cartItems.length === 0 ? (
//           <p className="text-gray-600 text-center">
//             Your cart is empty.{" "}
//             <button
//               onClick={() => router.push("/dashboard")}
//               className="text-purple-600 underline hover:text-purple-800"
//             >
//               Browse books
//             </button>
//           </p>
//         ) : (
//           <>
//             <ul className="space-y-4">
//               {cartItems.map((book) => (
//                 <li
//                   key={book.id}
//                   className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm"
//                 >
//                   <div>
//                     <h3 className="text-lg font-semibold text-purple-700">
//                       {book.title}
//                     </h3>
//                     <p className="text-sm text-gray-600">{book.author}</p>
//                     <p className="text-sm text-gray-500">
//                       Seller: {book.sellerName}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-medium text-purple-700 mb-2">
//                       ₹{book.totalPrice}
//                     </p>
//                     <div className="flex items-center gap-2 mb-2">
//                       <button
//                         onClick={() => updateQuantity(book.id, -1)}
//                         className="px-2 py-1 bg-gray-200 rounded"
//                       >
//                         -
//                       </button>
//                       <span>{book.quantity}</span>
//                       <button
//                         onClick={() => updateQuantity(book.id, 1)}
//                         className="px-2 py-1 bg-gray-200 rounded"
//                       >
//                         +
//                       </button>
//                     </div>
//                     <button
//                       onClick={() => removeFromCart(book.id)}
//                       className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>

//             <div className="mt-6 flex justify-between items-center">
//               <p className="text-xl font-semibold text-purple-700">
//                 Total: ₹{totalPrice}
//               </p>
//               <button
//                 onClick={handleCheckout}
//                 disabled={loading}
//                 className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition"
//               >
//                 {loading ? "Processing..." : "Proceed to Checkout"}
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </main>
//   );
// };

// export default CartPage;

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  title: string;
  author: string;
  price: number;
  sellerName: string;
  quantity: number;
  totalPrice: number;
  stock?: number; // for checking available stock
};

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // 🟢 Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart) as CartItem[]);
      } catch (err) {
        console.error("Invalid cart data in localStorage:", err);
      }
    }
  }, []);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ❌ No stock changes — only local removal
  const removeFromCart = (bookId: string) => {
    const updatedCart = cartItems.filter((i) => i.id !== bookId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // 🟣 Update quantity — local only, with stock limit check
  const updateQuantity = (bookId: string, change: number) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === bookId) {
        const newQuantity = item.quantity + change;

        // Don't allow 0 or negative quantity
        if (newQuantity < 1) return item;

        // ✅ Prevent exceeding stock (if stock info exists)
        if (item.stock && newQuantity > item.stock) {
          alert(`Only ${item.stock} copies available in stock.`);
          return item;
        }

        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newQuantity * item.price,
        };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // 💳 Checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);
    try {
      const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const amount = Math.round(totalPrice * 100);

      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          amount,
          currency: "inr",
          productName:
            cartItems.length === 1
              ? cartItems[0].title
              : `${cartItems.length} books purchase`,
          bookIds: cartItems.map((item) => item.id),
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error || `Payment failed with status: ${res.status}`);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Payment URL not received from server");
      }
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Payment initialization failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <main className="min-h-screen p-10 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700">🛒 Your Cart</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            ← Go Back
          </button>
        </div>

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
                    {book.stock !== undefined && (
                      <p className="text-xs text-gray-400">
                        Available: {book.stock}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-purple-700 mb-2">
                      ₹{book.totalPrice}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => updateQuantity(book.id, -1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span>{book.quantity}</span>
                      <button
                        onClick={() => updateQuantity(book.id, 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
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
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition"
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default CartPage;
