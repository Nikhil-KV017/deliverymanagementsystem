import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Plus, MapPin, Phone, Package, Truck, Bike, Info, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';

import { toast } from 'react-toastify';

export default function CustomerOrders() {
  const { orders, createOrder, cart, clearCart, getCartTotal, restaurants } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    item: '',
    pickupLocation: '',
    destination: '',
    receiverPhone: '',
    transportMode: 'scooty',
    parcelType: 'standard'
  });
  const [price, setPrice] = useState(0);

  const cartTotal = getCartTotal();
  const cartRestaurant = restaurants.find(r => r.id === cart.restaurantId);

  const myOrders = orders.filter(o => o.customerId === user.id);

  // ... (Dynamic Pricing Algorithm remains same)

  const handlePlaceFoodOrder = async () => {
    const orderId = await createOrder({
      customerId: user.id,
      restaurantId: cart.restaurantId,
      restaurantName: cartRestaurant.name,
      items: cart.items,
      total: cartTotal.total,
      deliveryFee: cartTotal.deliveryFee,
      status: 'Pending Payment',
      type: 'food'
    });
    clearCart();
    toast.success('Food order placed! Proceeding to payment...');
    navigate('/customer/payments');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.item || !formData.pickupLocation || !formData.destination || !formData.receiverPhone) {
      toast.warning('Please fill all required fields');
      return;
    }
    
    // Generate unique tracking ID
    const trackingId = 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    createOrder({ 
      customerId: user.id, 
      ...formData,
      price,
      trackingId,
      status: 'Pending Payment',
      type: 'parcel'
    });
    
    toast.success('Parcel request placed! Proceeding to payment...');
    setShowForm(false);
    navigate('/customer/payments');
  };

  return (
    <div className="module-card fade-in">
      <div className="section-header">
        <div>
          <h2>Order History</h2>
          <p className="subtitle">Manage your parcels and food orders</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => navigate('/customer/restaurants')}>
            Browse Restaurants
          </button>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> Send Parcel
          </button>
        </div>
      </div>

      {cart.items.length > 0 && (
        <div className="active-cart-banner">
          <div className="banner-content">
            <ShoppingBag size={24} className="primary-color" />
            <div>
              <h3>Items in your Basket</h3>
              <p>From {cartRestaurant?.name} • ₹{cartTotal.total}</p>
            </div>
          </div>
          <button className="btn-primary pulse" onClick={handlePlaceFoodOrder}>
            Checkout Now <ArrowRight size={18} />
          </button>
        </div>
      )}

      {showForm && (
        // ... (Form remains same but with updated classes/styles if needed)
        <form onSubmit={handleSubmit} className="premium-form">
          <div className="price-tag">
            <span className="tag-label">Estimated Cost</span>
            <div className="tag-val">₹{price}</div>
          </div>

          <h3 className="form-title">Send a Parcel</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Item Description</label>
              <div className="input-wrapper">
                <Package className="input-icon" size={18} />
                <input required className="form-input" name="item" value={formData.item} onChange={handleChange} placeholder="What are you sending?" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Receiver Phone</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={18} />
                <input required type="tel" className="form-input" name="receiverPhone" value={formData.receiverPhone} onChange={handleChange} placeholder="e.g. 9876543210" />
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Pickup Location</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={18} color="#ff6b35" />
                <input required className="form-input" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} placeholder="Exact pickup address" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Drop Destination</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={18} color="#22c55e" />
                <input required className="form-input" name="destination" value={formData.destination} onChange={handleChange} placeholder="Exact drop address" />
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Transport</label>
              <div className="input-wrapper">
                <Truck className="input-icon" size={18} />
                <select className="form-input" name="transportMode" value={formData.transportMode} onChange={handleChange}>
                  <option value="scooty">Scooty</option>
                  <option value="bike">Bike</option>
                  <option value="auto">Auto</option>
                  <option value="van">Van</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="input-wrapper">
                <Info className="input-icon" size={18} />
                <select className="form-input" name="parcelType" value={formData.parcelType} onChange={handleChange}>
                  <option value="standard">Standard</option>
                  <option value="sensitive">Sensitive</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary full-width">
            Confirm Parcel Details <ArrowRight size={18} />
          </button>
        </form>
      )}

      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Details</th>
              <th>Status</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.length === 0 ? (
              <tr><td colSpan="6" className="empty-row">No orders yet. Try our lightning fast delivery today! ⚡</td></tr>
            ) : myOrders.map(o => (
              <tr key={o.id}>
                <td className="id-cell">{o.trackingId || `#${o.id.toString().slice(-6)}`}</td>
                <td>
                  <div className="type-badge">
                    {o.type === 'food' ? <ShoppingBag size={14} /> : <Package size={14} />}
                    <span>{o.type === 'food' ? 'Food' : 'Parcel'}</span>
                  </div>
                </td>
                <td className="details-cell">
                  <div className="main-detail">{o.restaurantName || o.item}</div>
                  <div className="sub-detail">{o.destination || o.deliveryAddress}</div>
                </td>
                <td><span className={`status-pill ${o.status.toLowerCase().replace(' ', '-')}`}>{o.status}</span></td>
                <td className="price-cell">₹{o.total || o.price}</td>
                <td>
                  <div className="action-cell">
                    {o.status === 'Pending Payment' ? (
                      <button className="pay-btn" onClick={() => navigate('/customer/payments')}>Pay</button>
                    ) : (
                      <button className="track-btn" onClick={() => navigate('/customer/tracking')}>Track</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .section-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .active-cart-banner {
          background: linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(255,61,0,0.05) 100%);
          border: 1px solid var(--primary);
          border-radius: 16px;
          padding: 1.5rem 2rem;
          margin-bottom: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: slideUp 0.4s ease;
        }
        .banner-content { display: flex; gap: 1.5rem; align-items: center; }
        .banner-content h3 { margin: 0 0 4px 0; }
        .banner-content p { margin: 0; color: var(--text-secondary); font-weight: 600; }
        
        .premium-form { background: var(--bg-elevated); padding: 2.5rem; border-radius: 20px; border: 1px solid var(--border); margin-bottom: 3rem; position: relative; }
        .price-tag { position: absolute; top: 0; right: 0; padding: 1rem 2rem; background: rgba(255,107,53,0.1); border-bottom-left-radius: 20px; border-left: 1px solid var(--border); border-bottom: 1px solid var(--border); text-align: right; }
        .tag-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
        .tag-val { font-size: 1.75rem; font-weight: 800; color: var(--primary); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        .full-width { width: 100%; justify-content: center; gap: 12px; }

        .table-container { background: var(--surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); overflow: hidden; }
        .order-table { width: 100%; border-collapse: collapse; }
        .order-table th { background: rgba(0,0,0,0.2); color: var(--text-muted); text-align: left; padding: 1.25rem; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; }
        .order-table td { padding: 1.25rem; border-bottom: 1px solid var(--border-subtle); vertical-align: middle; }
        
        .id-cell { font-family: monospace; color: var(--primary); font-weight: 700; }
        .type-badge { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-weight: 700; font-size: 0.9rem; }
        .main-detail { font-weight: 700; margin-bottom: 4px; }
        .sub-detail { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
        .price-cell { font-weight: 800; color: var(--text-main); }
        
        .status-pill { padding: 4px 12px; border-radius: 100px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; }
        .status-pill.pending-payment { background: var(--yellow-soft); color: var(--yellow); }
        .status-pill.placed { background: var(--green-soft); color: var(--green); }
        .status-pill.assigned { background: rgba(0,198,255,0.1); color: #00c6ff; }
        
        .action-cell { display: flex; gap: 8px; }
        .pay-btn { background: var(--primary); color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 800; cursor: pointer; }
        .track-btn { background: transparent; border: 1px solid var(--primary); color: var(--primary); padding: 5px 14px; border-radius: 6px; font-weight: 800; cursor: pointer; }
        .empty-row { text-align: center; padding: 4rem; color: var(--text-muted); font-weight: 600; }
        
        .pulse { animation: pulse 2s infinite; }
      `}</style>
    </div>
  );
}
