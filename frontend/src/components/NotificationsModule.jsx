import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';

export default function NotificationsModule() {
  const { notifications } = useData();
  const { user } = useAuth();
  
  const myNotifs = notifications.filter(n => n.userId === user.id);

  return (
    <div className="module-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Bell size={24} color="#a855f7" />
        <h2 style={{ margin: 0 }}>Notifications</h2>
      </div>
      <p className="subtitle">Your recent updates</p>
      
      {myNotifs.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No new notifications.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myNotifs.map(n => (
            <div key={n.id} style={{
              padding: '1rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid var(--border)'
            }}>
              <p style={{ margin: 0 }}>{n.message}</p>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                {new Date(n.date).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
