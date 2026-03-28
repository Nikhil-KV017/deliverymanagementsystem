import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Clock, Package, Bike, CheckCircle2, MapPin, User, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = createIcon('red');
const greenIcon = createIcon('green');
const orangeIcon = createIcon('orange');

const MapFocus = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const OrderTracker = ({ order }) => {
  const { ORDER_STATUSES, users } = useData();
  const agent = users.find(u => String(u.id) === String(order?.agentId));
  
  // Simulated positions for Mumbai-based mock
  const restaurantPos = [19.1136, 72.8697]; // Andheri
  const customerPos = [19.0760, 72.8777]; // Kurla
  
  const [agentPos, setAgentPos] = useState(restaurantPos);
  
  useEffect(() => {
    if (order?.status === 'On the Way') {
      const interval = setInterval(() => {
        setAgentPos(prev => {
          const latDiff = (customerPos[0] - restaurantPos[0]) / 50;
          const lngDiff = (customerPos[1] - restaurantPos[1]) / 50;
          const newLat = prev[0] + latDiff;
          const newLng = prev[1] + lngDiff;
          
          if (Math.abs(newLat - customerPos[0]) < 0.001) {
            clearInterval(interval);
            return customerPos;
          }
          return [newLat, newLng];
        });
      }, 2000);
      return () => clearInterval(interval);
    } else if (order?.status === 'Delivered') {
      setAgentPos(customerPos);
    } else {
      setAgentPos(restaurantPos);
    }
  }, [order?.status]);

  if (!order) return null;

  const currentStatusIndex = ORDER_STATUSES.indexOf(order.status);

  return (
    <div className="tracker-card">
      <div className="tracker-header">
        <div className="order-brief">
          <h3>Order #{order.id}</h3>
          <p>{order.restaurantName}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="status-badge animated">
            <Clock size={16} />
            <span>{order.status}</span>
          </div>
          {order.estimatedDeliveryTime && (
            <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700' }}>
              Est. Arrival: {order.estimatedDeliveryTime}
            </p>
          )}
        </div>
      </div>


      <div className="tracker-layout">
        <div className="tracker-main">
          <div className="map-container">
            <MapContainer center={agentPos} zoom={13} style={{ height: '350px', width: '100%' }} scrollWheelZoom={false}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={restaurantPos} icon={redIcon}>
                <Popup>Restaurant: {order.restaurantName}</Popup>
              </Marker>
              <Marker position={customerPos} icon={greenIcon}>
                <Popup>Your Location</Popup>
              </Marker>
              {(order.status === 'Picked Up' || order.status === 'On the Way' || order.status === 'Delivered') && (
                <Marker position={agentPos} icon={orangeIcon}>
                  <Popup>Delivery Agent: {agent?.name || 'Rider'}</Popup>
                </Marker>
              )}
              <Polyline positions={[restaurantPos, agentPos]} color="var(--primary)" dashArray="5, 10" />
              <MapFocus center={agentPos} />
            </MapContainer>
          </div>

          <div className="map-container glass">
            <MapContainer center={agentPos} zoom={13} style={{ height: '400px', width: '100%' }} scrollWheelZoom={false}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <Marker position={restaurantPos} icon={redIcon}>
                <Popup>Restaurant: {order.restaurantName}</Popup>
              </Marker>
              <Marker position={customerPos} icon={greenIcon}>
                <Popup>Your Location</Popup>
              </Marker>
              {(order.status === 'Picked Up' || order.status === 'On the Way' || order.status === 'Delivered') && (
                <Marker position={agentPos} icon={orangeIcon}>
                  <Popup>Delivery Agent: {agent?.name || 'Rider'}</Popup>
                </Marker>
              )}
              <Polyline positions={[restaurantPos, agentPos]} color="var(--primary)" dashArray="5, 10" />
              <MapFocus center={agentPos} />
            </MapContainer>
          </div>

          <div className="status-timeline-glass">
            <div className="timeline-header">
              <Clock size={18} className="primary-color" />
              <h3>Live Updates</h3>
            </div>
            <div className="timeline-list">
              {ORDER_STATUSES.map((status, index) => {
                const isCompleted = index < currentStatusIndex || order.status === 'Delivered';
                const isCurrent = index === currentStatusIndex;
                const timestamp = order.statusTimestamps?.[status];

                return (
                  <div key={status} className={`timeline-node ${isCompleted ? 'done' : ''} ${isCurrent ? 'active' : ''}`}>
                    <div className="node-marker">
                      {isCompleted ? <CheckCircle2 size={16} /> : <div className="dot" />}
                    </div>
                    <div className="node-info">
                      <span className="node-label">{status}</span>
                      {timestamp && <span className="node-time">{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {agent && (
          <div className="agent-info-card">
            <div className="agent-avatar">
              <User size={30} />
            </div>
            <div className="agent-details">
              <h4>{order.agentName || agent?.name || 'Assigned Agent'}</h4>

              <p>Your Delivery Hero</p>
              <div className="agent-actions">
                <button className="contact-btn">
                  <Phone size={16} />
                  <span>Call Rider</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .tracker-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 4px 14px rgba(0,0,0,0.05);
        }

        .tracker-header {
          padding: 1.5rem;
          background: var(--bg-color);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-brief h3 {
          margin: 0 0 4px 0;
          font-size: 1.25rem;
          font-weight: 800;
        }

        .order-brief p {
          margin: 0;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .status-badge {
          background: rgba(245, 158, 11, 0.1);
          color: var(--primary);
          border: 1px solid rgba(245, 158, 11, 0.2);
          padding: 8px 16px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.animated {
          background: var(--primary);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          animation: pulse 2s infinite;
        }

        .status-badge.animated {
          animation: pulse 2s infinite;
        }

        .tracker-layout {
          padding: 1.5rem;
        }

        .tracker-main {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 992px) {
          .tracker-main {
            grid-template-columns: 1fr;
          }
        }

        .map-container {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--bg-elevated);
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .status-timeline-glass {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .timeline-header { display: flex; align-items: center; gap: 10px; margin-bottom: 2rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; }
        .timeline-header h3 { margin: 0; font-size: 1.1rem; font-weight: 800; }

        .timeline-list { display: flex; flex-direction: column; gap: 1.5rem; }
        
        .timeline-node { display: flex; gap: 1rem; position: relative; opacity: 0.4; }
        .timeline-node.done, .timeline-node.active { opacity: 1; }
        
        .timeline-node:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 10px;
          top: 24px;
          bottom: -10px;
          width: 2px;
          background: var(--border-subtle);
        }
        .timeline-node.done:not(:last-child)::after { background: var(--primary); }

        .node-marker { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; z-index: 2; position: relative; }
        .node-marker .dot { width: 10px; height: 10px; background: var(--text-muted); border-radius: 50%; border: 3px solid var(--surface); }
        
        .timeline-node.done .node-marker { color: var(--primary); }
        .timeline-node.active .node-marker { color: var(--primary); transform: scale(1.2); }
        .timeline-node.active .node-marker::before { content: ''; position: absolute; inset: -5px; background: rgba(245, 158, 11, 0.2); border-radius: 50%; animation: pulse 1s infinite; }

        .node-info { display: flex; flex-direction: column; }
        .node-label { font-size: 0.9rem; font-weight: 700; color: var(--text-secondary); }
        .timeline-node.done .node-label, .timeline-node.active .node-label { color: var(--text-main); }
        .node-time { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

        .agent-info-card {
          background: var(--bg-color);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .agent-avatar {
          width: 50px;
          height: 50px;
          background: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(255,107,53,0.3);
        }

        .agent-details h4 {
          margin: 0 0 2px 0;
          font-size: 1.1rem;
        }

        .agent-details p {
          margin: 0 0 10px 0;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .contact-btn {
          background: var(--green-soft);
          color: var(--green);
          border: 1px solid rgba(34,197,94,0.3);
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .contact-btn:hover {
          background: var(--green);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default OrderTracker;

