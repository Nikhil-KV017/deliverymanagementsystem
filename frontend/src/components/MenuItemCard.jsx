import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

const MenuItemCard = ({ item, onAdd, onRemove, quantity = 0 }) => {
  if (!item) return null;

  return (
    <div className={`menu-item-card ${!item.inStock ? 'out-of-stock' : ''}`}>
      <div className="menu-item-content">
        <div className="menu-item-details">
          <div className="item-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className={`veg-indicator ${item.veg ? 'veg' : 'non-veg'}`}>
                <div className="dot" />
              </div>
              <h3>{item.name}</h3>
            </div>
            {item.bestseller && <span className="bestseller-badge">🔥 Bestseller</span>}
            {!item.inStock && <span className="stock-badge error">Sold Out</span>}
            {item.inStock && item.stockCount < 10 && <span className="stock-badge warning">Only {item.stockCount} left</span>}
          </div>
          <p className="item-description">{item.description}</p>
          <div className="item-footer">
            <span className="item-price">₹{item.price}</span>
          </div>
        </div>
        <div className="menu-item-image-area">
          <div className="item-image">{item.image}</div>
          {item.inStock && (
            <div className="quantity-controls">
              {quantity > 0 ? (
                <>
                  <button onClick={() => onRemove(item.id)} className="control-btn minus">
                    <Minus size={16} />
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    onClick={() => onAdd(item)} 
                    className="control-btn plus"
                    disabled={quantity >= item.stockCount}
                  >
                    <Plus size={16} />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => onAdd(item)} 
                  className="add-btn"
                >
                  <Plus size={16} />
                  <span>ADD</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .menu-item-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.5rem;
          transition: all 0.2s ease;
          position: relative;
        }

        .menu-item-card:hover { border-color: var(--border-subtle); box-shadow: 0 4px 14px rgba(0,0,0,0.05); }

        .menu-item-card.out-of-stock {
          opacity: 0.6;
          filter: grayscale(0.5);
        }

        .menu-item-content {
          display: flex;
          gap: 1.5rem;
          justify-content: space-between;
        }

        .menu-item-details {
          flex: 1;
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 0.5rem;
        }

        .item-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .stock-badge {
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .stock-badge.error {
          background: var(--red-soft);
          color: var(--red);
        }

        .stock-badge.warning {
          background: var(--yellow-soft);
          color: var(--yellow);
        }

        .item-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-price {
          color: var(--text-main);
          font-weight: 700;
          font-size: 1.1rem;
        }

        .menu-item-image-area {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .item-image {
          width: 100%;
          height: 100%;
          background: var(--bg-elevated);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          border: 1px solid var(--border);
        }
        
        .veg-indicator {
          width: 14px; height: 14px; border: 1px solid #ccc;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; border-radius: 2px;
        }
        .veg-indicator.veg { border-color: #22c55e; }
        .veg-indicator.non-veg { border-color: #ef4444; }
        .veg-indicator.veg .dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; }
        .veg-indicator.non-veg .dot { 
          width: 0; height: 0; 
          border-left: 4px solid transparent; border-right: 4px solid transparent;
          border-bottom: 7px solid #ef4444;
        }
        
        .bestseller-badge {
          background: #fff8e1; color: #f59e0b;
          font-size: 0.65rem; font-weight: 800;
          padding: 2px 8px; border-radius: 4px;
          border: 1px solid #ffe082;
          text-transform: uppercase;
        }

        .quantity-controls {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          min-width: 90px;
          justify-content: center;
        }

        .add-btn {
          width: 100%;
          background: transparent;
          border: none;
          color: var(--primary);
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          padding: 4px 12px;
        }

        .control-btn {
          background: transparent;
          border: none;
          color: var(--primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
        }

        .control-btn:hover {
          background: rgba(245,158,11,0.12);
        }

        .control-btn:disabled {
          color: var(--text-muted);
          cursor: not-allowed;
        }

        .quantity-display {
          font-weight: 800;
          color: var(--text-main);
          min-width: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default MenuItemCard;
