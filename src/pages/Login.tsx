import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Brain, Users, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import GlassCard from '../components/GlassCard';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 via-transparent to-[#14b8a6]/10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="w-10 h-10 text-[#6366f1]" />
            </motion.div>
            <span className="text-2xl text-[#f1f5f9]">Mastersolis</span>
          </Link>
          <h1 className="text-3xl text-[#f1f5f9] mb-2">Choose Login Type</h1>
          <p className="text-[#94a3b8]">Select your portal to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/login/user">
            <GlassCard className="h-full">
              <div className="text-center p-6">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6366f1]/20">
                  <Users className="w-8 h-8 text-[#6366f1]" />
                </div>
                <h2 className="text-2xl text-[#f1f5f9] mb-2">User Login</h2>
                <p className="text-[#94a3b8] mb-6">
                  Access your candidate portal, take assessments, and track your progress
                </p>
                <Button className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-lg">
                  Continue as User
                </Button>
              </div>
            </GlassCard>
          </Link>

          <Link to="/admin/login">
            <GlassCard className="h-full">
              <div className="text-center p-6">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#14b8a6]/20">
                  <Shield className="w-8 h-8 text-[#14b8a6]" />
                </div>
                <h2 className="text-2xl text-[#f1f5f9] mb-2">Admin Login</h2>
                <p className="text-[#94a3b8] mb-6">
                  Access admin dashboard for developers, HR managers, and examiners
                </p>
                <Button className="w-full bg-gradient-to-r from-[#14b8a6] to-[#6366f1] rounded-lg">
                  Continue as Admin
                </Button>
              </div>
            </GlassCard>
          </Link>
        </div>

        <p className="text-center text-[#94a3b8] mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#6366f1] hover:underline">
            Sign up as user
          </Link>
          {' '}or{' '}
          <Link to="/admin/signup" className="text-[#14b8a6] hover:underline">
            request admin access
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
