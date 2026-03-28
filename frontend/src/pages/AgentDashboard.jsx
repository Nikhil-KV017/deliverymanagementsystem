import React, { useState, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Bike, 
  History, 
  Map as MapIcon, 
  DollarSign, 
  Power,
  Navigation,
  ChevronRight,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Package
} from 'lucide-react';


import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import OrderTracker from '../components/OrderTracker';
import AgentHistory from './AgentHistory';
import AgentStats from './AgentStats';
import { toast } from 'react-toastify';

function AgentOverview() {
  const { user, updateProfile } = useAuth();
  const { orders, updateOrderStatus, assignAgent, restaurants, updateUser } = useData();

  const navigate = useNavigate();

  const isOnline = user?.onDuty ?? true;

  const toggleOnline = () => {
    updateUser(user.id, { onDuty: !isOnline });
    updateProfile({ onDuty: !isOnline });
    toast.info(`You are now ${!isOnline ? 'Online' : 'Offline'}`);
  };

  const myCity = user?.city || 'Mumbai';
  
  // Available orders: Placed or Confirmed but no agent yet, and in my city
  const availableOrders = useMemo(() => {
    return orders.filter(o => 
      (o.status === 'Placed' || (o.status === 'Confirmed' && !o.agentId)) && 
      restaurants.find(r => String(r.id) === String(o.restaurantId))?.city === myCity
    );
  }, [orders, restaurants, myCity, user?.id]);

  // Active delivery: Any order assigned to me that isn't delivered
  const activeOrder = useMemo(() => {
    return orders.find(o => String(o.agentId) === String(user?.id) && o.status !== 'Delivered');
  }, [orders, user?.id]);

  // Earnings: Completed orders
  const completedOrders = useMemo(() => {
    return orders.filter(o => String(o.agentId) === String(user?.id) && o.status === 'Delivered');
  }, [orders, user?.id]);

  const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.deliveryFee || 30), 0);

  const handleAccept = async (orderId) => {
    if (!isOnline) {
      toast.warning("Go online to accept orders!");
      return;
    }
    await assignAgent(orderId, user.id);
    navigate(`/agent/active`);
    toast.success("Order accepted! Head to the restaurant.");
  };

  return (
    <div className="agent-overview">
      <div className="agent-header">
        <div className="welcome-text">
          <h1>Hello, {user?.name.split(' ')[0]}!</h1>
          <p>Ready for some deliveries in {myCity}?</p>
        </div>
        <button 
          className={`status-toggle ${isOnline ? 'online' : 'offline'}`}
          onClick={toggleOnline}
        >
          <Power size={18} />
          <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </button>
      </div>

      <div className="agent-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-bg primary"><DollarSign size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Today's Earnings</span>
            <span className="stat-value">₹{totalEarnings}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-bg green"><CheckCircle2 size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completedOrders.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-bg yellow"><Clock size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Active Trip</span>
            <span className="stat-value">{activeOrder ? '1' : 'None'}</span>
          </div>
        </div>
      </div>

      {activeOrder && (
        <div className="active-card-notice" onClick={() => navigate('/agent/active')}>
          <div className="notice-content">
            <Navigation size={24} className="primary-color bounce" />
            <div>
              <h3>Active Delivery in Progress</h3>
              <p>Delivery to {activeOrder.deliveryAddress.split(',')[0]} from {activeOrder.restaurantName}</p>
            </div>
          </div>
          <ChevronRight size={24} />
        </div>
      )}

      <div className="section-title-row">
        <h2>Available Deliveries</h2>
        <span className="order-count">{availableOrders.length} new</span>
      </div>

      {!isOnline ? (
        <div className="offline-state">
          <div className="offline-icon">💤</div>
          <h3>You're currently offline</h3>
          <p>Switch to online mode to start receiving delivery requests.</p>
          <button className="btn-primary" onClick={toggleOnline}>Go Online</button>
        </div>
      ) : availableOrders.length > 0 ? (
        <div className="available-grid">
          {availableOrders.map(order => (
             <div key={order.id} className="delivery-offer-card">
               <div className="offer-header">
                 <div className="res-tag">
                   <MapPin size={14} />
                   <span>{order.restaurantName}</span>
                 </div>
                 <span className="fee-tag">₹{order.deliveryFee || 30}</span>
               </div>
               <div className="offer-body">
                 <div className="route-preview">
                   <div className="stop">
                     <div className="dot small red" />
                     <span>{order.restaurantName}</span>
                   </div>
                   <div className="line" />
                   <div className="stop">
                     <div className="dot small green" />
                     <span>{order.deliveryAddress.split(',')[0]}</span>
                   </div>
                 </div>
                 <div className="order-meta">
                   <span>{order.items.length} items</span>
                   <span className="dot">•</span>
                   <span>Approx 4.5 km</span>
                 </div>
               </div>
               <button className="accept-btn" onClick={() => handleAccept(order.id)}>
                 Accept & Navigate
               </button>
             </div>
          ))}
        </div>
      ) : (
        <div className="no-orders-state">
          <div className="no-orders-icon">🛵</div>
          <h3>Wait for it...</h3>
          <p>No new orders in your area yet. Keep the app open!</p>
        </div>
      )}

      <style>{`
        .agent-overview { animation: fadeIn 0.5s ease; }
        
        .agent-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 2.5rem; 
        }

        .status-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          border-radius: 100px;
          border: none;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .status-toggle.online { background: var(--green); color: white; }
        .status-toggle.offline { background: var(--bg-elevated); color: var(--text-muted); border: 1px solid var(--border-subtle); }
        
        .agent-stats-grid { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 1.5rem; 
          margin-bottom: 2.5rem; 
        }

        @media (max-width: 768px) {
          .agent-stats-grid { grid-template-columns: 1fr; }
        }

        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .stat-icon-bg {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon-bg.primary { background: rgba(255,107,53,0.1); color: var(--primary); }
        .stat-icon-bg.green { background: var(--green-soft); color: var(--green); }
        .stat-icon-bg.yellow { background: var(--yellow-soft); color: var(--yellow); }

        .stat-info { display: flex; flex-direction: column; }
        .stat-label { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
        .stat-value { font-size: 1.5rem; font-weight: 800; color: var(--text-main); }

        .active-card-notice {
          background: linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(255,61,0,0.05) 100%);
          border: 1px solid var(--primary);
          border-radius: var(--radius-sm);
          padding: 1.5rem;
          margin-bottom: 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .active-card-notice:hover { transform: scale(1.01); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }

        .notice-content { display: flex; gap: 1.5rem; align-items: center; }
        .notice-content h3 { margin: 0 0 4px 0; font-size: 1.15rem; }
        .notice-content p { margin: 0; color: var(--text-secondary); font-size: 0.9rem; }
        
        .bounce { animation: bounce 1s infinite alternate; }
        @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-5px); } }

        .section-title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; }
        .order-count { background: var(--primary); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 800; }

        .available-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }

        .delivery-offer-card {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1.5rem;
          transition: all 0.3s ease;
        }
        .delivery-offer-card:hover { border-color: var(--primary); transform: translateY(-5px); }

        .offer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
        .res-tag { display: flex; align-items: center; gap: 6px; color: var(--text-secondary); font-weight: 700; }
        .fee-tag { font-size: 1.15rem; font-weight: 800; color: var(--green); }

        .route-preview { margin-left: 10px; border-left: 2px solid var(--border-subtle); padding-left: 20px; margin-bottom: 1.25rem; position: relative; }
        .stop { display: flex; align-items: center; gap: 10px; position: relative; margin-bottom: 16px; }
        .stop:last-child { margin-bottom: 0; }
        .line { }
        .dot.small { width: 8px; height: 8px; border-radius: 50%; position: absolute; left: -25px; top: 50%; transform: translateY(-50%); }
        .dot.red { background: var(--red); }
        .dot.green { background: var(--green); }
        .stop span { font-size: 0.95rem; font-weight: 600; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .order-meta { font-size: 0.85rem; color: var(--text-muted); display: flex; gap: 8px; margin-bottom: 1.5rem; font-weight: 600; }
        .accept-btn { width: 100%; padding: 12px; background: var(--bg-elevated); border: 1px solid var(--primary); color: var(--primary); border-radius: 8px; font-weight: 800; cursor: pointer; transition: all 0.25s ease; }
        .accept-btn:hover { background: var(--primary); color: white; }

        .offline-state, .no-orders-state { 
          padding: 5rem 2rem; 
          text-align: center; 
          background: rgba(255,255,255,0.02); 
          border-radius: var(--radius); 
          border: 1px dashed var(--border-subtle); 
        }
        .offline-icon, .no-orders-icon { font-size: 5rem; margin-bottom: 1.5rem; }
      `}</style>
    </div>
  );
}

