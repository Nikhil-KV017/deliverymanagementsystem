import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, MapPin, DollarSign } from 'lucide-react';

export default function AgentHistory() {
  const { orders } = useData();
  const { user } = useAuth();

  const history = orders
    .filter(o => o.agentId === user?.id && o.status === 'Delivered')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="history-page">
      <div className="section-header">
        <h1>Delivery History</h1>
        <p>Viewing all your completed deliveries</p>
      </div>

      <div className="history-list">
        {history.length > 0 ? (
          history.map(order => (
            <div key={order.id} className="history-card">
              <div className="history-card-main">
                <div className="res-info">
                  <div className="avatar">🏠</div>
                  <div>
                    <h4>{order.restaurantName}</h4>
                    <span className="date">{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="addr-info">
                  <span className="label"><MapPin size={12} /> Destination</span>
                  <p>{order.deliveryAddress}</p>
                </div>
              </div>
              <div className="history-card-side">
                <div className="fee-badge">
                  <DollarSign size={16} /> ₹{order.deliveryFee || 30}
                </div>
                <div className="status-badge">
                  <CheckCircle size={14} /> Delivered
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-history">
            <Clock size={48} />
            <p>No completed deliveries yet. Start riding!</p>
          </div>
        )}
      </div>

      <style>{`
        .history-page { animation: fadeIn 0.5s ease; }
        .history-list { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 2rem; }
        
        .history-card {
           background: var(--surface);
           border: 1px solid var(--border);
           border-radius: 12px;
           padding: 1.5rem;
           display: flex;
           justify-content: space-between;
           transition: 0.2s;
           box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .history-card:hover { border-color: var(--primary); transform: translateX(5px); }

        .history-card-main { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
        
        .res-info { display: flex; gap: 12px; align-items: center; }
        .res-info .avatar { width: 40px; height: 40px; background: rgba(245, 158, 11, 0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
        .res-info h4 { margin: 0; }
        .res-info .date { font-size: 0.8rem; color: var(--text-muted); }

        .addr-info .label { font-size: 0.75rem; color: var(--text-muted); font-weight: 800; text-transform: uppercase; display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
        .addr-info p { margin: 0; font-size: 0.95rem; font-weight: 600; }

        .history-card-side { display: flex; flex-direction: column; gap: 10px; align-items: flex-end; justify-content: space-between; }
        .fee-badge { background: var(--green-soft); color: var(--green); padding: 6px 14px; border-radius: 80px; font-weight: 800; display: flex; align-items: center; gap: 4px; }
        .status-badge { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 6px; }

        .empty-history { padding: 5rem; text-align: center; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
      `}</style>
    </div>
  );
}

