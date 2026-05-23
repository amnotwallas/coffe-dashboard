import { auth } from './firebase';

// Base URL for the API. 
// For production, this should be configured via environment variables (e.g., import.meta.env.VITE_API_BASE_URL)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

let localJwtToken: string | null = null;

export const setLocalToken = (token: string | null) => {
  localJwtToken = token;
};

async function getHeaders() {
  // Use the local JWT token stored in memory instead of Firebase token directly
  return {
    'Content-Type': 'application/json',
    ...(localJwtToken ? { 'Authorization': `Bearer ${localJwtToken}` } : {}),
  };
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const api = {
  getAnalytics: async () => 
    fetch(`${BASE_URL}/api/v1/admin/analytics`, { headers: await getHeaders() }).then(handleResponse),
  
  getProducts: () => 
    fetch(`${BASE_URL}/api/v1/products/`).then(handleResponse), 
  
  createProduct: async (data: Record<string, unknown>) => 
    fetch(`${BASE_URL}/api/v1/admin/products`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  
  updateProduct: async (id: string, data: Record<string, unknown>) => 
    fetch(`${BASE_URL}/api/v1/admin/products/${id}`, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  
  deleteProduct: async (id: string) => 
    fetch(`${BASE_URL}/api/v1/admin/products/${id}`, {
      method: 'DELETE',
      headers: await getHeaders()
    }).then(handleResponse),

  getOrders: async () => 
    fetch(`${BASE_URL}/api/v1/admin/orders`, { headers: await getHeaders() }).then(handleResponse),
  
  updateOrderStatus: async (id: string, status: string) => 
    fetch(`${BASE_URL}/api/v1/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: JSON.stringify({ status })
    }).then(handleResponse),

  getNotifications: async () => 
    fetch(`${BASE_URL}/api/v1/admin/notifications`, { headers: await getHeaders() }).then(handleResponse),
  
  markNotificationRead: async (id: string) => 
    fetch(`${BASE_URL}/api/v1/admin/notifications/${id}/read`, {
      method: 'PATCH',
      headers: await getHeaders()
    }).then(handleResponse),
  
  markAllNotificationsRead: async () => 
    fetch(`${BASE_URL}/api/v1/admin/notifications/read-all`, {
      method: 'PATCH',
      headers: await getHeaders()
    }).then(handleResponse),

  loginAdmin: (token: string) => fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firebase_token: token })
  }).then(handleResponse),
};
