import React, { useState, useMemo } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { 
  ShoppingBag, 
  MapPin, 
  History, 
  Settings,
  Star,
  Clock,
  ArrowRight,
  TrendingUp,
  Utensils,
  Pizza,
  Beef,
  IceCream,
  Coffee
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import RestaurantCard from '../components/RestaurantCard';
import SearchBar from '../components/SearchBar';
import OrderTracker from '../components/OrderTracker';
import RestaurantPage from './RestaurantPage';
import Payments from './Payments';
import SettingsPage from './SettingsPage';
import { toast } from 'react-toastify';

const CUISINES = [
  { name: 'Pizza', icon: Pizza, color: '#f59e0b' },
  { name: 'Burgers', icon: Beef, color: '#fb923c' },
  { name: 'Indian', icon: Utensils, color: '#22c55e' },
  { name: 'Chinese', icon: Utensils, color: '#38bdf8' },
  { name: 'Italian', icon: Pizza, color: '#a78bfa' },
  { name: 'Desserts', icon: IceCream, color: '#f59e0b' },
  { name: 'Beverages', icon: Coffee, color: '#34d399' },
];

function CustomerHome() {
  const { user } = useAuth();
  const { getRestaurantsByCity, restaurants, menuItems } = useData();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [vegOnly, setVegOnly] = useState(false);

  const cityRestaurants = useMemo(() => {
    return getRestaurantsByCity(user?.city || 'Mumbai');
  }, [user?.city, restaurants]);

  const filteredRestaurants = useMemo(() => {
    return cityRestaurants.filter(r => {
      const term = (search || '').toLowerCase();
      const matchesSearch = (r.name || '').toLowerCase().includes(term) || 
                           (r.cuisine || []).some(c => (c || '').toLowerCase().includes(term)) ||
                           (menuItems || []).some(m => String(m.restaurantId) === String(r.id) && 
                                             ((m.name || '').toLowerCase().includes(term) || (m.category || '').toLowerCase().includes(term)));
      const matchesCuisine = !selectedCuisine || (r.cuisine || []).includes(selectedCuisine);
      
      // If vegOnly is true, only show if restaurant name/cuisine hints veg or has veg items
      // (Simplification: just filter by the veg items matching the search if applicable)
      const hasVegItems = (menuItems || []).some(m => String(m.restaurantId) === String(r.id) && m.veg);
      const matchesVeg = !vegOnly || (hasVegItems || (r.cuisine || []).some(c => c.toLowerCase().includes('veg')));
      
      return matchesSearch && matchesCuisine && matchesVeg;
    });
  }, [cityRestaurants, search, selectedCuisine, menuItems, vegOnly]);

  const featured = cityRestaurants.filter(r => r.featured);

  const categories = useMemo(() => {
    const allCuisines = restaurants.flatMap(r => r.cuisine);
    return [...new Set(allCuisines)];
  }, [restaurants]);

  return (
    <div className="customer-home">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Restaurants with online food delivery in {user?.city || 'your city'},</h1>
          <div style={{ maxWidth: '600px', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <SearchBar 
                value={search} 
                onChange={setSearch} 
                placeholder="Search for restaurants or dishes..."
                categories={categories}
                selectedCategory={selectedCuisine}
                onCategoryChange={setSelectedCuisine}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface)', padding: '10px 16px', borderRadius: '100px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--green)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Veg Only</span>
              <label className="switch">
                <input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div className="hero-visual">🍔</div>
      </header>

      {/* Cuisine Categories */}
      <section className="section">
        <div className="section-header">
          <h2>Cuisines</h2>
        </div>
        <div className="cuisine-grid">
          {CUISINES.map(cuisine => (
            <button 
              key={cuisine.name} 
              className={`cuisine-card ${selectedCuisine === cuisine.name ? 'active' : ''}`}
              onClick={() => setSelectedCuisine(prev => prev === cuisine.name ? null : cuisine.name)}
            >
              <div className="cuisine-icon-wrapper" style={{ '--cuisine-color': cuisine.color }}>
                <cuisine.icon size={24} />
              </div>
              <span>{cuisine.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      {featured.length > 0 && (
        <section className="section">
          <div className="section-header">
            <div className="title-with-icon">
              <TrendingUp className="primary-color" size={24} />
              <h2>Featured Restaurants</h2>
            </div>
            <button className="text-btn" onClick={() => { setSearch(''); setSelectedCuisine(null); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}>View All <ArrowRight size={16} /></button>
          </div>
          <div className="restaurant-grid">
            {featured.map(r => (
              <RestaurantCard 
                key={r.id} 
                restaurant={r} 
                onClick={(id) => navigate(`/customer/restaurant/${id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Listing */}
      <section className="section">
        <div className="section-header">
          <h2>Restaurants Near You</h2>
        </div>
        {filteredRestaurants.length > 0 ? (
          <div className="restaurant-grid">
            {filteredRestaurants.map(r => (
              <RestaurantCard 
                key={r.id} 
                restaurant={r} 
                onClick={(id) => navigate(`/customer/restaurant/${id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No restaurants found</h3>
            <p>Try searching for something else or clear your filters.</p>
            <button className="btn-primary" onClick={() => { setSearch(''); setSelectedCuisine(null); }}>
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      <style>{`
        .customer-home {
          animation: fadeIn 0.5s ease;
        }

        .hero-section {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(34, 197, 94, 0.04) 100%);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 3rem;
          margin-bottom: 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero-section::after {
          content: '';
          position: absolute;
          right: -50px;
          bottom: -50px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
          border-radius: 50%;
        }

        .hero-content h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          letter-spacing: -1px;
        }

        .hero-content p {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 0;
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 34px;
          height: 18px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--border);
          transition: .4s;
          border-radius: 18px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 12px;
          width: 12px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider { background-color: var(--green); }
        input:checked + .slider:before { transform: translateX(16px); }

        .hero-visual {
          font-size: 8rem;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
          animation: slideInRight 1s ease-out;
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .section {
          margin-bottom: 4rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
        }

        .title-with-icon {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .text-btn {
          background: transparent;
          border: none;
          color: var(--primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .cuisine-grid {
          display: flex;
          gap: 1.25rem;
          overflow-x: auto;
          padding: 0.5rem 0 1rem 0;
          scrollbar-width: none;
        }

        .cuisine-grid::-webkit-scrollbar { display: none; }

        .cuisine-card {
          min-width: 100px;
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cuisine-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
          background: var(--surface-hover);
        }

        .cuisine-card.active {
          border-color: var(--primary);
          background: rgba(245, 158, 11, 0.08);
          box-shadow: 0 4px 12px rgba(255,107,53,0.1);
        }

        .cuisine-icon-wrapper {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cuisine-color);
          transition: all 0.3s ease;
        }

        .cuisine-card:hover .cuisine-icon-wrapper {
          background: white;
          transform: scale(1.1);
        }

        .cuisine-card span {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .cuisine-card.active span {
          color: var(--text-main);
        }

        .restaurant-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .no-results {
          padding: 4rem;
          text-align: center;
          background: var(--surface);
          border-radius: var(--radius);
          border: 1px dashed var(--border-subtle);
        }

        .no-results-icon { font-size: 4rem; margin-bottom: 1rem; }
        .no-results h3 { margin-bottom: 0.5rem; }
        .no-results p { color: var(--text-secondary); margin-bottom: 2rem; }

        @media (max-width: 768px) {
          .hero-section { padding: 2rem; flex-direction: column; text-align: center; }
          .hero-visual { margin-top: 2rem; font-size: 5rem; }
          .hero-content h1 { font-size: 2.25rem; }
        }
      `}</style>
    </div>
  );
}

function CustomerOrders() {
  const { orders, user } = useAuth();
  const { orders: allOrders, deleteOrder } = useData();
  const navigate = useNavigate();

  const myOrders = allOrders.filter(o => String(o.customerId) === String(user?.id))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleCancel = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      await deleteOrder(orderId);
      toast.success("Order cancelled successfully.");
    }
  };

  const handleReturn = (orderId) => {
    toast.warn("Return request for Order #" + orderId + " is being reviewed.");
  };

  return (
    <div className="orders-page">
      <div className="section-header">
        <h2>My Orders</h2>
        <p className="subtitle">Track your current orders and view history</p>
      </div>

      {myOrders.length > 0 ? (
        <div className="orders-list">
          {myOrders.map(order => (
            <div key={order.id} className="order-item-card">
              <div className="order-item-header">
                <div className="restaurant-brief">
                  <div className="res-icon">🍲</div>
                  <div>
                    <h4>{order.restaurantName}</h4>
                    <span className="order-date">{new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div className={`status-pill ${order.status.toLowerCase().replace(' ', '-')}`}>
                  {order.status}
                </div>
              </div>

              <div className="order-item-body">
                <div className="items-summary">
                  {order.items.map(item => (
                    <div key={item.menuItemId} className="item-row">
                      <span>{item.quantity} x {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total-row">
                  <span>Total Paid</span>
                  <span className="bold">₹{order.total}</span>
                </div>
              </div>

              <div className="order-item-footer">
                <button 
                  className="btn-outline" 
                  onClick={() => navigate(`/customer/tracking/${order.id}`)}
                >
                  Track Live
                </button>
                {order.status === 'Placed' || order.status === 'Pending Payment' ? (
                   <button className="btn-outline red-text" onClick={() => handleCancel(order.id)}>Cancel Order</button>
                ) : order.status === 'Delivered' ? (
                   <button className="btn-outline" onClick={() => handleReturn(order.id)}>Return Items</button>
                ) : null}
                <button className="btn-primary-sm" onClick={() => navigate(`/customer/restaurant/${order.restaurantId}`)}>Order Again</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <h3>No orders yet</h3>
          <p>Hungry? Place your first order now!</p>
          <button className="btn-primary" onClick={() => navigate('/customer/')}>Explore Restaurants</button>
        </div>
      )}

      <style>{`
        .orders-page { animation: fadeIn 0.5s ease; }
        .subtitle { color: var(--text-secondary); margin-top: 0.5rem; }
        
        .orders-list { display: grid; gap: 1.5rem; margin-top: 2rem; }
        
        .order-item-card {
           background: var(--surface);
           border: 1px solid var(--border-subtle);
           border-radius: var(--radius-sm);
           overflow: hidden;
           transition: all 0.3s ease;
        }

        .order-item-card:hover { border-color: var(--primary); }

        .order-item-header {
          padding: 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .restaurant-brief { display: flex; gap: 12px; align-items: center; }
        .res-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.03); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .restaurant-brief h4 { margin: 0; font-size: 1.1rem; }
        .order-date { font-size: 0.8rem; color: var(--text-muted); }

        .status-pill {
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-pill.delivered { background: var(--green-soft); color: var(--green); }
        .status-pill.on-the-way { background: var(--yellow-soft); color: var(--yellow); }
        .status-pill.preparing { background: rgba(245, 158, 11, 0.1); color: var(--primary); }
        .status-pill.picked-up { background: var(--primary); color: white; }
        .status-pill.confirmed { background: var(--green-soft); color: var(--green); }
        .status-pill.placed { background: rgba(255,255,255,0.1); color: var(--text-secondary); }

        .order-item-body { padding: 1.25rem; background: rgba(0,0,0,0.1); }
        .items-summary { margin-bottom: 1rem; }
        .item-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 4px; }
        .order-total-row { display: flex; justify-content: space-between; padding-top: 0.75rem; border-top: 1px dashed var(--border-subtle); font-weight: 600; }
        .bold { font-weight: 800; color: var(--primary); font-size: 1.1rem; }

        .order-item-footer { padding: 1.25rem; display: flex; gap: 1rem; }
        .btn-outline { flex: 1; padding: 0.75rem; background: transparent; border: 1px solid var(--border-subtle); color: var(--text-main); border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-outline:hover { border-color: var(--primary); color: var(--primary); }
        .btn-primary-sm { flex: 1; padding: 0.75rem; background: var(--primary); border: none; color: white; border-radius: 8px; font-weight: 700; cursor: pointer; }

        .empty-state { padding: 5rem 2rem; text-align: center; }
        .empty-state-icon { font-size: 5rem; margin-bottom: 1.5rem; }
      `}</style>
    </div>
  );
}

function LiveTrackingPage() {
  const { id } = useParams();
  const { orders } = useData();
  const { user } = useAuth();
  
  const order = id 
    ? orders.find(o => String(o.id) === String(id))
    : orders.find(o => String(o.customerId) === String(user?.id) && o.status !== 'Delivered' && o.status !== 'Placed');

  return (
    <div className="tracking-page">
      <div className="section-header">
        <h2>Live Tracking</h2>
        {order && <p className="subtitle">Real-time updates for Order #{String(order.id).slice(-6)} from {order.restaurantName}</p>}
      </div>
      
      {order ? (
        <OrderTracker order={order} />
      ) : (
        <div className="no-order-card">
          <div className="no-order-icon">📍</div>
          <h3>No active orders to track</h3>
          <p>You don't have any in-progress orders right now.</p>
          <button className="btn-primary" onClick={() => navigate('/customer')}>Explore Restaurants</button>
        </div>
      )}

      <style>{`
        .tracking-page { animation: fadeIn 0.5s ease; }
        .no-order-card {
          background: var(--surface);
          border: 1px dashed var(--border-subtle);
          border-radius: 16px;
          padding: 4rem 2rem;
          text-align: center;
          margin-top: 1rem;
        }
        .no-order-icon { font-size: 4rem; margin-bottom: 1.5rem; }
        .no-order-card h3 { margin-bottom: 0.5rem; font-weight: 800; }
        .no-order-card p { color: var(--text-secondary); margin-bottom: 2rem; }
      `}</style>
    </div>
  );
}



export default function CustomerDashboard() {
  const sidebarLinks = [
    { label: 'Explore', path: '/customer/', icon: ShoppingBag },
    { label: 'My Orders', path: '/customer/orders', icon: History },
    { label: 'Payments', path: '/customer/payments', icon: TrendingUp },
    { label: 'Live Tracking', path: '/customer/tracking', icon: MapPin },
    { label: 'Settings', path: '/customer/settings', icon: Settings },
  ];

  return (
    <DashboardLayout sidebarLinks={sidebarLinks} title="FoodBuddy">
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="restaurant/:id" element={<RestaurantPage />} />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="payments" element={<Payments />} />
        <Route path="tracking" element={<LiveTrackingPage />} />
        <Route path="tracking/:id" element={<LiveTrackingPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}

