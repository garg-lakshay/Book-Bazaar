"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  console.log("🪙 Token fetched from localStorage:", token);

  if (!token) {
    alert("Please log in to make a purchase.");
    return;
  }
  console.log("Passed bookId to API:", params.id);  
  

  fetch("/api/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // ✅ send token properly
    },
    body: JSON.stringify({ bookId: params.id }),
  })
    .then(async (res) => {
      const data = await res.json();
      console.log("💳 Payment API response:", data);
      if (data?.clientSecret) setClientSecret(data.clientSecret);
      else alert(data.error || "Failed to start payment.");
    })
    .catch((err) => {
      console.error("❌ Payment request failed:", err);
    });
}, [params.id]);


  const options = { clientSecret };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      ) : (
        <p className="text-gray-600">Preparing payment...</p>
      )}
    </div>
  );
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: "http://localhost:3000/success" },
    });
    setLoading(false);

    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6 w-[400px]"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Complete Payment</h2>
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
