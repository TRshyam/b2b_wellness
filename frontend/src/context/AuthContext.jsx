import React, { createContext, useState, useEffect, useContext } from 'react';

const API_BASE = 'http://localhost:8000/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('aura_auth_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstTimeUser, setFirstTimeUser] = useState(null);

  // Fetch current authenticated user profile on mount or token change
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Token invalid');
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        // Token expired or invalid
        localStorage.removeItem('aura_auth_token');
        setToken(null);
        setUser(null);
        setLoading(false);
      });
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    if (data.first_time_setup) {
      setFirstTimeUser(data);
      return { first_time_setup: true, data };
    }

    localStorage.setItem('aura_auth_token', data.access_token);
    setToken(data.access_token);
    setUser(data.employee);
    return { first_time_setup: false, user: data.employee };
  };

  // First time password creation handler
  const createPassword = async (employeeId, newPassword) => {
    const res = await fetch(`${API_BASE}/auth/create-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: employeeId, new_password: newPassword })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Password creation failed');
    }

    localStorage.setItem('aura_auth_token', data.access_token);
    setToken(data.access_token);
    setUser(data.employee);
    setFirstTimeUser(null);
    return data.employee;
  };

  // Logout handler
  const logout = () => {
    if (token) {
      fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => {});
    }
    localStorage.removeItem('aura_auth_token');
    setToken(null);
    setUser(null);
    setFirstTimeUser(null);
  };

  // Change password handler
  const changePassword = async (oldPassword, newPassword) => {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Password change failed');
    return data;
  };

  // Auth fetch wrapper helper
  const authFetch = (url, options = {}) => {
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
    return fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        firstTimeUser,
        setFirstTimeUser,
        login,
        createPassword,
        logout,
        changePassword,
        authFetch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
