# FreshHarvest - Full-Stack E-commerce App

A modern, full-stack e-commerce application for fresh produce with a focus on mushrooms and organic vegetables. Built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Product Catalog**: Mushrooms and organic veggie boxes
- **Shopping Cart**: Persistent cart with localStorage
- **User Authentication**: JWT-based auth with registration/login
- **Order Management**: Complete order lifecycle
- **Payment Integration**: Ready for Razorpay/UPI/COD
- **Admin Features**: Product management (protected routes)
- **Mobile-First**: Responsive design for all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Context API** for state management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## 📁 Project Structure

```
freshharvest/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── context/     # React contexts
    │   ├── utils/       # API utilities
    │   └── App.jsx      # Main app component
    ├── public/          # Static assets
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and setup backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Edit with your MongoDB URI
   npm start
   ```

2. **Setup frontend (in new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Seed products (optional):**
   ```bash
   # Visit http://localhost:5173/shop and click "Reset Products"
   # Or call the API directly
   ```

### Environment Variables

**Backend (.env):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/freshharvest
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

**Frontend:**
- Automatically proxies API calls to `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/seed` - Seed sample products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/my` - Get user's orders (protected)
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get order by ID (protected)
- `PUT /api/orders/:id/status` - Update order status (admin)
- `PUT /api/orders/:id/cancel` - Cancel order (user)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)
- `GET /api/users` - Get all users (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## 🎨 Design System

### Colors
- **Primary**: Green (#2d6a4f, #40916c)
- **Accent**: Orange (#e76f51)
- **Neutral**: Cream (#fefae0), Gray variants

### Typography
- **Display**: Playfair Display (headings)
- **Body**: DM Sans (content)

### Components
- Cards, buttons, forms, badges
- Responsive grid layouts
- Loading states and animations

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage
3. API requests include Bearer token
4. Protected routes check token validity
5. Automatic logout on token expiry

## 🛒 Cart Management

- Cart state managed with useReducer
- Persistent storage in localStorage
- Real-time total calculations
- Free delivery threshold (₹500)

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚀 Deployment

### Backend (Render/Railway)
1. Connect GitHub repo
2. Set environment variables
3. Deploy automatically

### Frontend (Vercel/Netlify)
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - feel free to use this project for learning and building your own applications!

---

Built with ❤️ for the fresh produce community