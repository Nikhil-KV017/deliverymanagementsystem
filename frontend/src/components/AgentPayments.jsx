import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';
import { Landmark, IndianRupee, History, Building, Wallet, TrendingUp } from 'lucide-react';

export default function AgentPayments() {
  const { user } = useAuth();
  const { orders } = useData();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({ account: '', ifsc: '', holder: '' });

  const myOrders = orders.filter(o => o.agentId === user.id && o.status === 'Delivered');
  
  // Calculate earnings: Mocking 80% of delivery fare goes to Agent
  const totalEarnings = myOrders.reduce((acc, o) => acc + (o.price ? o.price * 0.8 : 50), 0);
  
  // We'll use local state for current balance since we don't have a backend wallet model
  const [balance, setBalance] = useState(totalEarnings || 1500); // Base mock balance for demo

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    
    if (!bankDetails.account || !bankDetails.ifsc || !bankDetails.holder) {
      toast.warning('Please fill all Indian bank account details');
      return;
    }
    
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifsc.toUpperCase())) {
      toast.error('Invalid IFSC Code format');
      return;
    }

    if (!amount || amount > balance) {
      toast.error('Invalid withdrawal amount (Exceeds balance)');
      return;
    }
    
    if (amount > 10000) {
      toast.error('Maximum withdrawal limit is ₹10000 per transaction');
      return;
    }
    
    if (amount < 100) {
      toast.warning('Minimum withdrawal is ₹100');
      return;
    }

    // Process mock withdrawal
    setBalance(prev => prev - amount);
    toast.success(`₹${amount} swift transfer initiated to ${bankDetails.holder}'s account! ⚡`);
    setWithdrawAmount('');
  };

  return (
    <div className="module-card">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Earnings & Withdrawals</h2>
        <p className="subtitle" style={{ margin: 0 }}>Manage your daily savings and bank transfers.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <div className="stat-header">
            <h3 style={{ color: '#6ce7b7' }}>Available Balance</h3>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
              <Wallet size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#fff' }}>₹{balance.toLocaleString('en-IN')}</div>
          <p className="stat-desc">Ready to instantly withdraw</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <h3>Lifetime Earnings</h3>
            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-value">₹{totalEarnings.toLocaleString('en-IN')}</div>
          <p className="stat-desc">Total across {myOrders.length} successful deliveries</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Withdrawal Form */}
        <div style={{ background: 'rgba(10, 15, 30, 0.4)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Building color="#00f2fe" size={24} />
            <h3 style={{ margin: 0, color: '#f8fafc' }}>Withdraw to Bank Account</h3>
          </div>
          
          <form onSubmit={handleWithdraw}>
            <div className="form-group">
              <label className="form-label">Account Holder Name</label>
              <input required className="form-input" placeholder="As per bank record" value={bankDetails.holder} onChange={e => setBankDetails({...bankDetails, holder: e.target.value})} style={{ paddingLeft: '1rem', background: 'rgba(255,255,255,0.03)' }} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Bank Account Number</label>
              <input required type="password" placeholder="Enter Indian Bank A/C No" className="form-input" value={bankDetails.account} onChange={e => setBankDetails({...bankDetails, account: e.target.value})} style={{ paddingLeft: '1rem', background: 'rgba(255,255,255,0.03)' }} />
            </div>
            
            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input required className="form-input" placeholder="e.g. SBIN0001234" value={bankDetails.ifsc} onChange={e => setBankDetails({...bankDetails, ifsc: e.target.value})} style={{ paddingLeft: '1rem', background: 'rgba(255,255,255,0.03)', textTransform: 'uppercase' }} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <div className="input-wrapper">
                <IndianRupee className="input-icon" size={18} />
                <input required type="number" min="100" max={Math.min(balance, 10000)} className="form-input" placeholder="0.00" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={balance < 100}>
              <Landmark size={18} style={{ marginRight: '0.5rem' }} /> Request IMPS Transfer
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
              IMPS transfers are processed automatically 24/7.
            </p>
          </form>
        </div>

        {/* Recent Transactions placeholder */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
           <h3 style={{ margin: '0 0 1.5rem 0', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={20} color="#a5b4fc" /> Recent Payouts
           </h3>
           
           <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                 <IndianRupee size={24} color="#64748b" />
              </div>
              <p>No recent withdrawals</p>
              <p style={{ fontSize: '0.85rem' }}>Your payout history will appear here once you initiate a transfer.</p>
           </div>
        </div>

      </div>
    </div>
  );
}
