# ShopStore - Full Stack E-commerce Application

A modern, responsive e-commerce platform built with React frontend and Express.js backend with MongoDB integration.

## 🚀 Features

### Frontend Features

- **Modern UI/UX**: Built with React and Framer Motion animations
- **Responsive Design**: Mobile-first approach with CSS Grid and Flex box
- **Authentication System**: User registration, sign-in, and profile management
- **Product Management**: Browse products, view details, add to cart/wishlist
- **Shopping Cart**: Add/remove items, quantity management
- **Wishlist**: Save favorite products for later
- **Order Management**: Track and manage user orders with local storage
- **Admin Dashboard**: Complete admin panel with analytics, product management, and CRUD operations
- **Enhanced Profile Editing**: Advanced profile customization with avatar selection (image upload, colors, emojis)
- **Image Upload**: Cloudinary integration for avatar and image uploads
- **Theme Support**: Light/dark theme toggle capability
- **Real-time Notifications**: Toast notifications for user actions
- **Filter & Search**: Product filtering and search functionality
- **Pagination**: Efficient product browsing with pagination
- **Admin Analytics**: Product statistics, top-rated products, and performance metrics

### Backend Features

- **RESTful API**: Clean API architecture with Express.js
- **MongoDB Integration**: Robust database with Mongoose ODM
- **User Management**: Authentication and user profile operations
- **Product Management**: CRUD operations for products
- **Admin Analytics**: Product statistics and performance metrics aggregation
- **Advanced Filtering**: Price range, rating, and premium product filtering
- **Health Monitoring**: API health check endpoints
- **CORS Support**: Cross-origin resource sharing configuration
- **Error Handling**: Comprehensive error handling and logging
- **Data Validation**: Input validation and sanitization
- **Image Upload Support**: Backend support for image upload operations

## 🛠 Tech Stack

### Frontend

- **React 18**: Modern React with hooks and context
- **React Router**: Client-side routing
- **Framer Motion**: Smooth animations and transitions
- **React Scripts**: Build tooling and development server
- **Cloudinary**: Image upload and management for avatars
- **bcryptjs**: Client-side password hashing utilities

### Backend

- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logger
- **Dotenv**: Environment variable management

## 📁 Project Structure

```
shopStore/
├── ShopStore-frontend/           # React frontend application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── AdminDashboard/  # Admin panel components
│   │   │   ├── EditProfile/     # Enhanced profile editing components
│   │   │   └── profile/         # Profile display components
│   │   ├── pages/               # Application pages/routes
│   │   │   ├── AdminDashboard.jsx    # Admin dashboard page
│   │   │   ├── EditProfile.jsx       # Enhanced profile editing
│   │   │   ├── Orders.jsx            # Order management
│   │   │   └── CartNew.jsx           # Enhanced cart functionality
│   │   ├── hooks/               # Custom React hooks
│   │   ├── context/             # React context providers
│   │   ├── services/            # API service functions
│   │   └── utils/               # Utility functions
│   └── package.json
└── shopStore-backend/            # Express.js backend API
    ├── api/                     # API entry point
    ├── src/
    │   ├── controllers/         # Route controllers
    │   ├── models/              # Database models
    │   ├── routers/             # API routes
    │   ├── config/              # Configuration files
    │   └── utils/               # Utility functions
    └── package.json
```

## 🏗 Implementation Details

### Frontend Development

The frontend was developed with significant assistance from **GitHub Copilot** and **BlackBoxAI**. These AI tools provided substantial support in:

- Component architecture and React patterns
- UI/UX design implementation
- State management with hooks and context
- API integration and data flow
- Responsive design and styling
- Animation and interaction design
- **Admin Dashboard Development**: Complete admin panel with analytics and product management
- **Enhanced Profile System**: Multi-avatar selection and advanced profile editing
- **Image Upload Integration**: Cloudinary integration for seamless image handling

### Backend Development

The entire backend implementation, including MongoDB integration and all server-side functionality, was developed **independently without any AI assistance**. This includes:

- Complete Express.js server architecture
- MongoDB database design and integration
- Mongoose models and schemas
- API route implementations
- Middleware configuration
- Error handling and validation
- Database connection management

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

```bash
cd shopStore-backend
npm install
# Create .env file with your MongoDB connection string
npm run dev
```

### Frontend Setup

```bash
cd ShopStore-frontend
npm install
npm start
```

### Environment Variables

Create a `.env` file in the backend directory:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

## 📊 API Endpoints

### Health Check

- `GET /api/health` - Service health status

### Authentication

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication

### User Management

- `GET /api/users/me/:id` - Get user data
- `PUT /api/users/me/:id` - Update user data

### Shopping Cart

- `GET /api/users/cart/:id` - Get user's shopping cart
- `POST /api/users/cart/:id` - Add item to cart
- `DELETE /api/users/cart/:id/:productId` - Remove item from cart

### Wishlist

- `GET /api/users/wishlist/:id` - Get user's wishlist
- `POST /api/users/wishlist/:id` - Add item to wishlist
- `DELETE /api/users/wishlist/:id/:productId` - Remove item from wishlist

### Products

- `GET /api/products` - List all products with filtering and pagination
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `GET /api/products/top-rating` - Get top-rated premium products
- `GET /api/products/products-details` - Get analytics and statistics

### Image Upload

- `POST /api/upload` - Upload images (Cloudinary integration)

## 🎨 Key Components

### Frontend Components

- **NavBar**: Navigation with user status and cart count
- **ProductCard**: Individual product display
- **FilterPanel**: Product filtering interface
- **Cart**: Shopping cart management
- **Wishlist**: Saved products management
- **Toast**: Notification system

#### Admin Components

- **AdminDashboard**: Main admin interface with tab navigation
- **AdminHeader**: Admin panel header with branding
- **AdminTabNavigation**: Tab switching between analytics, products, and add product
- **AnalyticsSection**: Product statistics and performance metrics display
- **AddProductForm**: Form for creating new products with validation
- **ProductsListSection**: Paginated product management with search and delete
- **ProductCardAdmin**: Admin-specific product display with delete functionality

#### Profile Components

- **Profile**: User profile display with avatar and information
- **EditProfile**: Enhanced profile editing with avatar selection
- **AvatarSelector**: Multi-type avatar selection (image upload, colors, emojis)
- **ProfileHeader**: Profile page header with user info
- **InfoSection**: User information display sections

### Backend Architecture

- **Models**: Product and User schemas
- **Controllers**: Business logic handling
- **Routes**: API endpoint definitions
- **Middleware**: Request processing pipeline

## 🔐 Authentication

The application includes a complete authentication system:

- User registration with validation
- Secure login/logout functionality
- Protected routes and API endpoints
- User profile management
- Session persistence with localStorage

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop computers
- Tablets
- Mobile devices
- Various screen sizes and orientations

## 🎯 Future Enhancements

- Payment gateway integration
- Advanced search and filtering
- Product reviews and ratings
- Admin dashboard improvements
- Email notifications
- Order tracking system
- Multi-language support

## 👨‍💻 Development Approach

**Frontend**: Collaborative development with AI assistance (GitHub Copilot & BlackBoxAI) for enhanced productivity and code quality.

**Backend**: Independent development showcasing full-stack capabilities without AI assistance, demonstrating complete understanding of backend technologies and MongoDB integration.

## 📄 License

This project is developed as a demonstration of full-stack development capabilities, showcasing both AI-assisted frontend development and independent backend implementation.
