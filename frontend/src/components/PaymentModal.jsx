import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  CircleCheck, 
  ShieldCheck,
  ChevronRight,
  Loader2
} from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onPaymentComplete, amount }) => {
  const [method, setMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentComplete(method);
      }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal-content">
        {!isSuccess ? (
          <>
            <div className="payment-modal-header">
              <h3>Select Payment Method</h3>
              <button className="close-btn" onClick={onClose} disabled={isProcessing}>
                <X size={20} />
              </button>
            </div>

            <div className="payment-amount-banner">
              <span>Total Amount</span>
              <h2>₹{amount}</h2>
            </div>

            <div className="payment-methods-list">
              <button 
                className={`payment-method-item ${method === 'card' ? 'active' : ''}`}
                onClick={() => setMethod('card')}
                disabled={isProcessing}
              >
                <div className="method-icon"><CreditCard size={20} /></div>
                <div className="method-info">
                  <div className="method-name">Credit / Debit Card</div>
                  <div className="method-desc">Pay with Visa, Mastercard or RuPay</div>
                </div>
                {method === 'card' && <CircleCheck className="check-icon" size={18} />}
              </button>

              <button 
                className={`payment-method-item ${method === 'upi' ? 'active' : ''}`}
                onClick={() => setMethod('upi')}
                disabled={isProcessing}
              >
                <div className="method-icon"><Smartphone size={20} /></div>
                <div className="method-info">
                  <div className="method-name">UPI Payment</div>
                  <div className="method-desc">Google Pay, PhonePe, Paytm</div>
                </div>
                {method === 'upi' && <CircleCheck className="check-icon" size={18} />}
              </button>

              <button 
                className={`payment-method-item ${method === 'wallet' ? 'active' : ''}`}
                onClick={() => setMethod('wallet')}
                disabled={isProcessing}
              >
                <div className="method-icon"><Wallet size={20} /></div>
                <div className="method-info">
                  <div className="method-name">Wallets</div>
                  <div className="method-desc">Amazon Pay, Mobikwik</div>
                </div>
                {method === 'wallet' && <CircleCheck className="check-icon" size={18} />}
              </button>
            </div>

            <div className="security-badge">
              <ShieldCheck size={14} />
              <span>Secure encrypted 256-bit payment</span>
            </div>

            <button 
              className="pay-now-btn" 
              onClick={handlePay}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <><Loader2 className="spinner" size={20} /> Processing...</>
              ) : (
                <>Pay ₹{amount} <ChevronRight size={18} /></>
              )}
            </button>
          </>
        ) : (
          <div className="payment-success-screen">
            <div className="success-lottie">
              <div className="success-circle">
                <CircleCheck size={60} color="#22c55e" />
              </div>
            </div>
            <h2>Payment Successful!</h2>
            <p>Your order is being processed by the restaurant.</p>
          </div>
        )}
      </div>

      <style>{`
        .payment-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          display: flex; align-items: center; justify-content: center;
          z-index: 10000; animation: fadeIn 0.3s ease; backdrop-filter: blur(4px);
        }
        .payment-modal-content {
          background: var(--surface); width: 100%; max-width: 420px;
          border-radius: 24px; overflow: hidden; position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          border: 1px solid var(--border);
        }
        .payment-modal-header {
          padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid var(--border);
        }
        .payment-modal-header h3 { margin: 0; font-size: 1.25rem; font-weight: 800; }
        .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }

        .payment-amount-banner {
          background: rgba(245, 158, 11, 0.08); padding: 1.5rem; text-align: center;
        }
        .payment-amount-banner span { font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; }
        .payment-amount-banner h2 { margin: 4px 0 0 0; font-size: 2.5rem; font-weight: 900; color: var(--primary); }

        .payment-methods-list { padding: 1.5rem; display: flex; flex-direction: column; gap: 12px; }
        .payment-method-item {
          display: flex; align-items: center; gap: 1rem; padding: 1rem;
          background: var(--bg-elevated); border: 1px solid var(--border);
          border-radius: 16px; cursor: pointer; text-align: left;
          transition: all 0.2s ease; color: var(--text-main); font-family: var(--font-family);
        }
        .payment-method-item:hover { transform: translateY(-2px); border-color: var(--primary); }
        .payment-method-item.active { border-color: var(--primary); background: rgba(245, 158, 11, 0.04); }

        .method-icon {
          width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: center; color: var(--primary);
        }
        .method-info { flex: 1; }
        .method-name { font-weight: 800; font-size: 0.95rem; }
        .method-desc { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
        .check-icon { color: var(--green); }

        .security-badge { 
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin-bottom: 0px; color: var(--text-muted); font-size: 0.75rem; font-weight: 600;
        }

        .pay-now-btn {
          width: calc(100% - 3rem); margin: 0 1.5rem 1.5rem 1.5rem;
          padding: 1.1rem; background: var(--primary); border: none; border-radius: 16px;
          color: #000; font-weight: 900; font-size: 1.05rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: 0.2s; box-shadow: 0 8px 16px rgba(245, 158, 11, 0.2);
        }
        .pay-now-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .pay-now-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .payment-success-screen { padding: 4rem 2rem; text-align: center; }
        .success-circle { 
          width: 100px; height: 100px; background: rgba(34, 197, 94, 0.1); 
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem auto; animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .payment-success-screen h2 { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.5rem; }
        .payment-success-screen p { color: var(--text-muted); }

        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default PaymentModal;
