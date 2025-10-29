export default function CancelPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <h1 className="text-4xl font-bold text-red-700 mb-4">❌ Payment Cancelled</h1>
      <p className="text-gray-700 mb-6">
        Your payment was not completed. You can try again or return to your cart.
      </p>
      <a
        href="/cart"
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Back to Cart
      </a>
    </main>
  );
}
