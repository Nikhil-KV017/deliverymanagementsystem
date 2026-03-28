import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  User as UserIcon, 
  Bell, 
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Search,
  Utensils,
  UtensilsCrossed
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import CartDrawer from './CartDrawer';
import AIChatbot from './AIChatbot';
import PaymentModal from './PaymentModal';
import './DashboardLayout.css';

const DashboardLayout = ({ children, sidebarLinks = [], title = "FoodBuddy" }) => {
  const { user, logout } = useAuth();
  const { notifications, cart, createOrder, getCartTotal, clearCart, restaurants } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => n.userId === user?.id && !n.read).length;
  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) return;
    setIsPaymentModalOpen(true);
  };

  const onPaymentComplete = async (method) => {
    setIsPaymentModalOpen(false);
    const restaurant = restaurants.find(r => r.id === cart.restaurantId);
    const { subtotal, deliveryFee, total } = getCartTotal();

    const orderData = {
      customerId: user?.id,
      restaurantId: cart.restaurantId,
      restaurantName: restaurant?.name || "Restaurant",
      items: cart.items.map(i => ({ 
        menuItemId: i.id, 
        name: i.name, 
        price: i.price, 
        quantity: i.quantity 
      })),
      status: 'Placed',
      paymentMethod: method,
      subtotal, deliveryFee, total,
      deliveryAddress: user?.address || '42 Marine Drive, Mumbai',
      date: new Date().toISOString()
    };

    const orderId = await createOrder(orderData);
    if (orderId) {
      clearCart();
      setIsCartOpen(false);
      navigate('/customer/payments');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 60%, #fb923c 100%)',
              padding: '7px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)',
              flexShrink: 0
            }}>
              <UtensilsCrossed color="white" size={20} />
            </div>
            <span className="logo-text">
              <span style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Food</span>
              <span style={{ color: 'var(--text-main)' }}>Buddy</span>
            </span>
          </div>
          <button className="mobile-close" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <button
                key={link.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  navigate(link.path);
                  setIsSidebarOpen(false);
                }}
              >
                <Icon size={20} className="nav-icon" />
                <span>{link.label}</span>
                {isActive && <div className="active-indicator" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <UserIcon size={20} />
            </div>
            <div className="user-details">
              <h4>{user?.name}</h4>
              <p>{user?.role}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <button className="mobile-toggle" onClick={() => setIsSidebarOpen(true)}>
              <MenuIcon size={24} />
            </button>
            <h1 className="page-title">{title}</h1>
          </div>

          <div className="header-right">
            <div className="search-pill">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search..." />
            </div>
            
            <div className="header-actions">
              <button className="icon-btn" onClick={() => navigate(`/${user?.role}/notifications`)}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </button>
              
              {user?.role === 'customer' && (
                <button className="icon-btn cart-btn" onClick={() => setIsCartOpen(true)}>
                  <ShoppingBag size={20} />
                  {cartItemCount > 0 && <span className="badge cart-badge">{cartItemCount}</span>}
                </button>
              )}
            </div>
          </div>
        </header>

        <section className="content-body">
          {children}
        </section>
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={handleCheckout}
      />
      
      <AIChatbot />

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentComplete={onPaymentComplete}
        amount={getCartTotal().total}
      />
    </div>
  );
};

export default DashboardLayout;
