import React, { useState } from 'react';
import { User, Mail, MapPin, Lock, Bell, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function SettingsPage() {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    city: user?.city || '',
    address: user?.address || '123 Main St, Mumbai'
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    updateProfile(formData);
    toast.success(`${activeTab} settings saved successfully!`);
  };

  return (
    <div className="settings-page">
      <div className="section-header">
        <h1>Account Settings</h1>
        <p>Manage your profile, security and notifications</p>
      </div>

      <div className="settings-grid">
        <div className="settings-sidebar">
          {['Profile', 'Security', 'Notifications', 'Privacy'].map(tab => (
            <button 
              key={tab} 
              className={`side-nav-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Profile' && <User size={18} />}
              {tab === 'Security' && <Lock size={18} />}
              {tab === 'Notifications' && <Bell size={18} />}
              {tab === 'Privacy' && <Shield size={18} />}
              {tab}
            </button>
          ))}
        </div>

        <div className="settings-content">
          <form className="settings-form" onSubmit={handleUpdate}>
            {activeTab === 'Profile' && (
              <>
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="input-group">
                    <label><User size={16} /> Full Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label><Mail size={16} /> Email Address</label>
                    <input type="email" value={formData.email} disabled />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Address Details</h3>
                  <div className="input-group">
                    <label><MapPin size={16} /> Home City</label>
                    <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label><MapPin size={16} /> Full Address</label>
                    <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Security' && (
              <div className="form-section">
                <h3>Change Password</h3>
                <div className="input-group">
                  <label><Lock size={16} /> Current Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="input-group">
                  <label><Lock size={16} /> New Password</label>
                  <input type="password" placeholder="Min. 8 characters" />
                </div>
                <div className="input-group">
                  <label><Lock size={16} /> Confirm New Password</label>
                  <input type="password" placeholder="Confirm your new password" />
                </div>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="form-section">
                <h3>Communication Preferences</h3>
                <div className="toggle-group">
                  <label>Order Updates (SMS)</label>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="toggle-group">
                  <label>Promotional Emails</label>
                  <input type="checkbox" />
                </div>
                <div className="toggle-group">
                  <label>Push Notifications</label>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            )}

            {activeTab === 'Privacy' && (
              <div className="form-section">
                <h3>Data & Privacy</h3>
                <div className="toggle-group">
                  <label>Share usage data for personalized recommendations</label>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="toggle-group">
                  <label>Allow restaurants to view order history</label>
                  <input type="checkbox" />
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-primary">Save Changes</button>
              <button type="button" className="btn-logout" onClick={logout}>
                <LogOut size={18} /> Logout Account
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .settings-page { animation: fadeIn 0.5s ease; }
        .settings-grid { display: grid; grid-template-columns: 200px 1fr; gap: 3rem; margin-top: 2rem; }
        
        .settings-sidebar { display: flex; flex-direction: column; gap: 10px; }
        .side-nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 1rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.2s;
        }
        .side-nav-btn:hover { background: var(--bg-elevated); color: var(--text-main); }
        .side-nav-btn.active { background: rgba(245, 158, 11, 0.1); color: var(--primary); }

        .form-section { margin-bottom: 2.5rem; background: var(--surface); padding: 2rem; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .form-section h3 { margin-bottom: 1.5rem; color: var(--text-main); font-size: 1.1rem; }
        
        .toggle-group { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); }
        .toggle-group:last-child { border-bottom: none; }
        .toggle-group label { font-weight: 600; font-size: 0.95rem; }

        .input-group { margin-bottom: 1.25rem; }
        .input-group label { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-muted); font-weight: 700; margin-bottom: 8px; }
        .input-group input, .input-group textarea {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px;
          color: var(--text-main);
          font-family: var(--font-family);
        }
        .input-group input:focus { border-color: var(--primary); outline: none; }
        .input-group textarea { height: 100px; resize: none; }

        .form-actions { display: flex; justify-content: space-between; align-items: center; }
        .btn-logout { background: transparent; border: 1px solid #ff4d4d; color: #ff4d4d; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        
        @media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr; } .settings-sidebar { display: none; } }
      `}</style>
    </div>
  );
}

