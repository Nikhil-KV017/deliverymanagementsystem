import React from 'react';
import { X, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

const CartDrawer = ({ isOpen, onClose, onCheckout }) => {
  const { cart, addToCart, removeFromCart, getCartTotal, restaurants } = useData();
  const { subtotal, deliveryFee, total } = getCartTotal();
  
  const restaurant = restaurants.find(r => r.id === cart.restaurantId);

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <div className="header-title">
            <ShoppingBag size={24} className="primary-color" />
            <h2>Your Basket</h2>
            {cart.items.length > 0 && <span className="item-count">{cart.items.length}</span>}
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-content">
          {cart.items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🍱</div>
              <h3>Your basket is empty</h3>
              <p>Add some delicious meals from your favorite restaurants to get started!</p>
              <button className="btn-primary" onClick={onClose}>Browse Food</button>
            </div>
          ) : (
            <>
              <div className="restaurant-notice">
                <p>Ordering from <strong>{restaurant?.name}</strong></p>
              </div>

              <div className="cart-items">
                {cart.items.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <span className="item-emoji">{item.image}</span>
                      <div className="item-text">
                        <h4>{item.name}</h4>
                        <span className="item-price">₹{item.price}</span>
                      </div>
                    </div>
                    <div className="item-controls">
                      <button onClick={() => removeFromCart(item.id)} className="qty-btn">
                        <Minus size={14} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button 
                        onClick={() => addToCart(cart.restaurantId, item)} 
                        className="qty-btn"
                        disabled={item.quantity >= (item.stockCount || 99)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="cart-actions">
                <button className="checkout-btn" onClick={onCheckout}>
                  <span>Review & Checkout</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.3s ease;
        }

        .cart-drawer {
          width: 100%;
          max-width: 420px;
          background: var(--surface);
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(0,0,0,0.1);
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cart-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-title h2 {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0;
        }

        .item-count {
          background: var(--primary);
          color: white;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 100px;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: var(--text-main);
        }

        .cart-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 0;
        }

        .empty-cart {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 1.5rem;
        }

        .empty-cart h3 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }

        .empty-cart p {
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .restaurant-notice {
          background: rgba(255,107,53,0.05);
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0;
        }

        .cart-item {
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-subtle);
        }

        .item-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .item-emoji {
          font-size: 2rem;
          width: 48px;
          height: 48px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-text h4 {
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 4px 0;
        }

        .item-price {
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .item-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--surface);
          padding: 6px 12px;
          border-radius: 100px;
          border: 1px solid var(--border);
        }

        .qty-btn {
          background: transparent;
          border: none;
          color: var(--primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-btn:disabled {
          color: var(--text-muted);
          cursor: not-allowed;
        }

        .qty-val {
          font-weight: 800;
          min-width: 15px;
          text-align: center;
          font-size: 0.9rem;
        }

        .cart-summary {
          padding: 1.5rem;
          background: #fafafa;
          border-top: 1px solid var(--border);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .summary-row.total {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px dashed var(--border-subtle);
          color: var(--text-main);
          font-size: 1.25rem;
          font-weight: 800;
        }

        .cart-actions {
          padding: 1.5rem;
        }

        .checkout-btn {
          width: 100%;
          background: #fc8019;
          color: white;
          border: none;
          padding: 1.25rem;
          border-radius: 8px;
          font-weight: 800;
          font-size: 1.1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }

        .checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,107,53,0.5);
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;

