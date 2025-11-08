import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hackthon-cicada2.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string, role?: string) => 
    apiClient.post('/api/auth/login', { email, password, role }),
  
  signup: (email: string, password: string, name: string, role?: string) => 
    apiClient.post('/api/auth/signup', { email, password, name, role }),
  
  logout: () => 
    apiClient.post('/api/auth/logout'),
  
  me: () => 
    apiClient.get('/api/auth/me'),
};

// Jobs API
export const jobsAPI = {
  getAll: () => apiClient.get('/api/jobs'),
  getById: (id: string) => apiClient.get(`/api/jobs/${id}`),
  create: (data: any) => apiClient.post('/api/jobs', data),
  update: (id: string, data: any) => apiClient.put(`/api/jobs/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/jobs/${id}`),
};

// Applications API
export const applicationsAPI = {
  getAll: () => apiClient.get('/api/applications'),
  getById: (id: string) => apiClient.get(`/api/applications/${id}`),
  create: (data: any) => apiClient.post('/api/applications', data),
  update: (id: string, data: any) => apiClient.put(`/api/applications/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/applications/${id}`),
};

// Exams API
export const examsAPI = {
  getAll: () => apiClient.get('/api/exams'),
  getById: (id: string) => apiClient.get(`/api/exams/${id}`),
  create: (data: any) => apiClient.post('/api/exams', data),
  update: (id: string, data: any) => apiClient.put(`/api/exams/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/exams/${id}`),
  submit: (id: string, answers: any) => apiClient.post(`/api/exams/${id}/submit`, { answers }),
};

// Exam Requests API
export const examRequestsAPI = {
  getAll: () => apiClient.get('/api/exam-requests'),
  create: (data: any) => apiClient.post('/api/exam-requests', data),
  approve: (id: string) => apiClient.put(`/api/exam-requests/${id}/approve`),
  reject: (id: string) => apiClient.put(`/api/exam-requests/${id}/reject`),
};

// Blogs API
export const blogsAPI = {
  getAll: () => apiClient.get('/api/blogs'),
  getById: (id: string) => apiClient.get(`/api/blogs/${id}`),
  create: (data: any) => apiClient.post('/api/blogs', data),
  update: (id: string, data: any) => apiClient.put(`/api/blogs/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/blogs/${id}`),
};

// Projects API
export const projectsAPI = {
  getAll: () => apiClient.get('/api/projects'),
  getById: (id: string) => apiClient.get(`/api/projects/${id}`),
  create: (data: any) => apiClient.post('/api/projects', data),
  update: (id: string, data: any) => apiClient.put(`/api/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/projects/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => apiClient.get('/api/analytics/dashboard'),
  getStats: () => apiClient.get('/api/analytics/stats'),
};

// Email API
export const emailAPI = {
  send: (data: any) => apiClient.post('/api/email/send', data),
};

// AI API
export const aiAPI = {
  chat: (message: string) => apiClient.post('/api/ai/chat', { message }),
  generateQuestions: (data: any) => apiClient.post('/api/ai/generate-questions', data),
};

// Tasks API
export const tasksAPI = {
  getAll: () => apiClient.get('/api/tasks'),
  create: (data: any) => apiClient.post('/api/tasks', data),
  update: (id: string, data: any) => apiClient.put(`/api/tasks/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/tasks/${id}`),
};

// Health Check
export const healthAPI = {
  check: () => apiClient.get('/api/health'),
};

export default apiClient;
