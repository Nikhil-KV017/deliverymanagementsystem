import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Search,
  Clock3, IndianRupee, ChevronRight, ShoppingBag,
  Plus, Minus
} from 'lucide-react';
import { useData } from '../context/DataContext';
import MenuItemCard from '../components/MenuItemCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import PaymentModal from '../components/PaymentModal';

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants, getRestaurantById, getMenuForRestaurant, addToCart, removeFromCart, cart, getCartTotal, createOrder, clearCart } = useData();
  const { user } = useAuth();

  const restaurant = useMemo(() => getRestaurantById(id), [id, restaurants]);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const data = await getMenuForRestaurant(id);
      setMenu(data);
    };
    fetchMenu();
  }, [id]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [vegOnly, setVegOnly] = useState(false);

  const categories = useMemo(() => ['All', ...new Set(menu.map(item => item.category).filter(Boolean))], [menu]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = !vegOnly || item.veg;
      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [menu, activeCategory, searchQuery, vegOnly]);

  if (!restaurant) {
    return <div style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>Restaurant not found.</div>;
  }

  const getItemQuantity = (itemId) => {
    const cartItem = cart?.items?.find(i => i.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const thisCartItems = (cart?.restaurantId === id) ? (cart?.items || []) : [];
  const { subtotal = 0, deliveryFee = 0, total = 0 } = (thisCartItems.length > 0) ? getCartTotal() : {};

  const handlePlaceOrder = () => {
    if (thisCartItems.length === 0) return;
    setIsPaymentModalOpen(true);
  };

  const onPaymentComplete = async (method) => {
    setIsPaymentModalOpen(false);
    const orderData = {
      customerId: user?.id,
      restaurantId: id,
      restaurantName: restaurant.name,
      items: thisCartItems.map(i => ({ menuItemId: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      status: 'Placed',
      paymentMethod: method,
      subtotal, deliveryFee, total,
      deliveryAddress: user?.address || '42 Marine Drive, Mumbai',
      date: new Date().toISOString()
    };
    const orderId = await createOrder(orderData);
    if (orderId) {
      clearCart();
      toast.success(`🎉 Order placed successfully via ${method.toUpperCase()}!`);
      navigate('/customer/payments');
    }
  };

  return (
    <div className="restaurant-page">
      <button className="back-btn" onClick={() => navigate('/customer/')}>
        <ArrowLeft size={20} />
        <span>Back to Restaurants</span>
      </button>

      <header className="res-page-header">
        <div className="res-page-banner">
          {restaurant.image && (restaurant.image.startsWith('http') || restaurant.image.startsWith('/')) ? (
            <img src={restaurant.image} alt={restaurant.name} className="banner-img" />
          ) : (
            <div className="banner-emoji-bg">{restaurant.image || '🍽️'}</div>
          )}
          <div className="banner-overlay" />
        </div>

        <div className="res-main-info">
          <div className="res-title-row">
            <h1>{restaurant.name}</h1>
            <div className="res-rating">
              <Star size={18} fill="currentColor" />
              <span>{restaurant.rating}</span>
            </div>
          </div>
          <div className="res-meta-row">
            <span className="cuisine-list">
              {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(' • ') : (restaurant.cuisine || '')}
            </span>
            <span className="dot-sep">•</span>
            <span className="res-location"><MapPin size={14} /> {restaurant.address}</span>
          </div>

          <div className="res-stats-row">
            <div className="stat-glass-card">
              <div className="stat-glass-icon"><Clock3 size={20} /></div>
              <div className="stat-glass-info">
                <span className="sg-val">{restaurant.deliveryTime} mins</span>
                <span className="sg-label">Delivery Time</span>
              </div>
            </div>
            <div className="stat-glass-card">
              <div className="stat-glass-icon"><IndianRupee size={20} /></div>
              <div className="stat-glass-info">
                <span className="sg-val">₹{restaurant.deliveryFee}</span>
                <span className="sg-label">Delivery Fee</span>
              </div>
            </div>
            <div className="stat-glass-card">
              <div className="stat-glass-icon" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}><Star size={20} fill="currentColor" /></div>
              <div className="stat-glass-info">
                <span className="sg-val">{restaurant.rating} Stars</span>
                <span className="sg-label">Quality Score</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="menu-bill-layout">
        <div className="menu-column">
          <div className="menu-section">
            <aside className="menu-sidebar">
              <h3>Categories</h3>
              <nav className="category-nav">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`cat-link ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    <span>{cat}</span>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </nav>
            </aside>

            <main className="menu-main">
              <div className="menu-header">
                <h2>{activeCategory === 'All' ? 'Full Menu' : activeCategory}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--green)', textTransform: 'uppercase' }}>Veg Only</span>
                    <label className="veg-switch">
                      <input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} />
                      <span className="veg-slider"></span>
                    </label>
                  </div>
                  <div className="menu-search">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Search in menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="menu-grid">
                {filteredMenu.length > 0 ? (
                  filteredMenu.map(item => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      quantity={getItemQuantity(item.id)}
                      onAdd={(item) => addToCart(restaurant.id, item)}
                      onRemove={(itemId) => removeFromCart(itemId)}
                    />
                  ))
                ) : (
                  <div className="no-menu-items">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
                    <h3>No items found</h3>
                    <p>Try a different category or search term.</p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>

        <aside className="bill-panel">
          <div className="bill-panel-inner">
            <div className="bill-header">
              <ShoppingBag size={20} color="var(--primary)" />
              <span>Your Order</span>
              {thisCartItems.length > 0 && (
                <span className="bill-item-count">{thisCartItems.reduce((s, i) => s + i.quantity, 0)} items</span>
              )}
            </div>

            {thisCartItems.length === 0 ? (
              <div className="bill-empty">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
                <p>Add items to see your bill here</p>
              </div>
            ) : (
              <>
                <div className="bill-items">
                  {thisCartItems.map(item => (
                    <div key={item.id} className="bill-line">
                      <div className="bill-item-info">
                        <span className="bill-item-emoji">{item.image}</span>
                        <div>
                          <div className="bill-item-name">{item.name}</div>
                          <div className="bill-item-unit">₹{item.price} each</div>
                        </div>
                      </div>
                      <div className="bill-item-right">
                        <div className="bill-qty-ctrl">
                          <button onClick={() => removeFromCart(item.id)}><Minus size={12} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => addToCart(restaurant.id, item)}><Plus size={12} /></button>
                        </div>
                        <div className="bill-item-total">₹{item.price * item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bill-divider" />
                <div className="bill-summary">
                  <div className="bill-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
                  <div className="bill-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
                  <div className="bill-row total"><span>Total</span><span>₹{total}</span></div>
                </div>
                <button className="bill-place-btn" onClick={handlePlaceOrder}>
                  Place Order • ₹{total}
                </button>
              </>
            )}
          </div>
        </aside>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentComplete={onPaymentComplete}
        amount={total}
      />

      <style>{`
        .restaurant-page { animation: fadeIn 0.4s ease; }
        .back-btn {
          display: flex; align-items: center; gap: 8px;
          background: transparent; border: none;
          color: var(--text-muted); font-weight: 700;
          cursor: pointer; margin-bottom: 1.5rem;
          transition: color 0.2s; font-family: var(--font-family);
          font-size: 0.9rem;
        }
        .back-btn:hover { color: var(--primary); }
        .res-page-header { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 2rem; box-shadow: var(--card-shadow); }
        .res-page-banner { height: 240px; position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(34,197,94,0.08) 100%); display: flex; align-items: center; justify-content: center; }
        .banner-img { width: 100%; height: 100%; object-fit: cover; }
        .banner-emoji-bg { font-size: 8rem; filter: drop-shadow(0 8px 20px rgba(0,0,0,0.3)); z-index: 1; }
        .banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--surface) 0%, rgba(0,0,0,0.1) 50%, transparent 100%); z-index: 2; }
        .res-main-info { padding: 1.5rem 2rem 2rem; }
        .res-title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
        .res-title-row h1 { font-size: 2rem; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
        .res-rating { background: var(--green-soft); color: var(--green); padding: 6px 14px; border-radius: 100px; display: flex; align-items: center; gap: 6px; font-weight: 800; }
        .res-meta-row { display: flex; align-items: center; gap: 12px; color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem; flex-wrap: wrap; }
        .res-location { display: flex; align-items: center; gap: 5px; }
        .dot-sep { color: var(--text-muted); }
        .res-stats-row { display: flex; gap: 1rem; flex-wrap: wrap; }
        .stat-glass-card { flex: 1; min-width: 140px; background: var(--bg-color); border: 1px solid var(--border); padding: 1rem; border-radius: 12px; display: flex; align-items: center; gap: 12px; transition: 0.2s; }
        .stat-glass-card:hover { border-color: var(--primary); transform: translateY(-2px); }
        .stat-glass-icon { width: 40px; height: 40px; background: rgba(245,158,11,0.12); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--primary); flex-shrink: 0; }
        .stat-glass-info { display: flex; flex-direction: column; }
        .sg-val { font-size: 0.95rem; font-weight: 800; color: var(--text-main); }
        .sg-label { font-size: 0.68rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .menu-bill-layout { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; align-items: start; }
        @media (max-width: 1100px) { .menu-bill-layout { grid-template-columns: 1fr; } .bill-panel { order: -1; } }
        .menu-column { min-width: 0; }
        .menu-section { display: grid; grid-template-columns: 200px 1fr; gap: 2rem; align-items: start; }
        @media (max-width: 768px) { .menu-section { grid-template-columns: 1fr; } .menu-sidebar { display: none; } }
        .menu-sidebar { position: sticky; top: 90px; }
        .menu-sidebar h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 1rem; }
        .category-nav { display: flex; flex-direction: column; gap: 6px; }
        .cat-link { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; color: var(--text-secondary); font-weight: 600; font-family: var(--font-family); cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
        .cat-link:hover { border-color: var(--primary); color: var(--primary); }
        .cat-link.active { border-color: var(--primary); color: var(--primary); background: rgba(245,158,11,0.06); }
        .menu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .menu-header h2 { font-size: 1.5rem; font-weight: 800; margin: 0; }
        .menu-search { display: flex; align-items: center; gap: 10px; background: var(--surface); padding: 0.5rem 1rem; border-radius: 100px; border: 1px solid var(--border); color: var(--text-muted); width: 260px; }
        .menu-search input { background: transparent; border: none; color: var(--text-main); font-family: var(--font-family); width: 100%; font-size: 0.9rem; }
        .menu-search input:focus { outline: none; }
        .menu-grid { display: flex; flex-direction: column; gap: 1rem; }
        .no-menu-items { padding: 3rem; text-align: center; color: var(--text-muted); border: 1px dashed var(--border); border-radius: 12px; background: var(--surface); }
        .bill-panel { position: sticky; top: 90px; }
        .bill-panel-inner { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: var(--card-shadow); }
        .bill-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1rem; background: var(--bg-elevated); }
        .bill-item-count { margin-left: auto; background: var(--primary); color: #000; font-size: 0.72rem; font-weight: 900; padding: 2px 8px; border-radius: 100px; }
        .bill-empty { padding: 2.5rem 1.5rem; text-align: center; color: var(--text-muted); }
        .bill-items { padding: 0.75rem; display: flex; flex-direction: column; gap: 0; }
        .bill-line { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-radius: 10px; transition: background 0.15s; }
        .bill-line:hover { background: rgba(245,158,11,0.04); }
        .bill-item-info { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
        .bill-item-emoji { font-size: 1.4rem; flex-shrink: 0; }
        .bill-item-name { font-weight: 700; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bill-item-unit { font-size: 0.72rem; color: var(--text-muted); }
        .bill-item-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
        .bill-qty-ctrl { display: flex; align-items: center; gap: 6px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 8px; padding: 3px 6px; }
        .bill-qty-ctrl button { background: none; border: none; color: var(--primary); cursor: pointer; display: flex; align-items: center; padding: 1px; }
        .bill-qty-ctrl span { font-weight: 800; font-size: 0.85rem; min-width: 16px; text-align: center; }
        .bill-item-total { font-weight: 800; font-size: 0.9rem; color: var(--primary); }
        .bill-divider { height: 1px; background: var(--border); margin: 0.5rem 0; }
        .bill-summary { padding: 0.75rem 1.25rem; display: flex; flex-direction: column; gap: 8px; }
        .bill-row { display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--text-secondary); }
        .bill-row.total { font-weight: 900; font-size: 1.05rem; color: var(--text-main); border-top: 1px solid var(--border); padding-top: 10px; margin-top: 2px; }
        .bill-place-btn { width: 100%; padding: 1rem; margin: 0; background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); color: #000; font-weight: 900; font-size: 1rem; border: none; cursor: pointer; transition: all 0.2s; font-family: var(--font-family); box-shadow: 0 4px 15px rgba(245,158,11,0.3); }
        .bill-place-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

        .veg-switch {
          position: relative;
          display: inline-block;
          width: 36px;
          height: 20px;
        }
        .veg-switch input { opacity: 0; width: 0; height: 0; }
        .veg-slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--border);
          transition: .4s;
          border-radius: 20px;
        }
        .veg-slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .veg-slider { background-color: var(--green); }
        input:checked + .veg-slider:before { transform: translateX(16px); }
      `}</style>
    </div>
  );
};

export default RestaurantPage;
