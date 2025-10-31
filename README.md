📚 **BookBazaar**

BookBazaar is a full-stack e-commerce marketplace for buying and selling books online. It offers secure authentication, role-based access, shopping cart management, order tracking, and integrated payments through Stripe.

---

### 🚀 Features

**Authentication & Authorization**

- JWT-based login & registration
- Role-based access (User, Seller, Owner)
- Password hashing with bcrypt
- Token persistence via localStorage

**Book Management**

- Browse, search, and view book details
- Stock & reservation system
- Seller association per book

**Shopping Cart**

- Add multiple books with quantity control
- Local storage persistence
- Real-time stock validation
- Update or remove items

**Orders**

- Multi-book order support
- Order history & tracking
- Stripe payment ID linkage
- Status updates on successful payment

**Payments (Stripe)**

- Stripe Checkout integration (INR)
- Stripe Connect for seller payouts
- Webhook for real-time payment updates
- Secure session handling

**Seller Dashboard**

- Add & manage book listings
- View transaction history
- Stripe onboarding & account management

**UI/UX**

- Built with Next.js + Tailwind CSS
- Responsive & modern design
- Dark mode toggle
- Smooth animations via Framer Motion

---

### 🧱 Tech Stack

**Frontend:**
Next.js 15, React 19, TypeScript 5, Tailwind CSS 4, Framer Motion, Lucide Icons, Stripe.js / React-Stripe

**Backend:**
Next.js API Routes, Prisma ORM (PostgreSQL), JWT & bcryptjs, Stripe (Checkout + Connect), Nodemailer (optional)

---

### 🗄️ Database Models

- User – Authentication, roles, address, Stripe link
- Book – Title, author, price, stock, seller
- CartItem – User-book quantity tracking
- Order / OrderItem – Buyer, seller, books, total, payment
- TransactionLog – Seller transactions
- StripeAccount – Seller payout management
- VerificationToken – Email verification

---

### 👥 Roles & Permissions

**User:** Browse, buy, view orders
**Seller:** Add/manage books, receive payments
**Owner:** All permissions (admin control)

---

### 🔁 Core Flows

1. User Registration/Login → JWT token generated
2. Book Browsing → Search, view details
3. Cart Management → Add/update/remove items
4. Checkout & Payment → Stripe Checkout → Webhook update
5. Seller Listing → Add/manage books via dashboard

---

### 🔒 Security

- Password hashing with bcrypt
- JWT-based session management
- Role-based route protection
- Secure Stripe webhooks

---

### 🌍 Deployment

- Vercel (recommended for Next.js)
- PostgreSQL database required
- Stripe API keys setup in environment variables

---

👨‍💻 **Author:**
Lakshay Garg
Full Stack Developer
