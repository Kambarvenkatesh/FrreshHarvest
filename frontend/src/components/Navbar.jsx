import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          🌱 FreshHarvest
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li>
            <Link to="/cart">
              Cart
              {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
            </Link>
          </li>
          {user ? (
            <>
              <li><Link to="/orders">Orders</Link></li>
              <li><button onClick={logout} className="logout-btn">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
