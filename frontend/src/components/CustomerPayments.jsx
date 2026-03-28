import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { CreditCard, Wallet, Smartphone, Banknote, ShieldCheck, CheckCircle, User, Star, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerPayments() {
  const { orders, updateOrderStatus, assignAgent, users } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const pendingOrders = orders.filter(o => o.customerId === user.id && o.status === 'Pending Payment');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [assignedAgent, setAssignedAgent] = useState(null);
  const [showAgentCard, setShowAgentCard] = useState(false);

  const paymentMethods = [
    { id: 'upi', name: 'UPI (GPay, PhonePe, Paytm)', icon: <Smartphone size={24} color="#3b82f6" /> },
    { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard size={24} color="#8b5cf6" /> },
    { id: 'netbanking', name: 'Netbanking', icon: <Wallet size={24} color="#10b981" /> },
    { id: 'cod', name: 'Cash on Delivery', icon: <Banknote size={24} color="#14b8a6" /> }
  ];

  const vehicleNames = { scooty: '🛵 Scooty', bike: '🏍️ Bike', auto: '🛺 3-Seater Auto', van: '🚐 Pickup Van' };

  const handlePayment = (orderId) => {
    if (!selectedMethod) {
      toast.warning('Please select a payment method');
      return;
    }

    setProcessing(true);
    
    // Step 1: Simulate payment processing (2s)
    setTimeout(() => {
      toast.success('Payment Verified! ✅ Now assigning your DropBuddy agent...');
      
      // Step 2: Start AI loading bar for agent assignment
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Step 3: Assign agent when bar reaches 100%
            finishAssignment(orderId);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }, 2000);
  };

  const finishAssignment = async (orderId) => {
    // AI Allocation Engine: Find free on-duty agents
    const activeAgents = users.filter(u => u.role === 'agent' && u.onDuty);
    const agent = activeAgents.length > 0 
      ? activeAgents[Math.floor(Math.random() * activeAgents.length)]
      : users.find(u => u.role === 'agent') || { id: 3, name: 'Agent Smith' };
    
    const order = orders.find(o => o.id === orderId);
    const vehiclePlate = 'TS ' + Math.floor(10 + Math.random() * 90) + ' ' + ['AB', 'CD', 'EF', 'GH'][Math.floor(Math.random() * 4)] + ' ' + Math.floor(1000 + Math.random() * 9000);

    await assignAgent(orderId, agent.id);
    await updateOrderStatus(orderId, 'Assigned');


    setAssignedAgent({
      name: agent.name || 'DropBuddy Agent',
      rating: (4 + Math.random()).toFixed(1),
      vehicle: vehicleNames[order?.transportMode] || '🏍️ Bike',
      vehicleNumber: vehiclePlate,
      phone: '+91 ' + Math.floor(7000000000 + Math.random() * 3000000000),
    });
    
    setProcessing(false);
    setShowAgentCard(true);
    toast.success('Agent assigned! Your delivery is on the way! ⚡');
  };

  if (showAgentCard && assignedAgent) {
    return (
      <div className="module-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <CheckCircle size={56} color="#10b981" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.25rem' }}>Payment Successful!</h2>
          <p className="subtitle">Your DropBuddy Agent has been assigned</p>
        </div>
        
        {/* Agent Details Card */}
        <div style={{ maxWidth: '420px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(0, 198, 255, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)', border: '1px solid rgba(0, 198, 255, 0.3)', borderRadius: '20px', padding: '2rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #00f2fe, #4facfe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={28} color="#fff" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>{assignedAgent.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fcd34d', marginTop: '0.25rem' }}>
                <Star size={16} fill="#fcd34d" /> {assignedAgent.rating} Rating
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
              <span style={{ color: '#94a3b8' }}>Vehicle</span>
              <span style={{ color: '#fff', fontWeight: '600' }}>{assignedAgent.vehicle}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
              <span style={{ color: '#94a3b8' }}>Vehicle Number</span>
              <span style={{ color: '#00f2fe', fontWeight: '600' }}>{assignedAgent.vehicleNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
              <span style={{ color: '#94a3b8' }}>Contact</span>
              <span style={{ color: '#6ee7b7', fontWeight: '600' }}>{assignedAgent.phone}</span>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#a5b4fc', marginTop: '1.5rem', fontStyle: 'italic' }}>
            "Your DropBuddy is on the move! 🚀"
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button className="btn-primary" style={{ padding: '0.75rem 2rem' }} onClick={() => navigate('/customer/tracking')}>
            Track Live 📍
          </button>
          <button style={{ padding: '0.75rem 2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', color: '#cbd5e1' }} onClick={() => navigate('/customer/')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (pendingOrders.length === 0) {
    return (
      <div className="module-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
        <h2>All Caught Up!</h2>
        <p className="subtitle">You have no pending payments. Great job!</p>
        <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem', margin: '2rem auto 0' }} onClick={() => navigate('/customer/')}>
          Book a New DropBuddy
        </button>
      </div>
    );
  }

  return (
    <div className="module-card">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Secure Checkout</h2>
        <p className="subtitle" style={{ margin: 0 }}>Complete your payment — agent will be assigned right after!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Orders Pending Payment */}
        <div>
          <h3 style={{ marginBottom: '1rem', color: '#f8fafc' }}>Pending Orders</h3>
          {pendingOrders.map(order => (
            <div key={order.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>{order.item}</h4>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: {order.trackingId}</p>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00f2fe' }}>₹{order.price}</div>
              </div>
              
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <div style={{ marginBottom: '0.5rem' }}><strong>From:</strong> {order.pickupLocation}</div>
                <div style={{ marginBottom: '0.5rem' }}><strong>To:</strong> {order.destination}</div>
                <div><strong>Transport:</strong> {vehicleNames[order.transportMode] || order.transportMode}</div>
              </div>

              {/* Payment Method Selection */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                <h5 style={{ margin: '0 0 0.75rem 0', color: '#f8fafc' }}>Select Payment Method:</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {paymentMethods.map(method => (
                    <label key={method.id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', background: selectedMethod === method.id ? 'rgba(0, 198, 255, 0.1)' : 'transparent', border: `1px solid ${selectedMethod === method.id ? '#00f2fe' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method.id} 
                        checked={selectedMethod === method.id}
                        onChange={() => setSelectedMethod(method.id)}
                        style={{ marginRight: '1rem' }}
                      />
                      {method.icon}
                      <span style={{ marginLeft: '1rem', fontWeight: '500', color: selectedMethod === method.id ? '#fff' : '#cbd5e1' }}>{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Loading Bar (visible during processing) */}
              {processing && (
                <div style={{ marginTop: '1.5rem', background: 'rgba(0, 198, 255, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0, 198, 255, 0.2)' }}>
                  {loadingProgress === 0 ? (
                    <>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#8b5cf6' }}>Processing Payment...</h4>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)', animation: 'pulse 1s infinite' }}></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#00f2fe' }}>🤖 AI Matching Your DropBuddy Agent...</h4>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${loadingProgress}%`, background: 'linear-gradient(90deg, #00f2fe, #4facfe)', transition: 'width 0.1s linear' }}></div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0 0 0', textAlign: 'right' }}>{loadingProgress}% AI Matching...</p>
                    </>
                  )}
                </div>
              )}

              {!processing && (
                <button 
                  className="btn-primary" 
                  disabled={!selectedMethod}
                  onClick={() => handlePayment(order.id)}
                  style={{ width: '100%', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                  <ShieldCheck size={20} />
                  Pay ₹{order.price} & Get Agent Assigned
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Info panel */}
        <div>
           <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '16px', padding: '2rem' }}>
              <h3 style={{ color: '#c084fc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck /> 100% Safe & Secure
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                All transactions are cryptographically secured. Once your payment is verified, our advanced AI allocation engine will dynamically select the best available delivery agent for your route to ensure <em>lightning fast</em> fulfillment.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '0.75rem' }}>How It Works</h4>
              <ol style={{ color: 'var(--text-muted)', lineHeight: '2', paddingLeft: '1.25rem' }}>
                <li>Select your payment method</li>
                <li>Payment is verified securely</li>
                <li>AI assigns the closest free agent</li>
                <li>Agent details shared with you instantly!</li>
              </ol>
              
              <h4 style={{ color: '#fff', marginBottom: '0.75rem', marginTop: '1.5rem' }}>Guaranteed Protection</h4>
              <ul style={{ color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '1.25rem' }}>
                <li>End-to-end encryption</li>
                <li>No hidden charges</li>
                <li>In case of damage to the product, the company will bear the loss.</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
