/**
 * Centralized API Configuration for Corporate Wellness Dashboard
 * Connects to Vercel production backend by default, with environment variable override & local fallback.
 */

export const VERCEL_DOMAIN_URL = 'https://b2b-wellness-g3ow.vercel.app/api';
export const VERCEL_DEPLOYMENT_URL = 'https://b2b-wellness-g3ow-8ce573pxw-shyam-s-projects-4d8c3cb5.vercel.app/api';
export const VERCEL_FULL_URL = VERCEL_DOMAIN_URL;
export const LOCAL_BACKEND_URL = 'http://localhost:8000/api';

// Default to Vercel production domain
let currentApiBaseUrl = import.meta.env.VITE_API_URL || VERCEL_DOMAIN_URL;

export const API_BASE_URL = currentApiBaseUrl;

export function getApiBaseUrl() {
  return currentApiBaseUrl;
}

export function setApiBaseUrl(url) {
  currentApiBaseUrl = url;
}

/**
 * Standard API Fetch wrapper with automatic Bearer Token attachment,
 * 404 error detection, and CORS preflight error handling.
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

    // Check for 404 Not Found
    if (response.status === 404) {
      console.warn(`[API 404 Notice] Endpoint ${url} returned 404 Not Found.`);
      return {
        ok: false,
        status: 404,
        is404Error: true,
        message: `Endpoint ${url} returned 404 Not Found. Please verify backend routes on Vercel.`,
        json: async () => ({ error: '404 Not Found' })
      };
    }

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
            message: 'Vercel Deployment Protection is active. Please disable Deployment Protection in Vercel Project Settings.',
            json: async () => body
          };
        }
      } catch (e) {
        // Not JSON
      }
    }

    return response;
  } catch (error) {
    console.error('[API Fetch Error]', error);
    
    // Catch CORS / preflight / network failures
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        ok: false,
        status: 0,
        isCorsPreflightBlocked: true,
        message: `CORS preflight error connecting to ${baseUrl}. Vercel Standard Protection is enabled or CORS headers are omitted.`,
        json: async () => ({ error: 'CORS Preflight Error' })
      };
    }

    throw error;
  }
}
