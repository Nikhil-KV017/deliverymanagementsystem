import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success("Welcome back to FoodBuddy!");
      navigate(`/${result.role}`);
    } else {
      toast.error(result.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="app-logo-brand">
          <div style={{ background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 60%, #fb923c 100%)', padding: '10px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.45)' }}>
            <UtensilsCrossed size={28} color="white" />
          </div>
          <h1 className="auth-title foodbuddy-logo-text">FoodBuddy</h1>
        </div>
        <p className="auth-subtitle">Unexpected guests?</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Verifying..." : "Sign In"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <p className="auth-footer">
          New to FoodBuddy? <Link to="/register" className="auth-link">Create an account</Link>
        </p>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Quick Demo: customer@foodbuddy.com / agent@foodbuddy.com
            <br />
            Password: <strong>password</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
