/**
 * Centralized API Configuration for Corporate Wellness Dashboard
 * Connects to Vercel production backend by default, with environment variable override & local fallback.
 */

export const VERCEL_BACKEND_URL = 'https://b2b-wellness-g3ow.vercel.app/api';
export const LOCAL_BACKEND_URL = 'http://localhost:8000/api';

// Prioritize environment variable (VITE_API_URL), then Vercel deployed backend
let currentApiBaseUrl = import.meta.env.VITE_API_URL || VERCEL_BACKEND_URL;

export const API_BASE_URL = currentApiBaseUrl;

export function getApiBaseUrl() {
  return currentApiBaseUrl;
}

export function setApiBaseUrl(url) {
  currentApiBaseUrl = url;
}

/**
 * Standard API Fetch wrapper with automatic Bearer Token attachment,
 * Vercel Deployment Protection preflight detection, and CORS error handling.
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('xyz_auth_token') || localStorage.getItem('aura_auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, { ...options, headers });

    // Check for Vercel Deployment Protection 401 response
    if (response.status === 401) {
      const clone = response.clone();
      try {
        const body = await clone.json();
        if (body?.error?.message === 'Protected deployment' || body?.protection) {
          console.warn('[Vercel API Notice] Vercel Deployment Protection is active on this deployment.');
          return {
            ok: false,
            status: 401,
            isVercelProtected: true,
            message: 'Vercel Deployment Protection is active. Please disable Vercel Authentication in Project Settings to enable public API endpoints.',
            json: async () => body
          };
        }
      } catch (e) {
        // Not a JSON response
      }
    }

    return response;
  } catch (error) {
    console.error('[API Fetch Error]', error);
    
    // Check if error is a CORS / preflight failure caused by Vercel Protection redirect
    if (error instanceof TypeError && error.message.includes('Failed to fetch') && baseUrl.includes('vercel.app')) {
      return {
        ok: false,
        status: 0,
        isCorsPreflightBlocked: true,
        isVercelProtected: true,
        message: 'Vercel Deployment Protection is redirecting OPTIONS preflight CORS requests. Please disable Vercel Authentication in Vercel Project Settings (Settings -> Deployment Protection -> Off) or switch to local server.',
        json: async () => ({ error: 'CORS Preflight Redirect Blocked' })
      };
    }

    throw error;
  }
}
