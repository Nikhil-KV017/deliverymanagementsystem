import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Search, User, Navigation } from 'lucide-react';
import { toast } from 'react-toastify';

export default function TrackingTimeline() {
  const { orders, users } = useData();
  const { user } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);

  const myOrders = orders.filter(o => o.customerId === user.id);

  const handleSearch = (e) => {
    e.preventDefault();
    // Support tracking by TRK id or strict integer ID
    const order = myOrders.find(o => o.id.toString() === searchId || o.trackingId === searchId);
    if (order) setTrackedOrder(order);
    else setTrackedOrder('not_found');
  };

  const steps = ["Pending Payment", "Assigned", "In Transit", "Delivered"];
  // Handle legacy "Pending"
  const getSimulatedStatus = (status) => status === 'Pending' ? 'Pending Payment' : status;

  return (
    <div className="module-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <MapPin size={24} color="#ec4899" />
        <h2 style={{ margin: 0 }}>Track Delivery</h2>
      </div>
      <p className="subtitle">Enter your Order ID (or TRK ID) to see live status</p>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          className="form-input" 
          style={{ paddingLeft: '1rem', maxWidth: '300px' }} 
          placeholder="e.g. TRK123456789"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
        />
        <button type="submit" className="btn-primary" style={{ width: 'auto', marginTop: 0, padding: '0 1.5rem' }}>
          <Search size={18} /> Track
        </button>
      </form>

      {trackedOrder === 'not_found' && <p style={{ color: '#ef4444' }}>Order not found or access denied.</p>}
      
      {trackedOrder && trackedOrder !== 'not_found' && (() => {
        const currentStatus = getSimulatedStatus(trackedOrder.status);
        const agent = trackedOrder.agentId ? users.find(u => u.id === trackedOrder.agentId) : null;
        
        return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.5rem' }}>{trackedOrder.item} {trackedOrder.parcelType==='sensitive'?'💎':''}</h3>
              <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Tracking ID: <span style={{ color: '#93c5fd' }}>{trackedOrder.trackingId || `#${trackedOrder.id}`}</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#6ee7b7' }}>₹{trackedOrder.price || '--'}</div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
             <div>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>From</p>
                <p style={{ margin: 0, color: '#e2e8f0', fontWeight: '500' }}>{trackedOrder.pickupLocation || 'N/A'}</p>
             </div>
             <div>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>To</p>
                <p style={{ margin: 0, color: '#e2e8f0', fontWeight: '500' }}>{trackedOrder.destination}</p>
             </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 1rem', marginBottom: agent ? '3rem' : '1rem' }}>
            {/* Timeline track */}
            <div style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '4px', background: 'var(--border)', zIndex: 1 }}>
              <div style={{ 
                height: '100%', 
                background: 'linear-gradient(90deg, #818cf8, #c084fc)', 
                width: `${(steps.indexOf(currentStatus) / (steps.length - 1)) * 100}%`,
                transition: 'width 0.5s ease'
              }} />
            </div>

            {steps.map((step, idx) => {
              const isActive = steps.indexOf(currentStatus) >= idx;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '90px' }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '50%', 
                    background: isActive ? '#6366f1' : 'var(--surface)',
                    border: `2px solid ${isActive ? '#818cf8' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '0.75rem',
                    boxShadow: isActive ? '0 0 15px rgba(99, 102, 241, 0.4)' : 'none',
                    transition: 'all 0.3s',
                    color: isActive ? '#fff' : 'var(--text-muted)'
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: isActive ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: isActive ? 600 : 400, textAlign: 'center' }}>{step}</span>
                </div>
              );
            })}
          </div>

          {/* Agent Details Card */}
          {agent && (
            <div style={{ background: 'linear-gradient(135deg, rgba(0, 198, 255, 0.05) 0%, rgba(79, 172, 254, 0.05) 100%)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(0, 198, 255, 0.2)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} /> Assigned Delivery Agent
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Name</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#f8fafc' }}>{agent.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#fcd34d', marginTop: '0.25rem' }}>★ 4.9 Rating</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Vehicle Transport</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#f8fafc', textTransform: 'capitalize' }}>{trackedOrder.transportMode || 'scooty'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>MH-12-AB-{Math.floor(1000 + Math.random() * 9000)}</div>
                </div>
              </div>
              <button className="btn-primary" style={{ marginTop: '1.5rem', width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #00f2fe', boxShadow: 'none' }} onClick={() => toast.info('Opening Live Location Map...')}>
                <Navigation size={18} color="#00f2fe" /> View Live Location on Map
              </button>
            </div>
          )}

        </div>
      )})}
    </div>
  );
}
