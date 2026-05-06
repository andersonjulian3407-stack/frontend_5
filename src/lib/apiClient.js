import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api-5-1-8beo.onrender.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ── Orders ──────────────────────────────────────────────────────────────────

export const getOrders = (params = {}) =>
  apiClient.get('/orders', { params }).then((r) => r.data);

export const getOrderById = (id) =>
  apiClient.get(`/orders/${id}`).then((r) => r.data);

export const createOrder = (body) =>
  apiClient.post('/orders', body).then((r) => r.data);

export const updateOrder = (id, body) =>
  apiClient.patch(`/orders/${id}`, body).then((r) => r.data);

export const replaceOrder = (id, body) =>
  apiClient.put(`/orders/${id}`, body).then((r) => r.data);

export const deleteOrder = (id) =>
  apiClient.delete(`/orders/${id}`).then((r) => r.data);

// ── Health ───────────────────────────────────────────────────────────────────

export const getHealth = () =>
  apiClient.get('/health').then((r) => r.data);

export default apiClient;
