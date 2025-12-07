# BookBazaar - Project Summary

## Project Overview


BookBazaar is a full-stack e-commerce marketplace platform designed for buying and selling books online. It provides a comprehensive solution where users can browse books, manage their shopping cart, complete purchases, and sellers can list their books and receive payments through Stripe integration. The platform supports multiple user roles with distinct permissions and capabilities.

## Key Features

### User Authentication & Authorization
- Secure user registration and login system with JWT-based authentication
- Role-based access control supporting three distinct user types: Users (buyers), Sellers, and Owners
- Password encryption using bcryptjs for secure storage
- Token-based session management stored in browser localStorage
- Automatic role-based routing after login

### Book Management
- Browse all available books from multiple sellers
- Search functionality to find books by title
- Detailed book pages showing title, author, description, price, and stock availability
- View seller information for each book listing
- Stock tracking system to prevent overselling
- Book reservation mechanism to handle pending orders

### Shopping Cart System
- Add multiple books to cart with quantity selection
- Local storage-based cart persistence across sessions
- Real-time stock validation when adding items
- Quantity adjustment with stock limit enforcement
- Cart summary with total price calculation
- Remove items from cart functionality

### Order Management
- Complete order placement workflow
- Multi-book order support (shopping cart checkout)
- Order history viewing for buyers
- Order status tracking (pending, paid)
- Order details including books, quantities, and prices
- Timestamp tracking for order creation

### Payment Processing
- Stripe Checkout integration for secure payment processing
- Support for Indian Rupee (INR) currency
- Secure payment session creation
- Webhook handling for payment status updates
- Automatic order status update upon successful payment
- Success and cancellation pages for payment flow

### Seller Features
- Dedicated seller dashboard
- Add new books with title, author, description, price, and stock
- Manage listed books inventory
- View all books listed by the seller
- Stripe Connect integration for receiving payments
- Stripe account onboarding process
- Transaction logging for financial tracking

### User Interface
- Modern, responsive design with Tailwind CSS
- Dark mode toggle functionality
- Smooth animations using Framer Motion
- Intuitive navigation with sidebar menus
- Mobile-friendly responsive layouts
- Beautiful gradient backgrounds and card-based designs

## Technology Stack

### Frontend
- **Next.js 15.5.6** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12.23.24** - Animation library
- **Lucide React** - Icon library
- **Stripe React & Stripe.js** - Payment processing frontend libraries

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma 6.18.0** - Database ORM
- **PostgreSQL** - Relational database
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **Stripe** - Payment processing backend
- **Nodemailer** - Email functionality (available)

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Prisma Migrations** - Database schema management

## Database Architecture

The application uses PostgreSQL with Prisma ORM and includes the following data models:

### Core Models

**User Model**
- Stores user accounts with authentication credentials
- Supports multiple roles: USER, SELLER, OWNER
- Includes address information (street, city, state, zipCode, country)
- Email verification status tracking
- Relationships to books, orders, cart items, and Stripe accounts

**Book Model**
- Comprehensive book information (title, author, description, price)
- Stock management with initial stock and reserved quantity tracking
- Seller and owner associations
- Multiple relationship support for orders and cart items

**CartItem Model**
- User shopping cart persistence
- Quantity tracking per item
- Unique constraint on user-book combination
- Timestamp for when items were added

**Order Model**
- Complete order information with buyer and seller associations
- Support for single-book and multi-book orders (legacy and new system)
- Payment tracking with Stripe payment IDs
- Order status management
- Total amount calculation

**OrderItem Model**
- Individual items within multi-book orders
- Quantity and price per item
- Links orders to specific books

**TransactionLog Model**
- Financial transaction records
- Seller payment tracking with amounts and fees
- Timestamp for transaction history

**StripeAccount Model**
- Seller Stripe Connect account information
- Account verification status
- Onboarding completion tracking

**VerificationToken Model**
- Email verification token storage
- Expiration tracking for security

## User Roles & Permissions

### User (Buyer)
- Browse all available books
- Add books to shopping cart
- Complete purchases
- View order history
- Access dashboard with book listings
- Search functionality

### Seller
- All User capabilities
- Add new books to marketplace
- Manage book inventory and stock
- View seller dashboard
- Connect Stripe account for payments
- Receive payments through Stripe Connect
- View all listed books
- Transaction history access

