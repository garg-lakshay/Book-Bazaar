// "use client";

// import { useEffect, useState } from "react";

// interface CartItem {
//   id: string;
//   price: number;
//   title?: string;
// }

// export default function SuccessPage() {
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("Processing your order...");

//   useEffect(() => {
//     const saveOrder = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const cartString = localStorage.getItem("cart");
//         const paymentId = localStorage.getItem("lastPaymentId") || "unknown";

//         if (!token || !cartString) {
//           setMessage("No recent purchase found.");
//           setLoading(false);
//           return;
//         }

//         const cart: CartItem[] = JSON.parse(cartString);

//         if (cart.length === 0) {
//           setMessage("Your cart is empty.");
//           setLoading(false);
//           return;
//         }

//         const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

//         const res = await fetch("/api/orders", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             items: cart.map((item) => ({
//               bookId: item.id,
//               price: item.price,
//             })),
//             totalAmount,
//             paymentId,
//           }),
//         });

//         if (res.ok) {
//           localStorage.removeItem("cart");
//           setMessage("✅ Payment successful! Your order has been saved.");
//           // Decrease stock permanently after payment success
// for (const item of cart) {
//   try {
//     await fetch(`/api/books/${item.id}/decrement`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ amount: 1 }), // or item.quantity if you track that
//     });
//   } catch (err) {
//     console.error(`❌ Failed to decrement stock for book ${item.id}:`, err);
//   }
// }

//         } else {
//           const errorData = await res.json();
//           console.error("Order save failed:", errorData);
//           setMessage("⚠️ Payment successful, but order could not be saved.");
//         }
//       } catch (err) {
//         console.error("❌ Error saving order:", err);
//         setMessage("Something went wrong while saving your order.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     saveOrder();
//   }, []);

//   return (
//     <main className="flex flex-col items-center justify-center min-h-screen bg-green-100 text-center px-4">
//       <h1 className="text-4xl font-bold text-green-700 mb-4">
//         ✅ Payment Successful!
//       </h1>
//       <p className="text-gray-700 mb-6 max-w-md">{message}</p>
//       {!loading && (
//         <a
//           href="/dashboard"
//           className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
//         >
//           Back to Dashboard
//         </a>
//       )}
//     </main>
//   );
// }
"use client";

import { useEffect, useState } from "react";

interface CartItem {
  id: string;
  price: number;
  title?: string;
  quantity?: number; // added if your cart tracks quantities
}

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Processing your order...");

  useEffect(() => {
    const saveOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const cartString = localStorage.getItem("cart");
        const paymentId = localStorage.getItem("lastPaymentId") || "unknown";

        if (!token || !cartString) {
          setMessage("No recent purchase found.");
          setLoading(false);
          return;
        }

        const cart: CartItem[] = JSON.parse(cartString);

        if (cart.length === 0) {
          setMessage("Your cart is empty.");
          setLoading(false);
          return;
        }

        const totalAmount = cart.reduce(
          (sum, item) => sum + item.price * (item.quantity ?? 1),
          0
        );

        const res = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              bookId: item.id,
              price: item.price,
              quantity: item.quantity ?? 1,
            })),
            totalAmount,
            paymentId,
          }),
        });

        if (res.ok) {
          localStorage.removeItem("cart");
          setMessage("✅ Payment successful! Your order has been saved.");

          // 🧩 Decrease stock permanently after payment success
          await Promise.all(
            cart.map(async (item) => {
              try {
                await fetch(`/api/books/${item.id}/decrement`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ amount: item.quantity ?? 1 }),
                });
              } catch (err) {
                console.error(
                  `❌ Failed to decrement stock for book ${item.id}:`,
                  err
                );
              }
            })
          );
        } else {
          const errorData: unknown = await res.json();
          console.error("Order save failed:", errorData);
          setMessage("⚠️ Payment successful, but order could not be saved.");
        }
      } catch (err: unknown) {
        console.error("❌ Error saving order:", err);
        setMessage("Something went wrong while saving your order.");
      } finally {
        setLoading(false);
      }
    };

    saveOrder();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-green-100 text-center px-4">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        ✅ Payment Successful!
      </h1>
      <p className="text-gray-700 mb-6 max-w-md">{message}</p>
      {!loading && (
        <a
          href="/dashboard"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Back to Dashboard
        </a>
      )}
    </main>
  );
}
