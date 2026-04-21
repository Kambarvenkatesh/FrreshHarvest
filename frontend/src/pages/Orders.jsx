import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../api/axios'
import './Orders.css'

const Orders = () => {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/orders')
      setOrders(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch orders')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container">
        <p>Please login to view your orders.</p>
      </div>
    )
  }

  return (
    <div className="container orders-page">
      <h1>My Orders</h1>

      {loading && <div className="loading">Loading orders...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && orders.length === 0 && (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`order-status ${order.status}`}>
                  {order.status}
                </div>
              </div>
              <div className="order-items-list">
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span>Total:</span>
                <span className="order-total">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