### Owner
- All Seller capabilities
- Administrative privileges
- System-wide oversight (single owner account restriction)

## Core Functionality Flow

### User Registration Flow
1. User provides name, email, password, and optional role
2. System validates email uniqueness
3. Password is hashed using bcrypt
4. User account created in database
5. Role restrictions enforced (single OWNER allowed)

### User Login Flow
1. User provides email and password
2. System validates credentials
3. JWT token generated with user information
4. Token stored in localStorage
5. User role stored for access control
6. Automatic redirect to role-appropriate dashboard

### Book Browsing Flow
1. User accesses dashboard or home page
2. System fetches all available books from database
3. Books displayed in grid layout with search functionality
4. User can filter books by title
5. Stock status shown for each book
6. User can view details or add to cart

### Shopping Cart Flow
1. User adds books to cart (stored in localStorage)
2. Cart items persist across sessions
3. Stock validation prevents exceeding available quantity
4. User can adjust quantities or remove items
5. Cart summary shows total price
6. User proceeds to checkout

### Payment Flow
1. User initiates checkout from cart
2. System calculates total amount
3. Stripe Checkout session created
4. User redirected to Stripe payment page
5. Payment processed securely
6. Webhook updates order status upon success
7. User redirected to success or cancellation page
8. Stock updated and orders created in database

### Seller Book Listing Flow
1. Seller accesses seller dashboard
2. Seller fills book details form
3. System creates book entry with seller association
4. Book appears in marketplace listings
5. Seller can manage inventory and view all listed books

### Stripe Connect Flow
1. Seller initiates Stripe Connect
2. System creates Stripe Express account
3. Account information saved in database
4. Seller redirected to Stripe onboarding
5. Account verification status tracked
6. Seller can receive payments after verification

## Project Structure

### API Routes
- Authentication endpoints (login, register)
- Book management (list, view, create, update stock)
- Cart operations (add, remove, summary)
- Order management (create, view history)
- Payment processing (Stripe Checkout, webhooks)
- Seller-specific endpoints (add book, manage books, Stripe Connect)
- Stripe integration (Connect, webhooks)

### Frontend Pages
- Home page with book listings
- Login and registration pages
- Dashboard with book browsing and search
- Book detail pages
- Shopping cart page
- Checkout page
- Order history page
- Seller dashboard
- Success and cancellation pages
- Book addition page for sellers

### Library Modules
- Authentication middleware for route protection
- Prisma client for database operations
- Stripe configuration and utilities
- Type definitions for TypeScript

### Database Migrations
- Initial schema creation
- Order items support for multi-book orders
- Reserved field addition for stock management
- Optional seller and book fields for flexible order management

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- API route protection with authentication middleware
- Secure payment processing through Stripe
- Webhook signature verification
- Environment variable protection for sensitive data

## Payment Integration

The platform integrates with Stripe for comprehensive payment processing:

- **Stripe Checkout** for customer payments
- **Stripe Connect** for seller payment receiving
- **Webhook handling** for real-time payment status updates
- **Transaction logging** for financial records
- **Multi-seller support** with individual Stripe accounts
- **Secure payment sessions** with proper redirect URLs

## User Experience Features

- Responsive design for all device sizes
- Dark mode support for comfortable viewing
- Smooth animations and transitions
- Intuitive navigation with clear visual hierarchy
- Real-time stock availability display
- Clear error messages and user feedback
- Loading states for async operations
- Local storage for cart persistence

## Current Capabilities

- Complete user authentication and authorization
- Multi-role user management
- Full book marketplace functionality
- Shopping cart with persistent storage
- Secure payment processing
- Order management and tracking
- Seller dashboard and inventory management
- Stripe Connect integration for sellers
- Search and filtering capabilities
- Stock management system
- Responsive user interface

## Development Environment

- Node.js-based development
- TypeScript for type safety
- Hot reload during development
- Prisma migrations for database changes
- Environment variable configuration
- ESLint for code quality

## Deployment Considerations

The application is built with Next.js and can be deployed on:
- Vercel (recommended for Next.js)
- Any Node.js hosting platform
- Requires PostgreSQL database
- Requires Stripe account with API keys
- Environment variables for secrets configuration


