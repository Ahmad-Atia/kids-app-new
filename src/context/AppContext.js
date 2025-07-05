import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AuthService from '../services/AuthService';

// Create the context
const AppContext = createContext();

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false, // Changed from true to false
  error: null,
  events: [],
  communities: [],
  authToken: null,
};

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SET_AUTH_TOKEN: 'SET_AUTH_TOKEN',
  LOGOUT: 'LOGOUT',
  SET_EVENTS: 'SET_EVENTS',
  SET_COMMUNITIES: 'SET_COMMUNITIES',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTION_TYPES.SET_USER:
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        error: null 
      };
    
    case ACTION_TYPES.SET_AUTH_TOKEN:
      return { ...state, authToken: action.payload };
    
    case ACTION_TYPES.LOGOUT:
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        authToken: null,
        error: null 
      };
    
    case ACTION_TYPES.SET_EVENTS:
      return { ...state, events: action.payload };
    
    case ACTION_TYPES.SET_COMMUNITIES:
      return { ...state, communities: action.payload };
    
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const setLoading = (loading) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
  };

  const setUser = (user) => {
    dispatch({ type: ACTION_TYPES.SET_USER, payload: user });
  };

  const setAuthToken = (token) => {
    dispatch({ type: ACTION_TYPES.SET_AUTH_TOKEN, payload: token });
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      dispatch({ type: ACTION_TYPES.LOGOUT });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const setEvents = (events) => {
    dispatch({ type: ACTION_TYPES.SET_EVENTS, payload: events });
  };

  const setCommunities = (communities) => {
    dispatch({ type: ACTION_TYPES.SET_COMMUNITIES, payload: communities });
  };

  const clearError = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  };

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Don't set loading to true for initial auth check
        const isAuthenticated = await AuthService.initializeAuth();
        if (isAuthenticated) {
          const user = await AuthService.getCurrentUser();
          console.log('[DEBUG] User initialized:', user);
          setUser(user);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Don't set error for initial auth failure
      }
      // No need to set loading to false since we didn't set it to true
    };

    initializeAuth();
  }, []);

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    setLoading,
    setError,
    setUser,
    setAuthToken,
    logout,
    setEvents,
    setCommunities,
    clearError,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Export the context for advanced usage
export { AppContext };
