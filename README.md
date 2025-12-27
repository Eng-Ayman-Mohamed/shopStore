# ShopStore – Full Stack E-commerce Platform

A modern, responsive e-commerce application with a **React frontend**, **Express.js backend**, and **MongoDB** integration. ShopStore offers a complete shopping experience with user management, product management, order processing, discounts, premium products, and an admin dashboard.

---

## 🚀 Features

### Frontend

- **Responsive & Modern UI**: Built with React 18, Framer Motion animations, and a mobile-first design.
- **Authentication**: User registration, login, and profile management with secure sessions.
- **Product Browsing**: Search, filter, and view products; supports categories and pagination.
- **Shopping Cart & Wishlist**: Add/remove items, manage quantities, save favorites, and complete payments.
- **Payment System**: Cash balance management, payment processing, success confirmation modal, and order history.
- **Admin Dashboard**: Full admin panel for analytics, product CRUD, discount management, and user role assignment.
- **Profile Management**: Avatar selection (image upload, colors, emojis) and enhanced profile customization.
- **Theme Support**: Light/dark mode toggle.
- **Real-time Feedback**: Toast notifications for user actions.
- **Category Filtering**: Multi-category system (Electronics, Fashion, Home & Garden, Sports, Books, Beauty, Toys).
- **Premium & Discount Products**: Highlighted products with visual badges, dynamic pricing, and priority listing.
- **Enhanced Home Page**: Trending products, premium items, deals of the day, and user statistics.

### Backend

- **RESTful API** with Express.js
- **MongoDB Integration** with Mongoose ODM
- **User & Product Management**: CRUD operations with advanced filtering
- **Admin Analytics**: Performance metrics, top-rated products, and category-based statistics
- **Image Upload**: Cloudinary support for avatars and product images
- **Data Validation & Error Handling**: Input sanitization, robust error logging, and health check endpoints
- **CORS Support**: Cross-origin configuration

---

## 🛠 Tech Stack

**Frontend**: React 18, React Router, Framer Motion, Cloudinary, bcryptjs  
**Backend**: Node.js, Express.js, MongoDB, Mongoose, CORS, Morgan, dotenv

---

## 📁 Project Structure

```

shopStore/
├── ShopStore-frontend/ # React frontend
│ ├── public/ # Static assets
│ └── src/
│ ├── components/ # UI components (AdminDashboard, EditProfile, Profile, etc.)
│ ├── pages/ # Route pages (AdminDashboard, Cart, Orders, EditProfile)
│ ├── hooks/ # Custom hooks
│ ├── context/ # React context
│ ├── services/ # API calls
│ └── utils/ # Helper functions
└── shopStore-backend/ # Express.js backend
├── api/ # API entry point
└── src/
├── controllers/ # Business logic
├── models/ # MongoDB schemas
├── routers/ # API routes
├── config/ # Config files
└── utils/ # Utilities

```

---

## 🚦 Getting Started

### Prerequisites

- Node.js v14+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd shopStore-backend
npm install
# Create .env with MongoDB URI and PORT
npm run dev
```

### Frontend Setup

```bash
cd ShopStore-frontend
npm install
npm start
```

### Environment Variables (`.env`)

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

---

## 📄 API Endpoints

**Health Check**

- `GET /api/health` – Service status

**Authentication**

- `POST /api/users/register` – Register
- `POST /api/users/login` – Login

**User Management**

- `GET /api/users/me/:id` – Get user info
- `PUT /api/users/me/:id` – Update profile
- `GET /api/users` – List users (admin)
- `GET /api/users/users-analysis` – Analytics (admin)
- `DELETE /api/users/:id` – Delete user (admin)

**Cart & Wishlist**

- `GET/POST/DELETE /api/users/cart/:id` – Cart operations
- `GET/POST/DELETE /api/users/wishlist/:id` – Wishlist operations

**Products**

- `GET /api/products` – List/filter products
- `GET /api/products/:id` – Product details
- `POST/PUT/DELETE /api/products/:id` – Product CRUD (admin)
- `GET /api/products/top-rating` – Top-rated premium products
- `GET /api/products?sortBy=-discount` – Deals of the Day

**Payments**

- `POST /api/users/me/:id/completePayment` – Complete payment
- `GET /api/users/me/:id/purchases` – Purchase history

**Image Upload**

- `POST /api/upload` – Upload images (Cloudinary)

---

## 🎨 Key Components

**Frontend Components**: NavBar, ProductCard, FilterPanel, Cart, Wishlist, Toast, PaymentSuccessModal
**Home Page Components**: HeroSection, CategoryShowcase, TrendingSection, PremiumProducts, DealsSection, UserStats
**Admin Components**: AdminDashboard, AdminTabNavigation, AnalyticsSection, AddProductForm, ProductsListSection, UsersListSection, ProductCardAdmin
**Profile Components**: Profile, EditProfile, AvatarSelector, ProfileHeader, InfoSection

---

## 🔐 Authentication

- Secure registration and login
- Protected routes
- Session persistence via localStorage
- Profile management

---

## 💳 Payment System

- **Cash balance** management
- **Complete payment flow** with validation
- Animated **Payment Success Modal**
- **Order history** tracking
- Real-time **balance updates**
- Integrated with cart and discounts

---

## 🏷 Discounts & Premium Products

**Discounts**

- Real-time percentage-based pricing
- Animated discount badges
- Admin-controlled discount management
- "Deals of the Day" highlighting

**Premium Products**

- Star badges and priority listing
- Enhanced visual styling
- Analytics tracking in admin dashboard

---

## 📂 Categories & Filtering

- **Categories**: Electronics, Fashion, Home & Garden, Sports, Books, Beauty, Toys
- URL-based and multi-filtering support
- Combined filters: category + price + rating + discount
- Real-time filtering with responsive design

---

## 📱 Responsive Design

- Optimized for desktops, tablets, and mobile devices
- Mobile-friendly tables with **intelligent column hiding**
- Touch-optimized interactions
- Horizontal scrolling support and adaptive typography

---

## 🎯 Future Enhancements

- Advanced search and filtering
- Product reviews and ratings
- Enhanced admin dashboard
- Email notifications
- Multi-language support

---

## 👨‍💻 Development Approach

- **Frontend**: Developed with AI assistance (GitHub Copilot & BlackBoxAI) for UI/UX, component design, and state management.
- **Backend**: Independently implemented with full control over server architecture, MongoDB integration, API routes, validation, and error handling.

---

## 📄 License

This project is a demonstration of full-stack development capabilities, combining **AI-assisted frontend development** with **independent backend engineering**.
