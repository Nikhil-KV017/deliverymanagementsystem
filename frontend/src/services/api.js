const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://deliverymanagementsystem-11.onrender.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...getAuthHeaders(), ...options.headers },
    });
    let data;
    try { data = await response.json(); } catch (e) { data = { message: response.statusText }; }
    if (!response.ok) throw new Error(data.message || 'An error occurred with the API');
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const apiService = {
  // Auth
  login: (email, password) => fetchAPI('/users/login', {
    method: 'POST', body: JSON.stringify({ email, password }),
  }),
  register: (userData) => fetchAPI('/users/register', {
    method: 'POST', body: JSON.stringify(userData),
  }),

  // Users
  getUsers: () => fetchAPI('/users'),
  updateUserStatus: (userId, onDuty) => fetchAPI(`/users/${userId}/status`, { method: 'PUT', body: JSON.stringify({ onDuty }) }),

  // Restaurants
  getRestaurants: () => fetchAPI('/restaurants'),
  getRestaurantById: (id) => fetchAPI(`/restaurants/${id}`),
  createRestaurant: (data) => fetchAPI('/restaurants', { method: 'POST', body: JSON.stringify(data) }),
  updateRestaurant: (id, data) => fetchAPI(`/restaurants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRestaurant: (id) => fetchAPI(`/restaurants/${id}`, { method: 'DELETE' }),

  // Menu Items
  getMenuItems: (restaurantId) => fetchAPI(`/restaurants/${restaurantId}/menu`),
  createMenuItem: (restaurantId, data) => fetchAPI(`/restaurants/${restaurantId}/menu`, { method: 'POST', body: JSON.stringify(data) }),
  updateMenuItem: (restaurantId, itemId, data) => fetchAPI(`/restaurants/${restaurantId}/menu/${itemId}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStock: (restaurantId, itemId, stock) => fetchAPI(`/restaurants/${restaurantId}/menu/${itemId}/stock`, { method: 'PUT', body: JSON.stringify({ stockCount: stock }) }),
  deleteMenuItem: (restaurantId, itemId) => fetchAPI(`/restaurants/${restaurantId}/menu/${itemId}`, { method: 'DELETE' }),

  // Orders
  getOrders: () => fetchAPI('/orders'),
  createOrder: (orderData) => fetchAPI('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  updateOrderStatus: (orderId, status) => fetchAPI(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  assignAgent: (orderId, agentId, agentName, agentPhone) => fetchAPI(`/orders/${orderId}/assign`, { method: 'PUT', body: JSON.stringify({ agentId, agentName, agentPhone }) }),
  deleteOrder: (orderId) => fetchAPI(`/orders/${orderId}`, { method: 'DELETE' }),

  // Agents
  getAvailableAgents: () => fetchAPI('/agents/available'),
};
