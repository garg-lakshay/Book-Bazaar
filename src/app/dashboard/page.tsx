// "use client";

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   LayoutDashboard,
//   LogOut,
//   Moon,
//   Sun,
//   Plus,
//   ShoppingCart,
//   Package,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// // 🧩 include stock in Book type
// type Book = {
//   id: string;
//   title: string;
//   author: string;
//   price: number;
//   sellerName: string;
//   stock: number; // <-- added
// };

// type CartItem = Book & {
//   quantity: number;
//   totalPrice: number;
// };

// const DashboardPage: React.FC = () => {
//   const router = useRouter();
//   const [user, setUser] = useState<{ name?: string; role?: string } | null>(
//     null
//   );
//   const [darkMode, setDarkMode] = useState(false);
//   const [books, setBooks] = useState<Book[]>([]);
//   const [newBook, setNewBook] = useState({ title: "", author: "", price: "" });
//   const [loading, setLoading] = useState(false);

//   // Load user & fetch books
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//     fetchBooks();
//   }, []);

//   const fetchBooks = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("/api/books", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setBooks(data.books || []);
//       }
//     } catch (err) {
//       console.error("Error fetching books:", err);
//     }
//   };

//   // Add new book (for seller)
//   const handleAddBook = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("/api/books", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(newBook),
//       });
//       if (res.ok) {
//         setNewBook({ title: "", author: "", price: "" });
//         fetchBooks();
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Modified handleAddToCart: decrement stock on server before updating local cart
//   const handleAddToCart = async (book: Book) => {
//     if (book.stock <= 0) {
//       alert("This book is out of stock!");
//       return;
//     }

//     try {
//       // First try to decrement stock in database
//       const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//       const res = await fetch(`/api/books/${book.id}/decrement`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify({ amount: 1 }),
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.error || "Failed to update stock");
//       }

//       // If stock update succeeds, update cart
//       const cart = JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
//       const existingIndex = cart.findIndex(item => item.id === book.id);

//       if (existingIndex >= 0) {
//         cart[existingIndex].quantity += 1;
//         cart[existingIndex].totalPrice = cart[existingIndex].quantity * book.price;
//       } else {
//         cart.push({ ...book, quantity: 1, totalPrice: book.price });
//       }

//       localStorage.setItem("cart", JSON.stringify(cart));
      
//       // Update local books state to reflect new stock
//       setBooks(books.map(b => 
//         b.id === book.id ? { ...b, stock: b.stock - 1 } : b
//       ));

//       alert(`Added ${book.title} to cart`);
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       alert(err instanceof Error ? err.message : "Failed to add to cart");
//     }
//   };

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

//           <nav className="space-y-3">
//             <SidebarItem
//               icon={<Package className="w-5 h-5" />}
//               text="My Orders"
//               onClick={() => router.push("/my-orders")}
//             />
//             <SidebarItem
//               icon={<ShoppingCart className="w-5 h-5" />}
//               text="Go to Cart"
//               onClick={() => router.push("/cart")}
//             />
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
//         <div className="flex justify-center mb-10">
//           <h1 className="text-4xl font-bold text-purple-600">📚 Book Bazaar</h1>
//         </div>

//         {/* Seller can add new book */}
//         {user?.role === "SELLER" && (
//           <motion.form
//             onSubmit={handleAddBook}
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`mb-8 p-6 rounded-xl shadow-md ${
//               darkMode ? "bg-gray-800" : "bg-white"
//             }`}
//           >
//             <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//               <Plus className="w-5 h-5" /> Add New Book
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <input
//                 type="text"
//                 placeholder="Title"
//                 value={newBook.title}
//                 onChange={(e) =>
//                   setNewBook({ ...newBook, title: e.target.value })
//                 }
//                 required
//                 className="border px-3 py-2 rounded-lg w-full"
//               />
//               <input
//                 type="text"
//                 placeholder="Author"
//                 value={newBook.author}
//                 onChange={(e) =>
//                   setNewBook({ ...newBook, author: e.target.value })
//                 }
//                 required
//                 className="border px-3 py-2 rounded-lg w-full"
//               />
//               <input
//                 type="number"
//                 placeholder="Price"
//                 value={newBook.price}
//                 onChange={(e) =>
//                   setNewBook({ ...newBook, price: e.target.value })
//                 }
//                 required
//                 className="border px-3 py-2 rounded-lg w-full"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
//             >
//               {loading ? "Adding..." : "Add Book"}
//             </button>
//           </motion.form>
//         )}

