# FreshHarvest Frontend

A modern React-based frontend for the FreshHarvest e-commerce platform.

## Features

- 🛒 Shopping cart with persistent storage
- 🔐 User authentication (login/register)
- 📦 Order management and history
- 🔍 Product search and filtering
- 💳 Checkout process
- 📱 Responsive design
- ⚡ Built with Vite for fast development

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS** - Styling

## Project Structure

```
src/
├── api/              # API configuration and axios setup
├── components/       # Reusable components
├── context/          # React Context for auth and cart
├── pages/            # Page components
└── App.jsx           # Main app component
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` from `.env.example`:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your backend API URL

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api` (configurable via `VITE_API_URL`).

### Authentication

- Login: `POST /auth/login`
- Register: `POST /auth/register`
- Token stored in localStorage

### Main Endpoints

- Products: `GET /products`
- Orders: `GET /orders`, `POST /orders`
- Users: `GET /users/:id`, `PUT /users/:id`

## Context Providers

### AuthContext
Manages user authentication state and login/logout functionality.

```javascript
const { user, token, isAuthenticated, login, logout } = useAuth()
```

### CartContext
Manages shopping cart state with localStorage persistence.

```javascript
const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart()
```

## Components

- **Navbar** - Main navigation with cart badge
- **Footer** - Footer with links and info
- **ProductCard** - Product display card
- **PrivateRoute** - Route protection for authenticated pages

## Pages

- **Home** - Landing page with features
- **Shop** - Product listing with search and filters
- **Cart** - Shopping cart review
- **Checkout** - Order placement
- **Login/Register** - Authentication pages
- **Orders** - Order history

## Styling

The app uses modern CSS with:
- CSS Grid and Flexbox for layouts
- CSS variables for theming
- Responsive design with mobile-first approach
- Green color scheme (#4CAF50, #2d5016)

## License

MIT
