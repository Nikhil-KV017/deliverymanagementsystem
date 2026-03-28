const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(bodyParser.json());

// Mock Data
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password', role: 'customer' },
  { id: 2, name: 'Agent Smith', email: 'agent@example.com', password: 'password', role: 'agent' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' }
];

let restaurants = [
  { id: 'r1', name: "Bombay Bites", cuisine: ["Indian", "Street Food"], rating: 4.5, city: "Mumbai", address: "Andheri West, Mumbai", deliveryTime: "25-35", deliveryFee: 30, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400", featured: true },
  { id: 'r2', name: "Pizza Paradise", cuisine: ["Pizza", "Italian"], rating: 4.3, city: "Mumbai", address: "Bandra, Mumbai", deliveryTime: "30-40", deliveryFee: 40, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", featured: true },
  { id: 'r3', name: "South Spice", cuisine: ["South Indian", "Dosa"], rating: 4.6, city: "Mumbai", address: "Worli, Mumbai", deliveryTime: "20-30", deliveryFee: 25, image: "https://images.unsplash.com/photo-1589301773822-26db1a9b2361?w=400", featured: false },
  { id: 'r4', name: "Burger Barn", cuisine: ["Burgers", "American"], rating: 4.6, city: "Mumbai", address: "Powai, Mumbai", deliveryTime: "15-25", deliveryFee: 20, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", featured: true },
  { id: 'r5', name: "Sushi Sun", cuisine: ["Japanese", "Sushi"], rating: 4.8, city: "Delhi", address: "Saket, Delhi", deliveryTime: "40-50", deliveryFee: 50, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400", featured: false },
  { id: 'r6', name: "Delhi Darbar", cuisine: ["Indian", "Mughlai"], rating: 4.4, city: "Delhi", address: "Connaught Place, Delhi", deliveryTime: "25-35", deliveryFee: 35, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400", featured: true },
];



let menuItems = {
  'r1': [
    { id: 'm1', name: "Chicken Biryani", description: "Fragrant basmati rice with tender chicken", price: 280, category: "Biryani", inStock: true, stockCount: 25, image: "🍗" },
    { id: 'm2', name: "Butter Chicken", description: "Creamy tomato-based curry", price: 320, category: "Curry", inStock: true, stockCount: 20, image: "🥘" }
  ],
  'r2': [
    { id: 'm6', name: "Margherita Pizza", description: "Classic tomato and mozzarella", price: 350, category: "Pizza", inStock: true, stockCount: 18, image: "🍕" },
    { id: 'm7', name: "Pepperoni Feast", description: "Loaded with spicy pepperoni", price: 450, category: "Pizza", inStock: true, stockCount: 12, image: "🍕" }
  ],
  'r3': [
    { id: 'm10', name: "Masala Dosa", description: "Crispy rice crepe with potato filling", price: 120, category: "Dosa", inStock: true, stockCount: 40, image: "🍛" },
    { id: 'm11', name: "Idli Sambar", description: "Steamed rice cakes with lentil soup", price: 80, category: "Breakfast", inStock: true, stockCount: 50, image: "⚪" }
  ],
  'r4': [
    { id: 'm15', name: "Classic Smash Burger", description: "Double patty with cheese", price: 250, category: "Burgers", inStock: true, stockCount: 30, image: "🍔" },
    { id: 'm17', name: "Loaded Fries", description: "Crispy fries with cheese", price: 180, category: "Sides", inStock: true, stockCount: 35, image: "🍟" }
  ],
  'r5': [
    { id: 'm20', name: "Salmon Nigiri", description: "Fresh salmon over sushi rice", price: 450, category: "Sushi", inStock: true, stockCount: 10, image: "🍣" },
    { id: 'm21', name: "California Roll", description: "Crab, avocado, and cucumber", price: 350, category: "Sushi", inStock: true, stockCount: 15, image: "🍱" }
  ],
  'r6': [
    { id: 'm23', name: "Mutton Rogan Josh", description: "Slow-cooked lamb in spices", price: 380, category: "Curry", inStock: true, stockCount: 15, image: "🐑" },
    { id: 'm25', name: "Dal Makhani", description: "Rich creamy black lentil dal", price: 220, category: "Curry", inStock: true, stockCount: 25, image: "🥣" }
  ]
};




let orders = [];
let agents = [
  { id: 2, name: 'Agent Smith', status: 'available' },
  { id: 4, name: 'Agent Jones', status: 'available' }
];

// Helper to generate IDs
const generateId = (prefix = '') => prefix + Date.now();

// Auth Endpoints
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/users/register', (req, res) => {
  const newUser = { id: generateId('u'), ...req.body };
  users.push(newUser);
  res.json(newUser);
});

// Restaurant Endpoints
app.get('/api/restaurants', (req, res) => res.json(restaurants));
app.get('/api/restaurants/:id', (req, res) => {
  const restaurant = restaurants.find(r => r.id == req.params.id);
  res.json(restaurant || {});
});

app.get('/api/restaurants/:id/menu', (req, res) => {
  res.json(menuItems[req.params.id] || []);
});

// Order Endpoints
app.get('/api/orders', (req, res) => res.json(orders));

app.post('/api/orders', (req, res) => {
  const newOrder = { 
    id: generateId('ord'), 
    ...req.body, 
    status: 'Pending Payment', 
    createdAt: new Date(),
    estimatedDeliveryTime: '30 mins'
  };
  orders.push(newOrder);
  res.json(newOrder);
});


app.put('/api/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id == req.params.id);
  if (order) {
    order.status = req.body.status;
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

app.put('/api/orders/:id/assign', (req, res) => {
  const order = orders.find(o => o.id == req.params.id);
  const agent = users.find(u => u.id == req.body.agentId && u.role === 'agent');
  if (order && agent) {
    order.agentId = agent.id;
    order.agentName = agent.name;
    order.status = 'Confirmed';
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order or Agent not found' });
  }
});

// Agent Endpoints
app.get('/api/agents/available', (req, res) => {
  res.json(agents.filter(a => a.status === 'available'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