//         {/* Book List */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className={`p-6 rounded-xl shadow-md ${
//             darkMode ? "bg-gray-800" : "bg-white"
//           }`}
//         >
//           {books.length === 0 ? (
//             <div className="text-center text-gray-500 dark:text-gray-400">
//               No books available.
//             </div>
//           ) : (
//             <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {books.map((book) => (
//                 <li
//                   key={book.id}
//                   className={`p-4 rounded-lg shadow-sm ${
//                     darkMode ? "bg-gray-700" : "bg-gray-50"
//                   }`}
//                 >
//                   <h3 className="text-lg font-semibold">{book.title}</h3>
//                   <p className="text-sm text-gray-500">{book.author}</p>
//                   <p className="text-purple-600 font-medium mt-2">₹{book.price}</p>

//                   {/* show remaining stock */}
//                   <p className={`text-xs mt-1 ${
//                       book.stock > 0 ? "text-gray-400" : "text-red-500 font-semibold"
//                     }`}>
//                     {book.stock > 0 ? `Stock: ${book.stock}` : "Out of stock"}
//                   </p>

//                   <p className="text-xs text-gray-400 mt-1">Seller: {book.sellerName}</p>

//                   <div className="mt-4 flex gap-2">
//                     <button
//                       onClick={() => router.push(`/books/${book.id}`)}
//                       className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition"
//                     >
//                       View Details
//                     </button>

//                     {/* disable Add to Cart when stock is 0 */}
//                     <button
//                       onClick={() => handleAddToCart(book)}
//                       disabled={book.stock <= 0}
//                       className={`flex-1 px-3 py-2 rounded-lg text-white transition ${
//                         book.stock > 0 ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
//                       }`}
//                     >
//                       {book.stock > 0 ? "Add to Cart" : "Out of stock"}
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </motion.div>
//       </section>
//     </main>
//   );
// };

// export default DashboardPage;

// /* ✅ Sidebar Item Component */
// const SidebarItem = ({
//   icon,
//   text,
//   onClick,
// }: {
//   icon: React.ReactNode;
//   text: string;
//   onClick?: () => void;
// }) => (
//   <button
//     onClick={onClick}
//     className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-700 transition"
//   >
//     {icon}
//     <span>{text}</span>
//   </button>
// );
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  Plus,
  ShoppingCart,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";

// 🧩 include stock in Book type
type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  sellerName: string;
  stock: number; // for available stock display & limit check
};

type CartItem = Book & {
  quantity: number;
  totalPrice: number;
};

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(
    null
  );
  const [darkMode, setDarkMode] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);

  // Load user & fetch books
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  // Add new book (for seller)
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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add to Cart (No Stock Decrement — Local Cart Only)
  const handleAddToCart = (book: Book) => {
    if (book.stock <= 0) {
      alert("This book is out of stock!");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
    const existingIndex = cart.findIndex((item) => item.id === book.id);

    if (existingIndex >= 0) {
      const existingItem = cart[existingIndex];
      const newQuantity = existingItem.quantity + 1;

      // Prevent exceeding stock
      if (newQuantity > book.stock) {
        alert(`Only ${book.stock} copies available in stock.`);
        return;
      }

      cart[existingIndex].quantity = newQuantity;
      cart[existingIndex].totalPrice = newQuantity * book.price;
    } else {
      cart.push({ ...book, quantity: 1, totalPrice: book.price });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Added ${book.title} to cart`);
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

          <nav className="space-y-3">
            <SidebarItem
              icon={<Package className="w-5 h-5" />}
              text="My Orders"
              onClick={() => router.push("/my-orders")}
            />
            <SidebarItem
              icon={<ShoppingCart className="w-5 h-5" />}
              text="Go to Cart"
              onClick={() => router.push("/cart")}
            />
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

                  {/* show remaining stock */}
                  <p
                    className={`text-xs mt-1 ${
                      book.stock > 0
                        ? "text-gray-400"
                        : "text-red-500 font-semibold"
                    }`}
                  >
                    {book.stock > 0
                      ? `Stock: ${book.stock}`
                      : "Out of stock"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Seller: {book.sellerName}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => router.push(`/books/${book.id}`)}
                      className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => handleAddToCart(book)}
                      disabled={book.stock <= 0}
                      className={`flex-1 px-3 py-2 rounded-lg text-white transition ${
                        book.stock > 0
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {book.stock > 0 ? "Add to Cart" : "Out of stock"}
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

/* ✅ Sidebar Item Component */
const SidebarItem = ({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-700 transition"
  >
    {icon}
    <span>{text}</span>
  </button>
);
