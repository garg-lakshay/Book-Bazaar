// "use client";

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { LayoutDashboard, BookOpen, Users, LogOut, Moon, Sun } from "lucide-react";
// import { useRouter } from "next/navigation";

// const DashboardPage: React.FC = () => {
//   const router = useRouter();
//   const [user, setUser] = useState<{ name?: string } | null>(null);
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     router.push("/login");
//   };

//   return (
//     <main
//       className={`min-h-screen flex ${
//         darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
//       }`}
//     >
//       {/* Sidebar */}
//       <aside
//         className={`w-64 p-6 flex flex-col justify-between border-r ${
//           darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
//         }`}
//       >
//         <div>
//           <h2 className="text-2xl font-bold mb-8 text-purple-600 flex items-center gap-2">
//             <LayoutDashboard className="w-6 h-6" /> Dashboard
//           </h2>

//           <nav className="space-y-4">
//             <SidebarItem icon={<BookOpen />} text="Books" />
//             <SidebarItem icon={<Users />} text="Users" />
//           </nav>
//         </div>

//         <div className="space-y-3">
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="flex items-center gap-2 w-full px-4 py-2 rounded-lg transition hover:bg-purple-100 dark:hover:bg-gray-700"
//           >
//             {darkMode ? <Sun /> : <Moon />}
//             <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
//           </button>

//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
//           >
//             <LogOut className="w-5 h-5" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <section className="flex-1 p-8">
//         {/* Center Title */}
//         <div className="flex justify-center mb-10">
//           <h1 className="text-4xl font-bold text-purple-600">📚 Book Bazaar</h1>
//         </div>

//         {/* Placeholder for dynamic book list */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className={`p-6 rounded-xl shadow-md ${
//             darkMode ? "bg-gray-800" : "bg-white"
//           }`}
//         >
//           <div className="text-center text-gray-500 dark:text-gray-400">
//             No books available yet.
//           </div>
//         </motion.div>
//       </section>
//     </main>
//   );
// };

// export default DashboardPage;

// /* ========== Reusable Components ========== */
// const SidebarItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
//   <button className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-700 transition">
//     {icon}
//     <span>{text}</span>
//   </button>
// );
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  Moon,
  Sun,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  sellerName: string;
};

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(
    null
  );
  const [darkMode, setDarkMode] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", price: "" });
  const [loading, setLoading] = useState(false);

  // 🟢 Load user & fetch books
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchBooks();
  }, []);

  // 🟣 Fetch all books
  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      } else {
        console.warn("Failed to load books");
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  // 🟠 Add new book (for seller)
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBook),
      });
      if (res.ok) {
        setNewBook({ title: "", author: "", price: "" });
        fetchBooks();
      } else {
        console.error("Failed to add book");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🛒 Add to cart
  const handleAddToCart = (book: Book) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: Book) => item.id === book.id);

    if (existing) {
      alert("⚠️ Book already in cart!");
      return;
    }

    cart.push(book);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`✅ ${book.title} added to cart!`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <main
      className={`min-h-screen flex ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`w-64 p-6 flex flex-col justify-between border-r ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}
      >
        <div>
          <h2 className="text-2xl font-bold mb-8 text-purple-600 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" /> Dashboard
          </h2>

          <nav className="space-y-4">
            <SidebarItem icon={<BookOpen />} text="Books" />
            <SidebarItem icon={<Users />} text="Users" />
            <button
              onClick={() => router.push("/cart")}
              className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-700 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Go to Cart</span>
            </button>
          </nav>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg transition hover:bg-purple-100 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun /> : <Moon />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8">
        <div className="flex justify-center mb-10">
          <h1 className="text-4xl font-bold text-purple-600">📚 Book Bazaar</h1>
        </div>

        {/* Seller can add new book */}
        {user?.role === "SELLER" && (
          <motion.form
            onSubmit={handleAddBook}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-6 rounded-xl shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Add New Book
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                required
                className="border px-3 py-2 rounded-lg w-full"
              />
              <input
                type="text"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                required
                className="border px-3 py-2 rounded-lg w-full"
              />
              <input
                type="number"
                placeholder="Price"
                value={newBook.price}
                onChange={(e) =>
                  setNewBook({ ...newBook, price: e.target.value })
                }
                required
                className="border px-3 py-2 rounded-lg w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {loading ? "Adding..." : "Add Book"}
            </button>
          </motion.form>
        )}

        {/* Book List */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {books.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No books available.
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {books.map((book) => (
                <li
                  key={book.id}
                  className={`p-4 rounded-lg shadow-sm ${
                    darkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p className="text-sm text-gray-500">{book.author}</p>
                  <p className="text-purple-600 font-medium mt-2">
                    ₹{book.price}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Seller: {book.sellerName}
                  </p>

                  {/* 👇 Added buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => router.push(`/books/${book.id}`)}
                      className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleAddToCart(book)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </section>
    </main>
  );
};

export default DashboardPage;

/* Sidebar Item Component */
const SidebarItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <button className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-700 transition">
    {icon}
    <span>{text}</span>
  </button>
);
