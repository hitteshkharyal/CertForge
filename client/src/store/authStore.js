import { create } from 'zustand';
import { authService } from '../services/authService';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.register(data);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      set({ user: result.user, token: result.token, isLoading: false });
      return result;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.login(data);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      set({ user: result.user, token: result.token, isLoading: false });
      return result;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, error: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const result = await authService.getMe();
      set({ user: result.user });
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