function ActiveDelivery() {
  const { user } = useAuth();
  const { orders, updateOrderStatus, restaurants } = useData();
  const navigate = useNavigate();

  const activeOrder = useMemo(() => {
    return orders.find(o => String(o.agentId) === String(user?.id) && o.status !== 'Delivered');
  }, [orders, user?.id]);

  if (!activeOrder) {
    return (
      <div className="empty-delivery-state">
        <div className="icon">🛵</div>
        <h2>No Active Delivery</h2>
        <p>You haven't accepted any orders yet.</p>
        <button className="btn-primary" onClick={() => navigate('/agent/')}>Find Deliveries</button>
      </div>
    );
  }

  const handleNextStatus = () => {
    const statuses = ['Confirmed', 'Preparing', 'Picked Up', 'On the Way', 'Delivered'];
    const currentIndex = statuses.indexOf(activeOrder.status);
    if (currentIndex < statuses.length - 1) {
      updateOrderStatus(activeOrder.id, statuses[currentIndex + 1]);
      toast.success(`Order status updated to: ${statuses[currentIndex + 1]}`);
      if (statuses[currentIndex + 1] === 'Delivered') {
        navigate('/agent/history');
      }
    }
  };

  return (
    <div className="active-delivery-page">
      <div className="delivery-header">
        <h1>Current Delivery</h1>
        <div className="status-pill active">{activeOrder.status}</div>
      </div>

      <div className="delivery-content">
        <OrderTracker order={activeOrder} />
        
        <div className="delivery-controls">
          <div className="controls-header">
            <h3>Delivery Controls</h3>
            <p>Update the customer on your progress</p>
          </div>
          
          <div className="buttons-stack">
            {activeOrder.status === 'Confirmed' && (
              <button className="control-btn big" onClick={handleNextStatus}>
                <CheckCircle2 size={24} />
                <span>Mark as "Preparing" at Restaurant</span>
              </button>
            )}
            {activeOrder.status === 'Preparing' && (
              <button className="control-btn big yellow" onClick={handleNextStatus}>
                <Package size={24} />
                <span>Food Picked Up - Start Delivery</span>
              </button>
            )}
            {activeOrder.status === 'Picked Up' && (
              <button className="control-btn big primary" onClick={handleNextStatus}>
                <Navigation size={24} />
                <span>On the Way to Customer</span>
              </button>
            )}
            {activeOrder.status === 'On the Way' && (
              <button className="control-btn big green" onClick={handleNextStatus}>
                <CheckCircle2 size={24} />
                <span>I have Delivered the Order</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .active-delivery-page { animation: slideUp 0.5s ease; }
        .delivery-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .delivery-header h1 { margin: 0; font-size: 1.75rem; font-weight: 800; }
        .status-pill.active { background: var(--primary); color: white; padding: 6px 16px; border-radius: 100px; font-weight: 700; font-size: 0.9rem; }

        .delivery-content { display: grid; gap: 2rem; }
        
        .delivery-controls {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius);
          padding: 2rem;
        }

        .controls-header { margin-bottom: 2rem; }
        .controls-header h3 { margin: 0 0 4px 0; font-size: 1.25rem; }
        .controls-header p { margin: 0; color: var(--text-secondary); font-size: 0.9rem; }

        .buttons-stack { display: grid; gap: 1rem; }
        
        .control-btn {
          width: 100%;
          padding: 1.5rem;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          color: var(--text-main);
          font-family: var(--font-family);
          font-weight: 800;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .control-btn:hover { transform: translateY(-3px); border-color: var(--primary); background: rgba(255,107,53,0.05); }
        .control-btn.yellow:hover { border-color: var(--yellow); background: var(--yellow-soft); }
        .control-btn.primary { background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%); border: none; }
        .control-btn.green:hover { border-color: var(--green); background: var(--green-soft); }

        .empty-delivery-state { padding: 5rem 2rem; text-align: center; }
        .empty-delivery-state .icon { font-size: 5rem; margin-bottom: 1.5rem; }
      `}</style>
    </div>
  );
}

export default function AgentDashboard() {
  const sidebarLinks = [
    { label: 'Overview', path: '/agent/', icon: Bike },
    { label: 'Active Delivery', path: '/agent/active', icon: MapIcon },
    { label: 'Earnings & History', path: '/agent/history', icon: DollarSign },
    { label: 'Performance', path: '/agent/stats', icon: TrendingUp },
  ];

  return (
    <DashboardLayout sidebarLinks={sidebarLinks} title="FoodBuddy Delivery Partners">
      <Routes>
        <Route path="/" element={<AgentOverview />} />
        <Route path="active" element={<ActiveDelivery />} />
        <Route path="history" element={<AgentHistory />} />
        <Route path="stats" element={<AgentStats />} />
      </Routes>
    </DashboardLayout>
  );
}
