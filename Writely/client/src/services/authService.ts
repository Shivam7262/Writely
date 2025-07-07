import api from './api';
import { User } from '../types';

export const registerUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { email, password });
    if (!response.data || !response.data.token) {
      throw new Error('Invalid response from server');
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (!response.data || !response.data.token) {
      throw new Error('Invalid response from server');
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    if (!response.data || !response.data.data) {
      throw new Error('Failed to load user data');
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};