import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Brain, BarChart3, Users, FileText, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = {
    developer: [
      { path: '/admin/developer', icon: BarChart3, label: 'Analytics' },
    ],
    hr: [
      { path: '/admin/hr', icon: Users, label: 'HR Dashboard' },
    ],
    examiner: [
      { path: '/admin/examiner', icon: FileText, label: 'Examiner' },
    ],
  };

  const currentNav = navItems[user?.role as keyof typeof navItems] || navItems.developer;

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-gradient-to-b from-[#6366f1]/10 via-[#1e293b] to-[#0f172a] border-r border-[#6366f1]/20 fixed h-full overflow-y-auto"
      >
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <Brain className="w-8 h-8 text-[#6366f1]" />
            <span className="text-[#f1f5f9]">Mastersolis Admin</span>
          </Link>

          <div className="mb-8 p-4 bg-[#6366f1]/10 rounded-lg">
            <p className="text-[#94a3b8] text-sm mb-1">Logged in as</p>
            <p className="text-[#f1f5f9] capitalize">{user?.role}</p>
          </div>

          <nav className="space-y-2">
            {currentNav.map((item) => {
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
      <div className="ml-64 flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="bg-[#1e293b]/50 backdrop-blur-xl border-b border-[#6366f1]/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl text-[#f1f5f9]">Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Summary
              </Button>
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-[#6366f1] to-[#14b8a6]">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
