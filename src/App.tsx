import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import UserDashboard from './pages/user/UserDashboard';
import ExamBooking from './pages/user/ExamBooking';
import MyExams from './pages/user/MyExams';
import Results from './pages/user/Results';
import MyApplications from './pages/user/MyApplications';
import UserProfile from './pages/user/UserProfile';
import ExamInterface from './pages/user/ExamInterface';
import AdminDashboard from './pages/admin/AdminDashboard';
import DeveloperDashboard from './pages/admin/DeveloperDashboard';
import HRDashboard from './pages/admin/HRDashboard';
import ExaminerDashboard from './pages/admin/ExaminerDashboard';
import PageLoader from './components/PageLoader';
import VoiceChatbot from './components/VoiceChatbot';
import { useState, useEffect } from 'react';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* User Protected Routes */}
        <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/exam-booking" element={<ProtectedRoute><ExamBooking /></ProtectedRoute>} />
        <Route path="/user/my-exams" element={<ProtectedRoute><MyExams /></ProtectedRoute>} />
        <Route path="/user/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/user/applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
        <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/user/exam/:examId" element={<ProtectedRoute><ExamInterface /></ProtectedRoute>} />

        {/* Admin Protected Routes */}
        <Route path="/admin/developer" element={<ProtectedRoute requireAdmin><DeveloperDashboard /></ProtectedRoute>} />
        <Route path="/admin/hr" element={<ProtectedRoute requireAdmin><HRDashboard /></ProtectedRoute>} />
        <Route path="/admin/examiner" element={<ProtectedRoute requireAdmin><ExaminerDashboard /></ProtectedRoute>} />
      </Routes>

      <VoiceChatbot />
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
