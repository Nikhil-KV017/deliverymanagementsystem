import React, { useState } from 'react';
import { Search, SlidersHorizontal, Star, Clock, X, Check } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder, categories = [], selectedCategory, onCategoryChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    rating: 0,
    time: 45,
    priceRange: 'all'
  });
  return (
    <div className="search-section">
      <div className="search-bar-wrapper">
        <div className="search-input-container">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder={placeholder || "Search for restaurants, cuisines or dishes..."}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="filter-btn" onClick={() => setShowFilters(true)}>
          <SlidersHorizontal size={20} />
          { (tempFilters.rating > 0 || tempFilters.priceRange !== 'all') && <span className="filter-badge" /> }
        </button>
      </div>

      {showFilters && (
        <div className="filter-modal-overlay" onClick={() => setShowFilters(false)}>
          <div className="filter-modal" onClick={e => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h3>Refine Search</h3>
              <button className="close-filter" onClick={() => setShowFilters(false)}><X size={20} /></button>
            </div>
            
            <div className="filter-modal-body">
              <div className="filter-group">
                <label>Minimum Rating</label>
                <div className="rating-options">
                  {[3, 3.5, 4, 4.5].map(r => (
                    <button 
                      key={r}
                      className={`rating-chip ${tempFilters.rating === r ? 'active' : ''}`}
                      onClick={() => setTempFilters({...tempFilters, rating: r})}
                    >
                      <Star size={14} fill={tempFilters.rating === r ? "white" : "none"} />
                      {r}+
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label>Max Delivery Time: {tempFilters.time} mins</label>
                <input 
                  type="range" 
                  min="15" 
                  max="60" 
                  step="5"
                  value={tempFilters.time}
                  onChange={(e) => setTempFilters({...tempFilters, time: parseInt(e.target.value)})}
                  className="range-slider"
                />
                <div className="range-labels">
                  <span>15m</span>
                  <span>60m</span>
                </div>
              </div>

              <div className="filter-group">
                <label>Price Range</label>
                <div className="price-options">
                  {['all', 'low', 'mid', 'high'].map(p => (
                    <button 
                      key={p}
                      className={`price-chip ${tempFilters.priceRange === p ? 'active' : ''}`}
                      onClick={() => setTempFilters({...tempFilters, priceRange: p})}
                    >
                      {p === 'all' ? 'All' : p === 'low' ? '₹' : p === 'mid' ? '₹₹' : '₹₹₹'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="filter-modal-footer">
              <button className="btn-reset" onClick={() => setTempFilters({rating: 0, time: 45, priceRange: 'all'})}>Reset</button>
              <button className="btn-apply" onClick={() => setShowFilters(false)}>
                <Check size={18} /> Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="categories-scroll">
          <button 
            className={`category-chip ${!selectedCategory ? 'active' : ''}`}
            onClick={() => onCategoryChange(null)}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .search-section {
          margin-bottom: 2.5rem;
        }

        .search-bar-wrapper {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .search-input-container {
          flex: 1;
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          padding: 0 1.25rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .search-input-container:focus-within {
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
        }

        .search-icon {
          color: var(--text-muted);
          margin-right: 1rem;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 1rem 0;
          color: var(--text-main);
          font-family: var(--font-family);
          font-size: 1rem;
        }

        .search-input:focus {
          outline: none;
        }

        .filter-btn {
          width: 50px;
          height: 50px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .filter-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .categories-scroll {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding: 0.5rem 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .categories-scroll::-webkit-scrollbar {
          display: none;
        }

        .category-chip {
          padding: 0.6rem 1.25rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 100px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .category-chip.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .filter-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          border: 2px solid var(--bg-elevated);
        }

        .filter-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        .filter-modal {
          width: 90%;
          max-width: 400px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          overflow: hidden;
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .filter-modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .filter-modal-header h3 { margin: 0; font-size: 1.25rem; font-weight: 800; }
        .close-filter { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }

        .filter-modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 2rem; }
        
        .filter-group label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px; }

        .rating-options, .price-options { display: flex; gap: 10px; }
        .rating-chip, .price-chip {
           flex: 1;
           padding: 10px;
           background: var(--surface);
           border: 1px solid var(--border);
           border-radius: 8px;
           color: var(--text-main);
           font-weight: 700;
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 6px;
           transition: 0.2s;
        }

        .rating-chip.active, .price-chip.active { background: var(--primary); border-color: var(--primary); color: white; }

        .range-slider { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; appearance: none; outline: none; }
        .range-slider::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; background: var(--primary); border-radius: 50%; cursor: pointer; box-shadow: 0 0 10px rgba(255,107,53,0.5); }
        .range-labels { display: flex; justify-content: space-between; margin-top: 8px; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

        .filter-modal-footer {
          padding: 1.5rem;
          background: rgba(0,0,0,0.2);
          display: flex;
          gap: 1rem;
        }

        .btn-reset { flex: 1; padding: 12px; background: transparent; border: 1px solid var(--border-subtle); color: var(--text-secondary); border-radius: 12px; font-weight: 700; cursor: pointer; }
        .btn-apply { flex: 2; padding: 12px; background: var(--primary); border: none; color: white; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 15px rgba(255,107,53,0.3); }
      `}</style>
    </div>
  );
};

export default SearchBar;

