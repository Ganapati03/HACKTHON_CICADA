import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, LayoutDashboard, Calendar, FileText, Award, Briefcase, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { useState } from 'react';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className="w-64 bg-gradient-to-b from-[#1e293b] to-[#0f172a] border-r border-[#6366f1]/20 fixed h-full overflow-y-auto z-50 lg:translate-x-0 lg:static"
      >
        <div className="p-4 sm:p-6">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <Link to="/" className="flex items-center gap-2">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-[#6366f1]" />
              <span className="text-sm sm:text-base text-[#f1f5f9]">Mastersolis</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-[#334155] rounded-lg"
            >
              <X className="w-5 h-5 text-[#f1f5f9]" />
            </button>
          </div>

          <div className="mb-6 sm:mb-8">
            <p className="text-[#94a3b8] text-xs sm:text-sm mb-1">Welcome back,</p>
            <p className="text-sm sm:text-base text-[#f1f5f9]">{user?.name}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setIsSidebarOpen(false)}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                      isActive
                        ? 'bg-gradient-to-r from-[#6366f1] to-[#14b8a6] text-white'
                        : 'text-[#94a3b8] hover:bg-[#334155]'
                    }`}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <Button
            onClick={logout}
            variant="outline"
            className="w-full mt-6 sm:mt-8 border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10 text-sm sm:text-base h-9 sm:h-10"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 w-full lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-[#1e293b]/50 backdrop-blur-xl border-b border-[#6366f1]/20 p-3 sm:p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-[#334155] rounded-lg"
            >
              <Menu className="w-5 h-5 text-[#f1f5f9]" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-[#6366f1]" />
              <span className="text-sm text-[#f1f5f9]">Mastersolis</span>
            </Link>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
