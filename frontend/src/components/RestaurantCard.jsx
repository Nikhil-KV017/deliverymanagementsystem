import React from 'react';
import { Star, Clock, MapPin } from 'lucide-react';

const RestaurantCard = ({ restaurant, onClick }) => {
  if (!restaurant) return null;

  return (
    <div className="restaurant-card" onClick={() => onClick(restaurant.id)}>
      <div className="restaurant-image-wrapper">
        {restaurant.image && restaurant.image.startsWith('http') ? (
          <img src={restaurant.image} alt={restaurant.name} className="restaurant-img" />
        ) : (
          <div className="restaurant-emoji-img">{restaurant.image || '🍽️'}</div>
        )}
        {restaurant.featured && <span className="featured-badge">Featured</span>}
      </div>

      <div className="restaurant-info">
        <div className="restaurant-header">
          <h3>{restaurant.name}</h3>
          <div className="rating-badge">
            <Star size={14} fill="currentColor" />
            <span>{restaurant.rating}</span>
          </div>
        </div>
        <p className="cuisine-text">
          {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(', ') : (restaurant.cuisine || '')}
        </p>

        <div className="restaurant-footer">
          <div className="footer-item">
            <Clock size={14} />
            <span>{restaurant.deliveryTime} mins</span>
          </div>
          <div className="footer-item">
            <MapPin size={14} />
            <span>{restaurant.deliveryFee > 0 ? `₹${restaurant.deliveryFee}` : 'Free'} delivery</span>
          </div>
        </div>
      </div>

      <style>{`
        .restaurant-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .restaurant-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-subtle);
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
        }

        .restaurant-image-wrapper {
          height: 160px;
          background: var(--bg-elevated);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }

        .restaurant-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .restaurant-card:hover .restaurant-img {
          transform: scale(1.05);
        }

        .restaurant-emoji-img {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 5rem;
          background: linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(34,197,94,0.06) 100%);
        }

        .featured-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: var(--primary);
          color: white;
          padding: 4px 10px;
          border-radius: var(--radius-xs);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .restaurant-info {
          padding: 1rem;
        }

        .restaurant-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }

        .restaurant-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
          line-height: 1.2;
        }

        .rating-badge {
          background: var(--green);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          font-size: 0.75rem;
        }

        .cuisine-text {
          color: var(--text-secondary);
          font-size: 0.85rem;
          margin-bottom: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .restaurant-footer {
          display: flex;
          gap: 1.5rem;
          border-top: 1px dashed var(--border);
          padding-top: 1rem;
        }

        .footer-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .footer-item span {
          white-space: nowrap;
        }

      `}</style>
    </div>
  );
};

export default RestaurantCard;
