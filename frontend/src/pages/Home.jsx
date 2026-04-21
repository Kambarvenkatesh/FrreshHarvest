import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-content">
          <h1>Welcome to FreshHarvest</h1>
          <p>Fresh, organic produce delivered to your doorstep</p>
          <Link to="/shop" className="cta-button">Shop Now</Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose FreshHarvest?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🌱</span>
              <h3>100% Organic</h3>
              <p>All our produce is certified organic and pesticide-free</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🚚</span>
              <h3>Fast Delivery</h3>
              <p>Same-day delivery available in most areas</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💰</span>
              <h3>Great Prices</h3>
              <p>Competitive pricing on all fresh produce</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⭐</span>
              <h3>Quality Guaranteed</h3>
              <p>Freshness guaranteed or your money back</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to get fresh produce?</h2>
          <Link to="/shop" className="cta-button-secondary">Browse Products</Link>
        </div>
      </section>
    </div>
  )
}

export default Home
