export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hackthon-cicada-backend1.onrender.com';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  ME: `${API_BASE_URL}/api/auth/me`,
  
  // Jobs
  JOBS: `${API_BASE_URL}/api/jobs`,
  
  // Applications
  APPLICATIONS: `${API_BASE_URL}/api/applications`,
  
  // Exams
  EXAMS: `${API_BASE_URL}/api/exams`,
  EXAM_REQUESTS: `${API_BASE_URL}/api/exam-requests`,
  
  // Blog
  BLOGS: `${API_BASE_URL}/api/blogs`,
  
  // Projects
  PROJECTS: `${API_BASE_URL}/api/projects`,
  
  // Analytics
  ANALYTICS: `${API_BASE_URL}/api/analytics`,
  
  // Email
  EMAIL: `${API_BASE_URL}/api/email`,
  
  // AI
  AI: `${API_BASE_URL}/api/ai`,
  
  // Tasks
  TASKS: `${API_BASE_URL}/api/tasks`,
  
  // Health
  HEALTH: `${API_BASE_URL}/api/health`,
};

export default API_BASE_URL;
