import { createContext, useState, useEffect, useContext } from 'react';
import { useData } from './DataContext';
import { apiService } from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fd_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const { users, addUser } = useData();

  useEffect(() => {
    if (user) {
      localStorage.setItem('fd_currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('fd_currentUser');
      localStorage.removeItem('jwtToken');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      if (response && response.success && response.data) {
        setUser(response.data.user);
        if (response.data.token) localStorage.setItem('jwtToken', response.data.token);
        return { success: true, role: response.data.user.role };
      }
    } catch (error) {
      console.log("API Login failed, using mock data...");
    }
    // Fallback to mock
    const foundUser = [...users].reverse().find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return { success: true, role: foundUser.role };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      if (response && response.success && response.data) {
        return { success: true, message: "Registration successful" };
      }
    } catch (error) {
      console.log("API Register failed, using mock data...");
    }
    addUser({ ...userData, role: userData.role || 'customer' });
    return { success: true, message: "Account created!" };
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
