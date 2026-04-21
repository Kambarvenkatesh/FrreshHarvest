import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Cart.css'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart()
  const { isAuthenticated } = useAuth()

  if (cart.length === 0) {
    return (
      <div className="container cart-page">
        <h1>Shopping Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/shop" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">${item.price.toFixed(2)}</p>
              </div>
              <div className="item-quantity">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  min="1"
                />
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>$0.00</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          {isAuthenticated ? (
            <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
          ) : (
            <Link to="/login" className="checkout-btn">Login to Checkout</Link>
          )}
          <Link to="/shop" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
