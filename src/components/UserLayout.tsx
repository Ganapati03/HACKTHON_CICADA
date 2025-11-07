import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Brain, LayoutDashboard, Calendar, FileText, Award, Briefcase, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/user/exam-booking', icon: Calendar, label: 'Exam Booking' },
    { path: '/user/my-exams', icon: FileText, label: 'My Exams' },
    { path: '/user/results', icon: Award, label: 'Results' },
    { path: '/user/applications', icon: Briefcase, label: 'Applications' },
    { path: '/user/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-gradient-to-b from-[#1e293b] to-[#0f172a] border-r border-[#6366f1]/20 fixed h-full overflow-y-auto"
      >
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <Brain className="w-8 h-8 text-[#6366f1]" />
            <span className="text-[#f1f5f9]">Mastersolis</span>
          </Link>

          <div className="mb-8">
            <p className="text-[#94a3b8] text-sm mb-1">Welcome back,</p>
            <p className="text-[#f1f5f9]">{user?.name}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-[#6366f1] to-[#14b8a6] text-white'
                        : 'text-[#94a3b8] hover:bg-[#334155]'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <Button
            onClick={logout}
            variant="outline"
            className="w-full mt-8 border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
