import React from 'react';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';

export default function OrdersTable({ role }) {
  const { orders, users, assignAgent } = useData();

  const agents = users.filter(u => u.role === 'agent');

  const handleAssign = async (orderId, agentId) => {
    if (!agentId) return;
    await assignAgent(orderId, agentId);
    toast.success(`Agent #${agentId} assigned to Order #${orderId}`);
  };

  return (
    <div className="module-card">
      <h2>Order Management</h2>
      <p className="subtitle">System Wide Orders Settings</p>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Item</th>
              <th>Customer ID</th>
              <th>Status</th>
              <th>Destination</th>
              <th>Assigned Agent</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.item}</td>
                <td>#{o.customerId}</td>
                <td><span className={`status-badge status-${o.status.replace(/\s+/g, '-').toLowerCase()}`}>{o.status}</span></td>
                <td>{o.destination}</td>
                <td>
                  {o.status === 'Delivered' ? (
                    <span>Agent #{o.agentId}</span>
                  ) : (
                    <select 
                      className="form-input" 
                      style={{ padding: '0.5rem', width: 'auto' }}
                      value={o.agentId || ""} 
                      onChange={e => handleAssign(o.id, parseInt(e.target.value))}
                    >
                      <option value="">Unassigned</option>
                      {agents.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
