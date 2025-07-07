import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '../types';
import { getCurrentUser, loginUser, registerUser } from '../services/authService';

interface AuthContextProps {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User | null; token: string } }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User | null; token: string } }
  | { type: 'USER_LOADED'; payload: User }
  | { type: 'AUTH_ERROR' }
  | { type: 'LOGIN_FAIL'; payload: string }
  | { type: 'REGISTER_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: false,
        loading: true,
        error: null,
        user: null,
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.type === 'AUTH_ERROR' ? null : action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        try {
          const res = await getCurrentUser();
          dispatch({ type: 'USER_LOADED', payload: res.data });
        } catch (err) {
          dispatch({ type: 'CLEAR_ERROR' });
        }
      } else {
        dispatch({ type: 'CLEAR_ERROR' });
      }
    };

    loadUser();
  }, []);

  const register = async (email: string, password: string) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      const res = await registerUser(email, password);
      if (!res || !res.token) {
        throw new Error('Invalid response from server');
      }
      localStorage.setItem('token', res.token);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user: null, token: res.token },
      });
      const userRes = await getCurrentUser();
      if (!userRes || !userRes.data) {
        throw new Error('Failed to load user data');
      }
      dispatch({ type: 'USER_LOADED', payload: userRes.data });
    } catch (err: any) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.error || err.message || 'Registration failed. Please try again.',
      });
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      const res = await loginUser(email, password);
      if (!res || !res.token) {
        throw new Error('Invalid response from server');
      }
      localStorage.setItem('token', res.token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: null, token: res.token },
      });
      const userRes = await getCurrentUser();
      if (!userRes || !userRes.data) {
        throw new Error('Failed to load user data');
      }
      dispatch({ type: 'USER_LOADED', payload: userRes.data });
    } catch (err: any) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.error || err.message || 'Login failed',
      });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};