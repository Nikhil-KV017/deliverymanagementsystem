import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserCircle, MapPin, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    city: 'Mumbai',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register({
      ...formData,
      onDuty: formData.role === 'agent' ? true : false
    });
    setLoading(false);
    
    if (result.success) {
      toast.success(result.message || "Welcome to FoodBuddy!");
      navigate('/login');
    } else {
      toast.error(result.message || "Something went wrong.");
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
        <p className="auth-subtitle">Join the FoodBuddy network for the best food in town.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <div className="input-wrapper">
                <UserCircle size={20} className="input-icon" />
                <select
                  className="form-input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{ paddingLeft: '3.5rem' }}
                >
                  <option value="customer">Customer</option>
                  <option value="agent">Delivery Driver</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <div className="input-wrapper">
                <MapPin size={20} className="input-icon" />
                <select
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={{ paddingLeft: '3.5rem' }}
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
