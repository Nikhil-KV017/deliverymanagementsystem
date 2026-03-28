import React, { useState } from 'react';
import { CreditCard, ArrowDownLeft, ArrowUpRight, DollarSign, Calendar, Search, Filter, ShieldCheck, Wallet, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function Payments() {
  const { orders } = useData();
  const { user } = useAuth();
  const [paymentSearch, setPaymentSearch] = useState('');

  // Simulated payments from orders
  const myPayments = orders
    .filter(o => String(o.customerId) === String(user?.id) && o.status !== 'Pending Payment')
    .map(o => ({
      id: `PAY-${o.id.toString().slice(-4).toUpperCase()}`,
      amount: o.total,
      date: o.date || new Date().toISOString(),
      method: o.id % 2 === 0 ? 'Visa •••• 4242' : 'UPI • foodbuddy@axl',
      status: o.status === 'Delivered' ? 'Completed' : 'Processing',
      restaurantName: o.restaurantName,
      type: 'Food Order'
    }))
    .filter(p => p.restaurantName.toLowerCase().includes(paymentSearch.toLowerCase()));

  const totalSpent = myPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="payments-page">
      <div className="section-header">
        <h1>Payments & Billing</h1>
        <p>Review your transaction history and spending</p>
      </div>

      <div className="payment-stats">
        <div className="pay-card card-gradient">
          <div className="pay-icon-glass"><DollarSign size={24} /></div>
          <div className="pay-info">
            <span className="pay-label">Total Spending</span>
            <h3 className="pay-amount">₹{totalSpent.toLocaleString()}</h3>
          </div>
          <TrendingUp className="trend-icon" size={24} />
        </div>
        
        <div className="pay-card wallet-card">
          <div className="pay-icon-glass"><Wallet size={24} /></div>
          <div className="pay-info">
            <span className="pay-label">Primary Method</span>
            <div className="method-badges">
              <span className="method-pill"><ShieldCheck size={12} /> Visa • 4242</span>
              <span className="method-pill secondary">Saved</span>
            </div>
          </div>
        </div>
      </div>

      <div className="transactions-header">
        <div className="header-left">
          <h3>Recent Transactions</h3>
          <span className="count-badge">{myPayments.length} records</span>
        </div>
        <div className="header-actions">
           <div className="mini-search">
             <Search size={16} />
             <input 
               type="text" 
               placeholder="Filter history..." 
               value={paymentSearch}
               onChange={(e) => setPaymentSearch(e.target.value)}
             />
           </div>
           <button className="icon-btn-outline"><Filter size={18} /></button>
        </div>
      </div>

      <div className="transactions-list">
        {myPayments.length > 0 ? (
          myPayments.map(p => (
            <div key={p.id} className="transaction-glass-item">
              <div className="t-status-indicator" style={{ background: p.status === 'Completed' ? 'var(--green)' : 'var(--yellow)' }} />
              <div className="t-brand-icon">
                {p.method.includes('Visa') ? '💳' : '📱'}
              </div>
              <div className="t-details">
                <div className="t-top-row">
                  <div className="t-title-col">
                    <span className="t-merchant">{p.restaurantName}</span>
                    <span className="t-id">{p.id} • {p.method}</span>
                  </div>
                  <span className="t-value">- ₹{p.amount}</span>
                </div>
                <div className="t-bottom-row">
                  <span className="t-meta">
                    <Calendar size={12} /> {new Date(p.date).toLocaleDateString()}
                  </span>
                  <span className={`t-pill ${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-transactions">
            <p>No transactions found.</p>
          </div>
        )}
      </div>

      <style>{`
        .payments-page { animation: fadeIn 0.5s ease; }
        .section-header h1 { margin: 0; font-size: 2.2rem; font-weight: 800; letter-spacing: -0.5px; }
        .section-header p { color: var(--text-muted); font-size: 1rem; font-weight: 600; margin-top: 5px; }

        .payment-stats { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; margin: 2rem 0; }
        
        .pay-card { 
          background: var(--surface); 
          border: 1px solid var(--border); 
          border-radius: 16px; 
          padding: 2.5rem; 
          display: flex; 
          align-items: center; 
          gap: 1.5rem; 
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0,0,0,0.05);
        }

        .card-gradient {
           background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
           border: none;
           box-shadow: 0 10px 30px rgba(245, 158, 11, 0.2);
        }

        .pay-icon-glass { 
           width: 60px; height: 60px; 
           background: rgba(255, 255, 255, 0.2); 
           border: 1px solid rgba(255, 255, 255, 0.3);
           border-radius: 12px; 
           display: flex; align-items: center; justify-content: center; 
           color: white;
        }

        .pay-label { font-size: 0.85rem; color: rgba(255,255,255,0.7); font-weight: 700; text-transform: uppercase; }
        .pay-amount { margin: 4px 0 0 0; font-size: 2.2rem; font-weight: 800; color: white; }

        .trend-icon { position: absolute; right: 2rem; top: 2rem; opacity: 0.3; color: white; }

        .wallet-card { background: var(--surface); }
        .wallet-card .pay-label { color: var(--text-secondary); }
        .wallet-card .pay-icon-glass { background: rgba(245, 158, 11, 0.1); border:none; color: var(--primary); }

        .method-badges { display: flex; gap: 8px; margin-top: 8px; }
        .method-pill { 
           padding: 4px 10px; 
           background: var(--bg-elevated); 
           border: 1px solid var(--border);
           border-radius: 6px; 
           font-size: 0.75rem; 
           font-weight: 800; 
           color: var(--text-main);
           display: flex; align-items: center; gap: 6px;
        }
        .method-pill.secondary { color: var(--green); background: var(--green-soft); border-color: transparent; }

        .transactions-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header-left { display: flex; align-items: baseline; gap: 12px; }
        .count-badge { padding: 2px 10px; background: rgba(255,255,255,0.05); border-radius: 100px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); }

        .header-actions { display: flex; gap: 1rem; }
        .mini-search { 
           background: var(--surface); 
           border: 1px solid var(--border); 
           border-radius: 100px; 
           padding: 0 1rem; 
           display: flex; align-items: center; gap: 10px;
           width: 200px;
           box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .mini-search input { background: transparent; border: none; padding: 10px 0; color: var(--text-main); font-size: 0.85rem; width: 100%; }
        .mini-search input:focus { outline: none; }
        .icon-btn-outline { width: 42px; height: 42px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .icon-btn-outline:hover { border-color: var(--primary); color: var(--primary); }

        .transaction-glass-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          margin-bottom: 1rem;
          transition: 0.2s;
          position: relative;
        }

        .transaction-glass-item:hover { background: #fafafa; border-color: var(--primary); transform: translateX(5px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .t-status-indicator { position: absolute; left: 0; top: 20%; bottom: 20%; width: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; }

        .t-brand-icon { width: 50px; height: 50px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        
        .t-details { flex: 1; }
        .t-top-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .t-merchant { font-weight: 800; font-size: 1.1rem; letter-spacing: -0.3px; }
        .t-id { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; margin-left: 10px; }
        .t-value { font-weight: 800; font-size: 1.1rem; color: var(--text-main); }
        
        .t-bottom-row { display: flex; justify-content: space-between; align-items: center; }
        .t-meta { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; display: flex; align-items: center; gap: 4px; }
        .t-pill { padding: 4px 10px; border-radius: 6px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; }
        .t-pill.completed { background: var(--green-soft); color: var(--green); }
        .t-pill.processing { background: var(--yellow-soft); color: var(--yellow); }

        .no-transactions { padding: 4rem; text-align: center; color: var(--text-muted); border: 1px dashed var(--border-subtle); border-radius: 20px; }

        @media (max-width: 1024px) {
          .payment-stats { grid-template-columns: 1fr; }
          .mini-search { width: 150px; }
        }
      `}</style>
    </div>
  );
}

