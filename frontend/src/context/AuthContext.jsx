import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL, apiFetch } from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('xyz_auth_token') || localStorage.getItem('aura_auth_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstTimeUser, setFirstTimeUser] = useState(null);
  const [vercelProtectedNotice, setVercelProtectedNotice] = useState(false);

  // Fetch current authenticated user profile on mount or token change
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    apiFetch('/auth/me')
      .then((res) => {
        if (res.isVercelProtected) {
          setVercelProtectedNotice(true);
          setLoading(false);
          return null;
        }
        if (!res.ok) throw new Error('Token invalid');
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUser(data);
          setVercelProtectedNotice(false);
        }
        setLoading(false);
      })
      .catch(() => {
        // Token expired or invalid
        localStorage.removeItem('xyz_auth_token');
        localStorage.removeItem('aura_auth_token');
        setToken(null);
        setUser(null);
        setLoading(false);
      });
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (res.isVercelProtected) {
        setVercelProtectedNotice(true);
        return {
          success: false,
          error: 'Vercel Deployment Protection is active on this deployment. Please disable Vercel Authentication in your Vercel Project Settings (Settings -> Deployment Protection -> Off) to allow public API authentication.'
        };
      }

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.detail || 'Login failed. Please check credentials.' };
      }

      if (data.first_time_setup) {
        setFirstTimeUser(data);
        return { success: true, first_time_setup: true, data };
      }

      localStorage.setItem('xyz_auth_token', data.access_token);
      setToken(data.access_token);
      setUser(data.employee);
      return { success: true, first_time_setup: false, user: data.employee };
    } catch (err) {
      return { success: false, error: 'Network error communicating with backend API.' };
    }
  };

  // First time password creation handler
  const createPassword = async (employeeId, newPassword) => {
    const res = await apiFetch('/auth/create-password', {
      method: 'POST',
      body: JSON.stringify({ employee_id: employeeId, new_password: newPassword })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Password creation failed');
    }

    localStorage.setItem('xyz_auth_token', data.access_token);
    setToken(data.access_token);
    setUser(data.employee);
    setFirstTimeUser(null);
    return data.employee;
  };

  // Logout handler
  const logout = () => {
    if (token) {
      apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
    }
    localStorage.removeItem('xyz_auth_token');
    localStorage.removeItem('aura_auth_token');
    setToken(null);
    setUser(null);
    setFirstTimeUser(null);
  };

  // Change password handler
  const changePassword = async (oldPassword, newPassword) => {
    const res = await apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Password change failed');
    return data;
  };

  // Auth fetch wrapper helper
  const authFetch = (endpoint, options = {}) => {
    return apiFetch(endpoint, options);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        firstTimeUser,
        setFirstTimeUser,
        vercelProtectedNotice,
        login,
        createPassword,
        logout,
        changePassword,
        authFetch,
        API_BASE_URL
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
