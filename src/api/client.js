import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to every request
apiClient.interceptors.request.use(
  (config) => {
    console.log('🌐 API Request:', config.method.toUpperCase(), config.url);
    console.log('📦 Request data type:', config.data instanceof FormData ? 'FormData' : typeof config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData (browser will set it with boundary)
    if (!(config.data instanceof FormData)) {
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    console.log('📋 Request headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle responses and errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, error.response?.status, error.message);
    console.error('Error details:', error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Auth APIs
export const authAPI = {
  signup: (email, password, name, role) =>
    apiClient.post('/auth/signup', { email, password, name, role }),
  login: (email, password, role) =>
    apiClient.post('/auth/login', { email, password, role }),
  getProfile: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  logout: () => apiClient.post('/auth/logout'),
};

// Job APIs
export const jobAPI = {
  getAll: () => apiClient.get('/jobs'),
  getById: (id) => apiClient.get(`/jobs/${id}`),
  create: (data) => apiClient.post('/jobs', data),
  update: (id, data) => apiClient.put(`/jobs/${id}`, data),
  delete: (id) => apiClient.delete(`/jobs/${id}`),
  getStats: () => apiClient.get('/jobs/stats'),
};

// Application APIs
export const applicationAPI = {
  submit: (formData) => {
    // Let axios/browser set Content-Type with boundary for multipart
    return apiClient.post('/applications', formData);
  },
  getMyApplications: () => apiClient.get('/applications'),
  getAllApplications: () => apiClient.get('/applications/all'),
  getById: (id) => apiClient.get(`/applications/${id}`),
  updateStatus: (id, status, interviewDate, interviewTime) =>
    apiClient.put(`/applications/${id}/status`, {
      status,
      interviewDate,
      interviewTime,
    }),
};

// Exam APIs
export const examAPI = {
  getAll: () => apiClient.get('/exams'),
  getById: (id) => apiClient.get(`/exams/${id}`),
  create: (data) => apiClient.post('/exams', data),
  update: (id, data) => apiClient.put(`/exams/${id}`, data),
  delete: (id) => apiClient.delete(`/exams/${id}`),
  submit: (id, data) => apiClient.post(`/exams/${id}/submit`, data),
  getResults: () => apiClient.get('/exams/user/results'),
};

// Exam Request APIs
export const examRequestAPI = {
  getAll: () => apiClient.get('/exam-requests'),
  create: (data) => apiClient.post('/exam-requests', data),
  accept: (id) => apiClient.post(`/exam-requests/${id}/accept`),
  reject: (id) => apiClient.post(`/exam-requests/${id}/reject`),
  linkExam: (requestId, examId) => apiClient.post('/exam-requests/link-exam', { requestId, examId }),
  delete: (id) => apiClient.delete(`/exam-requests/${id}`),
};

// Blog APIs
export const blogAPI = {
  getAll: () => apiClient.get('/blogs'),
  getAllForAdmin: () => apiClient.get('/blogs/admin/all'),
  getById: (id) => apiClient.get(`/blogs/${id}`),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return apiClient.post('/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, data) => apiClient.put(`/blogs/${id}`, data),
  delete: (id) => apiClient.delete(`/blogs/${id}`),
  publish: (id) => apiClient.post(`/blogs/${id}/publish`),
};

// Project APIs
export const projectAPI = {
  getAll: () => apiClient.get('/projects'),
  getAllForAdmin: () => apiClient.get('/projects/admin/all'),
  getById: (id) => apiClient.get(`/projects/${id}`),
  create: (data) => apiClient.post('/projects', data),
  update: (id, data) => apiClient.put(`/projects/${id}`, data),
  delete: (id) => apiClient.delete(`/projects/${id}`),
};

// Analytics APIs
export const analyticsAPI = {
  track: (data) => apiClient.post('/analytics/track', data),
  getDashboard: () => apiClient.get('/analytics/dashboard'),
  getSummary: () => apiClient.get('/analytics/summary'),
};

// Email APIs
export const emailAPI = {
  sendContact: (data) => apiClient.post('/email/contact', data),
  sendApplicationStatus: (data) =>
    apiClient.post('/email/application-status', data),
  sendBulk: (data) => apiClient.post('/email/bulk', data),
  sendCustom: (data) => apiClient.post('/email/custom', data),
};

// AI APIs
export const aiAPI = {
  resumeFilter: (resumeText) =>
    apiClient.post('/ai/resume-filter', { resumeText }),
  blogSummary: (title, content) =>
    apiClient.post('/ai/blog-summary', { title, content }),
  evaluate: (examId, answers, questions) =>
    apiClient.post('/ai/evaluate', { examId, answers, questions }),
  cheatAnalyze: (violations) =>
    apiClient.post('/ai/cheat-analyze', { violations }),
  chat: (message) => apiClient.post('/ai/chat', { message }),
  generateSummary: (data) => apiClient.post('/ai/summary', data),
  chatbot: (message) =>
    apiClient.post('/ai/chatbot', { question: message }),
};

// Task APIs
export const taskAPI = {
  getAll: () => apiClient.get('/tasks'),
  create: (data) => apiClient.post('/tasks', data),
  update: (id, data) => apiClient.put(`/tasks/${id}`, data),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
  getStats: () => apiClient.get('/tasks/stats'),
};
