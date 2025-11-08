// Helper function to format dates
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper function to format time
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

// Helper to validate email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Helper to generate initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

// Helper to get role label
export const getRoleLabel = (role) => {
  const labels = {
    user: 'User',
    hr: 'HR Manager',
    examiner: 'Examiner',
    developer: 'Developer',
  };
  return labels[role] || role;
};

// Helper to calculate percentage
export const calculatePercentage = (value, total) => {
  return Math.round((value / total) * 100);
};

// Helper to get status color
export const getStatusColor = (status) => {
  const colors = {
    'Under Review': '#f97316',
    'Interview Scheduled': '#14b8a6',
    'Selected': '#10b981',
    'Rejected': '#ef4444',
    'pending': '#f97316',
    'accepted': '#14b8a6',
    'done': '#10b981',
    'Active': '#10b981',
    'Closed': '#ef4444',
    'Draft': '#f97316',
    'Published': '#10b981',
  };
  return colors[status] || '#6366f1';
};

// Helper to parse JWT token
export const parseJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Helper to check if token is expired
export const isTokenExpired = (token) => {
  const decoded = parseJWT(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

// Helper to truncate text
export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};
