// " use client";

// import { useEffect, useState} from "react";
// import Link from "next/link"; 
// import Image from "next/image";

// export default function HomePage(){
//     const [books,setBooks] = useState<any[]>([]);


//     useEffect(()=>{
//       const fetchbooks = async()=>{
//         try{
//         const res = await fetch("/api/books");
//         const data = await res.json();
//         setBooks(data.books);
//       }
//       catch(error){
//         console.error("Error fetching books:",error);
//       }
//     };
//     fetchbooks();
//   },[]);
//   return(

//   )

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description?: string;
  seller?: {
    name: string;
    email: string;
  };
  image?: string;
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        const data: Book[] = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    fetchBooks();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col items-center">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-10 py-6 bg-white shadow-sm sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-purple-700 tracking-wide">
          BookBazaar
        </h1>
        <div className="flex space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 text-purple-700 border border-purple-700 rounded-lg hover:bg-purple-700 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center mt-20">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4">
          Discover Your Next Favorite Book 📚
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Browse a variety of books listed by sellers. Buy, sell, and explore a
          world full of stories — all in one place.
        </p>
      </section>

      {/* Book Listings */}
      <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-10 w-full max-w-7xl">
        {books.length > 0 ? (
          books.map((book: Book) => (
            <div
              key={book.id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <Image
                src={book.image || "/book-placeholder.jpg"}
                alt={book.title}
                width={300}
                height={200}
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{book.title}</h3>
                <p className="text-gray-500">by {book.author}</p>
                <p className="text-purple-700 font-bold mt-2">₹{book.price}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Seller: {book.seller?.name || "Unknown"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No books available yet.
          </p>
        )}
      </section>
    </main>
  );
}
