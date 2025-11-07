import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Brain, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-[#6366f1]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="w-8 h-8 text-[#6366f1]" />
            </motion.div>
            <span className="text-[#f1f5f9] tracking-wide">Mastersolis Infotech</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-[#94a3b8] hover:text-[#6366f1] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <Link to={user.role !== 'user' ? `/admin/${user.role}` : '/user/dashboard'}>
                <Button className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-full">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-full">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#f1f5f9]"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#1e293b]/95 backdrop-blur-xl border-b border-[#6366f1]/20"
        >
          <div className="px-4 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-[#94a3b8] hover:text-[#6366f1] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <Link 
                to={user.role !== 'user' ? `/admin/${user.role}` : '/user/dashboard'}
                onClick={() => setIsOpen(false)}
              >
                <Button className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-full">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
