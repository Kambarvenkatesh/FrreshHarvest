import React from 'react'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 })
    alert(`${product.name} added to cart!`)
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
