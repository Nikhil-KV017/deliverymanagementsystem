import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Map, MapPin, Phone, User, Navigation2 } from 'lucide-react';

export default function AgentOrders() {
  const { orders, updateOrderStatus, users } = useData();
  const { user } = useAuth();
  
  const myDeliveries = orders.filter(o => o.agentId === user.id && o.status !== 'Delivered');
  const pastDeliveries = orders.filter(o => o.agentId === user.id && o.status === 'Delivered');

  const statuses = ["Assigned", "In Transit", "Delivered"];

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    toast.success(`Order marked as ${newStatus}`);
  };

  const openNavigation = (destination) => {
    toast.info(`Opening GPS Navigation to: ${destination}`);
  };

  return (
    <div className="module-card">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Active Deliveries</h2>
        <p className="subtitle">Manage and navigate to your assigned drops</p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {myDeliveries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
             <p style={{ color: 'var(--text-muted)' }}>No active deliveries right now. Take a break!</p>
          </div>
        ) : myDeliveries.map(o => {
          const customer = users.find(u => u.id === o.customerId) || { name: 'Guest User' };
          
          return (
          <div key={o.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem' }}>{o.item} {o.parcelType === 'sensitive' ? '💎' : ''}</h3>
                <span className={`status-badge status-${o.status.replace(/\s+/g, '-').toLowerCase()}`} style={{ marginTop: '0.5rem', display: 'inline-block' }}>{o.status}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#6ee7b7' }}>₹{o.price ? Math.round(o.price * 0.8) : '--'} <span style={{fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:'normal'}}>Earnings</span></div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: {o.trackingId || `#${o.id}`}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <User size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer</div>
                  <div style={{ fontWeight: '500', color: '#e2e8f0' }}>{customer.name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Phone size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Receiver Contact</div>
                  <div style={{ fontWeight: '500', color: '#e2e8f0' }}>{o.receiverPhone || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                 <MapPin size={20} color="#fca5a5" style={{ flexShrink: 0, marginTop: '2px' }} />
                 <div>
                   <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Pickup</div>
                   <div style={{ color: '#f8fafc', lineHeight: 1.4 }}>{o.pickupLocation || 'N/A'}</div>
                 </div>
              </div>
              <div style={{ width: '2px', height: '20px', background: 'var(--border)', margin: '-0.5rem 0 -0.5rem 9px' }}></div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                 <MapPin size={20} color="#6ee7b7" style={{ flexShrink: 0, marginTop: '2px' }} />
                 <div>
                   <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Drop-off</div>
                   <div style={{ color: '#f8fafc', lineHeight: 1.4 }}>{o.destination}</div>
                 </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <button className="btn-primary" style={{ margin: 0, width: 'auto', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #00f2fe', color: '#00f2fe' }} onClick={() => openNavigation(o.destination)}>
                <Navigation2 size={18} /> GPS Navigate
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Update Status:</span>
                <select 
                  className="form-input" 
                  style={{ padding: '0.5rem 1rem', width: 'auto', background: 'rgba(0,0,0,0.3)' }}
                  value={o.status} 
                  onChange={e => handleStatusChange(o.id, e.target.value)}
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )})}
      </div>
      
      {pastDeliveries.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Recently Completed</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item</th>
                  <th>Destination</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pastDeliveries.map(o => (
                  <tr key={o.id}>
                    <td>{o.trackingId || `#${o.id}`}</td>
                    <td>{o.item}</td>
                    <td>{o.destination}</td>
                    <td><span className="status-badge status-delivered">Delivered</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
