import React, { useState, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import {
  BarChart3, Utensils, Bike, Users, Package,
  Plus, Edit, Trash2, Search, ArrowUpRight, TrendingUp, AlertCircle,
  ShoppingBag, Star, MapPin, ChevronRight, Bell, UserCheck, Clock, CheckCircle2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';

/* ─── Image helper: handles Unsplash URLs + emoji fallbacks ─── */
const isUrl = (s) => typeof s === 'string' && (s.startsWith('http') || s.startsWith('/'));
const RestImg = ({ src, size = 38, radius = 10, fontSize = '1.3rem' }) => {
  if (isUrl(src)) {
    return (
      <div style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', background: 'var(--bg-elevated)', flexShrink: 0 }}>
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize, flexShrink: 0 }}>
      {src || '🍽️'}
    </div>
  );
};

/* ─── Shared Admin Styles ─── */
const adminStyles = `
  .admin-page { animation: fadeIn 0.4s ease; padding-bottom: 2rem; }

  /* ─── Header Row ─── */
  .admin-header-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
  }
  .admin-header-row h2 { margin: 0 0 4px 0; font-size: 1.8rem; font-weight: 800; color: var(--text-main); }
  .admin-header-row p { margin: 0; color: var(--text-muted); font-size: 0.9rem; }

  /* ─── Action Button ─── */
  .admin-action-btn {
    background: var(--primary); color: #000; border: none;
    padding: 10px 20px; border-radius: 10px; font-weight: 800;
    font-size: 0.9rem; cursor: pointer; display: flex; align-items: center;
    gap: 8px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(245,158,11,0.3);
    font-family: var(--font-family);
  }
  .admin-action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(245,158,11,0.4); }

  /* ─── Card ─── */
  .admin-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.25);
  }
  .card-toolbar {
    padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border);
    display: flex; gap: 1rem; align-items: center; background: var(--bg-elevated);
  }
  .admin-search {
    flex: 1; background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; display: flex; align-items: center;
    padding: 0 1rem; gap: 10px; transition: all 0.2s;
  }
  .admin-search:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(245,158,11,0.12); }
  .admin-search svg { color: var(--text-muted); flex-shrink: 0; }
  .admin-search input {
    background: transparent; border: none; padding: 10px 0;
    color: var(--text-main); font-family: var(--font-family);
    font-size: 0.9rem; width: 100%;
  }
  .admin-search input:focus { outline: none; }

  /* ─── Table ─── */
  .admin-table { width: 100%; border-collapse: collapse; }
  .admin-table thead tr { background: var(--bg-elevated); }
  .admin-table th {
    text-align: left; padding: 1rem 1.5rem;
    color: var(--text-muted); font-size: 0.75rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 1px;
    border-bottom: 1px solid var(--border);
  }
  .admin-table td {
    padding: 1rem 1.5rem; border-bottom: 1px solid var(--border);
    font-size: 0.9rem; color: var(--text-main); vertical-align: middle;
  }
  .admin-table tbody tr:hover { background: rgba(245,158,11,0.03); }
  .admin-table tbody tr:last-child td { border-bottom: none; }

  /* ─── Table Cell Items ─── */
  .tbl-item { display: flex; align-items: center; gap: 12px; }
  .tbl-emoji {
    width: 38px; height: 38px; background: var(--bg-elevated);
    border: 1px solid var(--border); border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
  }
  .tbl-name { font-weight: 700; color: var(--text-main); }
  .tbl-sub { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }

  /* ─── Pills & Badges ─── */
  .pill-green { background: var(--green-soft); color: var(--green); padding: 3px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 4px; }
  .pill-yellow { background: var(--yellow-soft); color: var(--yellow); padding: 3px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 4px; }
  .pill-red { background: var(--danger-soft); color: var(--danger); padding: 3px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 4px; }
  .pill-amber { background: rgba(245,158,11,0.12); color: var(--primary); padding: 3px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 800; }
  .pill-purple { background: rgba(167,139,250,0.12); color: #a78bfa; padding: 3px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 800; }
  .pill-blue { background: rgba(56,189,248,0.12); color: #38bdf8; padding: 3px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 800; }

  /* ─── Toggle ─── */
  .feat-toggle { padding: 5px 14px; border-radius: 100px; border: none; font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: var(--font-family); }
  .feat-toggle.on { background: var(--primary); color: #000; }
  .feat-toggle.off { background: rgba(245,158,11,0.08); color: var(--primary); border: 1px solid rgba(245,158,11,0.2); }

  /* ─── Action Buttons ─── */
  .tbl-actions { display: flex; gap: 6px; }
  .tbl-btn {
    width: 32px; height: 32px; background: var(--bg-elevated);
    border: 1px solid var(--border); border-radius: 8px;
    color: var(--text-muted); display: flex; align-items: center;
    justify-content: center; cursor: pointer; transition: all 0.2s;
  }
  .tbl-btn:hover { border-color: var(--primary); color: var(--primary); background: rgba(245,158,11,0.08); }
  .tbl-btn.danger:hover { border-color: var(--danger); color: var(--danger); background: var(--danger-soft); }

  /* ─── Stock Bar ─── */
  .stock-bar-wrap { display: flex; flex-direction: column; gap: 4px; min-width: 110px; }
  .stock-bar { height: 6px; background: var(--border); border-radius: 100px; overflow: hidden; }
  .stock-bar-fill { height: 100%; background: var(--primary); border-radius: 100px; transition: width 0.5s ease; }
  .stock-bar-fill.low { background: var(--yellow); }
  .stock-count { font-size: 0.72rem; color: var(--text-muted); font-weight: 700; }

  /* ─── Stock Controls ─── */
  .stock-controls { display: flex; gap: 5px; }
  .stock-ctrl-btn {
    background: var(--bg-elevated); border: 1px solid var(--border);
    color: var(--text-main); padding: 4px 10px; border-radius: 6px;
    font-size: 0.75rem; font-weight: 800; cursor: pointer;
    transition: all 0.2s; font-family: var(--font-family);
  }
  .stock-ctrl-btn:hover { border-color: var(--primary); color: var(--primary); }
  .stock-ctrl-btn.del { display:flex; align-items:center; justify-content:center; padding: 4px 8px; }
  .stock-ctrl-btn.del:hover { border-color: var(--danger); color: var(--danger); }

  /* ─── Modal ─── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px); z-index: 2000;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem; animation: fadeIn 0.2s ease;
  }
  .admin-modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; width: 100%; max-width: 500px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    overflow: hidden; animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .modal-header {
    padding: 1.5rem; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    background: var(--bg-elevated);
  }
  .modal-header h3 { margin: 0; font-size: 1.2rem; font-weight: 800; }
  .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; max-height: 70vh; overflow-y: auto; }
  .modal-footer { padding: 1.25rem 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 1rem; }
  
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
  .form-input {
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 14px; color: var(--text-main);
    font-family: var(--font-family); outline: none; transition: all 0.2s;
  }
  .form-input:focus { border-color: var(--primary); background: var(--surface); }
  
  .btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--text-muted); padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; }
  .btn-submit { background: var(--primary); border: none; color: #000; padding: 10px 25px; border-radius: 8px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 12px rgba(245,158,11,0.2); }
`;

/* ════════════════════════════════
   ADMIN OVERVIEW
════════════════════════════════ */
function AdminOverview() {
  const { restaurants, orders, users, menuItems } = useData();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeAgents = users.filter(u => u.role === 'agent' && u.onDuty).length;
  const lowStockItems = menuItems.filter(m => m.stockCount < 5).length;
  const totalCustomers = users.filter(u => u.role === 'customer').length;

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: '↑ 12% vs last week', color: '#f59e0b', icon: '💰' },
    { label: 'Total Orders', value: orders.length, sub: '↑ 8% this week', color: '#22c55e', icon: '📦' },
    { label: 'Active Riders', value: activeAgents, sub: `${users.filter(u => u.role === 'agent').length} total registered`, color: '#38bdf8', icon: '🛵' },
    { label: 'Total Users', value: users.length, sub: `${totalCustomers} Customers`, color: '#a78bfa', icon: '👥' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="section-header">
        <h1>Admin Overview</h1>
        <p>Real-time snapshot of your FoodBuddy platform</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            borderLeft: `4px solid ${s.color}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>{s.label}</span>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: s.color, fontWeight: 700 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockItems > 0 && (
        <div style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: '14px', padding: '1rem 1.5rem', marginBottom: '2rem',
          display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)'
        }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: 700 }}>{lowStockItems} menu item{lowStockItems > 1 ? 's' : ''} are running low on stock.</span>
        </div>
      )}

      {/* Two Panel Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Top Restaurants */}
        <div className="admin-card">
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils size={18} color="var(--primary)" /> Top Restaurants
          </div>
          <div style={{ padding: '0.5rem' }}>
            {restaurants.slice(0, 5).map(r => (
              <div key={r.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.85rem 1rem', borderRadius: '10px', margin: '2px 0',
                transition: 'background 0.2s', cursor: 'default'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <RestImg src={r.image} size={36} radius={8} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.city}</div>
                  </div>
                </div>
                <span className="pill-green"><Star size={10} /> {r.rating}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-card">
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} color="var(--primary)" /> Recent Orders
          </div>
          <div style={{ padding: '0.5rem' }}>
            {orders.slice(0, 5).map(o => (
              <div key={o.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.85rem 1rem', borderRadius: '10px', margin: '2px 0', transition: 'background 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>#{o.id.slice(-6)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.restaurantName}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{o.total}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800,
                    background: o.status === 'Delivered' ? 'var(--green-soft)' : 'rgba(245,158,11,0.12)',
                    color: o.status === 'Delivered' ? 'var(--green)' : 'var(--primary)'
                  }}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{adminStyles}</style>
    </div>
  );
}

/* ════════════════════════════════
   RESTAURANT MANAGEMENT
════════════════════════════════ */
function RestaurantManagement() {
  const { restaurants, updateRestaurant, deleteRestaurant, addRestaurant } = useData();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', city: 'Mumbai', cuisine: '', image: '🍽️', address: '', deliveryTime: '20-30', deliveryFee: 30 });

  const filtered = (restaurants || []).filter(r => {
    const term = (search || '').toLowerCase();
    return (r.name || '').toLowerCase().includes(term) || 
           (r.city || '').toLowerCase().includes(term) ||
           (r.cuisine || []).some(c => (c || '').toLowerCase().includes(term));
  });

  const handleEdit = (r) => {
    setEditingId(r.id);
    setFormData({ ...r, cuisine: Array.isArray(r.cuisine) ? r.cuisine.join(', ') : r.cuisine });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: '', city: 'Mumbai', cuisine: '', image: '🍽️', address: '', deliveryTime: '20-30', deliveryFee: 30 });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cuisines = typeof formData.cuisine === 'string' ? formData.cuisine.split(',').map(c => c.trim()).filter(Boolean) : formData.cuisine;
    
    if (editingId) {
       await updateRestaurant(editingId, { ...formData, cuisine: cuisines });
       toast.success(`${formData.name} updated successfully!`);
    } else {
       await addRestaurant({ ...formData, cuisine: cuisines, rating: 4.0, featured: false });
       toast.success(`${formData.name} added to the platform!`);
    }
    setShowModal(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Restaurant Management</h2>
          <p>Control restaurant presence and visibility on FoodBuddy</p>
        </div>
        <button className="admin-action-btn" onClick={handleAddNew}>
          <Plus size={18} /> Add Restaurant
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
              <button className="tbl-btn" onClick={() => setShowModal(false)}><ArrowUpRight size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Restaurant Name</label>
                  <input className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Burger King" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>City</label>
                    <select className="form-input" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                      <option>Mumbai</option><option>Delhi</option><option>Bangalore</option><option>Pune</option><option>Hyderabad</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Logo / Emoji</label>
                    <input className="form-input" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="URL or Emoji" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Cuisines (comma separated)</label>
                  <input className="form-input" value={formData.cuisine} onChange={e => setFormData({...formData, cuisine: e.target.value})} placeholder="Burger, Fast Food, American" />
                </div>
                <div className="form-group">
                  <label>Full Address</label>
                  <input className="form-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Food Street, Area" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">{editingId ? 'Save Changes' : 'Add Restaurant'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="card-toolbar">
          <div className="admin-search">
            <Search size={16} />
            <input placeholder="Search by name or city..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, whiteSpace: 'nowrap' }}>
            {filtered.length} results
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>City</th>
                <th>Cuisine</th>
                <th>Rating</th>
                <th>Delivery</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="tbl-item">
                      <RestImg src={r.image} size={36} radius={8} />
                      <div>
                        <div className="tbl-name">{r.name}</div>
                        <div className="tbl-sub">{r.address}</div>
                      </div>
                    </div>
                  </td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}><MapPin size={13} />{r.city}</div></td>
                  <td><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{Array.isArray(r.cuisine) ? r.cuisine.join(', ') : r.cuisine}</span></td>
                  <td><span className="pill-green"><Star size={10} /> {r.rating}</span></td>
                  <td><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{r.deliveryTime} min</span></td>
                  <td>
                    <button
                      className={`feat-toggle ${r.featured ? 'on' : 'off'}`}
                      onClick={() => updateRestaurant(r.id, { featured: !r.featured })}
                    >
                      {r.featured ? '★ Featured' : 'Standard'}
                    </button>
                  </td>
                  <td>
                    <div className="tbl-actions">
                      <button className="tbl-btn" onClick={() => handleEdit(r)} title="Edit"><Edit size={15} /></button>
                      <button className="tbl-btn danger" onClick={() => { if (window.confirm(`Delete ${r.name}?`)) deleteRestaurant(r.id); }} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{adminStyles}</style>
    </div>
  );
}

/* ════════════════════════════════
   MENU & INVENTORY
════════════════════════════════ */
function MenuInventory() {
  const { restaurants, menuItems, updateMenuItem, deleteMenuItem, addMenuItem, updateStock } = useData();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ restaurantId: '', name: '', price: '', category: '', image: '🍔', description: '', veg: true, bestseller: false, stockCount: 50 });

  const filtered = (menuItems || []).filter(m => {
    const term = (search || '').toLowerCase();
    const resName = restaurants.find(r => r.id === m.restaurantId)?.name || '';
    return (m.name || '').toLowerCase().includes(term) || 
           (m.category || '').toLowerCase().includes(term) ||
           resName.toLowerCase().includes(term);
  });

  const handleEdit = (m) => {
    setEditingId(m.id);
    setFormData({ ...m });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ restaurantId: '', name: '', price: '', category: '', image: '🍔', description: '', veg: true, bestseller: false, stockCount: 50 });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateMenuItem(formData.restaurantId, editingId, formData);
      toast.success(`${formData.name} updated!`);
    } else {
      await addMenuItem(formData.restaurantId, formData);
      toast.success(`${formData.name} added to menu!`);
    }
    setShowModal(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Menu & Inventory</h2>
          <p>Global catalog control across {restaurants.length} restaurants</p>
        </div>
        <button className="admin-action-btn" onClick={handleAddNew}>
          <Plus size={18} /> New Menu Item
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
              <button className="tbl-btn" onClick={() => setShowModal(false)}><ArrowUpRight size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Select Restaurant</label>
                  <select className="form-input" required value={formData.restaurantId} onChange={e => setFormData({...formData, restaurantId: e.target.value})} disabled={!!editingId}>
                    <option value="">Select Restaurant...</option>
                    {restaurants.map(r => <option key={r.id} value={r.id}>{r.name} ({r.city})</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Item Name</label>
                    <input className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Classic Burger" />
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input className="form-input" type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Category</label>
                    <input className="form-input" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Burgers" />
                  </div>
                  <div className="form-group">
                    <label>Initial Stock</label>
                    <input className="form-input" type="number" value={formData.stockCount} onChange={e => setFormData({...formData, stockCount: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Icon / Image URL</label>
                  <input className="form-input" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="🍔" />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-input" style={{ minHeight: '60px' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Short description..." />
                </div>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={formData.veg} onChange={e => setFormData({...formData, veg: e.target.checked})} />
                    🥬 Vegetarian
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={formData.bestseller} onChange={e => setFormData({...formData, bestseller: e.target.checked})} />
                    ⭐ Bestseller
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">{editingId ? 'Save Changes' : 'Add to Menu'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="card-toolbar">
          <div className="admin-search">
            <Search size={16} />
            <input placeholder="Search items by name, category or restaurant..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            {filtered.length} items total
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Restaurant</th>
                <th>Price</th>
                <th>Inventory</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const res = restaurants.find(r => r.id === m.restaurantId);
                const isLow = m.stockCount < 10;
                return (
                  <tr key={m.id}>
                    <td>
                      <div className="tbl-item">
                        <div style={{ fontSize: '1.4rem' }}>{m.image || '🍔'}</div>
                        <div>
                          <div className="tbl-name">{m.name} {m.veg && '🟢'}</div>
                          <div className="tbl-sub">{m.category}</div>
                        </div>
                      </div>
                    </td>
                    <td><div style={{ fontSize: '0.85rem' }}>{res?.name || 'Unknown'}</div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{res?.city}</div></td>
                    <td><span style={{ fontWeight: 800 }}>₹{m.price}</span></td>
                    <td>
                      <div style={{ width: '100px' }}>
                        <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden', marginBottom: '4px' }}>
                           <div style={{ height: '100%', width: `${Math.min(100, m.stockCount)}%`, background: isLow ? 'var(--danger)' : 'var(--green)' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{m.stockCount} in stock</span>
                      </div>
                    </td>
                    <td>
                       <span style={{ 
                         padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase',
                         background: isLow ? 'var(--danger-soft)' : 'var(--green-soft)',
                         color: isLow ? 'var(--danger)' : 'var(--green)'
                       }}>
                         {isLow ? 'Low' : 'Healthy'}
                       </span>
                    </td>
                    <td>
                      <div className="tbl-actions">
                        <button className="tbl-btn" onClick={() => handleEdit(m)}><Edit size={14} /></button>
                        <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
                        <button className="tbl-btn" onClick={() => updateStock(m.restaurantId, m.id, m.stockCount + 50)} title="Add 50 stock">+50</button>
                        <button className="tbl-btn danger" onClick={() => { if(window.confirm(`Delete ${m.name}?`)) deleteMenuItem(m.id); }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <style>{adminStyles}</style>
    </div>
  );
}

/* ════════════════════════════════
   ORDER DISPATCH CENTER
════════════════════════════════ */
function OrderDispatch() {
  const { orders, users, restaurants, assignAgent, updateOrderStatus, addNotification } = useData();

  const pendingOrders = orders.filter(o => 
    (o.status === 'Placed' || o.status === 'Confirmed') && !o.agentId
  );
  const availableAgents = users.filter(u => 
    String(u.role) === 'agent' && 
    u.onDuty && 
    (!orders.some(o => String(o.agentId) === String(u.id) && o.status !== 'Delivered'))
  );

  const availableAgentsForOrder = (order) => {
    const res = restaurants.find(r => String(r.id) === String(order.restaurantId));
    return availableAgents.filter(u => res ? u.city === res.city : true);
  };

  const handleAssign = (order, agent) => {
    assignAgent(order.id, agent.id, agent.name, agent.phone || agent.email);
    updateOrderStatus(order.id, 'Confirmed');
    addNotification(
      agent.id,
      `🛵 New delivery assigned! Order #${order.id.slice(-6)} from ${order.restaurantName}. Deliver to: ${order.deliveryAddress}`
    );
    addNotification(
      order.customerId,
      `🎉 Your order #${order.id.slice(-6)} has been confirmed and a rider is on the way!`
    );
    toast.success(`✅ ${agent.name} assigned to Order #${order.id.slice(-6)}`);
  };

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Order Dispatch Center</h2>
          <p>Review incoming orders and assign available delivery agents</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {pendingOrders.length > 0 && (
            <span style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '100px', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bell size={14} /> {pendingOrders.length} Pending
            </span>
          )}
          <span style={{ background: 'var(--green-soft)', color: 'var(--green)', padding: '6px 14px', borderRadius: '100px', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UserCheck size={14} /> {availableAgents.length} Agents Free
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Pending Orders */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.8rem' }}>Incoming Orders</h3>
          {pendingOrders.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={48} style={{ marginBottom: '1rem', color: 'var(--green)' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>All caught up!</h3>
              <p>No pending orders right now.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingOrders.map(order => (
                <div key={order.id} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderLeft: '4px solid var(--primary)', borderRadius: '16px',
                  padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '4px' }}>Order #{order.id.slice(-6)}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📍 {order.restaurantName}</span>
                        <span>•</span>
                        <Clock size={13} />
                        <span>{new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--primary)' }}>₹{order.total}</div>
                      <span style={{
                        padding: '3px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 800,
                        background: order.status === 'Placed' ? 'rgba(245,158,11,0.12)' : 'var(--green-soft)',
                        color: order.status === 'Placed' ? 'var(--primary)' : 'var(--green)'
                      }}>{order.status}</span>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>🏠 Deliver to: {order.deliveryAddress}</div>
                    <div>{order.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}</div>
                  </div>

                  {order.agentId ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>
                      <UserCheck size={16} />
                      Agent assigned: {users.find(u => String(u.id) === String(order.agentId))?.name || 'Assigned'}
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assign Agent:</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {availableAgentsForOrder(order).length === 0 ? (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No agents available in this city</span>
                        ) : (
                          availableAgentsForOrder(order).map(agent => (
                            <button key={agent.id}
                              onClick={() => handleAssign(order, agent)}
                              style={{
                                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                                color: 'var(--green)', padding: '6px 14px', borderRadius: '8px',
                                fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                                fontFamily: 'var(--font-family)', transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', gap: '6px'
                              }}
                              onMouseEnter={e => { e.target.style.background = 'var(--green)'; e.target.style.color = '#000'; }}
                              onMouseLeave={e => { e.target.style.background = 'rgba(34,197,94,0.1)'; e.target.style.color = 'var(--green)'; }}
                            >
                              🛵 {agent.name} ({agent.city})
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agent Status Panel */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Agent Status</h3>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            {users.filter(u => u.role === 'agent').map((agent, i, arr) => {
              const activeDelivery = orders.find(o => String(o.agentId) === String(agent.id) && o.status !== 'Delivered');
              return (
                <div key={agent.id} style={{
                  padding: '1rem 1.25rem',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                    background: (activeDelivery) ? 'var(--yellow)' : (agent.onDuty === false) ? 'var(--text-muted)' : 'var(--green)'
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{agent.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {!agent.onDuty ? 'Off Duty' : activeDelivery ? `On delivery` : 'Available'} · {agent.city}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
      <style>{adminStyles}</style>
    </div>
  );
}


export default function AdminDashboard() {
  const sidebarLinks = [
    { label: 'Overview', path: '/admin/', icon: BarChart3 },
    { label: 'Order Dispatch', path: '/admin/dispatch', icon: Bell },
    { label: 'Restaurants', path: '/admin/restaurants', icon: Utensils },
    { label: 'Menu & Inventory', path: '/admin/inventory', icon: Package },
    { label: 'Fleet', path: '/admin/fleet', icon: Bike },
    { label: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <DashboardLayout sidebarLinks={sidebarLinks} title="FoodBuddy Admin">
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="dispatch" element={<OrderDispatch />} />
        <Route path="restaurants" element={<RestaurantManagement />} />
        <Route path="inventory" element={<MenuInventory />} />
        <Route path="fleet" element={<FleetManagement />} />
        <Route path="users" element={<UserDirectory />} />
      </Routes>
    </DashboardLayout>
  );
}
/* ════════════════════════════════
   FLEET MANAGEMENT
   ════════════════════════════════ */
function FleetManagement() {
  const { users, orders, updateUser, deleteUser, addUser } = useData();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "password", role: "agent", city: "Mumbai", onDuty: true });
  
  const agents = users.filter(u => u.role === "agent");

  const filtered = agents.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    (a.city && a.city.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddRider = (e) => {
    e.preventDefault();
    addUser(formData);
    toast.success(`Rider ${formData.name} added!`);
    setShowAddModal(false);
    setFormData({ name: "", email: "", password: "password", role: "agent", city: "Mumbai", onDuty: true });
  };

  const toggleDuty = (agent) => {
    updateUser(agent.id, { onDuty: !agent.onDuty });
    toast.success(`${agent.name} is now ${!agent.onDuty ? 'Online' : 'Offline'}`);
  };

  const handleDelete = (agent) => {
    if (window.confirm(`Are you sure you want to remove ${agent.name} from the fleet?`)) {
      deleteUser(agent.id);
      toast.error(`${agent.name} removed from fleet`);
    }
  };

  const stats = useMemo(() => {
    const online = agents.filter(a => a.onDuty).length;
    const busy = agents.filter(a => (orders || []).some(o => String(o.agentId) === String(a.id) && o.status !== "Delivered")).length;
    return { total: agents.length, online, busy, offline: agents.length - online };
  }, [agents, orders]);

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Fleet Management</h2>
          <p>Real-time oversight of your delivery network</p>
        </div>
        <button className="admin-action-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Onboard New Rider
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Fleet', value: stats.total, icon: Bike, color: 'var(--primary)' },
          { label: 'Online', value: stats.online, icon: CheckCircle2, color: 'var(--green)' },
          { label: 'Active Deliveries', value: stats.busy, icon: Clock, color: 'var(--yellow)' },
          { label: 'Off Duty', value: stats.offline, icon: AlertCircle, color: 'var(--text-muted)' },
        ].map((s, idx) => (
          <div key={idx} className="admin-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="card-toolbar" style={{ justifyContent: 'space-between' }}>
          <div className="admin-search" style={{ maxWidth: '400px' }}>
            <Search size={16} />
            <input placeholder="Search riders by name, email or city..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
             <select className="form-input" style={{ width: 'auto', padding: '6px 12px' }} value={search} onChange={e => setSearch(e.target.value)}>
               <option value="">All Cities</option>
               {Array.from(new Set(agents.map(a => a.city).filter(Boolean))).map(c => <option key={c} value={c}>{c}</option>)}
             </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rider Profile</th>
                <th>Location</th>
                <th>Shift Status</th>
                <th>Workload</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const activeOrders = (orders || []).filter(o => String(o.agentId) === String(a.id) && o.status !== "Delivered");
                const isBusy = activeOrders.length > 0;
                return (
                  <tr key={a.id}>
                    <td>
                      <div className="tbl-item">
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--bg-elevated)", border: '1px solid var(--border)', display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 800, color: "var(--primary)" }}>
                          {a.avatar || a.name.charAt(0)}
                        </div>
                        <div>
                          <div className="tbl-name">{a.name}</div>
                          <div className="tbl-sub">{a.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                         <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                         {a.city || "Not set"}
                      </div>
                    </td>
                    <td>
                      <button onClick={() => toggleDuty(a)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                        <span style={{ 
                          padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase',
                          background: isBusy ? 'var(--yellow-soft)' : a.onDuty ? 'var(--green-soft)' : 'var(--danger-soft)',
                          color: isBusy ? 'var(--yellow-dark)' : a.onDuty ? 'var(--green)' : 'var(--danger)',
                          border: `1px solid ${isBusy ? 'var(--yellow)' : a.onDuty ? 'var(--green)' : 'var(--danger)'}30`
                        }}>
                          {isBusy ? "● Busy" : a.onDuty ? "● Online" : "○ Offline"}
                        </span>
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ height: '8px', width: '60px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                           <div style={{ height: '100%', width: isBusy ? '100%' : '0%', background: 'var(--primary)', transition: '0.3s' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isBusy ? 'var(--primary)' : 'var(--text-muted)' }}>
                          {activeOrders.length} active
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="tbl-actions">
                         <button className="tbl-btn" title="View History" onClick={() => toast.info(`Viewing logs for ${a.name}`)}><Clock size={15} /></button>
                         <button className="tbl-btn danger" title="Deactivate" onClick={() => handleDelete(a)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>Onboard New Rider</h3>
              <button className="tbl-btn" onClick={() => setShowAddModal(false)}><ArrowUpRight size={18} /></button>
            </div>
            <form onSubmit={handleAddRider}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Rider Full Name" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input className="form-input" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="rider@foodbuddy.com" />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input className="form-input" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Mumbai" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Add Rider</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════
   USER DIRECTORY
   ════════════════════════════════ */
function UserDirectory() {
  const { users, deleteUser } = useData();
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>User Directory</h2>
          <p>Manage customer accounts and access levels</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="card-toolbar">
          <div className="admin-search">
            <Search size={16} />
            <input placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
            {filtered.length} total users
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="tbl-name" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 800 }}>{u.avatar || u.name.charAt(0)}</div>
                      {u.name}
                    </div>
                  </td>
                  <td>
                    <span className={`pill-${u.role === 'admin' ? 'purple' : u.role === 'agent' ? 'amber' : 'blue'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.joinDate || "Mar 2024"}</td>
                  <td><span className="pill-green">Active</span></td>
                  <td>
                    <div className="tbl-actions">
                      <button className="tbl-btn" title="View Profile" onClick={() => toast.info(`Viewing profile for ${u.name}`)}><ChevronRight size={15} /></button>
                      <button className="tbl-btn danger" title="Delete Account" onClick={() => {
                        if(window.confirm(`Delete account for ${u.name}?`)) deleteUser(u.id);
                      }}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
