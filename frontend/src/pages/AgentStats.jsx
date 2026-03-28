import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, 
  TrendingUp, 
  Clock, 
  Star, 
  Target, 
  Award,
  Zap
} from 'lucide-react';

export default function AgentStats() {
  const { orders } = useData();
  const { user } = useAuth();

  const completedOrders = orders.filter(o => o.agentId === user?.id && o.status === 'Delivered');
  const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.deliveryFee || 30), 0);
  
  // Mock performance metrics
  const stats = {
    rating: 4.8,
    completionRate: "98%",
    avgDeliveryTime: "24 min",
    onTimeRate: "95%",
    totalDistance: "142 km",
    level: "Gold Tier"
  };

  return (
    <div className="stats-page">
      <div className="section-header">
        <h1>Performance Analytics</h1>
        <p>Insights into your delivery excellence</p>
      </div>

      <div className="stats-main-grid">
        <div className="performance-card tier-card">
          <div className="tier-badge">
            <Award size={40} className="primary-color" />
          </div>
          <div className="tier-info">
            <span className="label">Your Current Level</span>
            <h3>{stats.level}</h3>
            <div className="progress-bar">
              <div className="progress" style={{ width: '85%' }}></div>
            </div>
            <p className="hint">15 more deliveries to reach Platinum 🚀</p>
          </div>
        </div>

        <div className="stats-sub-grid">
          <div className="metric-card">
            <div className="metric-header">
              <Star size={20} className="yellow-color" />
              <span>Rating</span>
            </div>
            <div className="metric-value">{stats.rating}</div>
            <div className="metric-trend up">
              <TrendingUp size={14} /> +0.2 this week
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <Clock size={20} className="primary-color" />
              <span>Avg Time</span>
            </div>
            <div className="metric-value">{stats.avgDeliveryTime}</div>
            <div className="metric-trend">Top 10% in city</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <Target size={20} className="green-color" />
              <span>On-Time</span>
            </div>
            <div className="metric-value">{stats.onTimeRate}</div>
            <div className="metric-trend">Target: 90%</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <Zap size={20} className="yellow-color" />
              <span>Completion</span>
            </div>
            <div className="metric-value">{stats.completionRate}</div>
            <div className="metric-trend">Excellent</div>
          </div>
        </div>
      </div>

      <div className="earnings-chart-container">
        <div className="chart-header">
          <h3>Weekly Earnings Trend</h3>
          <div className="chart-legend">
            <span className="dot" style={{ background: 'var(--primary)' }}></span>
            <span>Earnings (₹)</span>
          </div>
        </div>
        <div className="mock-chart">
          {[120, 450, 300, 600, 400, 800, 950].map((val, i) => (
            <div key={i} className="chart-bar-wrapper">
              <div className="chart-bar" style={{ height: `${(val/1000) * 100}%` }}>
                <span className="bar-value">₹{val}</span>
              </div>
              <span className="bar-label">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stats-page { animation: fadeIn 0.5s ease; }
        .stats-main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem; }
        
        .performance-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          gap: 2rem;
          align-items: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.05);
        }

        .tier-card { background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, var(--surface) 100%); border-color: rgba(245, 158, 11, 0.2); }
        .tier-badge { width: 80px; height: 80px; background: var(--surface); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid var(--primary); }

        .tier-info { flex: 1; }
        .tier-info .label { font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
        .tier-info h3 { font-size: 1.75rem; margin: 4px 0 12px 0; letter-spacing: -0.5px; }

        .progress-bar { height: 8px; background: var(--bg-elevated); border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
        .progress { height: 100%; background: var(--primary); border-radius: 4px; box-shadow: 0 0 10px rgba(245, 158, 11, 0.3); }
        .hint { font-size: 0.8rem; color: var(--text-muted); margin: 0; }

        .stats-sub-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .metric-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: 0.2s; }
        .metric-card:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: var(--primary);}
        .metric-header { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; }
        .metric-value { font-size: 1.5rem; font-weight: 800; margin-bottom: 4px; }
        .metric-trend { font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 4px; }
        .metric-trend.up { color: var(--green); }

        .earnings-chart-container { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 2rem; margin-top: 2rem; box-shadow: 0 4px 14px rgba(0,0,0,0.05); }
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .chart-legend { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
        .chart-legend .dot { width: 10px; height: 10px; border-radius: 2px; }

        .mock-chart { height: 250px; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 1rem; border-bottom: 1px solid var(--border); }
        .chart-bar-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; max-width: 60px; }
        .chart-bar { width: 40px; background: linear-gradient(to top, var(--primary), var(--accent-soft)); border-top-left-radius: 4px; border-top-right-radius: 4px; transition: height 1s ease-out; position: relative; }
        .chart-bar:hover { filter: brightness(1.2); cursor: pointer; }
        
        .bar-value { position: absolute; top: -30px; left: 50%; transform: translateX(-50%); font-size: 0.75rem; font-weight: 800; opacity: 0; transition: 0.2s; white-space: nowrap; }
        .chart-bar-wrapper:hover .bar-value { opacity: 1; transform: translateX(-50%) translateY(-5px); }

        .bar-label { margin-top: 15px; font-size: 0.75rem; color: var(--text-muted); font-weight: 700; }

        @media (max-width: 1024px) { .stats-main-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

